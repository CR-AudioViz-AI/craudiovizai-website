'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileButton, MobileInput } from '@/components/mobile';
import { 
  Users, Search, Code, Heart, Shield, DollarSign,
  TrendingUp, Lightbulb, Award, Brain, Zap, MessageSquare,
  Target, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const avatarCategories = [
  {
    name: 'Core Operations',
    color: 'blue',
    avatars: [
      { id: 'javari', name: 'Javari AI', title: 'CTO', icon: Code, description: 'Autonomous development, builds production apps' },
      { id: 'pulse', name: 'Pulse', title: 'Emergency Fixer', icon: Zap, description: 'Code emergencies, instant debugging' },
      { id: 'aria', name: 'Aria', title: 'People & Culture', icon: Heart, description: 'HR, culture, team building' },
      { id: 'lexis', name: 'Lexis', title: 'Legal Officer', icon: Shield, description: 'Legal, compliance, contracts' },
      { id: 'sage', name: 'Sage', title: 'CFO', icon: DollarSign, description: 'Finance, strategy, forecasting' }
    ]
  },
  {
    name: 'Innovation',
    color: 'purple',
    avatars: [
      { id: 'nova', name: 'Nova', title: 'Innovation Officer', icon: Lightbulb, description: 'Strategy, market insights' },
      { id: 'apex', name: 'Apex', title: 'Growth Director', icon: TrendingUp, description: 'Growth, scaling, analytics' },
      { id: 'cipher', name: 'Cipher', title: 'AI Research', icon: Brain, description: 'AI research, ML models' }
    ]
  },
  {
    name: 'Customer Success',
    color: 'green',
    avatars: [
      { id: 'amara', name: 'Amara', title: 'Training Director', icon: Award, description: 'Training, onboarding, success' },
      { id: 'echo', name: 'Echo', title: 'Support Lead', icon: MessageSquare, description: 'Customer support, tickets' },
      { id: 'phoenix', name: 'Phoenix', title: 'Account Manager', icon: Target, description: 'Account management, retention' }
    ]
  }
];

export default function AvatarsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = avatarCategories.map(category => ({
    ...category,
    avatars: category.avatars.filter(avatar =>
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.avatars.length > 0);

  const totalAvatars = avatarCategories.reduce((sum, cat) => sum + cat.avatars.length, 0);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-100' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
              31 AI Business Avatars
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8">
              Expert AI assistants for every business function - from development to marketing
            </p>
            <MobileInput
              type="search"
              placeholder="Search avatars..."
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
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">31</div>
                <div className="text-xs md:text-sm text-gray-600">Total Avatars</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-xs md:text-sm text-gray-600">Always Available</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Brain className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI</div>
                <div className="text-xs md:text-sm text-gray-600">Powered</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Expert</div>
                <div className="text-xs md:text-sm text-gray-600">Specialists</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Categories */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
            {filteredCategories.map((category) => {
              const colors = getColorClasses(category.color);
              
              return (
                <div key={category.name}>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                    {category.name}
                    <span className="text-base md:text-lg text-gray-500 ml-3">
                      ({category.avatars.length})
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.avatars.map((avatar) => {
                      const Icon = avatar.icon;
                      
                      return (
                        <Card 
                          key={avatar.id}
                          className={`${colors.border} border-2 ${colors.hover} transition-all`}
                        >
                          <CardHeader className="p-4 md:p-6">
                            <div className={`w-12 h-12 md:w-16 md:h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                              <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colors.text}`} />
                            </div>
                            <CardTitle className="text-center">
                              <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                {avatar.name}
                              </div>
                              <div className={`text-xs md:text-sm font-semibold ${colors.text}`}>
                                {avatar.title}
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 md:p-6 pt-0">
                            <p className="text-xs md:text-sm text-gray-600 text-center mb-4">
                              {avatar.description}
                            </p>
                            <Link href={`/avatars/${avatar.id}`} className="block">
                              <MobileButton
                                fullWidth
                                size="sm"
                                className={`${colors.bg} ${colors.text} ${colors.hover} border-0`}
                              >
                                Meet {avatar.name}
                              </MobileButton>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No avatars found</h3>
              <p className="text-gray-600 mb-6">Try a different search term</p>
              <MobileButton
                onClick={() => setSearchQuery('')}
                variant="outline"
              >
                Clear Search
              </MobileButton>
            </div>
          )}

          {/* Coming Soon */}
          <div className="text-center mt-8 md:mt-12 p-6 md:p-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              More Avatars Coming Soon
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              20+ additional specialized avatars in development
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Meet Your AI Team?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Access all 31 expert avatars with a Creative Pro subscription
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Free Trial
              </MobileButton>
            </Link>
            <Link href="/team" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                View Full Team
              </MobileButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
