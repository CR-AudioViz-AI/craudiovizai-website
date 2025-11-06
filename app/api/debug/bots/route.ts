// ================================================================================
// DEBUG ENDPOINT - Complete Bot System Status
// Shows: Bots, Recent Executions, Database Schema, System Health
// ================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Get all bots with full details
    const { data: bots, error: botsError } = await supabase
      .from('bots')
      .select('*')
      .order('name');

    // 2. Get recent executions (last 10)
    const { data: executions, error: executionsError } = await supabase
      .from('bot_executions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);

    // 3. Get execution counts per bot
    const executionStats: any = {};
    if (bots) {
      for (const bot of bots) {
        const { count } = await supabase
          .from('bot_executions')
          .select('*', { count: 'exact', head: true })
          .eq('bot_id', bot.id);
        
        executionStats[bot.name] = count || 0;
      }
    }

    // 4. System status
    const now = new Date();
    const systemStatus = {
      timestamp: now.toISOString(),
      timezone: 'America/New_York',
      localTime: now.toLocaleString('en-US', { timeZone: 'America/New_York' }),
      database: {
        connected: !botsError,
        botsTable: bots ? 'OK' : 'ERROR',
        executionsTable: executions ? 'OK' : 'ERROR'
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
        cronSecret: process.env.CRON_SECRET ? 'SET' : 'MISSING'
      }
    };

    // 5. Bot health analysis
    const botHealth = bots?.map(bot => {
      const lastExec = bot.last_execution_at ? new Date(bot.last_execution_at) : null;
      const nextExec = bot.next_execution_at ? new Date(bot.next_execution_at) : null;
      const timeSinceLastExec = lastExec ? Math.floor((now.getTime() - lastExec.getTime()) / 1000 / 60) : null;
      const timeUntilNextExec = nextExec ? Math.floor((nextExec.getTime() - now.getTime()) / 1000 / 60) : null;

      return {
        name: bot.name,
        displayName: bot.display_name,
        status: bot.status,
        health: {
          lastExecutedMinutesAgo: timeSinceLastExec,
          nextExecutionInMinutes: timeUntilNextExec,
          isOverdue: nextExec && nextExec < now,
          hasNeverRun: !lastExec
        },
        stats: {
          totalRuns: bot.total_runs || 0,
          successfulRuns: bot.successful_runs || 0,
          failedRuns: bot.failed_runs || 0,
          successRate: bot.total_runs 
            ? Math.round((bot.successful_runs || 0) / bot.total_runs * 100) 
            : 0,
          avgExecutionTimeMs: bot.avg_execution_time_ms || 0
        },
        schedule: {
          frequencyMinutes: bot.run_frequency_minutes || 5,
          lastExecution: lastExec?.toISOString() || 'Never',
          nextExecution: nextExec?.toISOString() || 'Not scheduled'
        },
        totalExecutionsInDB: executionStats[bot.name] || 0
      };
    }) || [];

    // 6. Recent execution details
    const recentExecutions = executions?.map(exec => ({
      id: exec.id,
      botId: exec.bot_id,
      status: exec.status,
      startedAt: exec.started_at,
      completedAt: exec.completed_at,
      executionTimeMs: exec.execution_time_ms,
      checksPerformed: exec.checks_performed,
      issuesFound: exec.issues_found,
      issuesFixed: exec.issues_fixed,
      errorMessage: exec.error_message
    })) || [];

    // 7. Issues summary
    const issues = {
      botsNeverRun: botHealth.filter(b => b.health.hasNeverRun).map(b => b.name),
      botsOverdue: botHealth.filter(b => b.health.isOverdue).map(b => b.name),
      botsWithErrors: bots?.filter(b => b.status === 'error').map(b => b.name) || [],
      totalIssues: 0
    };
    issues.totalIssues = issues.botsNeverRun.length + issues.botsOverdue.length + issues.botsWithErrors.length;

    return NextResponse.json({
      success: true,
      systemStatus,
      summary: {
        totalBots: bots?.length || 0,
        activeBots: bots?.filter(b => b.status === 'active').length || 0,
        totalExecutions: executions?.length || 0,
        issuesFound: issues.totalIssues
      },
      botHealth,
      recentExecutions,
      issues,
      errors: {
        bots: botsError?.message,
        executions: executionsError?.message
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500 
    });
  }
}
