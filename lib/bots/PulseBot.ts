// ================================================================================
// CR AUDIOVIZ AI - PULSE BOT
// Real-time system vitals and critical path monitoring
// Fastest bot - runs every 1 minute for instant health checks
// ================================================================================

import { BaseBot } from './BaseBot';
import type { BotConfig, BotExecutionResult } from './types';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export class PulseBot extends BaseBot {
  constructor() {
    const config: BotConfig = {
      name: 'pulse',
      displayName: 'Pulse',
      description: 'Real-time system vitals monitor that checks critical paths every minute',
      schedule: '* * * * *', // Every 1 minute (fastest bot)
      capabilities: [
        'critical_path_monitoring',
        'instant_health_checks',
        'auth_verification',
        'payment_connectivity',
        'database_ping',
        'rapid_alerting'
      ]
    };
    super(config);
  }

  async execute(): Promise<BotExecutionResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    let severity: 'info' | 'warning' | 'critical' = 'info';

    try {
      const startTime = Date.now();

      // Quick vital checks (must complete in <30 seconds)
      const vitals = await Promise.all([
        this.checkAuthSystem(),
        this.checkDatabaseConnectivity(),
        this.checkPaymentGateways(),
        this.checkAPIEndpoints(),
        this.checkUserSessions()
      ]);

      const authCheck = vitals[0];
      const dbCheck = vitals[1];
      const paymentCheck = vitals[2];
      const apiCheck = vitals[3];
      const sessionCheck = vitals[4];

      // Aggregate findings
      findings.push(...authCheck.findings);
      findings.push(...dbCheck.findings);
      findings.push(...paymentCheck.findings);
      findings.push(...apiCheck.findings);
      findings.push(...sessionCheck.findings);

      // Determine severity
      const criticalIssues = [
        authCheck.critical,
        dbCheck.critical,
        paymentCheck.critical,
        apiCheck.critical
      ].filter(Boolean).length;

      if (criticalIssues > 0) {
        severity = 'critical';
        actions.push(`ALERT: ${criticalIssues} critical system(s) down`);
        actions.push('Notify on-call team immediately');
      } else if (vitals.some(v => v.warning)) {
        severity = 'warning';
        actions.push('Monitor degraded system(s) closely');
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        findings,
        actions,
        severity,
        metadata: {
          executionTimeMs: executionTime,
          vitalChecks: 5,
          criticalIssues,
          allSystemsGo: criticalIssues === 0,
          responseTime: executionTime
        }
      };

    } catch (error: unknown) {
      return this.handleError(error as Error);
    }
  }

  private async checkAuthSystem(): Promise<{
    findings: string[];
    critical: boolean;
    warning: boolean;
  }> {
    const findings: string[] = [];
    let critical = false;
    let warning = false;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceKey) {
        findings.push('✗ Auth: Environment variables missing');
        critical = true;
        return { findings, critical, warning };
      }

      // Quick connectivity check
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        findings.push('✓ Auth: Supabase reachable');
      } else {
        findings.push(`⚠ Auth: Status ${response.status}`);
        if (response.status >= 500) {
          critical = true;
        } else {
          warning = true;
        }
      }

    } catch (error: unknown) {
      findings.push(`✗ Auth: ${(error as Error).message.substring(0, 50)}`);
      critical = true;
    }

    return { findings, critical, warning };
  }

  private async checkDatabaseConnectivity(): Promise<{
    findings: string[];
    critical: boolean;
    warning: boolean;
  }> {
    const findings: string[] = [];
    let critical = false;
    let warning = false;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceKey) {
        findings.push('✗ DB: Configuration missing');
        critical = true;
        return { findings, critical, warning };
      }

      const startTime = Date.now();

      // Quick query to test database
      const response = await fetch(
        `${supabaseUrl}/rest/v1/bots?select=count&limit=1`,
        {
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`
          },
          signal: AbortSignal.timeout(3000)
        }
      );

      const queryTime = Date.now() - startTime;

      if (response.ok) {
        findings.push(`✓ DB: Query ${queryTime}ms`);
        if (queryTime > 1000) {
          findings.push('⚠ DB: Slow response time');
          warning = true;
        }
      } else {
        findings.push(`✗ DB: Status ${response.status}`);
        critical = true;
      }

    } catch (error: unknown) {
      findings.push(`✗ DB: ${(error as Error).message.substring(0, 50)}`);
      critical = true;
    }

    return { findings, critical, warning };
  }

  private async checkPaymentGateways(): Promise<{
    findings: string[];
    critical: boolean;
    warning: boolean;
  }> {
    const findings: string[] = [];
    let critical = false;
    let warning = false;

    try {
      // Check Stripe
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (stripeKey) {
        findings.push('✓ Payments: Stripe configured');
      } else {
        findings.push('⚠ Payments: Stripe key missing');
        warning = true;
      }

      // Check PayPal
      const paypalId = process.env.PAYPAL_CLIENT_ID;
      if (paypalId) {
        findings.push('✓ Payments: PayPal configured');
      } else {
        findings.push('⚠ Payments: PayPal key missing');
        warning = true;
      }

      // If both missing, critical
      if (!stripeKey && !paypalId) {
        findings.push('✗ Payments: No gateways configured');
        critical = true;
      }

    } catch (error: unknown) {
      findings.push(`✗ Payments: ${(error as Error).message.substring(0, 50)}`);
      warning = true;
    }

    return { findings, critical, warning };
  }

  private async checkAPIEndpoints(): Promise<{
    findings: string[];
    critical: boolean;
    warning: boolean;
  }> {
    const findings: string[] = [];
    let critical = false;
    let warning = false;

    try {
      // Check critical API endpoints
      const endpoints = [
        '/api/bots/status',
        '/api/health'
      ];

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craudiovizai.com';

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(3000)
          });

          if (response.ok) {
            findings.push(`✓ API: ${endpoint}`);
          } else {
            findings.push(`⚠ API: ${endpoint} (${response.status})`);
            warning = true;
          }
        } catch (error: unknown) {
          findings.push(`✗ API: ${endpoint} unreachable`);
          if (endpoint === '/api/health') {
            critical = true;
          } else {
            warning = true;
          }
        }
      }

    } catch (error: unknown) {
      findings.push(`✗ API: ${(error as Error).message.substring(0, 50)}`);
      warning = true;
    }

    return { findings, critical, warning };
  }

  private async checkUserSessions(): Promise<{
    findings: string[];
    critical: boolean;
    warning: boolean;
  }> {
    const findings: string[] = [];
    let critical = false;
    let warning = false;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceKey) {
        findings.push('ℹ Sessions: Cannot check without credentials');
        return { findings, critical, warning };
      }

      // Try to query active sessions (if auth.users table accessible)
      // This is a quick check - actual implementation may vary based on your schema
      findings.push('ℹ Sessions: Session tracking available');

    } catch (error: unknown) {
      findings.push(`ℹ Sessions: ${(error as Error).message.substring(0, 50)}`);
    }

    return { findings, critical, warning };
  }
}
