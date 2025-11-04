// ================================================================================
// CR AUDIOVIZ AI - AUTONOMOUS BOT SYSTEM
// API Route: /api/bots/conductor
// Triggered by Vercel Cron every 5 minutes
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ConductorBot } from '@/lib/bots/ConductorBot';

/**
 * GET handler for Conductor bot cron job
 * 
 * Vercel Cron Configuration (in vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/bots/conductor",
 *     "schedule": "*\/5 * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify this is a cron request (Vercel sets this header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🎭 CONDUCTOR BOT: Cron job triggered');

    // Create and execute conductor bot
    const conductor = new ConductorBot();
    const result = await conductor.execute();

    const executionTime = Date.now() - startTime;

    console.log('✅ CONDUCTOR BOT: Execution complete', {
      executionId: result.executionId,
      status: result.status,
      checksPerformed: result.checksPerformed,
      issuesFound: result.issuesFound,
      issuesFixed: result.issuesFixed,
      ticketsCreated: result.ticketsCreated,
      executionTimeMs: executionTime
    });

    return NextResponse.json({
      success: true,
      bot: 'conductor',
      executionId: result.executionId,
      result: {
        status: result.status,
        executionTimeMs: executionTime,
        checksPerformed: result.checksPerformed,
        issuesFound: result.issuesFound,
        issuesFixed: result.issuesFixed,
        ticketsCreated: result.ticketsCreated
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('❌ CONDUCTOR BOT: Execution failed', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      executionTimeMs: executionTime
    });

    return NextResponse.json({
      success: false,
      bot: 'conductor',
      error: (error as Error).message,
      executionTimeMs: executionTime,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST handler for manual execution (via admin dashboard)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify admin authentication
    // (Add your auth logic here)

    console.log('🎭 CONDUCTOR BOT: Manual execution triggered');

    const conductor = new ConductorBot();
    const result = await conductor.execute();

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      bot: 'conductor',
      executionId: result.executionId,
      result: {
        status: result.status,
        executionTimeMs: executionTime,
        checksPerformed: result.checksPerformed,
        issuesFound: result.issuesFound,
        issuesFixed: result.issuesFixed,
        ticketsCreated: result.ticketsCreated
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      bot: 'conductor',
      error: (error as Error).message,
      executionTimeMs: executionTime,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
