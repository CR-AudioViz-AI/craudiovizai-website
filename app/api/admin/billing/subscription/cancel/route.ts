import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { immediately = false } = body

    // Get customer with subscription
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single()

    if (customerError || !customer?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription in Stripe
    let subscription
    if (immediately) {
      // Cancel immediately
      subscription = await stripe.subscriptions.cancel(
        customer.stripe_subscription_id
      )
    } else {
      // Cancel at period end
      subscription = await stripe.subscriptions.update(
        customer.stripe_subscription_id,
        {
          cancel_at_period_end: true
        }
      )
    }

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
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      },
      message: immediately 
        ? 'Subscription cancelled immediately' 
        : 'Subscription will cancel at the end of the current billing period'
    })

  } catch (error: any) {
    console.error('Billing cancel API error:', error)
    
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
