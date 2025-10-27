// app/api/expenses/reports/route.ts
// Generate expense reports with grouping and aggregation

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse, successResponse } from '@/lib/expenses/supabase-server'

function isReportsEnabled(): boolean {
  return process.env.REPORTS_ENABLED === '1' || process.env.REPORTS_ENABLED === 'true'
}

// GET /api/expenses/reports - Generate reports
export async function GET(request: NextRequest) {
  try {
    if (!isReportsEnabled()) {
      return errorResponse('Reports are disabled', 403)
    }

    const orgId = getOrgId(request)
    const searchParams = request.nextUrl.searchParams
    
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const groupBy = searchParams.get('group_by') || 'month'

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

    const { data, error } = await query

    if (error) {
      console.error('Error fetching expenses:', error)
      return errorResponse('Failed to fetch expenses', 500)
    }

    // Group and aggregate
    const grouped: Record<string, any> = {}

    data.forEach(exp => {
      let key: string
      
      switch (groupBy) {
        case 'month':
          key = exp.txn_date.substring(0, 7) // YYYY-MM
          break
        case 'date':
          key = exp.txn_date
          break
        case 'vendor':
          key = exp.vendor?.name || 'Uncategorized'
          break
        case 'category':
          key = exp.category?.name || 'Uncategorized'
          break
        case 'subscription':
          key = exp.subscription?.name || 'One-time'
          break
        case 'type':
          key = exp.category?.type || 'other'
          break
        default:
          key = 'All'
      }

      if (!grouped[key]) {
        grouped[key] = {
          key,
          total: 0,
          count: 0,
          expenses: []
        }
      }

      grouped[key].total += parseFloat(exp.amount)
      grouped[key].count += 1
      grouped[key].expenses.push(exp)
    })

    // Convert to array and sort
    const report = Object.values(grouped).map(g => ({
      ...g,
      total: Math.round(g.total * 100) / 100,
      expenses: undefined // Don't send full expense list unless requested
    })).sort((a: any, b: any) => b.total - a.total)

    const summary = {
      total: report.reduce((sum: number, g: any) => sum + g.total, 0),
      count: data.length,
      group_by: groupBy,
      groups: report.length
    }

    return successResponse({ report, summary })
  } catch (error: any) {
    console.error('Error generating report:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
