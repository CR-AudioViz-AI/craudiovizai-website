/**
 * CR AudioViz AI - Admin Billing API Route
 * Manages subscriptions, payment methods, and billing history
 * @timestamp October 25, 2025 - 3:50 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

interface BillingData {
  subscription: {
    id: string;
    status: string;
    plan: string;
    amount: number;
    currency: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  paymentMethods: Array<{
    id: string;
    type: string;
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    isDefault: boolean;
  }>;
  invoices: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: string;
    paidAt: string | null;
    invoicePdf: string | null;
  }>;
  upcomingInvoice: {
    amount: number;
    currency: string;
    date: string;
  } | null;
}

/**
 * GET /api/admin/billing
 * Retrieve complete billing information for current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, subscription_plan, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json({
        subscription: null,
        paymentMethods: [],
        invoices: [],
        upcomingInvoice: null
      });
    }

    const customerId = profile.stripe_customer_id;

    // Fetch subscription data from Stripe
    let subscriptionData = null;
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0];
        subscriptionData = {
          id: sub.id,
          status: sub.status,
          plan: sub.items.data[0]?.price.nickname || 'Professional',
          amount: sub.items.data[0]?.price.unit_amount || 0,
          currency: sub.currency,
          currentPeriodStart: new Date(sub.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end
        };
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }

    // Fetch payment methods
    let paymentMethods: BillingData['paymentMethods'] = [];
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer && !customer.deleted) {
        const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;
        
        const methods = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
          limit: 10
        });

        paymentMethods = methods.data.map(pm => ({
          id: pm.id,
          type: pm.type,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
          isDefault: pm.id === defaultPaymentMethodId
        }));
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }

    // Fetch invoice history
    let invoices: BillingData['invoices'] = [];
    try {
      const stripeInvoices = await stripe.invoices.list({
        customer: customerId,
        limit: 12
      });

      invoices = stripeInvoices.data.map(invoice => ({
        id: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status || 'unknown',
        created: new Date(invoice.created * 1000).toISOString(),
        paidAt: invoice.status_transitions?.paid_at 
          ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          : null,
        invoicePdf: invoice.invoice_pdf
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }

    // Fetch upcoming invoice
    let upcomingInvoice = null;
    try {
      if (subscriptionData) {
        const upcoming = await stripe.invoices.retrieveUpcoming({
          customer: customerId
        });

        upcomingInvoice = {
          amount: upcoming.amount_due,
          currency: upcoming.currency,
          date: new Date(upcoming.period_end * 1000).toISOString()
        };
      }
    } catch (error) {
      // No upcoming invoice or error fetching
    }

    const billingData: BillingData = {
      subscription: subscriptionData,
      paymentMethods,
      invoices,
      upcomingInvoice
    };

    return NextResponse.json(billingData);

  } catch (error) {
    console.error('Admin billing API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/billing
 * Update subscription, cancel, or manage payment methods
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      );
    }

    const customerId = profile.stripe_customer_id;

    switch (action) {
      case 'cancel_subscription': {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1
        });

        if (subscriptions.data.length > 0) {
          const subscription = await stripe.subscriptions.update(
            subscriptions.data[0].id,
            { cancel_at_period_end: true }
          );

          return NextResponse.json({
            success: true,
            subscription: {
              id: subscription.id,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
            }
          });
        }
        
        return NextResponse.json(
          { error: 'No active subscription found' },
          { status: 404 }
        );
      }

      case 'reactivate_subscription': {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1
        });

        if (subscriptions.data.length > 0 && subscriptions.data[0].cancel_at_period_end) {
          const subscription = await stripe.subscriptions.update(
            subscriptions.data[0].id,
            { cancel_at_period_end: false }
          );

          return NextResponse.json({
            success: true,
            subscription: {
              id: subscription.id,
              cancelAtPeriodEnd: false
            }
          });
        }

        return NextResponse.json(
          { error: 'Subscription not scheduled for cancellation' },
          { status: 400 }
        );
      }

      case 'update_payment_method': {
        const { paymentMethodId } = params;
        
        if (!paymentMethodId) {
          return NextResponse.json(
            { error: 'Payment method ID required' },
            { status: 400 }
          );
        }

        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId
        });

        // Set as default payment method
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Payment method updated successfully'
        });
      }

      case 'remove_payment_method': {
        const { paymentMethodId } = params;
        
        if (!paymentMethodId) {
          return NextResponse.json(
            { error: 'Payment method ID required' },
            { status: 400 }
          );
        }

        await stripe.paymentMethods.detach(paymentMethodId);

        return NextResponse.json({
          success: true,
          message: 'Payment method removed successfully'
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin billing POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
