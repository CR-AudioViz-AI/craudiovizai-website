import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/documentation - Search and retrieve documentation
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const repo = searchParams.get('repo')
    const id = searchParams.get('id')
    const contextKey = searchParams.get('context')

    const supabase = createRouteHandlerClient({ cookies })

    // Get single doc by ID
    if (id) {
      const { data, error } = await supabase
        .from('documentation')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Track analytics
      await supabase.from('doc_analytics').insert({
        doc_id: id,
        event_type: 'view',
        session_id: request.headers.get('x-session-id')
      })

      return NextResponse.json({ doc: data })
    }

    // Get docs for a specific context
    if (contextKey) {
      const { data: context, error: contextError } = await supabase
        .from('help_contexts')
        .select('*, related_docs')
        .eq('context_key', contextKey)
        .single()

      if (contextError) throw contextError

      if (context.related_docs && context.related_docs.length > 0) {
        const { data: docs, error: docsError } = await supabase
          .from('documentation')
          .select('id, title, category, subcategory, content')
          .in('id', context.related_docs)

        if (docsError) throw docsError

        return NextResponse.json({
          context,
          docs: docs?.map(doc => ({
            ...doc,
            content: doc.content.substring(0, 300) + '...'
          }))
        })
      }

      return NextResponse.json({ context, docs: [] })
    }

    // Full-text search
    if (query) {
      const { data, error } = await supabase.rpc('search_documentation', {
        search_query: query,
        category_filter: category,
        limit_results: 20
      })

      if (error) throw error

      // Track search analytics
      await supabase.from('doc_analytics').insert({
        event_type: 'search',
        context: { query, category },
        session_id: request.headers.get('x-session-id')
      })

      return NextResponse.json({ results: data })
    }

    // List all docs with filters
    let queryBuilder = supabase
      .from('documentation')
      .select('id, title, category, subcategory, repo_name, file_path, updated_at, tags')
      .order('updated_at', { ascending: false })

    if (category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    if (repo) {
      queryBuilder = queryBuilder.eq('repo_name', repo)
    }

    const { data, error } = await queryBuilder.limit(50)

    if (error) throw error

    return NextResponse.json({ docs: data })

  } catch (error: any) {
    console.error('Documentation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch documentation' },
      { status: 500 }
    )
  }
}

// POST /api/documentation - Create or update documentation
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      repo_name,
      file_path,
      title,
      content,
      category,
      subcategory,
      tags,
      github_sha
    } = body

    // Validate required fields
    if (!repo_name || !file_path || !title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if doc exists
    const { data: existing } = await supabase
      .from('documentation')
      .select('id, version')
      .eq('repo_name', repo_name)
      .eq('file_path', file_path)
      .single()

    if (existing) {
      // Update existing doc
      const newVersion = existing.version + 1

      // Save current version to history
      const { data: currentDoc } = await supabase
        .from('documentation')
        .select('content, github_sha')
        .eq('id', existing.id)
        .single()

      if (currentDoc) {
        await supabase.from('documentation_versions').insert({
          doc_id: existing.id,
          version: existing.version,
          content: currentDoc.content,
          github_sha: currentDoc.github_sha,
          changed_by: session.user.id
        })
      }

      // Update main doc
      const { data, error } = await supabase
        .from('documentation')
        .update({
          title,
          content,
          category,
          subcategory,
          tags,
          github_sha,
          version: newVersion,
          updated_at: new Date().toISOString(),
          updated_by: session.user.id,
          last_synced_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ doc: data, action: 'updated' })

    } else {
      // Create new doc
      const { data, error } = await supabase
        .from('documentation')
        .insert({
          repo_name,
          file_path,
          title,
          content,
          category,
          subcategory,
          tags,
          github_sha,
          version: 1,
          created_by: session.user.id,
          updated_by: session.user.id,
          last_synced_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ doc: data, action: 'created' }, { status: 201 })
    }

  } catch (error: any) {
    console.error('Documentation create/update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save documentation' },
      { status: 500 }
    )
  }
}

// DELETE /api/documentation - Delete documentation
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing doc ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('documentation')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Documentation deleted' })

  } catch (error: any) {
    console.error('Documentation delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete documentation' },
      { status: 500 }
    )
  }
}

// PATCH /api/documentation - Update doc metadata or mark as helpful
export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const body = await request.json()
    const { id, action, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing doc ID' }, { status: 400 })
    }

    // Track helpful/unhelpful feedback
    if (action === 'helpful' || action === 'unhelpful') {
      await supabase.from('doc_analytics').insert({
        doc_id: id,
        event_type: action,
        session_id: request.headers.get('x-session-id')
      })

      return NextResponse.json({ success: true })
    }

    // Update metadata (requires authentication)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('documentation')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ doc: data })

  } catch (error: any) {
    console.error('Documentation patch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update documentation' },
      { status: 500 }
    )
  }
}
