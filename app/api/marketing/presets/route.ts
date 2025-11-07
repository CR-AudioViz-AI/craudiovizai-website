/**
 * DISTRIBUTION PRESETS API
 * Manage saved distribution configurations
 * Created: Saturday, November 01, 2025 - 3:00 PM ET
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

// GET - Fetch all presets
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
    
    const { data: presets, error } = await supabase
      .from('distribution_presets')
      .select('*')
      .eq('user_id', user.id)
      .order('is_favorite', { ascending: false })
      .order('use_count', { ascending: false });
    
    if (error) {
      logError(\'Error fetching presets:\', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch presets' },
        { status: 500 }
      );
    }
    
    // Calculate account count for each preset
    const presetsWithCounts = await Promise.all(
      (presets || []).map(async (preset) => {
        // Use the resolve_distribution_targets function
        const { data: accounts } = await supabase
          .rpc('resolve_distribution_targets', {
            user_id_param: user.id,
            preset_id_param: preset.id,
          });
        
        return {
          ...preset,
          account_count: accounts?.length || 0,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      presets: presetsWithCounts,
      total: presetsWithCounts.length,
    });
    
  } catch (error: unknown) {
    logError(\'Error in presets API:\', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new preset
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
    const {
      name,
      description,
      target_type,
      selected_account_ids,
      selected_group_ids,
      selected_platforms,
      icon,
      color,
    } = body;
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Preset name is required' },
        { status: 400 }
      );
    }
    
    if (!target_type) {
      return NextResponse.json(
        { success: false, error: 'Target type is required' },
        { status: 400 }
      );
    }
    
    const { data: preset, error } = await supabase
      .from('distribution_presets')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description,
        target_type,
        selected_account_ids: selected_account_ids || [],
        selected_group_ids: selected_group_ids || [],
        selected_platforms: selected_platforms || [],
        icon: icon || 'target',
        color: color || '#10B981',
      })
      .select()
      .single();
    
    if (error) {
      logError(\'Error creating preset:\', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create preset' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      preset,
    });
    
  } catch (error: unknown) {
    logError(\'Error in presets POST:\', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
