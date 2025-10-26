// CR AUDIOVIZ AI - Admin Credits API Route
// Session: 2025-10-25 - Phase 3 API Routes
// Purpose: Manage user credits, purchases, and credit history

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

// GET: Fetch credit balance and transaction history
export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    const { data: { session: authSession }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get('history') === 'true';

    // Get user profile with credit balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_balance, subscription_tier, subscription_status')
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
      creditsBalance: profile.credits_balance || 0,
      subscriptionTier: profile.subscription_tier || 'free',
      subscriptionStatus: profile.subscription_status || 'inactive'
    };

    // Include transaction history if requested
    if (includeHistory) {
      const { data: transactions, error: transError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (transError) {
        console.error('Failed to fetch transactions:', transError);
      } else {
        response.transactions = transactions || [];
        response.totalTransactions = transactions?.length || 0;
        
        // Calculate statistics
        const purchases = transactions?.filter(t => t.transaction_type === 'purchase') || [];
        const usage = transactions?.filter(t => t.transaction_type === 'usage') || [];
        
        response.statistics = {
          totalPurchased: purchases.reduce((sum, t) => sum + (t.credits || 0), 0),
          totalUsed: Math.abs(usage.reduce((sum, t) => sum + (t.credits || 0), 0)),
          totalSpent: purchases.reduce((sum, t) => sum + (t.amount || 0), 0) / 100 // Convert cents to dollars
        };
      }
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Admin Credits API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Purchase credits or add credits
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    const { data: { session: authSession }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;
    const body = await request.json();
    const { action, amount, credits, paymentMethodId } = body;

    if (action === 'create_checkout') {
      // Create Stripe checkout session for credit purchase
      if (!credits || !amount) {
        return NextResponse.json(
          { error: 'Missing required fields: credits, amount' },
          { status: 400 }
        );
      }

      // Get user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      const stripeSession = await stripe.checkout.sessions.create({
        customer_email: profile?.email || authSession.user.email,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${credits} CR AudioViz AI Credits`,
                description: `Purchase ${credits} credits for use across all creative tools`
              },
              unit_amount: amount // Amount in cents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/credits?success=true&credits=${credits}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/credits?canceled=true`,
        metadata: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase'
        }
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: stripeSession.url,
        sessionId: stripeSession.id
      });
    }

    if (action === 'direct_charge') {
      // Direct charge with payment method (for saved cards)
      if (!credits || !amount || !paymentMethodId) {
        return NextResponse.json(
          { error: 'Missing required fields: credits, amount, paymentMethodId' },
          { status: 400 }
        );
      }

      // Get user's Stripe customer ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id, credits_balance')
        .eq('id', userId)
        .single();

      if (!profile?.stripe_customer_id) {
        return NextResponse.json(
          { error: 'No Stripe customer found' },
          { status: 400 }
        );
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: profile.stripe_customer_id,
        payment_method: paymentMethodId,
        confirm: true,
        description: `${credits} CR AudioViz AI Credits`,
        metadata: {
          userId,
          credits: credits.toString(),
          type: 'credit_purchase'
        }
      });

      if (paymentIntent.status === 'succeeded') {
        // Add credits
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ 
            credits_balance: (profile?.credits_balance || 0) + credits,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select('credits_balance')
          .single();

        if (updateError) {
          console.error('Failed to update credits:', updateError);
          return NextResponse.json(
            { error: 'Payment succeeded but failed to add credits' },
            { status: 500 }
          );
        }

        // Record transaction
        await supabase
          .from('credit_transactions')
          .insert({
            user_id: userId,
            transaction_type: 'purchase',
            credits,
            amount,
            payment_method: 'stripe',
            stripe_payment_intent_id: paymentIntent.id,
            status: 'completed',
            created_at: new Date().toISOString()
          });

        return NextResponse.json({
          success: true,
          credits: updatedProfile?.credits_balance || 0,
          paymentIntentId: paymentIntent.id
        });
      }

      return NextResponse.json({
        success: false,
        status: paymentIntent.status,
        message: 'Payment requires additional action'
      });
    }

    if (action === 'add_bonus') {
      // Admin function to add bonus credits (would need admin role check)
      const { bonusCredits, reason } = body;

      if (!bonusCredits) {
        return NextResponse.json(
          { error: 'Missing bonusCredits' },
          { status: 400 }
        );
      }

      // TODO: Add admin role verification here
      
      // Fetch current balance first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', userId)
        .single();
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          credits_balance: (existingProfile?.credits_balance || 0) + bonusCredits,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('credits_balance')
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to add bonus credits', details: updateError.message },
          { status: 500 }
        );
      }

      // Record bonus transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'bonus',
          credits: bonusCredits,
          amount: 0,
          description: reason || 'Bonus credits',
          status: 'completed',
          created_at: new Date().toISOString()
        });

      return NextResponse.json({
        success: true,
        newBalance: updatedProfile?.credits_balance || 0
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Admin Credits API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
