// API Route: /api/bots/architect
// Vercel Cron: Executes ArchitectBot
import { NextRequest, NextResponse } from 'next/server';
import { ArchitectBot } from '@/lib/bots';

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
    const bot = new ArchitectBot();
    await bot.run();

    return NextResponse.json({
      success: true,
      bot: 'architect',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[architect] Execution failed:', error);
    
    return NextResponse.json({
      error: error.message,
      bot: 'architect',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
