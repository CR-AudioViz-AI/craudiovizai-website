// app/api/expenses/cron/renewalAlerts/route.ts
// Cron job that runs daily to check for upcoming subscription renewals and create alerts

import { NextRequest } from 'next/server'
import { supabaseAdmin, errorResponse, successResponse } from '@/lib/expenses/supabase-server'

// Feature flag check
function isAlertsEnabled(): boolean {
  return process.env.ALERTS_ENABLED === '1' || process.env.ALERTS_ENABLED === 'true'
}

// GET /api/expenses/cron/renewalAlerts - Daily cron to create renewal alerts
export async function GET(request: NextRequest) {
  try {
    if (!isAlertsEnabled()) {
      return errorResponse('Alerts are disabled', 403)
    }

    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return errorResponse('Unauthorized', 401)
    }

    const lookaheadDays = parseInt(process.env.RENEWAL_LOOKAHEAD_DAYS || '45')
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + lookaheadDays)

    // Get all active subscriptions with end_date within lookahead window
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*, vendor:vendors(name)')
      .eq('active', true)
      .not('end_date', 'is', null)
      .gte('end_date', today.toISOString().split('T')[0])
      .lte('end_date', futureDate.toISOString().split('T')[0])

    if (subError) {
      console.error('Error fetching subscriptions:', subError)
      return errorResponse('Failed to fetch subscriptions', 500)
    }

    let alertsCreated = 0
    let alertsUpdated = 0

    // Create or update alerts for each subscription
    for (const sub of subscriptions || []) {
      const vendorName = sub.vendor?.name || 'Unknown Vendor'
      const title = `Renewal Due: ${sub.name}`
      const description = `${vendorName} subscription ${sub.name} ($${sub.amount}) renews on ${sub.end_date}`

      // Try to insert, if unique constraint fails, update last_triggered_at
      const { error: insertError } = await supabaseAdmin
        .from('alerts')
        .insert({
          org_id: sub.org_id,
          source: 'subscription',
          source_id: sub.id,
          kind: 'renewal_due',
          title,
          description,
          due_on: sub.end_date
        })

      if (insertError) {
        if (insertError.code === '23505') {
          // Alert already exists, update last_triggered_at
          await supabaseAdmin
            .from('alerts')
            .update({
              last_triggered_at: new Date().toISOString(),
              description // Update description in case amount changed
            })
            .eq('org_id', sub.org_id)
            .eq('source', 'subscription')
            .eq('source_id', sub.id)
            .eq('kind', 'renewal_due')
            .eq('due_on', sub.end_date)

          alertsUpdated++
        } else {
          console.error('Error creating alert:', insertError)
        }
      } else {
        alertsCreated++
      }
    }

    return successResponse({
      success: true,
      subscriptions_checked: subscriptions?.length || 0,
      alerts_created: alertsCreated,
      alerts_updated: alertsUpdated,
      lookahead_days: lookaheadDays
    })
  } catch (error: any) {
    console.error('Error in renewal alerts cron:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
