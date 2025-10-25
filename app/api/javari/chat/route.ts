import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CREDIT_COSTS } from '@/lib/constants/credits';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JAVARI_SYSTEM_PROMPT = `You are Javari, an expert AI Master Builder created by CR AudioViz AI. Your specialty is building complete, production-ready applications through conversation.

**Your Capabilities:**
- Build websites, web apps, mobile apps, games, and business tools
- Write clean, production-ready code in multiple languages
- Integrate APIs, databases, authentication, and payments
- Create responsive, accessible user interfaces
- Provide detailed explanations and documentation

**Your Personality:**
- Professional but friendly and approachable
- Patient and thorough in explanations
- Enthusiastic about building great products
- Honest about limitations or challenges

**Your Approach:**
1. Ask clarifying questions to understand requirements
2. Suggest best practices and modern technologies
3. Build incrementally with user feedback
4. Provide complete, working code - never partial snippets
5. Explain your decisions and alternatives

When building applications:
- Use Next.js 14 for web apps (App Router)
- Use Tailwind CSS and shadcn/ui for styling
- Use Supabase for database and authentication
- Use TypeScript for type safety
- Follow accessibility standards (WCAG 2.1 AA)
- Write clean, maintainable, well-documented code

Always be helpful, creative, and focused on delivering real value to users.`;

/**
 * POST /api/javari/chat
 * Process chat message with credit management
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, conversationHistory = [], conversationId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check credit balance BEFORE processing
    const { data: customer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (customerError) {
      console.error('Error fetching customer:', customerError);
      return NextResponse.json(
        { error: 'Failed to check credits' },
        { status: 500 }
      );
    }

    const currentCredits = customer?.credits || 0;

    // Check if user has enough credits for a basic message
    if (currentCredits < CREDIT_COSTS.JAVARI_MESSAGE) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          required: CREDIT_COSTS.JAVARI_MESSAGE,
          current: currentCredits,
          message: 'You need at least 1 credit to chat with Javari. Please purchase more credits to continue.'
        },
        { status: 402 } // Payment Required
      );
    }

    // Build messages array for OpenAI
    const messages: any[] = [
      { role: 'system', content: JAVARI_SYSTEM_PROMPT }
    ];

    // Add conversation history
    if (conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI API with streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    // Create readable stream for response
    const encoder = new TextEncoder();
    let fullResponse = '';
    let tokenCount = 0;

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
            tokenCount += content.length / 4; // Rough estimate

            // Send chunk to client
            const data = JSON.stringify({ content });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Response complete - determine credit cost
          let creditCost = CREDIT_COSTS.JAVARI_MESSAGE;
          let action = 'message';

          // Check if response is long
          if (tokenCount > 1000) {
            creditCost = CREDIT_COSTS.JAVARI_LONG_RESPONSE;
            action = 'long_response';
          }

          // Check if response contains code
          if (fullResponse.includes('```')) {
            creditCost = CREDIT_COSTS.JAVARI_CODE_GENERATION;
            action = 'code_generation';
          }

          // Deduct credits
          const newBalance = currentCredits - creditCost;
          await supabase
            .from('stripe_customers')
            .update({ credits: newBalance })
            .eq('user_id', user.id);

          // Log transaction
          await supabase
            .from('credit_transactions')
            .insert({
              user_id: user.id,
              amount: -creditCost,
              type: 'deduction',
              description: `Javari AI: ${action}`,
              metadata: {
                conversationId,
                messageLength: message.length,
                responseLength: fullResponse.length,
                estimatedTokens: tokenCount
              },
              balance_after: newBalance
            });

          // Save conversation if conversationId provided
          if (conversationId) {
            await supabase
              .from('javari_conversations')
              .upsert({
                id: conversationId,
                user_id: user.id,
                updated_at: new Date().toISOString()
              });

            // Save messages
            await supabase
              .from('javari_messages')
              .insert([
                {
                  conversation_id: conversationId,
                  role: 'user',
                  content: message
                },
                {
                  conversation_id: conversationId,
                  role: 'assistant',
                  content: fullResponse
                }
              ]);
          }

          // Send final metadata
          const metadata = JSON.stringify({
            done: true,
            creditsUsed: creditCost,
            creditsRemaining: newBalance,
            action
          });
          controller.enqueue(encoder.encode(`data: ${metadata}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          const errorData = JSON.stringify({ 
            error: error instanceof Error ? error.message : 'Stream error' 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/javari/chat?conversationId=xxx
 * Get conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      // Get all conversations for user
      const { data: conversations, error } = await supabase
        .from('javari_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json(
          { error: 'Failed to fetch conversations' },
          { status: 500 }
        );
      }

      return NextResponse.json({ conversations });
    }

    // Get specific conversation with messages
    const { data: conversation, error: convError } = await supabase
      .from('javari_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (convError) {
      console.error('Error fetching conversation:', convError);
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const { data: messages, error: msgError } = await supabase
      .from('javari_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError) {
      console.error('Error fetching messages:', msgError);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      conversation,
      messages
    });

  } catch (error) {
    console.error('Error in chat GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
