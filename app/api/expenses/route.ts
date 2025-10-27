// app/api/expenses/route.ts
// API routes for managing expenses (per-charge logging)

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { CreateExpenseSchema } from '@/lib/expenses/validation'

// Feature flag check
function isExpensesEnabled(): boolean {
  return process.env.EXPENSES_ENABLED === '1' || process.env.EXPENSES_ENABLED === 'true'
}

// GET /api/expenses - List expenses with optional filters
export async function GET(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const searchParams = request.nextUrl.searchParams
    
    // Optional filters
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const vendorId = searchParams.get('vendor_id')
    const categoryId = searchParams.get('category_id')
    const subscriptionId = searchParams.get('subscription_id')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabaseAdmin
      .from('expenses')
      .select(`
        *,
        vendor:vendors(id, name),
        category:categories(id, name, type),
        subscription:subscriptions(id, name)
      `)
      .eq('org_id', orgId)

    if (startDate) query = query.gte('txn_date', startDate)
    if (endDate) query = query.lte('txn_date', endDate)
    if (vendorId) query = query.eq('vendor_id', vendorId)
    if (categoryId) query = query.eq('category_id', categoryId)
    if (subscriptionId) query = query.eq('subscription_id', subscriptionId)

    query = query.order('txn_date', { ascending: false }).limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching expenses:', error)
      return errorResponse('Failed to fetch expenses', 500)
    }

    // Calculate summary
    const total = data.reduce((sum: number, expense) => sum + parseFloat(expense.amount), 0)
    const count = data.length

    return successResponse({ 
      expenses: data, 
      summary: { total, count }
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const body = await request.json()

    // Validate request body
    const validation = CreateExpenseSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400)
    }

    const expenseData = validation.data

    // Create expense
    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert({
        org_id: orgId,
        ...expenseData
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating expense:', error)
      return errorResponse('Failed to create expense', 500)
    }

    // Audit log
    await auditLog({
      org_id: orgId,
      actor: 'system',
      action: 'create',
      entity: 'expense',
      entity_id: data.id,
      payload: expenseData
    })

    return successResponse({ expense: data }, 201)
  } catch (error: any) {
    console.error('Error in POST /api/expenses:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
