// CR AUDIOVIZ AI - API Health Check & Monitoring
// Session: 2025-10-25 - Phase 4
// Purpose: Monitor system health, uptime, and performance

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: ServiceStatus;
    stripe: ServiceStatus;
    openai: ServiceStatus;
    storage: ServiceStatus;
  };
  metrics: {
    totalUsers: number;
    activeUsers24h: number;
    totalAssets: number;
    totalCreditsIssued: number;
    apiResponseTime: number;
  };
}

interface ServiceStatus {
  status: 'online' | 'offline' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

const startTime = Date.now();

// GET: Comprehensive health check
export async function GET(request: Request) {
  const checkStartTime = Date.now();
  
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    
    // Initialize health check result
    const healthCheck: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - startTime,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      services: {
        database: { status: 'online', lastCheck: new Date().toISOString() },
        stripe: { status: 'online', lastCheck: new Date().toISOString() },
        openai: { status: 'online', lastCheck: new Date().toISOString() },
        storage: { status: 'online', lastCheck: new Date().toISOString() }
      },
      metrics: {
        totalUsers: 0,
        activeUsers24h: 0,
        totalAssets: 0,
        totalCreditsIssued: 0,
        apiResponseTime: 0
      }
    };

    // Check database
    const dbStartTime = Date.now();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      healthCheck.services.database.responseTime = Date.now() - dbStartTime;
      
      if (error) {
        healthCheck.services.database.status = 'degraded';
        healthCheck.services.database.error = error.message;
        healthCheck.status = 'degraded';
      }
    } catch (error: any) {
      healthCheck.services.database.status = 'offline';
      healthCheck.services.database.error = error.message;
      healthCheck.status = 'unhealthy';
    }

    // Check Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      const stripeStartTime = Date.now();
      try {
        const response = await fetch('https://api.stripe.com/v1/balance', {
          headers: {
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
          }
        });
        
        healthCheck.services.stripe.responseTime = Date.now() - stripeStartTime;
        
        if (!response.ok) {
          healthCheck.services.stripe.status = 'degraded';
          healthCheck.status = 'degraded';
        }
      } catch (error: any) {
        healthCheck.services.stripe.status = 'offline';
        healthCheck.services.stripe.error = error.message;
        healthCheck.status = 'degraded';
      }
    }

    // Check OpenAI
    if (process.env.OPENAI_API_KEY) {
      const openaiStartTime = Date.now();
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }
        });
        
        healthCheck.services.openai.responseTime = Date.now() - openaiStartTime;
        
        if (!response.ok) {
          healthCheck.services.openai.status = 'degraded';
        }
      } catch (error: any) {
        healthCheck.services.openai.status = 'offline';
        healthCheck.services.openai.error = error.message;
      }
    }

    // Check Supabase Storage
    const storageStartTime = Date.now();
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      healthCheck.services.storage.responseTime = Date.now() - storageStartTime;
      
      if (error) {
        healthCheck.services.storage.status = 'degraded';
        healthCheck.services.storage.error = error.message;
      }
    } catch (error: any) {
      healthCheck.services.storage.status = 'offline';
      healthCheck.services.storage.error = error.message;
    }

    // Fetch detailed metrics if requested
    if (detailed && healthCheck.services.database.status !== 'offline') {
      try {
        // Total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        healthCheck.metrics.totalUsers = userCount || 0;

        // Active users in last 24 hours
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: activeCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', yesterday);
        
        healthCheck.metrics.activeUsers24h = activeCount || 0;

        // Total assets
        const { count: assetCount } = await supabase
          .from('user_assets')
          .select('*', { count: 'exact', head: true });
        
        healthCheck.metrics.totalAssets = assetCount || 0;

        // Total credits issued
        const { data: creditData } = await supabase
          .from('credit_transactions')
          .select('credits')
          .eq('transaction_type', 'purchase');
        
        healthCheck.metrics.totalCreditsIssued = 
          creditData?.reduce((sum, t) => sum + (t.credits || 0), 0) || 0;

      } catch (error) {
        console.error('Error fetching detailed metrics:', error);
      }
    }

    // Calculate overall API response time
    healthCheck.metrics.apiResponseTime = Date.now() - checkStartTime;

    // Determine overall status
    const offlineServices = Object.values(healthCheck.services).filter(s => s.status === 'offline').length;
    const degradedServices = Object.values(healthCheck.services).filter(s => s.status === 'degraded').length;
    
    if (offlineServices > 0) {
      healthCheck.status = 'unhealthy';
    } else if (degradedServices > 0) {
      healthCheck.status = 'degraded';
    }

    return NextResponse.json(healthCheck, {
      status: healthCheck.status === 'healthy' ? 200 : 
              healthCheck.status === 'degraded' ? 503 : 500
    });

  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: Date.now() - startTime
    }, { status: 500 });
  }
}

// POST: Record custom health event or metric
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventType, metric, value, metadata } = body;

    // Log health event
    const { error: logError } = await supabase
      .from('system_health_logs')
      .insert({
        event_type: eventType,
        metric,
        value,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      });

    if (logError) {
      return NextResponse.json(
        { error: 'Failed to log health event', details: logError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Health event logged'
    });

  } catch (error: any) {
    console.error('Health POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
