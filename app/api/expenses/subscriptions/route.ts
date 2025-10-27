// app/api/expenses/subscriptions/route.ts
// API routes for managing subscriptions (recurring services with renewal tracking)

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { CreateSubscriptionSchema } from '@/lib/expenses/validation'

// Feature flag check
function isExpensesEnabled(): boolean {
  return process.env.EXPENSES_ENABLED === '1' || process.env.EXPENSES_ENABLED === 'true'
}

// GET /api/expenses/subscriptions - List subscriptions with optional filters
export async function GET(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const searchParams = request.nextUrl.searchParams
    
    // Optional filters
    const active = searchParams.get('active')
    const vendorId = searchParams.get('vendor_id')
    const categoryId = searchParams.get('category_id')
    const dueWithinDays = searchParams.get('due_within_days')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabaseAdmin
      .from('subscriptions')
      .select(`
        *,
        vendor:vendors(id, name),
        category:categories(id, name, type)
      `)
      .eq('org_id', orgId)

    if (active !== null) {
      query = query.eq('active', active === 'true')
    }
    if (vendorId) query = query.eq('vendor_id', vendorId)
    if (categoryId) query = query.eq('category_id', categoryId)

    // Filter by upcoming end dates
    if (dueWithinDays) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + parseInt(dueWithinDays))
      query = query.lte('end_date', futureDate.toISOString().split('T')[0])
        .gte('end_date', new Date().toISOString().split('T')[0])
    }

    query = query.order('name', { ascending: true }).limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return errorResponse('Failed to fetch subscriptions', 500)
    }

    // Calculate summary
    const monthlyTotal = data.reduce((sum: number, sub) => {
      if (!sub.active) return sum
      const amount = parseFloat(sub.amount)
      switch (sub.billing_interval) {
        case 'month': return sum + amount
        case 'year': return sum + amount / 12
        case 'quarter': return sum + amount / 3
        case 'week': return sum + amount * 4.33
        case 'day': return sum + amount * 30
        default: return sum
      }
    }, 0)

    const annualTotal = monthlyTotal * 12

    return successResponse({ 
      subscriptions: data, 
      summary: { 
        count: data.length,
        active: data.filter(s => s.active).length,
        monthlyTotal: Math.round(monthlyTotal * 100) / 100,
        annualTotal: Math.round(annualTotal * 100) / 100
      }
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/subscriptions:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// POST /api/expenses/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    if (!isExpensesEnabled()) {
      return errorResponse('Expense tracking is disabled', 403)
    }

    const orgId = getOrgId(request)
    const body = await request.json()

    // Validate request body
    const validation = CreateSubscriptionSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400)
    }

    const subscriptionData = validation.data

    // Create subscription
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        org_id: orgId,
        ...subscriptionData
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return errorResponse('Failed to create subscription', 500)
    }

    // Audit log
    await auditLog({
      org_id: orgId,
      actor: 'system',
      action: 'create',
      entity: 'subscription',
      entity_id: data.id,
      payload: subscriptionData
    })

    return successResponse({ subscription: data }, 201)
  } catch (error: any) {
    console.error('Error in POST /api/expenses/subscriptions:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
