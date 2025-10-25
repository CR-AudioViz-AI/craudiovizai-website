'use client'

// app/admin/expenses/page.tsx  
// Full expense tracking dashboard with forms, tables, alerts, and reports

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, DollarSign, Calendar, TrendingUp, Download, Plus } from 'lucide-react'

interface Subscription {
  id: string
  name: string
  vendor: { name: string } | null
  amount: number
  currency: string
  billing_interval: string
  end_date: string | null
  active: boolean
}

interface Alert {
  id: number
  title: string
  description: string
  due_on: string
}

interface ExpenseSummary {
  monthlyTotal: number
  annualTotal: number
  active: number
}

export default function ExpensesDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch subscriptions
      const subsRes = await fetch('/api/expenses/subscriptions?active=true')
      const subsData = await subsRes.json()

      // Fetch alerts
      const alertsRes = await fetch('/api/expenses/alerts')
      const alertsData = await alertsRes.json()

      setSubscriptions(subsData.subscriptions || [])
      setAlerts(alertsData.alerts || [])
      setSummary(subsData.summary)
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: number) => {
    try {
      await fetch('/api/expenses/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId })
      })
      
      // Refresh alerts
      fetchDashboardData()
    } catch (err) {
      console.error('Error acknowledging alert:', err)
    }
  }

  const exportExpenses = async () => {
    try {
      const response = await fetch('/api/expenses/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bill Management & Expense Tracking</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-32 bg-muted animate-pulse rounded" />
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
          <h1 className="text-3xl font-bold">Bill Management & Expense Tracking</h1>
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bill Management & Expense Tracking</h1>
          <p className="text-muted-foreground">Manage subscriptions, track expenses, and monitor renewals</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportExpenses}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.monthlyTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${summary?.annualTotal.toLocaleString()}/year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Recurring services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Renewals due soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Renewal Alerts
            </CardTitle>
            <CardDescription>Upcoming subscriptions that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">{alert.title}</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{alert.description}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Due: {alert.due_on}</p>
                  </div>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>Your recurring services and their costs</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active subscriptions yet</p>
              <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Add Your First Subscription
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Vendor</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Frequency</th>
                    <th className="text-left p-4 font-medium">Renewal Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{sub.name}</div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {sub.vendor?.name || '—'}
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          ${parseFloat(sub.amount).toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">{sub.currency}</span>
                      </td>
                      <td className="p-4 capitalize">{sub.billing_interval}ly</td>
                      <td className="p-4">
                        {sub.end_date || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
