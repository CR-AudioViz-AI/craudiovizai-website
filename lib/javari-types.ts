/**
 * Javari AI - Type Definitions
 * Complete type system for Javari AI platform
 */

// ============================================================================
// PROJECTS
// ============================================================================

export interface JavariProject {
  id: string;
  name: string;
  display_name: string;
  type: 'main' | 'subsidiary';
  description?: string;
  
  // Repository Info
  github_org?: string;
  github_repo?: string;
  vercel_project?: string;
  
  // Credentials (stored as encrypted JSONB)
  credentials_snapshot?: Record<string, any>;
  
  // Health Metrics
  health_score: number;
  last_build_status?: 'success' | 'failed' | 'pending';
  last_build_at?: string;
  last_deploy_at?: string;
  
  // Tracking
  active_chats_count: number;
  total_chats_count: number;
  starred: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface JavariSubProject {
  id: string;
  parent_project_id: string;
  name: string;
  display_name: string;
  description?: string;
  
  // Repository Info
  github_repo?: string;
  vercel_project?: string;
  
  // Credentials (inherits from parent, can override)
  credential_overrides?: Record<string, any>;
  
  // Health
  health_score: number;
  
  // Tracking
  active_chats_count: number;
  starred: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CHAT SESSIONS
// ============================================================================

export interface JavariChatSession {
  id: string;
  project_id: string;
  subproject_id?: string;
  user_id: string;
  
  // Session Info
  title: string;
  status: 'active' | 'continued' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Continuation Chain
  parent_chat_id?: string;
  continuation_depth: number;
  context_summary?: string;
  
  // Credentials Snapshot
  credentials_snapshot?: Record<string, any>;
  
  // Metrics
  token_count: number;
  message_count: number;
  lines_of_code_added: number;
  lines_of_code_deleted: number;
  files_created: number;
  files_modified: number;
  apis_created: number;
  tests_written: number;
  estimated_cost_saved: number;
  actual_cost_incurred: number;
  issues_identified: number;
  issues_resolved: number;
  
  // Duration
  started_at: string;
  ended_at?: string;
  total_duration_minutes?: number;
  active_duration_minutes?: number;
  
  // Organization
  starred: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ChatWorkLog {
  id: string;
  chat_session_id: string;
  
  // Action Info
  action_type: 'file_created' | 'file_modified' | 'file_deleted' | 'api_created' | 'test_written' | 'bug_fixed' | 'feature_added' | 'refactored' | 'deployed';
  action_category: 'code' | 'config' | 'docs' | 'tests' | 'deployment';
  description: string;
  
  // Impact
  impact_level: 'minor' | 'moderate' | 'major' | 'critical';
  files_affected?: string[];
  lines_added?: number;
  lines_deleted?: number;
  complexity_added?: number;
  
  // Quality
  tests_added: boolean;
  breaking_change: boolean;
  
  // Cost Tracking
  cost_saved?: number;
  cost_incurred?: number;
  
  // Review
  needs_review: boolean;
  review_completed: boolean;
  
  // Links
  commit_sha?: string;
  deploy_url?: string;
  
  // Timestamps
  created_at: string;
}

// ============================================================================
// BUILD & DEPENDENCY TRACKING
// ============================================================================

export interface BuildHealthTracking {
  id: string;
  project_id: string;
  chat_session_id?: string;
  
  // Build Info
  build_id?: string;
  build_status: 'success' | 'failed' | 'pending';
  error_type?: string;
  error_message?: string;
  error_stack?: string;
  
  // Auto-Fix
  auto_fixable: boolean;
  fix_suggestion?: string;
  fix_confidence?: number;
  fix_applied: boolean;
  fix_result?: 'success' | 'failed';
  
  // Metrics
  build_duration_seconds?: number;
  files_affected?: string[];
  
  // Timestamps
  build_started_at: string;
  build_completed_at?: string;
  created_at: string;
}

export interface DependencyTracking {
  id: string;
  project_id: string;
  
  // Package Info
  package_name: string;
  current_version: string;
  latest_version: string;
  package_type: 'npm' | 'pip' | 'other';
  
  // Security
  has_vulnerabilities: boolean;
  cve_ids?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  
  // Update Safety
  safe_to_update: boolean;
  breaking_changes: boolean;
  auto_update_eligible: boolean;
  
  // Metadata
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CODE REVIEW & SUGGESTIONS
// ============================================================================

export interface CodeReviewQueue {
  id: string;
  chat_session_id: string;
  work_log_id?: string;
  
  // Code Info
  file_path: string;
  code_before?: string;
  code_after: string;
  diff?: string;
  
  // Analysis
  complexity_score: number;
  security_score: number;
  quality_score: number;
  ai_concerns?: string[];
  
  // Review Status
  status: 'pending' | 'reviewing' | 'approved' | 'changes_requested';
  priority: 'low' | 'normal' | 'high';
  reviewed_by?: string;
  reviewed_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface SmartSuggestion {
  id: string;
  project_id: string;
  chat_session_id?: string;
  
  // Suggestion Info
  type: 'security' | 'optimization' | 'refactoring' | 'testing' | 'dependency' | 'performance' | 'accessibility' | 'seo' | 'cost_saving' | 'automation';
  title: string;
  description: string;
  
  // Impact
  priority: 'low' | 'normal' | 'high' | 'critical';
  estimated_time_minutes?: number;
  estimated_cost_impact?: number;
  
  // Implementation
  implementation_steps?: string[];
  code_example?: string;
  
  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  applied_at?: string;
  expires_at?: string;
  
  // Metrics
  metrics_before?: Record<string, any>;
  metrics_after?: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface ContinueChatRequest {
  chat_session_id: string;
  reason?: string;
  preserve_context?: boolean;
}

export interface ContinueChatResponse {
  new_chat_id: string;
  context_summary: string;
  credentials_transferred: boolean;
  continuation_url: string;
  previous_metrics: {
    token_count: number;
    message_count: number;
    issues_identified: number;
    issues_resolved: number;
  };
}

export interface CreateWorkLogRequest {
  chat_session_id: string;
  action_type: ChatWorkLog['action_type'];
  action_category: ChatWorkLog['action_category'];
  description: string;
  impact_level?: ChatWorkLog['impact_level'];
  files_affected?: string[];
  lines_added?: number;
  lines_deleted?: number;
  complexity_added?: number;
  tests_added?: boolean;
  breaking_change?: boolean;
  cost_saved?: number;
  cost_incurred?: number;
  commit_sha?: string;
  deploy_url?: string;
}

export interface HealthResponse {
  project: JavariProject;
  subproject?: JavariSubProject;
  health_indicators: {
    build_health: number;
    security_health: number;
    code_quality_health: number;
    overall_health: number;
  };
  critical_issues: Array<{
    type: string;
    severity: string;
    title: string;
    description: string;
    cve_ids?: string[];
  }>;
  recent_builds: BuildHealthTracking[];
  vulnerabilities: DependencyTracking[];
  pending_reviews: CodeReviewQueue[];
  smart_suggestions: SmartSuggestion[];
}
