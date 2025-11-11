import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';


// Force dynamic rendering - required for using dynamic Next.js features
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get customer profile
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error fetching profile:', customerError)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    // Return profile data
    return NextResponse.json({
      profile: {
        email: user.email,
        name: customer?.name || '',
        company: customer?.company || '',
        phone: customer?.phone || '',
        avatar: customer?.avatar_url || '',
        createdAt: user.created_at,
        emailVerified: !!user.email_confirmed_at
      }
    })

  } catch (error: unknown) {
    logError('Settings profile GET API error:\', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, company, phone, avatar } = body

    // Prepare update data
    const updateData: any = {
      user_id: user.id,
      email: user.email,
      updated_at: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name
    if (company !== undefined) updateData.company = company
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar_url = avatar

    // Update customer profile (upsert in case it doesn't exist)
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .upsert(updateData, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: {
        email: user.email,
        name: updatedCustomer.name,
        company: updatedCustomer.company,
        phone: updatedCustomer.phone,
        avatar: updatedCustomer.avatar_url
      },
      message: 'Profile updated successfully'
    })

  } catch (error: unknown) {
    logError('Settings profile PUT API error:\', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
