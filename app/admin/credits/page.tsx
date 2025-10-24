'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Clock, TrendingDown, TrendingUp } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CreditPackage {
  name: string
  credits: number
  price: number
  priceId: string
  popular?: boolean
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { name: 'Starter', credits: 100, price: 10, priceId: 'price_starter_100' },
  { name: 'Professional', credits: 500, price: 45, priceId: 'price_pro_500', popular: true },
  { name: 'Business', credits: 1000, price: 80, priceId: 'price_business_1000' },
  { name: 'Enterprise', credits: 5000, price: 350, priceId: 'price_enterprise_5000' }
]

export default function CreditsPage() {
  const [credits, setCredits] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCreditsData()
  }, [])

  const fetchCreditsData = async () => {
    try {
      setLoading(true)
      
      // Fetch current balance
      const balanceRes = await fetch('/api/admin/credits')
      const balanceData = await balanceRes.json()
      setCredits(balanceData.credits || 0)
      
      // Fetch transaction history
      const historyRes = await fetch('/api/admin/credits/history?limit=20')
      const historyData = await historyRes.json()
      setHistory(historyData.transactions || [])
      
      setError(null)
    } catch (err) {
      console.error('Error fetching credits data:', err)
      setError('Failed to load credits data')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (priceId: string) => {
    try {
      setPurchasing(true)
      setError(null)

      const response = await fetch('/api/admin/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, quantity: 1 })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (err: any) {
      console.error('Purchase error:', err)
      setError(err.message || 'Failed to process purchase')
    } finally {
      setPurchasing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Credits Management</h1>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Credits Management</h1>
        <p className="text-muted-foreground">Purchase and manage your credits</p>
      </div>

      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{credits.toLocaleString()} Credits</div>
          <p className="text-sm text-muted-foreground mt-2">
            Credits never expire on paid plans
          </p>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Purchase Credits</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card key={pkg.priceId} className={pkg.popular ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{pkg.name}</CardTitle>
                  {pkg.popular && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                </div>
                <CardDescription>{pkg.credits.toLocaleString()} Credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-3xl font-bold">${pkg.price}</div>
                  <div className="text-sm text-muted-foreground">
                    ${(pkg.price / pkg.credits).toFixed(3)} per credit
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase(pkg.priceId)}
                  disabled={purchasing}
                >
                  {purchasing ? 'Processing...' : 'Purchase'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent credit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.transaction_type === 'purchase' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.transaction_type === 'purchase' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
