'use client'

import { useState } from 'react'
import { DollarSign, FileText, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface Grant {
  id: string
  name: string
  amount: number
  status: 'pending' | 'approved' | 'submitted' | 'draft'
  deadline: string
  organization: string
}

export default function GrantManagementPage() {
  const [grants] = useState<Grant[]>([
    {
      id: '1',
      name: 'FEMA First Responders Mental Health Initiative',
      amount: 2500000,
      status: 'submitted',
      deadline: '2025-11-30',
      organization: 'FEMA'
    },
    {
      id: '2',
      name: 'DOJ Community Policing Support Grant',
      amount: 1800000,
      status: 'pending',
      deadline: '2025-12-15',
      organization: 'Department of Justice'
    },
    {
      id: '3',
      name: 'VA Military Family Support Program',
      amount: 3200000,
      status: 'draft',
      deadline: '2026-01-20',
      organization: 'Veterans Affairs'
    }
  ])

  const totalRequested = grants.reduce((sum, g) => sum + g.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <FileText size={40} />
          Grant Management Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <DollarSign className="text-green-600 mb-4" size={32} />
            <h3 className="font-bold">Total Requested</h3>
            <p className="text-3xl font-bold text-green-600">
              ${(totalRequested / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <CheckCircle className="text-blue-600 mb-4" size={32} />
            <h3 className="font-bold">Submitted</h3>
            <p className="text-3xl font-bold text-blue-600">
              {grants.filter(g => g.status === 'submitted').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <Clock className="text-yellow-600 mb-4" size={32} />
            <h3 className="font-bold">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {grants.filter(g => g.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <AlertTriangle className="text-red-600 mb-4" size={32} />
            <h3 className="font-bold">Drafts</h3>
            <p className="text-3xl font-bold text-red-600">
              {grants.filter(g => g.status === 'draft').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Active Grant Applications</h2>
          <div className="space-y-4">
            {grants.map((grant) => (
              <div key={grant.id} className="border rounded-lg p-4 hover:border-blue-500 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{grant.name}</h3>
                    <p className="text-sm text-gray-600">{grant.organization}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    grant.status === 'approved' ? 'bg-green-100 text-green-700' :
                    grant.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                    grant.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} />
                    ${(grant.amount / 1000000).toFixed(1)}M
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Due: {grant.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
