// CR AUDIOVIZ AI - Admin Billing API Route
// Session: 2025-10-25 - Phase 3 API Routes
// Purpose: Manage subscriptions, billing history, and payment methods

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

// GET: Fetch billing information and subscription details
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const includeInvoices = searchParams.get('invoices') === 'true';

    // Get user profile with subscription info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, subscription_start_date, subscription_end_date')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError?.message },
        { status: 500 }
      );
    }

    const response: any = {
      success: true,
      subscription: {
        tier: profile.subscription_tier || 'free',
        status: profile.subscription_status || 'inactive',
        startDate: profile.subscription_start_date,
        endDate: profile.subscription_end_date
      }
    };

    // If user has Stripe customer, fetch additional details
    if (profile.stripe_customer_id) {
      try {
        const customer = await stripe.customers.retrieve(profile.stripe_customer_id);
        
        if (customer && !customer.deleted) {
          response.customer = {
            email: customer.email,
            name: customer.name,
            defaultPaymentMethod: customer.invoice_settings?.default_payment_method
          };
        }

        // Fetch active subscription if exists
        if (profile.stripe_subscription_id) {
          const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
          
          response.subscription.details = {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            items: subscription.items.data.map(item => ({
              id: item.id,
              priceId: item.price.id,
              amount: item.price.unit_amount,
              currency: item.price.currency,
              interval: item.price.recurring?.interval
            }))
          };
        }

        // Fetch payment methods
        const paymentMethods = await stripe.paymentMethods.list({
          customer: profile.stripe_customer_id,
          type: 'card'
        });

        response.paymentMethods = paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
          isDefault: pm.id === customer.invoice_settings?.default_payment_method
        }));

        // Fetch invoices if requested
        if (includeInvoices) {
          const invoices = await stripe.invoices.list({
            customer: profile.stripe_customer_id,
            limit: 20
          });

          response.invoices = invoices.data.map(invoice => ({
            id: invoice.id,
            number: invoice.number,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status,
            paid: invoice.paid,
            created: new Date(invoice.created * 1000).toISOString(),
            hostedInvoiceUrl: invoice.hosted_invoice_url,
            invoicePdf: invoice.invoice_pdf
          }));
        }

      } catch (stripeError: any) {
        console.error('Stripe API Error:', stripeError);
        response.stripeError = stripeError.message;
      }
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Admin Billing API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Manage subscription (create, update, cancel)
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, priceId, paymentMethodId } = body;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, email')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (action === 'create_subscription') {
      // Create new subscription
      if (!priceId) {
        return NextResponse.json(
          { error: 'Missing priceId' },
          { status: 400 }
        );
      }

      let customerId = profile.stripe_customer_id;

      // Create customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: profile.email || session.user.email,
          metadata: {
            userId
          }
        });
        customerId = customer.id;

        // Update profile with customer ID
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', userId);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId
        }
      });

      // Update profile with subscription ID
      await supabase
        .from('profiles')
        .update({
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
        }
      });
    }

    if (action === 'cancel_subscription') {
      // Cancel subscription
      if (!profile.stripe_subscription_id) {
        return NextResponse.json(
          { error: 'No active subscription' },
          { status: 400 }
        );
      }

      const subscription = await stripe.subscriptions.update(
        profile.stripe_subscription_id,
        { cancel_at_period_end: true }
      );

      // Update profile
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'canceling',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return NextResponse.json({
        success: true,
        message: 'Subscription will cancel at period end',
        cancelAt: new Date(subscription.current_period_end * 1000).toISOString()
      });
    }

    if (action === 'reactivate_subscription') {
      // Reactivate canceled subscription
      if (!profile.stripe_subscription_id) {
        return NextResponse.json(
          { error: 'No subscription to reactivate' },
          { status: 400 }
        );
      }

      const subscription = await stripe.subscriptions.update(
        profile.stripe_subscription_id,
        { cancel_at_period_end: false }
      );

      // Update profile
      await supabase
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return NextResponse.json({
        success: true,
        message: 'Subscription reactivated',
        subscription: {
          id: subscription.id,
          status: subscription.status
        }
      });
    }

    if (action === 'update_payment_method') {
      // Update default payment method
      if (!paymentMethodId || !profile.stripe_customer_id) {
        return NextResponse.json(
          { error: 'Missing paymentMethodId or customer ID' },
          { status: 400 }
        );
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: profile.stripe_customer_id
      });

      // Set as default
      await stripe.customers.update(profile.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Payment method updated'
      });
    }

    if (action === 'create_portal_session') {
      // Create Stripe customer portal session
      if (!profile.stripe_customer_id) {
        return NextResponse.json(
          { error: 'No Stripe customer found' },
          { status: 400 }
        );
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/billing`
      });

      return NextResponse.json({
        success: true,
        url: portalSession.url
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Admin Billing API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
