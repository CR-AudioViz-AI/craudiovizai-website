'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface App {
  id: string
  name: string
  description: string
  category: string
  creditsPerUse: number
  icon: string
  url: string
  status: string
}

interface UsageSummary {
  totalGenerations: number
  totalCreditsUsed: number
  mostUsedApp: string | null
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [usage, setUsage] = useState<any[]>([])
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchAppsData()
  }, [])

  const fetchAppsData = async () => {
    try {
      setLoading(true)
      
      // Fetch apps list
      const appsRes = await fetch('/api/admin/apps/list')
      const appsData = await appsRes.json()
      setApps(appsData.apps || [])
      setCategories(appsData.categories || [])
      
      // Fetch usage statistics
      const usageRes = await fetch('/api/admin/apps/usage?days=30')
      const usageData = await usageRes.json()
      setUsage(usageData.usage || [])
      setSummary(usageData.summary || null)
      
    } catch (err) {
      console.error('Error fetching apps data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredApps = filter === 'all' 
    ? apps 
    : apps.filter(app => app.category === filter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Apps Management</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Apps Management</h1>
        <p className="text-muted-foreground">Browse and manage your AI-powered applications</p>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalGenerations}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalCreditsUsed}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Most Used App</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.mostUsedApp || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Apps
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredApps.map((app) => (
          <Card key={app.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{app.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {app.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant={app.status === 'active' ? 'default' : 'outline'}>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold">{app.creditsPerUse}</span> credits/use
                </div>
                {app.status === 'active' ? (
                  <Button asChild size="sm">
                    <a href={app.url}>Launch App</a>
                  </Button>
                ) : (
                  <Button size="sm" disabled>Coming Soon</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {usage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Usage</CardTitle>
            <CardDescription>Your recent app generations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usage.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{item.description || item.app_id}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-red-600">
                    -{Math.abs(item.amount)} credits
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
