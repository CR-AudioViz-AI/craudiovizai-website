/**
 * CR AudioViz AI - JavariAI Streaming Response Handler
 * Real-time streaming responses from AI providers
 * @timestamp October 28, 2025 - 12:25 PM EST
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface StreamMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      messages,
      provider = 'openai',
      model,
      temperature = 0.7,
      max_tokens = 2000
    } = body;

    if (!messages || messages.length === 0) {
      return new Response('Messages required', { status: 400 });
    }

    // Create streaming session
    const sessionId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await supabase.from('javari_streaming_sessions').insert({
      id: sessionId,
      user_id: user.id,
      conversation_id: `conv_${Date.now()}`,
      provider: provider,
      model: model,
      status: 'active'
    });

    // Create stream based on provider
    const stream = provider === 'openai' 
      ? await createOpenAIStream(messages, model, temperature, max_tokens, sessionId, supabase, user.id)
      : await createClaudeStream(messages, model, temperature, max_tokens, sessionId, supabase, user.id);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Streaming error:', error);
    return new Response(
      JSON.stringify({ error: 'Streaming failed', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 }
    );
  }
}

async function createOpenAIStream(
  messages: StreamMessage[],
  model: string,
  temperature: number,
  maxTokens: number,
  sessionId: string,
  supabase: any,
  userId: string
): Promise<ReadableStream> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: model,
    messages: messages as any,
    temperature: temperature,
    max_tokens: maxTokens,
    stream: true
  });

  const encoder = new TextEncoder();
  let fullResponse = '';
  let chunksReceived = 0;

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          
          if (content) {
            fullResponse += content;
            chunksReceived++;
            
            // Send chunk to client
            const data = JSON.stringify({
              type: 'chunk',
              content: content,
              sessionId: sessionId
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Update session periodically
          if (chunksReceived % 10 === 0) {
            await supabase
              .from('javari_streaming_sessions')
              .update({ chunks_received: chunksReceived })
              .eq('id', sessionId);
          }
        }

        // Send completion message
        const completion = JSON.stringify({
          type: 'done',
          fullResponse: fullResponse,
          chunksReceived: chunksReceived,
          sessionId: sessionId
        });
        controller.enqueue(encoder.encode(`data: ${completion}\n\n`));

        // Update session as completed
        await supabase
          .from('javari_streaming_sessions')
          .update({
            status: 'completed',
            chunks_received: chunksReceived,
            total_tokens: fullResponse.length / 4, // Rough estimate
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        controller.close();

      } catch (error) {
        console.error('Stream error:', error);
        
        const errorData = JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Stream failed',
          sessionId: sessionId
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));

        // Mark session as aborted
        await supabase
          .from('javari_streaming_sessions')
          .update({
            status: 'aborted',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        controller.close();
      }
    }
  });
}

async function createClaudeStream(
  messages: StreamMessage[],
  model: string,
  temperature: number,
  maxTokens: number,
  sessionId: string,
  supabase: any,
  userId: string
): Promise<ReadableStream> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  
  if (!anthropicKey) {
    throw new Error('Anthropic API key not configured');
  }

  // Convert messages to Claude format
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const claudeMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

  const encoder = new TextEncoder();
  let fullResponse = '';
  let chunksReceived = 0;

  return new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model,
            max_tokens: maxTokens,
            temperature: temperature,
            system: systemMessage,
            messages: claudeMessages,
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error(`Claude API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'content_block_delta') {
                  const content = parsed.delta?.text || '';
                  
                  if (content) {
                    fullResponse += content;
                    chunksReceived++;
                    
                    // Send chunk to client
                    const chunkData = JSON.stringify({
                      type: 'chunk',
                      content: content,
                      sessionId: sessionId
                    });
                    controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
                  }
                }
              } catch (e) {
                // Ignore parse errors for non-JSON lines
              }
            }
          }
        }

        // Send completion message
        const completion = JSON.stringify({
          type: 'done',
          fullResponse: fullResponse,
          chunksReceived: chunksReceived,
          sessionId: sessionId
        });
        controller.enqueue(encoder.encode(`data: ${completion}\n\n`));

        // Update session
        await supabase
          .from('javari_streaming_sessions')
          .update({
            status: 'completed',
            chunks_received: chunksReceived,
            total_tokens: fullResponse.length / 4,
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        controller.close();

      } catch (error) {
        console.error('Claude stream error:', error);
        
        const errorData = JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Stream failed',
          sessionId: sessionId
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));

        await supabase
          .from('javari_streaming_sessions')
          .update({
            status: 'aborted',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        controller.close();
      }
    }
  });
}
