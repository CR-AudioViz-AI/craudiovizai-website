import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  JavariProject, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '@/lib/javari-types';

/**
 * GET /api/javari/projects
 * List all projects or get a specific project by ID
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Get specific project by ID
    if (projectId) {
      const { data, error } = await supabase
        .from('javari_projects')
        .select('*')
        .eq('id', projectId)
        .single();

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
    }

    // List projects (optionally filtered by user)
    let query = supabase
      .from('javari_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

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

  } catch (error) {
    console.error('GET /api/javari/projects error:', error);
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
 * POST /api/javari/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: CreateProjectRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.user_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, user_id' },
        { status: 400 }
      );
    }

    // Create project
    const projectData: Partial<JavariProject> = {
      user_id: body.user_id,
      name: body.name,
      description: body.description || null,
      repository_url: body.repository_url || null,
      primary_language: body.primary_language || null,
      framework: body.framework || null,
      status: body.status || 'active',
      total_subprojects: 0,
      total_sessions: 0,
      total_work_logs: 0,
      total_tokens_used: 0,
      total_cost: 0,
      health_score: 100,
      last_health_check: new Date().toISOString(),
      metadata: body.metadata || {}
    };

    const { data, error } = await supabase
      .from('javari_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/javari/projects error:', error);
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
 * PATCH /api/javari/projects
 * Update an existing project
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: UpdateProjectRequest = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Build update object (only include provided fields)
    const updateData: Partial<JavariProject> = {
      updated_at: new Date().toISOString()
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.repository_url !== undefined) updateData.repository_url = body.repository_url;
    if (body.primary_language !== undefined) updateData.primary_language = body.primary_language;
    if (body.framework !== undefined) updateData.framework = body.framework;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.health_score !== undefined) updateData.health_score = body.health_score;
    if (body.last_health_check !== undefined) updateData.last_health_check = body.last_health_check;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    // Update project
    const { data, error } = await supabase
      .from('javari_projects')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('PATCH /api/javari/projects error:', error);
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
 * DELETE /api/javari/projects
 * Delete a project (soft delete by setting status to 'archived')
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    const hardDelete = searchParams.get('hard') === 'true';

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    if (hardDelete) {
      // Hard delete - permanently remove from database
      const { error } = await supabase
        .from('javari_projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Project permanently deleted'
      });
    } else {
      // Soft delete - archive the project
      const { data, error } = await supabase
        .from('javari_projects')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: 'Project archived'
      });
    }

  } catch (error) {
    console.error('DELETE /api/javari/projects error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
