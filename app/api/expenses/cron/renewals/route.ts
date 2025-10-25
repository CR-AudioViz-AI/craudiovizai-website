// app/api/expenses/cron/renewals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { successResponse, errorResponse } from '@/lib/expenses/supabase-server'

// GET /api/expenses/cron/renewals - Check for upcoming renewals and create alerts
// This endpoint should be called by Vercel Cron daily
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return errorResponse('Unauthorized', 401)
    }

    // Use service role client to access all orgs
    const supabase = createClient()

    // Get all active subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('id, org_id, name, next_renewal_date, renewal_alert_days')
      .eq('status', 'active')
      .not('next_renewal_date', 'is', null)

    if (subError) throw subError

    const today = new Date()
    let alertsCreated = 0
    let alertsSkipped = 0

    for (const sub of subscriptions || []) {
      const renewalDate = new Date(sub.next_renewal_date)
      const alertDays = sub.renewal_alert_days || 7
      const alertDate = new Date(renewalDate)
      alertDate.setDate(alertDate.getDate() - alertDays)

      // Check if we should create an alert (alert date is today or in the past, but renewal is in the future)
      if (alertDate <= today && renewalDate > today) {
        // Check if alert already exists for this renewal
        const { data: existingAlert } = await supabase
          .from('alerts')
          .select('id, acknowledged, snoozed_until')
          .eq('subscription_id', sub.id)
          .eq('type', 'renewal')
          .single()

        // Don't create if already exists and is either acknowledged or snoozed
        if (existingAlert) {
          if (existingAlert.acknowledged) {
            alertsSkipped++
            continue
          }
          if (existingAlert.snoozed_until && new Date(existingAlert.snoozed_until) > today) {
            alertsSkipped++
            continue
          }
          
          // Update existing unacknowledged alert
          await supabase
            .from('alerts')
            .update({
              message: `Subscription "${sub.name}" renews in ${Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days`,
              trigger_date: today.toISOString()
            })
            .eq('id', existingAlert.id)
          
          alertsCreated++
        } else {
          // Create new alert
          const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          const { error: insertError } = await supabase
            .from('alerts')
            .insert({
              org_id: sub.org_id,
              subscription_id: sub.id,
              type: 'renewal',
              message: `Subscription "${sub.name}" renews in ${daysUntilRenewal} days`,
              trigger_date: today.toISOString(),
              acknowledged: false
            })

          if (!insertError) {
            alertsCreated++
          }
        }
      }
    }

    // Check for past due subscriptions (renewal date has passed)
    const { data: pastDueSubscriptions } = await supabase
      .from('subscriptions')
      .select('id, org_id, name, next_renewal_date')
      .eq('status', 'active')
      .not('next_renewal_date', 'is', null)
      .lt('next_renewal_date', today.toISOString())

    let pastDueAlertsCreated = 0

    for (const sub of pastDueSubscriptions || []) {
      // Check if past due alert already exists
      const { data: existingAlert } = await supabase
        .from('alerts')
        .select('id')
        .eq('subscription_id', sub.id)
        .eq('type', 'past_due')
        .single()

      if (!existingAlert) {
        const daysPastDue = Math.ceil((today.getTime() - new Date(sub.next_renewal_date).getTime()) / (1000 * 60 * 60 * 24))
        
        await supabase
          .from('alerts')
          .insert({
            org_id: sub.org_id,
            subscription_id: sub.id,
            type: 'past_due',
            message: `Subscription "${sub.name}" renewal date passed ${daysPastDue} days ago - please update`,
            trigger_date: today.toISOString(),
            acknowledged: false
          })
        
        pastDueAlertsCreated++
      }
    }

    return successResponse({
      success: true,
      alerts_created: alertsCreated,
      alerts_skipped: alertsSkipped,
      past_due_alerts_created: pastDueAlertsCreated,
      subscriptions_checked: subscriptions?.length || 0,
      timestamp: today.toISOString()
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/cron/renewals:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// POST /api/expenses/cron/renewals - Manual trigger for testing
export async function POST(request: NextRequest) {
  try {
    // Allow authenticated users to manually trigger for testing
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // Call the GET handler logic
    return GET(request)
  } catch (error: any) {
    console.error('Error in POST /api/expenses/cron/renewals:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
