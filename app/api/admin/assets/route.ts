// CR AUDIOVIZ AI - Admin Assets API Route
// Session: 2025-10-25 - Phase 3 API Routes
// Purpose: Manage user-generated assets (images, videos, audio, documents)

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET: Fetch user's assets with filtering and pagination
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    const assetType = searchParams.get('type'); // image, video, audio, document
    const appId = searchParams.get('appId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('user_assets')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (assetType) {
      query = query.eq('asset_type', assetType);
    }

    if (appId) {
      query = query.eq('app_id', appId);
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: assets, error: assetsError, count } = await query;

    if (assetsError) {
      return NextResponse.json(
        { error: 'Failed to fetch assets', details: assetsError.message },
        { status: 500 }
      );
    }

    // Calculate statistics
    const { data: stats } = await supabase
      .from('user_assets')
      .select('asset_type, file_size')
      .eq('user_id', userId);

    const statistics = {
      totalAssets: count || 0,
      totalSize: stats?.reduce((sum, asset) => sum + (asset.file_size || 0), 0) || 0,
      byType: {
        image: stats?.filter(a => a.asset_type === 'image').length || 0,
        video: stats?.filter(a => a.asset_type === 'video').length || 0,
        audio: stats?.filter(a => a.asset_type === 'audio').length || 0,
        document: stats?.filter(a => a.asset_type === 'document').length || 0
      }
    };

    return NextResponse.json({
      success: true,
      assets: assets || [],
      statistics,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });

  } catch (error: any) {
    console.error('Admin Assets API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Upload or create new asset
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, assetId, fileName, fileUrl, fileSize, assetType, appId, metadata } = body;

    if (action === 'create_asset') {
      // Record new asset
      if (!fileName || !fileUrl || !assetType) {
        return NextResponse.json(
          { error: 'Missing required fields: fileName, fileUrl, assetType' },
          { status: 400 }
        );
      }

      const { data: asset, error: createError } = await supabase
        .from('user_assets')
        .insert({
          user_id: userId,
          app_id: appId,
          file_name: fileName,
          file_url: fileUrl,
          file_size: fileSize || 0,
          asset_type: assetType,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create asset', details: createError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        asset
      });
    }

    if (action === 'generate_download_url') {
      // Generate temporary signed URL for download
      if (!assetId) {
        return NextResponse.json(
          { error: 'Missing assetId' },
          { status: 400 }
        );
      }

      // Verify asset ownership
      const { data: asset, error: assetError } = await supabase
        .from('user_assets')
        .select('file_url, file_name')
        .eq('id', assetId)
        .eq('user_id', userId)
        .single();

      if (assetError || !asset) {
        return NextResponse.json(
          { error: 'Asset not found or access denied' },
          { status: 404 }
        );
      }

      // If asset is in Supabase Storage, generate signed URL
      if (asset.file_url.includes('supabase.co/storage')) {
        const pathMatch = asset.file_url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
        
        if (pathMatch) {
          const bucket = pathMatch[1];
          const path = pathMatch[2];

          const { data: signedUrl, error: urlError } = await supabase
            .storage
            .from(bucket)
            .createSignedUrl(path, 3600); // 1 hour expiration

          if (urlError) {
            return NextResponse.json(
              { error: 'Failed to generate download URL', details: urlError.message },
              { status: 500 }
            );
          }

          return NextResponse.json({
            success: true,
            downloadUrl: signedUrl.signedUrl,
            expiresIn: 3600
          });
        }
      }

      // For non-Supabase URLs, return direct URL
      return NextResponse.json({
        success: true,
        downloadUrl: asset.file_url,
        fileName: asset.file_name
      });
    }

    if (action === 'update_metadata') {
      // Update asset metadata
      if (!assetId || !metadata) {
        return NextResponse.json(
          { error: 'Missing assetId or metadata' },
          { status: 400 }
        );
      }

      const { data: asset, error: updateError } = await supabase
        .from('user_assets')
        .update({
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', assetId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update asset', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        asset
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Admin Assets API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete assets
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const assetIds = searchParams.get('assetIds')?.split(',');

    if (!assetId && !assetIds) {
      return NextResponse.json(
        { error: 'Missing assetId or assetIds parameter' },
        { status: 400 }
      );
    }

    // Single asset deletion
    if (assetId) {
      // Get asset details for storage deletion
      const { data: asset, error: fetchError } = await supabase
        .from('user_assets')
        .select('file_url')
        .eq('id', assetId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !asset) {
        return NextResponse.json(
          { error: 'Asset not found or access denied' },
          { status: 404 }
        );
      }

      // Delete from storage if in Supabase
      if (asset.file_url.includes('supabase.co/storage')) {
        const pathMatch = asset.file_url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
        
        if (pathMatch) {
          const bucket = pathMatch[1];
          const path = pathMatch[2];

          await supabase.storage.from(bucket).remove([path]);
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('user_assets')
        .delete()
        .eq('id', assetId)
        .eq('user_id', userId);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to delete asset', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Asset deleted successfully'
      });
    }

    // Bulk deletion
    if (assetIds && assetIds.length > 0) {
      // Get all asset URLs
      const { data: assets, error: fetchError } = await supabase
        .from('user_assets')
        .select('id, file_url')
        .in('id', assetIds)
        .eq('user_id', userId);

      if (fetchError || !assets) {
        return NextResponse.json(
          { error: 'Failed to fetch assets' },
          { status: 500 }
        );
      }

      // Delete from storage
      const storagePaths: { [bucket: string]: string[] } = {};
      
      assets.forEach(asset => {
        if (asset.file_url.includes('supabase.co/storage')) {
          const pathMatch = asset.file_url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
          if (pathMatch) {
            const bucket = pathMatch[1];
            const path = pathMatch[2];
            if (!storagePaths[bucket]) storagePaths[bucket] = [];
            storagePaths[bucket].push(path);
          }
        }
      });

      // Delete from each bucket
      for (const [bucket, paths] of Object.entries(storagePaths)) {
        await supabase.storage.from(bucket).remove(paths);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('user_assets')
        .delete()
        .in('id', assetIds)
        .eq('user_id', userId);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to delete assets', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${assets.length} assets deleted successfully`,
        deletedCount: assets.length
      });
    }

  } catch (error: any) {
    console.error('Admin Assets API DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
