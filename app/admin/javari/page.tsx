'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, TrendingUp, Users, CreditCard, Activity, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Analytics {
  summary: {
    totalConversations: number;
    totalMessages: number;
    totalCreditsSpent: number;
    uniqueUsers: number;
    averageCreditsPerUser: number;
    averageMessagesPerConversation: number;
  };
  actionBreakdown: Array<{
    action: string;
    count: number;
    credits: number;
  }>;
  chartData: Array<{
    date: string;
    credits: number;
  }>;
  topUsers: Array<{
    userId: string;
    email: string;
    name: string;
    credits: number;
  }>;
  timeRange: string;
}

export default function JavariAdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadAnalytics();
    }
  }, [timeRange, loading]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      router.push('/');
      return;
    }

    setLoading(false);
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/javari/analytics?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to load analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Failed to load analytics</p>
            <Button onClick={loadAnalytics}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Javari AI Analytics</h1>
              <p className="text-purple-100">Monitor usage, credits, and performance</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Conversations
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.summary.totalConversations.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.summary.averageMessagesPerConversation} msgs avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Messages
              </CardTitle>
              <Activity className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.summary.totalMessages.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                User + AI messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Credits Spent
              </CardTitle>
              <CreditCard className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.summary.totalCreditsSpent.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.summary.averageCreditsPerUser} per user avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <Users className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.summary.uniqueUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Unique users
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Action Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Action Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.actionBreakdown.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-4">
                  {analytics.actionBreakdown
                    .sort((a, b) => b.count - a.count)
                    .map((action, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {action.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {action.count} uses • {action.credits} credits
                          </p>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 ml-4">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${(action.count / Math.max(...analytics.actionBreakdown.map(a => a.count))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Top Users by Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data available</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topUsers.map((user, index) => (
                    <div key={user.userId} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          {user.credits}
                        </p>
                        <p className="text-xs text-gray-500">credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daily Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Daily Credit Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.chartData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-2">
                {analytics.chartData.map((day, index) => {
                  const maxCredits = Math.max(...analytics.chartData.map(d => d.credits));
                  const percentage = (day.credits / maxCredits) * 100;
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-8 rounded-full transition-all flex items-center justify-end pr-2"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white text-xs font-semibold">
                            {day.credits}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
