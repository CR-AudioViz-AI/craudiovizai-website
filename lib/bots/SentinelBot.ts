// ============================================================================
// SENTINEL BOT - Primary Health & Uptime Monitor
// ============================================================================
// Monitors: Uptime, Response Times, Availability, SSL Certificates
// Runs: Every 2 minutes (Priority 9)
// ============================================================================

import { BaseBot } from './BaseBot';
import { BotConfig, BotFinding, BotAction } from './types';

export class SentinelBot extends BaseBot {
  constructor() {
    const config: BotConfig = {
      name: 'SENTINEL',
      description: 'Primary health monitor - checks uptime and response times',
      runInterval: '2 minutes',
      priority: 9,
      capabilities: [
        'uptime_monitoring',
        'response_time_tracking',
        'ssl_verification',
        'endpoint_health_checks'
      ]
    };
    super(config);
  }

  /**
   * Main execution - Check health of all critical endpoints
   */
  async execute(): Promise<void> {
    const endpoints = await this.getCriticalEndpoints();
    
    for (const endpoint of endpoints) {
      await this.checkEndpointHealth(endpoint);
    }

    // Check SSL certificates
    await this.checkSSLCertificates();
  }

  /**
   * Get list of critical endpoints to monitor
   */
  private async getCriticalEndpoints(): Promise<string[]> {
    return [
      'https://craudiovizai.com',
      'https://craudiovizai.com/api/health',
      'https://javariai.com',
      'https://javariai.com/api/health'
    ];
  }

  /**
   * Check health of a single endpoint
   */
  private async checkEndpointHealth(url: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });

      const responseTime = Date.now() - startTime;

      // Check if response is healthy
      if (!response.ok) {
        await this.createFinding({
          type: 'endpoint_down',
          severity: 'critical',
          title: `Endpoint returning error: ${url}`,
          description: `HTTP ${response.status}: ${response.statusText}`,
          affectedResource: url,
          metadata: {
            status_code: response.status,
            response_time_ms: responseTime
          }
        });
      } else if (responseTime > 3000) {
        // Slow response
        await this.createFinding({
          type: 'slow_response',
          severity: 'warning',
          title: `Slow response from: ${url}`,
          description: `Response time: ${responseTime}ms (threshold: 3000ms)`,
          affectedResource: url,
          metadata: {
            response_time_ms: responseTime
          }
        });
      }

      // Log successful check
      await this.createHealthCheck({
        check_type: 'endpoint_health',
        target: url,
        status: response.ok ? 'healthy' : 'unhealthy',
        response_time_ms: responseTime,
        metadata: {
          status_code: response.status
        }
      });

    } catch (error: any) {
      // Endpoint completely unreachable
      await this.createFinding({
        type: 'endpoint_unreachable',
        severity: 'critical',
        title: `Endpoint unreachable: ${url}`,
        description: error.message,
        affectedResource: url,
        autoFixable: false,
        metadata: {
          error: error.message
        }
      });

      await this.createHealthCheck({
        check_type: 'endpoint_health',
        target: url,
        status: 'unhealthy',
        metadata: {
          error: error.message
        }
      });
    }
  }

  /**
   * Check SSL certificate validity
   */
  private async checkSSLCertificates(): Promise<void> {
    const domains = ['craudiovizai.com', 'javariai.com'];
    
    for (const domain of domains) {
      try {
        const response = await fetch(`https://${domain}`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });

        // If fetch succeeds, SSL is valid
        // In production, you'd check certificate expiry date
        await this.createHealthCheck({
          check_type: 'ssl_certificate',
          target: domain,
          status: 'healthy',
          metadata: {
            verified: true
          }
        });

      } catch (error: any) {
        if (error.message.includes('certificate') || error.message.includes('SSL')) {
          await this.createFinding({
            type: 'ssl_invalid',
            severity: 'critical',
            title: `SSL certificate issue: ${domain}`,
            description: error.message,
            affectedResource: domain,
            autoFixable: false
          });
        }
      }
    }
  }

  /**
   * SENTINEL is capable of auto-fixing some issues
   */
  async attemptAutoFix(finding: BotFinding): Promise<boolean> {
    // SENTINEL can't directly fix most issues, but can trigger restarts
    // This would integrate with deployment systems in production
    
    if (finding.type === 'slow_response') {
      // Try clearing cache or triggering revalidation
      this.log('info', 'Would trigger cache clear for slow endpoint');
      return false; // Requires manual intervention
    }

    return false;
  }
}
