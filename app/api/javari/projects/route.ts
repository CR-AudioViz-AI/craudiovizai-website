/**
 * Javari AI - Projects Management API
 * Complete CRUD operations for main projects
 * Route: /api/javari/projects
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { 
  JavariProject, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '@/lib/javari-types';

export const runtime = 'nodejs';

/**
 * GET /api/javari/projects
 * List all projects or get a specific project
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('id');
    const organizationId = searchParams.get('organization_id');

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get specific project
    if (projectId) {
      const { data: project, error } = await supabase
        .from('javari_projects')
        .select(`
          *,
          javari_sub_projects (
            id,
            name,
            display_name,
            github_repo,
            health_score,
            status,
            last_deploy_at
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json({ project });
    }

    // List all projects
    let query = supabase
      .from('javari_projects')
      .select(`
        *,
        javari_sub_projects (count)
      `)
      .order('created_at', { ascending: false });

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({ projects: projects || [] });

  } catch (error) {
    console.error('Error in projects GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/projects
 * Create a new main project
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateProjectRequest = await request.json();
    const {
      name,
      display_name,
      type,
      github_org,
      github_repo,
      vercel_project,
      organization_id,
      credentials,
      description
    } = body;

    // Validate required fields
    if (!name || !display_name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, display_name, type' },
        { status: 400 }
      );
    }

    // Create project
    const { data: project, error } = await supabase
      .from('javari_projects')
      .insert({
        name,
        display_name,
        type,
        github_org,
        github_repo,
        vercel_project,
        organization_id,
        credentials: credentials || {},
        description,
        health_score: 100, // Start at 100
        status: 'active',
        settings: {},
        metadata: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project }, { status: 201 });

  } catch (error) {
    console.error('Error in projects POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/javari/projects
 * Update an existing project
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateProjectRequest = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    // Update project
    const { data: project, error } = await supabase
      .from('javari_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project });

  } catch (error) {
    console.error('Error in projects PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/javari/projects
 * Delete a project (soft delete by setting status to 'archived')
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('id');
    const hardDelete = searchParams.get('hard') === 'true';

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    if (hardDelete) {
      // Hard delete - permanently remove
      const { error } = await supabase
        .from('javari_projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
          { error: 'Failed to delete project' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: 'Project permanently deleted' 
      });
    } else {
      // Soft delete - archive
      const { data: project, error } = await supabase
        .from('javari_projects')
        .update({
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('Error archiving project:', error);
        return NextResponse.json(
          { error: 'Failed to archive project' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: 'Project archived',
        project 
      });
    }

  } catch (error) {
    console.error('Error in projects DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
