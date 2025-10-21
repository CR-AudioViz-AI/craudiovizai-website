'use client'

import { useState } from 'react'
import { 
  Users, DollarSign, Activity, Settings, FileText, ShoppingCart, 
  TrendingUp, AlertCircle, BarChart3, Shield, Database, Zap 
} from 'lucide-react'

export default function CompleteAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    totalUsers: 12847,
    revenue: 284592,
    activeSubscriptions: 4821,
    creditsUsed: 1847293,
    pendingIssues: 23,
    serverUptime: 99.97
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield size={32} className="text-blue-600" />
          Admin Dashboard
        </h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'revenue', icon: DollarSign, label: 'Revenue' },
              { id: 'content', icon: FileText, label: 'Content' },
              { id: 'marketplace', icon: ShoppingCart, label: 'Marketplace' },
              { id: 'system', icon: Activity, label: 'System Health' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="text-blue-600" size={32} />
                    <span className="text-green-600 text-sm font-semibold">↑ 12%</span>
                  </div>
                  <h3 className="text-gray-600 mb-1">Total Users</h3>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="text-green-600" size={32} />
                    <span className="text-green-600 text-sm font-semibold">↑ 23%</span>
                  </div>
                  <h3 className="text-gray-600 mb-1">Monthly Revenue</h3>
                  <p className="text-3xl font-bold">${stats.revenue.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="text-purple-600" size={32} />
                    <span className="text-green-600 text-sm font-semibold">↑ 8%</span>
                  </div>
                  <h3 className="text-gray-600 mb-1">Active Subscriptions</h3>
                  <p className="text-3xl font-bold">{stats.activeSubscriptions.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="text-yellow-600" size={32} />
                    <span className="text-gray-600 text-sm font-semibold">Total</span>
                  </div>
                  <h3 className="text-gray-600 mb-1">Credits Used (30d)</h3>
                  <p className="text-3xl font-bold">{(stats.creditsUsed / 1000000).toFixed(1)}M</p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertCircle className="text-red-600" size={32} />
                    <span className="text-red-600 text-sm font-semibold">Urgent</span>
                  </div>
                  <h3 className="text-gray-600 mb-1">Pending Issues</h3>
                  <p className="text-3xl font-bold">{stats.pendingIssues}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="text-green-600" size={32} />
                    <span className="text-green-600 text-sm font-semibold">✓ Healthy</span>
                  </div>
                  <h3 className="text-gray-600 mb-1">Server Uptime</h3>
                  <p className="text-3xl font-bold">{stats.serverUptime}%</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { type: 'user', message: 'New user registration: sarah@example.com', time: '2 min ago' },
                    { type: 'payment', message: 'Payment received: $299 Enterprise Plan', time: '15 min ago' },
                    { type: 'issue', message: 'Support ticket #1847 resolved', time: '1 hour ago' },
                    { type: 'system', message: 'Database backup completed successfully', time: '2 hours ago' }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'payment' ? 'bg-green-500' :
                        activity.type === 'issue' ? 'bg-yellow-500' : 'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition text-center">
                    <Users size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">Manage Users</span>
                  </button>
                  <button className="bg-green-50 text-green-600 p-4 rounded-lg hover:bg-green-100 transition text-center">
                    <DollarSign size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">View Revenue</span>
                  </button>
                  <button className="bg-purple-50 text-purple-600 p-4 rounded-lg hover:bg-purple-100 transition text-center">
                    <Database size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">Database</span>
                  </button>
                  <button className="bg-red-50 text-red-600 p-4 rounded-lg hover:bg-red-100 transition text-center">
                    <Settings size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">Settings</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
              <p className="text-gray-600">This section contains detailed {activeTab} management tools and analytics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
