import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BuildHealthTracking } from '@/lib/javari-types';

/**
 * GET /api/javari/health
 * Get health check history for a project
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const latest = searchParams.get('latest') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: projectId' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('javari_build_health_tracking')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (latest) {
      query = query.limit(1);
      const { data, error } = await query.single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data
      });
    } else {
      query = query.limit(limit);
      const { data, error } = await query;

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: data || []
      });
    }

  } catch (error) {
    console.error('GET /api/javari/health error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/health
 * Record a new health check
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Validate required fields
    if (!body.project_id || !body.build_status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: project_id, build_status' 
        },
        { status: 400 }
      );
    }

    // Create health check record
    const healthData: Partial<BuildHealthTracking> = {
      project_id: body.project_id,
      chat_session_id: body.chat_session_id || undefined,
      build_id: body.build_id || undefined,
      build_status: body.build_status,
      error_type: body.error_type || undefined,
      error_message: body.error_message || undefined,
      error_stack: body.error_stack || undefined,
      auto_fixable: body.auto_fixable || false,
      fix_suggestion: body.fix_suggestion || undefined,
      fix_confidence: body.fix_confidence || undefined,
      fix_applied: body.fix_applied || false,
      fix_result: body.fix_result || undefined,
      build_duration_seconds: body.build_duration_seconds || undefined,
      files_affected: body.files_affected || [],
      build_started_at: body.build_started_at || new Date().toISOString(),
      build_completed_at: body.build_completed_at || undefined
    };

    const { data, error } = await supabase
      .from('javari_build_health_tracking')
      .insert(healthData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Update project last_build_status and last_build_at
    await supabase
      .from('javari_projects')
      .update({
        last_build_status: body.build_status,
        last_build_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', body.project_id);

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/javari/health error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
