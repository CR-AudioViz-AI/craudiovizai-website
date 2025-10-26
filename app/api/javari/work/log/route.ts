/**
 * Javari AI - Work Log API
 * Automatic work tracking and metrics
 * Route: /api/javari/work/log
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createWorkLog, updateChatSession, queueCodeReview } from '@/lib/javari-db';
import { analyzeCodeQuality } from '@/lib/javari-ai';
import type { LogWorkRequest, ChatWorkLog } from '@/lib/javari-types';

export const runtime = 'nodejs';

/**
 * POST /api/javari/work/log
 * Log a work action and update chat metrics
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: LogWorkRequest = await request.json();
    const {
      chat_session_id,
      action_type,
      action_category,
      description,
      files_affected = [],
      lines_added = 0,
      lines_deleted = 0,
      cost_saved = 0,
      cost_incurred = 0,
      commit_sha,
      deploy_url
    } = body;

    // Validate required fields
    if (!chat_session_id || !action_type || !action_category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate complexity (simple heuristic)
    const complexity = Math.min(100, 
      (lines_added + lines_deleted) / 10 + files_affected.length * 5
    );

    // Determine impact level
    let impact_level: ChatWorkLog['impact_level'] = 'minor';
    if (lines_added + lines_deleted > 500 || files_affected.length > 10) {
      impact_level = 'critical';
    } else if (lines_added + lines_deleted > 200 || files_affected.length > 5) {
      impact_level = 'major';
    } else if (lines_added + lines_deleted > 50 || files_affected.length > 2) {
      impact_level = 'moderate';
    }

    // Determine if code review is needed
    const needs_review = (
      lines_added + lines_deleted > 50 ||
      action_type === 'api_created' ||
      action_category === 'infrastructure'
    );

    // Create work log
    const { data: workLog, error: logError } = await createWorkLog({
      chat_session_id,
      action_type,
      action_category,
      description,
      impact_level,
      files_affected,
      lines_added,
      lines_deleted,
      complexity_added: complexity,
      tests_added: action_type === 'test_written',
      breaking_change: impact_level === 'critical',
      cost_saved,
      cost_incurred,
      needs_review,
      review_completed: false,
      commit_sha,
      deploy_url
    });

    if (logError || !workLog) {
      console.error('Error creating work log:', logError);
      return NextResponse.json(
        { error: 'Failed to log work' },
        { status: 500 }
      );
    }

    // Update chat session metrics
    const { data: chat } = await supabase
      .from('javari_chat_sessions')
      .select('*')
      .eq('id', chat_session_id)
      .single();

    if (chat) {
      const updates: any = {
        lines_of_code_added: chat.lines_of_code_added + lines_added,
        lines_of_code_deleted: chat.lines_of_code_deleted + lines_deleted,
        estimated_cost_saved: chat.estimated_cost_saved + cost_saved,
        actual_cost_incurred: chat.actual_cost_incurred + cost_incurred
      };

      if (action_type === 'file_created') {
        updates.files_created = chat.files_created + 1;
      } else if (action_type === 'file_modified') {
        updates.files_modified = chat.files_modified + 1;
      } else if (action_type === 'api_created') {
        updates.apis_created = chat.apis_created + 1;
      } else if (action_type === 'test_written') {
        updates.tests_written = chat.tests_written + 1;
      }

      await updateChatSession(chat_session_id, updates);
    }

    // Queue code review if needed
    if (needs_review && files_affected.length > 0) {
      try {
        // Get project from chat
        const { data: project } = await supabase
          .from('javari_chat_sessions')
          .select('project_id')
          .eq('id', chat_session_id)
          .single();

        if (project) {
          await queueCodeReview({
            project_id: project.project_id,
            chat_session_id,
            file_path: files_affected[0],
            lines_changed: lines_added + lines_deleted,
            priority: impact_level === 'critical' ? 'urgent' : 'normal',
            status: 'pending'
          });
        }
      } catch (reviewError) {
        console.error('Error queueing code review:', reviewError);
        // Don't fail the request if review queueing fails
      }
    }

    return NextResponse.json({
      success: true,
      work_log: workLog,
      metrics_updated: true,
      review_queued: needs_review
    }, { status: 201 });

  } catch (error) {
    console.error('Error in work log:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/javari/work/log
 * Get work logs for a chat session
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const chatSessionId = searchParams.get('chat_session_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!chatSessionId) {
      return NextResponse.json(
        { error: 'chat_session_id required' },
        { status: 400 }
      );
    }

    // Get work logs
    const { data: workLogs, error } = await supabase
      .from('javari_chat_work_logs')
      .select('*')
      .eq('chat_session_id', chatSessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching work logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch work logs' },
        { status: 500 }
      );
    }

    // Calculate summary metrics
    const summary = {
      total_actions: workLogs?.length || 0,
      total_lines_added: workLogs?.reduce((sum, log) => sum + log.lines_added, 0) || 0,
      total_lines_deleted: workLogs?.reduce((sum, log) => sum + log.lines_deleted, 0) || 0,
      files_affected: new Set(workLogs?.flatMap(log => log.files_affected) || []).size,
      total_cost_saved: workLogs?.reduce((sum, log) => sum + (log.cost_saved || 0), 0) || 0,
      total_cost_incurred: workLogs?.reduce((sum, log) => sum + (log.cost_incurred || 0), 0) || 0,
      actions_by_type: workLogs?.reduce((acc, log) => {
        acc[log.action_type] = (acc[log.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {}
    };

    return NextResponse.json({
      work_logs: workLogs || [],
      summary
    });

  } catch (error) {
    console.error('Error in GET work logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
