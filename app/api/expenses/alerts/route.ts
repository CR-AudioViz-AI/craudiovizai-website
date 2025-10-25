// app/api/expenses/alerts/route.ts
// API routes for managing alerts (renewal notifications)

import { NextRequest } from 'next/server'
import { supabaseAdmin, getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'

// Feature flag check
function isAlertsEnabled(): boolean {
  return process.env.ALERTS_ENABLED === '1' || process.env.ALERTS_ENABLED === 'true'
}

// GET /api/expenses/alerts - List active alerts
export async function GET(request: NextRequest) {
  try {
    if (!isAlertsEnabled()) {
      return errorResponse('Alerts are disabled', 403)
    }

    const orgId = getOrgId(request)
    const searchParams = request.nextUrl.searchParams
    const includeAcknowledged = searchParams.get('include_acknowledged') === 'true'

    let query = supabaseAdmin
      .from('alerts')
      .select('*')
      .eq('org_id', orgId)
      .order('due_on', { ascending: true })

    if (!includeAcknowledged) {
      query = query.is('acknowledged_at', null)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching alerts:', error)
      return errorResponse('Failed to fetch alerts', 500)
    }

    // Filter out snoozed alerts
    const activeAlerts = data.filter(alert => {
      if (!alert.snooze_until) return true
      return new Date(alert.snooze_until) < new Date()
    })

    return successResponse({ 
      alerts: activeAlerts,
      count: activeAlerts.length
    })
  } catch (error: any) {
    console.error('Error in GET /api/expenses/alerts:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}

// POST /api/expenses/alerts/acknowledge - Acknowledge an alert
export async function POST(request: NextRequest) {
  try {
    if (!isAlertsEnabled()) {
      return errorResponse('Alerts are disabled', 403)
    }

    const orgId = getOrgId(request)
    const body = await request.json()
    const { alert_id, snooze_until } = body

    if (!alert_id) {
      return errorResponse('alert_id is required', 400)
    }

    const updateData: any = {}
    
    if (snooze_until) {
      // Snooze alert
      updateData.snooze_until = snooze_until
    } else {
      // Acknowledge alert
      updateData.acknowledged_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('alerts')
      .update(updateData)
      .eq('id', alert_id)
      .eq('org_id', orgId)
      .select()
      .single()

    if (error) {
      console.error('Error updating alert:', error)
      return errorResponse('Failed to update alert', 500)
    }

    // Audit log
    await auditLog({
      org_id: orgId,
      actor: 'system',
      action: snooze_until ? 'snooze' : 'acknowledge',
      entity: 'alert',
      entity_id: String(alert_id),
      payload: { snooze_until }
    })

    return successResponse({ alert: data })
  } catch (error: any) {
    console.error('Error in POST /api/expenses/alerts:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
