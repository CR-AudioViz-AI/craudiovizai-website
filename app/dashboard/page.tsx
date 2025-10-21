'use client'

import { useState } from 'react'
import { Zap, Plus, Folder, Image, Code, Video, Music, BarChart, Settings, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [credits] = useState(1000)
  const [plan] = useState('Free')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CR AudioViz AI</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-bold">{credits.toLocaleString()}</span>
              <span className="text-gray-600 text-sm">credits</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="text-lg opacity-90 mb-4">You're on the {plan} plan with {credits.toLocaleString()} credits</p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100">
              Start Creating
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10">
              View Pricing
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<Code />}
              title="Build Website"
              description="Create a new website"
              cost="100 credits"
              color="from-blue-500 to-cyan-500"
            />
            <QuickActionCard
              icon={<Image />}
              title="Generate Image"
              description="AI image creation"
              cost="10 credits"
              color="from-purple-500 to-pink-500"
            />
            <QuickActionCard
              icon={<Video />}
              title="Create Video"
              description="Video generation"
              cost="50 credits"
              color="from-orange-500 to-red-500"
            />
            <QuickActionCard
              icon={<Music />}
              title="Compose Music"
              description="AI music creation"
              cost="25 credits"
              color="from-green-500 to-teal-500"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Recent Projects</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProjectCard
              title="My Portfolio Website"
              type="Website"
              lastEdited="2 hours ago"
              thumbnail="bg-gradient-to-br from-blue-400 to-purple-500"
            />
            <ProjectCard
              title="Product Demo Video"
              type="Video"
              lastEdited="1 day ago"
              thumbnail="bg-gradient-to-br from-orange-400 to-pink-500"
            />
            <ProjectCard
              title="Brand Logo Design"
              type="Image"
              lastEdited="3 days ago"
              thumbnail="bg-gradient-to-br from-green-400 to-cyan-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            icon={<Folder />}
            label="Total Projects"
            value="12"
            change="+3 this week"
          />
          <StatCard
            icon={<Zap />}
            label="Credits Used"
            value="5,240"
            change="840 this month"
          />
          <StatCard
            icon={<BarChart />}
            label="Storage Used"
            value="2.4 GB"
            change="12% of limit"
          />
          <StatCard
            icon={<Image />}
            label="Assets Created"
            value="48"
            change="+12 this week"
          />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ icon, title, description, cost, color }: {
  icon: React.ReactNode
  title: string
  description: string
  cost: string
  color: string
}) {
  return (
    <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-left border border-gray-100">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <p className="text-xs text-blue-600 font-semibold">{cost}</p>
    </button>
  )
}

function ProjectCard({ title, type, lastEdited, thumbnail }: {
  title: string
  type: string
  lastEdited: string
  thumbnail: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100">
      <div className={`h-40 ${thumbnail}`}></div>
      <div className="p-4">
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-2">{type}</p>
        <p className="text-xs text-gray-500">Edited {lastEdited}</p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, change }: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-500">{change}</p>
    </div>
  )
}
