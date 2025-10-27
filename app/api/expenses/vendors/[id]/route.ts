// app/api/expenses/vendors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { vendorSchema } from '@/lib/expenses/validation'

// GET /api/expenses/vendors/[id] - Get single vendor with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    const { data, error } = await supabase
      .from('vendors')
      .select(`
        *,
        subscriptions(
          id,
          name,
          amount,
          billing_cycle,
          status,
          next_renewal_date
        ),
        expenses(
          id,
          amount,
          date,
          description
        )
      `)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Vendor not found', 404)
      }
      throw error
    }

    // Calculate vendor statistics
    const stats = {
      subscription_count: data.subscriptions?.length || 0,
      active_subscription_count: data.subscriptions?.filter(s => s.status === 'active').length || 0,
      expense_count: data.expenses?.length || 0,
      total_spent: data.expenses?.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0,
      monthly_recurring: data.subscriptions
        ?.filter(s => s.status === 'active')
        .reduce((sum, s) => {
          const amount = parseFloat(s.amount || 0)
          if (s.billing_cycle === 'monthly') return sum + amount
          if (s.billing_cycle === 'annual') return sum + (amount / 12)
          if (s.billing_cycle === 'quarterly') return sum + (amount / 3)
          return sum
        }, 0) || 0
    }

    return successResponse({ 
      vendor: data,
      stats
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/vendors/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// PATCH /api/expenses/vendors/[id] - Update vendor
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if vendor exists and belongs to org
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Vendor not found', 404)
    }

    const body = await request.json()
    
    // Validate partial updates
    const validation = vendorSchema.partial().safeParse(body)
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.errors)
    }

    // Check for duplicate name if name is being changed
    if (validation.data.name) {
      const { data: duplicate } = await supabase
        .from('vendors')
        .select('id')
        .eq('org_id', orgId)
        .eq('name', validation.data.name)
        .neq('id', params.id)
        .single()

      if (duplicate) {
        return errorResponse('Vendor with this name already exists', 409)
      }
    }

    // Update vendor
    const { data, error } = await supabase
      .from('vendors')
      .update(validation.data)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'update',
      entity: 'vendor',
      entity_id: params.id,
      payload: validation.data
    })

    return successResponse({ vendor: data })
  } catch (error: any) {
    console.error('Error in PATCH /api/expenses/vendors/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// DELETE /api/expenses/vendors/[id] - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if vendor exists and belongs to org
    const { data: existing } = await supabase
      .from('vendors')
      .select('id, name')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Vendor not found', 404)
    }

    // Check if vendor is in use by subscriptions or expenses
    const { data: subscriptionsUsing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('vendor_id', params.id)
      .limit(1)

    const { data: expensesUsing } = await supabase
      .from('expenses')
      .select('id')
      .eq('vendor_id', params.id)
      .limit(1)

    if ((subscriptionsUsing && subscriptionsUsing.length > 0) || (expensesUsing && expensesUsing.length > 0)) {
      return errorResponse('Cannot delete vendor that is referenced by subscriptions or expenses. Set vendor to null on those records first.', 409)
    }

    // Delete vendor
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', params.id)
      .eq('org_id', orgId)

    if (error) throw error

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'delete',
      entity: 'vendor',
      entity_id: params.id,
      payload: { name: existing.name }
    })

    return successResponse({ message: 'Vendor deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/expenses/vendors/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
