'use client'

// components/expenses/AddSubscriptionModal.tsx
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, Loader2 } from 'lucide-react'

interface AddSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddSubscriptionModal({ open, onOpenChange, onSuccess }: AddSubscriptionModalProps) {
  const [loading, setLoading] = useState(false)
  const [nextRenewalDate, setNextRenewalDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billing_cycle: 'monthly',
    status: 'active',
    auto_renew: true,
    renewal_alert_days: '7'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const payload = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        billing_cycle: formData.billing_cycle,
        status: formData.status,
        auto_renew: formData.auto_renew,
        renewal_alert_days: parseInt(formData.renewal_alert_days) || 7,
        next_renewal_date: nextRenewalDate ? nextRenewalDate.toISOString().split('T')[0] : undefined
      }

      const response = await fetch('/api/expenses/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setFormData({
          name: '',
          amount: '',
          billing_cycle: 'monthly',
          status: 'active',
          auto_renew: true,
          renewal_alert_days: '7'
        })
        setNextRenewalDate(undefined)
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error('Failed to create subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>Track recurring subscriptions and renewals</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              placeholder="Subscription name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={formData.billing_cycle} onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
