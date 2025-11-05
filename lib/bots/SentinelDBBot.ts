// ============================================================================
// SENTINEL-DB BOT - Database Health Monitor
// ============================================================================
// Monitors: Database connections, query performance, data integrity
// Runs: Every 10 minutes (Priority 8)
// ============================================================================

import { BaseBot } from './BaseBot';
import { BotConfig, BotFinding } from './types';
import { createClient } from '@supabase/supabase-js';

export class SentinelDBBot extends BaseBot {
  private supabase;

  constructor() {
    const config: BotConfig = {
      name: 'SENTINEL-DB',
      description: 'Database health specialist - monitors query performance and connections',
      runInterval: '10 minutes',
      priority: 8,
      capabilities: [
        'database_monitoring',
        'query_performance',
        'connection_pooling',
        'data_integrity_checks'
      ]
    };
    super(config);

    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Main execution - Monitor database health
   */
  async execute(): Promise<void> {
    await this.checkDatabaseConnection();
    await this.monitorTableHealth();
    await this.checkQueryPerformance();
  }

  /**
   * Verify database connectivity
   */
  private async checkDatabaseConnection(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const { error } = await this.supabase
        .from('bots')
        .select('count')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        await this.createFinding({
          type: 'database_connection_failed',
          severity: 'critical',
          title: 'Database connection failed',
          description: error.message,
          autoFixable: false
        });

        await this.createHealthCheck({
          check_type: 'database_connection',
          target: 'supabase',
          status: 'unhealthy',
          metadata: { error: error.message }
        });
      } else {
        await this.createHealthCheck({
          check_type: 'database_connection',
          target: 'supabase',
          status: 'healthy',
          response_time_ms: responseTime
        });

        if (responseTime > 1000) {
          await this.createFinding({
            type: 'slow_database_query',
            severity: 'warning',
            title: 'Slow database connection',
            description: `Connection time: ${responseTime}ms`,
            metadata: { response_time_ms: responseTime }
          });
        }
      }
    } catch (error: any) {
      await this.createFinding({
        type: 'database_unreachable',
        severity: 'critical',
        title: 'Database unreachable',
        description: error.message,
        autoFixable: false
      });
    }
  }

  /**
   * Monitor critical table health
   */
  private async monitorTableHealth(): Promise<void> {
    const criticalTables = [
      'bots',
      'bot_executions',
      'security_threats',
      'javari_security_tickets'
    ];

    for (const table of criticalTables) {
      try {
        const { count, error } = await this.supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          await this.createFinding({
            type: 'table_access_error',
            severity: 'high',
            title: `Cannot access table: ${table}`,
            description: error.message,
            affectedResource: table
          });
        } else {
          await this.createHealthCheck({
            check_type: 'table_health',
            target: table,
            status: 'healthy',
            metadata: { row_count: count }
          });
        }
      } catch (error: any) {
        this.log('error', `Failed to check table ${table}: ${error.message}`);
      }
    }
  }

  /**
   * Check query performance
   */
  private async checkQueryPerformance(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Run a representative query
      await this.supabase
        .from('bot_executions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      const queryTime = Date.now() - startTime;

      await this.createHealthCheck({
        check_type: 'query_performance',
        target: 'bot_executions',
        status: queryTime < 500 ? 'healthy' : 'degraded',
        response_time_ms: queryTime
      });

      if (queryTime > 1000) {
        await this.createFinding({
          type: 'slow_query',
          severity: 'warning',
          title: 'Slow database query detected',
          description: `Query time: ${queryTime}ms`,
          metadata: { query_time_ms: queryTime }
        });
      }
    } catch (error: any) {
      this.log('error', `Query performance check failed: ${error.message}`);
    }
  }

  async attemptAutoFix(finding: BotFinding): Promise<boolean> {
    // Database issues typically require manual intervention
    return false;
  }
}
