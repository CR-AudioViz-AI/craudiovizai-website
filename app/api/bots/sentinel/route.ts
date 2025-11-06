// API Route: /api/bots/sentinel
// Vercel Cron: Executes SentinelBot
import { NextRequest, NextResponse } from 'next/server';
import { SentinelBot } from '@/lib/bots';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Execute the bot
    const bot = new SentinelBot();
    await bot.run();

    return NextResponse.json({
      success: true,
      bot: 'sentinel',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[sentinel] Execution failed:', error);
    
    return NextResponse.json({
      error: error.message,
      bot: 'sentinel',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
