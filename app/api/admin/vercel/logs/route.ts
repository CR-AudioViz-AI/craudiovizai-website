/**
 * CR AudioViz AI - Vercel Build Logs API
 * Proxy to Vercel API for build log retrieval
 * @timestamp October 28, 2025 - 3:56 PM EST
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
    const deploymentId = searchParams.get('deploymentId');
    const teamId = searchParams.get('teamId');
    const limit = searchParams.get('limit') || '100';

    if (!deploymentId || !teamId) {
      return NextResponse.json(
        { error: 'Missing required parameters: deploymentId and teamId' },
        { status: 400 }
      );
    }

    // Get Vercel API token from environment
    const vercelToken = process.env.VERCEL_API_TOKEN;
    
    if (!vercelToken) {
      return NextResponse.json(
        { error: 'Vercel API token not configured' },
        { status: 500 }
      );
    }

    // Fetch build logs from Vercel API
    const vercelResponse = await fetch(
      `${VERCEL_API_URL}/v13/deployments/${deploymentId}/events?teamId=${teamId}&limit=${limit}`,
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

    // Transform events into simplified log format
    const logs = (data.events || []).map((event: any) => ({
      text: event.text || event.payload?.text || '',
      type: event.type || 'stdout',
      level: event.info?.level,
      created: event.created || Date.now()
    })).filter((log: any) => log.text);

    return NextResponse.json({
      success: true,
      logs: logs,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    logError('Vercel logs error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch build logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
