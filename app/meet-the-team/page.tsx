'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, MessageSquare, Search, Bot, 
  Code, Heart, Shield, DollarSign, Lightbulb,
  TrendingUp, Target, Award, Brain, Zap, Activity
} from 'lucide-react';

export default function MeetTheTeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['all', 'avatars', 'bots'];

  // Avatar data
  const avatars = [
    { id: 'javari', name: 'Javari AI', role: 'Chief Technology Officer', image: '/avatars/javariavatar.png', hasImage: true, color: 'blue', icon: Code },
    { id: 'pulse', name: 'Pulse', role: 'Code Czar & Emergency Fixer', image: '/avatars/PulseAvatar.png', hasImage: true, color: 'red', icon: Zap },
    { id: 'aria', name: 'Aria', role: 'Chief People Officer', image: '/avatars/aria.png', hasImage: false, color: 'purple', icon: Heart },
    { id: 'lexis', name: 'Lexis', role: 'Chief Legal Officer', image: '/avatars/lexis.png', hasImage: false, color: 'gray', icon: Shield },
    { id: 'sage', name: 'Sage', role: 'Chief Financial Officer', image: '/avatars/sage.png', hasImage: false, color: 'green', icon: DollarSign },
    { id: 'amara', name: 'Amara', role: 'Training Director', image: '/avatars/amara.png', hasImage: false, color: 'teal', icon: Lightbulb },
    { id: 'kairo', name: 'Kairo', role: 'Chief Innovation Officer', image: '/avatars/KairoAvatar.png', hasImage: true, color: 'indigo', icon: Brain },
    { id: 'crai', name: 'CRAI', role: 'CRAIverse Director', image: '/avatars/craiavatar.png', hasImage: true, color: 'purple', icon: Heart },
    { id: 'echo', name: 'Echo', role: 'CMO Senior VP', image: '/avatars/echo.png', hasImage: false, color: 'purple', icon: TrendingUp },
    { id: 'harmony', name: 'Harmony', role: 'Customer Success Officer', image: '/avatars/harmony.png', hasImage: false, color: 'pink', icon: Heart },
    { id: 'scout', name: 'Scout', role: 'Intelligence Officer', image: '/avatars/ScoutAvatar.png', hasImage: true, color: 'teal', icon: Search },
  ];

  // Bot data
  const bots = [
    { id: 'pulse-bot', name: 'Pulse Bot', role: 'Real-Time Vitals Monitor', frequency: 'Every 1 min', status: 'active', color: 'red', icon: Activity },
    { id: 'sentinel', name: 'Sentinel', role: 'Site Health Monitor', frequency: 'Every 2 min', status: 'active', color: 'blue', icon: Shield },
    { id: 'sentinel-api', name: 'Sentinel-API', role: 'API Health Monitor', frequency: 'Every 5 min', status: 'active', color: 'blue', icon: Code },
    { id: 'guardian', name: 'Guardian', role: 'Security Monitor', frequency: 'Every 10 min', status: 'active', color: 'yellow', icon: Shield },
    { id: 'sentinel-db', name: 'Sentinel-DB', role: 'Database Health Monitor', frequency: 'Every 5 min', status: 'active', color: 'green', icon: Shield },
    { id: 'conductor', name: 'Conductor', role: 'Workflow Orchestration', frequency: 'Every 15 min', status: 'active', color: 'purple', icon: TrendingUp },
    { id: 'architect', name: 'Architect', role: 'Infrastructure Monitor', frequency: 'Every 30 min', status: 'active', color: 'indigo', icon: Brain },
    { id: 'oracle', name: 'Oracle', role: 'Predictive Analytics', frequency: 'Every 60 min', status: 'active', color: 'purple', icon: Brain },
    { id: 'scout-bot', name: 'Scout Bot', role: 'Competitive Intelligence', frequency: 'Every 60 min', status: 'active', color: 'teal', icon: Search },
  ];

  const filteredAvatars = avatars.filter(avatar => 
    (selectedType === 'all' || selectedType === 'avatars') &&
    (avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     avatar.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBots = bots.filter(bot => 
    (selectedType === 'all' || selectedType === 'bots') &&
    (bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     bot.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string } } = {
      blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500' },
      red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500' },
      green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-500' },
      yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-500' },
      teal: { bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-500' },
      indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-500' },
      pink: { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500' },
      gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-blue-200 font-medium">Meet the Team</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your AI-Powered Team<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Working 24/7 For You
            </span>
          </h1>
          
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Meet our AI avatars and autonomous bots - your dedicated team of experts available
            around the clock to help you succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <Card className="bg-white/5 backdrop-blur border-white/10">
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">31</div>
                <div className="text-blue-200 text-sm">AI Avatars</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur border-white/10">
              <CardContent className="pt-6 text-center">
                <Bot className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">9</div>
                <div className="text-blue-200 text-sm">Active Bots</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur border-white/10">
              <CardContent className="pt-6 text-center">
                <Activity className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-200 text-sm">Always Online</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-2">
              {types.map(type => (
                <Button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  variant={selectedType === type ? 'default' : 'outline'}
                  className={selectedType === type ? 'bg-blue-600' : 'border-white/20 text-white hover:bg-white/10'}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Avatars Section */}
      {(selectedType === 'all' || selectedType === 'avatars') && filteredAvatars.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">AI Avatars</h2>
              <Badge className="bg-blue-600 text-white">
                {filteredAvatars.length} Available
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAvatars.map((avatar) => {
                const Icon = avatar.icon;
                const colors = getColorClasses(avatar.color);
                
                return (
                  <Link key={avatar.id} href={`/avatars/${avatar.id}`}>
                    <Card className="bg-white/5 backdrop-blur border-white/10 hover:border-white/30 transition-all cursor-pointer group hover:transform hover:scale-105">
                      <CardHeader className="pb-4">
                        <div className={`relative w-24 h-24 mx-auto mb-4 rounded-full border-4 ${colors.border} overflow-hidden ${colors.bg}/20`}>
                          {avatar.hasImage ? (
                            <Image
                              src={avatar.image}
                              alt={avatar.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon className={`w-12 h-12 ${colors.text}`} />
                            </div>
                          )}
                        </div>

                        <CardTitle className="text-white text-center text-xl mb-2">
                          {avatar.name}
                        </CardTitle>
                        
                        <p className="text-blue-200 text-sm text-center font-medium">
                          {avatar.role}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Button 
                          className={`w-full ${colors.bg} hover:opacity-90 text-white`}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/team">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  View All 31 Avatars →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bots Section */}
      {(selectedType === 'all' || selectedType === 'bots') && filteredBots.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Bot className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Autonomous Bots</h2>
              <Badge className="bg-green-600 text-white">
                All Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.map((bot) => {
                const Icon = bot.icon;
                const colors = getColorClasses(bot.color);
                
                return (
                  <Card key={bot.id} className="bg-white/5 backdrop-blur border-white/10">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 rounded-full ${colors.bg}/20 border-2 ${colors.border} flex items-center justify-center`}>
                          <Icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-xs text-green-400 font-medium">ACTIVE</span>
                        </div>
                      </div>

                      <CardTitle className="text-white text-xl mb-2">
                        {bot.name}
                      </CardTitle>
                      
                      <p className="text-blue-200 text-sm font-medium mb-2">
                        {bot.role}
                      </p>

                      <Badge variant="outline" className="border-white/20 text-white text-xs">
                        Runs {bot.frequency}
                      </Badge>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/bots/status">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  View Bot Dashboard →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work with Our Team?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Start chatting with any avatar or monitor our bots in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
