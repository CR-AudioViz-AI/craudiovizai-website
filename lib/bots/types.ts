// ================================================================================
// CR AUDIOVIZ AI - AUTONOMOUS BOT SYSTEM
// Base Bot Framework - Types & Interfaces
// ================================================================================

/**
 * Bot execution status
 */
export type BotExecutionStatus = 'running' | 'success' | 'failure' | 'timeout' | 'cancelled';

/**
 * Bot status
 */
export type BotStatus = 'active' | 'paused' | 'disabled' | 'error';

/**
 * Finding severity levels
 */
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * Finding status
 */
export type FindingStatus = 'new' | 'investigating' | 'fixing' | 'fixed' | 'escalated' | 'ignored' | 'false_positive';

/**
 * Issue categories
 */
export type IssueCategory = 
  | 'link_broken'
  | 'form_failure'
  | 'auth_error'
  | 'ssl_expiring'
  | 'performance_degraded'
  | 'payment_failure'
  | 'webhook_failed'
  | 'credit_mismatch'
  | 'build_failure'
  | 'deployment_failed'
  | 'dependency_vulnerable'
  | 'database_slow'
  | 'connection_error'
  | 'storage_high'
  | 'security_vulnerability'
  | 'suspicious_activity'
  | 'api_error'
  | 'rate_limit_exceeded'
  | 'cors_misconfigured'
  | 'other';

/**
 * AI providers
 */
export type AIProvider = 'gpt-4' | 'claude-sonnet' | 'claude-opus' | 'gemini-pro' | 'mistral-large' | 'perplexity';

/**
 * Bot configuration
 */
export interface BotConfig {
  name: string;
  displayName: string;
  description: string;
  runFrequencyMinutes: number;
  responsibilities: string[];
  priority: number;
  autoHealingEnabled: boolean;
  maxAutoFixAttempts: number;
  alertOnCritical?: boolean;
  customConfig?: Record<string, any>;
}

/**
 * Bot execution result
 */
export interface BotExecutionResult {
  executionId: string;
  botId: string;
  status: BotExecutionStatus;
  startedAt: Date;
  completedAt: Date;
  executionTimeMs: number;
  checksPerformed: number;
  issuesFound: number;
  issuesFixed: number;
  ticketsCreated: number;
  errorMessage?: string;
  executionData: Record<string, any>;
}

/**
 * Bot finding (detected issue)
 */
export interface BotFinding {
  id?: string;
  botId: string;
  executionId: string;
  severity: FindingSeverity;
  category: IssueCategory;
  title: string;
  description: string;
  affectedUrl?: string;
  affectedResource?: string;
  detectionMethod: string;
  status: FindingStatus;
  autoFixAttempted: boolean;
  autoFixSuccessful: boolean;
  fixDetails?: Record<string, any>;
  ticketId?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Bot action (fix attempt)
 */
export interface BotAction {
  id?: string;
  botId: string;
  findingId?: string;
  actionType: string;
  actionDescription: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  executionTimeMs?: number;
  resultData?: Record<string, any>;
  errorMessage?: string;
}

/**
 * Knowledge base entry
 */
export interface KnowledgeEntry {
  id?: string;
  issueSignature: string;
  issueCategory: IssueCategory;
  issueDescription: string;
  solutionType: string;
  solutionSteps: any[];
  successCount: number;
  failureCount: number;
  successRate?: number;
  avgResolutionTimeMs?: number;
  lastUsedAt?: Date;
  confidenceScore: number;
}

/**
 * Ticket creation request
 */
export interface TicketCreationRequest {
  title: string;
  description: string;
  category: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  source: string;
  metadata?: Record<string, any>;
  assignedToBotId?: string;
  findingId?: string;
}

/**
 * AI task request
 */
export interface AITaskRequest {
  task: string;
  category: IssueCategory;
  context: string;
  preferredProvider?: AIProvider;
  maxTokens?: number;
  temperature?: number;
}

/**
 * AI task response
 */
export interface AITaskResponse {
  provider: AIProvider;
  response: string;
  confidence: number;
  tokensUsed: number;
  costEstimate: number;
  executionTimeMs: number;
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  name: string;
  healthy: boolean;
  responseTime?: number;
  statusCode?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Escalation request
 */
export interface EscalationRequest {
  ticketId: string;
  findingId: string;
  severity: FindingSeverity;
  escalateTo: 'javari' | 'admin' | 'user';
  reason: string;
  previousAttempts: number;
  context: Record<string, any>;
}

/**
 * Bot database record
 */
export interface BotRecord {
  id: string;
  name: string;
  display_name: string;
  description: string;
  avatar_url?: string;
  status: BotStatus;
  run_frequency_minutes: number;
  last_run_at?: Date;
  next_run_at?: Date;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  avg_execution_time_ms?: number;
  config: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

/**
 * Notification types
 */
export type NotificationType = 'email' | 'sms' | 'slack' | 'discord';

/**
 * Notification request
 */
export interface NotificationRequest {
  type: NotificationType;
  recipient: string;
  subject: string;
  message: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  metadata?: Record<string, any>;
}
