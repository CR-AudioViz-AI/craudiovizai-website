// ================================================================================
// CR AUDIOVIZ AI - PUBLIC BOT STATUS API
// Returns bot status without authentication (read-only)
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Use service role key for database access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch bot status (read-only, safe to expose)
    const { data: bots, error } = await supabase
      .from('bots')
      .select('name, display_name, status, last_run_at, total_runs, successful_runs, failed_runs, avg_execution_time_ms')
      .order('name');

    if (error) {
      console.error('Error fetching bot status:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch bot status',
          message: error.message,
          bots: []
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bots: bots || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Unexpected error in bot status API:', error);
    return NextResponse.json(
      { 
        error: 'System error',
        message: (error as Error).message,
        bots: []
      },
      { status: 500 }
    );
  }
}

// Enable CORS for public access
export const runtime = 'edge';
