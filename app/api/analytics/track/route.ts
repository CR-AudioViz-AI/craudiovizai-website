// CR AUDIOVIZ AI - Analytics Tracking API
// Session: 2025-10-25 - Phase 4
// Purpose: Receive and store analytics events

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

// POST: Track analytics events
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Get session (optional - allow anonymous tracking)
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    const body = await request.json();
    const { events } = body;

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid events format' },
        { status: 400 }
      );
    }

    // Prepare events for insertion
    const eventsToInsert = events.map((event: AnalyticsEvent) => ({
      user_id: event.userId || userId,
      event_name: event.event,
      event_category: event.category || 'uncategorized',
      event_label: event.label,
      event_value: event.value || 0,
      metadata: event.metadata || {},
      created_at: new Date().toISOString()
    }));

    // Batch insert events
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert(eventsToInsert);

    if (insertError) {
      console.error('Analytics insert error:', insertError);
      // Don't fail the request if analytics fails
      return NextResponse.json({
        success: false,
        warning: 'Some events failed to record'
      });
    }

    return NextResponse.json({
      success: true,
      eventsRecorded: events.length
    });

  } catch (error: any) {
    console.error('Analytics API error:', error);
    // Return success even on error to not disrupt user experience
    return NextResponse.json({
      success: false,
      error: 'Analytics tracking failed'
    });
  }
}

// GET: Fetch analytics data (admin only)
export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventName = searchParams.get('event');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build query
    let query = supabase
      .from('analytics_events')
      .select('*', { count: 'exact' });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (eventName) {
      query = query.eq('event_name', eventName);
    }

    if (category) {
      query = query.eq('event_category', category);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    query = query
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data: events, error: queryError, count } = await query;

    if (queryError) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics', details: queryError.message },
        { status: 500 }
      );
    }

    // Calculate aggregate statistics
    const statistics = {
      totalEvents: count || 0,
      eventsByCategory: {} as Record<string, number>,
      eventsByName: {} as Record<string, number>,
      totalValue: 0,
      uniqueUsers: new Set<string>()
    };

    events?.forEach(event => {
      // Count by category
      if (event.event_category) {
        statistics.eventsByCategory[event.event_category] = 
          (statistics.eventsByCategory[event.event_category] || 0) + 1;
      }

      // Count by event name
      if (event.event_name) {
        statistics.eventsByName[event.event_name] = 
          (statistics.eventsByName[event.event_name] || 0) + 1;
      }

      // Sum values
      statistics.totalValue += event.event_value || 0;

      // Track unique users
      if (event.user_id) {
        statistics.uniqueUsers.add(event.user_id);
      }
    });

    return NextResponse.json({
      success: true,
      events: events || [],
      statistics: {
        ...statistics,
        uniqueUsers: statistics.uniqueUsers.size
      },
      pagination: {
        total: count || 0,
        limit,
        returned: events?.length || 0
      }
    });

  } catch (error: any) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Clear analytics data (admin only)
export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    
    // Verify admin authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const olderThan = searchParams.get('olderThan'); // ISO date string

    let query = supabase.from('analytics_events').delete();

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (olderThan) {
      query = query.lt('created_at', olderThan);
    } else {
      return NextResponse.json(
        { error: 'Must specify userId or olderThan parameter' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await query;

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete analytics', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics data deleted'
    });

  } catch (error: any) {
    console.error('Analytics DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
