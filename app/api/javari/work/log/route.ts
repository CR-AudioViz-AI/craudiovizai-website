import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ChatWorkLog } from '@/lib/javari-types';

export const runtime = 'edge';

/**
 * GET /api/javari/work/log
 * Get work logs for a session
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('javari_chat_work_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sessionId) {
      query = query.eq('chat_session_id', sessionId);
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
    const body = await request.json();

    // Validate required fields
    if (!body.chat_session_id || !body.action_type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: chat_session_id, action_type' 
        },
        { status: 400 }
      );
    }

    // Create work log entry
    const workLogData: Partial<ChatWorkLog> = {
      chat_session_id: body.chat_session_id,
      action_type: body.action_type,
      action_category: body.action_category || 'code',
      description: body.description || '',
      impact_level: body.impact_level || 'moderate',
      files_affected: body.files_affected || [],
      lines_added: body.lines_added || 0,
      lines_deleted: body.lines_deleted || 0,
      complexity_added: body.complexity_added || 0,
      tests_added: body.tests_added || false,
      breaking_change: body.breaking_change || false,
      cost_saved: body.cost_saved || 0,
      cost_incurred: body.cost_incurred || 0,
      needs_review: body.needs_review || false,
      review_completed: body.review_completed || false,
      commit_sha: body.commit_sha || undefined,
      deploy_url: body.deploy_url || undefined
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
