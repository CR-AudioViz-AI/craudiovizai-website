import { MobileButton } from '@/components/mobile';
import Link from 'next/link';
import { CreditCard, Folder, TrendingUp, Crown, Bot, ShoppingCart, Palette, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">CR AudioViz AI</Link>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 md:gap-2 bg-blue-50 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                <span className="text-xs md:text-sm font-bold text-gray-600">CR=</span>
                <span className="text-lg md:text-2xl font-bold text-blue-600">0</span>
              </div>
              <Link href="/pricing" className="hidden sm:block">
                <MobileButton size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Buy Credits
                </MobileButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">Welcome to Your Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-gray-600 text-xs md:text-sm">Credits Balance</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">0</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <span className="text-gray-600 text-xs md:text-sm">Projects</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">0</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <span className="text-gray-600 text-xs md:text-sm">Credits Used</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">0</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              <span className="text-gray-600 text-xs md:text-sm">Plan</span>
            </div>
            <div className="text-lg md:text-xl font-bold">Free</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a 
              href="https://javari-ai.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-4 md:p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center active:scale-95"
            >
              <Bot className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-2 md:mb-3" />
              <div className="font-bold text-sm md:text-base">Chat with Javari AI</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Start building something new</div>
            </a>
            <Link 
              href="/pricing" 
              className="p-4 md:p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center active:scale-95"
            >
              <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-green-600 mx-auto mb-2 md:mb-3" />
              <div className="font-bold text-sm md:text-base">Buy Credits</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Get more credits to build</div>
            </Link>
            <Link 
              href="/apps" 
              className="p-4 md:p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center active:scale-95"
            >
              <Palette className="w-10 h-10 md:w-12 md:h-12 text-purple-600 mx-auto mb-2 md:mb-3" />
              <div className="font-bold text-sm md:text-base">Browse Tools</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Explore 60+ creative tools</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 lg:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Recent Activity</h2>
          <div className="text-center py-8 md:py-12 text-gray-500">
            <Clock className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-sm md:text-base mb-4">No activity yet. Start building something!</p>
            <a 
              href="https://javari-ai.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <MobileButton className="bg-blue-600 hover:bg-blue-700">
                Chat with Javari AI
              </MobileButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
