/**
 * CR AudioViz AI - Javari AI Chat API
 * OpenAI-powered streaming chat with credit management
 * @timestamp October 24, 2025 - 6:15 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, conversationId, messages = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Check user credits
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!credits || credits.balance < 1) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        balance: credits?.balance || 0 
      }, { status: 402 });
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 100),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      convId = newConv?.id;
    }

    // Build message history
    const messageHistory: Message[] = [
      {
        role: 'system',
        content: `You are Javari, an advanced AI assistant powering CR AudioViz AI - a comprehensive creative platform. 

You help users:
- Create music, videos, images, and games
- Build websites and applications
- Develop business plans and strategies
- Learn new skills
- Manage social media and marketing
- Write code and solve technical problems

You are knowledgeable, creative, efficient, and always focused on helping users achieve their goals. You provide clear, actionable advice and can generate artifacts like code, documents, and designs.

Current user: ${user.email}
Credits remaining: ${credits.balance}`
      },
      ...messages,
      {
        role: 'user',
        content: message
      }
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Call OpenAI with streaming
          const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: messageHistory,
            temperature: 0.7,
            max_tokens: 2000,
            stream: true,
          });

          let fullResponse = '';

          // Stream the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // Deduct credit
          const newBalance = credits.balance - 1;
          await supabase
            .from('credits')
            .update({ balance: newBalance })
            .eq('user_id', user.id);

          // Record transaction
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: user.id,
              amount: -1,
              type: 'deduction',
              reason: 'Javari AI chat message',
              balance_after: newBalance,
              created_at: new Date().toISOString()
            });

          // Save messages to database
          if (convId) {
            await supabase
              .from('messages')
              .insert([
                {
                  conversation_id: convId,
                  role: 'user',
                  content: message,
                  created_at: new Date().toISOString()
                },
                {
                  conversation_id: convId,
                  role: 'assistant',
                  content: fullResponse,
                  created_at: new Date().toISOString()
                }
              ]);

            // Update conversation
            await supabase
              .from('conversations')
              .update({ 
                updated_at: new Date().toISOString(),
                message_count: supabase.raw('message_count + 2')
              })
              .eq('id', convId);
          }

          // Send final data with conversation ID and new balance
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            done: true, 
            conversationId: convId,
            creditsRemaining: newBalance 
          })}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            error: 'Failed to generate response',
            details: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve conversation history
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      // Return all conversations
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: conversations || []
      });
    } else {
      // Return specific conversation with messages
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (convError) throw convError;

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      return NextResponse.json({
        success: true,
        data: {
          conversation,
          messages: messages || []
        }
      });
    }

  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete conversation
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Delete messages first
    await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    // Delete conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
