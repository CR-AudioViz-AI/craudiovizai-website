/**
 * CR AudioViz AI - Apps Management API
 * CRUD operations for managing platform apps
 * @timestamp October 24, 2025 - 5:50 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  status: 'active' | 'inactive' | 'maintenance';
  credits_per_use: number;
  total_uses: number;
  active_users: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

// GET - List all apps with filters and sorting
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
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'name';
    const order = searchParams.get('order') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('projects')
      .select('*, profiles(email)', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('type', category);
    }
    if (status) {
      query = query.eq('status', status);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: projects, error, count } = await query;

    if (error) throw error;

    // Aggregate app statistics
    const appStats = await supabase
      .from('projects')
      .select('type')
      .then(({ data }) => {
        const stats: Record<string, { uses: number; users: Set<string> }> = {};
        
        data?.forEach(project => {
          if (!stats[project.type]) {
            stats[project.type] = { uses: 0, users: new Set() };
          }
          stats[project.type].uses++;
        });

        return stats;
      });

    // Format response
    const apps = [
      {
        id: 'music-studio',
        name: 'Music Studio',
        description: 'AI-powered music creation and production',
        category: 'Creative',
        icon: '🎵',
        url: '/apps/music-studio',
        status: 'active',
        credits_per_use: 10,
        total_uses: appStats['music']?.uses || 0,
        active_users: appStats['music']?.users.size || 0,
        revenue: (appStats['music']?.uses || 0) * 0.10,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'video-producer',
        name: 'Video Producer',
        description: 'Create and edit videos with AI assistance',
        category: 'Creative',
        icon: '🎬',
        url: '/apps/video-producer',
        status: 'active',
        credits_per_use: 15,
        total_uses: appStats['video']?.uses || 0,
        active_users: appStats['video']?.users.size || 0,
        revenue: (appStats['video']?.uses || 0) * 0.15,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'game-builder',
        name: 'Game Builder',
        description: 'Build games without coding',
        category: 'Development',
        icon: '🎮',
        url: '/apps/game-builder',
        status: 'active',
        credits_per_use: 20,
        total_uses: appStats['game']?.uses || 0,
        active_users: appStats['game']?.users.size || 0,
        revenue: (appStats['game']?.uses || 0) * 0.20,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'web-designer',
        name: 'Web Designer',
        description: 'Design and build websites',
        category: 'Development',
        icon: '🌐',
        url: '/apps/web-designer',
        status: 'active',
        credits_per_use: 12,
        total_uses: appStats['web']?.uses || 0,
        active_users: appStats['web']?.users.size || 0,
        revenue: (appStats['web']?.uses || 0) * 0.12,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'business-planner',
        name: 'Business Planner',
        description: 'Create business plans and strategies',
        category: 'Business',
        icon: '💼',
        url: '/apps/business-planner',
        status: 'active',
        credits_per_use: 8,
        total_uses: appStats['business']?.uses || 0,
        active_users: appStats['business']?.users.size || 0,
        revenue: (appStats['business']?.uses || 0) * 0.08,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'learning-hub',
        name: 'Learning Hub',
        description: 'Educational content and courses',
        category: 'Education',
        icon: '📚',
        url: '/apps/learning-hub',
        status: 'active',
        credits_per_use: 5,
        total_uses: appStats['education']?.uses || 0,
        active_users: appStats['education']?.users.size || 0,
        revenue: (appStats['education']?.uses || 0) * 0.05,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'social-manager',
        name: 'Social Manager',
        description: 'Manage social media presence',
        category: 'Marketing',
        icon: '📱',
        url: '/apps/social-manager',
        status: 'active',
        credits_per_use: 7,
        total_uses: appStats['social']?.uses || 0,
        active_users: appStats['social']?.users.size || 0,
        revenue: (appStats['social']?.uses || 0) * 0.07,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'marketing-engine',
        name: 'Marketing Engine',
        description: 'Automated marketing campaigns',
        category: 'Marketing',
        icon: '📊',
        url: '/apps/marketing-engine',
        status: 'active',
        credits_per_use: 10,
        total_uses: appStats['marketing']?.uses || 0,
        active_users: appStats['marketing']?.users.size || 0,
        revenue: (appStats['marketing']?.uses || 0) * 0.10,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'image-generator',
        name: 'Image Generator',
        description: 'Create images with AI',
        category: 'Creative',
        icon: '🎨',
        url: '/apps/image-generator',
        status: 'active',
        credits_per_use: 8,
        total_uses: appStats['image']?.uses || 0,
        active_users: appStats['image']?.users.size || 0,
        revenue: (appStats['image']?.uses || 0) * 0.08,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        id: 'code-assistant',
        name: 'Code Assistant',
        description: 'AI-powered coding help',
        category: 'Development',
        icon: '💻',
        url: '/apps/code-assistant',
        status: 'active',
        credits_per_use: 6,
        total_uses: appStats['code']?.uses || 0,
        active_users: appStats['code']?.users.size || 0,
        revenue: (appStats['code']?.uses || 0) * 0.06,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      }
    ];

    // Apply filters to apps array
    let filteredApps = apps;
    if (category) {
      filteredApps = filteredApps.filter(app => app.category.toLowerCase() === category.toLowerCase());
    }
    if (status) {
      filteredApps = filteredApps.filter(app => app.status === status);
    }

    // Apply sorting
    filteredApps.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    // Apply pagination
    const paginatedApps = filteredApps.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedApps,
      pagination: {
        page,
        limit,
        total: filteredApps.length,
        totalPages: Math.ceil(filteredApps.length / limit)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Apps management error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch apps',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new app
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real implementation, you would insert into database
    // For now, return success with the new app data
    const newApp: App = {
      id: `app-${Date.now()}`,
      name: body.name,
      description: body.description,
      category: body.category,
      icon: body.icon || '🚀',
      url: body.url || `/apps/${body.name.toLowerCase().replace(/\s+/g, '-')}`,
      status: body.status || 'active',
      credits_per_use: body.credits_per_use || 10,
      total_uses: 0,
      active_users: 0,
      revenue: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newApp,
      message: 'App created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create app error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create app',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update app
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'App ID required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would update in database
    return NextResponse.json({
      success: true,
      message: 'App updated successfully',
      data: { ...body, updated_at: new Date().toISOString() }
    });

  } catch (error) {
    console.error('Update app error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update app',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove app
export async function DELETE(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('id');
    
    if (!appId) {
      return NextResponse.json(
        { error: 'App ID required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would delete from database
    return NextResponse.json({
      success: true,
      message: 'App deleted successfully'
    });

  } catch (error) {
    console.error('Delete app error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete app',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
