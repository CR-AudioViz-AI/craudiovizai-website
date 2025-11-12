import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/documentation/tickets - List tickets
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const ticketId = searchParams.get('id')

    // Get single ticket with comments
    if (ticketId) {
      const { data: ticket, error } = await supabase
        .from('doc_tickets')
        .select(`
          *,
          related_doc:related_doc_id(id, title, category),
          assigned_user:assigned_to(id, email),
          creator:user_id(id, email)
        `)
        .eq('id', ticketId)
        .single()

      if (error) throw error

      // Check authorization
      if (ticket.user_id !== session.user.id && ticket.assigned_to !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      // Get comments
      const { data: comments, error: commentsError } = await supabase
        .from('doc_ticket_comments')
        .select(`
          *,
          user:user_id(id, email)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (commentsError) throw commentsError

      return NextResponse.json({
        ticket: {
          ...ticket,
          comments
        }
      })
    }

    // List tickets (user's tickets + assigned tickets)
    let query = supabase
      .from('doc_tickets')
      .select(`
        *,
        related_doc:related_doc_id(id, title, category),
        assigned_user:assigned_to(id, email)
      `)
      .or(`user_id.eq.${session.user.id},assigned_to.eq.${session.user.id}`)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    const { data: tickets, error } = await query.limit(50)

    if (error) throw error

    // Get comment counts for each ticket
    const ticketIds = tickets?.map(t => t.id) || []
    const { data: commentCounts } = await supabase
      .from('doc_ticket_comments')
      .select('ticket_id')
      .in('ticket_id', ticketIds)

    const countMap = new Map<string, number>()
    commentCounts?.forEach(c => {
      countMap.set(c.ticket_id, (countMap.get(c.ticket_id) || 0) + 1)
    })

    const enrichedTickets = tickets?.map(t => ({
      ...t,
      comment_count: countMap.get(t.id) || 0
    }))

    return NextResponse.json({ tickets: enrichedTickets })

  } catch (error: any) {
    console.error('Tickets GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST /api/documentation/tickets - Create ticket or add comment
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ticket_id, comment, ...ticketData } = body

    // Add comment to existing ticket
    if (action === 'comment' && ticket_id) {
      if (!comment || comment.trim().length === 0) {
        return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
      }

      // Verify user has access to ticket
      const { data: ticket } = await supabase
        .from('doc_tickets')
        .select('user_id, assigned_to')
        .eq('id', ticket_id)
        .single()

      if (!ticket || (ticket.user_id !== session.user.id && ticket.assigned_to !== session.user.id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      const { data, error } = await supabase
        .from('doc_ticket_comments')
        .insert({
          ticket_id,
          user_id: session.user.id,
          comment,
          is_internal: body.is_internal || false
        })
        .select(`
          *,
          user:user_id(id, email)
        `)
        .single()

      if (error) throw error

      // Update ticket's updated_at
      await supabase
        .from('doc_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticket_id)

      return NextResponse.json({ comment: data })
    }

    // Create new ticket
    const { title, description, type, priority, related_doc_id } = ticketData

    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Title, description, and type are required' },
        { status: 400 }
      )
    }

    const validTypes = ['bug', 'missing', 'unclear', 'outdated', 'feature_request']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      )
    }

    const { data: ticket, error } = await supabase
      .from('doc_tickets')
      .insert({
        user_id: session.user.id,
        title,
        description,
        type,
        priority: priority || 'medium',
        related_doc_id,
        status: 'open'
      })
      .select(`
        *,
        related_doc:related_doc_id(id, title, category)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ ticket }, { status: 201 })

  } catch (error: any) {
    console.error('Tickets POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create ticket or comment' },
      { status: 500 }
    )
  }
}

// PATCH /api/documentation/tickets - Update ticket
export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 })
    }

    // Get ticket to check authorization
    const { data: ticket } = await supabase
      .from('doc_tickets')
      .select('user_id, assigned_to')
      .eq('id', id)
      .single()

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Only ticket creator or assignee can update
    if (ticket.user_id !== session.user.id && ticket.assigned_to !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Handle resolution
    if (updates.status === 'resolved' || updates.status === 'closed') {
      updates.resolved_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('doc_tickets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        related_doc:related_doc_id(id, title, category),
        assigned_user:assigned_to(id, email)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ ticket: data })

  } catch (error: any) {
    console.error('Tickets PATCH error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

// DELETE /api/documentation/tickets - Delete ticket (creator or admin only)
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 })
    }

    // Get ticket to check authorization
    const { data: ticket } = await supabase
      .from('doc_tickets')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Only ticket creator can delete
    if (ticket.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('doc_tickets')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Tickets DELETE error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete ticket' },
      { status: 500 }
    )
  }
}
