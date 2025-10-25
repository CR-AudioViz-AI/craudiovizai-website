import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * Social Media Post Creator API
 * Generate engaging social media content using OpenAI
 * 
 * Features:
 * - Platform-specific optimization
 * - Tone customization
 * - Hashtag generation
 * - Multiple variations
 * 
 * Session: 2025-10-25 - Saturday
 */

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PostGenerationRequest {
  topic: string;
  platform: string;
  tone: string;
  include_hashtags: boolean;
  include_emojis: boolean;
}

async function getSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

async function verifyAuth() {
  const supabase = await getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

async function deductCredits(userId: string, amount: number) {
  const supabase = await getSupabaseClient();
  
  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('total_credits')
    .eq('user_id', userId)
    .single();

  if (fetchError || !profile) {
    throw new Error('Failed to fetch user profile');
  }

  if (profile.total_credits < amount) {
    throw new Error('Insufficient credits');
  }

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ total_credits: profile.total_credits - amount })
    .eq('user_id', userId);

  if (updateError) {
    throw new Error('Failed to deduct credits');
  }

  return profile.total_credits - amount;
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: PostGenerationRequest = await req.json();
    const { topic, platform, tone, include_hashtags, include_emojis } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Credits: 5 per post generation
    const creditsUsed = 5;
    const remainingCredits = await deductCredits(user.id, creditsUsed);

    // Platform-specific guidelines
    const platformGuidelines: Record<string, string> = {
      twitter: 'Keep it concise and impactful (max 280 characters). Use thread-worthy hooks.',
      linkedin: 'Professional tone, longer form content (up to 3000 chars). Focus on insights and value.',
      instagram: 'Visual-first, engaging captions. Use line breaks for readability.',
      facebook: 'Conversational and community-focused. Encourage engagement.',
    };

    // Build prompt
    const prompt = `Create 3 engaging social media posts about: ${topic}

Platform: ${platform}
Guidelines: ${platformGuidelines[platform] || 'Generic social media best practices'}
Tone: ${tone}
${include_emojis ? 'Include relevant emojis naturally throughout the text.' : 'Do not use emojis.'}
${include_hashtags ? 'Suggest 3-5 relevant hashtags at the end.' : 'Do not include hashtags.'}

Format each post as:
POST 1:
[content]
HASHTAGS: [comma-separated list]

POST 2:
[content]
HASHTAGS: [comma-separated list]

POST 3:
[content]
HASHTAGS: [comma-separated list]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media content creator. Create engaging, platform-optimized posts that drive engagement.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse the response
    const posts = [];
    const postMatches = responseText.matchAll(/POST \d+:\s*([\s\S]*?)(?=HASHTAGS:|POST \d+:|$)/g);
    const hashtagMatches = responseText.matchAll(/HASHTAGS:\s*(.+?)(?=\n\nPOST|\n*$)/g);

    const postContents = Array.from(postMatches).map(match => match[1].trim());
    const hashtagLists = Array.from(hashtagMatches).map(match => 
      match[1].split(',').map(tag => tag.trim().replace(/^#/, ''))
    );

    for (let i = 0; i < Math.min(postContents.length, 3); i++) {
      posts.push({
        content: postContents[i],
        hashtags: include_hashtags ? (hashtagLists[i] || []) : [],
      });
    }

    // Log generation
    const supabase = await getSupabaseClient();
    await supabase.from('generation_history').insert({
      user_id: user.id,
      tool_name: 'social-media-post',
      credits_used: creditsUsed,
      input_data: { topic, platform, tone },
      output_data: { posts_count: posts.length },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      posts,
      credits_used: creditsUsed,
      remaining_credits: remainingCredits,
    });

  } catch (error: any) {
    console.error('Post generation error:', error);
    
    if (error.message === 'Insufficient credits') {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate post' },
      { status: 500 }
    );
  }
}
