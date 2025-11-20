// ================================================================================
// CR AUDIOVIZ AI - APPS API ENDPOINT
// Browse, search, filter, and launch apps
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';

// ============================================================================
// GET /api/apps - List all apps with optional filtering
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const is_free = searchParams.get('is_free');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('apps')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (is_free === 'true') {
      query = query.eq('is_free', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sort and paginate
    query = query
      .order('usage_count', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: apps, error, count } = await query;

    if (error) {
      console.error('Error fetching apps:', error);
      return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 });
    }

    return NextResponse.json({
      apps: apps || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error: any) {
    console.error('Apps API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/apps/[slug] - Get single app details
// ============================================================================
export async function getAppBySlug(slug: string) {
  try {
    const { data: app, error } = await supabase
      .from('apps')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching app:', error);
      return { error: 'App not found', status: 404 };
    }

    return { app, status: 200 };

  } catch (error: any) {
    console.error('App fetch error:', error);
    return { error: 'Internal server error', status: 500 };
  }
}

// ============================================================================
// POST /api/apps/launch - Launch app and track usage
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
    const { app_id, app_slug } = body;

    if (!app_id && !app_slug) {
      return NextResponse.json({ error: 'app_id or app_slug required' }, { status: 400 });
    }

    // Get app details
    let query = supabase.from('apps').select('*');
    
    if (app_id) {
      query = query.eq('id', app_id);
    } else {
      query = query.eq('slug', app_slug);
    }

    const { data: app, error: appError } = await query.single();

    if (appError || !app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Check if app requires credits
    if (!app.is_free && app.credits_cost > 0) {
      // Get user credits
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (creditsError || !credits) {
        return NextResponse.json({ error: 'Credits not found' }, { status: 404 });
      }

      // Check sufficient balance
      if (credits.balance < app.credits_cost) {
        return NextResponse.json({
          error: 'Insufficient credits',
          balance: credits.balance,
          required: app.credits_cost
        }, { status: 402 });
      }

      // Deduct credits
      const newBalance = credits.balance - app.credits_cost;

      const { error: deductError } = await supabase
        .from('credits')
        .update({
          balance: newBalance,
          lifetime_spent: supabase.raw(`lifetime_spent + ${app.credits_cost}`),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (deductError) {
        console.error('Error deducting credits:', deductError);
        return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
      }

      // Record transaction
      await supabase.from('transactions').insert([{
        user_id: user.id,
        type: 'deduction',
        amount: -app.credits_cost,
        balance_after: newBalance,
        service_type: 'app',
        service_id: app.id,
        service_name: app.name,
        description: `Launched ${app.name}`,
        status: 'completed',
        payment_method: 'system'
      }]);
    }

    // Increment usage count
    await supabase
      .from('apps')
      .update({ usage_count: supabase.raw('usage_count + 1') })
      .eq('id', app.id);

    return NextResponse.json({
      success: true,
      app: {
        id: app.id,
        name: app.name,
        slug: app.slug,
        app_url: app.app_url,
        app_type: app.app_type
      },
      credits_deducted: app.is_free ? 0 : app.credits_cost
    });

  } catch (error: any) {
    console.error('App launch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
