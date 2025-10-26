/**
 * Javari AI - Type Definitions
 * Complete type system matching the new database schema
 */

// ============================================================================
// PROJECT TYPES (javari_projects table)
// ============================================================================

export interface JavariProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  repository_url: string | null;
  primary_language: string | null;
  framework: string | null;
  status: 'active' | 'archived' | 'paused';
  
  // Counters
  total_subprojects: number;
  total_sessions: number;
  total_work_logs: number;
  total_tokens_used: number;
  total_cost: number;
  
  // Health
  health_score: number;
  last_health_check: string;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

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

// ============================================================================
// SUBPROJECT TYPES (javari_sub_projects table)
// ============================================================================

export interface JavariSubProject {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  type: 'feature' | 'bugfix' | 'refactor' | 'infrastructure' | 'documentation';
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Time tracking
  estimated_hours: number | null;
  actual_hours: number;
  start_date: string | null;
  end_date: string | null;
  completion_percentage: number;
  
  // Counters
  total_sessions: number;
  total_work_logs: number;
  total_tokens_used: number;
  total_cost: number;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

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

// ============================================================================
// CHAT SESSION TYPES (javari_chat_sessions table)
// ============================================================================

export interface JavariChatSession {
  id: string;
  project_id: string;
  sub_project_id: string | null;
  user_id: string;
  
  // Session Info
  title: string;
  status: 'active' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Continuation
  parent_session_id: string | null;
  continuation_depth: number;
  context_summary: string | null;
  
  // Metrics
  total_messages: number;
  total_work_logs: number;
  total_tokens_used: number;
  total_cost: number;
  
  // Time tracking
  started_at: string;
  ended_at: string | null;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// WORK LOG TYPES (javari_chat_work_logs table)
// ============================================================================

export interface JavariChatWorkLog {
  id: string;
  session_id: string;
  project_id: string;
  sub_project_id: string | null;
  
  // Activity details
  activity_type: 'file_created' | 'file_modified' | 'file_deleted' | 'api_created' | 
                  'database_migration' | 'deployment' | 'bug_fixed' | 'test_written' | 'code_review';
  description: string | null;
  
  // File details
  file_path: string | null;
  code_changes: string | null;
  
  // Cost tracking
  tokens_used: number;
  cost: number;
  model_used: string;
  
  // Status
  success: boolean;
  error_message: string | null;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamp
  timestamp: string;
}

export interface ChatWorkLog extends JavariChatWorkLog {} // Alias for compatibility

export interface CreateWorkLogRequest {
  session_id: string;
  project_id: string;
  sub_project_id?: string;
  activity_type: string;
  action_type: string; // Alias for activity_type
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

// ============================================================================
// HEALTH TRACKING TYPES (javari_build_health_tracking table)
// ============================================================================

export interface BuildHealthTracking {
  id: string;
  project_id: string;
  session_id: string | null;
  
  // Health metrics
  health_score: number;
  build_status: 'success' | 'failed' | 'pending' | null;
  
  // Code quality
  test_coverage_percentage: number | null;
  lint_errors_count: number;
  lint_warnings_count: number;
  type_errors_count: number;
  
  // Security
  security_vulnerabilities_count: number;
  dependency_issues_count: number;
  
  // Performance
  build_time_ms: number | null;
  bundle_size_kb: number | null;
  
  // Issues and recommendations
  issues_detected: string[];
  recommendations: string[];
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  check_timestamp: string;
  created_at: string;
}

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

// ============================================================================
// DEPENDENCY TRACKING TYPES (javari_dependency_tracking table)
// ============================================================================

export interface DependencyTracking {
  id: string;
  project_id: string;
  
  // Package info
  package_name: string;
  package_type: 'npm' | 'pip' | 'other';
  current_version: string;
  latest_version: string;
  
  // Status
  is_outdated: boolean;
  is_vulnerable: boolean;
  vulnerability_severity: 'low' | 'medium' | 'high' | 'critical' | null;
  
  // Update info
  update_available: boolean;
  breaking_changes_expected: boolean;
  auto_update_safe: boolean;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  last_checked: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CODE REVIEW TYPES (javari_code_review_queue table)
// ============================================================================

export interface CodeReviewQueue {
  id: string;
  project_id: string;
  session_id: string;
  work_log_id: string;
  
  // Review details
  file_path: string;
  change_type: 'created' | 'modified' | 'deleted';
  code_diff: string | null;
  
  // AI Analysis
  complexity_score: number;
  security_concerns: string[];
  performance_concerns: string[];
  best_practice_violations: string[];
  suggested_improvements: string[];
  
  // Status
  review_status: 'pending' | 'in_progress' | 'approved' | 'needs_changes';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  reviewed_at: string | null;
}

// ============================================================================
// SMART SUGGESTIONS TYPES (javari_smart_suggestions table)
// ============================================================================

export interface SmartSuggestion {
  id: string;
  project_id: string;
  session_id: string | null;
  
  // Suggestion details
  suggestion_type: 'optimization' | 'refactor' | 'security' | 'feature' | 'documentation';
  title: string;
  description: string;
  
  // Implementation
  code_example: string | null;
  files_affected: string[];
  estimated_effort_hours: number;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence_score: number;
  
  // Impact
  expected_benefits: string[];
  potential_risks: string[];
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  implemented_in_session_id: string | null;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// CHAT CONTINUATION TYPES
// ============================================================================

export interface ContinueChatRequest {
  project_id: string;
  sub_project_id?: string;
  parent_session_id?: string;
  title: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ContinueChatResponse {
  success: boolean;
  session?: JavariChatSession;
  error?: string;
}
