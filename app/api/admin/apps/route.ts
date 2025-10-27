// CR AUDIOVIZ AI - Admin Apps API Route
// Session: 2025-10-25 - Phase 3 API Routes
// Purpose: Manage app access, usage statistics, and app-specific operations

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET: Fetch user's apps with usage statistics
export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    // If specific app requested, return detailed info
    if (appId) {
      const { data: appUsage, error: usageError } = await supabase
        .from('app_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('app_id', appId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (usageError) {
        return NextResponse.json(
          { error: 'Failed to fetch app usage', details: usageError.message },
          { status: 500 }
        );
      }

      // Calculate statistics
      const totalGenerations = appUsage?.length || 0;
      const totalCreditsUsed = appUsage?.reduce((sum: number, usage) => sum + (usage.credits_used || 0), 0) || 0;
      const avgCreditsPerGeneration = totalGenerations > 0 ? totalCreditsUsed / totalGenerations : 0;

      return NextResponse.json({
        success: true,
        appId,
        statistics: {
          totalGenerations,
          totalCreditsUsed,
          avgCreditsPerGeneration: Math.round(avgCreditsPerGeneration * 100) / 100,
          recentUsage: appUsage?.slice(0, 10) || []
        }
      });
    }

    // Otherwise return all apps with summary statistics
    const { data: allUsage, error: allUsageError } = await supabase
      .from('app_usage')
      .select('app_id, credits_used, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (allUsageError) {
      return NextResponse.json(
        { error: 'Failed to fetch usage data', details: allUsageError.message },
        { status: 500 }
      );
    }

    // Group by app_id and calculate statistics
    const appStats = (allUsage || []).reduce((acc: any, usage: any) => {
      const appId = usage.app_id;
      if (!acc[appId]) {
        acc[appId] = {
          appId,
          totalGenerations: 0,
          totalCreditsUsed: 0,
          lastUsed: usage.created_at
        };
      }
      acc[appId].totalGenerations += 1;
      acc[appId].totalCreditsUsed += usage.credits_used || 0;
      return acc;
    }, {});

    const appsArray = Object.values(appStats);

    return NextResponse.json({
      success: true,
      totalApps: appsArray.length,
      apps: appsArray
    });

  } catch (error: any) {
    console.error('Admin Apps API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Record new app usage or toggle app access
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, appId, creditsUsed, metadata } = body;

    if (action === 'record_usage') {
      // Record app usage
      if (!appId || creditsUsed === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields: appId, creditsUsed' },
          { status: 400 }
        );
      }

      // Check user has enough credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'Failed to fetch user profile' },
          { status: 500 }
        );
      }

      if (profile.credits_balance < creditsUsed) {
        return NextResponse.json(
          { error: 'Insufficient credits', availableCredits: profile.credits_balance },
          { status: 402 }
        );
      }

      // Record usage
      const { data: usage, error: usageError } = await supabase
        .from('app_usage')
        .insert({
          user_id: userId,
          app_id: appId,
          credits_used: creditsUsed,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (usageError) {
        return NextResponse.json(
          { error: 'Failed to record usage', details: usageError.message },
          { status: 500 }
        );
      }

      // Deduct credits
      const { error: deductError } = await supabase
        .from('profiles')
        .update({ 
          credits_balance: profile.credits_balance - creditsUsed,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (deductError) {
        console.error('Failed to deduct credits:', deductError);
      }

      return NextResponse.json({
        success: true,
        usage,
        remainingCredits: profile.credits_balance - creditsUsed
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Admin Apps API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Clear app usage history
export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json(
        { error: 'Missing appId parameter' },
        { status: 400 }
      );
    }

    // Delete usage history for specific app
    const { error: deleteError } = await supabase
      .from('app_usage')
      .delete()
      .eq('user_id', userId)
      .eq('app_id', appId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete usage history', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Usage history cleared for app: ${appId}`
    });

  } catch (error: any) {
    console.error('Admin Apps API DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
