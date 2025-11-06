// ================================================================================
// PUBLIC BOT TEST ENDPOINT - Manual Bot Testing
// No authentication required - for testing only
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ConductorBot } from '@/lib/bots';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    console.log('[TEST] Manual bot test triggered');
    
    // Create and execute the conductor bot
    const bot = new ConductorBot();
    const result = await bot.execute();

    console.log('[TEST] Bot execution completed:', {
      status: result.status,
      executionTimeMs: result.executionTimeMs
    });

    return NextResponse.json({
      success: true,
      message: 'Bot executed successfully',
      result: {
        executionId: result.executionId,
        botId: result.botId,
        status: result.status,
        executionTimeMs: result.executionTimeMs,
        checksPerformed: result.checksPerformed,
        issuesFound: result.issuesFound,
        issuesFixed: result.issuesFixed,
        ticketsCreated: result.ticketsCreated,
        startedAt: result.startedAt,
        completedAt: result.completedAt
      }
    });

  } catch (error: any) {
    console.error('[TEST] Bot execution failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500 
    });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
