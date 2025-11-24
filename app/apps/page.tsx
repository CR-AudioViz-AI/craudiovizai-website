'use client'

import { EMBEDDED_APPS } from '@/lib/app-embedder'
import { useState } from 'react'
import { MobileInput, MobileButton } from '@/components/mobile'
import { Search } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', name: 'All Apps', icon: '🎯' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'analysis', name: 'Analysis', icon: '📊' },
  { id: 'developer', name: 'Developer', icon: '⚙️' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' }
]

export default function AppsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApps = EMBEDDED_APPS.filter(app => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const activeApps = filteredApps.filter(app => app.status === 'active')
  const betaApps = filteredApps.filter(app => app.status === 'beta')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">All Apps</h1>
        <p className="text-base md:text-lg lg:text-xl text-white/70 mb-6 md:mb-8">
          {EMBEDDED_APPS.length} professional tools at your fingertips
        </p>

        {/* Search */}
        <div className="mb-6 md:mb-8">
          <MobileInput
            type="search"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 md:mb-12 md:flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-3 rounded-lg transition-all whitespace-nowrap flex-shrink-0 text-sm md:text-base ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Active Apps */}
        {activeApps.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Ready to Use ({activeApps.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {activeApps.map(app => (
                <a
                  key={app.id}
                  href={`/apps/${app.slug}`}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <span className="text-4xl md:text-5xl">{app.icon}</span>
                    {app.javariEnabled && (
                      <span className="text-xl md:text-2xl" title="Javari Enabled">🤖</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                    {app.name}
                  </h3>
                  
                  <p className="text-sm md:text-base text-white/70 mb-3 md:mb-4 line-clamp-2">
                    {app.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {app.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-600/30 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {app.credits.free > 0
                        ? `${app.credits.free} credits/use`
                        : 'Free to use'}
                    </span>
                    <span className="text-purple-300 font-medium">Launch →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Beta Apps */}
        {betaApps.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Coming Soon ({betaApps.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {betaApps.map(app => (
                <div
                  key={app.id}
                  className="bg-white/5 backdrop-blur border border-yellow-600/30 rounded-xl p-4 md:p-6 relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-yellow-600/20 text-yellow-400 px-2 md:px-3 py-1 rounded-full text-xs">
                    Beta
                  </div>
                  
                  <div className="flex items-start mb-3 md:mb-4">
                    <span className="text-4xl md:text-5xl opacity-70">{app.icon}</span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 opacity-70">
                    {app.name}
                  </h3>
                  
                  <p className="text-sm md:text-base text-white/50 mb-3 md:mb-4 line-clamp-2">
                    {app.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {app.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-white/5 px-2 py-1 rounded text-xs opacity-70"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs md:text-sm text-yellow-400">
                    Launching soon...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-lg md:text-xl lg:text-2xl text-white/50 mb-6">
              No apps found matching your search.
            </p>
            <MobileButton
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Filters
            </MobileButton>
          </div>
        )}
      </div>
    </div>
  )
}
