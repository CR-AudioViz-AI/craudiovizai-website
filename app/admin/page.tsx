'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Package, TrendingUp, Users } from 'lucide-react'
import ExpenseTrackerCard from '@/components/admin/ExpenseTrackerCard'

interface DashboardStats {
  credits: number
  totalGenerations: number
  hasSubscription: boolean
  recentActivity: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch credits balance
      const creditsRes = await fetch('/api/admin/credits')
      const creditsData = await creditsRes.json()
      
      // Fetch app usage
      const usageRes = await fetch('/api/admin/apps/usage?days=30')
      const usageData = await usageRes.json()
      
      setStats({
        credits: creditsData.credits || 0,
        totalGenerations: usageData.summary?.totalGenerations || 0,
        hasSubscription: creditsData.hasSubscription || false,
        recentActivity: usageData.usage?.length || 0
      })
      
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your overview...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.credits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSubscription ? 'Pro subscription active' : 'Pay as you go'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGenerations}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Recent transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSubscription ? 'Premium member' : 'Free tier'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tools Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Management Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ExpenseTrackerCard />
          
          {/* Placeholder for future management tools */}
          <Card className="cursor-not-allowed opacity-50">
            <CardHeader>
              <CardTitle>Asset Manager</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage your generated assets</p>
            </CardContent>
          </Card>

          <Card className="cursor-not-allowed opacity-50">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Detailed usage analytics</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin/credits" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Purchase Credits</div>
              <div className="text-sm text-muted-foreground">Add more credits to your account</div>
            </a>
            <a 
              href="/admin/apps" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">View Apps</div>
              <div className="text-sm text-muted-foreground">Browse available AI tools</div>
            </a>
            <a 
              href="/admin/assets" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">My Assets</div>
              <div className="text-sm text-muted-foreground">Download your generated content</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Tips for new users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg border">
              <div className="font-medium">1. Add Credits</div>
              <div className="text-sm text-muted-foreground">Purchase credits or subscribe for unlimited access</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="font-medium">2. Explore Apps</div>
              <div className="text-sm text-muted-foreground">Try our AI-powered creation tools</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="font-medium">3. Download Assets</div>
              <div className="text-sm text-muted-foreground">Access and download your creations anytime</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
