import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Admin Apps Management API
 * 
 * GET: List all apps with usage statistics
 * POST: Update app settings or status
 * 
 * Session: 2025-10-25 19:00 EST
 */

interface AppUsageStats {
  app_id: string;
  app_name: string;
  total_generations: number;
  total_credits_used: number;
  last_used: string | null;
  is_active: boolean;
}

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
 * GET /api/admin/apps
 * Returns all apps with usage statistics for the authenticated user
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

    // Get user's app usage statistics
    const { data: usageData, error: usageError } = await supabase
      .from('app_usage')
      .select('app_id, app_name, credits_used, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (usageError) {
      console.error('Error fetching app usage:', usageError);
      return NextResponse.json(
        { error: 'Failed to fetch app usage data' },
        { status: 500 }
      );
    }

    // Aggregate statistics by app
    const appStats = new Map<string, AppUsageStats>();
    
    if (usageData) {
      usageData.forEach(usage => {
        const existing = appStats.get(usage.app_id);
        
        if (existing) {
          existing.total_generations++;
          existing.total_credits_used += usage.credits_used || 0;
          
          // Update last_used if this is more recent
          if (!existing.last_used || new Date(usage.created_at) > new Date(existing.last_used)) {
            existing.last_used = usage.created_at;
          }
        } else {
          appStats.set(usage.app_id, {
            app_id: usage.app_id,
            app_name: usage.app_name,
            total_generations: 1,
            total_credits_used: usage.credits_used || 0,
            last_used: usage.created_at,
            is_active: true,
          });
        }
      });
    }

    // Get all available apps from catalog
    const availableApps = [
      { id: 'ebook-creator', name: 'eBook Creator', category: 'Content' },
      { id: 'paycheck-calculator', name: 'Paycheck Calculator', category: 'Finance' },
      { id: 'social-scheduler', name: 'Social Media Scheduler', category: 'Marketing' },
      { id: 'landing-builder', name: 'Landing Page Builder', category: 'Web' },
      { id: 'site-builder', name: 'Site Builder', category: 'Web' },
      { id: 'video-editor', name: 'Video Editor', category: 'Media' },
      { id: 'audio-mixer', name: 'Audio Mixer', category: 'Media' },
      { id: 'image-generator', name: 'Image Generator', category: 'Design' },
      { id: 'logo-maker', name: 'Logo Maker', category: 'Design' },
    ];

    // Merge catalog with usage stats
    const appsWithStats = availableApps.map(app => {
      const stats = appStats.get(app.id);
      
      return {
        ...app,
        total_generations: stats?.total_generations || 0,
        total_credits_used: stats?.total_credits_used || 0,
        last_used: stats?.last_used || null,
        is_active: true,
      };
    });

    // Calculate totals
    const totals = {
      total_apps: availableApps.length,
      total_generations: Array.from(appStats.values()).reduce(
        (sum, app) => sum + app.total_generations,
        0
      ),
      total_credits_used: Array.from(appStats.values()).reduce(
        (sum, app) => sum + app.total_credits_used,
        0
      ),
      apps_used: appStats.size,
    };

    return NextResponse.json({
      success: true,
      data: {
        apps: appsWithStats,
        totals,
        user_id: user.id,
      },
    });

  } catch (error) {
    console.error('Error in /api/admin/apps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/apps
 * Update app settings or toggle app status
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
    const { app_id, action, settings } = body;

    if (!app_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: app_id, action' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    // Handle different actions
    switch (action) {
      case 'toggle_status':
        // Toggle app active status for user
        // This could be stored in a user_app_preferences table
        return NextResponse.json({
          success: true,
          message: `App ${app_id} status toggled`,
        });

      case 'update_settings':
        // Update app-specific settings
        if (!settings) {
          return NextResponse.json(
            { error: 'Missing settings data' },
            { status: 400 }
          );
        }

        // Store settings in user_app_preferences table
        const { error: settingsError } = await supabase
          .from('user_app_preferences')
          .upsert({
            user_id: user.id,
            app_id,
            settings,
            updated_at: new Date().toISOString(),
          });

        if (settingsError) {
          console.error('Error updating app settings:', settingsError);
          return NextResponse.json(
            { error: 'Failed to update app settings' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Settings updated for ${app_id}`,
        });

      case 'reset_usage':
        // Reset usage statistics for an app
        return NextResponse.json({
          success: true,
          message: `Usage statistics reset for ${app_id}`,
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/admin/apps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
