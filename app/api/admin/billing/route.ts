import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

/**
 * Admin Billing Management API
 * 
 * GET: Get subscription details and payment history
 * POST: Manage subscriptions (upgrade, downgrade, cancel)
 * 
 * Session: 2025-10-25 19:00 EST
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

async function getSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

async function verifyAuth() {
  const supabase = await getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

/**
 * GET /api/admin/billing
 * Returns subscription details and payment history
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const supabase = await getSupabaseClient();

    // Get user profile with subscription info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, stripe_customer_id, stripe_subscription_id, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch billing information' },
        { status: 500 }
      );
    }

    let stripeSubscription = null;
    let paymentMethods = [];
    let invoices = [];

    // If user has Stripe customer ID, fetch Stripe data
    if (profile?.stripe_customer_id) {
      try {
        // Get active subscription from Stripe
        if (profile.stripe_subscription_id) {
          stripeSubscription = await stripe.subscriptions.retrieve(
            profile.stripe_subscription_id
          );
        }

        // Get payment methods
        const paymentMethodsList = await stripe.paymentMethods.list({
          customer: profile.stripe_customer_id,
          type: 'card',
        });
        paymentMethods = paymentMethodsList.data;

        // Get recent invoices
        const invoicesList = await stripe.invoices.list({
          customer: profile.stripe_customer_id,
          limit: 20,
        });
        invoices = invoicesList.data;

      } catch (stripeError) {
        console.error('Error fetching Stripe data:', stripeError);
        // Continue without Stripe data
      }
    }

    // Get payment history from database
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
    }

    // Available subscription plans
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        credits_per_month: 100,
        features: [
          '100 credits per month',
          'Basic apps access',
          'Community support',
          'Standard processing speed',
        ],
        stripe_price_id: null,
      },
      {
        id: 'starter',
        name: 'Starter',
        price: 19,
        interval: 'month',
        credits_per_month: 500,
        features: [
          '500 credits per month',
          'All basic apps',
          'Email support',
          'Priority processing',
          'No watermarks',
        ],
        stripe_price_id: 'price_starter_monthly',
        popular: false,
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 49,
        interval: 'month',
        credits_per_month: 2000,
        features: [
          '2,000 credits per month',
          'All apps including premium',
          'Priority support',
          'Faster processing',
          'API access',
          'Custom branding',
        ],
        stripe_price_id: 'price_pro_monthly',
        popular: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199,
        interval: 'month',
        credits_per_month: 10000,
        features: [
          '10,000 credits per month',
          'Unlimited apps',
          'Dedicated support',
          'Fastest processing',
          'Full API access',
          'White-label options',
          'Custom integrations',
        ],
        stripe_price_id: 'price_enterprise_monthly',
        popular: false,
      },
    ];

    // Format subscription data
    const subscriptionData = stripeSubscription ? {
      id: stripeSubscription.id,
      status: stripeSubscription.status,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      canceled_at: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000).toISOString() : null,
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        current_plan: {
          tier: profile?.subscription_tier || 'free',
          status: profile?.subscription_status || 'active',
          subscription: subscriptionData,
        },
        plans,
        payment_methods: paymentMethods.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          exp_month: pm.card?.exp_month,
          exp_year: pm.card?.exp_year,
          is_default: pm.id === stripeSubscription?.default_payment_method,
        })),
        invoices: invoices.map(inv => ({
          id: inv.id,
          amount: inv.amount_paid / 100,
          currency: inv.currency,
          status: inv.status,
          created: new Date(inv.created * 1000).toISOString(),
          pdf_url: inv.invoice_pdf,
          hosted_url: inv.hosted_invoice_url,
        })),
        payment_history: payments || [],
        user_id: user.id,
      },
    });

  } catch (error) {
    console.error('Error in /api/admin/billing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/billing
 * Manage subscription (upgrade, downgrade, cancel, update payment)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, plan_id, payment_method_id } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id, stripe_subscription_id')
      .eq('id', user.id)
      .single();

    // Handle different actions
    switch (action) {
      case 'subscribe':
      case 'upgrade':
      case 'downgrade':
        if (!plan_id) {
          return NextResponse.json(
            { error: 'Missing plan_id' },
            { status: 400 }
          );
        }

        // Get plan details
        const planMap: Record<string, string> = {
          starter: 'price_starter_monthly',
          pro: 'price_pro_monthly',
          enterprise: 'price_enterprise_monthly',
        };

        const stripePriceId = planMap[plan_id];
        if (!stripePriceId) {
          return NextResponse.json(
            { error: 'Invalid plan_id' },
            { status: 400 }
          );
        }

        // Create or retrieve Stripe customer
        let customerId = profile?.stripe_customer_id;
        
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: profile?.email || user.email,
            metadata: {
              supabase_user_id: user.id,
            },
          });
          
          customerId = customer.id;
          
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
        }

        // If user has existing subscription, update it
        if (profile?.stripe_subscription_id) {
          const subscription = await stripe.subscriptions.retrieve(
            profile.stripe_subscription_id
          );

          const updatedSubscription = await stripe.subscriptions.update(
            profile.stripe_subscription_id,
            {
              items: [{
                id: subscription.items.data[0].id,
                price: stripePriceId,
              }],
              proration_behavior: 'always_invoice',
            }
          );

          // Update database
          await supabase
            .from('profiles')
            .update({
              subscription_tier: plan_id,
              subscription_status: updatedSubscription.status,
            })
            .eq('id', user.id);

          return NextResponse.json({
            success: true,
            message: `Subscription updated to ${plan_id}`,
          });
        }

        // Create new subscription checkout
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: stripePriceId,
              quantity: 1,
            },
          ],
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/billing?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/billing?canceled=true`,
          metadata: {
            user_id: user.id,
            plan_id,
          },
        });

        return NextResponse.json({
          success: true,
          checkout_url: session.url,
          session_id: session.id,
        });

      case 'cancel':
        if (!profile?.stripe_subscription_id) {
          return NextResponse.json(
            { error: 'No active subscription to cancel' },
            { status: 400 }
          );
        }

        // Cancel subscription at period end
        const canceledSubscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          {
            cancel_at_period_end: true,
          }
        );

        // Update database
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceling',
          })
          .eq('id', user.id);

        return NextResponse.json({
          success: true,
          message: 'Subscription will cancel at end of billing period',
          cancel_at: new Date(canceledSubscription.current_period_end * 1000).toISOString(),
        });

      case 'reactivate':
        if (!profile?.stripe_subscription_id) {
          return NextResponse.json(
            { error: 'No subscription to reactivate' },
            { status: 400 }
          );
        }

        // Remove cancellation
        const reactivatedSubscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          {
            cancel_at_period_end: false,
          }
        );

        // Update database
        await supabase
          .from('profiles')
          .update({
            subscription_status: reactivatedSubscription.status,
          })
          .eq('id', user.id);

        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated successfully',
        });

      case 'update_payment_method':
        if (!payment_method_id) {
          return NextResponse.json(
            { error: 'Missing payment_method_id' },
            { status: 400 }
          );
        }

        if (!profile?.stripe_subscription_id) {
          return NextResponse.json(
            { error: 'No active subscription' },
            { status: 400 }
          );
        }

        // Update subscription payment method
        await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          {
            default_payment_method: payment_method_id,
          }
        );

        return NextResponse.json({
          success: true,
          message: 'Payment method updated successfully',
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/admin/billing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
