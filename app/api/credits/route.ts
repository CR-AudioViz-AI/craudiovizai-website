// ================================================================================
// CR AUDIOVIZ AI - CREDIT SYSTEM API
// Complete credit management with Stripe/PayPal integration
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';

// ============================================================================
// GET /api/credits/balance - Get user's credit balance
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get credit balance
    const { data: credits, error } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no credits record exists, create one with free tier
      const { data: newCredits, error: createError } = await supabase
        .from('credits')
        .insert([{
          user_id: user.id,
          balance: 100, // Free tier starts with 100 credits
          lifetime_earned: 100,
          monthly_allowance: 100
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating credits:', createError);
        return NextResponse.json({ error: 'Failed to initialize credits' }, { status: 500 });
      }

      return NextResponse.json({ credits: newCredits });
    }

    return NextResponse.json({ credits });

  } catch (error: any) {
    console.error('Credits balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/credits/deduct - Deduct credits for service usage
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, service_type, service_id, service_name, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Get current balance
    const { data: credits, error: fetchError } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError || !credits) {
      return NextResponse.json({ error: 'Credits not found' }, { status: 404 });
    }

    // Check sufficient balance
    if (credits.balance < amount) {
      return NextResponse.json({
        error: 'Insufficient credits',
        balance: credits.balance,
        required: amount
      }, { status: 402 });
    }

    // Deduct credits
    const newBalance = credits.balance - amount;
    const newLifetimeSpent = credits.lifetime_spent + amount;

    const { error: updateError } = await supabase
      .from('credits')
      .update({
        balance: newBalance,
        lifetime_spent: newLifetimeSpent,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
    }

    // Record transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        type: 'deduction',
        amount: -amount,
        balance_after: newBalance,
        service_type,
        service_id,
        service_name,
        description,
        status: 'completed',
        payment_method: 'system'
      }]);

    if (txError) {
      console.error('Error recording transaction:', txError);
    }

    return NextResponse.json({
      success: true,
      balance: newBalance,
      deducted: amount
    });

  } catch (error: any) {
    console.error('Credit deduction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
