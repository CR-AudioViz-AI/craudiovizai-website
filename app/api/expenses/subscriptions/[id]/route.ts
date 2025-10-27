// app/api/expenses/subscriptions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'
import { subscriptionSchema } from '@/lib/expenses/validation'

// GET /api/expenses/subscriptions/[id] - Get single subscription with expense history
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        vendor:vendors(id, name, website, tax_id),
        expenses(
          id,
          amount,
          date,
          description,
          attachments(id, file_name, file_url)
        )
      `)
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('Subscription not found', 404)
      }
      throw error
    }

    // Calculate expense history summary
    const expenseSummary = {
      total_paid: data.expenses?.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0,
      payment_count: data.expenses?.length || 0,
      last_payment_date: data.expenses?.[0]?.date || null,
      average_payment: data.expenses?.length 
        ? (data.expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) / data.expenses.length)
        : 0
    }

    return successResponse({ 
      subscription: data,
      expense_summary: expenseSummary
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/subscriptions/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// PATCH /api/expenses/subscriptions/[id] - Update single subscription
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if subscription exists and belongs to org
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Subscription not found', 404)
    }

    const body = await request.json()
    
    // Validate partial updates (allow partial data)
    const validation = subscriptionSchema.partial().safeParse(body)
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.errors)
    }

    // Update subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (error) throw error

    // If next_renewal_date changed, update or create alert
    if (validation.data.next_renewal_date) {
      const renewalAlertDays = validation.data.renewal_alert_days || data.renewal_alert_days || 7
      const alertDate = new Date(validation.data.next_renewal_date)
      alertDate.setDate(alertDate.getDate() - renewalAlertDays)

      // Check if alert exists
      const { data: existingAlert } = await supabase
        .from('alerts')
        .select('id')
        .eq('subscription_id', params.id)
        .eq('type', 'renewal')
        .single()

      if (existingAlert) {
        // Update existing alert
        await supabase
          .from('alerts')
          .update({
            message: `Subscription "${data.name}" renews in ${renewalAlertDays} days`,
            trigger_date: alertDate.toISOString(),
            acknowledged: false,
            snoozed_until: null
          })
          .eq('id', existingAlert.id)
      } else {
        // Create new alert
        await supabase.from('alerts').insert({
          org_id: orgId,
          subscription_id: params.id,
          type: 'renewal',
          message: `Subscription "${data.name}" renews in ${renewalAlertDays} days`,
          trigger_date: alertDate.toISOString(),
          acknowledged: false
        })
      }
    }

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'update',
      entity: 'subscription',
      entity_id: params.id,
      payload: validation.data
    })

    return successResponse({ subscription: data })
  } catch (error: any) {
    console.error('Error in PATCH /api/expenses/subscriptions/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// DELETE /api/expenses/subscriptions/[id] - Delete subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    // Check if subscription exists and belongs to org
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id, name')
      .eq('id', params.id)
      .eq('org_id', orgId)
      .single()

    if (!existing) {
      return errorResponse('Subscription not found', 404)
    }

    // Delete subscription (cascades to alerts via foreign key)
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', params.id)
      .eq('org_id', orgId)

    if (error) throw error

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'delete',
      entity: 'subscription',
      entity_id: params.id,
      payload: { name: existing.name }
    })

    return successResponse({ message: 'Subscription deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/expenses/subscriptions/[id]:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
