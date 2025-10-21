import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json()

    if (action === 'signup') {
      // Sign up new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      // Create user profile with 1000 free credits
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email,
          name,
          credits: 1000,
          plan: 'Free',
          role: 'customer',
        })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        user: authData.user,
        message: 'Account created successfully! Welcome to CR AudioViz AI.',
      })
    }

    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id)

      return NextResponse.json({
        success: true,
        user: data.user,
        session: data.session,
      })
    }

    if (action === 'logout') {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
