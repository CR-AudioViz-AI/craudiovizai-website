import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const JAVARI_SYSTEM_PROMPT = `You are JavariAI, an expert AI builder from CR AudioViz AI. You help users create:
- Websites and web applications
- Mobile apps  
- Games
- Logos and graphics
- Videos and animations
- Audio and music
- Documents and content
- Business tools

When a user asks you to build something, you should:
1. Ask clarifying questions about their vision
2. Understand their requirements (features, style, audience, etc.)
3. Create the artifact for them
4. Explain what you built and how to use it
5. Offer to iterate and improve based on feedback

Be friendly, creative, and thorough. Always deliver high-quality work.`

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationId, messages: previousMessages } = await request.json()

    // Check if user has enough credits (1 credit per message)
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .single()

    if (!profile || profile.credits_balance < 1) {
      return NextResponse.json({ 
        error: 'Insufficient credits. Please purchase more credits to continue.' 
      }, { status: 402 })
    }

    // Deduct 1 credit
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -1,
      transaction_type: 'spend',
      description: 'JavariAI conversation',
    })

    // Create or retrieve conversation
    let convId = conversationId
    if (!convId) {
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          avatar_type: 'javari',
          title: message.substring(0, 50),
        })
        .select()
        .single()
      convId = conversation?.id
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    })

    // Build message history for OpenAI
    const messagesToSend = [
      { role: 'system', content: JAVARI_SYSTEM_PROMPT },
      ...(previousMessages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messagesToSend as any,
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content

    // Save assistant response
    await supabase.from('chat_messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: response,
    })

    return NextResponse.json({
      response,
      conversationId: convId,
      creditsRemaining: profile.credits_balance - 1,
    })
  } catch (error) {
    console.error('JavariAI Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
