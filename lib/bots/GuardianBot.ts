// ============================================================================
// GUARDIAN BOT - Security & Threat Monitor  
// ============================================================================
// Monitors: Security threats, suspicious activity, failed auth attempts
// Runs: Every 5 minutes (Priority 9)
// ============================================================================

import { BaseBot } from './BaseBot';
import { BotConfig, BotFinding } from './types';
import { createClient } from '@supabase/supabase-js';

export class GuardianBot extends BaseBot {
  private supabase;

  constructor() {
    const config: BotConfig = {
      name: 'GUARDIAN',
      description: 'Security specialist - monitors threats and vulnerabilities',
      runInterval: '5 minutes',
      priority: 9,
      capabilities: [
        'security_monitoring',
        'threat_detection',
        'auth_monitoring',
        'vulnerability_scanning'
      ]
    };
    super(config);

    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Main execution - Monitor security threats
   */
  async execute(): Promise<void> {
    // Check security threats table
    await this.checkSecurityThreats();
    
    // Check for unusual patterns
    await this.detectAnomalies();
    
    // Verify security configurations
    await this.verifySecurityConfig();
  }

  /**
   * Check recent security threats
   */
  private async checkSecurityThreats(): Promise<void> {
    try {
      const { data: threats, error } = await this.supabase
        .from('security_threats')
        .select('*')
        .eq('resolved', false)
        .gte('detected_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      if (error) throw error;

      if (threats && threats.length > 0) {
        const criticalThreats = threats.filter((t: any) => t.severity === 'critical');
        
        if (criticalThreats.length > 0) {
          await this.createFinding({
            type: 'critical_security_threat',
            severity: 'critical',
            title: `${criticalThreats.length} critical security threat(s) detected`,
            description: 'Immediate attention required',
            metadata: {
              threat_count: criticalThreats.length,
              threats: criticalThreats.map((t: any) => ({
                id: t.id,
                type: t.threat_type,
                ip: t.ip_address
              }))
            }
          });
        }
      }

      await this.createHealthCheck({
        check_type: 'security_threats',
        target: 'security_threats_table',
        status: threats && threats.length > 5 ? 'unhealthy' : 'healthy',
        metadata: {
          active_threats: threats?.length || 0
        }
      });

    } catch (error: any) {
      this.log('error', `Failed to check security threats: ${error.message}`);
    }
  }

  /**
   * Detect anomalous patterns
   */
  private async detectAnomalies(): Promise<void> {
    try {
      // Check for unusual spike in traffic
      const { data: recentEvents } = await this.supabase
        .from('security_events')
        .select('event_type')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      if (recentEvents && recentEvents.length > 1000) {
        await this.createFinding({
          type: 'traffic_anomaly',
          severity: 'warning',
          title: 'Unusual traffic spike detected',
          description: `${recentEvents.length} events in last 5 minutes`,
          metadata: {
            event_count: recentEvents.length
          }
        });
      }

    } catch (error: any) {
      this.log('error', `Failed to detect anomalies: ${error.message}`);
    }
  }

  /**
   * Verify security configuration
   */
  private async verifySecurityConfig(): Promise<void> {
    // Check environment variables
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'ANTHROPIC_API_KEY'
    ];

    const missing = requiredEnvVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
      await this.createFinding({
        type: 'missing_config',
        severity: 'critical',
        title: 'Missing security configuration',
        description: `Missing env vars: ${missing.join(', ')}`,
        autoFixable: false
      });
    }
  }

  async attemptAutoFix(finding: BotFinding): Promise<boolean> {
    // GUARDIAN monitors but escalates to Javari for threat handling
    return false;
  }
}
