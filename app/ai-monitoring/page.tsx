'use client'

import { useState } from 'react'
import { TrendingUp, AlertCircle, BarChart3, Activity, Zap } from 'lucide-react'

export default function AIMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Activity size={40} />
          AI Trend Monitoring
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <TrendingUp className="text-blue-600 mb-4" size={32} />
            <h3 className="font-bold text-lg">Trending Topics</h3>
            <p className="text-3xl font-bold text-blue-600">127</p>
            <p className="text-sm text-gray-600">Detected today</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <Zap className="text-yellow-600 mb-4" size={32} />
            <h3 className="font-bold text-lg">Viral Moments</h3>
            <p className="text-3xl font-bold text-yellow-600">23</p>
            <p className="text-sm text-gray-600">High velocity</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <AlertCircle className="text-red-600 mb-4" size={32} />
            <h3 className="font-bold text-lg">Alerts Generated</h3>
            <p className="text-3xl font-bold text-red-600">8</p>
            <p className="text-sm text-gray-600">Requires action</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Real-Time Trend Detection</h2>
          <div className="space-y-4">
            {[
              { topic: 'AI Image Generation', velocity: 95, category: 'Tech' },
              { topic: 'Sustainable Fashion', velocity: 87, category: 'Lifestyle' },
              { topic: 'Remote Work Tools', velocity: 82, category: 'Business' }
            ].map((trend, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{trend.topic}</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">
                    {trend.category}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${trend.velocity}%` }}
                    />
                  </div>
                  <span className="font-bold text-blue-600">{trend.velocity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
