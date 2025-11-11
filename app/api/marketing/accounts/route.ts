/**
 * GET CONNECTED ACCOUNTS API
 * Returns all social media accounts connected by the user
 * Created: Saturday, November 01, 2025 - 2:58 PM ET
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get all connected accounts for this user
    const { data: accounts, error } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('platform_type', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      logError('Error fetching accounts:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch accounts' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      accounts: accounts || [],
      total: accounts?.length || 0,
    });
    
  } catch (error: unknown) {
    logError('Error in accounts API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
