// CR AUDIOVIZ AI - Image Resizer API
// Session: 2025-10-25 - Phase 4
// Purpose: Process image resizing requests

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const CREDITS_REQUIRED = 5;

// POST: Resize image
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check user has enough credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    if (profile.credits_balance < CREDITS_REQUIRED) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          required: CREDITS_REQUIRED,
          available: profile.credits_balance
        },
        { status: 402 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const options = JSON.parse(optionsStr);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image with Sharp
    let image = sharp(buffer);

    // Get original metadata
    const metadata = await image.metadata();

    // Calculate dimensions
    let { width, height, maintainAspectRatio, quality, format } = options;

    if (maintainAspectRatio && metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      if (width && !height) {
        height = Math.round(width / aspectRatio);
      } else if (height && !width) {
        width = Math.round(height * aspectRatio);
      }
    }

    // Resize image
    image = image.resize(width, height, {
      fit: maintainAspectRatio ? 'inside' : 'fill',
      withoutEnlargement: false
    });

    // Convert to requested format
    let resizedBuffer: Buffer;
    
    switch (format) {
      case 'jpeg':
        resizedBuffer = await image.jpeg({ quality }).toBuffer();
        break;
      case 'png':
        resizedBuffer = await image.png({ quality: Math.round(quality / 10) }).toBuffer();
        break;
      case 'webp':
        resizedBuffer = await image.webp({ quality }).toBuffer();
        break;
      default:
        resizedBuffer = await image.jpeg({ quality }).toBuffer();
    }

    // Upload to Supabase Storage
    const fileName = `${userId}/${Date.now()}-resized.${format}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-assets')
      .upload(fileName, resizedBuffer, {
        contentType: `image/${format}`,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to save image', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-assets')
      .getPublicUrl(fileName);

    // Record asset in database
    const { error: assetError } = await supabase
      .from('user_assets')
      .insert({
        user_id: userId,
        app_id: 'image-resizer',
        file_name: `resized-image.${format}`,
        file_url: urlData.publicUrl,
        file_size: resizedBuffer.length,
        asset_type: 'image',
        metadata: {
          original_dimensions: { width: metadata.width, height: metadata.height },
          new_dimensions: { width, height },
          format,
          quality
        },
        created_at: new Date().toISOString()
      });

    if (assetError) {
      console.error('Asset record error:', assetError);
    }

    // Deduct credits
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ 
        credits_balance: profile.credits_balance - CREDITS_REQUIRED,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (deductError) {
      console.error('Credit deduction error:', deductError);
    }

    // Record usage
    await supabase
      .from('app_usage')
      .insert({
        user_id: userId,
        app_id: 'image-resizer',
        credits_used: CREDITS_REQUIRED,
        metadata: {
          original_size: buffer.length,
          resized_size: resizedBuffer.length,
          dimensions: { width, height },
          format
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      imageUrl: urlData.publicUrl,
      dimensions: { width, height },
      fileSize: resizedBuffer.length,
      creditsUsed: CREDITS_REQUIRED,
      remainingCredits: profile.credits_balance - CREDITS_REQUIRED
    });

  } catch (error: any) {
    console.error('Image Resizer API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
