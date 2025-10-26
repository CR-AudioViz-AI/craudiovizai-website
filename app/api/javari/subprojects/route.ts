import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JavariSubProject } from '@/lib/javari-types';

/**
 * GET /api/javari/subprojects
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const subprojectId = searchParams.get('id');
    const parentProjectId = searchParams.get('parentProjectId');

    if (subprojectId) {
      const { data, error } = await supabase
        .from('javari_sub_projects')
        .select('*')
        .eq('id', subprojectId)
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }

      return NextResponse.json({ success: true, data });
    }

    let query = supabase
      .from('javari_sub_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (parentProjectId) {
      query = query.eq('parent_project_id', parentProjectId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/subprojects
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.name || !body.display_name || !body.parent_project_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, display_name, parent_project_id' },
        { status: 400 }
      );
    }

    // Verify parent project exists
    const { data: project, error: projectError } = await supabase
      .from('javari_projects')
      .select('id')
      .eq('id', body.parent_project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ success: false, error: 'Parent project not found' }, { status: 404 });
    }

    const subprojectData: Partial<JavariSubProject> = {
      parent_project_id: body.parent_project_id,
      name: body.name,
      display_name: body.display_name,
      description: body.description,
      github_repo: body.github_repo,
      vercel_project: body.vercel_project,
      credential_overrides: body.credential_overrides,
      health_score: 100,
      active_chats_count: 0,
      starred: false
    };

    const { data, error } = await supabase
      .from('javari_sub_projects')
      .insert(subprojectData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/javari/subprojects
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing required field: id' }, { status: 400 });
    }

    const updateData: Partial<JavariSubProject> = { updated_at: new Date().toISOString() };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.display_name !== undefined) updateData.display_name = body.display_name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.github_repo !== undefined) updateData.github_repo = body.github_repo;
    if (body.vercel_project !== undefined) updateData.vercel_project = body.vercel_project;
    if (body.health_score !== undefined) updateData.health_score = body.health_score;
    if (body.starred !== undefined) updateData.starred = body.starred;

    const { data, error } = await supabase
      .from('javari_sub_projects')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/javari/subprojects
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const subprojectId = searchParams.get('id');

    if (!subprojectId) {
      return NextResponse.json({ success: false, error: 'Missing required parameter: id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('javari_sub_projects')
      .delete()
      .eq('id', subprojectId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subproject deleted' });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
