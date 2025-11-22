'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAppBySlug, EmbeddedApp } from '@/lib/app-embedder'

export default function AppPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [app, setApp] = useState<EmbeddedApp | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundApp = getAppBySlug(slug)
    setApp(foundApp || null)
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">App Not Found</h1>
          <p className="text-xl mb-8">The app you're looking for doesn't exist.</p>
          <a
            href="/apps"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block"
          >
            Browse All Apps
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* App Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/apps" className="text-white/70 hover:text-white">
            ← Back to Apps
          </a>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{app.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{app.name}</h1>
              <p className="text-sm text-white/70">{app.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {app.javariEnabled && (
            <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full">
              <span className="text-green-400">🤖</span>
              <span className="text-sm">Javari Enabled</span>
            </div>
          )}
          
          {app.status === 'beta' && (
            <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
              Beta
            </span>
          )}
          
          <a
            href={app.deploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
          >
            Open in New Tab ↗
          </a>
        </div>
      </div>

      {/* Embedded App */}
      <iframe
        src={app.deploymentUrl}
        className="w-full border-0"
        style={{ height: 'calc(100vh - 100px)' }}
        title={app.name}
        allow="clipboard-read; clipboard-write; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  )
}
