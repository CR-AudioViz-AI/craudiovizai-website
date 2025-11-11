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

    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch customer to get customer_id
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({
        transactions: [],
        total: 0
      })
    }

    // Fetch credit transactions
    const { data: transactions, error: transactionsError, count } = await supabase
      .from('credit_transactions')
      .select('*', { count: 'exact' })
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError)
      return NextResponse.json(
        { error: 'Failed to fetch transaction history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      transactions: transactions || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error: unknown) {
    logError('Credits history API error:\', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
