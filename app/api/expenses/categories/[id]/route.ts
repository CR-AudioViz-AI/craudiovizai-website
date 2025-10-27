// app/api/expenses/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { categorySchema } from '@/lib/expenses/validation'

// GET /api/expenses/categories/[id] - Get single category with usage details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        expenses(
          id,
          amount,
          date,
          description,
          vendor:vendors(name)
        ),
        subscriptions(
          id,
          name,
          amount,
          billing_cycle,
          vendor:vendors(name)
        )
      `)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Category not found', 404)
      }
      throw error
    }

    // Calculate usage statistics
    const usageStats = {
      expense_count: data.expenses?.length || 0,
      subscription_count: data.subscriptions?.length || 0,
      total_expense_amount: data.expenses?.reduce((sum: number, e: any) => sum + parseFloat(e.amount || 0), 0) || 0,
      total_subscription_amount: data.subscriptions?.reduce((sum: number, s: any) => {
        const amount = parseFloat(s.amount || 0)
        // Normalize to monthly for comparison
        if (s.billing_cycle === 'monthly') return sum + amount
        if (s.billing_cycle === 'annual') return sum + (amount / 12)
        if (s.billing_cycle === 'quarterly') return sum + (amount / 3)
        return sum
      }, 0) || 0
    }

    return successResponse({ 
      category: data,
      usage_stats: usageStats
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/categories/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// PATCH /api/expenses/categories/[id] - Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if category exists and belongs to org
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Category not found', 404)
    }

    const body = await request.json()
    
    // Validate partial updates
    const validation = categorySchema.partial().safeParse(body)
    if (!validation.success) {
      return errorResponse('Validation failed', 400)
    }

    // Check for duplicate name if name is being changed
    if (validation.data.name) {
      const { data: duplicate } = await supabase
        .from('categories')
        .select('id')
        .eq('org_id', orgId)
        .eq('name', validation.data.name)
        .neq('id', params.id)
        .single()

      if (duplicate) {
        return errorResponse('Category with this name already exists', 409)
      }
    }

    // Update category
    const { data, error } = await supabase
      .from('categories')
      .update(validation.data)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await auditLog({
      org_id: orgId,
      actor: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'update',
      entity: 'category',
      entity_id: params.id,
      payload: validation.data
    })

    return successResponse({ category: data })
  } catch (error: any) {
    console.error('Error in PATCH /api/expenses/categories/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// DELETE /api/expenses/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if category exists and belongs to org
    const { data: existing } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Category not found', 404)
    }

    // Check if category is in use
    const { data: expensesUsing } = await supabase
      .from('expenses')
      .select('id')
      .eq('category_id', params.id)
      .limit(1)

    const { data: subscriptionsUsing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('category_id', params.id)
      .limit(1)

    if ((expensesUsing && expensesUsing.length > 0) || (subscriptionsUsing && subscriptionsUsing.length > 0)) {
      return errorResponse('Cannot delete category that is in use by expenses or subscriptions', 409)
    }

    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', params.id)
      .eq('org_id', orgId)

    if (error) throw error

    // Audit log
    await auditLog({
      org_id: orgId,
      actor: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'delete',
      entity: 'category',
      entity_id: params.id,
      payload: { name: existing.name }
    })

    return successResponse({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/expenses/categories/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
