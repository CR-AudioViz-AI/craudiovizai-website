import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get URL parameters for filtering and pagination
    const { searchParams } = new URL(request.url)
    const assetType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get customer to fetch their assets
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({
        assets: [],
        total: 0
      })
    }

    // Build query for generated assets
    let query = supabase
      .from('generated_assets')
      .select('*', { count: 'exact' })
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by asset type if specified
    if (assetType) {
      query = query.eq('asset_type', assetType)
    }

    const { data: assets, error: assetsError, count } = await query

    if (assetsError) {
      console.error('Error fetching assets:', assetsError)
      return NextResponse.json(
        { error: 'Failed to fetch assets' },
        { status: 500 }
      )
    }

    // Get unique asset types for filtering
    const { data: allAssets } = await supabase
      .from('generated_assets')
      .select('asset_type')
      .eq('customer_id', customer.id)

    const assetTypes = [...new Set(allAssets?.map(a => a.asset_type) || [])]

    return NextResponse.json({
      assets: assets || [],
      total: count || 0,
      assetTypes,
      limit,
      offset
    })

  } catch (error) {
    console.error('Assets API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { assetId } = body

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      )
    }

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

    // Verify asset ownership and delete
    const { error: deleteError } = await supabase
      .from('generated_assets')
      .delete()
      .eq('id', assetId)
      .eq('customer_id', customer.id)

    if (deleteError) {
      console.error('Error deleting asset:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete asset' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    })

  } catch (error) {
    console.error('Assets delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
