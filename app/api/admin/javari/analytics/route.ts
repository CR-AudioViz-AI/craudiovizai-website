import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET /api/admin/javari/analytics
 * Get Javari usage analytics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '7d'; // 7d, 30d, 90d, all

    // Calculate date filter
    let dateFilter = '';
    const now = new Date();
    if (timeRange === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = sevenDaysAgo.toISOString();
    } else if (timeRange === '30d') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = thirtyDaysAgo.toISOString();
    } else if (timeRange === '90d') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFilter = ninetyDaysAgo.toISOString();
    }

    // Get total conversations
    let conversationsQuery = supabase
      .from('javari_conversations')
      .select('*', { count: 'exact', head: true });
    
    if (dateFilter) {
      conversationsQuery = conversationsQuery.gte('created_at', dateFilter);
    }

    const { count: totalConversations } = await conversationsQuery;

    // Get total messages
    let messagesQuery = supabase
      .from('javari_messages')
      .select('*', { count: 'exact', head: true });
    
    if (dateFilter) {
      messagesQuery = messagesQuery.gte('created_at', dateFilter);
    }

    const { count: totalMessages } = await messagesQuery;

    // Get total credits spent
    let creditsQuery = supabase
      .from('credit_transactions')
      .select('amount')
      .eq('type', 'deduction')
      .like('description', '%Javari AI%');
    
    if (dateFilter) {
      creditsQuery = creditsQuery.gte('created_at', dateFilter);
    }

    const { data: creditTransactions } = await creditsQuery;
    
    const totalCreditsSpent = creditTransactions?.reduce(
      (sum, t) => sum + Math.abs(t.amount), 
      0
    ) || 0;

    // Get unique active users
    let usersQuery = supabase
      .from('javari_conversations')
      .select('user_id');
    
    if (dateFilter) {
      usersQuery = usersQuery.gte('created_at', dateFilter);
    }

    const { data: conversations } = await usersQuery;
    const uniqueUsers = new Set(conversations?.map(c => c.user_id) || []).size;

    // Get action breakdown
    const { data: actionBreakdown } = await supabase
      .from('credit_transactions')
      .select('description, amount')
      .eq('type', 'deduction')
      .like('description', '%Javari AI%')
      .gte('created_at', dateFilter || '2000-01-01');

    const actionStats: Record<string, { count: number; credits: number }> = {};
    
    actionBreakdown?.forEach(transaction => {
      const action = transaction.description.replace('Javari AI: ', '');
      if (!actionStats[action]) {
        actionStats[action] = { count: 0, credits: 0 };
      }
      actionStats[action].count++;
      actionStats[action].credits += Math.abs(transaction.amount);
    });

    // Get daily usage trend
    const { data: dailyUsage } = await supabase
      .from('credit_transactions')
      .select('created_at, amount')
      .eq('type', 'deduction')
      .like('description', '%Javari AI%')
      .gte('created_at', dateFilter || '2000-01-01')
      .order('created_at', { ascending: true });

    const dailyStats: Record<string, number> = {};
    dailyUsage?.forEach(transaction => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + Math.abs(transaction.amount);
    });

    const chartData = Object.entries(dailyStats).map(([date, credits]) => ({
      date,
      credits
    }));

    // Get top users by credit usage
    const { data: topUsersData } = await supabase
      .from('credit_transactions')
      .select('user_id, amount, profiles!inner(email, full_name)')
      .eq('type', 'deduction')
      .like('description', '%Javari AI%')
      .gte('created_at', dateFilter || '2000-01-01');

    const userCredits: Record<string, { email: string; name: string; credits: number }> = {};
    
    topUsersData?.forEach((transaction: any) => {
      const userId = transaction.user_id;
      if (!userCredits[userId]) {
        userCredits[userId] = {
          email: transaction.profiles?.email || 'Unknown',
          name: transaction.profiles?.full_name || 'Unknown',
          credits: 0
        };
      }
      userCredits[userId].credits += Math.abs(transaction.amount);
    });

    const topUsers = Object.entries(userCredits)
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        totalConversations: totalConversations || 0,
        totalMessages: totalMessages || 0,
        totalCreditsSpent,
        uniqueUsers,
        averageCreditsPerUser: uniqueUsers > 0 ? Math.round(totalCreditsSpent / uniqueUsers) : 0,
        averageMessagesPerConversation: totalConversations > 0 ? Math.round((totalMessages || 0) / totalConversations) : 0
      },
      actionBreakdown: Object.entries(actionStats).map(([action, stats]) => ({
        action,
        ...stats
      })),
      chartData,
      topUsers,
      timeRange
    });

  } catch (error) {
    console.error('Error in Javari analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
