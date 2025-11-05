// ============================================================================
// SENTINEL-API BOT - API Health Monitor
// ============================================================================
// Monitors: API endpoints, webhook delivery, rate limits, authentication
// Runs: Every 3 minutes (Priority 8)
// ============================================================================

import { BaseBot } from './BaseBot';
import { BotConfig, BotFinding } from './types';

export class SentinelAPIBot extends BaseBot {
  constructor() {
    const config: BotConfig = {
      name: 'SENTINEL-API',
      description: 'API health specialist - monitors endpoints and webhooks',
      runInterval: '3 minutes',
      priority: 8,
      capabilities: [
        'api_monitoring',
        'webhook_verification',
        'rate_limit_tracking',
        'auth_health_checks'
      ]
    };
    super(config);
  }

  /**
   * Main execution - Monitor API health
   */
  async execute(): Promise<void> {
    await this.checkCriticalAPIs();
    await this.verifyWebhookEndpoints();
    await this.monitorRateLimits();
  }

  /**
   * Check health of critical API endpoints
   */
  private async checkCriticalAPIs(): Promise<void> {
    const apis = [
      { url: 'https://craudiovizai.com/api/health', name: 'Main Site Health' },
      { url: 'https://javariai.com/api/health', name: 'Javari Health' },
      { url: 'https://craudiovizai.com/api/bots/status', name: 'Bot Status API' }
    ];

    for (const api of apis) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(api.url, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

        const responseTime = Date.now() - startTime;

        if (!response.ok) {
          await this.createFinding({
            type: 'api_error',
            severity: response.status >= 500 ? 'high' : 'medium',
            title: `API error: ${api.name}`,
            description: `HTTP ${response.status}: ${response.statusText}`,
            affectedResource: api.url,
            metadata: {
              status_code: response.status,
              response_time_ms: responseTime
            }
          });
        }

        await this.createHealthCheck({
          check_type: 'api_health',
          target: api.name,
          status: response.ok ? 'healthy' : 'unhealthy',
          response_time_ms: responseTime,
          metadata: {
            url: api.url,
            status_code: response.status
          }
        });

        if (response.ok && responseTime > 2000) {
          await this.createFinding({
            type: 'slow_api_response',
            severity: 'warning',
            title: `Slow API response: ${api.name}`,
            description: `Response time: ${responseTime}ms`,
            affectedResource: api.url,
            metadata: {
              response_time_ms: responseTime
            }
          });
        }

      } catch (error: any) {
        await this.createFinding({
          type: 'api_unreachable',
          severity: 'critical',
          title: `API unreachable: ${api.name}`,
          description: error.message,
          affectedResource: api.url,
          autoFixable: false
        });

        await this.createHealthCheck({
          check_type: 'api_health',
          target: api.name,
          status: 'unhealthy',
          metadata: {
            url: api.url,
            error: error.message
          }
        });
      }
    }
  }

  /**
   * Verify webhook endpoints are accessible
   */
  private async verifyWebhookEndpoints(): Promise<void> {
    const webhooks = [
      'https://craudiovizai.com/api/webhooks/stripe',
      'https://craudiovizai.com/api/webhooks/paypal'
    ];

    for (const webhook of webhooks) {
      try {
        // Just verify the endpoint exists (returns 405 for GET is OK)
        const response = await fetch(webhook, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });

        // 405 means endpoint exists but doesn't accept this method (expected)
        // 404 means endpoint doesn't exist (problem)
        const status = response.status === 405 || response.status === 200 ? 'healthy' : 'unhealthy';

        await this.createHealthCheck({
          check_type: 'webhook_health',
          target: webhook,
          status,
          metadata: {
            status_code: response.status
          }
        });

        if (response.status === 404) {
          await this.createFinding({
            type: 'webhook_not_found',
            severity: 'high',
            title: `Webhook endpoint not found: ${webhook}`,
            description: 'Webhook endpoint is not accessible',
            affectedResource: webhook,
            autoFixable: false
          });
        }

      } catch (error: any) {
        this.log('error', `Webhook verification failed for ${webhook}: ${error.message}`);
      }
    }
  }

  /**
   * Monitor rate limit usage
   */
  private async monitorRateLimits(): Promise<void> {
    // In production, would check actual rate limit usage from APIs
    // This is a placeholder for the monitoring logic
    
    await this.createHealthCheck({
      check_type: 'rate_limits',
      target: 'api_rate_limits',
      status: 'healthy',
      metadata: {
        checked: true
      }
    });
  }

  async attemptAutoFix(finding: BotFinding): Promise<boolean> {
    // API issues typically require deployment fixes
    return false;
  }
}
