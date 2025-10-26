import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CREDIT_COSTS } from '@/lib/constants/credits';

export const runtime = 'edge';

// FIX: Lazy initialization of OpenAI client to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

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
    const supabase = createClient(); // FIXED: Remove await
    
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
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    const currentCredits = customer?.credits || 0;
    const cost = CREDIT_COSTS.javari_chat;

    if (currentCredits < cost) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: cost,
          available: currentCredits,
          shortfall: cost - currentCredits
        },
        { status: 402 }
      );
    }

    // Build messages array
    const messages = [
      { role: 'system', content: JAVARI_SYSTEM_PROMPT },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const openai = getOpenAIClient(); // Get client at runtime

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Deduct credits AFTER successful API call
    const { error: deductError } = await supabase
      .from('stripe_customers')
      .update({
        credits: currentCredits - cost,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (deductError) {
      console.error('Error deducting credits:', deductError);
      // Note: API call succeeded but credit deduction failed
      // You may want to implement a credit reconciliation system
    }

    // Log the conversation if conversationId exists
    if (conversationId) {
      await supabase
        .from('javari_conversations')
        .update({
          messages: [
            ...conversationHistory,
            { role: 'user', content: message, timestamp: new Date().toISOString() },
            { role: 'assistant', content: response, timestamp: new Date().toISOString() }
          ],
          token_count: (conversationHistory.reduce((sum: number, msg: any) => sum + (msg.tokens || 0), 0)) + tokensUsed,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .eq('user_id', user.id);
    } else {
      // Create new conversation
      await supabase
        .from('javari_conversations')
        .insert({
          user_id: user.id,
          title: message.slice(0, 100),
          messages: [
            { role: 'user', content: message, timestamp: new Date().toISOString() },
            { role: 'assistant', content: response, timestamp: new Date().toISOString() }
          ],
          token_count: tokensUsed,
          credits_used: cost
        });
    }

    return NextResponse.json({
      response,
      creditsUsed: cost,
      creditsRemaining: currentCredits - cost,
      tokensUsed,
      conversationId
    });

  } catch (error: any) {
    console.error('Error in Javari chat:', error);
    
    // Handle OpenAI-specific errors
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process chat',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/javari/chat
 * Get conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(); // FIXED: Remove await
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (conversationId) {
      // Get specific conversation
      const { data: conversation, error } = await supabase
        .from('javari_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(conversation);
    } else {
      // Get all conversations for user
      const { data: conversations, error } = await supabase
        .from('javari_conversations')
        .select('id, title, created_at, updated_at, token_count, credits_used')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json(
          { error: 'Failed to fetch conversations' },
          { status: 500 }
        );
      }

      return NextResponse.json({ conversations: conversations || [] });
    }
  } catch (error) {
    console.error('Error in GET conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/javari/chat
 * Delete a conversation
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(); // FIXED: Remove await
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('javari_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting conversation:', error);
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
