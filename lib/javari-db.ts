/**
 * Javari AI - Database Helper Functions
 * Centralized database operations for Javari chat management system
 * @timestamp Sunday, October 26, 2025 - 11:25 AM ET
 */

import { createClient } from '@/lib/supabase/server';
import type {
  JavariProject,
  JavariSubProject,
  JavariChatSession,
  ChatWorkLog,
  BuildHealthTracking,
  DependencyTracking,
  CodeReviewQueue,
  SmartSuggestion
} from './javari-types';

// ============================================================================
// PROJECTS
// ============================================================================

export async function getProject(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  return { data: data as JavariProject | null, error };
}

export async function getProjectByName(projectName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_projects')
    .select('*')
    .eq('name', projectName)
    .single();
  
  return { data: data as JavariProject | null, error };
}

export async function listProjects(organizationId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (organizationId) {
    query = query.eq('github_org', organizationId);
  }
  
  const { data, error } = await query;
  return { data: data as JavariProject[] | null, error };
}

export async function createProject(project: Partial<JavariProject>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_projects')
    .insert(project)
    .select()
    .single();
  
  return { data: data as JavariProject | null, error };
}

export async function updateProject(projectId: string, updates: Partial<JavariProject>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();
  
  return { data: data as JavariProject | null, error };
}

// ============================================================================
// SUBPROJECTS
// ============================================================================

export async function getSubProject(subProjectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_sub_projects')
    .select('*')
    .eq('id', subProjectId)
    .single();
  
  return { data: data as JavariSubProject | null, error };
}

export async function listSubProjects(parentProjectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_sub_projects')
    .select('*')
    .eq('parent_project_id', parentProjectId)
    .order('name', { ascending: true });
  
  return { data: data as JavariSubProject[] | null, error };
}

export async function createSubProject(subProject: Partial<JavariSubProject>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_sub_projects')
    .insert(subProject)
    .select()
    .single();
  
  return { data: data as JavariSubProject | null, error };
}

export async function updateSubProject(subProjectId: string, updates: Partial<JavariSubProject>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_sub_projects')
    .update(updates)
    .eq('id', subProjectId)
    .select()
    .single();
  
  return { data: data as JavariSubProject | null, error };
}

// ============================================================================
// CHAT SESSIONS
// ============================================================================

export async function getChatSession(chatId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_sessions')
    .select('*')
    .eq('id', chatId)
    .single();
  
  return { data: data as JavariChatSession | null, error };
}

export async function listChatSessions(filters?: {
  projectId?: string;
  subProjectId?: string;
  userId?: string;
  status?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_chat_sessions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (filters?.projectId) {
    query = query.eq('project_id', filters.projectId);
  }
  if (filters?.subProjectId) {
    query = query.eq('subproject_id', filters.subProjectId);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  return { data: data as JavariChatSession[] | null, error };
}

export async function createChatSession(session: Partial<JavariChatSession>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_sessions')
    .insert(session)
    .select()
    .single();
  
  return { data: data as JavariChatSession | null, error };
}

export async function updateChatSession(chatId: string, updates: Partial<JavariChatSession>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_sessions')
    .update(updates)
    .eq('id', chatId)
    .select()
    .single();
  
  return { data: data as JavariChatSession | null, error };
}

// ============================================================================
// WORK LOGS
// ============================================================================

export async function getWorkLog(logId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_work_logs')
    .select('*')
    .eq('id', logId)
    .single();
  
  return { data: data as ChatWorkLog | null, error };
}

export async function listWorkLogs(chatSessionId: string, limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_chat_work_logs')
    .select('*')
    .eq('chat_session_id', chatSessionId)
    .order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  return { data: data as ChatWorkLog[] | null, error };
}

export async function createWorkLog(log: Partial<ChatWorkLog>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_work_logs')
    .insert(log)
    .select()
    .single();
  
  return { data: data as ChatWorkLog | null, error };
}

// ============================================================================
// BUILD HEALTH TRACKING
// ============================================================================

export async function getBuildHealth(buildId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_build_health_tracking')
    .select('*')
    .eq('id', buildId)
    .single();
  
  return { data: data as BuildHealthTracking | null, error };
}

export async function listBuildHealth(projectId: string, limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_build_health_tracking')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  return { data: data as BuildHealthTracking[] | null, error };
}

export async function createBuildHealth(build: Partial<BuildHealthTracking>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_build_health_tracking')
    .insert(build)
    .select()
    .single();
  
  return { data: data as BuildHealthTracking | null, error };
}

export async function updateBuildHealth(buildId: string, updates: Partial<BuildHealthTracking>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_build_health_tracking')
    .update(updates)
    .eq('id', buildId)
    .select()
    .single();
  
  return { data: data as BuildHealthTracking | null, error };
}

// ============================================================================
// DEPENDENCY TRACKING
// ============================================================================

export async function getDependency(dependencyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_dependency_tracking')
    .select('*')
    .eq('id', dependencyId)
    .single();
  
  return { data: data as DependencyTracking | null, error };
}

export async function listDependencies(projectId: string, filters?: {
  hasCVE?: boolean;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_dependency_tracking')
    .select('*')
    .eq('project_id', projectId)
    .order('severity_score', { ascending: false });
  
  if (filters?.hasCVE) {
    query = query.not('cve_ids', 'is', null);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  return { data: data as DependencyTracking[] | null, error };
}

export async function createDependency(dependency: Partial<DependencyTracking>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_dependency_tracking')
    .insert(dependency)
    .select()
    .single();
  
  return { data: data as DependencyTracking | null, error };
}

// ============================================================================
// CODE REVIEW QUEUE
// ============================================================================

export async function getCodeReview(reviewId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_code_review_queue')
    .select('*')
    .eq('id', reviewId)
    .single();
  
  return { data: data as CodeReviewQueue | null, error };
}

export async function listCodeReviews(projectId: string, filters?: {
  status?: string;
  priority?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_code_review_queue')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  return { data: data as CodeReviewQueue[] | null, error };
}

export async function createCodeReview(review: Partial<CodeReviewQueue>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_code_review_queue')
    .insert(review)
    .select()
    .single();
  
  return { data: data as CodeReviewQueue | null, error };
}

export async function updateCodeReview(reviewId: string, updates: Partial<CodeReviewQueue>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_code_review_queue')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single();
  
  return { data: data as CodeReviewQueue | null, error };
}

// ============================================================================
// SMART SUGGESTIONS
// ============================================================================

export async function getSuggestion(suggestionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_smart_suggestions')
    .select('*')
    .eq('id', suggestionId)
    .single();
  
  return { data: data as SmartSuggestion | null, error };
}

export async function listSuggestions(projectId: string, filters?: {
  type?: string;
  priority?: string;
  status?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_smart_suggestions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (filters?.type) {
    query = query.eq('suggestion_type', filters.type);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  return { data: data as SmartSuggestion[] | null, error };
}

export async function createSuggestion(suggestion: Partial<SmartSuggestion>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_smart_suggestions')
    .insert(suggestion)
    .select()
    .single();
  
  return { data: data as SmartSuggestion | null, error };
}

export async function updateSuggestion(suggestionId: string, updates: Partial<SmartSuggestion>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_smart_suggestions')
    .update(updates)
    .eq('id', suggestionId)
    .select()
    .single();
  
  return { data: data as SmartSuggestion | null, error };
}
