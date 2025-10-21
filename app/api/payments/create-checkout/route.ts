import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, type, credits, amount } = await request.json()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: type === 'subscription' 
                ? `CR AudioViz AI ${credits === 200 ? 'Starter' : credits === 750 ? 'Pro' : 'Enterprise'} Plan`
                : `${credits} Credits Package`,
              description: type === 'subscription'
                ? `${credits} credits per month`
                : `One-time credit purchase`,
            },
            unit_amount: amount * 100, // Convert to cents
            ...(type === 'subscription' && { recurring: { interval: 'month' } }),
          },
          quantity: 1,
        },
      ],
      mode: type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        userId: user.id,
        type,
        credits: credits.toString(),
      },
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error) {
    console.error('Stripe Error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
