/**
 * Javari AI - Database Helper Functions
 * Centralized database operations for Javari
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
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query;
  return { data: data as JavariProject[] | null, error };
}

// ============================================================================
// SUBPROJECTS
// ============================================================================

export async function getSubProject(subprojectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_sub_projects')
    .select(`
      *,
      parent_project:javari_projects (*)
    `)
    .eq('id', subprojectId)
    .single();
  
  return { data: data as any, error };
}

export async function listSubProjects(parentProjectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_sub_projects')
    .select('*')
    .eq('parent_project_id', parentProjectId)
    .order('created_at', { ascending: false });
  
  return { data: data as JavariSubProject[] | null, error };
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

export async function createChatSession(session: Partial<JavariChatSession>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_sessions')
    .insert({
      ...session,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data: data as JavariChatSession | null, error };
}

export async function updateChatSession(chatId: string, updates: Partial<JavariChatSession>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_sessions')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', chatId)
    .select()
    .single();
  
  return { data: data as JavariChatSession | null, error };
}

export async function listChatSessions(projectId: string, status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('javari_chat_sessions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  return { data: data as JavariChatSession[] | null, error };
}

// ============================================================================
// WORK LOGS
// ============================================================================

export async function createWorkLog(log: Partial<ChatWorkLog>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_chat_work_logs')
    .insert({
      ...log,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data: data as ChatWorkLog | null, error };
}

export async function listWorkLogs(chatSessionId: string) {
  const supabase = await createClient();
  const { data, error} = await supabase
    .from('javari_chat_work_logs')
    .select('*')
    .eq('chat_session_id', chatSessionId)
    .order('created_at', { ascending: false });
  
  return { data: data as ChatWorkLog[] | null, error };
}

// ============================================================================
// BUILD HEALTH
// ============================================================================

export async function createBuildHealthRecord(record: Partial<BuildHealthTracking>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_build_health_tracking')
    .insert({
      ...record,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data: data as BuildHealthTracking | null, error };
}

export async function listBuildHealth(projectId: string, limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_build_health_tracking')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return { data: data as BuildHealthTracking[] | null, error };
}

export async function getLatestBuildStatus(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_build_health_tracking')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return { data: data as BuildHealthTracking | null, error };
}

// ============================================================================
// DEPENDENCIES
// ============================================================================

export async function createDependencyTracking(tracking: Partial<DependencyTracking>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_dependency_tracking')
    .insert({
      ...tracking,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data: data as DependencyTracking | null, error };
}

export async function listVulnerableDependencies(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_dependency_tracking')
    .select('*')
    .eq('project_id', projectId)
    .eq('has_vulnerabilities', true)
    .order('severity', { ascending: false });
  
  return { data: data as DependencyTracking[] | null, error };
}

// ============================================================================
// CODE REVIEW
// ============================================================================

export async function queueCodeReview(review: Partial<CodeReviewQueue>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_code_review_queue')
    .insert({
      ...review,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data: data as CodeReviewQueue | null, error };
}

export async function listPendingReviews(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_code_review_queue')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true });
  
  return { data: data as CodeReviewQueue[] | null, error };
}

// ============================================================================
// SMART SUGGESTIONS
// ============================================================================

export async function createSmartSuggestion(suggestion: Partial<SmartSuggestion>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_smart_suggestions')
    .insert({
      ...suggestion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  return { data: data as SmartSuggestion | null, error };
}

export async function listOpenSuggestions(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('javari_smart_suggestions')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'open')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });
  
  return { data: data as SmartSuggestion[] | null, error };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export async function updateProjectHealth(projectId: string, healthScore: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('javari_projects')
    .update({
      health_score: healthScore,
      last_health_check_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId);
  
  return { error };
}

export async function incrementChatCount(projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc('increment_project_chat_count', {
    p_project_id: projectId
  });
  
  return { error };
}

export async function getEffectiveCredentials(subprojectId: string) {
  const { data: subproject } = await getSubProject(subprojectId);
  if (!subproject) return null;
  
  // Merge parent credentials with overrides
  return {
    ...subproject.parent_project.credentials,
    ...subproject.credential_overrides
  };
}
