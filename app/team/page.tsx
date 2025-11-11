'use client';

// ================================================================================
// CR AUDIOVIZ AI - TEAM ROSTER PAGE
// Meet our complete team of 31 AI avatars
// ================================================================================

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, MessageSquare, Search, Filter,
  Code, Heart, Shield, DollarSign, Lightbulb,
  TrendingUp, Target, Award, Brain, Zap
} from 'lucide-react';

interface Avatar {
  id: string;
  name: string;
  title: string;
  department: string;
  tier: string;
  description: string;
  imageUrl: string;
  hasImage: boolean;
  primaryColor: string;
  icon: any;
}

const avatarData: Avatar[] = [
  // TIER 1: CORE OPERATIONS
  {
    id: 'javari',
    name: 'Javari AI',
    title: 'Chief Technology Officer',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Master builder who codes in her sleep. Makes impossible apps happen.',
    imageUrl: '/avatars/javariavatar.png',
    hasImage: true,
    primaryColor: 'blue',
    icon: Code
  },
  {
    id: 'pulse',
    name: 'Pulse',
    title: 'Code Czar & Emergency Fixer',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Emergency response for code. When systems break, Pulse fixes it.',
    imageUrl: '/avatars/PulseAvatar.png',
    hasImage: false,
    primaryColor: 'red',
    icon: Zap
  },
  {
    id: 'aria',
    name: 'Aria',
    title: 'Chief People & Culture Officer',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'The person everyone trusts. Warm, nurturing, builds amazing culture.',
    imageUrl: '/avatars/aria.png',
    hasImage: false,
    primaryColor: 'purple',
    icon: Heart
  },
  {
    id: 'lexis',
    name: 'Lexis',
    title: 'Chief Legal & Compliance Officer',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Former federal prosecutor. Commands respect. Fair but firm.',
    imageUrl: '/avatars/lexis.png',
    hasImage: false,
    primaryColor: 'gray',
    icon: Shield
  },
  {
    id: 'sage',
    name: 'Sage',
    title: 'Chief Financial Officer',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Wall Street veteran. Strategic finance master. Trusted advisor.',
    imageUrl: '/avatars/sage.png',
    hasImage: false,
    primaryColor: 'green',
    icon: DollarSign
  },
  {
    id: 'amara',
    name: 'Amara',
    title: 'Training Director & User Success',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Makes learning effortless. That smile makes everyone feel capable.',
    imageUrl: '/avatars/amara.png',
    hasImage: false,
    primaryColor: 'teal',
    icon: Lightbulb
  },
  {
    id: 'kairo',
    name: 'Kairo',
    title: 'Chief Innovation Officer',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Creative genius who makes the impossible beautiful.',
    imageUrl: '/avatars/KairoAvatar.png',
    hasImage: true,
    primaryColor: 'indigo',
    icon: Brain
  },
  {
    id: 'crai',
    name: 'CRAI',
    title: 'CRAIverse Director & Social Impact',
    department: 'Core Operations',
    tier: 'Tier 1',
    description: 'Your guide to social impact. Heart of the CRAIverse.',
    imageUrl: '/avatars/craiavatar.png',
    hasImage: true,
    primaryColor: 'purple',
    icon: Heart
  },

  // TIER 2: REVENUE GENERATION
  {
    id: 'echo',
    name: 'Echo',
    title: 'CMO Senior VP',
    department: 'Revenue Generation',
    tier: 'Tier 2',
    description: 'Digital marketing prodigy. Creates viral campaigns. Always three trends ahead.',
    imageUrl: '/avatars/echo.png',
    hasImage: false,
    primaryColor: 'purple',
    icon: TrendingUp
  },
  {
    id: 'blitz',
    name: 'Blitz',
    title: 'Social Media & Viral Marketing',
    department: 'Revenue Generation',
    tier: 'Tier 2',
    description: 'Social media wizard. Lives online. Creates viral moments.',
    imageUrl: '/avatars/blitz.png',
    hasImage: false,
    primaryColor: 'blue',
    icon: TrendingUp
  },
  {
    id: 'scribe',
    name: 'Scribe',
    title: 'Content Marketing & Newsletter',
    department: 'Revenue Generation',
    tier: 'Tier 2',
    description: 'Master storyteller. Turns complex topics into compelling narratives.',
    imageUrl: '/avatars/scribe.png',
    hasImage: false,
    primaryColor: 'emerald',
    icon: MessageSquare
  },
  {
    id: 'atlas',
    name: 'Atlas',
    title: 'Chief Sales Officer',
    department: 'Revenue Generation',
    tier: 'Tier 2',
    description: 'Natural leader. Builds relationships instantly. Closer with heart.',
    imageUrl: '/avatars/atlas.png',
    hasImage: false,
    primaryColor: 'blue',
    icon: Target
  },
  {
    id: 'harmony',
    name: 'Harmony',
    title: 'Chief Customer Success Officer',
    department: 'Revenue Generation',
    tier: 'Tier 2',
    description: 'Makes customers feel like family. Problem-solver with heart.',
    imageUrl: '/avatars/harmony.png',
    hasImage: false,
    primaryColor: 'pink',
    icon: Heart
  },
  {
    id: 'forge',
    name: 'Forge',
    title: 'Physical Products Director',
    department: 'Revenue Generation',
    tier: 'Tier 2',
    description: 'Bridges digital and physical. Creates things people want to touch.',
    imageUrl: '/avatars/forge.png',
    hasImage: false,
    primaryColor: 'orange',
    icon: Award
  },

  // TIER 3: INTELLIGENCE
  {
    id: 'scout',
    name: 'Scout',
    title: 'Intelligence & Opportunity Hunter',
    department: 'Intelligence',
    tier: 'Tier 3',
    description: 'Pattern recognition genius. Three steps ahead of competition.',
    imageUrl: '/avatars/ScoutAvatar.png',
    hasImage: false,
    primaryColor: 'teal',
    icon: Search
  },

  // TIER 4: EDUCATION
  {
    id: 'nova',
    name: 'Nova',
    title: 'Chief Learning Officer',
    department: 'Education',
    tier: 'Tier 4',
    description: 'Makes learning exciting. Innovation meets education.',
    imageUrl: '/avatars/nova.png',
    hasImage: false,
    primaryColor: 'yellow',
    icon: Lightbulb
  },

  // TIER 5: OPERATIONAL EXCELLENCE
  {
    id: 'nexus',
    name: 'Nexus',
    title: 'Chief Information Security Officer',
    department: 'Operations',
    tier: 'Tier 5',
    description: 'Guardian of digital security. Always watching, always protecting.',
    imageUrl: '/avatars/nexus.png',
    hasImage: false,
    primaryColor: 'red',
    icon: Shield
  },
  {
    id: 'vector',
    name: 'Vector',
    title: 'Product Director & Data Science',
    department: 'Operations',
    tier: 'Tier 5',
    description: 'Data scientist meets product visionary. Turns insights into features.',
    imageUrl: '/avatars/vector.png',
    hasImage: false,
    primaryColor: 'blue',
    icon: Brain
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    title: 'Business Development Director',
    department: 'Operations',
    tier: 'Tier 5',
    description: 'Opens doors. Creates partnerships. Sees opportunities everywhere.',
    imageUrl: '/avatars/catalyst.png',
    hasImage: false,
    primaryColor: 'purple',
    icon: TrendingUp
  },
  {
    id: 'oracle',
    name: 'Oracle',
    title: 'Chief Data Officer',
    department: 'Operations',
    tier: 'Tier 5',
    description: 'Sees the future in data. Predicts trends. Turns analytics into strategy.',
    imageUrl: '/avatars/oracle.png',
    hasImage: false,
    primaryColor: 'indigo',
    icon: Brain
  },

  // TIER 6: EXECUTIVE SUPPORT
  {
    id: 'stride',
    name: 'Stride',
    title: 'Chief Operating Officer',
    department: 'Executive',
    tier: 'Tier 6',
    description: 'Makes operations smooth. Scaling expert. Process perfection.',
    imageUrl: '/avatars/stride.png',
    hasImage: false,
    primaryColor: 'gray',
    icon: Target
  },
  {
    id: 'summit',
    name: 'Summit',
    title: 'Enterprise Success Director',
    department: 'Executive',
    tier: 'Tier 6',
    description: 'Enterprise expert. VIP treatment master. High-touch relationships.',
    imageUrl: '/avatars/summit.png',
    hasImage: false,
    primaryColor: 'blue',
    icon: Award
  },
  {
    id: 'vision',
    name: 'Vision',
    title: 'Chief Strategy Officer',
    department: 'Executive',
    tier: 'Tier 6',
    description: 'Sees the future. Strategic genius. Three moves ahead always.',
    imageUrl: '/avatars/vision.png',
    hasImage: false,
    primaryColor: 'purple',
    icon: Lightbulb
  },

  // TIER 7: GAMING
  {
    id: 'zephyr',
    name: 'Zephyr',
    title: 'Gaming & Events Director',
    department: 'Gaming',
    tier: 'Tier 7',
    description: 'Gaming guru. Community builder. Creates unforgettable experiences.',
    imageUrl: '/avatars/zephyr.png',
    hasImage: false,
    primaryColor: 'green',
    icon: Award
  },

  // TIER 8: COMMUNITY
  {
    id: 'unity',
    name: 'Unity',
    title: 'Community Manager',
    department: 'Community',
    tier: 'Tier 8',
    description: 'Community heart. Makes everyone feel they belong.',
    imageUrl: '/avatars/unity.png',
    hasImage: false,
    primaryColor: 'pink',
    icon: Heart
  },

  // TIER 9: SOCIAL IMPACT
  {
    id: 'beacon',
    name: 'Beacon',
    title: 'Social Impact Director',
    department: 'Social Impact',
    tier: 'Tier 9',
    description: 'Creates real social impact. Connects communities. Changes lives.',
    imageUrl: '/avatars/beacon.png',
    hasImage: false,
    primaryColor: 'orange',
    icon: Heart
  },

  // TIER 10: CREATIVE
  {
    id: 'pixel',
    name: 'Pixel',
    title: 'Design Systems Lead',
    department: 'Creative',
    tier: 'Tier 10',
    description: 'Design perfection. System thinker. Creates beautiful consistency.',
    imageUrl: '/avatars/pixel.png',
    hasImage: false,
    primaryColor: 'pink',
    icon: Brain
  },
  {
    id: 'tempo',
    name: 'Tempo',
    title: 'Product Marketing Director',
    department: 'Creative',
    tier: 'Tier 10',
    description: 'Launch expert. Product storyteller. Positioning master.',
    imageUrl: '/avatars/tempo.png',
    hasImage: false,
    primaryColor: 'purple',
    icon: TrendingUp
  },
  {
    id: 'motion',
    name: 'Motion',
    title: 'Animation & Video Director',
    department: 'Creative',
    tier: 'Tier 10',
    description: 'Brings stories to life. Visual magic creator. Motion master.',
    imageUrl: '/avatars/motion.png',
    hasImage: false,
    primaryColor: 'blue',
    icon: Brain
  },

  // TIER 11: TECHNICAL
  {
    id: 'verify',
    name: 'Verify',
    title: 'QA & Testing Lead',
    department: 'Technical',
    tier: 'Tier 11',
    description: 'Quality guardian. Nothing ships broken. Testing perfection.',
    imageUrl: '/avatars/verify.png',
    hasImage: false,
    primaryColor: 'green',
    icon: Shield
  },
  {
    id: 'flux',
    name: 'Flux',
    title: 'Performance Optimization Lead',
    department: 'Technical',
    tier: 'Tier 11',
    description: 'Makes everything faster. Performance perfectionist. Speed demon.',
    imageUrl: '/avatars/flux.png',
    hasImage: false,
    primaryColor: 'yellow',
    icon: Zap
  },
];

export default function TeamRosterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const departments = ['all', ...Array.from(new Set(avatarData.map(a => a.department)))];
  const tiers = ['all', ...Array.from(new Set(avatarData.map(a => a.tier)))];

  const filteredAvatars = avatarData.filter(avatar => {
    const matchesSearch = avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avatar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avatar.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || avatar.department === selectedDepartment;
    const matchesTier = selectedTier === 'all' || avatar.tier === selectedTier;
    
    return matchesSearch && matchesDepartment && matchesTier;
  });

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
      orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500' },
      gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500' },
      emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500' },
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
            <span className="text-blue-200 font-medium">Meet Our Team</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            31 AI Avatars<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Working Together
            </span>
          </h1>
          
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Each avatar brings unique expertise and personality. Click any avatar to start a conversation
            and experience the future of AI-powered assistance.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/bots/status">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                <Code className="w-5 h-5 mr-2" />
                View Bot Status
              </Button>
            </Link>
            <Link href="/admin/bots">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search avatars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white appearance-none cursor-pointer"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept} className="bg-gray-900">
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white appearance-none cursor-pointer"
              >
                {tiers.map(tier => (
                  <option key={tier} value={tier} className="bg-gray-900">
                    {tier === 'all' ? 'All Tiers' : tier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-center text-blue-200">
            Showing {filteredAvatars.length} of {avatarData.length} avatars
          </div>
        </div>
      </section>

      {/* Avatar Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAvatars.map((avatar) => {
              const Icon = avatar.icon;
              const colors = getColorClasses(avatar.primaryColor);
              
              return (
                <Link key={avatar.id} href={`/avatars/${avatar.id}`}>
                  <Card className="bg-white/5 backdrop-blur border-white/10 hover:border-white/30 transition-all cursor-pointer group hover:transform hover:scale-105">
                    <CardHeader className="pb-4">
                      {/* Avatar Image or Placeholder */}
                      <div className={`relative w-24 h-24 mx-auto mb-4 rounded-full border-4 ${colors.border} overflow-hidden ${colors.bg}/20`}>
                        {avatar.hasImage ? (
                          <Image
                            src={avatar.imageUrl}
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
                        {avatar.title}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-gray-300 text-sm text-center mb-4 line-clamp-2">
                        {avatar.description}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge variant="outline" className="border-white/20 text-white text-xs">
                          {avatar.department}
                        </Badge>
                        <Badge variant="outline" className={`border-white/20 text-xs ${colors.text}`}>
                          {avatar.tier}
                        </Badge>
                      </div>

                      <Button 
                        className={`w-full mt-4 ${colors.bg} hover:opacity-90 text-white`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat with {avatar.name}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience AI-Powered Excellence?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Each avatar is available 24/7 to help you succeed.
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