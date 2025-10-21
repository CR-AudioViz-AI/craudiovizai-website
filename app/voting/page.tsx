'use client'

import { useState } from 'react'
import { ThumbsUp, TrendingUp, CheckCircle, Clock, Users, Lightbulb } from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  category: string
  votes: number
  status: 'voting' | 'in-progress' | 'completed'
  estimatedTime: string
  requestedBy: number
}

export default function VotingSystemPage() {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: '1',
      title: 'AI Video Editor with Auto-Captions',
      description: 'Automatically generate and sync captions for videos using AI voice recognition',
      category: 'Tools',
      votes: 1247,
      status: 'in-progress',
      estimatedTime: '2 weeks',
      requestedBy: 89
    },
    {
      id: '2',
      title: 'Dark Mode for All Apps',
      description: 'System-wide dark mode theme option across the entire platform',
      category: 'UX',
      votes: 892,
      status: 'voting',
      estimatedTime: '1 week',
      requestedBy: 156
    },
    {
      id: '3',
      title: 'Mobile App for iOS and Android',
      description: 'Native mobile applications with offline capabilities',
      category: 'Platform',
      votes: 2156,
      status: 'voting',
      estimatedTime: '2 months',
      requestedBy: 312
    }
  ])

  const handleVote = (id: string) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, votes: f.votes + 1 } : f
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <ThumbsUp size={40} />
            <h1 className="text-5xl font-bold">Community Voting</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            You decide what we build next. Vote for features you want, request new ones, 
            and watch them come to life.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleVote(feature.id)}
                      className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg transition mb-2"
                    >
                      <ThumbsUp size={24} className="text-blue-600" />
                    </button>
                    <span className="text-2xl font-bold text-blue-600">{feature.votes}</span>
                    <span className="text-xs text-gray-500">votes</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        feature.status === 'completed' ? 'bg-green-100 text-green-700' :
                        feature.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feature.status === 'completed' ? '✓ Done' :
                         feature.status === 'in-progress' ? '⚡ Building' :
                         '🗳️ Voting'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {feature.requestedBy} requesters
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        Est: {feature.estimatedTime}
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {feature.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">How Voting Works</h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Request Features</h4>
                    <p className="text-gray-600">Submit your ideas for new tools and improvements</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <ThumbsUp size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Vote on Features</h4>
                    <p className="text-gray-600">Support features you want by voting</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">We Build Top Votes</h4>
                    <p className="text-gray-600">Highest voted features get built first</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Notified</h4>
                    <p className="text-gray-600">Email updates when features launch</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Request New Feature</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Feature title..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Describe your idea..."
                  className="w-full px-4 py-2 border rounded-lg h-24"
                ></textarea>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
