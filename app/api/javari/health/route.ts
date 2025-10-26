import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BuildHealthTracking } from '@/lib/javari-types';

/**
 * GET /api/javari/health
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const chatSessionId = searchParams.get('chatSessionId');
    const latest = searchParams.get('latest') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('javari_build_health_tracking')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (chatSessionId) {
      query = query.eq('chat_session_id', chatSessionId);
    }

    if (latest) {
      query = query.limit(1);
      const { data, error } = await query.single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }

      return NextResponse.json({ success: true, data });
    } else {
      query = query.limit(limit);
      const { data, error } = await query;

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: data || [] });
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/health
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.project_id || !body.build_status || !body.build_started_at) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: project_id, build_status, build_started_at' },
        { status: 400 }
      );
    }

    const healthData: Partial<BuildHealthTracking> = {
      project_id: body.project_id,
      chat_session_id: body.chat_session_id,
      build_id: body.build_id,
      build_status: body.build_status,
      error_type: body.error_type,
      error_message: body.error_message,
      error_stack: body.error_stack,
      auto_fixable: body.auto_fixable || false,
      fix_suggestion: body.fix_suggestion,
      fix_confidence: body.fix_confidence,
      fix_applied: body.fix_applied || false,
      fix_result: body.fix_result,
      build_duration_seconds: body.build_duration_seconds,
      files_affected: body.files_affected,
      build_started_at: body.build_started_at,
      build_completed_at: body.build_completed_at
    };

    const { data, error } = await supabase
      .from('javari_build_health_tracking')
      .insert(healthData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Update project health if status is success or failed
    if (body.build_status === 'success' || body.build_status === 'failed') {
      await supabase
        .from('javari_projects')
        .update({
          last_build_status: body.build_status,
          last_build_at: body.build_completed_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', body.project_id);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/javari/health
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing required field: id' }, { status: 400 });
    }

    const updateData: Partial<BuildHealthTracking> = {};

    if (body.fix_applied !== undefined) updateData.fix_applied = body.fix_applied;
    if (body.fix_result !== undefined) updateData.fix_result = body.fix_result;
    if (body.build_completed_at !== undefined) updateData.build_completed_at = body.build_completed_at;

    const { data, error } = await supabase
      .from('javari_build_health_tracking')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
