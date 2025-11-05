// ================================================================================
// CR AUDIOVIZ AI - PULSE BOT API ROUTE
// Real-time system vitals execution endpoint
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PulseBot } from '@/lib/bots/PulseBot';

export const runtime = 'edge';
export const maxDuration = 30; // 30 seconds - must be fast

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Execute Pulse bot
    const pulse = new PulseBot();
    const result = await pulse.run();

    return NextResponse.json({
      success: true,
      bot: 'pulse',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Pulse bot execution error:', error);
    return NextResponse.json(
      {
        error: 'Execution failed',
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
