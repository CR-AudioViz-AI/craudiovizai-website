/**
 * Javari AI - AI Service Functions
 * OpenAI GPT-4 powered intelligent features for autonomous development
 * @timestamp Sunday, October 26, 2025 - 4:10 PM ET
 * 
 * FIX: Lazy initialization of OpenAI client to avoid build-time errors
 */

import OpenAI from 'openai';
import type {
  JavariChatSession,
  ChatWorkLog,
  SmartSuggestion,
  BuildHealthTracking
} from './javari-types';

// Lazy initialization - only create OpenAI client when first needed
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

// ============================================================================
// CONTEXT SUMMARIZATION
// ============================================================================

export async function generateContextSummary(
  chat: JavariChatSession,
  workLogs: ChatWorkLog[]
): Promise<string> {
  const openai = getOpenAIClient(); // Get client at runtime

  const prompt = `Analyze this development session and create a comprehensive handoff summary.

**Session Info:**
- Title: ${chat.title}
- Duration: ${chat.active_duration_minutes || 0} minutes active / ${chat.total_duration_minutes || 0} minutes total
- Files Created: ${chat.files_created}
- Files Modified: ${chat.files_modified}
- Lines Added: ${chat.lines_of_code_added}
- Lines Deleted: ${chat.lines_of_code_deleted}
- APIs Created: ${chat.apis_created}
- Tests Written: ${chat.tests_written}
- Issues Identified: ${chat.issues_identified}
- Issues Resolved: ${chat.issues_resolved}
- Cost Saved: $${(chat.estimated_cost_saved || 0).toFixed(2)}
- Cost Incurred: $${(chat.actual_cost_incurred || 0).toFixed(2)}

**Work Completed:**
${workLogs.map((log, i) => `${i + 1}. [${log.action_type}] ${log.description}${log.files_affected ? ` - Files: ${log.files_affected.join(', ')}` : ''}`).join('\n')}

Create a handoff summary with:
1. **Executive Summary** (2-3 sentences of what was accomplished)
2. **Key Accomplishments** (3-5 most important bullet points)
3. **Pending Tasks** (what's left to do)
4. **Blockers** (if any technical issues or dependencies)
5. **Next Steps** (recommended actions for the continuation chat)

Keep it concise but comprehensive. Format in markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0]?.message?.content || 'Summary generation failed';
  } catch (error) {
    console.error('Error generating context summary:', error);
    throw new Error('Failed to generate context summary');
  }
}

// ============================================================================
// SMART SUGGESTIONS
// ============================================================================

export async function generateSmartSuggestions(
  chat: JavariChatSession,
  recentLogs: ChatWorkLog[]
): Promise<SmartSuggestion[]> {
  const openai = getOpenAIClient(); // Get client at runtime

  const prompt = `Based on this development session, suggest 3-5 intelligent next actions.

**Context:**
- Project: ${chat.title}
- Recent Work: ${recentLogs.map(l => l.description).slice(0, 5).join('; ')}
- Files Created: ${chat.files_created}
- Issues: ${chat.issues_identified} identified, ${chat.issues_resolved} resolved

Provide suggestions as JSON array:
[
  {
    "title": "Short action title",
    "description": "Detailed explanation",
    "priority": "high|medium|low",
    "estimated_time_minutes": 30,
    "category": "feature|bugfix|refactor|test|docs"
  }
]

Only return valid JSON, no markdown or extra text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1500
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const suggestions = JSON.parse(content);
    
    return suggestions.map((s: any, i: number) => ({
      id: `suggestion-${Date.now()}-${i}`,
      chat_session_id: chat.id,
      ...s,
      status: 'pending' as const,
      created_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}

// ============================================================================
// BUILD HEALTH ANALYSIS
// ============================================================================

export async function analyzeBuildHealth(
  buildLogs: string,
  errorLogs: string
): Promise<BuildHealthTracking> {
  const openai = getOpenAIClient(); // Get client at runtime

  const prompt = `Analyze these build logs and provide health metrics.

**Build Logs:**
${buildLogs.slice(0, 2000)}

**Error Logs:**
${errorLogs.slice(0, 1000)}

Provide analysis as JSON:
{
  "overall_health": "healthy|warning|critical",
  "build_score": 85,
  "performance_score": 90,
  "issues_found": ["issue 1", "issue 2"],
  "recommendations": ["fix 1", "fix 2"],
  "estimated_fix_time_minutes": 30
}

Only return valid JSON.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(content);

    return {
      id: `health-${Date.now()}`,
      deployment_id: 'unknown',
      ...analysis,
      analyzed_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing build health:', error);
    return {
      id: `health-${Date.now()}`,
      deployment_id: 'unknown',
      overall_health: 'unknown',
      build_score: 0,
      performance_score: 0,
      issues_found: ['Failed to analyze'],
      recommendations: ['Manual review required'],
      estimated_fix_time_minutes: 0,
      analyzed_at: new Date().toISOString()
    };
  }
}

// ============================================================================
// CODE REVIEW
// ============================================================================

export async function generateCodeReview(
  filePath: string,
  codeContent: string,
  context?: string
): Promise<string> {
  const openai = getOpenAIClient(); // Get client at runtime

  const prompt = `Review this code file and provide feedback.

**File:** ${filePath}

**Context:** ${context || 'No additional context'}

**Code:**
\`\`\`
${codeContent.slice(0, 3000)}
\`\`\`

Provide:
1. **Quality Score:** 1-10
2. **Strengths:** 2-3 bullet points
3. **Issues:** Any bugs, security concerns, or anti-patterns
4. **Suggestions:** Specific improvements
5. **Priority:** Which issues to fix first

Format in markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1500
    });

    return completion.choices[0]?.message?.content || 'Review failed';
  } catch (error) {
    console.error('Error generating code review:', error);
    throw new Error('Failed to generate code review');
  }
}

// ============================================================================
// ERROR DIAGNOSIS
// ============================================================================

export async function diagnoseError(
  errorMessage: string,
  stackTrace?: string,
  codeContext?: string
): Promise<{
  diagnosis: string;
  likely_cause: string;
  suggested_fixes: string[];
  confidence: 'high' | 'medium' | 'low';
}> {
  const openai = getOpenAIClient(); // Get client at runtime

  const prompt = `Diagnose this error and suggest fixes.

**Error:** ${errorMessage}

**Stack Trace:**
${stackTrace?.slice(0, 1000) || 'No stack trace'}

**Code Context:**
${codeContext?.slice(0, 1000) || 'No context'}

Provide JSON:
{
  "diagnosis": "What's wrong",
  "likely_cause": "Why it happened",
  "suggested_fixes": ["fix 1", "fix 2", "fix 3"],
  "confidence": "high|medium|low"
}

Only return valid JSON.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error diagnosing error:', error);
    return {
      diagnosis: 'Failed to diagnose error',
      likely_cause: 'Analysis error',
      suggested_fixes: ['Manual debugging required'],
      confidence: 'low'
    };
  }
}
