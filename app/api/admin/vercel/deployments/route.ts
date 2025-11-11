/**
 * CR AudioViz AI - Vercel Monitoring API
 * Proxy to Vercel API for deployment tracking
 * @timestamp October 28, 2025 - 3:55 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export const dynamic = 'force-dynamic';

const VERCEL_API_URL = 'https://api.vercel.com';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const teamId = searchParams.get('teamId');
    const limit = searchParams.get('limit') || '20';

    if (!projectId || !teamId) {
      return NextResponse.json(
        { error: 'Missing required parameters: projectId and teamId' },
        { status: 400 }
      );
    }

    // Get Vercel API token from environment (would be configured in Vercel dashboard)
    const vercelToken = process.env.VERCEL_API_TOKEN;
    
    if (!vercelToken) {
      return NextResponse.json(
        { error: 'Vercel API token not configured' },
        { status: 500 }
      );
    }

    // Fetch deployments from Vercel API
    const vercelResponse = await fetch(
      `${VERCEL_API_URL}/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!vercelResponse.ok) {
      throw new Error(`Vercel API error: ${vercelResponse.status}`);
    }

    const data = await vercelResponse.json();

    return NextResponse.json({
      success: true,
      deployments: data.deployments || [],
      pagination: data.pagination || null,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    logError('Vercel monitoring error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch deployments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
