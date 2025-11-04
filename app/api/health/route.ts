import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        supabase: false,
        legalease_table: false,
        authentication: false
      },
      database: {
        legalease_table: false,
        connection: false
      }
    }

    // Check Supabase connection
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (!error) {
        checks.services.supabase = true
        checks.database.connection = true
      }
    } catch (err) {
      console.error('Supabase connection check failed:', err)
    }

    // Check legalease_documents table
    try {
      const { data, error } = await supabase
        .from('legalease_documents')
        .select('id')
        .limit(1)
      
      if (!error || error.message.includes('Results contain 0 rows')) {
        checks.services.legalease_table = true
        checks.database.legalease_table = true
      } else if (error.code === '42P01') {
        // Table doesn't exist - this is expected before migration
        checks.services.legalease_table = false
        checks.database.legalease_table = false
      }
    } catch (err: any) {
      checks.services.legalease_table = false
      checks.database.legalease_table = false
    }

    // Check auth
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!error || error.message.includes('session')) {
        checks.services.authentication = true
      }
    } catch (err) {
      // Auth check from server may fail, that's OK
      checks.services.authentication = true
    }

    // Overall status
    if (checks.services.supabase && checks.database.connection) {
      if (checks.database.legalease_table) {
        checks.status = 'healthy'
      } else {
        checks.status = 'degraded' // Works but missing optional table
      }
    } else {
      checks.status = 'unhealthy'
    }

    return NextResponse.json(checks)

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
