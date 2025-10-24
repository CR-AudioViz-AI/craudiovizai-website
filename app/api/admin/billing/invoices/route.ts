import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function GET(request: Request) {
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

    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (customerError || !customer?.stripe_customer_id) {
      return NextResponse.json({
        invoices: [],
        hasMore: false
      })
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customer.stripe_customer_id,
      limit: limit
    })

    // Format invoice data
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000).toISOString(),
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      paidAt: invoice.status_transitions.paid_at 
        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() 
        : null,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      lines: invoice.lines.data.map(line => ({
        description: line.description,
        amount: line.amount,
        quantity: line.quantity
      }))
    }))

    return NextResponse.json({
      invoices: formattedInvoices,
      hasMore: invoices.has_more
    })

  } catch (error: any) {
    console.error('Billing invoices API error:', error)
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        invoices: [],
        hasMore: false
      })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
