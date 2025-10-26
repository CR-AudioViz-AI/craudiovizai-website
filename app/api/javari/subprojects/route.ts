/**
 * Javari AI - Subprojects Management API
 * Complete CRUD operations for subprojects with credential inheritance
 * Route: /api/javari/subprojects
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { 
  JavariSubProject, 
  CreateSubProjectRequest, 
  UpdateSubProjectRequest 
} from '@/lib/javari-types';

export const runtime = 'nodejs';

/**
 * GET /api/javari/subprojects
 * List all subprojects or get a specific subproject
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const subprojectId = searchParams.get('id');
    const parentProjectId = searchParams.get('parent_id');

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get specific subproject
    if (subprojectId) {
      const { data: subproject, error } = await supabase
        .from('javari_sub_projects')
        .select(`
          *,
          parent_project:javari_projects (
            id,
            name,
            display_name,
            credentials
          )
        `)
        .eq('id', subprojectId)
        .single();

      if (error) {
        console.error('Error fetching subproject:', error);
        return NextResponse.json({ error: 'Subproject not found' }, { status: 404 });
      }

      // Merge parent credentials with overrides
      const inheritedCredentials = {
        ...subproject.parent_project?.credentials,
        ...subproject.credential_overrides
      };

      return NextResponse.json({ 
        subproject: {
          ...subproject,
          effective_credentials: inheritedCredentials
        }
      });
    }

    // List subprojects
    let query = supabase
      .from('javari_sub_projects')
      .select(`
        *,
        parent_project:javari_projects (
          id,
          name,
          display_name
        )
      `)
      .order('created_at', { ascending: false });

    if (parentProjectId) {
      query = query.eq('parent_project_id', parentProjectId);
    }

    const { data: subprojects, error } = await query;

    if (error) {
      console.error('Error fetching subprojects:', error);
      return NextResponse.json({ error: 'Failed to fetch subprojects' }, { status: 500 });
    }

    return NextResponse.json({ subprojects: subprojects || [] });

  } catch (error) {
    console.error('Error in subprojects GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/javari/subprojects
 * Create a new subproject under a parent project
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateSubProjectRequest = await request.json();
    const {
      parent_project_id,
      name,
      display_name,
      github_repo,
      vercel_project,
      credential_overrides,
      description
    } = body;

    // Validate required fields
    if (!parent_project_id || !name || !display_name) {
      return NextResponse.json(
        { error: 'Missing required fields: parent_project_id, name, display_name' },
        { status: 400 }
      );
    }

    // Verify parent project exists
    const { data: parentProject, error: parentError } = await supabase
      .from('javari_projects')
      .select('id, credentials')
      .eq('id', parent_project_id)
      .single();

    if (parentError || !parentProject) {
      return NextResponse.json(
        { error: 'Parent project not found' },
        { status: 404 }
      );
    }

    // Create subproject
    const { data: subproject, error } = await supabase
      .from('javari_sub_projects')
      .insert({
        parent_project_id,
        name,
        display_name,
        github_repo,
        vercel_project,
        credential_overrides: credential_overrides || {},
        description,
        health_score: 100, // Start at 100
        status: 'active',
        settings: {},
        metadata: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subproject:', error);
      return NextResponse.json(
        { error: 'Failed to create subproject' },
        { status: 500 }
      );
    }

    // Return with effective credentials (inherited + overrides)
    const effectiveCredentials = {
      ...parentProject.credentials,
      ...subproject.credential_overrides
    };

    return NextResponse.json({ 
      subproject: {
        ...subproject,
        effective_credentials: effectiveCredentials
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in subprojects POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateSubProjectRequest = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subproject ID required' },
        { status: 400 }
      );
    }

    // Update subproject
    const { data: subproject, error } = await supabase
      .from('javari_sub_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        parent_project:javari_projects (
          credentials
        )
      `)
      .single();

    if (error) {
      console.error('Error updating subproject:', error);
      return NextResponse.json(
        { error: 'Failed to update subproject' },
        { status: 500 }
      );
    }

    // Return with effective credentials
    const effectiveCredentials = {
      ...subproject.parent_project?.credentials,
      ...subproject.credential_overrides
    };

    return NextResponse.json({ 
      subproject: {
        ...subproject,
        effective_credentials: effectiveCredentials
      }
    });

  } catch (error) {
    console.error('Error in subprojects PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const searchParams = request.nextUrl.searchParams;
    const subprojectId = searchParams.get('id');
    const hardDelete = searchParams.get('hard') === 'true';

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!subprojectId) {
      return NextResponse.json(
        { error: 'Subproject ID required' },
        { status: 400 }
      );
    }

    if (hardDelete) {
      // Hard delete - permanently remove
      const { error } = await supabase
        .from('javari_sub_projects')
        .delete()
        .eq('id', subprojectId);

      if (error) {
        console.error('Error deleting subproject:', error);
        return NextResponse.json(
          { error: 'Failed to delete subproject' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: 'Subproject permanently deleted' 
      });
    } else {
      // Soft delete - archive
      const { data: subproject, error } = await supabase
        .from('javari_sub_projects')
        .update({
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', subprojectId)
        .select()
        .single();

      if (error) {
        console.error('Error archiving subproject:', error);
        return NextResponse.json(
          { error: 'Failed to archive subproject' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: 'Subproject archived',
        subproject 
      });
    }

  } catch (error) {
    console.error('Error in subprojects DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
