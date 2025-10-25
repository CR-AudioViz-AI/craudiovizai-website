import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Credit costs for different actions
export const CREDIT_COSTS = {
  JAVARI_MESSAGE: 1, // 1 credit per message to Javari
  JAVARI_LONG_RESPONSE: 2, // 2 credits for responses over 1000 tokens
  JAVARI_CODE_GENERATION: 3, // 3 credits for code generation
  JAVARI_FILE_UPLOAD: 2, // 2 credits for file analysis
};

/**
 * GET /api/javari/credits
 * Get user's current credit balance
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

    // Get customer record
    const { data: customer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (customerError) {
      console.error('Error fetching customer credits:', customerError);
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      credits: customer?.credits || 0,
      userId: user.id
    });

  } catch (error) {
    console.error('Error in credits GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/credits
 * Deduct credits for Javari usage
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

    // Parse request body
    const body = await request.json();
    const { action, metadata } = body;

    // Determine credit cost
    let creditCost = CREDIT_COSTS.JAVARI_MESSAGE; // Default
    
    if (action === 'long_response') {
      creditCost = CREDIT_COSTS.JAVARI_LONG_RESPONSE;
    } else if (action === 'code_generation') {
      creditCost = CREDIT_COSTS.JAVARI_CODE_GENERATION;
    } else if (action === 'file_upload') {
      creditCost = CREDIT_COSTS.JAVARI_FILE_UPLOAD;
    }

    // Get current credit balance
    const { data: customer, error: fetchError } = await supabase
      .from('stripe_customers')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    const currentCredits = customer?.credits || 0;

    // Check if user has enough credits
    if (currentCredits < creditCost) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          required: creditCost,
          current: currentCredits
        },
        { status: 402 } // Payment Required
      );
    }

    // Deduct credits
    const newBalance = currentCredits - creditCost;
    const { error: updateError } = await supabase
      .from('stripe_customers')
      .update({ credits: newBalance })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to deduct credits' },
        { status: 500 }
      );
    }

    // Log the transaction
    const { error: logError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount: -creditCost,
        type: 'deduction',
        description: `Javari AI: ${action}`,
        metadata: metadata || {},
        balance_after: newBalance
      });

    if (logError) {
      console.error('Error logging transaction:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      creditsDeducted: creditCost,
      newBalance,
      action
    });

  } catch (error) {
    console.error('Error in credits POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/javari/credits
 * Add credits (admin only or after purchase)
 */
export async function PATCH(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { amount, reason, targetUserId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Determine target user (self or admin can add to others)
    let userId = user.id;
    
    if (targetUserId && targetUserId !== user.id) {
      // Check if requester is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      userId = targetUserId;
    }

    // Get current balance
    const { data: customer, error: fetchError } = await supabase
      .from('stripe_customers')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    const currentCredits = customer?.credits || 0;
    const newBalance = currentCredits + amount;

    // Add credits
    const { error: updateError } = await supabase
      .from('stripe_customers')
      .update({ credits: newBalance })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to add credits' },
        { status: 500 }
      );
    }

    // Log the transaction
    const { error: logError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount,
        type: 'addition',
        description: reason || 'Credits added',
        balance_after: newBalance
      });

    if (logError) {
      console.error('Error logging transaction:', logError);
    }

    return NextResponse.json({
      success: true,
      creditsAdded: amount,
      newBalance,
      userId
    });

  } catch (error) {
    console.error('Error in credits PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
