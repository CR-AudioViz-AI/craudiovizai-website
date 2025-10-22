'use client'

import { useState, useEffect } from 'react'
import { 
  Users, DollarSign, Activity, Settings, FileText, ShoppingCart, 
  TrendingUp, AlertCircle, BarChart3, Shield, Database, Zap, Menu as MenuIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CompleteAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [navigationLinks, setNavigationLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const stats = {
    totalUsers: 12847,
    revenue: 284592,
    activeSubscriptions: 4821,
    creditsUsed: 1847293,
    pendingIssues: 23,
    serverUptime: 99.97
  }

  // Fetch navigation links when navigation tab is active
  useEffect(() => {
    if (activeTab === 'navigation') {
      fetchNavigationLinks()
    }
  }, [activeTab])

  const fetchNavigationLinks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('navigation_links')
      .select('*')
      .order('category')
      .order('display_order')
    
    if (data) {
      setNavigationLinks(data)
    }
    setLoading(false)
  }

  const toggleLinkVisibility = async (linkId: string, currentVisibility: boolean) => {
    const { error } = await supabase
      .from('navigation_links')
      .update({ is_visible: !currentVisibility })
      .eq('id', linkId)
    
    if (!error) {
      // Update local state
      setNavigationLinks(navigationLinks.map(link => 
        link.id === linkId ? { ...link, is_visible: !currentVisibility } : link
      ))
    }
  }

  const groupedLinks = navigationLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {} as Record<string, any[]>)

  const categoryLabels: Record<string, string> = {
    'header': 'Header Navigation',
    'footer-navigation': 'Footer - Navigation',
    'footer-resources': 'Footer - Resources',
    'footer-company': 'Footer - Company',
    'footer-legal': 'Footer - Legal'
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
              { id: 'navigation', icon: MenuIcon, label: 'Navigation' },
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
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition text-center"
                  >
                    <Users size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">Manage Users</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('revenue')}
                    className="bg-green-50 text-green-600 p-4 rounded-lg hover:bg-green-100 transition text-center"
                  >
                    <DollarSign size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">View Revenue</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('navigation')}
                    className="bg-purple-50 text-purple-600 p-4 rounded-lg hover:bg-purple-100 transition text-center"
                  >
                    <MenuIcon size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">Navigation</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="bg-red-50 text-red-600 p-4 rounded-lg hover:bg-red-100 transition text-center"
                  >
                    <Settings size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-semibold">Settings</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-2">Navigation Management</h2>
                <p className="text-gray-600 mb-6">
                  Control which links appear in your header and footer navigation. Toggle visibility to show or hide links site-wide.
                </p>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading navigation links...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupedLinks).map(([category, links]) => (
                      <div key={category} className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <MenuIcon size={20} className="text-blue-600" />
                          {categoryLabels[category] || category}
                        </h3>
                        <div className="space-y-3">
                          {links.map((link) => (
                            <div
                              key={link.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{link.label}</p>
                                <p className="text-sm text-gray-600">{link.href}</p>
                              </div>
                              <button
                                onClick={() => toggleLinkVisibility(link.id, link.is_visible)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  link.is_visible ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    link.is_visible ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'navigation' && (
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
