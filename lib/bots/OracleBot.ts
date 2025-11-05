// ============================================================================
// ORACLE BOT - Predictive Analytics
// ============================================================================
// Monitors: Trends, patterns, forecasts issues before they occur
// Runs: Every 1 hour (Priority 6)
// ============================================================================

import { BaseBot } from './BaseBot';
import { BotConfig, BotFinding } from './types';
import { createClient } from '@supabase/supabase-js';

export class OracleBot extends BaseBot {
  private supabase;

  constructor() {
    const config: BotConfig = {
      name: 'ORACLE',
      description: 'Predictive analytics - forecasts issues before they occur',
      runInterval: '1 hour',
      priority: 6,
      capabilities: [
        'trend_analysis',
        'predictive_modeling',
        'anomaly_detection',
        'capacity_planning'
      ]
    };
    super(config);

    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Main execution - Analyze trends and predict issues
   */
  async execute(): Promise<void> {
    await this.analyzeTrends();
    await this.predictCapacityIssues();
    await this.identifyPatterns();
  }

  /**
   * Analyze historical trends
   */
  private async analyzeTrends(): Promise<void> {
    try {
      // Get bot execution history
      const { data: executions } = await this.supabase
        .from('bot_executions')
        .select('bot_id, status, execution_time_ms, started_at')
        .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('started_at', { ascending: true });

      if (!executions || executions.length === 0) {
        return;
      }

      // Calculate failure rate trend
      const failures = executions.filter((e: any) => e.status === 'failed').length;
      const failureRate = (failures / executions.length) * 100;

      if (failureRate > 10) {
        await this.createFinding({
          type: 'increasing_failure_rate',
          severity: 'warning',
          title: 'Elevated bot failure rate detected',
          description: `${failureRate.toFixed(1)}% of executions failing in last 24h`,
          metadata: {
            failure_rate: failureRate,
            total_executions: executions.length,
            failed_executions: failures
          }
        });
      }

      // Calculate average execution time trend
      const avgExecutionTime = executions.reduce((sum: number, e: any) => 
        sum + (e.execution_time_ms || 0), 0) / executions.length;

      await this.createHealthCheck({
        check_type: 'trend_analysis',
        target: 'bot_executions',
        status: failureRate < 5 ? 'healthy' : 'warning',
        metadata: {
          avg_execution_time_ms: Math.round(avgExecutionTime),
          failure_rate: failureRate,
          sample_size: executions.length
        }
      });

    } catch (error: any) {
      this.log('error', `Trend analysis failed: ${error.message}`);
    }
  }

  /**
   * Predict capacity issues
   */
  private async predictCapacityIssues(): Promise<void> {
    try {
      // Check findings growth rate
      const { data: recentFindings } = await this.supabase
        .from('bot_findings')
        .select('created_at, severity')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!recentFindings) return;

      // Group by day
      const dailyCounts: Record<string, number> = {};
      recentFindings.forEach((f: any) => {
        const day = f.created_at.split('T')[0];
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      });

      const days = Object.keys(dailyCounts).sort();
      if (days.length >= 3) {
        // Check if trend is increasing
        const recent = dailyCounts[days[days.length - 1]];
        const previous = dailyCounts[days[days.length - 2]];
        
        if (recent > previous * 1.5) {
          await this.createFinding({
            type: 'increasing_issues_trend',
            severity: 'warning',
            title: 'Increasing rate of issues detected',
            description: 'System issues are trending upward',
            metadata: {
              recent_count: recent,
              previous_count: previous,
              growth_rate: ((recent / previous - 1) * 100).toFixed(1) + '%'
            }
          });
        }
      }

    } catch (error: any) {
      this.log('error', `Capacity prediction failed: ${error.message}`);
    }
  }

  /**
   * Identify recurring patterns
   */
  private async identifyPatterns(): Promise<void> {
    try {
      // Check for recurring issues
      const { data: findings } = await this.supabase
        .from('bot_findings')
        .select('type, count')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!findings) return;

      // Count by type
      const typeCounts: Record<string, number> = {};
      findings.forEach((f: any) => {
        typeCounts[f.type] = (typeCounts[f.type] || 0) + 1;
      });

      // Identify recurring issues
      for (const [type, count] of Object.entries(typeCounts)) {
        if (count >= 5) {
          await this.createFinding({
            type: 'recurring_issue_pattern',
            severity: 'medium',
            title: `Recurring issue detected: ${type}`,
            description: `This issue has occurred ${count} times in the past week`,
            metadata: {
              issue_type: type,
              occurrence_count: count
            }
          });
        }
      }

    } catch (error: any) {
      this.log('error', `Pattern identification failed: ${error.message}`);
    }
  }

  async attemptAutoFix(finding: BotFinding): Promise<boolean> {
    // ORACLE predicts but doesn't fix
    return false;
  }
}
