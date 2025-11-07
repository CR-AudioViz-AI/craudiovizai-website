// ================================================================================
// CR AUDIOVIZ AI - AUTONOMOUS BOT SYSTEM
// Base Bot Class - Core Functionality
// FIXED: Now properly updates bots table with execution stats
// ================================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';
import {
  BotConfig,
  BotExecutionResult,
  BotExecutionStatus,
  BotFinding,
  BotAction,
  FindingSeverity,
  IssueCategory,
  KnowledgeEntry,
  TicketCreationRequest,
  AITaskRequest,
  AITaskResponse,
  HealthCheckResult,
  EscalationRequest,
  AIProvider
} from './types';

/**
 * Base Bot Class
 * All specific bots inherit from this class
 */
export abstract class BaseBot {
  protected config: BotConfig;
  protected supabase: SupabaseClient;
  protected executionId: string | null = null;
  protected startTime: number = 0;
  protected checksPerformed: number = 0;
  protected issuesFound: number = 0;
  protected issuesFixed: number = 0;
  protected ticketsCreated: number = 0;

  constructor(config: BotConfig) {
    this.config = config;
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Main execution entry point
   * Handles logging, error catching, and metrics
   */
  async execute(): Promise<BotExecutionResult> {
    this.startTime = Date.now();
    const startedAt = new Date();
    
    try {
      // Create execution record
      this.executionId = await this.createExecutionRecord('running');
      
      // Run bot-specific checks
      await this.runChecks();
      
      // Mark execution as successful
      const result = await this.completeExecution('success');
      
      // ✅ FIX: Update bots table with execution stats
      await this.updateBotStats(true, result.executionTimeMs);
      
      this.log('info', `Execution completed successfully`, {
        checksPerformed: this.checksPerformed,
        issuesFound: this.issuesFound,
        issuesFixed: this.issuesFixed,
        ticketsCreated: this.ticketsCreated
      });
      
      return result;
      
    } catch (error: unknown) {
      this.log('error', `Execution failed: ${(error as Error).message}`, { error });
      const result = await this.completeExecution('failure', (error as Error).message);
      
      // ✅ FIX: Update bots table even on failure
      await this.updateBotStats(false, result.executionTimeMs);
      
      return result;
    }
  }

  /**
   * ✅ NEW METHOD: Update bots table with execution statistics
   */
  private async updateBotStats(success: boolean, executionTimeMs: number): Promise<void> {
    try {
      const botRecord = await this.getBotRecord();
      
      // Calculate new average execution time
      const totalRuns = (botRecord.total_runs || 0) + 1;
      const oldAvg = botRecord.avg_execution_time_ms || 0;
      const newAvg = Math.round(
        ((oldAvg * (totalRuns - 1)) + executionTimeMs) / totalRuns
      );
      
      // Calculate next run time based on frequency
      const now = new Date();
      const runFrequencyMinutes = botRecord.run_frequency_minutes || 5;
      const nextRunAt = new Date(now.getTime() + (runFrequencyMinutes * 60 * 1000));
      
      // Update bots table
      const { error } = await this.supabase
        .from('bots')
        .update({
          last_execution_at: now.toISOString(),
          total_runs: totalRuns,
          successful_runs: success 
            ? (botRecord.successful_runs || 0) + 1 
            : (botRecord.successful_runs || 0),
          failed_runs: success 
            ? (botRecord.failed_runs || 0) 
            : (botRecord.failed_runs || 0) + 1,
          avg_execution_time_ms: newAvg,
          next_run_at: nextRunAt.toISOString(),
          status: success ? 'active' : 'error',
          updated_at: now.toISOString()
        })
        .eq('id', botRecord.id);
      
      if (error) {
        this.log('error', `Failed to update bot stats: ${error.message}`);
      } else {
        this.log('info', `Bot stats updated: ${totalRuns} total runs, avg ${newAvg}ms`, {
          success,
          nextRunAt: nextRunAt.toISOString()
        });
      }
    } catch (error: unknown) {
      this.log('error', `Error updating bot stats: ${(error as Error).message}`);
    }
  }

  /**
   * Abstract method - each bot implements its own checks
   */
  protected abstract runChecks(): Promise<void>;

  /**
   * Create execution record in database
   */
  private async createExecutionRecord(status: BotExecutionStatus): Promise<string> {
    const botRecord = await this.getBotRecord();
    
    const { data, error } = await this.supabase
      .from('bot_executions')
      .insert({
        bot_id: botRecord.id,
        status,
        started_at: new Date().toISOString(),
        checks_performed: 0,
        issues_found: 0,
        issues_fixed: 0,
        tickets_created: 0,
        execution_data: {}
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create execution record: ${error.message}`);
    return data.id;
  }

  /**
   * Complete execution and update record
   */
  private async completeExecution(
    status: BotExecutionStatus,
    errorMessage?: string
  ): Promise<BotExecutionResult> {
    const completedAt = new Date();
    const executionTimeMs = Date.now() - this.startTime;

    const { data, error } = await this.supabase
      .from('bot_executions')
      .update({
        status,
        completed_at: completedAt.toISOString(),
        execution_time_ms: executionTimeMs,
        checks_performed: this.checksPerformed,
        issues_found: this.issuesFound,
        issues_fixed: this.issuesFixed,
        tickets_created: this.ticketsCreated,
        error_message: errorMessage,
        execution_data: {
          completed: true,
          metrics: {
            checks: this.checksPerformed,
            issues: this.issuesFound,
            fixes: this.issuesFixed,
            tickets: this.ticketsCreated
          }
        }
      })
      .eq('id', this.executionId!)
      .select()
      .single();

    if (error) {
      this.log('error', `Failed to complete execution record: ${error.message}`);
    }

    const botRecord = await this.getBotRecord();

    return {
      executionId: this.executionId!,
      botId: botRecord.id,
      status,
      startedAt: new Date(this.startTime),
      completedAt,
      executionTimeMs,
      checksPerformed: this.checksPerformed,
      issuesFound: this.issuesFound,
      issuesFixed: this.issuesFixed,
      ticketsCreated: this.ticketsCreated,
      errorMessage,
      executionData: data?.execution_data || {}
    };
  }

  /**
   * Get bot record from database
   */
  private async getBotRecord() {
    const { data, error } = await this.supabase
      .from('bots')
      .select('*')
      .eq('name', this.config.name)
      .single();

    if (error) throw new Error(`Bot not found: ${this.config.name}`);
    return data;
  }

  /**
   * Create a finding (detected issue)
   */
  protected async createFinding(finding: Omit<BotFinding, 'id' | 'botId' | 'executionId' | 'status'>): Promise<BotFinding> {
    const botRecord = await this.getBotRecord();
    
    const newFinding: Partial<BotFinding> = {
      bot_id: botRecord.id,
      execution_id: this.executionId!,
      status: 'new',
      auto_fix_attempted: false,
      auto_fix_successful: false,
      ...finding
    };

    const { data, error } = await this.supabase
      .from('bot_findings')
      .insert(newFinding)
      .select()
      .single();

    if (error) {
      this.log('error', `Failed to create finding: ${error.message}`);
      throw error;
    }

    this.issuesFound++;
    
    this.log('warning', `Issue detected: ${finding.title}`, {
      severity: finding.severity,
      category: finding.category
    });

    return data as BotFinding;
  }

  /**
   * Record a bot action
   */
  protected async recordAction(action: Omit<BotAction, 'id' | 'botId'>): Promise<BotAction> {
    const botRecord = await this.getBotRecord();

    const { data, error } = await this.supabase
      .from('bot_actions')
      .insert({
        bot_id: botRecord.id,
        ...action
      })
      .select()
      .single();

    if (error) {
      this.log('error', `Failed to record action: ${error.message}`);
      throw error;
    }

    return data as BotAction;
  }

  /**
   * Attempt automatic fix for a finding
   */
  protected async attemptAutoFix(finding: BotFinding): Promise<boolean> {
    if (!this.config.autoHealingEnabled) {
      this.log('info', 'Auto-healing disabled for this bot');
      return false;
    }

    this.log('info', `Attempting auto-fix for: ${finding.title}`);

    // Step 1: Check knowledge base
    const knownSolution = await this.queryKnowledge(finding.category, finding.description);
    
    if (knownSolution && knownSolution.confidenceScore > 80) {
      this.log('info', `Found known solution (confidence: ${knownSolution.confidenceScore}%)`);
      
      const fixed = await this.applyKnownSolution(finding, knownSolution);
      if (fixed) {
        await this.updateFinding(finding.id!, {
          status: 'fixed',
          auto_fix_attempted: true,
          auto_fix_successful: true,
          fix_details: { method: 'known_solution', solution_id: knownSolution.id }
        });
        this.issuesFixed++;
        return true;
      }
    }

    // Step 2: Try bot-specific auto-fix logic
    const fixed = await this.performAutoFix(finding);
    
    if (fixed) {
      await this.updateFinding(finding.id!, {
        status: 'fixed',
        auto_fix_attempted: true,
        auto_fix_successful: true,
        fix_details: { method: 'bot_specific_fix' }
      });
      this.issuesFixed++;
      this.log('success', `Successfully auto-fixed: ${finding.title}`);
      return true;
    }

    // Step 3: Try AI-assisted fix
    if (finding.severity === 'high' || finding.severity === 'critical') {
      const aiFixed = await this.attemptAIFix(finding);
      
      if (aiFixed) {
        await this.updateFinding(finding.id!, {
          status: 'fixed',
          auto_fix_attempted: true,
          auto_fix_successful: true,
          fix_details: { method: 'ai_assisted_fix' }
        });
        this.issuesFixed++;
        this.log('success', `AI successfully fixed: ${finding.title}`);
        return true;
      }
    }

    // Failed to fix
    await this.updateFinding(finding.id!, {
      status: 'investigating',
      auto_fix_attempted: true,
      auto_fix_successful: false
    });

    this.log('warning', `Unable to auto-fix: ${finding.title}`);
    return false;
  }

  /**
   * Abstract method - each bot implements its own auto-fix logic
   */
  protected abstract performAutoFix(finding: BotFinding): Promise<boolean>;

  /**
   * Apply known solution from knowledge base
   */
  private async applyKnownSolution(finding: BotFinding, solution: KnowledgeEntry): Promise<boolean> {
    try {
      const action = await this.recordAction({
        finding_id: finding.id,
        action_type: 'apply_known_solution',
        action_description: `Applying known solution: ${solution.solutionType}`,
        status: 'running',
        started_at: new Date()
      });

      // Execute solution steps
      for (const step of solution.solutionSteps) {
        await this.executeFixStep(step);
      }

      // Update action as successful
      await this.supabase
        .from('bot_actions')
        .update({
          status: 'success',
          completed_at: new Date().toISOString(),
          execution_time_ms: Date.now() - action.startedAt.getTime()
        })
        .eq('id', action.id!);

      // Update knowledge success count
      await this.supabase
        .from('bot_knowledge')
        .update({
          success_count: solution.successCount + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', solution.id!);

      return true;
    } catch (error: unknown) {
      this.log('error', `Failed to apply known solution: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Execute a fix step
   */
  private async executeFixStep(step: any): Promise<void> {
    // Implementation depends on step type
    // This is a placeholder - specific bots override this
    this.log('info', `Executing fix step: ${JSON.stringify(step)}`);
  }

  /**
   * Attempt AI-assisted fix
   */
  private async attemptAIFix(finding: BotFinding): Promise<boolean> {
    try {
      const aiResponse = await this.queryAI({
        task: 'suggest_fix',
        category: finding.category,
        context: `
Issue: ${finding.title}
Description: ${finding.description}
Affected: ${finding.affectedUrl || finding.affectedResource}
Detection: ${finding.detectionMethod}

Please analyze this issue and suggest a specific, actionable fix.
`,
        maxTokens: 1000
      });

      if (aiResponse.confidence > 0.8) {
        // Parse AI response and attempt to execute
        // This is simplified - real implementation would be more sophisticated
        this.log('info', `AI suggested fix: ${aiResponse.response.substring(0, 200)}...`);
        
        // Store AI suggestion in knowledge base for future use
        await this.addToKnowledgeBase({
          issueSignature: this.generateIssueSignature(finding),
          issueCategory: finding.category,
          issueDescription: finding.description,
          solutionType: 'ai_suggested',
          solutionSteps: [{ type: 'ai_suggestion', content: aiResponse.response }],
          successCount: 0,
          failureCount: 0,
          confidenceScore: aiResponse.confidence * 100
        });

        return false; // Don't automatically apply AI suggestions yet - needs validation
      }

      return false;
    } catch (error: unknown) {
      this.log('error', `AI fix attempt failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Query knowledge base
   */
  protected async queryKnowledge(category: IssueCategory, description: string): Promise<KnowledgeEntry | null> {
    const signature = this.generateIssueSignature({ category, description } as BotFinding);
    
    const { data, error } = await this.supabase
      .from('bot_knowledge')
      .select('*')
      .eq('issue_signature', signature)
      .order('confidence_score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as KnowledgeEntry;
  }

  /**
   * Add entry to knowledge base
   */
  protected async addToKnowledgeBase(entry: Omit<KnowledgeEntry, 'id'>): Promise<void> {
    const { error } = await this.supabase
      .from('bot_knowledge')
      .upsert({
        ...entry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'issue_signature',
        ignoreDuplicates: false
      });

    if (error) {
      this.log('error', `Failed to add to knowledge base: ${error.message}`);
    }
  }

  /**
   * Generate issue signature for knowledge base
   */
  protected generateIssueSignature(finding: { category: IssueCategory; description: string }): string {
    // Simple hash for now - could use more sophisticated fingerprinting
    const str = `${finding.category}:${finding.description}`;
    return Buffer.from(str).toString('base64').substring(0, 100);
  }

  /**
   * Update finding
   */
  protected async updateFinding(findingId: string, updates: Partial<BotFinding>): Promise<void> {
    const { error } = await this.supabase
      .from('bot_findings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', findingId);

    if (error) {
      this.log('error', `Failed to update finding: ${error.message}`);
    }
  }

  /**
   * Create ticket for issue
   */
  protected async createTicket(request: TicketCreationRequest, findingId?: string): Promise<string | null> {
    const botRecord = await this.getBotRecord();

    const { data, error } = await this.supabase
      .from('support_tickets')
      .insert({
        title: request.title,
        description: request.description,
        category: request.category,
        priority: request.priority,
        status: 'open',
        source: 'bot_monitoring',
        created_by: 'system',
        assigned_to_bot_id: botRecord.id,
        bot_auto_assigned_at: new Date().toISOString(),
        metadata: {
          ...request.metadata,
          finding_id: findingId,
          detected_by_bot: this.config.name
        }
      })
      .select()
      .single();

    if (error) {
      this.log('error', `Failed to create ticket: ${error.message}`);
      return null;
    }

    this.ticketsCreated++;
    this.log('info', `Created ticket: ${data.ticket_number || data.id}`);

    // Link ticket to finding
    if (findingId) {
      await this.updateFinding(findingId, { ticket_id: data.id });
    }

    return data.id;
  }

  /**
   * Escalate issue
   */
  protected async escalateIssue(request: EscalationRequest): Promise<void> {
    this.log('warning', `Escalating issue (severity: ${request.severity})`, request);

    // Update ticket status
    await this.supabase
      .from('support_tickets')
      .update({
        status: 'escalated',
        escalated_from_bot: true,
        escalation_reason: request.reason,
        assigned_to_bot_id: request.escalateTo === 'javari' ? await this.getJavariBotId() : null
      })
      .eq('id', request.ticketId);

    // Create escalation notification based on severity
    if (request.severity === 'critical') {
      await this.sendNotification({
        type: 'email',
        recipient: process.env.ADMIN_EMAIL!,
        subject: `[CRITICAL] ${request.reason}`,
        message: `A critical issue has been escalated and requires immediate attention.\n\n${JSON.stringify(request.context, null, 2)}`,
        priority: 'urgent'
      });
    }

    // Update finding status
    await this.updateFinding(request.findingId, {
      status: 'escalated'
    });
  }

  /**
   * Get Javari bot ID
   */
  private async getJavariBotId(): Promise<string | null> {
    const { data } = await this.supabase
      .from('bots')
      .select('id')
      .eq('name', 'javari')
      .maybeSingle();

    return data?.id || null;
  }

  /**
   * Query AI for assistance
   */
  protected async queryAI(request: AITaskRequest): Promise<AITaskResponse> {
    // Select best AI provider for task
    const provider = request.preferredProvider || this.selectAIProvider(request.category);
    
    const startTime = Date.now();

    try {
      // Call appropriate AI provider
      const response = await this.callAIProvider(provider, request);
      
      return {
        provider,
        response: response.content,
        confidence: response.confidence || 0.7,
        tokensUsed: response.tokensUsed || 0,
        costEstimate: response.costEstimate || 0,
        executionTimeMs: Date.now() - startTime
      };
    } catch (error: unknown) {
      this.log('error', `AI query failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Select best AI provider for task
   */
  private selectAIProvider(category: IssueCategory): AIProvider {
    const routing: Record<IssueCategory, AIProvider> = {
      'build_failure': 'gpt-4',
      'deployment_failed': 'gpt-4',
      'dependency_vulnerable': 'gpt-4',
      'database_slow': 'claude-opus',
      'connection_error': 'claude-sonnet',
      'security_vulnerability': 'perplexity',
      'api_error': 'gemini-pro',
      'link_broken': 'mistral-large',
      'form_failure': 'mistral-large',
      'auth_error': 'claude-sonnet',
      'ssl_expiring': 'mistral-large',
      'performance_degraded': 'claude-opus',
      'payment_failure': 'gpt-4',
      'webhook_failed': 'gpt-4',
      'credit_mismatch': 'claude-sonnet',
      'storage_high': 'claude-sonnet',
      'suspicious_activity': 'claude-opus',
      'rate_limit_exceeded': 'mistral-large',
      'cors_misconfigured': 'gpt-4',
      'other': 'claude-sonnet'
    };

    return routing[category] || 'claude-sonnet';
  }

  /**
   * Call AI provider
   */
  private async callAIProvider(provider: AIProvider, request: AITaskRequest): Promise<any> {
    // Implementation will vary by provider
    // This is a placeholder - actual implementation would route to appropriate API
    
    const apiUrl = '/api/ai/route';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        task: request.task,
        context: request.context,
        maxTokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`AI API call failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Send notification
   */
  protected async sendNotification(request: any): Promise<void> {
    // Placeholder - implement actual notification logic
    this.log('info', `Sending ${request.type} notification to ${request.recipient}`);
  }

  /**
   * Increment checks counter
   */
  protected incrementChecks(): void {
    this.checksPerformed++;
  }

  /**
   * Log message
   */
  protected log(level: 'info' | 'success' | 'warning' | 'error', message: string, metadata?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      bot: this.config.name,
      level,
      message,
      ...metadata
    };

    console.log(JSON.stringify(logEntry));
  }
}

