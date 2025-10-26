import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JavariProject } from '@/lib/javari-types';

/**
 * GET /api/javari/projects
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (projectId) {
      const { data, error } = await supabase
        .from('javari_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }

      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await supabase
      .from('javari_projects')
      .select('*')
      .order('created_at', { ascending: false });

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
 * POST /api/javari/projects
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.name || !body.display_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, display_name' },
        { status: 400 }
      );
    }

    const projectData: Partial<JavariProject> = {
      name: body.name,
      display_name: body.display_name,
      type: body.type || 'main',
      description: body.description,
      github_org: body.github_org,
      github_repo: body.github_repo,
      vercel_project: body.vercel_project,
      credentials_snapshot: body.credentials_snapshot,
      health_score: 100,
      active_chats_count: 0,
      total_chats_count: 0,
      starred: false
    };

    const { data, error } = await supabase
      .from('javari_projects')
      .insert(projectData)
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
 * PATCH /api/javari/projects
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing required field: id' }, { status: 400 });
    }

    const updateData: Partial<JavariProject> = { updated_at: new Date().toISOString() };
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.display_name !== undefined) updateData.display_name = body.display_name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.github_org !== undefined) updateData.github_org = body.github_org;
    if (body.github_repo !== undefined) updateData.github_repo = body.github_repo;
    if (body.vercel_project !== undefined) updateData.vercel_project = body.vercel_project;
    if (body.health_score !== undefined) updateData.health_score = body.health_score;
    if (body.starred !== undefined) updateData.starred = body.starred;

    const { data, error } = await supabase
      .from('javari_projects')
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
 * DELETE /api/javari/projects
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Missing required parameter: id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('javari_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted' });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
