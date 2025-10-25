import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Admin Assets Management API
 * 
 * GET: List all user's generated assets
 * POST: Download, delete, or manage assets
 * DELETE: Remove specific assets
 * 
 * Session: 2025-10-25 19:00 EST
 */

async function getSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

interface Asset {
  id: string;
  user_id: string;
  app_id: string;
  app_name: string;
  asset_type: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  thumbnail_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * GET /api/admin/assets
 * Returns all user's generated assets with filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const app_id = searchParams.get('app_id');
    const asset_type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = await getSupabaseClient();

    // Build query
    let query = supabase
      .from('user_assets')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (app_id) {
      query = query.eq('app_id', app_id);
    }
    
    if (asset_type) {
      query = query.eq('asset_type', asset_type);
    }

    const { data: assets, error: assetsError, count } = await query;

    if (assetsError) {
      console.error('Error fetching assets:', assetsError);
      return NextResponse.json(
        { error: 'Failed to fetch assets' },
        { status: 500 }
      );
    }

    // Calculate storage statistics
    const totalSize = assets?.reduce((sum, asset) => sum + (asset.file_size || 0), 0) || 0;
    
    // Group by app
    const assetsByApp: Record<string, number> = {};
    const assetsByType: Record<string, number> = {};
    
    assets?.forEach(asset => {
      assetsByApp[asset.app_name] = (assetsByApp[asset.app_name] || 0) + 1;
      assetsByType[asset.asset_type] = (assetsByType[asset.asset_type] || 0) + 1;
    });

    // Get storage limits based on subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const storageLimits: Record<string, number> = {
      free: 1024 * 1024 * 1024, // 1 GB
      starter: 5 * 1024 * 1024 * 1024, // 5 GB
      pro: 25 * 1024 * 1024 * 1024, // 25 GB
      enterprise: 100 * 1024 * 1024 * 1024, // 100 GB
    };

    const storageLimit = storageLimits[profile?.subscription_tier || 'free'];

    return NextResponse.json({
      success: true,
      data: {
        assets: assets || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          has_more: (count || 0) > offset + limit,
        },
        statistics: {
          total_assets: count || 0,
          total_size_bytes: totalSize,
          total_size_mb: (totalSize / (1024 * 1024)).toFixed(2),
          storage_limit_bytes: storageLimit,
          storage_used_percent: ((totalSize / storageLimit) * 100).toFixed(2),
          by_app: assetsByApp,
          by_type: assetsByType,
        },
        user_id: user.id,
      },
    });

  } catch (error) {
    console.error('Error in /api/admin/assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/assets
 * Manage assets (download, favorite, tag)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, asset_id, asset_ids, metadata } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    switch (action) {
      case 'download':
        if (!asset_id) {
          return NextResponse.json(
            { error: 'Missing asset_id' },
            { status: 400 }
          );
        }

        // Get asset details
        const { data: asset, error: assetError } = await supabase
          .from('user_assets')
          .select('*')
          .eq('id', asset_id)
          .eq('user_id', user.id)
          .single();

        if (assetError || !asset) {
          return NextResponse.json(
            { error: 'Asset not found' },
            { status: 404 }
          );
        }

        // Generate signed URL for download
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('user-assets')
          .createSignedUrl(asset.file_url, 3600); // 1 hour expiry

        if (urlError) {
          console.error('Error generating download URL:', urlError);
          return NextResponse.json(
            { error: 'Failed to generate download URL' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          download_url: signedUrlData.signedUrl,
          file_name: asset.file_name,
          expires_in: 3600,
        });

      case 'bulk_download':
        if (!asset_ids || !Array.isArray(asset_ids)) {
          return NextResponse.json(
            { error: 'Missing or invalid asset_ids array' },
            { status: 400 }
          );
        }

        // Get all assets
        const { data: bulkAssets, error: bulkError } = await supabase
          .from('user_assets')
          .select('*')
          .in('id', asset_ids)
          .eq('user_id', user.id);

        if (bulkError || !bulkAssets) {
          return NextResponse.json(
            { error: 'Failed to fetch assets' },
            { status: 500 }
          );
        }

        // Generate signed URLs for all
        const downloadUrls = await Promise.all(
          bulkAssets.map(async (asset) => {
            const { data: urlData } = await supabase.storage
              .from('user-assets')
              .createSignedUrl(asset.file_url, 3600);

            return {
              id: asset.id,
              file_name: asset.file_name,
              download_url: urlData?.signedUrl,
            };
          })
        );

        return NextResponse.json({
          success: true,
          downloads: downloadUrls,
          expires_in: 3600,
        });

      case 'favorite':
        if (!asset_id) {
          return NextResponse.json(
            { error: 'Missing asset_id' },
            { status: 400 }
          );
        }

        // Toggle favorite status
        const { data: currentAsset } = await supabase
          .from('user_assets')
          .select('metadata')
          .eq('id', asset_id)
          .eq('user_id', user.id)
          .single();

        const currentMetadata = currentAsset?.metadata || {};
        const newFavoriteStatus = !currentMetadata.is_favorite;

        await supabase
          .from('user_assets')
          .update({
            metadata: {
              ...currentMetadata,
              is_favorite: newFavoriteStatus,
            },
          })
          .eq('id', asset_id)
          .eq('user_id', user.id);

        return NextResponse.json({
          success: true,
          is_favorite: newFavoriteStatus,
        });

      case 'add_tags':
        if (!asset_id || !metadata?.tags) {
          return NextResponse.json(
            { error: 'Missing asset_id or tags' },
            { status: 400 }
          );
        }

        // Add tags to asset metadata
        const { data: tagAsset } = await supabase
          .from('user_assets')
          .select('metadata')
          .eq('id', asset_id)
          .eq('user_id', user.id)
          .single();

        const tagMetadata = tagAsset?.metadata || {};
        const existingTags = tagMetadata.tags || [];
        const newTags = [...new Set([...existingTags, ...metadata.tags])];

        await supabase
          .from('user_assets')
          .update({
            metadata: {
              ...tagMetadata,
              tags: newTags,
            },
          })
          .eq('id', asset_id)
          .eq('user_id', user.id);

        return NextResponse.json({
          success: true,
          tags: newTags,
        });

      case 'rename':
        if (!asset_id || !metadata?.new_name) {
          return NextResponse.json(
            { error: 'Missing asset_id or new_name' },
            { status: 400 }
          );
        }

        await supabase
          .from('user_assets')
          .update({ file_name: metadata.new_name })
          .eq('id', asset_id)
          .eq('user_id', user.id);

        return NextResponse.json({
          success: true,
          message: 'Asset renamed successfully',
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/admin/assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/assets
 * Delete one or more assets
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const asset_id = searchParams.get('id');
    const asset_ids = searchParams.get('ids')?.split(',');

    if (!asset_id && !asset_ids) {
      return NextResponse.json(
        { error: 'Missing asset_id or asset_ids' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    const idsToDelete = asset_ids || [asset_id!];

    // Get assets to delete (verify ownership and get file paths)
    const { data: assets, error: fetchError } = await supabase
      .from('user_assets')
      .select('*')
      .in('id', idsToDelete)
      .eq('user_id', user.id);

    if (fetchError || !assets || assets.length === 0) {
      return NextResponse.json(
        { error: 'No assets found to delete' },
        { status: 404 }
      );
    }

    // Delete files from storage
    const filePaths = assets.map(asset => asset.file_url);
    
    const { error: storageError } = await supabase.storage
      .from('user-assets')
      .remove(filePaths);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue anyway - database cleanup is more important
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('user_assets')
      .delete()
      .in('id', idsToDelete)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting from database:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete assets' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${assets.length} asset(s) deleted successfully`,
      deleted_count: assets.length,
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
