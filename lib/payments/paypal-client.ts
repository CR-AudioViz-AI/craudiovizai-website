// CR AudioViz AI - PayPal Client
// Version: 1.0
// Created: November 5, 2025
// Purpose: PayPal SDK integration for checkout and payments

import paypal from '@paypal/checkout-server-sdk'
import { createClient } from '@supabase/supabase-js'
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

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
// PAYPAL ENVIRONMENT SETUP
// ============================================================================

function getPayPalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const mode = process.env.PAYPAL_MODE || 'sandbox'

  if (mode === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret)
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

const paypalClient = new paypal.core.PayPalHttpClient(getPayPalEnvironment())

// ============================================================================
// PAYPAL CLIENT CLASS
// ============================================================================

export class PayPalClient {
  /**
   * Create PayPal order for credit purchase
   */
  static async createOrder(
    userId: string,
    packageId: string,
    credits: number,
    amountUSD: number,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ orderId: string; approvalUrl: string }> {
    try {
      const request = new paypal.orders.OrdersCreateRequest()
      request.prefer('return=representation')
      request.requestBody({
        intent: 'CAPTURE',
        application_context: {
          brand_name: 'CR AudioViz AI',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
        purchase_units: [
          {
            reference_id: userId,
            description: `${credits} Credits`,
            custom_id: JSON.stringify({
              userId,
              packageId,
              credits,
              type: 'purchase',
            }),
            amount: {
              currency_code: 'USD',
              value: amountUSD.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: amountUSD.toFixed(2),
                },
              },
            },
            items: [
              {
                name: `${credits} Credits`,
                description: `CR AudioViz AI Credit Package`,
                quantity: '1',
                unit_amount: {
                  currency_code: 'USD',
                  value: amountUSD.toFixed(2),
                },
                category: 'DIGITAL_GOODS',
              },
            ],
          },
        ],
      })

      const response = await paypalClient.execute(request)
      const order = response.result

      // Find approval URL
      const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href

      if (!approvalUrl) {
        throw new Error('No approval URL returned from PayPal')
      }

      // Log order creation
      await supabase.from('payment_transactions').insert({
        user_id: userId,
        amount_cents: Math.round(amountUSD * 100),
        payment_method: 'paypal',
        paypal_order_id: order.id,
        status: 'pending',
        description: `${credits} credits purchase`,
        metadata: {
          packageId,
          credits,
        },
      })

      return {
        orderId: order.id!,
        approvalUrl,
      }
    } catch (error: any) {
      logError(\'PayPal order creation failed:\', error)
      throw new Error(`PayPal order creation failed: ${error.message}`)
    }
  }

  /**
   * Capture PayPal order after approval
   */
  static async captureOrder(orderId: string): Promise<{
    success: boolean
    captureId?: string
    error?: string
  }> {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId)
      request.requestBody({})

      const response = await paypalClient.execute(request)
      const order = response.result

      if (order.status === 'COMPLETED') {
        const capture = order.purchase_units?.[0]?.payments?.captures?.[0]

        if (!capture) {
          throw new Error('No capture found in order')
        }

        // Update payment transaction
        await supabase
          .from('payment_transactions')
          .update({
            status: 'succeeded',
            paypal_transaction_id: capture.id,
          })
          .eq('paypal_order_id', orderId)

        return {
          success: true,
          captureId: capture.id,
        }
      } else {
        return {
          success: false,
          error: `Order status: ${order.status}`,
        }
      }
    } catch (error: any) {
      logError(\'PayPal capture failed:\', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Create PayPal subscription
   */
  static async createSubscription(
    userId: string,
    planId: string,
    tier: string
  ): Promise<{
    subscriptionId: string
    approvalUrl: string
  }> {
    try {
      const request = new paypal.subscriptions.SubscriptionsCreateRequest()
      request.requestBody({
        plan_id: planId,
        application_context: {
          brand_name: 'CR AudioViz AI',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/subscription/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/subscription/cancel`,
        },
        custom_id: JSON.stringify({
          userId,
          tier,
          type: 'subscription',
        }),
      })

      const response = await paypalClient.execute(request)
      const subscription = response.result

      const approvalUrl = subscription.links?.find((link: any) => link.rel === 'approve')?.href

      if (!approvalUrl) {
        throw new Error('No approval URL returned from PayPal')
      }

      // Save subscription to database
      await supabase.from('subscriptions').insert({
        user_id: userId,
        tier,
        status: 'active',
        payment_method: 'paypal',
        paypal_subscription_id: subscription.id,
        paypal_plan_id: planId,
      })

      return {
        subscriptionId: subscription.id!,
        approvalUrl,
      }
    } catch (error: any) {
      logError(\'PayPal subscription creation failed:\', error)
      throw new Error(`PayPal subscription creation failed: ${error.message}`)
    }
  }

  /**
   * Cancel PayPal subscription
   */
  static async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    try {
      const request = new paypal.subscriptions.SubscriptionsCancelRequest(subscriptionId)
      request.requestBody({
        reason: reason || 'Customer requested cancellation',
      })

      await paypalClient.execute(request)

      // Update database
      await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('paypal_subscription_id', subscriptionId)

      return true
    } catch (error: any) {
      logError(\'PayPal subscription cancellation failed:\', error)
      return false
    }
  }

  /**
   * Verify PayPal webhook signature
   */
  static async verifyWebhookSignature(
    headers: Record<string, string>,
    body: any
  ): Promise<boolean> {
    try {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID!

      // PayPal webhook verification
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: headers['paypal-auth-algo'],
          cert_url: headers['paypal-cert-url'],
          transmission_id: headers['paypal-transmission-id'],
          transmission_sig: headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
          webhook_id: webhookId,
          webhook_event: body,
        }),
      }

      const environment = getPayPalEnvironment()
      const verifyUrl = `${environment.baseUrl}/v1/notifications/verify-webhook-signature`

      const response = await fetch(verifyUrl, request)
      const result = await response.json()

      return result.verification_status === 'SUCCESS'
    } catch (error: unknown) {
      logError(\'PayPal webhook verification failed:\', error)
      return false
    }
  }

  /**
   * Get order details
   */
  static async getOrderDetails(orderId: string) {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId)
      const response = await paypalClient.execute(request)
      return response.result
    } catch (error: any) {
      logError(\'Failed to get PayPal order:\', error)
      throw error
    }
  }

  /**
   * Refund capture
   */
  static async refundCapture(
    captureId: string,
    amountUSD?: number,
    note?: string
  ): Promise<boolean> {
    try {
      const request = new paypal.payments.CapturesRefundRequest(captureId)

      if (amountUSD) {
        request.requestBody({
          amount: {
            value: amountUSD.toFixed(2),
            currency_code: 'USD',
          },
          note_to_payer: note || 'Refund processed',
        })
      }

      await paypalClient.execute(request)
      return true
    } catch (error: any) {
      logError(\'PayPal refund failed:\', error)
      return false
    }
  }
}

export default PayPalClient
