import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileButton } from '@/components/mobile';
import { Gamepad2, Trophy, Star, Zap, Crown, Users, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Real game categories with actual counts from the games platform
const gameCategories = [
  { name: 'Daily Challenges', count: 185, emoji: '📅', description: 'New challenges every day' },
  { name: 'Original Games', count: 41, emoji: '🎮', description: 'Unique CR AudioViz exclusives' },
  { name: 'Word Games', count: 9, emoji: '📝', description: 'Test your vocabulary' },
  { name: 'Reflex Games', count: 6, emoji: '⚡', description: 'Speed and reaction tests' },
  { name: 'Puzzle Games', count: 5, emoji: '🧩', description: 'Brain-teasing challenges' },
  { name: 'Visual Games', count: 4, emoji: '👁️', description: 'Pattern recognition' },
  { name: 'Memory Games', count: 4, emoji: '🧠', description: 'Train your memory' },
  { name: 'Emoji Games', count: 3, emoji: '😀', description: 'Fun with emojis' },
  { name: 'Geography', count: 3, emoji: '🌍', description: 'Explore the world' },
  { name: 'Audio Games', count: 1, emoji: '🎵', description: 'Sound-based challenges' },
  { name: 'Extreme', count: 1, emoji: '💀', description: 'Ultimate difficulty' },
];

const GAMES_PLATFORM_URL = 'https://crav-games-git-main-roy-hendersons-projects-1d3d5e94.vercel.app';

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white px-4 py-12 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Gamepad2 className="w-5 h-5" />
              <span className="text-sm font-medium">CR AudioViz AI Games Platform</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              262 Games. Always Free.
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Play instantly in your browser. No downloads, no sign-up required. 
              Premium modes available for enhanced challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={GAMES_PLATFORM_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Play All 262 Games
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Link href="/apps">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Build Your Own Game
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="border-2 border-purple-200">
                <CardContent className="p-4 md:p-6 text-center">
                  <Gamepad2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">262</div>
                  <div className="text-sm text-gray-600">Total Games</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200">
                <CardContent className="p-4 md:p-6 text-center">
                  <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">262</div>
                  <div className="text-sm text-gray-600">Always Free</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4 md:p-6 text-center">
                  <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">11</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-200">
                <CardContent className="p-4 md:p-6 text-center">
                  <Zap className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">1</div>
                  <div className="text-sm text-gray-600">Extreme Challenge</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
              Why Play With Us?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free Games</h3>
                  <p className="text-gray-600 text-sm">
                    All 262 games are completely free to play. No paywalls, no ads interrupting gameplay.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Modes</h3>
                  <p className="text-gray-600 text-sm">
                    Unlock enhanced challenges, leaderboards, and exclusive content with premium credits.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Extreme Challenges</h3>
                  <p className="text-gray-600 text-sm">
                    Test your limits with our most difficult games. Only the best can conquer them.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                11 Game Categories
              </h2>
              <p className="text-gray-600">Something for everyone</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gameCategories.map((category) => (
                <a 
                  key={category.name}
                  href={GAMES_PLATFORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:border-purple-300 cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{category.emoji}</div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </h3>
                      <div className="text-xs text-gray-500 mb-2">{category.description}</div>
                      <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        {category.count} games
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Play?
            </h2>
            <p className="text-gray-300 mb-8">
              Jump into 262 games right now. No account required for free play.
            </p>
            <a href={GAMES_PLATFORM_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Launch Games Platform
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Build Your Own */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Want to Build Your Own Game?
            </h2>
            <p className="text-gray-600 mb-8">
              Use our AI-powered tools to create, publish, and monetize your own games.
            </p>
            <Link href="/apps">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Creator Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
