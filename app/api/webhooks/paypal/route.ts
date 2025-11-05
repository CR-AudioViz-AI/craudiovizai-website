// CR AudioViz AI - PayPal Webhook Handler (Enhanced)
// Version: 2.0
// Created: November 5, 2025
// Purpose: Production-ready PayPal webhook with signature verification

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PayPalClient } from '@/lib/payments/paypal-client'
import { PaymentService } from '@/lib/payments/payment-service'

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse request body
    const body = await request.json()
    const eventType = body.event_type
    const eventId = body.id

    // Log webhook receipt
    console.log(`[PayPal Webhook] Received: ${eventType} (${eventId})`)

    // Check idempotency
    const alreadyProcessed = await checkIdempotency(eventId)
    if (alreadyProcessed) {
      console.log(`[PayPal Webhook] Already processed: ${eventId}`)
      return NextResponse.json({ received: true, status: 'already_processed' })
    }

    // Verify webhook signature
    const headers = {
      'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
      'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
      'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
      'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
      'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
    }

    const isValid = await PayPalClient.verifyWebhookSignature(headers, body)
    if (!isValid) {
      console.error(`[PayPal Webhook] Invalid signature: ${eventId}`)
      await logWebhookEvent({
        event_id: eventId,
        event_type: eventType,
        provider: 'paypal',
        status: 'failed',
        error: 'Invalid webhook signature',
        processing_time_ms: Date.now() - startTime,
      })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Log processing start
    await logWebhookEvent({
      event_id: eventId,
      event_type: eventType,
      provider: 'paypal',
      status: 'processing',
      metadata: { resource_id: body.resource?.id },
    })

    // Process event
    await processWebhookEvent(eventType, body, eventId)

    // Log success
    await logWebhookEvent({
      event_id: eventId,
      event_type: eventType,
      provider: 'paypal',
      status: 'success',
      processing_time_ms: Date.now() - startTime,
    })

    return NextResponse.json({ received: true, status: 'success' })
  } catch (error: any) {
    console.error('[PayPal Webhook] Processing error:', error)

    // Log failure
    try {
      const body = await request.json()
      await logWebhookEvent({
        event_id: body.id,
        event_type: body.event_type,
        provider: 'paypal',
        status: 'failed',
        error: error.message,
        processing_time_ms: Date.now() - startTime,
      })
    } catch {}

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// ============================================================================
// EVENT PROCESSING
// ============================================================================

async function processWebhookEvent(eventType: string, body: any, eventId: string) {
  switch (eventType) {
    // ========================================================================
    // PAYMENT EVENTS
    // ========================================================================

    case 'PAYMENT.CAPTURE.COMPLETED': {
      const captureId = body.resource.id
      const customId = body.resource.custom_id

      if (!customId) {
        console.warn(`[PayPal Webhook] No custom_id in capture: ${captureId}`)
        break
      }

      const { userId, credits, type, packageId } = JSON.parse(customId)
      const amountValue = parseFloat(body.resource.amount.value)
      const amountCents = Math.round(amountValue * 100)

      // Record payment
      await supabase.from('payment_transactions').upsert({
        user_id: userId,
        amount_cents: amountCents,
        payment_method: 'paypal',
        paypal_transaction_id: captureId,
        status: 'succeeded',
        description: `${type === 'subscription' ? 'Subscription' : 'Credits'} purchase via PayPal`,
        metadata: {
          packageId,
          credits,
          type,
        },
      }, {
        onConflict: 'paypal_transaction_id',
      })

      // Add credits to user
      await PaymentService.addCredits(
        userId,
        parseInt(credits),
        type === 'subscription' ? 'subscription' : 'purchase',
        `${type === 'subscription' ? 'Monthly subscription' : 'One-time purchase'} - ${credits} credits`,
        captureId,
        'paypal',
        {
          packageId,
          amount: amountValue,
        }
      )

      // If subscription, update subscription status
      if (type === 'subscription') {
        const tier =
          parseInt(credits) === 200 ? 'starter' :
          parseInt(credits) === 750 ? 'pro' :
          'enterprise'

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          tier,
          status: 'active',
          payment_method: 'paypal',
          paypal_subscription_id: body.resource.supplementary_data?.related_ids?.order_id,
        }, {
          onConflict: 'user_id',
        })

        await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId)
      }

      console.log(`[PayPal Webhook] Payment completed: ${captureId}, ${credits} credits added to user ${userId}`)
      break
    }

    case 'PAYMENT.CAPTURE.DENIED':
    case 'PAYMENT.CAPTURE.DECLINED': {
      const captureId = body.resource.id

      await supabase
        .from('payment_transactions')
        .update({ status: 'failed', error_message: 'Payment denied/declined' })
        .eq('paypal_transaction_id', captureId)

      console.log(`[PayPal Webhook] Payment denied/declined: ${captureId}`)
      break
    }

    case 'PAYMENT.CAPTURE.REFUNDED': {
      const refundId = body.resource.id
      const customId = body.resource.custom_id

      if (!customId) break

      const { userId, credits } = JSON.parse(customId)

      // Deduct refunded credits
      await PaymentService.addCredits(
        userId,
        -parseInt(credits),
        'refund',
        `PayPal refund - ${credits} credits removed`,
        refundId,
        'paypal'
      )

      console.log(`[PayPal Webhook] Refund processed: ${refundId}, ${credits} credits deducted from user ${userId}`)
      break
    }

    // ========================================================================
    // SUBSCRIPTION EVENTS
    // ========================================================================

    case 'BILLING.SUBSCRIPTION.ACTIVATED': {
      const subscriptionId = body.resource.id
      const customId = body.resource.custom_id

      if (!customId) break

      const { userId, tier } = JSON.parse(customId)

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        tier,
        status: 'active',
        payment_method: 'paypal',
        paypal_subscription_id: subscriptionId,
      }, {
        onConflict: 'paypal_subscription_id',
      })

      await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId)

      console.log(`[PayPal Webhook] Subscription activated: ${subscriptionId} for user ${userId}`)
      break
    }

    case 'BILLING.SUBSCRIPTION.CANCELLED':
    case 'BILLING.SUBSCRIPTION.SUSPENDED': {
      const subscriptionId = body.resource.id

      await supabase
        .from('subscriptions')
        .update({
          status: eventType.includes('CANCELLED') ? 'cancelled' : 'paused',
          cancelled_at: new Date().toISOString(),
        })
        .eq('paypal_subscription_id', subscriptionId)

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('paypal_subscription_id', subscriptionId)
        .single()

      if (sub) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', sub.user_id)
      }

      console.log(`[PayPal Webhook] Subscription ${eventType.includes('CANCELLED') ? 'cancelled' : 'suspended'}: ${subscriptionId}`)
      break
    }

    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
      const subscriptionId = body.resource.id

      await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('paypal_subscription_id', subscriptionId)

      console.log(`[PayPal Webhook] Subscription payment failed: ${subscriptionId}`)
      break
    }

    // ========================================================================
    // UNHANDLED EVENTS
    // ========================================================================

    default:
      console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`)
  }
}

// ============================================================================
// HELPER FUNCTIONS
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

async function logWebhookEvent(log: {
  event_id: string
  event_type: string
  provider: string
  status: string
  metadata?: any
  error?: string
  processing_time_ms?: number
}): Promise<void> {
  try {
    await supabase
      .from('webhook_logs')
      .upsert(log, {
        onConflict: 'event_id',
      })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}
