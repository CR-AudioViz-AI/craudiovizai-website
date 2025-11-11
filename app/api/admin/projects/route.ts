/**
 * CR AudioViz AI - Projects Management API
 * Admin oversight of all user projects across platform
 * @timestamp October 24, 2025 - 6:05 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export const dynamic = 'force-dynamic';

interface Project {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'private' | 'public';
  content: any;
  metadata: any;
  views: number;
  likes: number;
  credits_used: number;
  created_at: string;
  updated_at: string;
}

// GET - List all projects with filters
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
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const visibility = searchParams.get('visibility');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('projects')
      .select(`
        *,
        user:profiles(id, email, full_name)
      `, { count: 'exact' });

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (visibility) {
      query = query.eq('visibility', visibility);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: projects, error, count } = await query;

    if (error) throw error;

    // Format response
    const formattedProjects: Project[] = (projects || []).map(p => ({
      id: p.id,
      user_id: p.user_id,
      user_email: p.user?.email || 'Unknown',
      title: p.title || 'Untitled Project',
      type: p.type,
      status: p.status || 'draft',
      visibility: p.visibility || 'private',
      content: p.content,
      metadata: p.metadata,
      views: p.views || 0,
      likes: p.likes || 0,
      credits_used: p.credits_used || 0,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));

    // Get summary statistics
    const { data: allProjects } = await supabase
      .from('projects')
      .select('type, status, created_at');

    const summary = {
      total_projects: allProjects?.length || 0,
      draft_projects: allProjects?.filter(p => p.status === 'draft').length || 0,
      published_projects: allProjects?.filter(p => p.status === 'published').length || 0,
      archived_projects: allProjects?.filter(p => p.status === 'archived').length || 0,
      projects_by_type: (allProjects || []).reduce((acc: number, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      projects_today: allProjects?.filter(p => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(p.created_at) >= today;
      }).length || 0
    };

    return NextResponse.json({
      success: true,
      data: formattedProjects,
      summary,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    logError('Projects management error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update project (change status, visibility)
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
    
    if (!body.project_id) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (body.status !== undefined) updates.status = body.status;
    if (body.visibility !== undefined) updates.visibility = body.visibility;
    if (body.title !== undefined) updates.title = body.title;

    // Update project
    const { error: updateError } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', body.project_id);

    if (updateError) throw updateError;

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: 'project_updated',
        details: {
          project_id: body.project_id,
          updates: updates
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully'
    });

  } catch (error: unknown) {
    logError('Update project error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
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
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    // Delete project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) throw deleteError;

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action: 'project_deleted',
        details: {
          project_id: projectId,
          reason: searchParams.get('reason') || 'No reason provided'
        },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error: unknown) {
    logError('Delete project error:\', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
