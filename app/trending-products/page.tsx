'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Zap, ShoppingCart, Clock, DollarSign, Target, Sparkles } from 'lucide-react'

interface TrendingEvent {
  id: string
  title: string
  category: 'politics' | 'sports' | 'disaster' | 'entertainment' | 'viral' | 'holiday'
  trendingScore: number
  detectedAt: string
  products: TrendingProduct[]
  hashtags: string[]
  searchVolume: number
}

interface TrendingProduct {
  id: string
  name: string
  type: 'tshirt' | 'hoodie' | 'mug' | 'poster' | 'sticker' | 'phone-case'
  design: string
  basePrice: number
  markup: number
  finalPrice: number
  mockupUrl: string
  timeToMarket: string
}

export default function TrendingProductsPage() {
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TrendingEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    const mockEvents: TrendingEvent[] = [
      {
        id: '1',
        title: 'Hurricane Relief Support',
        category: 'disaster',
        trendingScore: 98,
        detectedAt: '2 hours ago',
        searchVolume: 125000,
        hashtags: ['#HurricaneRelief', '#StayStrong', '#DisasterSupport'],
        products: [
          {
            id: 'p1',
            name: 'Hurricane Relief Support Tee',
            type: 'tshirt',
            design: 'Support graphic with donation promise',
            basePrice: 12.99,
            markup: 7.00,
            finalPrice: 19.99,
            mockupUrl: '/mockups/hurricane-tee.jpg',
            timeToMarket: '2 hours ago'
          },
          {
            id: 'p2',
            name: 'Stay Strong Hoodie',
            type: 'hoodie',
            design: 'Motivational support design',
            basePrice: 24.99,
            markup: 15.00,
            finalPrice: 39.99,
            mockupUrl: '/mockups/hurricane-hoodie.jpg',
            timeToMarket: '2 hours ago'
          }
        ]
      },
      {
        id: '2',
        title: 'Championship Game Victory',
        category: 'sports',
        trendingScore: 95,
        detectedAt: '4 hours ago',
        searchVolume: 89000,
        hashtags: ['#Champions', '#VictoryLap', '#TeamName'],
        products: [
          {
            id: 'p3',
            name: 'Champions 2025 Tee',
            type: 'tshirt',
            design: 'Championship celebration graphic',
            basePrice: 12.99,
            markup: 7.00,
            finalPrice: 19.99,
            mockupUrl: '/mockups/champs-tee.jpg',
            timeToMarket: '4 hours ago'
          },
          {
            id: 'p4',
            name: 'Victory Mug',
            type: 'mug',
            design: 'Championship logo and date',
            basePrice: 8.99,
            markup: 6.00,
            finalPrice: 14.99,
            mockupUrl: '/mockups/champs-mug.jpg',
            timeToMarket: '4 hours ago'
          }
        ]
      },
      {
        id: '3',
        title: 'Viral Meme Moment',
        category: 'viral',
        trendingScore: 92,
        detectedAt: '6 hours ago',
        searchVolume: 67000,
        hashtags: ['#ViralMoment', '#MemeGold', '#Internet'],
        products: [
          {
            id: 'p5',
            name: 'Viral Moment Sticker Pack',
            type: 'sticker',
            design: 'Meme illustration',
            basePrice: 2.99,
            markup: 2.00,
            finalPrice: 4.99,
            mockupUrl: '/mockups/viral-sticker.jpg',
            timeToMarket: '6 hours ago'
          },
          {
            id: 'p6',
            name: 'Meme Phone Case',
            type: 'phone-case',
            design: 'Featured meme design',
            basePrice: 9.99,
            markup: 5.00,
            finalPrice: 14.99,
            mockupUrl: '/mockups/viral-case.jpg',
            timeToMarket: '6 hours ago'
          }
        ]
      }
    ]

    setTrendingEvents(mockEvents)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'disaster': return '🚨'
      case 'sports': return '🏆'
      case 'viral': return '🔥'
      case 'politics': return '🗳️'
      case 'entertainment': return '🎬'
      case 'holiday': return '🎄'
      default: return '⭐'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'disaster': return 'bg-red-100 text-red-700 border-red-200'
      case 'sports': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'viral': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'politics': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'entertainment': return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'holiday': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredEvents = trendingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={40} />
            <h1 className="text-5xl font-bold">Trending Products Marketplace</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            AI-powered event detection instantly creates trending merchandise. From breaking news to viral moments, 
            we're first to market with products people want.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Zap className="text-orange-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">2-6 hrs</div>
                <div className="text-sm text-gray-600">Average Time to Market</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Trend Detection Accuracy</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">35-50%</div>
                <div className="text-sm text-gray-600">Average Profit Margin</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">1,000+</div>
                <div className="text-sm text-gray-600">Products Created Monthly</div>
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
                placeholder="Search trending events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="disaster">Disaster Relief</option>
              <option value="sports">Sports</option>
              <option value="viral">Viral Moments</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="holiday">Holidays</option>
            </select>
          </div>
        </div>

        {/* Trending Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className={`p-4 ${getCategoryColor(event.category)} border-b`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(event.category)}</span>
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.detectedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp size={14} />
                          {event.searchVolume.toLocaleString()} searches
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{event.trendingScore}</div>
                    <div className="text-xs">Trend Score</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {event.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {event.products.slice(0, 4).map((product) => (
                    <div key={product.id} className="border rounded-lg p-3 hover:border-orange-500 transition">
                      <div className="bg-gray-100 rounded h-32 mb-3 flex items-center justify-center">
                        <span className="text-4xl">
                          {product.type === 'tshirt' ? '👕' : 
                           product.type === 'hoodie' ? '🧥' :
                           product.type === 'mug' ? '☕' :
                           product.type === 'poster' ? '🖼️' :
                           product.type === 'sticker' ? '🏷️' : '📱'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">${product.finalPrice}</span>
                        <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 transition">
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Profit: ${product.markup.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  View All {event.products.length} Products
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">How Our AI Marketplace Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Detects Trends</h3>
              <p className="text-gray-600 text-sm">
                Our bots monitor news, social media, and search trends 24/7 to identify viral moments instantly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Designs Generated</h3>
              <p className="text-gray-600 text-sm">
                AI creates relevant designs across multiple product types with trend-appropriate messaging
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Publishing</h3>
              <p className="text-gray-600 text-sm">
                Products go live in our marketplace within 2-6 hours of trend detection
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">You Earn Revenue</h3>
              <p className="text-gray-600 text-sm">
                Print-on-demand fulfillment means zero inventory risk with 35-50% profit margins
              </p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Product Types We Create</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { icon: '👕', name: 'T-Shirts', base: '$12.99' },
              { icon: '🧥', name: 'Hoodies', base: '$24.99' },
              { icon: '☕', name: 'Mugs', base: '$8.99' },
              { icon: '🖼️', name: 'Posters', base: '$7.99' },
              { icon: '🏷️', name: 'Stickers', base: '$2.99' },
              { icon: '📱', name: 'Phone Cases', base: '$9.99' }
            ].map((product, idx) => (
              <div key={idx} className="text-center p-4 border rounded-lg hover:border-orange-500 hover:shadow-md transition">
                <div className="text-5xl mb-3">{product.icon}</div>
                <h3 className="font-bold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">From {product.base}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Selling Trending Products Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our AI do the heavy lifting. We detect trends, create designs, and handle fulfillment. 
            You just collect the profits.
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Launch Your Store Free
          </button>
        </div>
      </div>
    </div>
  )
}
