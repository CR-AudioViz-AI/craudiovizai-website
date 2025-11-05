// API Route: /api/bots/oracle
// Vercel Cron: Executes OracleBot
import { NextRequest, NextResponse } from 'next/server';
import { OracleBot } from '@/lib/bots';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Execute the bot
    const bot = new OracleBot();
    await bot.run();

    return NextResponse.json({
      success: true,
      bot: 'oracle',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[oracle] Execution failed:', error);
    
    return NextResponse.json({
      error: error.message,
      bot: 'oracle',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
