import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, type, credits } = session.metadata!

      // Record payment
      await supabase.from('payment_transactions').insert({
        user_id: userId,
        amount_cents: session.amount_total!,
        payment_method: 'stripe',
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'succeeded',
        description: `${type === 'subscription' ? 'Subscription' : 'Credits'} purchase`,
      })

      if (type === 'subscription') {
        // Create/update subscription
        const tier = 
          parseInt(credits) === 200 ? 'starter' :
          parseInt(credits) === 750 ? 'pro' :
          'enterprise'

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          tier,
          status: 'active',
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
        })

        // Update profile
        await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId)
      }

      // Add credits
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: parseInt(credits),
        transaction_type: type === 'subscription' ? 'subscription' : 'purchase',
        description: `${type === 'subscription' ? 'Monthly subscription' : 'One-time purchase'} - ${credits} credits`,
        stripe_payment_id: session.payment_intent as string,
      })

      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      
      if (invoice.billing_reason === 'subscription_cycle') {
        // Recurring subscription payment
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        )

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (sub) {
          const credits = 
            sub.tier === 'starter' ? 200 :
            sub.tier === 'pro' ? 750 :
            3000

          // Add monthly credits
          await supabase.from('credit_transactions').insert({
            user_id: sub.user_id,
            amount: credits,
            transaction_type: 'subscription',
            description: `Monthly ${sub.tier} subscription - ${credits} credits`,
            stripe_payment_id: invoice.payment_intent as string,
          })
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (sub) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', sub.user_id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
