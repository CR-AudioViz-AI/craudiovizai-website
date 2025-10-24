// CR AudioViz AI - Enhanced Production Stripe Webhook Handler
// Session: 2025-10-24 14:32:15 UTC
// Version: 2.0 - Production Ready with Full Integration

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Initialize Supabase with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// ============================================================================
// LOGGING SYSTEM
// ============================================================================

interface WebhookLog {
  event_id: string
  event_type: string
  status: 'processing' | 'success' | 'failed'
  metadata?: any
  error?: string
  processing_time_ms?: number
}

async function logWebhookEvent(log: WebhookLog): Promise<void> {
  try {
    await supabase
      .from('webhook_logs')
      .insert({
        ...log,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}

// ============================================================================
// IDEMPOTENCY CHECK
// ============================================================================

async function checkIdempotency(eventId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('webhook_logs')
      .select('event_id')
      .eq('event_id', eventId)
      .eq('status', 'success')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Idempotency check error:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Idempotency check failed:', error)
    return false
  }
}

// ============================================================================
// CREDIT MANAGEMENT SYSTEM
// ============================================================================

interface CreditPackage {
  priceId: string
  credits: number
  name: string
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { priceId: 'price_starter_100', credits: 100, name: 'Starter Pack' },
  { priceId: 'price_pro_500', credits: 500, name: 'Pro Pack' },
  { priceId: 'price_premium_1000', credits: 1000, name: 'Premium Pack' },
  { priceId: 'price_enterprise_5000', credits: 5000, name: 'Enterprise Pack' },
]

async function addCreditsToUser(userId: string, credits: number, source: string): Promise<void> {
  try {
    // Get current credits
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const currentCredits = userData?.credits || 0
    const newCredits = currentCredits + credits

    // Update credits
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // Log credit transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: credits,
        balance_after: newCredits,
        transaction_type: 'purchase',
        source: source,
        created_at: new Date().toISOString()
      })

    console.log(`✅ Added ${credits} credits to user ${userId}. New balance: ${newCredits}`)
  } catch (error) {
    console.error('Failed to add credits:', error)
    throw error
  }
}

async function deductCreditsFromUser(userId: string, credits: number, reason: string): Promise<void> {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const currentCredits = userData?.credits || 0
    const newCredits = Math.max(0, currentCredits - credits)

    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) throw updateError

    await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -credits,
        balance_after: newCredits,
        transaction_type: 'deduction',
        source: reason,
        created_at: new Date().toISOString()
      })

    console.log(`⚠️ Deducted ${credits} credits from user ${userId}. New balance: ${newCredits}`)
  } catch (error) {
    console.error('Failed to deduct credits:', error)
    throw error
  }
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

interface SubscriptionPlan {
  priceId: string
  tier: string
  monthlyCredits: number
  features: string[]
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    priceId: 'price_basic_monthly',
    tier: 'basic',
    monthlyCredits: 200,
    features: ['basic_tools', 'email_support']
  },
  {
    priceId: 'price_pro_monthly',
    tier: 'pro',
    monthlyCredits: 1000,
    features: ['all_tools', 'priority_support', 'api_access']
  },
  {
    priceId: 'price_premium_monthly',
    tier: 'premium',
    monthlyCredits: 5000,
    features: ['all_tools', 'priority_support', 'api_access', 'white_label', 'dedicated_support']
  },
]

async function updateUserSubscription(
  userId: string,
  subscriptionId: string,
  priceId: string,
  status: string
): Promise<void> {
  try {
    const plan = SUBSCRIPTION_PLANS.find(p => p.priceId === priceId)
    
    const { error } = await supabase
      .from('users')
      .update({
        stripe_subscription_id: subscriptionId,
        subscription_tier: plan?.tier || 'free',
        subscription_status: status,
        monthly_credits: plan?.monthlyCredits || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    // If subscription is active, add monthly credits
    if (status === 'active' && plan) {
      await addCreditsToUser(userId, plan.monthlyCredits, `subscription_${plan.tier}`)
    }

    console.log(`✅ Updated subscription for user ${userId}: ${status}`)
  } catch (error) {
    console.error('Failed to update subscription:', error)
    throw error
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  console.log('💳 Processing checkout completion:', session.id)

  const userId = session.client_reference_id || session.metadata?.user_id
  if (!userId) {
    throw new Error('No user ID found in checkout session')
  }

  // Handle one-time credit purchase
  if (session.mode === 'payment') {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    
    for (const item of lineItems.data) {
      const priceId = item.price?.id
      const creditPackage = CREDIT_PACKAGES.find(p => p.priceId === priceId)
      
      if (creditPackage) {
        await addCreditsToUser(userId, creditPackage.credits, 'one_time_purchase')
      }
    }
  }

  // Handle subscription
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const priceId = subscription.items.data[0]?.price.id
    
    if (priceId) {
      await updateUserSubscription(userId, subscription.id, priceId, subscription.status)
    }
  }

  // Update payment record
  await supabase
    .from('payments')
    .insert({
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent as string,
      amount: session.amount_total! / 100,
      currency: session.currency,
      status: 'completed',
      created_at: new Date().toISOString()
    })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  console.log('🆕 Processing subscription creation:', subscription.id)

  const userId = subscription.metadata?.user_id
  if (!userId) {
    throw new Error('No user ID found in subscription metadata')
  }

  const priceId = subscription.items.data[0]?.price.id
  if (priceId) {
    await updateUserSubscription(userId, subscription.id, priceId, subscription.status)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  console.log('🔄 Processing subscription update:', subscription.id)

  // Find user by subscription ID
  const { data: userData, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (error || !userData) {
    throw new Error('User not found for subscription')
  }

  const priceId = subscription.items.data[0]?.price.id
  if (priceId) {
    await updateUserSubscription(userData.id, subscription.id, priceId, subscription.status)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  console.log('❌ Processing subscription deletion:', subscription.id)

  const { data: userData, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (error || !userData) {
    throw new Error('User not found for subscription')
  }

  await supabase
    .from('users')
    .update({
      stripe_subscription_id: null,
      subscription_tier: 'free',
      subscription_status: 'cancelled',
      monthly_credits: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', userData.id)
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  console.log('💰 Processing paid invoice:', invoice.id)

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const { data: userData, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (error || !userData) {
    console.error('User not found for invoice')
    return
  }

  // Add monthly credits for recurring subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0]?.price.id
  const plan = SUBSCRIPTION_PLANS.find(p => p.priceId === priceId)

  if (plan) {
    await addCreditsToUser(userData.id, plan.monthlyCredits, `monthly_billing_${plan.tier}`)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.log('⚠️ Processing failed invoice:', invoice.id)

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const { data: userData, error } = await supabase
    .from('users')
    .select('id, email')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (error || !userData) return

  // Update subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('id', userData.id)

  // TODO: Send email notification to user
  console.log(`📧 Payment failed notification needed for user: ${userData.email}`)
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('✅ Processing successful payment intent:', paymentIntent.id)

  const userId = paymentIntent.metadata?.user_id
  if (!userId) return

  await supabase
    .from('payments')
    .upsert({
      user_id: userId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'succeeded',
      created_at: new Date().toISOString()
    })
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('❌ Processing failed payment intent:', paymentIntent.id)

  const userId = paymentIntent.metadata?.user_id
  if (!userId) return

  await supabase
    .from('payments')
    .upsert({
      user_id: userId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'failed',
      error_message: paymentIntent.last_payment_error?.message,
      created_at: new Date().toISOString()
    })
}

async function handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
  console.log('👤 Processing customer creation:', customer.id)

  const userId = customer.metadata?.user_id
  if (!userId) return

  await supabase
    .from('users')
    .update({
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
}

async function handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
  console.log('👤 Processing customer update:', customer.id)

  // Update customer details in database
  await supabase
    .from('users')
    .update({
      stripe_customer_email: customer.email,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customer.id)
}

async function handleCustomerDeleted(customer: Stripe.Customer): Promise<void> {
  console.log('🗑️ Processing customer deletion:', customer.id)

  await supabase
    .from('users')
    .update({
      stripe_customer_id: null,
      stripe_subscription_id: null,
      subscription_tier: 'free',
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customer.id)
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  console.log('💸 Processing charge refund:', charge.id)

  const paymentIntent = charge.payment_intent as string
  if (!paymentIntent) return

  const { data: paymentData } = await supabase
    .from('payments')
    .select('user_id, amount')
    .eq('stripe_payment_intent_id', paymentIntent)
    .single()

  if (!paymentData) return

  // Deduct credits equivalent to refunded amount
  // Assuming $1 = 10 credits (adjust based on your pricing)
  const creditsToDeduct = Math.floor(paymentData.amount * 10)
  
  await deductCreditsFromUser(paymentData.user_id, creditsToDeduct, 'refund')

  await supabase
    .from('payments')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent)
}

async function handleDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
  console.log('⚖️ Processing dispute creation:', dispute.id)

  const chargeId = dispute.charge as string
  const charge = await stripe.charges.retrieve(chargeId)
  const paymentIntent = charge.payment_intent as string

  if (!paymentIntent) return

  const { data: paymentData } = await supabase
    .from('payments')
    .select('user_id')
    .eq('stripe_payment_intent_id', paymentIntent)
    .single()

  if (!paymentData) return

  // Log dispute for admin review
  await supabase
    .from('disputes')
    .insert({
      user_id: paymentData.user_id,
      stripe_dispute_id: dispute.id,
      amount: dispute.amount / 100,
      reason: dispute.reason,
      status: dispute.status,
      created_at: new Date().toISOString()
    })

  // TODO: Send notification to admin team
  console.log('⚠️ ADMIN ALERT: New dispute created for review')
}

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let event: Stripe.Event
  let eventLog: WebhookLog

  try {
    // Get raw body and signature
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error('❌ Webhook signature verification failed:', error.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log(`\n🔔 Webhook received: ${event.type} (${event.id})`)

    // Check idempotency
    const alreadyProcessed = await checkIdempotency(event.id)
    if (alreadyProcessed) {
      console.log('⏭️ Event already processed, skipping...')
      return NextResponse.json({ 
        received: true, 
        message: 'Event already processed' 
      })
    }

    // Initialize event log
    eventLog = {
      event_id: event.id,
      event_type: event.type,
      status: 'processing',
      metadata: {
        api_version: event.api_version,
        created: event.created,
      }
    }

    await logWebhookEvent(eventLog)

    // Handle different event types
    switch (event.type) {
      // Checkout Events
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      // Subscription Events
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      // Invoice Events
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      // Payment Intent Events
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      // Customer Events
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer)
        break

      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object as Stripe.Customer)
        break

      // Charge Events
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      // Dispute Events
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute)
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    // Log success
    const processingTime = Date.now() - startTime
    await logWebhookEvent({
      event_id: event.id,
      event_type: event.type,
      status: 'success',
      processing_time_ms: processingTime
    })

    console.log(`✅ Event processed successfully in ${processingTime}ms\n`)

    return NextResponse.json({ 
      received: true,
      event_id: event.id,
      processing_time_ms: processingTime
    })

  } catch (error: any) {
    console.error('❌ Webhook processing error:', error)

    const processingTime = Date.now() - startTime

    // Log error
    if (event!) {
      await logWebhookEvent({
        event_id: event.id,
        event_type: event.type,
        status: 'failed',
        error: error.message,
        processing_time_ms: processingTime
      })
    }

    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
