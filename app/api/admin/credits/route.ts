import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch customer record with credits
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('credits, stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (customerError) {
      // If customer doesn't exist yet, create one
      if (customerError.code === 'PGRST116') {
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            user_id: user.id,
            email: user.email,
            credits: 0
          })
          .select('credits, stripe_customer_id')
          .single()

        if (createError) {
          console.error('Error creating customer:', createError)
          return NextResponse.json(
            { error: 'Failed to create customer record' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          credits: newCustomer.credits || 0,
          hasSubscription: !!newCustomer.stripe_customer_id
        })
      }

      console.error('Error fetching customer:', customerError)
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      credits: customer.credits || 0,
      hasSubscription: !!customer.stripe_customer_id
    })

  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
