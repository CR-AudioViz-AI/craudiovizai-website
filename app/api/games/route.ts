// CR AudioViz AI - Games API
// Session: 2025-10-25 Phase 5 Build
// Route: /api/games/route.ts
// Provides access to 1,065+ game library

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const featured = searchParams.get('featured')

    // Build query
    let query = supabase
      .from('games')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('title', { ascending: true })

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: games, error, count } = await query

    if (error) {
      console.error('Games query error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      games: games || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Games API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games', details: error.message },
      { status: 500 }
    )
  }
}

// POST: Track game play
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()
    const { game_id, action } = body

    if (action === 'play') {
      // Track game play
      await supabase
        .from('game_plays')
        .upsert({
          user_id: userId,
          game_id,
          last_played_at: new Date().toISOString(),
          play_count: 1
        }, {
          onConflict: 'user_id,game_id',
          ignoreDuplicates: false
        })

      // Increment total plays counter
      await supabase.rpc('increment_game_plays', {
        p_game_id: game_id
      })

      return NextResponse.json({
        success: true,
        message: 'Game play tracked'
      })
    }

    if (action === 'favorite') {
      // Toggle favorite
      const { data: existing } = await supabase
        .from('game_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('game_id', game_id)
        .single()

      if (existing) {
        await supabase
          .from('game_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('game_id', game_id)

        return NextResponse.json({
          success: true,
          favorited: false
        })
      } else {
        await supabase
          .from('game_favorites')
          .insert({
            user_id: userId,
            game_id
          })

        return NextResponse.json({
          success: true,
          favorited: true
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Games POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
}
