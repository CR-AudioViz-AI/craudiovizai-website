import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ChatWorkLog } from '@/lib/javari-types';

/**
 * GET /api/javari/work/log
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const chatSessionId = searchParams.get('chatSessionId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('javari_chat_work_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (chatSessionId) {
      query = query.eq('chat_session_id', chatSessionId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [], count: data?.length || 0 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/work/log
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.chat_session_id || !body.action_type || !body.action_category || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: chat_session_id, action_type, action_category, description' },
        { status: 400 }
      );
    }

    const workLogData: Partial<ChatWorkLog> = {
      chat_session_id: body.chat_session_id,
      action_type: body.action_type,
      action_category: body.action_category,
      description: body.description,
      impact_level: body.impact_level || 'minor',
      files_affected: body.files_affected,
      lines_added: body.lines_added,
      lines_deleted: body.lines_deleted,
      complexity_added: body.complexity_added,
      tests_added: body.tests_added || false,
      breaking_change: body.breaking_change || false,
      cost_saved: body.cost_saved,
      cost_incurred: body.cost_incurred,
      needs_review: body.needs_review || false,
      review_completed: body.review_completed || false,
      commit_sha: body.commit_sha,
      deploy_url: body.deploy_url
    };

    const { data, error } = await supabase
      .from('javari_chat_work_logs')
      .insert(workLogData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
