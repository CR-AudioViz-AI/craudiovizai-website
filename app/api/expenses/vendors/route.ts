// app/api/expenses/vendors/route.ts
// API routes for managing vendors

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { CreateVendorSchema, UpdateVendorSchema } from '@/lib/expenses/validation'
import { z } from 'zod'

// Feature flag check
function isExpensesEnabled(): boolean {
  return process.env.EXPENSES_ENABLED === '1' || process.env.EXPENSES_ENABLED === 'true'
}

// GET /api/expenses/vendors - List all vendors for org
export async function GET(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)

    const { data, error } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('org_id', orgId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching vendors:', error)
      return errorResponse('Failed to fetch vendors', 500)
    }

    return successResponse({ vendors: data })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/vendors:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// POST /api/expenses/vendors - Create a new vendor
export async function POST(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const body = await request.json()

    // Validate request body
    const validation = CreateVendorSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400)
    }

    const vendorData = validation.data

    // Create vendor
    const { data, error } = await supabaseAdmin
      .from('vendors')
      .insert({
        org_id: orgId,
        ...vendorData
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating vendor:', error)
      if (error.code === '23505') { // Unique constraint violation
        return errorResponse('Vendor with this name already exists', 409)
      }
      return errorResponse('Failed to create vendor', 500)
    }

    // Audit log
    await auditLog({
      org_id: orgId,
      actor: 'system', // TODO: Get from auth context
      action: 'create',
      entity: 'vendor',
      entity_id: data.id,
      payload: vendorData
    })

    return successResponse({ vendor: data }, 201)
  } catch (error: any) {
    console.error('Error in POST /api/expenses/vendors:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
