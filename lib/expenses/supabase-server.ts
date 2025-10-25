// lib/expenses/supabase-server.ts
// Server-side Supabase client with service role for expense tracker

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single supabase client for interacting with your database
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper to get org_id from request headers
export function getOrgId(request: Request): string {
  const orgId = request.headers.get('x-org-id') || process.env.ORG_ID
  if (!orgId) {
    throw new Error('Missing org_id in request headers')
  }
  return orgId
}

// Helper to create error responses
export function errorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status })
}

// Helper to create success responses
export function successResponse(data: any, status: number = 200) {
  return Response.json(data, { status })
}

// Audit log helper
export async function auditLog(params: {
  org_id: string
  actor: string
  action: string
  entity: string
  entity_id: string
  payload?: any
}) {
  const { org_id, actor, action, entity, entity_id, payload } = params
  
  await supabaseAdmin.from('audit_log').insert({
    org_id,
    actor,
    action,
    entity,
    entity_id,
    payload: payload || {}
  })
}
