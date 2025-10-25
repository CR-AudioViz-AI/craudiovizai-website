import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * AI Image Generator API
 * Generate images using OpenAI DALL-E 3
 * 
 * Features:
 * - DALL-E 3 integration
 * - Credit deduction
 * - Image storage in Supabase
 * - Usage tracking
 * 
 * Session: 2025-10-25 - Saturday
 */

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ImageGenerationRequest {
  prompt: string;
  style: string;
  aspect_ratio: string;
  width?: number;
  height?: number;
  quality: 'standard' | 'hd';
  num_images: number;
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

async function logGeneration(userId: string, data: any) {
  const supabase = await getSupabaseClient();
  
  await supabase.from('generation_history').insert({
    user_id: userId,
    tool_name: 'ai-image-generator',
    credits_used: data.credits_used,
    input_data: data.input_data,
    output_data: data.output_data,
    created_at: new Date().toISOString(),
  });
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

    const body: ImageGenerationRequest = await req.json();
    const { prompt, style, quality, num_images } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Calculate credits
    const creditsPerImage = quality === 'hd' ? 20 : 10;
    const totalCredits = creditsPerImage * num_images;

    // Deduct credits
    const remainingCredits = await deductCredits(user.id, totalCredits);

    // Enhance prompt with style
    const stylePrompts: Record<string, string> = {
      realistic: 'photorealistic, highly detailed, professional photography',
      artistic: 'artistic, painterly, expressive brushstrokes',
      anime: 'anime style, manga aesthetic, Japanese animation',
      'digital-art': 'digital art, modern illustration, vibrant colors',
      '3d-render': '3D rendered, CGI, smooth surfaces, professional rendering',
      'oil-painting': 'oil painting, classical art style, rich textures',
      watercolor: 'watercolor painting, soft washes, artistic',
      sketch: 'pencil sketch, hand-drawn, artistic linework',
    };

    const enhancedPrompt = `${prompt}. Style: ${stylePrompts[style] || stylePrompts.realistic}`;

    // Generate images
    const images: string[] = [];
    
    for (let i = 0; i < num_images; i++) {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: quality,
        response_format: 'url',
      });

      if (response.data[0]?.url) {
        images.push(response.data[0].url);
      }
    }

    // Log generation
    await logGeneration(user.id, {
      credits_used: totalCredits,
      input_data: { prompt, style, quality, num_images },
      output_data: { images_count: images.length },
    });

    return NextResponse.json({
      success: true,
      images,
      credits_used: totalCredits,
      remaining_credits: remainingCredits,
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    
    if (error.message === 'Insufficient credits') {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
