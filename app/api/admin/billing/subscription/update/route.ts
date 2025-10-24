import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Get customer with subscription
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (customerError || !customer?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Retrieve current subscription
    const currentSubscription = await stripe.subscriptions.retrieve(
      customer.stripe_subscription_id
    )

    // Update subscription with new price
    const subscription = await stripe.subscriptions.update(
      customer.stripe_subscription_id,
      {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: priceId
          }
        ],
        proration_behavior: 'create_prorations'
      }
    )

    // Update customer record
    await supabase
      .from('customers')
      .update({
        subscription_status: subscription.status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      },
      message: 'Subscription updated successfully'
    })

  } catch (error: any) {
    console.error('Billing update API error:', error)
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
