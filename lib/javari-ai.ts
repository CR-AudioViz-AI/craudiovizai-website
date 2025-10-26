/**
 * Javari AI - AI Service Functions
 * OpenAI GPT-4 powered intelligent features for autonomous development
 * @timestamp Sunday, October 26, 2025 - 11:26 AM ET
 */

import OpenAI from 'openai';
import type {
  JavariChatSession,
  ChatWorkLog,
  SmartSuggestion,
  BuildHealthTracking
} from './javari-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// ============================================================================
// CONTEXT SUMMARIZATION
// ============================================================================

export async function generateContextSummary(
  chat: JavariChatSession,
  workLogs: ChatWorkLog[]
): Promise<string> {
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
5. **Recommended Next Steps** (specific, actionable items for the next session)

Format in markdown. Be concise but comprehensive. Focus on technical details that matter for continuity.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert development project manager creating handoff summaries for seamless project continuity. Focus on technical accuracy and actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0].message.content || 'No summary generated';
  } catch (error) {
    console.error('Error generating context summary:', error);
    return 'Error generating summary - manual review recommended';
  }
}

// ============================================================================
// SMART SUGGESTIONS
// ============================================================================

export async function generateSmartSuggestions(
  projectName: string,
  context: {
    recent_builds?: BuildHealthTracking[];
    vulnerabilities?: any[];
    work_logs?: ChatWorkLog[];
    health_score?: number;
    last_deploy_age_days?: number;
  }
): Promise<Partial<SmartSuggestion>[]> {
  const prompt = `Analyze this project and generate smart, actionable suggestions for improvement.

**Project:** ${projectName}
**Health Score:** ${context.health_score || 'Unknown'}/100
**Last Deploy:** ${context.last_deploy_age_days || 0} days ago

**Recent Builds:**
${context.recent_builds?.slice(0, 5).map(b => `- ${b.build_status}: ${b.error_message || 'Success'}`).join('\n') || 'No recent builds'}

**Vulnerabilities:**
${context.vulnerabilities?.length ? `${context.vulnerabilities.length} vulnerabilities detected` : 'No known vulnerabilities'}

**Recent Work:**
${context.work_logs?.slice(0, 10).map(w => `- ${w.action_type}: ${w.description}`).join('\n') || 'No recent work'}

Generate 3-7 suggestions across these categories:
- security (CVE fixes, auth improvements)
- optimization (performance, bundle size)
- refactoring (code quality, tech debt)
- testing (coverage, E2E tests)
- dependency (updates, removals)
- performance (speed, caching)
- accessibility (WCAG compliance)
- seo (meta tags, sitemaps)
- cost_saving (prevent wasteful deploys)
- automation (CI/CD, monitoring)

For each suggestion provide:
- type (category)
- title (short, actionable)
- description (2-3 sentences explaining why)
- priority (low/normal/high/critical based on impact)
- estimated_time_minutes (realistic estimate)
- estimated_cost_impact (positive number for costs, negative for savings)
- implementation_steps (3-5 specific steps)

Return as JSON array of suggestions.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert DevOps engineer and software architect who provides actionable, prioritized suggestions for improving projects. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content || '{"suggestions": []}';
    const parsed = JSON.parse(content);
    return parsed.suggestions || [];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}

// ============================================================================
// CODE QUALITY ANALYSIS
// ============================================================================

export async function analyzeCodeQuality(
  filePath: string,
  codeBefore: string,
  codeAfter: string
): Promise<{
  complexity_score: number;
  security_score: number;
  quality_score: number;
  concerns: string[];
  recommendations: string[];
}> {
  const prompt = `Analyze this code change and provide quality metrics.

**File:** ${filePath}

**Code Before:**
\`\`\`
${codeBefore.slice(0, 2000)}
\`\`\`

**Code After:**
\`\`\`
${codeAfter.slice(0, 2000)}
\`\`\`

Analyze and return JSON with:
{
  "complexity_score": <0-100, lower is better, based on cyclomatic complexity, nesting depth>,
  "security_score": <0-100, higher is better, check for SQL injection, XSS, auth issues, hardcoded secrets>,
  "quality_score": <0-100, higher is better, based on naming, structure, maintainability>,
  "concerns": [<array of specific issues found>],
  "recommendations": [<array of specific improvements>]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a senior code reviewer with expertise in security, performance, and best practices. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content || '{}';
    const analysis = JSON.parse(content);
    
    return {
      complexity_score: analysis.complexity_score || 50,
      security_score: analysis.security_score || 80,
      quality_score: analysis.quality_score || 70,
      concerns: analysis.concerns || [],
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error('Error analyzing code quality:', error);
    return {
      complexity_score: 50,
      security_score: 80,
      quality_score: 70,
      concerns: ['Error during analysis'],
      recommendations: ['Manual review recommended']
    };
  }
}

// ============================================================================
// BUILD ERROR ANALYSIS
// ============================================================================

export async function analyzeBuildError(
  errorType: string,
  errorMessage: string,
  stackTrace: string,
  affectedFiles: string[]
): Promise<{
  auto_fixable: boolean;
  fix_suggestion: string;
  fix_confidence: number;
  implementation_steps: string[];
}> {
  const prompt = `Analyze this build error and determine if it can be automatically fixed.

**Error Type:** ${errorType}
**Error Message:** ${errorMessage}
**Stack Trace:**
\`\`\`
${stackTrace.slice(0, 1000)}
\`\`\`
**Affected Files:** ${affectedFiles.join(', ')}

Provide analysis as JSON:
{
  "auto_fixable": <true/false, can this be fixed programmatically?>,
  "fix_suggestion": <detailed explanation of the fix>,
  "fix_confidence": <0-100, how confident are you this will work?>,
  "implementation_steps": [<array of specific commands or code changes>]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert build engineer who diagnoses and fixes compilation errors. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content || '{}';
    const analysis = JSON.parse(content);
    
    return {
      auto_fixable: analysis.auto_fixable || false,
      fix_suggestion: analysis.fix_suggestion || 'Manual investigation required',
      fix_confidence: analysis.fix_confidence || 0,
      implementation_steps: analysis.implementation_steps || []
    };
  } catch (error) {
    console.error('Error analyzing build error:', error);
    return {
      auto_fixable: false,
      fix_suggestion: 'Error during analysis',
      fix_confidence: 0,
      implementation_steps: []
    };
  }
}

// ============================================================================
// DEPENDENCY ASSESSMENT
// ============================================================================

export async function assessDependencyUpdate(
  packageName: string,
  currentVersion: string,
  latestVersion: string,
  changelog?: string
): Promise<{
  safe_to_update: boolean;
  breaking_changes: boolean;
  risk_level: 'low' | 'medium' | 'high';
  notes: string;
}> {
  const prompt = `Assess the safety of updating this dependency.

**Package:** ${packageName}
**Current Version:** ${currentVersion}
**Latest Version:** ${latestVersion}
${changelog ? `**Changelog:**\n${changelog.slice(0, 1500)}` : ''}

Analyze and return JSON:
{
  "safe_to_update": <true/false>,
  "breaking_changes": <true/false>,
  "risk_level": <"low"/"medium"/"high">,
  "notes": <explanation of assessment>
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a dependency management expert who assesses update safety. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content || '{}';
    const assessment = JSON.parse(content);
    
    return {
      safe_to_update: assessment.safe_to_update || false,
      breaking_changes: assessment.breaking_changes || true,
      risk_level: assessment.risk_level || 'medium',
      notes: assessment.notes || 'Review changelog before updating'
    };
  } catch (error) {
    console.error('Error assessing dependency:', error);
    return {
      safe_to_update: false,
      breaking_changes: false,
      risk_level: 'medium',
      notes: 'Review changelog before updating'
    };
  }
}

// ============================================================================
// HEALTH SCORE CALCULATION
// ============================================================================

export function calculateProjectHealth(metrics: {
  build_success_rate?: number;
  vulnerability_count?: number;
  code_quality_avg?: number;
  test_coverage?: number;
  last_deploy_age_days?: number;
}): number {
  let score = 100;
  
  // Build failures (-20 per 10% failure rate, max -40)
  if (metrics.build_success_rate !== undefined) {
    const failureRate = 100 - metrics.build_success_rate;
    score -= Math.min(40, (failureRate / 10) * 20);
  }
  
  // Vulnerabilities (-10 per vulnerability, max -30)
  if (metrics.vulnerability_count) {
    score -= Math.min(30, metrics.vulnerability_count * 10);
  }
  
  // Code quality (-20 if avg < 70)
  if (metrics.code_quality_avg && metrics.code_quality_avg < 70) {
    score -= 20;
  }
  
  // Test coverage (-15 if < 50%)
  if (metrics.test_coverage !== undefined && metrics.test_coverage < 50) {
    score -= 15;
  }
  
  // Stale deployments (-10 if > 30 days)
  if (metrics.last_deploy_age_days && metrics.last_deploy_age_days > 30) {
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================================
// TOKEN ESTIMATION
// ============================================================================

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
}

export function estimateCost(inputTokens: number, outputTokens: number, model: string = 'gpt-4-turbo'): number {
  // GPT-4 Turbo pricing (as of 2024)
  const rates = {
    'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
    'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
    'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 }
  };
  
  const rate = rates[model as keyof typeof rates] || rates['gpt-4-turbo'];
  return (inputTokens * rate.input) + (outputTokens * rate.output);
}
