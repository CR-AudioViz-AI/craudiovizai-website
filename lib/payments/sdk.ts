// CR AudioViz AI - Payment SDK for Apps
// Version: 1.0
// Created: November 5, 2025
// Purpose: Simple payment interface for all apps, games, and tools

import { PaymentService } from './payment-service'

/**
 * PAYMENT SDK FOR APPS
 * 
 * This is the ONLY interface apps need to use for payment/credits.
 * All apps, games, and tools should import this SDK.
 * 
 * Usage Example:
 * ```typescript
 * import { PaymentSDK } from '@/lib/payments/sdk'
 * 
 * // Check if user has enough credits
 * const balance = await PaymentSDK.getCredits(userId)
 * 
 * // Deduct credits for usage
 * const result = await PaymentSDK.deductCredits(userId, 10, 'AI generation')
 * 
 * // Create checkout for more credits
 * const checkout = await PaymentSDK.createCheckout(userId, 'pro', 'stripe')
 * ```
 */

// ============================================================================
// SIMPLE SDK INTERFACE
// ============================================================================

export class PaymentSDK {
  /**
   * Get user's current credit balance
   * 
   * @param userId - User ID
   * @returns Current credit balance
   */
  static async getCredits(userId: string): Promise<number> {
    return await PaymentService.getCreditBalance(userId)
  }

  /**
   * Deduct credits for app usage
   * 
   * @param userId - User ID
   * @param amount - Number of credits to deduct
   * @param description - What the credits were used for
   * @param metadata - Optional additional data
   * @returns Success result with transaction ID
   */
  static async deductCredits(
    userId: string,
    amount: number,
    description: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; error?: string; transactionId?: string }> {
    return await PaymentService.deductCredits(userId, amount, description, metadata || {})
  }

  /**
   * Check if user has enough credits for an operation
   * 
   * @param userId - User ID
   * @param requiredAmount - Credits needed
   * @returns True if user has enough credits
   */
  static async hasCredits(userId: string, requiredAmount: number): Promise<boolean> {
    const balance = await this.getCredits(userId)
    return balance >= requiredAmount
  }

  /**
   * Create checkout session for purchasing credits
   * 
   * @param userId - User ID
   * @param packageId - Package ID ('starter', 'pro', 'premium', 'enterprise')
   * @param provider - Payment provider ('stripe' or 'paypal')
   * @param successUrl - URL to redirect after successful payment
   * @param cancelUrl - URL to redirect if payment cancelled
   * @returns Checkout URL and session ID
   */
  static async createCheckout(
    userId: string,
    packageId: 'starter' | 'pro' | 'premium' | 'enterprise',
    provider: 'stripe' | 'paypal',
    successUrl?: string,
    cancelUrl?: string
  ): Promise<{ url: string; sessionId: string }> {
    const success = successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
    const cancel = cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`

    if (provider === 'stripe') {
      return await PaymentService.createStripeCheckout(userId, packageId, success, cancel)
    } else {
      return await PaymentService.createPayPalCheckout(userId, packageId, success, cancel)
    }
  }

  /**
   * Get available credit packages
   * 
   * @returns Array of available credit packages
   */
  static getCreditPackages() {
    return Object.values(PaymentService.CREDIT_PACKAGES).map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      credits: pkg.credits,
      bonusCredits: pkg.bonusCredits,
      totalCredits: pkg.credits + pkg.bonusCredits,
      price: pkg.priceGents / 100, // Convert cents to dollars
      pricePerCredit: (pkg.priceGents / 100 / (pkg.credits + pkg.bonusCredits)).toFixed(3),
    }))
  }

  /**
   * Get available subscription tiers
   * 
   * @returns Array of subscription tiers
   */
  static getSubscriptionTiers() {
    return Object.values(PaymentService.SUBSCRIPTION_TIERS).map((tier) => ({
      tier: tier.tier,
      credits: tier.credits,
      price: tier.priceMonthly / 100, // Convert cents to dollars
      pricePerCredit: (tier.priceMonthly / 100 / tier.credits).toFixed(3),
    }))
  }

  /**
   * Get user's credit transaction history
   * 
   * @param userId - User ID
   * @param limit - Number of transactions to return (default: 50)
   * @returns Array of credit transactions
   */
  static async getCreditHistory(userId: string, limit: number = 50) {
    return await PaymentService.getCreditHistory(userId, limit)
  }

  /**
   * Get user's active subscription
   * 
   * @param userId - User ID
   * @returns Active subscription or null
   */
  static async getSubscription(userId: string) {
    return await PaymentService.getActiveSubscription(userId)
  }

  /**
   * Cancel user's subscription
   * 
   * @param userId - User ID
   * @returns Success result
   */
  static async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    return await PaymentService.cancelSubscription(userId)
  }
}

// ============================================================================
// REACT HOOKS (Optional - for Next.js apps)
// ============================================================================

/**
 * React hook for getting credit balance
 * 
 * Usage:
 * ```typescript
 * const { balance, loading, error, refresh } = useCreditBalance(userId)
 * ```
 */
export function useCreditBalance(userId: string | undefined) {
  const [balance, setBalance] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const bal = await PaymentSDK.getCredits(userId)
      setBalance(bal)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  return { balance, loading, error, refresh }
}

// Note: Import React if using hooks
import React from 'react'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format credits for display
 */
export function formatCredits(credits: number): string {
  return credits.toLocaleString()
}

/**
 * Format price for display
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

/**
 * Calculate cost in credits for a given operation
 */
export function calculateCost(operationType: string): number {
  // Credit costs for different operations
  const costs: Record<string, number> = {
    'ai-generation': 10,
    'ai-image': 20,
    'document-creation': 5,
    'translation': 8,
    'video-generation': 50,
    'audio-generation': 15,
    'game-session': 2,
  }

  return costs[operationType] || 1
}

// ============================================================================
// EXPORTS
// ============================================================================

export default PaymentSDK

// Also export types for TypeScript apps
export type {
  CreditPackage,
  CheckoutSession,
  SubscriptionTier,
  PaymentResult,
} from './payment-service'
