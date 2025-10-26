/**
 * Javari AI - Chat Continuation API
 * Intelligent chat continuation with context preservation
 * Route: /api/javari/chats/continue
 * 
 * FIXED: Added explicit type annotation to resolve TypeScript circular reference error
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getChatSession, createChatSession, updateChatSession, listWorkLogs } from '@/lib/javari-db';
import { generateContextSummary } from '@/lib/javari-ai';
import type { ContinueChatRequest, ContinueChatResponse, JavariChatSession } from '@/lib/javari-types';

export const runtime = 'edge';

/**
 * POST /api/javari/chats/continue
 * Create a new chat session as a continuation of the current one
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ContinueChatRequest = await request.json();
    const { chat_session_id, reason, preserve_context } = body;

    if (!chat_session_id) {
      return NextResponse.json(
        { error: 'chat_session_id required' },
        { status: 400 }
      );
    }

    // Get current chat session
    const { data: currentChat, error: chatError } = await getChatSession(chat_session_id);
    if (chatError || !currentChat) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    // Get work logs
    const { data: workLogs } = await listWorkLogs(chat_session_id);

    // Generate AI summary of the session
    let contextSummary = '';
    if (preserve_context && workLogs && workLogs.length > 0) {
      try {
        contextSummary = await generateContextSummary(currentChat, workLogs);
      } catch (error) {
        console.error('Error generating context summary:', error);
        contextSummary = 'Error generating summary - manual review recommended';
      }
    }

    // FIX: Explicitly type the session data as Partial<JavariChatSession>
    const newSessionData: Partial<JavariChatSession> = {
      project_id: currentChat.project_id,
      subproject_id: currentChat.subproject_id,
      user_id: user.id,
      title: `${currentChat.title} (continued)`,
      priority: currentChat.priority,
      
      // Continuation chain
      parent_chat_id: chat_session_id,
      continuation_depth: (currentChat.continuation_depth || 0) + 1,
      context_summary: contextSummary,
      
      // Transfer credentials
      credentials_snapshot: currentChat.credentials_snapshot,
      
      // Reset metrics
      token_count: 0,
      message_count: 0,
      lines_of_code_added: 0,
      lines_of_code_deleted: 0,
      files_created: 0,
      files_modified: 0,
      apis_created: 0,
      tests_written: 0,
      estimated_cost_saved: 0,
      actual_cost_incurred: 0,
      issues_identified: 0,
      issues_resolved: 0,
      
      // Status
      status: 'active',
      starred: false,
      
      started_at: new Date().toISOString()
    };

    // Create new chat session as a continuation
    const { data: newChat, error: createError } = await createChatSession(newSessionData);

    if (createError || !newChat) {
      console.error('Error creating new chat:', createError);
      return NextResponse.json(
        { error: 'Failed to create continuation chat' },
        { status: 500 }
      );
    }

    // Mark current chat as continued
    await updateChatSession(chat_session_id, {
      status: 'continued',
      ended_at: new Date().toISOString()
    });

    // Prepare response
    const response: ContinueChatResponse = {
      new_chat_id: newChat.id,
      context_summary: contextSummary,
      credentials_transferred: true,
      continuation_url: `/chats/${newChat.id}`,
      previous_metrics: {
        token_count: currentChat.token_count,
        message_count: currentChat.message_count,
        issues_identified: currentChat.issues_identified,
        issues_resolved: currentChat.issues_resolved
      }
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error in chat continuation:', error);
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
 * GET /api/javari/chats/continue
 * Get continuation chain for a chat session
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const chatId = searchParams.get('id');

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID required' },
        { status: 400 }
      );
    }

    // Get chat and its entire continuation chain
    const { data: chats, error } = await supabase
      .from('javari_chat_sessions')
      .select('id, title, parent_chat_id, continuation_depth, status, created_at')
      .or(`id.eq.${chatId},parent_chat_id.eq.${chatId}`)
      .order('continuation_depth', { ascending: true });

    if (error) {
      console.error('Error fetching continuation chain:', error);
      return NextResponse.json(
        { error: 'Failed to fetch continuation chain' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      chats: chats || [],
      total: chats?.length || 0
    });

  } catch (error) {
    console.error('Error in GET continuation chain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
