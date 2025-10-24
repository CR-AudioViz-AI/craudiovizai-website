import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const assetId = params.id

    // Get customer
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Fetch asset and verify ownership
    const { data: asset, error: assetError } = await supabase
      .from('generated_assets')
      .select('*')
      .eq('id', assetId)
      .eq('customer_id', customer.id)
      .single()

    if (assetError || !asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Check if asset has a storage path (for files stored in Supabase Storage)
    if (asset.storage_path) {
      const { data: downloadData, error: downloadError } = await supabase
        .storage
        .from('generated-assets')
        .createSignedUrl(asset.storage_path, 3600) // 1 hour expiry

      if (downloadError) {
        console.error('Error creating signed URL:', downloadError)
        return NextResponse.json(
          { error: 'Failed to generate download link' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        downloadUrl: downloadData.signedUrl,
        asset: {
          id: asset.id,
          name: asset.asset_name,
          type: asset.asset_type,
          size: asset.file_size,
          createdAt: asset.created_at
        }
      })
    }

    // If asset has direct URL (e.g., from external service)
    if (asset.asset_url) {
      return NextResponse.json({
        downloadUrl: asset.asset_url,
        asset: {
          id: asset.id,
          name: asset.asset_name,
          type: asset.asset_type,
          createdAt: asset.created_at
        }
      })
    }

    return NextResponse.json(
      { error: 'Asset has no downloadable content' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Asset download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
