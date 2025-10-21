import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, userId, amount, description, metadata } = await request.json()

    if (action === 'deduct') {
      // Get current credits
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (user.credits < amount) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
      }

      const newBalance = user.credits - amount

      // Deduct credits
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ credits: newBalance })
        .eq('id', userId)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

      // Log transaction
      await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: 'usage',
          amount: -amount,
          balance_after: newBalance,
          description,
          metadata,
        })

      return NextResponse.json({
        success: true,
        newBalance,
        message: `${amount} credits deducted`,
      })
    }

    if (action === 'add') {
      // Get current credits
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const newBalance = user.credits + amount

      // Add credits
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ credits: newBalance })
        .eq('id', userId)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

      // Log transaction
      await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: metadata?.type || 'purchase',
          amount: amount,
          balance_after: newBalance,
          description,
          metadata,
        })

      return NextResponse.json({
        success: true,
        newBalance,
        message: `${amount} credits added`,
      })
    }

    if (action === 'refund') {
      // Automatic refund for platform errors
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const newBalance = user.credits + amount

      await supabaseAdmin
        .from('users')
        .update({ credits: newBalance })
        .eq('id', userId)

      await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: userId,
          type: 'refund',
          amount: amount,
          balance_after: newBalance,
          description: description || 'Automatic refund for platform error',
          metadata,
        })

      // Send notification
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'credit_refund',
          title: 'Credits Refunded',
          message: `We've automatically refunded ${amount} credits due to a platform error. We apologize for the inconvenience!`,
        })

      return NextResponse.json({
        success: true,
        newBalance,
        message: `${amount} credits refunded automatically`,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get current balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits, plan, credits_expiration')
      .eq('id', userId)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // Get transaction history
    const { data: transactions, error: transError } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (transError) {
      return NextResponse.json({ error: transError.message }, { status: 400 })
    }

    return NextResponse.json({
      balance: user.credits,
      plan: user.plan,
      expiration: user.credits_expiration,
      transactions,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
