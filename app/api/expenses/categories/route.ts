// app/api/expenses/categories/route.ts
// API routes for managing expense categories

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { CreateCategorySchema } from '@/lib/expenses/validation'

function isExpensesEnabled(): boolean {
  return process.env.EXPENSES_ENABLED === '1' || process.env.EXPENSES_ENABLED === 'true'
}

// GET /api/expenses/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')

    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .eq('org_id', orgId)

    if (type) query = query.eq('type', type)

    query = query.order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return errorResponse('Failed to fetch categories', 500)
    }

    return successResponse({ categories: data })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/categories:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// POST /api/expenses/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const body = await request.json()

    const validation = CreateCategorySchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400)
    }

    const categoryData = validation.data

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        org_id: orgId,
        ...categoryData
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return errorResponse('Failed to create category', 500)
    }

    await auditLog({
      org_id: orgId,
      actor: 'system',
      action: 'create',
      entity: 'category',
      entity_id: data.id,
      payload: categoryData
    })

    return successResponse({ category: data }, 201)
  } catch (error: any) {
    console.error('Error in POST /api/expenses/categories:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
