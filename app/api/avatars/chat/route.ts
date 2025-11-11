// ================================================================================
// CR AUDIOVIZ AI - AVATAR CHAT API
// Handles AI-powered conversations with avatars
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { avatarId, message, systemPrompt, conversationHistory } = body;

    if (!avatarId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user credits
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', session.user.id)
      .single();

    if (!credits || credits.balance < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: systemPrompt || 'You are a helpful AI assistant.'
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API (using GPT-4 for high quality)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed');
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0].message.content;

    // Deduct credits (1 credit per message)
    await supabase
      .from('credits')
      .update({ 
        balance: credits.balance - 1,
        total_used: supabase.rpc('increment', { x: 1 })
      })
      .eq('user_id', session.user.id);

    // Log usage
    await supabase
      .from('javari_usage')
      .insert({
        user_id: session.user.id,
        prompt_tokens: openaiData.usage?.prompt_tokens || 0,
        completion_tokens: openaiData.usage?.completion_tokens || 0,
        total_tokens: openaiData.usage?.total_tokens || 0,
        status: 'success'
      });

    return NextResponse.json({
      response: aiResponse,
      creditsRemaining: credits.balance - 1
    });

  } catch (error: unknown) {
    logError('Avatar chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}