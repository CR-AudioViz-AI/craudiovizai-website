/**
 * Javari AI - Health Monitoring API
 * Real-time project health assessment
 * Route: /api/javari/health
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  getProject,
  listBuildHealth,
  listVulnerableDependencies,
  listPendingReviews,
  listOpenSuggestions,
  updateProjectHealth
} from '@/lib/javari-db';
import { calculateProjectHealth } from '@/lib/javari-ai';
import type { HealthCheckResponse } from '@/lib/javari-types';

export const runtime = 'nodejs';

/**
 * GET /api/javari/health
 * Get comprehensive health report for a project
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('project_id');

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'project_id required' },
        { status: 400 }
      );
    }

    // Get project
    const { data: project, error: projectError } = await getProject(projectId);
    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get recent builds
    const { data: recentBuilds } = await listBuildHealth(projectId, 10);
    const buildSuccessRate = recentBuilds && recentBuilds.length > 0
      ? (recentBuilds.filter(b => b.build_status === 'success').length / recentBuilds.length) * 100
      : 100;

    // Get vulnerabilities
    const { data: vulnerabilities } = await listVulnerableDependencies(projectId);
    const criticalVulns = vulnerabilities?.filter(v => v.severity === 'critical').length || 0;
    const highVulns = vulnerabilities?.filter(v => v.severity === 'high').length || 0;

    // Get pending code reviews
    const { data: pendingReviews } = await listPendingReviews(projectId);
    const avgQuality = pendingReviews && pendingReviews.length > 0
      ? pendingReviews.reduce((sum, r) => sum + (r.quality_score || 80), 0) / pendingReviews.length
      : 85;

    // Get last deploy age
    const lastDeployAge = project.last_deploy_at
      ? Math.floor((Date.now() - new Date(project.last_deploy_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate individual health scores
    const buildHealth = Math.round(buildSuccessRate);
    const securityHealth = Math.max(0, 100 - (criticalVulns * 20) - (highVulns * 10));
    const codeQualityHealth = Math.round(avgQuality);
    const dependencyHealth = vulnerabilities && vulnerabilities.length > 0 
      ? Math.max(0, 100 - (vulnerabilities.length * 5))
      : 100;

    // Calculate overall health score
    const overallHealth = calculateProjectHealth({
      build_success_rate: buildSuccessRate,
      vulnerability_count: criticalVulns + highVulns,
      code_quality_avg: avgQuality,
      last_deploy_age_days: lastDeployAge
    });

    // Update project health in database
    await updateProjectHealth(projectId, overallHealth);

    // Compile critical issues
    const critical_issues: HealthCheckResponse['critical_issues'] = [];

    // Add build failures
    const failedBuilds = recentBuilds?.filter(b => b.build_status === 'failed') || [];
    if (failedBuilds.length > 0) {
      critical_issues.push({
        type: 'build',
        severity: 'high',
        title: `${failedBuilds.length} recent build failure(s)`,
        description: failedBuilds[0]?.error_message
      });
    }

    // Add critical vulnerabilities
    vulnerabilities?.forEach(vuln => {
      if (vuln.severity === 'critical' || vuln.severity === 'high') {
        critical_issues.push({
          type: 'security',
          severity: vuln.severity,
          title: `${vuln.severity.toUpperCase()} vulnerability in ${vuln.package_name}`,
          description: `Current: ${vuln.current_version}, Safe: ${vuln.latest_safe_version}`,
          cve_ids: vuln.cve_ids
        });
      }
    });

    // Add code quality issues
    const lowQualityReviews = pendingReviews?.filter(r => (r.quality_score || 100) < 60) || [];
    if (lowQualityReviews.length > 0) {
      critical_issues.push({
        type: 'code_quality',
        severity: 'medium',
        title: `${lowQualityReviews.length} file(s) with low quality score`,
        description: 'Code review recommended'
      });
    }

    // Get recommendations
    const { data: recommendations } = await listOpenSuggestions(projectId);

    // Prepare response
    const response: HealthCheckResponse = {
      project,
      health_indicators: {
        build_health: buildHealth,
        security_health: securityHealth,
        code_quality_health: codeQualityHealth,
        dependency_health: dependencyHealth,
        overall_health: overallHealth
      },
      critical_issues,
      recommendations: recommendations || [],
      recent_builds: recentBuilds || [],
      pending_reviews: pendingReviews || []
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in health check:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/health
 * Trigger manual health check and update
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_id } = body;

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id required' },
        { status: 400 }
      );
    }

    // Trigger health check by calling GET endpoint logic
    const getRequest = new NextRequest(
      `${request.url}?project_id=${project_id}`,
      { method: 'GET' }
    );
    
    return GET(getRequest);

  } catch (error) {
    console.error('Error in manual health check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/javari/health
 * Update health score manually (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you'll need to implement this check)
    // For now, allowing any authenticated user
    
    const body = await request.json();
    const { project_id, health_score } = body;

    if (!project_id || health_score === undefined) {
      return NextResponse.json(
        { error: 'project_id and health_score required' },
        { status: 400 }
      );
    }

    if (health_score < 0 || health_score > 100) {
      return NextResponse.json(
        { error: 'health_score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Update health score
    const { error } = await updateProjectHealth(project_id, health_score);

    if (error) {
      console.error('Error updating health score:', error);
      return NextResponse.json(
        { error: 'Failed to update health score' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Health score updated',
      health_score
    });

  } catch (error) {
    console.error('Error in PATCH health:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
