/**
 * Javari AI - AI Service Functions
 * OpenAI GPT-4 powered intelligent features
 */

import OpenAI from 'openai';
import type {
  JavariChatSession,
  ChatWorkLog,
  SmartSuggestion
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
- Duration: ${chat.active_duration_minutes || 0} minutes
- Files Created: ${chat.files_created}
- Files Modified: ${chat.files_modified}
- Lines Added: ${chat.lines_of_code_added}
- Lines Deleted: ${chat.lines_of_code_deleted}
- Issues Identified: ${chat.issues_identified}
- Issues Resolved: ${chat.issues_resolved}

**Work Completed:**
${workLogs.map((log, i) => `${i + 1}. [${log.action_type}] ${log.description}`).join('\n')}

Create a handoff summary with:
1. **Executive Summary** (2-3 sentences)
2. **Key Accomplishments** (3-5 bullet points)
3. **Pending Tasks** (what's left to do)
4. **Blockers** (if any)
5. **Recommended Next Steps** (actionable items)

Format in markdown. Be concise but comprehensive.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert development project manager creating handoff summaries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  return response.choices[0].message.content || 'No summary generated';
}

// ============================================================================
// SMART SUGGESTIONS
// ============================================================================

export async function generateSmartSuggestions(
  projectName: string,
  context: {
    recent_builds?: any[];
    vulnerabilities?: any[];
    work_logs?: ChatWorkLog[];
    health_score?: number;
  }
): Promise<Partial<SmartSuggestion>[]> {
  const prompt = `Analyze this project and generate proactive improvement suggestions.

**Project:** ${projectName}
**Health Score:** ${context.health_score || 100}/100

**Recent Activity:**
${context.work_logs?.slice(0, 5).map(log => `- ${log.description}`).join('\n') || 'No recent activity'}

**Issues:**
${context.vulnerabilities?.length ? 
  context.vulnerabilities.map(v => `- ${v.severity} CVE in ${v.package_name}`).join('\n') :
  'No vulnerabilities detected'}

Generate 3-5 actionable suggestions across these categories:
- Security (CVE fixes, auth improvements)
- Optimization (performance, bundle size)
- Cost Saving (prevent unnecessary deploys)
- Testing (coverage gaps)
- Dependency (outdated packages)

For each suggestion, provide:
- Type & Category
- Title (concise)
- Description (2-3 sentences)
- Impact Level (minor/moderate/major/critical)
- Estimated Time (minutes)
- Implementation Steps (array of strings)

Return as JSON array.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert DevOps consultant. Return valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 1500,
    response_format: { type: 'json_object' }
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.suggestions || [];
  } catch {
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
  improvements: string[];
}> {
  const prompt = `Analyze this code change and provide quality scores.

**File:** ${filePath}

**Code Changed:**
\`\`\`
${codeAfter.substring(0, 2000)}
\`\`\`

Analyze and return JSON with:
{
  "complexity_score": 0-100 (lower is better, McCabe complexity),
  "security_score": 0-100 (higher is better),
  "quality_score": 0-100 (higher is better),
  "concerns": ["specific concern 1", "concern 2"],
  "improvements": ["suggestion 1", "suggestion 2"]
}

Look for:
- Security: SQL injection, XSS, exposed secrets, auth bypass
- Complexity: Deep nesting, long functions, tight coupling
- Quality: Naming, comments, error handling, type safety`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert code reviewer. Return valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 800,
    response_format: { type: 'json_object' }
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      complexity_score: result.complexity_score || 50,
      security_score: result.security_score || 80,
      quality_score: result.quality_score || 80,
      concerns: result.concerns || [],
      improvements: result.improvements || []
    };
  } catch {
    return {
      complexity_score: 50,
      security_score: 80,
      quality_score: 80,
      concerns: [],
      improvements: []
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
  filesAffected: string[]
): Promise<{
  auto_fixable: boolean;
  fix_suggestion: string;
  fix_confidence: number;
  implementation: string[];
}> {
  const prompt = `Analyze this build error and suggest a fix.

**Error Type:** ${errorType}
**Error Message:** ${errorMessage}
**Files Affected:** ${filesAffected.join(', ')}
**Stack Trace:**
\`\`\`
${stackTrace.substring(0, 1000)}
\`\`\`

Return JSON with:
{
  "auto_fixable": boolean,
  "fix_suggestion": "human-readable explanation",
  "fix_confidence": 0-100,
  "implementation": ["step 1", "step 2", "step 3"]
}

Common fixes:
- Missing dependencies → npm install
- Type errors → Add type annotations
- Import errors → Fix import paths
- ESLint errors → Update code style`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert build engineer. Return valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 600,
    response_format: { type: 'json_object' }
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      auto_fixable: result.auto_fixable || false,
      fix_suggestion: result.fix_suggestion || 'Manual review required',
      fix_confidence: result.fix_confidence || 50,
      implementation: result.implementation || []
    };
  } catch {
    return {
      auto_fixable: false,
      fix_suggestion: 'Manual review required',
      fix_confidence: 50,
      implementation: []
    };
  }
}

// ============================================================================
// DEPENDENCY ASSESSMENT
// ============================================================================

export async function assessDependencyUpdate(
  packageName: string,
  currentVersion: string,
  latestVersion: string
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

Return JSON with:
{
  "safe_to_update": boolean,
  "breaking_changes": boolean,
  "risk_level": "low" | "medium" | "high",
  "notes": "explanation of changes and risks"
}

Consider:
- Semantic versioning (major.minor.patch)
- Known breaking changes
- Security patches
- Community adoption`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert dependency manager. Return valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 400,
    response_format: { type: 'json_object' }
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      safe_to_update: result.safe_to_update || false,
      breaking_changes: result.breaking_changes || false,
      risk_level: result.risk_level || 'medium',
      notes: result.notes || 'Review changelog before updating'
    };
  } catch {
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
  
  // Build failures (-20 per failure, max -40)
  if (metrics.build_success_rate !== undefined) {
    score -= Math.min(40, (100 - metrics.build_success_rate) * 0.4);
  }
  
  // Vulnerabilities (-10 per critical, -5 per high, max -30)
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
  
  return Math.max(0, Math.min(100, score));
}
