// app/api/expenses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { expenseSchema } from '@/lib/expenses/validation'

// GET /api/expenses/[id] - Get single expense with all attachments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        vendor:vendors(id, name, website),
        category:categories(id, name, type, deductible),
        subscription:subscriptions(id, name, billing_cycle),
        attachments(
          id,
          file_name,
          file_url,
          file_type,
          file_size,
          uploaded_at
        )
      `)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Expense not found', 404)
      }
      throw error
    }

    return successResponse({ expense: data })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// PATCH /api/expenses/[id] - Update single expense
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if expense exists and belongs to org
    const { data: existing } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Expense not found', 404)
    }

    const body = await request.json()
    
    // Validate partial updates
    const validation = expenseSchema.partial().safeParse(body)
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.errors)
    }

    // Update expense
    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('org_id', orgId)
      .select(`
        *,
        vendor:vendors(id, name),
        category:categories(id, name),
        subscription:subscriptions(id, name)
      `)
      .single()

    if (error) throw error

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'update',
      entity: 'expense',
      entity_id: params.id,
      payload: validation.data
    })

    return successResponse({ expense: data })
  } catch (error: any) {
    console.error('Error in PATCH /api/expenses/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if expense exists and belongs to org
    const { data: existing } = await supabase
      .from('expenses')
      .select('id, description, attachments(id)')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Expense not found', 404)
    }

    // Delete expense (attachments cascade via foreign key)
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', params.id)
      .eq('org_id', orgId)

    if (error) throw error

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'delete',
      entity: 'expense',
      entity_id: params.id,
      payload: { 
        description: existing.description,
        attachment_count: existing.attachments?.length || 0
      }
    })

    return successResponse({ message: 'Expense deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/expenses/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
