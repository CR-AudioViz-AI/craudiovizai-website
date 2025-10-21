import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, credits, amount } = await request.json()

    // Create PayPal order
    const paypalAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64')

    const paypalBaseURL = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com'

    // Create order
    const orderResponse = await fetch(`${paypalBaseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${paypalAuth}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: type === 'subscription' 
              ? `CR AudioViz AI ${credits} credits/month subscription`
              : `${credits} Credits Package`,
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
            },
            custom_id: JSON.stringify({
              userId: user.id,
              type,
              credits,
            }),
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?paypal=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?paypal=cancelled`,
        },
      }),
    })

    const orderData = await orderResponse.json()

    if (!orderResponse.ok) {
      console.error('PayPal Error:', orderData)
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
    }

    // Find approval URL
    const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve')?.href

    return NextResponse.json({ approvalUrl })
  } catch (error) {
    console.error('PayPal Checkout Error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal checkout' },
      { status: 500 }
    )
  }
}
