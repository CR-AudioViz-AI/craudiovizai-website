/**
 * ACCOUNT GROUPS API
 * Manage custom groups of social media accounts
 * Created: Saturday, November 01, 2025 - 2:59 PM ET
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

// GET - Fetch all groups with account counts
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get groups with account counts
    const { data: groups, error } = await supabase
      .from('account_groups')
      .select(`
        *,
        account_group_memberships (
          connected_account_id
        )
      `)
      .eq('user_id', user.id)
      .order('display_order', { ascending: true });
    
    if (error) {
      logError(\'Error fetching groups:\', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch groups' },
        { status: 500 }
      );
    }
    
    // Format groups with account counts
    const formattedGroups = groups?.map(group => ({
      ...group,
      account_count: group.account_group_memberships?.length || 0,
    })) || [];
    
    return NextResponse.json({
      success: true,
      groups: formattedGroups,
      total: formattedGroups.length,
    });
    
  } catch (error: unknown) {
    logError(\'Error in groups API:\', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new group
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, description, color, icon } = body;
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 }
      );
    }
    
    const { data: group, error } = await supabase
      .from('account_groups')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description,
        color: color || '#3B82F6',
        icon: icon || 'folder',
      })
      .select()
      .single();
    
    if (error) {
      logError(\'Error creating group:\', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create group' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      group,
    });
    
  } catch (error: unknown) {
    logError(\'Error in groups POST:\', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
