/**
 * Javari AI - Unified Type Definitions
 * Backwards compatible types supporting both old and new schemas
 * @timestamp Sunday, October 26, 2025
 */

// ============================================================================
// PROJECT TYPES - Supporting both schemas
// ============================================================================

export interface JavariProject {
  id: string;
  name: string;
  display_name: string;
  type: 'main' | 'subsidiary';
  description?: string;
  user_id?: string; // NEW: for new routes
  
  // Repository Info
  github_org?: string;
  github_repo?: string;
  repository_url?: string; // NEW: alias for github_repo
  vercel_project?: string;
  primary_language?: string; // NEW
  framework?: string; // NEW
  
  // Credentials (stored as encrypted JSONB)
  credentials_snapshot?: Record<string, any>;
  
  // Health Metrics
  health_score: number;
  last_build_status?: 'success' | 'failed' | 'pending';
  last_build_at?: string;
  last_deploy_at?: string;
  last_health_check?: string; // NEW
  
  // Tracking
  active_chats_count: number;
  total_chats_count: number;
  total_subprojects?: number; // NEW
  total_sessions?: number; // NEW
  total_work_logs?: number; // NEW
  total_tokens_used?: number; // NEW
  total_cost?: number; // NEW
  starred: boolean;
  status?: 'active' | 'archived' | 'paused'; // NEW
  
  // Metadata
  metadata?: Record<string, any>; // NEW
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface JavariSubProject {
  id: string;
  parent_project_id: string;
  project_id?: string; // NEW: alias for parent_project_id
  name: string;
  display_name: string;
  description?: string;
  type?: 'feature' | 'bugfix' | 'refactor' | 'infrastructure' | 'documentation'; // NEW
  status?: 'active' | 'completed' | 'on-hold' | 'archived'; // NEW
  priority?: 'low' | 'medium' | 'high' | 'urgent'; // NEW
  
  // Repository Info
  github_repo?: string;
  vercel_project?: string;
  
  // Credentials (inherits from parent, can override)
  credential_overrides?: Record<string, any>;
  
  // Time tracking - NEW
  estimated_hours?: number;
  actual_hours?: number;
  start_date?: string;
  end_date?: string;
  completion_percentage?: number;
  
  // Health
  health_score: number;
  
  // Tracking
  active_chats_count: number;
  total_sessions?: number; // NEW
  total_work_logs?: number; // NEW
  total_tokens_used?: number; // NEW
  total_cost?: number; // NEW
  starred: boolean;
  
  // Metadata
  metadata?: Record<string, any>; // NEW
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CHAT SESSION TYPES
// ============================================================================

export interface JavariChatSession {
  id: string;
  project_id: string;
  subproject_id?: string;
  sub_project_id?: string; // NEW: alias
  user_id: string;
  
  // Session Info
  title: string;
  status: 'active' | 'continued' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Continuation Chain
  parent_chat_id?: string;
  parent_session_id?: string; // NEW: alias
  continuation_depth: number;
  context_summary?: string;
  
  // Credentials Snapshot
  credentials_snapshot?: Record<string, any>;
  
  // Metrics
  token_count: number;
  total_tokens_used?: number; // NEW: alias
  message_count: number;
  total_messages?: number; // NEW: alias
  total_work_logs?: number; // NEW
  total_cost?: number; // NEW
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
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// WORK LOG TYPES
// ============================================================================

export interface ChatWorkLog {
  id: string;
  chat_session_id: string;
  session_id?: string; // NEW: alias
  project_id?: string; // NEW
  sub_project_id?: string; // NEW
  
  // Action Info
  action_type: 'file_created' | 'file_modified' | 'file_deleted' | 'api_created' | 'test_written' | 'bug_fixed' | 'feature_added' | 'refactored' | 'deployed' | 'database_migration' | 'code_review';
  activity_type?: string; // NEW: alias
  action_category: 'code' | 'config' | 'docs' | 'tests' | 'deployment';
  description: string;
  
  // Impact
  impact_level: 'minor' | 'moderate' | 'major' | 'critical';
  files_affected?: string[];
  file_path?: string; // NEW: single file
  lines_added?: number;
  lines_deleted?: number;
  complexity_added?: number;
  code_changes?: string; // NEW: diff content
  
  // Quality
  tests_added: boolean;
  breaking_change: boolean;
  
  // Cost Tracking
  cost_saved?: number;
  cost_incurred?: number;
  cost?: number; // NEW: alias for cost_incurred
  tokens_used?: number; // NEW
  model_used?: string; // NEW
  execution_time_ms?: number; // NEW
  
  // Review
  needs_review: boolean;
  review_completed: boolean;
  success?: boolean; // NEW
  error_message?: string; // NEW
  
  // Links
  commit_sha?: string;
  deploy_url?: string;
  
  // Metadata
  metadata?: Record<string, any>; // NEW
  
  // Timestamps
  timestamp?: string; // NEW
  created_at: string;
}

export interface JavariChatWorkLog extends ChatWorkLog {} // NEW: alias

// ============================================================================
// BUILD HEALTH TYPES
// ============================================================================

export interface BuildHealthTracking {
  id: string;
  project_id: string;
  chat_session_id?: string;
  session_id?: string; // NEW: alias
  
  // Build Info
  build_id?: string;
  build_status: 'success' | 'failed' | 'pending' | null;
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
  build_time_ms?: number; // NEW: alias (convert from seconds)
  bundle_size_kb?: number; // NEW
  files_affected?: string[];
  
  // NEW: Code Quality Metrics
  health_score?: number;
  test_coverage_percentage?: number;
  lint_errors_count?: number;
  lint_warnings_count?: number;
  type_errors_count?: number;
  security_vulnerabilities_count?: number;
  dependency_issues_count?: number;
  issues_detected?: string[];
  recommendations?: string[];
  
  // Metadata
  metadata?: Record<string, any>; // NEW
  
  // Timestamps
  check_timestamp?: string; // NEW
  build_started_at: string;
  build_completed_at?: string;
  created_at: string;
}

// ============================================================================
// OTHER ENTITY TYPES
// ============================================================================

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
  
  // Status
  is_outdated: boolean;
  update_available: boolean;
  breaking_changes_expected: boolean;
  auto_update_recommended: boolean;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  last_checked: string;
  created_at: string;
  updated_at: string;
}

export interface CodeReviewQueue {
  id: string;
  project_id: string;
  chat_session_id: string;
  work_log_id: string;
  
  // File Info
  file_path: string;
  change_type: 'created' | 'modified' | 'deleted';
  code_diff?: string;
  
  // AI Analysis
  complexity_score: number;
  potential_issues: string[];
  security_concerns: string[];
  performance_concerns: string[];
  suggestions: string[];
  
  // Status
  status: 'pending' | 'in_progress' | 'approved' | 'needs_changes';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  created_at: string;
  reviewed_at?: string;
}

export interface SmartSuggestion {
  id: string;
  project_id: string;
  chat_session_id?: string;
  
  // Suggestion Info
  type: 'optimization' | 'refactor' | 'security' | 'feature' | 'documentation';
  title: string;
  description: string;
  rationale?: string;
  
  // Implementation
  code_example?: string;
  files_to_modify: string[];
  estimated_effort_hours: number;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence_score: number;
  
  // Impact
  expected_impact: string;
  potential_risks?: string;
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  implemented_in_chat_id?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Chat Continuation
export interface ContinueChatRequest {
  chat_session_id: string; // OLD: for continue route
  project_id?: string; // NEW: for new routes
  sub_project_id?: string; // NEW
  parent_session_id?: string; // NEW: alias
  reason?: string; // OLD
  preserve_context?: boolean; // OLD
  title?: string; // NEW
  priority?: 'low' | 'medium' | 'high' | 'urgent'; // NEW
}

export interface ContinueChatResponse {
  success: boolean;
  session?: JavariChatSession;
  chat?: JavariChatSession; // OLD: alias
  error?: string;
}

// Project Operations
export interface CreateProjectRequest {
  user_id: string;
  name: string;
  description?: string;
  repository_url?: string;
  primary_language?: string;
  framework?: string;
  status?: 'active' | 'archived' | 'paused';
  metadata?: Record<string, any>;
}

export interface UpdateProjectRequest {
  id: string;
  name?: string;
  description?: string;
  repository_url?: string;
  primary_language?: string;
  framework?: string;
  status?: 'active' | 'archived' | 'paused';
  health_score?: number;
  last_health_check?: string;
  metadata?: Record<string, any>;
}

// SubProject Operations
export interface CreateSubProjectRequest {
  project_id: string;
  name: string;
  description?: string;
  type?: 'feature' | 'bugfix' | 'refactor' | 'infrastructure' | 'documentation';
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  actual_hours?: number;
  start_date?: string;
  end_date?: string;
  completion_percentage?: number;
  metadata?: Record<string, any>;
}

export interface UpdateSubProjectRequest {
  id: string;
  name?: string;
  description?: string;
  type?: 'feature' | 'bugfix' | 'refactor' | 'infrastructure' | 'documentation';
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  actual_hours?: number;
  start_date?: string;
  end_date?: string;
  completion_percentage?: number;
  metadata?: Record<string, any>;
}

// Work Log Operations
export interface CreateWorkLogRequest {
  session_id?: string;
  chat_session_id?: string; // OLD: alias
  project_id: string;
  sub_project_id?: string;
  activity_type?: string;
  action_type: string;
  description?: string;
  file_path?: string;
  files_modified?: string[];
  code_changes?: string;
  tokens_used?: number;
  cost_usd?: number;
  execution_time_ms?: number;
  success?: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
}

// Health Check Operations
export interface CreateHealthCheckRequest {
  project_id: string;
  session_id?: string;
  health_score: number;
  build_status?: 'success' | 'failed' | 'pending';
  test_coverage_percentage?: number;
  lint_errors_count?: number;
  lint_warnings_count?: number;
  type_errors_count?: number;
  security_vulnerabilities_count?: number;
  dependency_issues_count?: number;
  build_time_ms?: number;
  bundle_size_kb?: number;
  issues_detected?: string[];
  recommendations?: string[];
  metadata?: Record<string, any>;
}

export interface HealthCheckResult {
  overall_score: number;
  status: 'healthy' | 'warning' | 'critical';
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    message: string;
    count: number | null;
  }>;
  recommendations: string[];
}

export interface HealthResponse {
  success: boolean;
  data?: BuildHealthTracking | BuildHealthTracking[];
  error?: string;
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
