import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';


// Force dynamic rendering - required for using dynamic Next.js features
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
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

    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('appId')
    const days = parseInt(searchParams.get('days') || '30')

    // Fetch customer to get customer_id
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({
        usage: [],
        summary: {
          totalGenerations: 0,
          totalCreditsUsed: 0,
          mostUsedApp: null
        }
      })
    }

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Build query for credit transactions
    let query = supabase
      .from('credit_transactions')
      .select('app_id, amount, description, created_at')
      .eq('customer_id', customer.id)
      .eq('transaction_type', 'usage')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    // Filter by app if specified
    if (appId) {
      query = query.eq('app_id', appId)
    }

    const { data: transactions, error: transactionsError } = await query

    if (transactionsError) {
      console.error('Error fetching app usage:', transactionsError)
      return NextResponse.json(
        { error: 'Failed to fetch app usage' },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const totalGenerations = transactions?.length || 0
    const totalCreditsUsed = transactions?.reduce((sum: number, t) => sum + Math.abs(t.amount), 0) || 0

    // Group by app to find most used
    const appUsage = new Map<string, number>()
    transactions?.forEach(t => {
      if (t.app_id) {
        appUsage.set(t.app_id, (appUsage.get(t.app_id) || 0) + 1)
      }
    })

    let mostUsedApp = null
    let maxCount = 0
    appUsage.forEach((count, appId) => {
      if (count > maxCount) {
        maxCount = count
        mostUsedApp = appId
      }
    })

    return NextResponse.json({
      usage: transactions || [],
      summary: {
        totalGenerations,
        totalCreditsUsed,
        mostUsedApp
      },
      period: {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        days
      }
    })

  } catch (error: unknown) {
    logError('Apps usage API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
