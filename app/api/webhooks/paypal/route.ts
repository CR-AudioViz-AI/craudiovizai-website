import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createClient()

    // PayPal webhook events
    const eventType = body.event_type

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const captureId = body.resource.id
        const customId = body.resource.custom_id
        
        if (!customId) break

        const { userId, type, credits } = JSON.parse(customId)

        // Record payment
        await supabase.from('payment_transactions').insert({
          user_id: userId,
          amount_cents: Math.round(parseFloat(body.resource.amount.value) * 100),
          payment_method: 'paypal',
          paypal_transaction_id: captureId,
          status: 'succeeded',
          description: `${type === 'subscription' ? 'Subscription' : 'Credits'} purchase via PayPal`,
        })

        // Add credits
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: parseInt(credits),
          transaction_type: type === 'subscription' ? 'subscription' : 'purchase',
          description: `${type === 'subscription' ? 'Monthly subscription' : 'One-time purchase'} - ${credits} credits`,
          paypal_payment_id: captureId,
        })

        if (type === 'subscription') {
          const tier = 
            parseInt(credits) === 200 ? 'starter' :
            parseInt(credits) === 750 ? 'pro' :
            'enterprise'

          await supabase.from('subscriptions').upsert({
            user_id: userId,
            tier,
            status: 'active',
            paypal_subscription_id: body.resource.supplementary_data?.related_ids?.order_id,
          })

          await supabase
            .from('profiles')
            .update({ subscription_tier: tier })
            .eq('id', userId)
        }

        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        const subscriptionId = body.resource.id

        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
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
        break
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        const refundId = body.resource.id
        const customId = body.resource.custom_id
        
        if (!customId) break

        const { userId, credits } = JSON.parse(customId)

        // Deduct refunded credits
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: -parseInt(credits),
          transaction_type: 'refund',
          description: `PayPal refund - ${credits} credits removed`,
          paypal_payment_id: refundId,
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
