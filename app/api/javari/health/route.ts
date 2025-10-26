import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  BuildHealthTracking, 
  CreateHealthCheckRequest,
  HealthCheckResult 
} from '@/lib/javari-types';

/**
 * GET /api/javari/health
 * Get health check history or latest health status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const latest = searchParams.get('latest') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: projectId' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('javari_build_health_tracking')
      .select('*')
      .eq('project_id', projectId)
      .order('check_timestamp', { ascending: false });

    if (latest) {
      query = query.limit(1);
      const { data, error } = await query.single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data
      });
    } else {
      query = query.limit(limit);
      const { data, error } = await query;

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: data || []
      });
    }

  } catch (error) {
    console.error('GET /api/javari/health error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/health
 * Record a new health check
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: CreateHealthCheckRequest = await request.json();

    // Validate required fields
    if (!body.project_id || body.health_score === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: project_id, health_score' 
        },
        { status: 400 }
      );
    }

    // Validate health score range (0-100)
    if (body.health_score < 0 || body.health_score > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Health score must be between 0 and 100' 
        },
        { status: 400 }
      );
    }

    // Create health check record
    const healthData: Partial<BuildHealthTracking> = {
      project_id: body.project_id,
      health_score: body.health_score,
      build_status: body.build_status || null,
      test_coverage_percentage: body.test_coverage_percentage || null,
      lint_errors_count: body.lint_errors_count || 0,
      lint_warnings_count: body.lint_warnings_count || 0,
      type_errors_count: body.type_errors_count || 0,
      security_vulnerabilities_count: body.security_vulnerabilities_count || 0,
      dependency_issues_count: body.dependency_issues_count || 0,
      build_time_ms: body.build_time_ms || null,
      bundle_size_kb: body.bundle_size_kb || null,
      check_timestamp: new Date().toISOString(),
      issues_detected: body.issues_detected || [],
      recommendations: body.recommendations || [],
      metadata: body.metadata || {}
    };

    const { data, error } = await supabase
      .from('javari_build_health_tracking')
      .insert(healthData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Update project health score
    await supabase
      .from('javari_projects')
      .update({
        health_score: body.health_score,
        last_health_check: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', body.project_id);

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/javari/health error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/javari/health/analyze
 * Analyze current project health and generate recommendations
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: projectId' },
        { status: 400 }
      );
    }

    // Get latest health check
    const { data: latestHealth, error: healthError } = await supabase
      .from('javari_build_health_tracking')
      .select('*')
      .eq('project_id', projectId)
      .order('check_timestamp', { ascending: false })
      .limit(1)
      .single();

    if (healthError || !latestHealth) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No health check data found for project' 
        },
        { status: 404 }
      );
    }

    // Analyze health metrics and generate recommendations
    const analysis: HealthCheckResult = {
      overall_score: latestHealth.health_score,
      status: latestHealth.health_score >= 80 ? 'healthy' : 
              latestHealth.health_score >= 60 ? 'warning' : 'critical',
      issues: [],
      recommendations: []
    };

    // Check for issues
    if (latestHealth.lint_errors_count > 0) {
      analysis.issues.push({
        severity: 'high',
        category: 'code_quality',
        message: `${latestHealth.lint_errors_count} lint errors detected`,
        count: latestHealth.lint_errors_count
      });
      analysis.recommendations.push('Run `npm run lint:fix` to auto-fix lint errors');
    }

    if (latestHealth.type_errors_count > 0) {
      analysis.issues.push({
        severity: 'high',
        category: 'type_safety',
        message: `${latestHealth.type_errors_count} TypeScript errors detected`,
        count: latestHealth.type_errors_count
      });
      analysis.recommendations.push('Review and fix TypeScript type errors');
    }

    if (latestHealth.security_vulnerabilities_count > 0) {
      analysis.issues.push({
        severity: 'critical',
        category: 'security',
        message: `${latestHealth.security_vulnerabilities_count} security vulnerabilities detected`,
        count: latestHealth.security_vulnerabilities_count
      });
      analysis.recommendations.push('Run `npm audit fix` to resolve security vulnerabilities');
    }

    if (latestHealth.test_coverage_percentage !== null && 
        latestHealth.test_coverage_percentage < 70) {
      analysis.issues.push({
        severity: 'medium',
        category: 'testing',
        message: `Test coverage is ${latestHealth.test_coverage_percentage}% (target: 70%+)`,
        count: null
      });
      analysis.recommendations.push('Increase test coverage to improve reliability');
    }

    if (latestHealth.build_time_ms && latestHealth.build_time_ms > 60000) {
      analysis.issues.push({
        severity: 'low',
        category: 'performance',
        message: `Build time is ${(latestHealth.build_time_ms / 1000).toFixed(1)}s (optimize for <60s)`,
        count: null
      });
      analysis.recommendations.push('Consider optimizing build configuration');
    }

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('PATCH /api/javari/health/analyze error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
