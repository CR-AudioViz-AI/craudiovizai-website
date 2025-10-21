import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { action, userId, email, priceId, amount, credits } = await request.json()

    if (action === 'create-checkout') {
      // Create Stripe Checkout session for one-time credit purchase
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: amount * 100, // amount in cents
              product_data: {
                name: `${credits.toLocaleString()} Credits`,
                description: 'CR AudioViz AI Credits',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=canceled`,
        metadata: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase',
        },
      })

      return NextResponse.json({ sessionId: session.id, url: session.url })
    }

    if (action === 'create-subscription') {
      // Create Stripe subscription for monthly plans
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=canceled`,
        metadata: {
          userId,
          type: 'subscription',
        },
      })

      return NextResponse.json({ sessionId: session.id, url: session.url })
    }

    if (action === 'cancel-subscription') {
      const { subscriptionId } = await request.json()

      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })

      return NextResponse.json({
        success: true,
        cancelsAt: subscription.cancel_at,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Webhook handler for Stripe events
export async function GET(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    const body = await request.text()
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const credits = parseInt(session.metadata?.credits || '0')

        if (userId && credits) {
          // Add credits to user account
          const { data: user } = await supabaseAdmin
            .from('users')
            .select('credits')
            .eq('id', userId)
            .single()

          if (user) {
            const newBalance = user.credits + credits

            await supabaseAdmin
              .from('users')
              .update({ credits: newBalance })
              .eq('id', userId)

            await supabaseAdmin
              .from('credit_transactions')
              .insert({
                user_id: userId,
                type: 'purchase',
                amount: credits,
                balance_after: newBalance,
                description: 'Credit purchase via Stripe',
                metadata: { stripe_session_id: session.id },
              })

            await supabaseAdmin
              .from('payments')
              .insert({
                user_id: userId,
                amount_cents: session.amount_total || 0,
                currency: session.currency || 'usd',
                payment_method: 'stripe',
                stripe_payment_id: session.payment_intent as string,
                status: 'completed',
                credits_purchased: credits,
              })
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await supabaseAdmin
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              plan: subscription.metadata?.plan || 'Pro',
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
