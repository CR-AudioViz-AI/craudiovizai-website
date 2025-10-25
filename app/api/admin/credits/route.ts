import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

/**
 * Admin Credits Management API
 * 
 * GET: Get credit balance and transaction history
 * POST: Purchase credits or apply promo codes
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
 * GET /api/admin/credits
 * Returns credit balance and transaction history
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

    // Get user profile with credit balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, subscription_tier, credits_expire_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch credit balance' },
        { status: 500 }
      );
    }

    // Get credit transaction history
    const { data: transactions, error: transError } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (transError) {
      console.error('Error fetching transactions:', transError);
    }

    // Calculate credit usage statistics
    const usageStats = {
      total_earned: 0,
      total_spent: 0,
      total_bonus: 0,
    };

    if (transactions) {
      transactions.forEach(trans => {
        if (trans.amount > 0) {
          usageStats.total_earned += trans.amount;
        } else {
          usageStats.total_spent += Math.abs(trans.amount);
        }
        
        if (trans.transaction_type === 'bonus' || trans.transaction_type === 'promo') {
          usageStats.total_bonus += trans.amount;
        }
      });
    }

    // Get available credit packages
    const creditPackages = [
      {
        id: 'starter',
        name: 'Starter Pack',
        credits: 100,
        price: 9.99,
        price_id: 'price_starter_credits',
        bonus: 0,
        popular: false,
      },
      {
        id: 'popular',
        name: 'Popular Pack',
        credits: 500,
        price: 39.99,
        price_id: 'price_popular_credits',
        bonus: 50,
        popular: true,
      },
      {
        id: 'pro',
        name: 'Pro Pack',
        credits: 1000,
        price: 69.99,
        price_id: 'price_pro_credits',
        bonus: 150,
        popular: false,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Pack',
        credits: 5000,
        price: 299.99,
        price_id: 'price_enterprise_credits',
        bonus: 1000,
        popular: false,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        balance: {
          current: profile?.credits || 0,
          expires_at: profile?.credits_expire_at || null,
          subscription_tier: profile?.subscription_tier || 'free',
        },
        usage_stats: usageStats,
        transactions: transactions || [],
        packages: creditPackages,
        user_id: user.id,
      },
    });

  } catch (error) {
    console.error('Error in /api/admin/credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/credits
 * Purchase credits or apply promo code
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
    const { action, package_id, promo_code, amount } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    // Handle different actions
    switch (action) {
      case 'purchase':
        if (!package_id) {
          return NextResponse.json(
            { error: 'Missing package_id for purchase' },
            { status: 400 }
          );
        }

        // Get user's email for Stripe
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, stripe_customer_id')
          .eq('id', user.id)
          .single();

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
          
          // Save customer ID to profile
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price: package_id, // This should be the Stripe price ID
              quantity: 1,
            },
          ],
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/credits?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/credits?canceled=true`,
          metadata: {
            user_id: user.id,
            type: 'credit_purchase',
          },
        });

        return NextResponse.json({
          success: true,
          checkout_url: session.url,
          session_id: session.id,
        });

      case 'apply_promo':
        if (!promo_code) {
          return NextResponse.json(
            { error: 'Missing promo_code' },
            { status: 400 }
          );
        }

        // Validate promo code
        const { data: promo, error: promoError } = await supabase
          .from('promo_codes')
          .select('*')
          .eq('code', promo_code.toUpperCase())
          .eq('is_active', true)
          .single();

        if (promoError || !promo) {
          return NextResponse.json(
            { error: 'Invalid or expired promo code' },
            { status: 400 }
          );
        }

        // Check if user already used this code
        const { data: existingUse } = await supabase
          .from('promo_code_usage')
          .select('id')
          .eq('user_id', user.id)
          .eq('promo_code_id', promo.id)
          .single();

        if (existingUse) {
          return NextResponse.json(
            { error: 'Promo code already used' },
            { status: 400 }
          );
        }

        // Apply promo code - add credits
        const { error: updateError } = await supabase.rpc('add_credits', {
          p_user_id: user.id,
          p_amount: promo.credit_amount,
        });

        if (updateError) {
          console.error('Error applying promo:', updateError);
          return NextResponse.json(
            { error: 'Failed to apply promo code' },
            { status: 500 }
          );
        }

        // Record promo usage
        await supabase.from('promo_code_usage').insert({
          user_id: user.id,
          promo_code_id: promo.id,
          credits_awarded: promo.credit_amount,
        });

        // Record transaction
        await supabase.from('credit_transactions').insert({
          user_id: user.id,
          amount: promo.credit_amount,
          transaction_type: 'promo',
          description: `Promo code: ${promo_code}`,
        });

        return NextResponse.json({
          success: true,
          message: `${promo.credit_amount} credits added to your account!`,
          credits_added: promo.credit_amount,
        });

      case 'transfer':
        // Future: Allow credit transfers between users
        return NextResponse.json(
          { error: 'Credit transfers not yet supported' },
          { status: 400 }
        );

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/admin/credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
