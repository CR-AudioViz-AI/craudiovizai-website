// CR AudioViz AI - Unified Payment Service
// Version: 1.0
// Created: November 5, 2025
// Purpose: Central payment orchestration for Stripe + PayPal

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

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
// TYPES
// ============================================================================

export interface CreditPackage {
  id: string
  name: string
  credits: number
  priceGents: number
  bonusCredits: number
  stripePriceId?: string
  paypalPlanId?: string
}

export interface CheckoutSession {
  url: string
  sessionId: string
  provider: 'stripe' | 'paypal'
}

export interface SubscriptionTier {
  tier: 'starter' | 'pro' | 'enterprise'
  credits: number
  priceMonthly: number
  stripePriceId?: string
  paypalPlanId?: string
}

export interface PaymentResult {
  success: boolean
  error?: string
  transactionId?: string
}

// ============================================================================
// CREDIT PACKAGES
// ============================================================================

export const CREDIT_PACKAGES: Record<string, CreditPackage> = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    credits: 100,
    priceGents: 1000, // $10.00
    bonusCredits: 0,
    stripePriceId: process.env.STRIPE_PRICE_STARTER,
    paypalPlanId: process.env.PAYPAL_PLAN_STARTER,
  },
  pro: {
    id: 'pro',
    name: 'Pro Pack',
    credits: 500,
    priceGents: 4500, // $45.00
    bonusCredits: 50,
    stripePriceId: process.env.STRIPE_PRICE_PRO,
    paypalPlanId: process.env.PAYPAL_PLAN_PRO,
  },
  premium: {
    id: 'premium',
    name: 'Premium Pack',
    credits: 1000,
    priceGents: 8000, // $80.00
    bonusCredits: 150,
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM,
    paypalPlanId: process.env.PAYPAL_PLAN_PREMIUM,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 5000,
    priceGents: 35000, // $350.00
    bonusCredits: 1000,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE,
    paypalPlanId: process.env.PAYPAL_PLAN_ENTERPRISE,
  },
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    tier: 'starter',
    credits: 200,
    priceMonthly: 1900, // $19.00/month
    stripePriceId: process.env.STRIPE_SUB_STARTER,
    paypalPlanId: process.env.PAYPAL_SUB_STARTER,
  },
  pro: {
    tier: 'pro',
    credits: 750,
    priceMonthly: 4900, // $49.00/month
    stripePriceId: process.env.STRIPE_SUB_PRO,
    paypalPlanId: process.env.PAYPAL_SUB_PRO,
  },
  enterprise: {
    tier: 'enterprise',
    credits: 3000,
    priceMonthly: 14900, // $149.00/month
    stripePriceId: process.env.STRIPE_SUB_ENTERPRISE,
    paypalPlanId: process.env.PAYPAL_SUB_ENTERPRISE,
  },
}

// ============================================================================
// PAYMENT SERVICE CLASS
// ============================================================================

export class PaymentService {
  // ============================================================================
  // CREDIT OPERATIONS
  // ============================================================================

  /**
   * Get user's current credit balance
   */
  static async getCreditBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', userId)
      .single()

    if (error) throw new Error(`Failed to get credit balance: ${error.message}`)
    return data?.credits_balance || 0
  }

  /**
   * Deduct credits from user account with validation
   */
  static async deductCredits(
    userId: string,
    amount: number,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<PaymentResult> {
    try {
      // Validate amount
      if (amount <= 0) {
        return { success: false, error: 'Invalid credit amount' }
      }

      // Check balance
      const balance = await this.getCreditBalance(userId)
      if (balance < amount) {
        return { success: false, error: 'Insufficient credits' }
      }

      // Create transaction (trigger will auto-update balance)
      const { data, error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: -amount,
          transaction_type: 'spend',
          description,
          metadata,
        })
        .select('id')
        .single()

      if (error) throw error

      return {
        success: true,
        transactionId: data.id,
      }
    } catch (error: any) {
      console.error('Failed to deduct credits:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Add credits to user account
   */
  static async addCredits(
    userId: string,
    amount: number,
    type: 'purchase' | 'subscription' | 'bonus' | 'refund' | 'admin_adjustment',
    description: string,
    paymentId?: string,
    provider?: 'stripe' | 'paypal',
    metadata: Record<string, any> = {}
  ): Promise<PaymentResult> {
    try {
      if (amount <= 0) {
        return { success: false, error: 'Invalid credit amount' }
      }

      const insertData: any = {
        user_id: userId,
        amount,
        transaction_type: type,
        description,
        metadata,
      }

      if (provider === 'stripe' && paymentId) {
        insertData.stripe_payment_id = paymentId
      } else if (provider === 'paypal' && paymentId) {
        insertData.paypal_payment_id = paymentId
      }

      const { data, error } = await supabase
        .from('credit_transactions')
        .insert(insertData)
        .select('id')
        .single()

      if (error) throw error

      return {
        success: true,
        transactionId: data.id,
      }
    } catch (error: any) {
      console.error('Failed to add credits:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get credit transaction history
   */
  static async getCreditHistory(userId: string, limit: number = 50) {
    const { data, error} = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Failed to get credit history: ${error.message}`)
    return data || []
  }

  // ============================================================================
  // STRIPE OPERATIONS
  // ============================================================================

  /**
   * Create Stripe checkout session for credit purchase
   */
  static async createStripeCheckout(
    userId: string,
    packageId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    const pkg = CREDIT_PACKAGES[packageId]
    if (!pkg || !pkg.stripePriceId) {
      throw new Error('Invalid credit package')
    }

    // Get or create Stripe customer
    const customerId = await this.getOrCreateStripeCustomer(userId)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price: pkg.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        packageId,
        credits: pkg.credits + pkg.bonusCredits,
      },
    })

    return {
      url: session.url!,
      sessionId: session.id,
      provider: 'stripe',
    }
  }

  /**
   * Create Stripe subscription
   */
  static async createStripeSubscription(
    userId: string,
    tier: 'starter' | 'pro' | 'enterprise'
  ): Promise<string> {
    const subscription = SUBSCRIPTION_TIERS[tier]
    if (!subscription || !subscription.stripePriceId) {
      throw new Error('Invalid subscription tier')
    }

    const customerId = await this.getOrCreateStripeCustomer(userId)

    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: subscription.stripePriceId }],
      metadata: {
        userId,
        tier,
        credits: subscription.credits,
      },
    })

    // Save subscription to database
    await supabase.from('subscriptions').insert({
      user_id: userId,
      tier,
      status: 'active',
      payment_method: 'stripe',
      stripe_subscription_id: stripeSubscription.id,
      stripe_price_id: subscription.stripePriceId,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000),
    })

    return stripeSubscription.id
  }

  /**
   * Get or create Stripe customer
   */
  private static async getOrCreateStripeCustomer(userId: string): Promise<string> {
    // Check if customer exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (!profile) throw new Error('User not found')

    if (profile.stripe_customer_id) {
      return profile.stripe_customer_id
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: { userId },
    })

    // Save customer ID
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId)

    return customer.id
  }

  // ============================================================================
  // PAYPAL OPERATIONS (Stub - will be implemented with PayPal SDK)
  // ============================================================================

  /**
   * Create PayPal checkout
   */
  static async createPayPalCheckout(
    userId: string,
    packageId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    // This will be implemented with PayPal SDK in paypal-client.ts
    throw new Error('PayPal integration pending - use Stripe for now')
  }

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================================================

  /**
   * Get user's active subscription
   */
  static async getActiveSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get subscription: ${error.message}`)
    }

    return data
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string): Promise<PaymentResult> {
    try {
      const subscription = await this.getActiveSubscription(userId)
      if (!subscription) {
        return { success: false, error: 'No active subscription' }
      }

      if (subscription.payment_method === 'stripe' && subscription.stripe_subscription_id) {
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
      }

      // Update database
      await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', subscription.id)

      return { success: true }
    } catch (error: any) {
      console.error('Failed to cancel subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  /**
   * Log payment transaction
   */
  static async logPaymentTransaction(
    userId: string,
    amountCents: number,
    paymentMethod: 'stripe' | 'paypal',
    status: 'pending' | 'succeeded' | 'failed',
    metadata: Record<string, any> = {}
  ): Promise<string> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        amount_cents: amountCents,
        payment_method: paymentMethod,
        status,
        metadata,
      })
      .select('id')
      .single()

    if (error) throw error
    return data.id
  }
}
