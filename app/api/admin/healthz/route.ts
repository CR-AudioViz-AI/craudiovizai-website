// CR AudioViz AI - Admin Health Check API
// Session: 2025-10-25 Phase 3 Build
// Route: /api/admin/healthz/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    // Check database connection
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    const dbStatus = dbError ? 'unhealthy' : 'healthy'

    // Check auth status
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    const authStatus = authError ? 'unhealthy' : 'healthy'

    // Overall system health
    const isHealthy = dbStatus === 'healthy' && authStatus === 'healthy'

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        authentication: authStatus
      },
      user: {
        authenticated: !!session,
        user_id: session?.user?.id || null
      }
    }, {
      status: isHealthy ? 200 : 503
    })

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, {
      status: 503
    })
  }
}
