'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Download,
  Calendar,
  Eye,
  RefreshCw,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalAppsUsed: number;
  avgSessionTime: number;
  conversionRate: number;
  churnRate: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  users: number;
}

interface TopApp {
  name: string;
  usage: number;
  revenue: number;
}

export default function AnalyticsReportsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topApps, setTopApps] = useState<TopApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual Supabase queries
      const mockAnalytics: AnalyticsData = {
        totalRevenue: 147823,
        monthlyRevenue: 12450,
        totalUsers: 1247,
        activeUsers: 892,
        totalAppsUsed: 45623,
        avgSessionTime: 18.5,
        conversionRate: 24.3,
        churnRate: 3.2
      };

      const mockRevenueData: RevenueData[] = [
        { month: 'Jan', revenue: 8200, users: 850 },
        { month: 'Feb', revenue: 9100, users: 920 },
        { month: 'Mar', revenue: 10500, users: 1050 },
        { month: 'Apr', revenue: 11200, users: 1120 },
        { month: 'May', revenue: 12450, users: 1247 },
        { month: 'Jun', revenue: 13800, users: 1380 }
      ];

      const mockTopApps: TopApp[] = [
        { name: 'AI Content Creator', usage: 12453, revenue: 45200 },
        { name: 'Image Resizer', usage: 9821, revenue: 32100 },
        { name: 'Video Editor', usage: 8234, revenue: 28900 },
        { name: 'Audio Visualizer', usage: 7145, revenue: 24300 },
        { name: 'Data Analyzer', usage: 5892, revenue: 19800 }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));

      setAnalytics(mockAnalytics);
      setRevenueData(mockRevenueData);
      setTopApps(mockTopApps);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const exportReport = () => {
    // Generate CSV report
    const csv = [
      ['Metric', 'Value'],
      ['Total Revenue', `$${analytics?.totalRevenue.toLocaleString()}`],
      ['Monthly Revenue', `$${analytics?.monthlyRevenue.toLocaleString()}`],
      ['Total Users', analytics?.totalUsers],
      ['Active Users', analytics?.activeUsers],
      ['Conversion Rate', `${analytics?.conversionRate}%`],
      ['Churn Rate', `${analytics?.churnRate}%`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-slate-400 text-lg">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-blue-500" />
              Analytics & Reports
            </h1>
            <p className="text-slate-400 text-lg">
              Platform usage, revenue tracking, and growth metrics
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportReport}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {range === '7d' && 'Last 7 Days'}
              {range === '30d' && 'Last 30 Days'}
              {range === '90d' && 'Last 90 Days'}
              {range === '1y' && 'Last Year'}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Total Revenue</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(analytics.totalRevenue)}
              </p>
              <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.3% from last month
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Monthly Revenue</h3>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(analytics.monthlyRevenue)}
              </p>
              <p className="text-slate-500 text-sm mt-1">current month</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Total Users</h3>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {analytics.totalUsers.toLocaleString()}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {analytics.activeUsers} active
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Conversion Rate</h3>
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                {analytics.conversionRate}%
              </p>
              <p className="text-slate-500 text-sm mt-1">free to paid</p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LineChart className="w-6 h-6 text-blue-500" />
              Revenue Trend
            </h2>
            <div className="space-y-3">
              {revenueData.map((data) => (
                <div key={data.month}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{data.month}</span>
                    <span className="text-white font-medium">
                      {formatCurrency(data.revenue)}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${(data.revenue / 15000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Apps */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-green-500" />
              Top Performing Apps
            </h2>
            <div className="space-y-4">
              {topApps.map((app, index) => (
                <div key={app.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{app.name}</p>
                      <p className="text-slate-400 text-sm">
                        {app.usage.toLocaleString()} uses
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400 font-semibold">
                    {formatCurrency(app.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Platform Usage
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Total Apps Used</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.totalAppsUsed.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Avg Session Time</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.avgSessionTime} min
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  User Engagement
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 text-sm">Active Users</span>
                    <span className="text-white font-medium">
                      {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(analytics.activeUsers / analytics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Churn Rate</p>
                  <p className="text-2xl font-bold text-white">{analytics.churnRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Growth Metrics
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">User Growth</p>
                  <p className="text-2xl font-bold text-green-400">+23.4%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Revenue Growth</p>
                  <p className="text-2xl font-bold text-green-400">+15.3%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
