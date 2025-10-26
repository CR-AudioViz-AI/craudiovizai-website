import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ChatWorkLog, CreateWorkLogRequest } from '@/lib/javari-types';

/**
 * GET /api/javari/work/log
 * Get work logs for a session, subproject, or project
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const subprojectId = searchParams.get('subprojectId');
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('javari_chat_work_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else if (subprojectId) {
      query = query.eq('sub_project_id', subprojectId);
    } else if (projectId) {
      query = query.eq('project_id', projectId);
    }

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

  } catch (error) {
    console.error('GET /api/javari/work/log error:', error);
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
 * POST /api/javari/work/log
 * Log work performed in a chat session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: CreateWorkLogRequest = await request.json();

    // Validate required fields
    if (!body.session_id || !body.project_id || !body.action_type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: session_id, project_id, action_type' 
        },
        { status: 400 }
      );
    }

    // Create work log entry
    const workLogData: Partial<ChatWorkLog> = {
      session_id: body.session_id,
      project_id: body.project_id,
      sub_project_id: body.sub_project_id || null,
      action_type: body.action_type,
      description: body.description || null,
      files_modified: body.files_modified || [],
      code_changes: body.code_changes || null,
      tokens_used: body.tokens_used || 0,
      cost_usd: body.cost_usd || 0,
      execution_time_ms: body.execution_time_ms || null,
      success: body.success !== undefined ? body.success : true,
      error_message: body.error_message || null,
      metadata: body.metadata || {}
    };

    const { data, error } = await supabase
      .from('javari_chat_work_logs')
      .insert(workLogData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Update counters in related entities
    const updates = [];

    // Update session stats
    updates.push(
      supabase.rpc('update_session_stats', {
        session_id: body.session_id,
        tokens: body.tokens_used || 0,
        cost: body.cost_usd || 0
      })
    );

    // Update project stats
    updates.push(
      supabase.rpc('update_project_stats', {
        project_id: body.project_id,
        work_logs: 1,
        tokens: body.tokens_used || 0,
        cost: body.cost_usd || 0
      })
    );

    // Update subproject stats if applicable
    if (body.sub_project_id) {
      updates.push(
        supabase.rpc('update_subproject_stats', {
          subproject_id: body.sub_project_id,
          work_logs: 1,
          tokens: body.tokens_used || 0,
          cost: body.cost_usd || 0
        })
      );
    }

    // Execute all updates in parallel
    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/javari/work/log error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
