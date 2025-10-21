'use client'

import { useState } from 'react'
import { Store, DollarSign, TrendingUp, Star, Download, ShoppingCart, Filter, Search } from 'lucide-react'

interface CreatorItem {
  id: string
  title: string
  creator: string
  type: 'game' | 'app' | 'template' | 'asset'
  price: number
  rating: number
  downloads: number
  revenue: number
  thumbnail: string
  description: string
}

export default function CreatorMarketplacePage() {
  const [items, setItems] = useState<CreatorItem[]>([
    {
      id: '1',
      title: 'Advanced Task Manager Pro',
      creator: 'Sarah Chen',
      type: 'app',
      price: 29.99,
      rating: 4.8,
      downloads: 1243,
      revenue: 26127.49,
      thumbnail: '/assets/task-manager.jpg',
      description: 'Full-featured project management system with team collaboration'
    },
    {
      id: '2',
      title: 'Space Shooter Infinite',
      creator: 'GameDev Studios',
      type: 'game',
      price: 4.99,
      rating: 4.6,
      downloads: 5821,
      revenue: 20352.81,
      thumbnail: '/assets/space-shooter.jpg',
      description: 'Addictive arcade game with power-ups and leaderboards'
    },
    {
      id: '3',
      title: 'Modern Dashboard Template Pack',
      creator: 'Design Masters',
      type: 'template',
      price: 49.99,
      rating: 4.9,
      downloads: 892,
      revenue: 31224.03,
      thumbnail: '/assets/dashboard-templates.jpg',
      description: '12 premium dashboard templates for web and mobile'
    }
  ])

  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.creator.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Store size={40} />
            <h1 className="text-5xl font-bold">Creator Marketplace</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Sell your apps, games, templates, and assets. Keep 70% of every sale. 
            We handle payments, hosting, and distribution.
          </p>
        </div>
      </div>

      {/* Revenue Split Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">70%</div>
              <div className="text-lg">You Keep</div>
              <div className="text-sm opacity-90">Highest in the industry</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">30%</div>
              <div className="text-lg">Platform Fee</div>
              <div className="text-sm opacity-90">Covers hosting & processing</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">$0</div>
              <div className="text-lg">Listing Fees</div>
              <div className="text-sm opacity-90">Free to list, only pay on sales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Store className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">2,450+</div>
                <div className="text-sm text-gray-600">Items Listed</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">892</div>
                <div className="text-sm text-gray-600">Active Creators</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">$2.3M</div>
                <div className="text-sm text-gray-600">Creator Earnings (YTD)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Download className="text-orange-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">127K</div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="app">Apps</option>
              <option value="game">Games</option>
              <option value="template">Templates</option>
              <option value="asset">Assets</option>
            </select>
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-48 flex items-center justify-center">
                <span className="text-6xl">
                  {item.type === 'app' ? '📱' :
                   item.type === 'game' ? '🎮' :
                   item.type === 'template' ? '🎨' : '🖼️'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.creator}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    {item.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download size={16} />
                    {item.downloads.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">${item.price}</div>
                    <div className="text-xs text-gray-500">Creator earns ${(item.price * 0.7).toFixed(2)}</div>
                  </div>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Creator Benefits */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Why Sell With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">70% Revenue Split</h3>
              <p className="text-gray-600 text-sm">
                Keep more of what you earn. Industry-leading creator compensation with transparent pricing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Built-in Marketing</h3>
              <p className="text-gray-600 text-sm">
                Featured placements, email campaigns, and social promotion drive traffic to your products.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Store className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Full Infrastructure</h3>
              <p className="text-gray-600 text-sm">
                Hosting, payments, licensing, and support all handled. You focus on creating.
              </p>
            </div>
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Top Earning Creators This Month</h2>
          <div className="space-y-4">
            {[
              { name: 'Sarah Chen', earnings: 26127.49, items: 3, badge: '🥇' },
              { name: 'Design Masters', earnings: 31224.03, items: 8, badge: '🥈' },
              { name: 'GameDev Studios', earnings: 20352.81, items: 5, badge: '🥉' }
            ].map((creator, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{creator.badge}</span>
                  <div>
                    <h4 className="font-bold">{creator.name}</h4>
                    <p className="text-sm text-gray-600">{creator.items} items listed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${creator.earnings.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">This month</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Selling Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of creators earning from their work. List your first product free.
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Become a Creator
          </button>
        </div>
      </div>
    </div>
  )
}
