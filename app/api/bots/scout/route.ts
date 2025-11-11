// ================================================================================
// CR AUDIOVIZ AI - SCOUT BOT API ROUTE
// Competitive intelligence execution endpoint
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ScoutBot } from '@/lib/bots/ScoutBot';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes for web crawling

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

    // Execute Scout bot
    const scout = new ScoutBot();
    const result = await scout.run();

    return NextResponse.json({
      success: true,
      bot: 'scout',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    logError('Scout bot execution error:', error);
    return NextResponse.json(
      {
        error: 'Execution failed',
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
