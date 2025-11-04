// ================================================================================
// CR AUDIOVIZ AI - AUTONOMOUS BOT SYSTEM
// CONDUCTOR BOT - Master Orchestrator
// ================================================================================

import { BaseBot } from './BaseBot';
import { BotConfig, BotFinding, FindingSeverity, HealthCheckResult } from './types';

/**
 * CONDUCTOR Bot
 * 
 * Master orchestrator that:
 * - Triggers all specialized bots
 * - Collects and aggregates results
 * - Prioritizes issues
 * - Creates tickets
 * - Manages escalations
 * - Generates reports
 */
export class ConductorBot extends BaseBot {
  constructor() {
    const config: BotConfig = {
      name: 'conductor',
      displayName: 'Conductor',
      description: 'Master orchestrator bot',
      runFrequencyMinutes: 5,
      responsibilities: [
        'orchestrate_bots',
        'aggregate_findings',
        'create_tickets',
        'escalate_issues',
        'generate_reports'
      ],
      priority: 1,
      autoHealingEnabled: false, // Conductor doesn't self-heal, it orchestrates
      maxAutoFixAttempts: 0
    };

    super(config);
  }

  /**
   * Main checks - orchestrate all bots
   */
  protected async runChecks(): Promise<void> {
    this.log('info', '🎭 CONDUCTOR: Starting orchestration cycle');

    // Step 1: Check health of all bots
    await this.checkBotHealth();
    this.incrementChecks();

    // Step 2: Trigger specialized bots (if needed)
    await this.triggerSpecializedBots();
    this.incrementChecks();

    // Step 3: Aggregate recent findings
    const findings = await this.aggregateFindings();
    this.incrementChecks();

    // Step 4: Process findings (create tickets, escalate)
    await this.processFindings(findings);
    this.incrementChecks();

    // Step 5: Check for critical issues
    await this.checkCriticalIssues();
    this.incrementChecks();

    // Step 6: Generate summary
    await this.generateSummary();
    this.incrementChecks();

    this.log('info', '✅ CONDUCTOR: Orchestration cycle complete');
  }

  /**
   * Check health of all bots
   */
  private async checkBotHealth(): Promise<void> {
    this.log('info', 'Checking health of all bots...');

    const { data: bots, error } = await this.supabase
      .from('bots')
      .select('*')
      .neq('name', 'conductor') // Don't check self
      .eq('status', 'active');

    if (error) {
      this.log('error', `Failed to fetch bots: ${error.message}`);
      return;
    }

    for (const bot of bots || []) {
      // Check if bot is overdue
      if (bot.next_run_at) {
        const nextRun = new Date(bot.next_run_at);
        const now = new Date();
        
        if (nextRun < now) {
          const overdueMinutes = Math.floor((now.getTime() - nextRun.getTime()) / 60000);
          
          if (overdueMinutes > bot.run_frequency_minutes * 2) {
            // Bot is significantly overdue
            await this.createFinding({
              severity: 'high',
              category: 'other',
              title: `Bot ${bot.display_name} is overdue`,
              description: `Bot has not run in ${overdueMinutes} minutes (expected every ${bot.run_frequency_minutes} minutes)`,
              affectedResource: bot.name,
              detectionMethod: 'conductor_health_check',
              autoFixAttempted: false,
              autoFixSuccessful: false
            });
          }
        }
      }

      // Check success rate
      if (bot.total_runs > 10) {
        const successRate = (bot.successful_runs / bot.total_runs) * 100;
        
        if (successRate < 80) {
          await this.createFinding({
            severity: 'medium',
            category: 'other',
            title: `Bot ${bot.display_name} has low success rate`,
            description: `Success rate is ${successRate.toFixed(1)}% (threshold: 80%)`,
            affectedResource: bot.name,
            detectionMethod: 'conductor_health_check',
            autoFixAttempted: false,
            autoFixSuccessful: false,
            metadata: {
              success_rate: successRate,
              total_runs: bot.total_runs,
              successful_runs: bot.successful_runs,
              failed_runs: bot.failed_runs
            }
          });
        }
      }
    }
  }

  /**
   * Trigger specialized bots if needed
   * (Vercel cron handles automatic scheduling, but we can trigger manually if needed)
   */
  private async triggerSpecializedBots(): Promise<void> {
    // In production, Vercel cron triggers each bot independently
    // This method is for manual triggering or emergency runs
    this.log('info', 'Specialized bots running on independent schedules (Vercel cron)');
  }

  /**
   * Aggregate recent findings from all bots
   */
  private async aggregateFindings(): Promise<BotFinding[]> {
    this.log('info', 'Aggregating findings from all bots...');

    // Get findings from last 15 minutes that haven't been ticketed yet
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: findings, error } = await this.supabase
      .from('bot_findings')
      .select('*')
      .gte('created_at', fifteenMinutesAgo)
      .is('ticket_id', null)
      .order('severity', { ascending: true }); // Critical first

    if (error) {
      this.log('error', `Failed to fetch findings: ${error.message}`);
      return [];
    }

    this.log('info', `Found ${findings?.length || 0} new findings to process`);
    return (findings || []) as BotFinding[];
  }

  /**
   * Process findings - create tickets and escalate as needed
   */
  private async processFindings(findings: BotFinding[]): Promise<void> {
    this.log('info', `Processing ${findings.length} findings...`);

    for (const finding of findings) {
      // Check if this finding needs a ticket
      if (this.needsTicket(finding)) {
        const ticketId = await this.createTicketForFinding(finding);
        
        if (ticketId) {
          // Determine if escalation is needed
          if (this.needsEscalation(finding)) {
            await this.escalateIssue({
              ticketId,
              findingId: finding.id!,
              severity: finding.severity,
              escalateTo: this.determineEscalationTarget(finding),
              reason: `${finding.severity} issue: ${finding.title}`,
              previousAttempts: finding.autoFixAttempted ? 1 : 0,
              context: {
                category: finding.category,
                affectedUrl: finding.affectedUrl,
                affectedResource: finding.affectedResource,
                detectionMethod: finding.detectionMethod
              }
            });
          }
        }
      }
    }
  }

  /**
   * Determine if finding needs a ticket
   */
  private needsTicket(finding: BotFinding): boolean {
    // Always create ticket for high/critical issues
    if (finding.severity === 'critical' || finding.severity === 'high') {
      return true;
    }

    // Create ticket for medium issues that couldn't be auto-fixed
    if (finding.severity === 'medium' && finding.autoFixAttempted && !finding.autoFixSuccessful) {
      return true;
    }

    // Low severity only if multiple occurrences
    // (This would require additional logic to track patterns)
    
    return false;
  }

  /**
   * Determine if finding needs escalation
   */
  private needsEscalation(finding: BotFinding): boolean {
    // Critical always escalates
    if (finding.severity === 'critical') {
      return true;
    }

    // High severity escalates if auto-fix failed
    if (finding.severity === 'high' && finding.autoFixAttempted && !finding.autoFixSuccessful) {
      return true;
    }

    // Payment/security issues always escalate
    if (finding.category.includes('payment') || finding.category.includes('security')) {
      return true;
    }

    return false;
  }

  /**
   * Determine escalation target
   */
  private determineEscalationTarget(finding: BotFinding): 'javari' | 'admin' | 'user' {
    // Critical security/payment issues go to admin + Javari
    if (finding.severity === 'critical') {
      return 'user'; // Will send to Roy
    }

    // High priority goes to Javari
    if (finding.severity === 'high') {
      return 'javari';
    }

    // Medium goes to admin queue
    return 'admin';
  }

  /**
   * Create ticket for finding
   */
  private async createTicketForFinding(finding: BotFinding): Promise<string | null> {
    const priority = this.severityToPriority(finding.severity);

    return await this.createTicket({
      title: finding.title,
      description: this.formatTicketDescription(finding),
      category: this.categoryToTicketCategory(finding.category),
      priority,
      source: 'bot_monitoring',
      metadata: {
        finding_id: finding.id,
        bot_name: finding.botId,
        severity: finding.severity,
        detection_method: finding.detectionMethod,
        auto_fix_attempted: finding.autoFixAttempted,
        auto_fix_successful: finding.autoFixSuccessful
      }
    }, finding.id);
  }

  /**
   * Format ticket description
   */
  private formatTicketDescription(finding: BotFinding): string {
    let description = `**Issue Description:**\n${finding.description}\n\n`;

    if (finding.affectedUrl) {
      description += `**Affected URL:** ${finding.affectedUrl}\n`;
    }

    if (finding.affectedResource) {
      description += `**Affected Resource:** ${finding.affectedResource}\n`;
    }

    description += `**Detection Method:** ${finding.detectionMethod}\n`;
    description += `**Severity:** ${finding.severity.toUpperCase()}\n`;
    description += `**Category:** ${finding.category}\n\n`;

    if (finding.autoFixAttempted) {
      description += `**Auto-Fix Attempted:** Yes\n`;
      description += `**Auto-Fix Successful:** ${finding.autoFixSuccessful ? 'Yes' : 'No'}\n\n`;
      
      if (finding.fixDetails) {
        description += `**Fix Details:**\n\`\`\`json\n${JSON.stringify(finding.fixDetails, null, 2)}\n\`\`\`\n\n`;
      }
    }

    description += `**Detected At:** ${new Date(finding.created_at!).toLocaleString()}\n`;

    return description;
  }

  /**
   * Convert severity to ticket priority
   */
  private severityToPriority(severity: FindingSeverity): 'urgent' | 'high' | 'medium' | 'low' {
    const map: Record<FindingSeverity, 'urgent' | 'high' | 'medium' | 'low'> = {
      'critical': 'urgent',
      'high': 'high',
      'medium': 'medium',
      'low': 'low',
      'info': 'low'
    };
    return map[severity];
  }

  /**
   * Convert category to ticket category
   */
  private categoryToTicketCategory(category: string): string {
    // Map bot categories to support ticket categories
    if (category.includes('payment') || category.includes('credit')) return 'billing';
    if (category.includes('security')) return 'security';
    if (category.includes('build') || category.includes('deployment')) return 'technical';
    if (category.includes('database')) return 'technical';
    if (category.includes('api')) return 'technical';
    return 'general';
  }

  /**
   * Check for critical issues requiring immediate attention
   */
  private async checkCriticalIssues(): Promise<void> {
    const { data: criticalFindings } = await this.supabase
      .from('bot_findings')
      .select('*')
      .eq('severity', 'critical')
      .eq('status', 'new')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (criticalFindings && criticalFindings.length > 0) {
      this.log('error', `⚠️  CRITICAL: ${criticalFindings.length} critical issues detected!`, {
        issues: criticalFindings.map(f => f.title)
      });

      // Send immediate notification
      await this.sendNotification({
        type: 'email',
        recipient: process.env.ADMIN_EMAIL!,
        subject: `[CRITICAL ALERT] ${criticalFindings.length} Critical Issues Detected`,
        message: `The following critical issues require immediate attention:\n\n${
          criticalFindings.map((f, i) => `${i + 1}. ${f.title}\n   ${f.description}\n`).join('\n')
        }`,
        priority: 'urgent'
      });
    }
  }

  /**
   * Generate summary of orchestration cycle
   */
  private async generateSummary(): Promise<void> {
    // Get statistics for last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: stats } = await this.supabase
      .from('bot_findings')
      .select('severity, status, auto_fix_successful')
      .gte('created_at', oneDayAgo);

    const summary = {
      timestamp: new Date().toISOString(),
      period: 'last_24_hours',
      total_issues: stats?.length || 0,
      by_severity: {
        critical: stats?.filter(s => s.severity === 'critical').length || 0,
        high: stats?.filter(s => s.severity === 'high').length || 0,
        medium: stats?.filter(s => s.severity === 'medium').length || 0,
        low: stats?.filter(s => s.severity === 'low').length || 0,
      },
      auto_fixed: stats?.filter(s => s.auto_fix_successful).length || 0,
      still_open: stats?.filter(s => s.status !== 'fixed' && s.status !== 'ignored').length || 0
    };

    this.log('info', '📊 24-Hour Summary', summary);
  }

  /**
   * Conductor doesn't perform auto-fixes itself
   */
  protected async performAutoFix(finding: BotFinding): Promise<boolean> {
    return false;
  }
}
