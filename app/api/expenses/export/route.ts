// app/api/expenses/export/route.ts
// CSV export for expenses

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse } from '@/lib/expenses/supabase-server'

function isReportsEnabled(): boolean {
  return process.env.REPORTS_ENABLED === '1' || process.env.REPORTS_ENABLED === 'true'
}

// GET /api/expenses/export - Export expenses to CSV
export async function GET(request: NextRequest) {
  try {
    if (!isReportsEnabled()) {
      return errorResponse('Reports are disabled', 403)
    }

    const orgId = getOrgId(request)
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    let query = supabaseAdmin
      .from('expenses')
      .select(`
        *,
        vendor:vendors(name),
        category:categories(name, type),
        subscription:subscriptions(name)
      `)
      .eq('org_id', orgId)
      .order('txn_date', { ascending: false })

    if (startDate) query = query.gte('txn_date', startDate)
    if (endDate) query = query.lte('txn_date', endDate)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching expenses:', error)
      return errorResponse('Failed to fetch expenses', 500)
    }

    // Convert to CSV
    const headers = [
      'Date',
      'Vendor',
      'Category',
      'Subscription',
      'Amount',
      'Currency',
      'Payment Method',
      'Description',
      'Tags'
    ]

    const rows = data.map(exp => [
      exp.txn_date,
      exp.vendor?.name || '',
      exp.category?.name || '',
      exp.subscription?.name || '',
      exp.amount,
      exp.currency,
      exp.payment_method || '',
      exp.description || '',
      (exp.tags || []).join('; ')
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="expenses-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error: any) {
    console.error('Error in export:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
