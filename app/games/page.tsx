'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Gamepad2, 
  Play, 
  Crown, 
  Star, 
  Zap,
  Target,
  Puzzle,
  Eye,
  Brain,
  Music,
  Globe,
  Smile,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

// Real game statistics from crav-games platform
const GAME_STATS = {
  total: 262,
  alwaysFree: 262,
  premium: 262,
  extreme: 1
}

const GAME_CATEGORIES = [
  { name: 'Daily Challenges', count: 185, icon: Target, emoji: '🎯' },
  { name: 'Original Games', count: 41, icon: Gamepad2, emoji: '🎮' },
  { name: 'Word Games', count: 9, icon: null, emoji: '📝' },
  { name: 'Reflex Games', count: 6, icon: Zap, emoji: '⚡' },
  { name: 'Puzzle Games', count: 5, icon: Puzzle, emoji: '🧩' },
  { name: 'Visual Games', count: 4, icon: Eye, emoji: '👁️' },
  { name: 'Memory Games', count: 4, icon: Brain, emoji: '🧠' },
  { name: 'Emoji Games', count: 3, icon: Smile, emoji: '😊' },
  { name: 'Geography', count: 3, icon: Globe, emoji: '🌍' },
  { name: 'Audio Games', count: 1, icon: Music, emoji: '🎵' },
  { name: 'Extreme', count: 1, icon: null, emoji: '🔥' },
]

// Games platform URL
const GAMES_PLATFORM_URL = 'https://crav-games-git-main-roy-hendersons-projects-1d3d5e94.vercel.app'

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handlePlayNow = () => {
    window.location.href = GAMES_PLATFORM_URL
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Gamepad2 className="w-12 h-12 md:w-16 md:h-16" />
              <h1 className="text-4xl md:text-6xl font-bold">
                CRAudioVizAI Games
              </h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Play {GAME_STATS.total} micro-games, premium challenges, and exclusive Extreme modes. 
              All games are free to play!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handlePlayNow}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
              >
                <Play className="w-5 h-5" />
                Play All {GAME_STATS.total} Games
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                <Crown className="w-5 h-5" />
                View Premium Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              {GAME_STATS.total}
            </div>
            <div className="text-gray-600">Total Games</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
              {GAME_STATS.alwaysFree}
            </div>
            <div className="text-gray-600">Always Free</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
              11
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              {GAME_STATS.extreme}
            </div>
            <div className="text-gray-600">Extreme Challenge</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Always Free Games</h3>
            <p className="text-gray-600">
              Play {GAME_STATS.alwaysFree} games completely free, no account required. 
              Perfect for quick entertainment.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Modes</h3>
            <p className="text-gray-600">
              Unlock advanced features, global leaderboards, and exclusive game modes 
              with a premium subscription.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Extreme Challenges</h3>
            <p className="text-gray-600">
              {GAME_STATS.extreme} Extreme game available with events and exclusive content 
              for Elite members.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Game Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {GAME_CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={handlePlayNow}
              className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="text-4xl mb-3">{category.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.count} games</p>
            </button>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Jump into our game library and start playing instantly. No downloads, no waiting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePlayNow}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              Launch Games Platform
              <ExternalLink className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Build Your Own Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Build Your Own Game?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Use our AI-powered tools to create your own games without coding. 
          From simple puzzles to complex adventures.
        </p>
        <Link
          href="/apps"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Explore App Builder
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
