/**
 * Javari AI - Complete Type System
 * TypeScript definitions for all Javari entities
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface JavariProject {
  id: string;
  name: string;
  display_name: string;
  type: 'main' | 'standalone';
  description?: string;
  
  // GitHub integration
  github_org?: string;
  github_repo?: string;
  
  // Vercel integration
  vercel_project?: string;
  vercel_team_id?: string;
  
  // Organization
  organization_id?: string;
  
  // Credentials (encrypted)
  credentials: {
    github?: {
      token: string;
      username: string;
      email: string;
    };
    vercel?: {
      token: string;
      team_id: string;
      org_id: string;
    };
    supabase?: {
      url: string;
      anon_key: string;
      service_role_key: string;
    };
    stripe?: {
      secret_key: string;
      publishable_key: string;
      webhook_secret: string;
    };
    openai?: {
      api_key: string;
    };
    [key: string]: any;
  };
  
  // Health tracking
  health_score: number; // 0-100
  last_health_check_at?: string;
  
  // Build tracking
  last_build_status?: 'success' | 'failed' | 'building';
  last_build_at?: string;
  last_deploy_at?: string;
  
  // Metrics
  active_chat_count: number;
  total_chats: number;
  
  // Settings
  settings: Record<string, any>;
  metadata: Record<string, any>;
  
  // Status
  status: 'active' | 'paused' | 'archived';
  
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
  
  // Repository info
  github_repo?: string;
  vercel_project?: string;
  
  // Credential overrides (inherits from parent otherwise)
  credential_overrides: Partial<JavariProject['credentials']>;
  
  // Health tracking
  health_score: number;
  last_health_check_at?: string;
  
  // Build tracking
  last_build_status?: 'success' | 'failed' | 'building';
  last_build_at?: string;
  last_deploy_at?: string;
  
  // Settings
  settings: Record<string, any>;
  metadata: Record<string, any>;
  
  // Status
  status: 'active' | 'paused' | 'archived';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface JavariChatSession {
  id: string;
  project_id: string;
  subproject_id?: string;
  user_id: string;
  
  // Session info
  title: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Continuation chain
  parent_chat_id?: string;
  continuation_depth: number;
  context_summary?: string;
  
  // Credentials snapshot (at time of chat)
  credentials_snapshot: Record<string, any>;
  
  // Metrics
  token_count: number;
  message_count: number;
  lines_of_code_added: number;
  lines_of_code_deleted: number;
  files_created: number;
  files_modified: number;
  apis_created: number;
  tests_written: number;
  
  // Cost tracking
  estimated_cost_saved: number;
  actual_cost_incurred: number;
  
  // Duration
  started_at: string;
  ended_at?: string;
  total_duration_minutes?: number;
  active_duration_minutes?: number;
  
  // Issues tracking
  issues_identified: number;
  issues_resolved: number;
  
  // Status
  status: 'active' | 'completed' | 'continued';
  starred: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ChatWorkLog {
  id: string;
  chat_session_id: string;
  
  // Action details
  action_type: 'file_created' | 'file_modified' | 'file_deleted' | 'api_created' | 
               'bug_fixed' | 'test_written' | 'deploy_executed' | 'documentation_updated' |
               'refactor_completed' | 'feature_added';
  action_category: 'code' | 'infrastructure' | 'documentation' | 'testing' | 'deployment';
  description: string;
  
  // Impact
  impact_level: 'minor' | 'moderate' | 'major' | 'critical';
  files_affected: string[];
  lines_added: number;
  lines_deleted: number;
  
  // Metrics
  complexity_added?: number;
  tests_added?: boolean;
  breaking_change?: boolean;
  
  // Cost impact
  cost_saved?: number;
  cost_incurred?: number;
  
  // Code review
  needs_review: boolean;
  review_completed: boolean;
  
  // Links
  commit_sha?: string;
  deploy_url?: string;
  
  // Timestamp
  created_at: string;
}

export interface BuildHealthTracking {
  id: string;
  project_id: string;
  chat_session_id?: string;
  
  // Build info
  build_id: string;
  build_status: 'success' | 'failed' | 'building' | 'canceled';
  build_duration_seconds?: number;
  
  // Error details
  error_type?: string;
  error_message?: string;
  error_stack?: string;
  files_with_errors: string[];
  
  // Auto-fix
  auto_fixable: boolean;
  fix_suggestion?: string;
  fix_confidence?: number; // 0-100
  fix_applied: boolean;
  fix_successful?: boolean;
  
  // Deployment
  deploy_url?: string;
  preview_url?: string;
  
  // Metrics
  metrics_before?: Record<string, any>;
  metrics_after?: Record<string, any>;
  
  // Timestamp
  created_at: string;
}

export interface DependencyTracking {
  id: string;
  project_id: string;
  
  // Package info
  package_name: string;
  package_ecosystem: string;
  current_version: string;
  latest_version?: string;
  latest_safe_version?: string;
  
  // Vulnerability info
  has_vulnerabilities: boolean;
  cve_ids: string[];
  vulnerability_count: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  cvss_score?: number;
  
  // Update recommendations
  auto_update_eligible: boolean;
  breaking_changes_detected: boolean;
  safe_to_update: boolean;
  update_recommendation?: string;
  
  // Last check
  last_checked_at: string;
  next_check_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CodeReviewQueue {
  id: string;
  project_id: string;
  chat_session_id?: string;
  
  // File info
  file_path: string;
  file_type?: string;
  lines_changed?: number;
  code_diff?: string;
  commit_sha?: string;
  
  // AI Analysis scores (0-100)
  complexity_score?: number;
  security_score?: number;
  quality_score?: number;
  maintainability_score?: number;
  test_coverage_score?: number;
  
  // AI insights
  ai_concerns?: any[];
  suggested_improvements?: any[];
  security_issues?: any[];
  performance_issues?: any[];
  
  // Priority and status
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'changes_requested';
  
  // Review tracking
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  
  // Timestamp
  created_at: string;
}

export interface SmartSuggestion {
  id: string;
  project_id: string;
  
  // Suggestion details
  suggestion_type: 'optimization' | 'refactor' | 'security' | 'performance' | 
                   'cost' | 'dependency' | 'architecture' | 'testing' | 
                   'documentation' | 'deployment';
  category?: 'code' | 'infrastructure' | 'security' | 'performance' | 'cost';
  title: string;
  description: string;
  
  // Impact analysis
  impact_level: 'minor' | 'moderate' | 'major' | 'critical';
  estimated_time_minutes?: number;
  estimated_cost_usd?: number;
  estimated_savings_usd?: number;
  
  // Implementation
  implementation_steps?: any[];
  code_examples?: any[];
  files_to_modify?: string[];
  
  // Metrics
  metrics_before?: any;
  metrics_after?: any;
  confidence_score?: number;
  
  // Priority
  priority: number; // 1 = highest, 10 = lowest
  urgency?: 'low' | 'normal' | 'high';
  
  // Lifecycle
  status: 'open' | 'accepted' | 'rejected' | 'implemented' | 'expired';
  expires_at?: string;
  accepted_at?: string;
  implemented_at?: string;
  
  // Results (after implementation)
  actual_time_minutes?: number;
  actual_cost_usd?: number;
  actual_savings_usd?: number;
  success_rating?: number; // 1-5 stars
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateProjectRequest {
  name: string;
  display_name: string;
  type: 'main' | 'standalone';
  description?: string;
  github_org?: string;
  github_repo?: string;
  vercel_project?: string;
  organization_id?: string;
  credentials?: JavariProject['credentials'];
}

export interface UpdateProjectRequest {
  id: string;
  display_name?: string;
  description?: string;
  github_repo?: string;
  vercel_project?: string;
  credentials?: Partial<JavariProject['credentials']>;
  health_score?: number;
  status?: 'active' | 'paused' | 'archived';
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CreateSubProjectRequest {
  parent_project_id: string;
  name: string;
  display_name: string;
  description?: string;
  github_repo?: string;
  vercel_project?: string;
  credential_overrides?: Partial<JavariProject['credentials']>;
}

export interface UpdateSubProjectRequest {
  id: string;
  display_name?: string;
  description?: string;
  github_repo?: string;
  vercel_project?: string;
  credential_overrides?: Partial<JavariProject['credentials']>;
  health_score?: number;
  status?: 'active' | 'paused' | 'archived';
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ContinueChatRequest {
  chat_session_id: string;
  reason: string;
  preserve_context: boolean;
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

export interface LogWorkRequest {
  chat_session_id: string;
  action_type: ChatWorkLog['action_type'];
  action_category: ChatWorkLog['action_category'];
  description: string;
  files_affected?: string[];
  lines_added?: number;
  lines_deleted?: number;
  cost_saved?: number;
  cost_incurred?: number;
  commit_sha?: string;
  deploy_url?: string;
}

export interface HealthCheckResponse {
  project: JavariProject;
  health_indicators: {
    build_health: number;
    security_health: number;
    code_quality_health: number;
    dependency_health: number;
    overall_health: number;
  };
  critical_issues: Array<{
    type: string;
    severity: string;
    title: string;
    description?: string;
    cve_ids?: string[];
  }>;
  recommendations: SmartSuggestion[];
  recent_builds: BuildHealthTracking[];
  pending_reviews: CodeReviewQueue[];
}
