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

    // Fetch bot status - only select columns that exist
    const { data: bots, error } = await supabase
      .from('bots')
      .select('id, name, description, type, status, schedule, last_execution_at, next_execution_at, created_at, updated_at')
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
      count: bots?.length || 0,
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

// Use Node.js runtime instead of Edge for better Supabase compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
