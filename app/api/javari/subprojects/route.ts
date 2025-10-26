import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  JavariSubProject, 
  CreateSubProjectRequest, 
  UpdateSubProjectRequest 
} from '@/lib/javari-types';

/**
 * GET /api/javari/subprojects
 * List all subprojects or get a specific subproject by ID
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const subprojectId = searchParams.get('id');
    const projectId = searchParams.get('projectId');

    // Get specific subproject by ID
    if (subprojectId) {
      const { data, error } = await supabase
        .from('javari_sub_projects')
        .select('*')
        .eq('id', subprojectId)
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

    // List subprojects (optionally filtered by project)
    let query = supabase
      .from('javari_sub_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
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
    console.error('GET /api/javari/subprojects error:', error);
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
 * POST /api/javari/subprojects
 * Create a new subproject
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: CreateSubProjectRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.project_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, project_id' },
        { status: 400 }
      );
    }

    // Verify parent project exists
    const { data: project, error: projectError } = await supabase
      .from('javari_projects')
      .select('id')
      .eq('id', body.project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Parent project not found' },
        { status: 404 }
      );
    }

    // Create subproject
    const subprojectData: Partial<JavariSubProject> = {
      project_id: body.project_id,
      name: body.name,
      description: body.description || null,
      type: body.type || 'feature',
      status: body.status || 'active',
      priority: body.priority || 'medium',
      estimated_hours: body.estimated_hours || null,
      actual_hours: body.actual_hours || 0,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      completion_percentage: body.completion_percentage || 0,
      total_sessions: 0,
      total_work_logs: 0,
      total_tokens_used: 0,
      total_cost: 0,
      metadata: body.metadata || {}
    };

    const { data, error } = await supabase
      .from('javari_sub_projects')
      .insert(subprojectData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Update parent project subproject count
    await supabase.rpc('increment_project_subprojects', { 
      project_id: body.project_id 
    }).catch(() => {
      // If RPC doesn't exist, do manual update
      supabase
        .from('javari_projects')
        .update({ 
          total_subprojects: supabase.raw('total_subprojects + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', body.project_id)
        .then(() => {});
    });

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/javari/subprojects error:', error);
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
 * PATCH /api/javari/subprojects
 * Update an existing subproject
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: UpdateSubProjectRequest = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Build update object (only include provided fields)
    const updateData: Partial<JavariSubProject> = {
      updated_at: new Date().toISOString()
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.estimated_hours !== undefined) updateData.estimated_hours = body.estimated_hours;
    if (body.actual_hours !== undefined) updateData.actual_hours = body.actual_hours;
    if (body.start_date !== undefined) updateData.start_date = body.start_date;
    if (body.end_date !== undefined) updateData.end_date = body.end_date;
    if (body.completion_percentage !== undefined) updateData.completion_percentage = body.completion_percentage;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    // Update subproject
    const { data, error } = await supabase
      .from('javari_sub_projects')
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
    console.error('PATCH /api/javari/subprojects error:', error);
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
 * DELETE /api/javari/subprojects
 * Delete a subproject (soft delete by setting status to 'archived')
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const subprojectId = searchParams.get('id');
    const hardDelete = searchParams.get('hard') === 'true';

    if (!subprojectId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Get subproject to find parent project
    const { data: subproject } = await supabase
      .from('javari_sub_projects')
      .select('project_id')
      .eq('id', subprojectId)
      .single();

    if (hardDelete) {
      // Hard delete - permanently remove from database
      const { error } = await supabase
        .from('javari_sub_projects')
        .delete()
        .eq('id', subprojectId);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      // Update parent project subproject count
      if (subproject) {
        await supabase.rpc('decrement_project_subprojects', { 
          project_id: subproject.project_id 
        }).catch(() => {
          // If RPC doesn't exist, do manual update
          supabase
            .from('javari_projects')
            .update({ 
              total_subprojects: supabase.raw('GREATEST(total_subprojects - 1, 0)'),
              updated_at: new Date().toISOString()
            })
            .eq('id', subproject.project_id)
            .then(() => {});
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Subproject permanently deleted'
      });
    } else {
      // Soft delete - archive the subproject
      const { data, error } = await supabase
        .from('javari_sub_projects')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', subprojectId)
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
        message: 'Subproject archived'
      });
    }

  } catch (error) {
    console.error('DELETE /api/javari/subprojects error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
