/**
 * CR AudioViz AI - Users Management API
 * Comprehensive user administration and management
 * @timestamp October 24, 2025 - 6:00 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export const dynamic = 'force-dynamic';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  credits_balance: number;
  subscription_tier: string | null;
  total_spent: number;
  projects_count: number;
  last_sign_in: string | null;
  created_at: string;
  updated_at: string;
}

// GET - List users with filters and search
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const subscriptionTier = searchParams.get('subscriptionTier');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('profiles')
      .select(`
        *,
        credits:credits(balance),
        subscription:subscriptions(tier, status),
        projects:projects(id, count)
      `, { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }
    if (status) {
      query = query.eq('status', status);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) throw error;

    // Get payment history for each user
    const userIds = users?.map(u => u.id) || [];
    const { data: payments } = await supabase
      .from('payment_history')
      .select('user_id, amount')
      .in('user_id', userIds)
      .eq('status', 'succeeded');

    // Calculate total spent per user
    const totalSpentByUser = (payments || []).reduce((acc: number, payment) => {
      acc[payment.user_id] = (acc[payment.user_id] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    // Format response
    const formattedUsers: UserProfile[] = (users || []).map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      role: u.role || 'user',
      status: u.status || 'active',
      credits_balance: u.credits?.balance || 0,
      subscription_tier: u.subscription?.tier || null,
      total_spent: (totalSpentByUser[u.id] || 0) / 100, // Convert from cents
      projects_count: u.projects?.length || 0,
      last_sign_in: u.last_sign_in_at,
      created_at: u.created_at,
      updated_at: u.updated_at
    }));

    // Get summary statistics
    const { data: allUsers } = await supabase
      .from('profiles')
      .select('role, status, created_at');

    const summary = {
      total_users: allUsers?.length || 0,
      active_users: allUsers?.filter(u => u.status === 'active').length || 0,
      suspended_users: allUsers?.filter(u => u.status === 'suspended').length || 0,
      banned_users: allUsers?.filter(u => u.status === 'banned').length || 0,
      admin_users: allUsers?.filter(u => u.role === 'admin').length || 0,
      new_users_today: allUsers?.filter(u => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(u.created_at) >= today;
      }).length || 0
    };

    return NextResponse.json({
      success: true,
      data: formattedUsers,
      summary,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    logError('Users management error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin-created accounts)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        full_name: body.full_name || null,
        role: body.role || 'user'
      }
    });

    if (createError) throw createError;

    if (!newUser.user) {
      throw new Error('User creation failed');
    }

    // Create initial credit balance
    await supabase
      .from('credits')
      .insert({
        user_id: newUser.user.id,
        balance: body.initial_credits || 100,
        created_at: new Date().toISOString()
      });

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: 'user_created',
        details: {
          user_id: newUser.user.id,
          email: body.email,
          role: body.role || 'user',
          initial_credits: body.initial_credits || 100
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.user.id,
        email: newUser.user.email,
        created_at: newUser.user.created_at
      },
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    logError('Create user error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update user details
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.user_id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.role !== undefined) updates.role = body.role;
    if (body.status !== undefined) updates.status = body.status;

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', body.user_id);

    if (updateError) throw updateError;

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: 'user_updated',
        details: {
          user_id: body.user_id,
          updates: updates
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error: unknown) {
    logError('Update user error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Suspend or ban user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('id');
    const action = searchParams.get('action') || 'suspend'; // 'suspend' or 'ban'
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Update user status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        status: action === 'ban' ? 'banned' : 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: action === 'ban' ? 'user_banned' : 'user_suspended',
        details: {
          user_id: userId,
          reason: searchParams.get('reason') || 'No reason provided'
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      message: `User ${action === 'ban' ? 'banned' : 'suspended'} successfully`
    });

  } catch (error: unknown) {
    logError('User action error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform user action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
