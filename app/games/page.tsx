'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileButton, MobileInput } from '@/components/mobile';
import { 
  Gamepad2, Search, Zap, Trophy, Users, Star, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const gameCategories = [
  {
    id: 'action',
    name: 'Action & Adventure',
    icon: '⚔️',
    count: 250,
    color: 'red',
    featured: ['Space Invaders', 'Platformer Hero', 'Dragon Quest']
  },
  {
    id: 'puzzle',
    name: 'Puzzle & Logic',
    icon: '🧩',
    count: 300,
    color: 'blue',
    featured: ['Sudoku Master', '2048 Evolved', 'Word Wizard']
  },
  {
    id: 'arcade',
    name: 'Arcade Classics',
    icon: '🕹️',
    count: 180,
    color: 'purple',
    featured: ['Pac-Man', 'Tetris', 'Snake']
  },
  {
    id: 'strategy',
    name: 'Strategy',
    icon: '♟️',
    count: 150,
    color: 'green',
    featured: ['Chess Master', 'Tower Defense', 'City Builder']
  },
  {
    id: 'sports',
    name: 'Sports & Racing',
    icon: '🏁',
    count: 120,
    color: 'orange',
    featured: ['Racing Thunder', 'Soccer Pro', 'Basketball Star']
  },
  {
    id: 'casual',
    name: 'Casual & Hyper-Casual',
    icon: '🎲',
    count: 200,
    color: 'pink',
    featured: ['Bubble Pop', 'Match 3', 'Flappy Fun']
  }
];

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = gameCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.featured.some(game => game.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalGames = gameCategories.reduce((sum, cat) => sum + cat.count, 0);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-100' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-100' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
              {totalGames.toLocaleString()}+ Games Library
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8">
              Play instantly, customize, or build your own games with AI assistance
            </p>
            <MobileInput
              type="search"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="max-w-2xl mx-auto bg-white/90 text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{totalGames.toLocaleString()}+</div>
                <div className="text-xs md:text-sm text-gray-600">Total Games</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">6</div>
                <div className="text-xs md:text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">0s</div>
                <div className="text-xs md:text-sm text-gray-600">Load Time</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100K+</div>
                <div className="text-xs md:text-sm text-gray-600">Players</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              Browse by Category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCategories.map((category) => {
                const colors = getColorClasses(category.color);
                
                return (
                  <Card 
                    key={category.id}
                    className={`${colors.border} border-2 ${colors.hover} transition-all cursor-pointer`}
                  >
                    <CardHeader className="p-4 md:p-6">
                      <div className="text-center mb-3 md:mb-4">
                        <div className="text-5xl md:text-6xl mb-3">{category.icon}</div>
                        <CardTitle className="text-lg md:text-xl">
                          {category.name}
                        </CardTitle>
                        <p className={`text-sm ${colors.text} font-semibold mt-2`}>
                          {category.count} games
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="mb-4">
                        <p className="text-xs md:text-sm font-semibold text-gray-600 mb-2">
                          Featured:
                        </p>
                        <div className="space-y-1">
                          {category.featured.map((game, idx) => (
                            <div key={idx} className="text-xs md:text-sm text-gray-600">
                              • {game}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link href={`/games?category=${category.id}`} className="block">
                        <MobileButton
                          fullWidth
                          size="sm"
                          className={`${colors.bg} ${colors.text} ${colors.hover} border-0`}
                        >
                          Browse Games
                        </MobileButton>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No games found</h3>
                <p className="text-gray-600 mb-6">Try a different search term</p>
                <MobileButton
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                >
                  Clear Search
                </MobileButton>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Build Your Own Game */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <Card className="max-w-5xl mx-auto border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  Build Your Own Game
                </CardTitle>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-gray-600">
                Use Javari AI to create custom games - no coding required
              </p>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">🎮</div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                    Any Genre
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Create any type of game
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                    Fast Build
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Ready in minutes
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                    Earn 70%
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Sell on marketplace
                  </p>
                </div>
              </div>
              <Link href="/apps" className="block">
                <MobileButton 
                  fullWidth
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Building
                </MobileButton>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Play?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Access all {totalGames.toLocaleString()}+ games with any subscription
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                Start Playing Free
              </MobileButton>
            </Link>
            <Link href="/pricing" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                View Plans
              </MobileButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
