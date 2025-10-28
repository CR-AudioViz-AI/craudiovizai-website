import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'


// Force dynamic rendering - required for using dynamic Next.js features
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function GET() {
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

    // Get customer with subscription details
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id, stripe_subscription_id, subscription_status')
      .eq('user_id', user.id)
      .single()

    if (customerError || !customer?.stripe_subscription_id) {
      return NextResponse.json({
        hasSubscription: false,
        subscription: null
      })
    }

    // Fetch subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      customer.stripe_subscription_id,
      {
        expand: ['default_payment_method', 'items.data.price.product']
      }
    )

    // Format subscription data
    const subscriptionData = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      items: subscription.items.data.map(item => ({
        id: item.id,
        priceId: item.price.id,
        productId: typeof item.price.product === 'string' ? item.price.product : item.price.product.id,
        productName: typeof item.price.product === 'object' && 'name' in item.price.product ? item.price.product.name : 'Deleted Product',
        amount: item.price.unit_amount,
        currency: item.price.currency,
        interval: item.price.recurring?.interval,
        quantity: item.quantity
      }))
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription: subscriptionData
    })

  } catch (error: any) {
    console.error('Billing subscription API error:', error)
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        hasSubscription: false,
        subscription: null
      })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
