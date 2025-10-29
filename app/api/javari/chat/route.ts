/**
 * CR AudioViz AI - JavariAI Multi-Provider Chat API
 * Supports OpenAI, Claude, Gemini, and Mistral with autonomous learning
 * @timestamp October 28, 2025 - 11:47 AM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extended for AI responses

// AI Provider configurations
const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    pricing: {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    }
  },
  anthropic: {
    name: 'Claude (Anthropic)',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    pricing: {
      'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 }
    }
  },
  google: {
    name: 'Google Gemini',
    models: ['gemini-pro', 'gemini-pro-vision'],
    pricing: {
      'gemini-pro': { input: 0.0005, output: 0.0015 },
      'gemini-pro-vision': { input: 0.0005, output: 0.0015 }
    }
  },
  mistral: {
    name: 'Mistral AI',
    models: ['mistral-large-latest', 'mistral-medium-latest'],
    pricing: {
      'mistral-large-latest': { input: 0.004, output: 0.012 },
      'mistral-medium-latest': { input: 0.0027, output: 0.0081 }
    }
  }
} as const;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  provider: keyof typeof AI_PROVIDERS;
  model: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface UsageStats {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  provider: string;
  model: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const body = await request.json() as ChatRequest;
    const { 
      messages, 
      provider = 'openai', 
      model, 
      temperature = 0.7, 
      max_tokens = 2000,
      stream = false 
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    // Validate provider and model
    if (!AI_PROVIDERS[provider]) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    const providerConfig = AI_PROVIDERS[provider];
    const selectedModel = model || providerConfig.models[0];

    if (!providerConfig.models.includes(selectedModel)) {
      return NextResponse.json({ error: 'Invalid model for provider' }, { status: 400 });
    }

    // Check user's AI credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_credits, subscription_tier')
      .eq('id', user.id)
      .single();

    if (!profile || profile.ai_credits <= 0) {
      return NextResponse.json({ 
        error: 'Insufficient AI credits',
        credits_remaining: profile?.ai_credits || 0
      }, { status: 402 });
    }

    // Route to appropriate AI provider
    let response;
    let usage: UsageStats;

    try {
      switch (provider) {
        case 'openai':
          ({ response, usage } = await callOpenAI(messages, selectedModel, temperature, max_tokens));
          break;
        case 'anthropic':
          ({ response, usage } = await callClaude(messages, selectedModel, temperature, max_tokens));
          break;
        case 'google':
          ({ response, usage } = await callGemini(messages, selectedModel, temperature, max_tokens));
          break;
        case 'mistral':
          ({ response, usage } = await callMistral(messages, selectedModel, temperature, max_tokens));
          break;
        default:
          throw new Error('Provider not implemented');
      }
    } catch (providerError) {
      // Self-healing: Try fallback provider
      console.error(`Provider ${provider} failed, attempting fallback...`, providerError);
      
      const fallbackProvider = provider === 'openai' ? 'anthropic' : 'openai';
      const fallbackModel = AI_PROVIDERS[fallbackProvider].models[0];
      
      if (fallbackProvider === 'anthropic') {
        ({ response, usage } = await callClaude(messages, fallbackModel, temperature, max_tokens));
      } else {
        ({ response, usage } = await callOpenAI(messages, fallbackModel, temperature, max_tokens));
      }
      
      usage.provider = `${fallbackProvider} (fallback)`;
    }

    // Deduct AI credits (1 credit per request)
    const { error: creditError } = await supabase
      .from('profiles')
      .update({ 
        ai_credits: profile.ai_credits - 1,
        last_ai_usage: new Date().toISOString()
      })
      .eq('id', user.id);

    if (creditError) {
      console.error('Credit deduction error:', creditError);
    }

    // Store conversation in database
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await supabase.from('javari_conversations').insert({
      id: conversationId,
      user_id: user.id,
      provider: usage.provider,
      model: usage.model,
      messages: messages,
      response: response,
      tokens_used: usage.total_tokens,
      cost: usage.cost,
      created_at: new Date().toISOString()
    });

    // Store usage analytics
    await supabase.from('javari_usage_stats').insert({
      user_id: user.id,
      provider: usage.provider,
      model: usage.model,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      total_tokens: usage.total_tokens,
      cost: usage.cost,
      success: true,
      created_at: new Date().toISOString()
    });

    // Autonomous learning: Track successful patterns
    await trackLearningPattern(supabase, user.id, messages, response, usage);

    return NextResponse.json({
      success: true,
      response: response,
      usage: usage,
      credits_remaining: profile.ai_credits - 1,
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('JavariAI error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OpenAI Integration
async function callOpenAI(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  max_tokens: number
): Promise<{ response: string; usage: UsageStats }> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: model,
    messages: messages as any,
    temperature: temperature,
    max_tokens: max_tokens,
  });

  const responseText = completion.choices[0]?.message?.content || '';
  const inputTokens = completion.usage?.prompt_tokens || 0;
  const outputTokens = completion.usage?.completion_tokens || 0;
  const totalTokens = completion.usage?.total_tokens || 0;

  const pricing = AI_PROVIDERS.openai.pricing[model as keyof typeof AI_PROVIDERS.openai.pricing];
  const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output);

  return {
    response: responseText,
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      cost: Math.round(cost * 10000) / 10000,
      provider: 'openai',
      model: model
    }
  };
}

// Claude (Anthropic) Integration
async function callClaude(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  max_tokens: number
): Promise<{ response: string; usage: UsageStats }> {
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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      system: systemMessage,
      messages: claudeMessages
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const responseText = data.content[0]?.text || '';
  const inputTokens = data.usage?.input_tokens || 0;
  const outputTokens = data.usage?.output_tokens || 0;
  const totalTokens = inputTokens + outputTokens;

  const pricing = AI_PROVIDERS.anthropic.pricing[model as keyof typeof AI_PROVIDERS.anthropic.pricing];
  const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output);

  return {
    response: responseText,
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      cost: Math.round(cost * 10000) / 10000,
      provider: 'anthropic',
      model: model
    }
  };
}

// Google Gemini Integration
async function callGemini(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  max_tokens: number
): Promise<{ response: string; usage: UsageStats }> {
  const geminiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!geminiKey) {
    throw new Error('Google AI API key not configured');
  }

  // Convert messages to Gemini format
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

  const systemInstruction = messages.find(m => m.role === 'system')?.content;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: max_tokens
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const responseText = data.candidates[0]?.content?.parts[0]?.text || '';
  
  // Gemini doesn't provide exact token counts, estimate them
  const inputTokens = Math.ceil(messages.reduce((sum, m) => sum + m.content.length, 0) / 4);
  const outputTokens = Math.ceil(responseText.length / 4);
  const totalTokens = inputTokens + outputTokens;

  const pricing = AI_PROVIDERS.google.pricing[model as keyof typeof AI_PROVIDERS.google.pricing];
  const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output);

  return {
    response: responseText,
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      cost: Math.round(cost * 10000) / 10000,
      provider: 'google',
      model: model
    }
  };
}

// Mistral AI Integration
async function callMistral(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  max_tokens: number
): Promise<{ response: string; usage: UsageStats }> {
  const mistralKey = process.env.MISTRAL_API_KEY;
  
  if (!mistralKey) {
    throw new Error('Mistral API key not configured');
  }

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mistralKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral API error: ${error}`);
  }

  const data = await response.json();
  const responseText = data.choices[0]?.message?.content || '';
  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;
  const totalTokens = data.usage?.total_tokens || 0;

  const pricing = AI_PROVIDERS.mistral.pricing[model as keyof typeof AI_PROVIDERS.mistral.pricing];
  const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output);

  return {
    response: responseText,
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      cost: Math.round(cost * 10000) / 10000,
      provider: 'mistral',
      model: model
    }
  };
}

// Autonomous Learning: Track successful patterns
async function trackLearningPattern(
  supabase: any,
  userId: string,
  messages: ChatMessage[],
  response: string,
  usage: UsageStats
) {
  try {
    // Identify conversation patterns
    const conversationType = classifyConversation(messages);
    const responseQuality = assessResponseQuality(response, usage);

    await supabase.from('javari_learning_patterns').insert({
      user_id: userId,
      conversation_type: conversationType,
      message_count: messages.length,
      avg_message_length: Math.round(messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length),
      response_length: response.length,
      response_quality: responseQuality,
      provider: usage.provider,
      model: usage.model,
      tokens_used: usage.total_tokens,
      cost_efficiency: usage.cost / usage.total_tokens,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Learning pattern tracking error:', error);
    // Don't fail the main request if learning fails
  }
}

function classifyConversation(messages: ChatMessage[]): string {
  const content = messages.map(m => m.content.toLowerCase()).join(' ');
  
  if (content.includes('code') || content.includes('function') || content.includes('debug')) {
    return 'technical';
  } else if (content.includes('create') || content.includes('design') || content.includes('build')) {
    return 'creative';
  } else if (content.includes('analyze') || content.includes('report') || content.includes('data')) {
    return 'analytical';
  } else if (content.includes('help') || content.includes('how') || content.includes('what')) {
    return 'support';
  }
  
  return 'general';
}

function assessResponseQuality(response: string, usage: UsageStats): number {
  // Simple quality heuristic based on response length vs cost
  const responseLength = response.length;
  const costPerChar = usage.cost / responseLength;
  
  // Better quality = more content per dollar
  if (costPerChar < 0.0001) return 5; // Excellent
  if (costPerChar < 0.0005) return 4; // Good
  if (costPerChar < 0.001) return 3; // Average
  if (costPerChar < 0.005) return 2; // Below average
  return 1; // Poor
}

// GET endpoint for fetching conversation history
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: conversations, error } = await supabase
      .from('javari_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      conversations: conversations || [],
      limit,
      offset
    });

  } catch (error) {
    console.error('Conversation fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
