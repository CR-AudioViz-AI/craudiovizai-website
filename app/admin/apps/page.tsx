// CR AudioViz AI - Apps Management Page
// Session: 2025-10-24 1:02 PM EST
// Complete app catalog with usage statistics and management

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { 
  Sparkles, 
  Image, 
  Video, 
  Music, 
  Code, 
  Globe, 
  Gamepad2,
  BookOpen,
  Briefcase,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

// App definitions with metadata
const APPS_CATALOG = [
  {
    id: 'javari',
    name: 'Javari AI Assistant',
    description: 'Your personal AI assistant powered by OpenAI GPT-4 Turbo with streaming responses and memory.',
    icon: MessageSquare,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    href: '/apps/javari',
    credits: 10,
    category: 'AI Assistant',
    status: 'active' as const,
  },
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Create stunning images with DALL-E 3. Generate, refine, and export high-quality visuals.',
    icon: Image,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    href: '/apps/image-generator',
    credits: 50,
    category: 'Creative',
    status: 'active' as const,
  },
  {
    id: 'video-creator',
    name: 'AI Video Creator',
    description: 'Transform ideas into professional videos with AI-powered editing and effects.',
    icon: Video,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    href: '/apps/video-creator',
    credits: 100,
    category: 'Creative',
    status: 'active' as const,
  },
  {
    id: 'music-builder',
    name: 'Music Builder',
    description: 'Compose tracks with AI instruments. Stem export, mastering, and mixdown.',
    icon: Music,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    href: '/apps/music-builder',
    credits: 75,
    category: 'Creative',
    status: 'active' as const,
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    description: 'Generate production-ready code in any language with AI assistance and debugging.',
    icon: Code,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    href: '/apps/code-generator',
    credits: 20,
    category: 'Development',
    status: 'active' as const,
  },
  {
    id: 'website-builder',
    name: 'Website Builder',
    description: 'Launch production-grade sites with modular blocks and built-in SEO optimization.',
    icon: Globe,
    iconColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    href: '/apps/website-builder',
    credits: 60,
    category: 'Development',
    status: 'active' as const,
  },
  {
    id: 'game-creator',
    name: 'Game Creator',
    description: 'Build and deploy games with AI-powered game development tools and templates.',
    icon: Gamepad2,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    href: '/apps/game-creator',
    credits: 80,
    category: 'Creative',
    status: 'beta' as const,
  },
  {
    id: 'business-planner',
    name: 'Business Planner',
    description: 'Create comprehensive business plans with AI-powered market analysis and projections.',
    icon: Briefcase,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    href: '/apps/business-planner',
    credits: 40,
    category: 'Business',
    status: 'active' as const,
  },
  {
    id: 'learning',
    name: 'Learning Assistant',
    description: 'Personalized learning experiences with adaptive AI tutoring and progress tracking.',
    icon: BookOpen,
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    href: '/apps/learning',
    credits: 15,
    category: 'Education',
    status: 'active' as const,
  },
  {
    id: 'marketing',
    name: 'Marketing Assistant',
    description: 'AI-powered marketing campaigns, content strategy, and social media management.',
    icon: TrendingUp,
    iconColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    href: '/apps/marketing',
    credits: 30,
    category: 'Business',
    status: 'active' as const,
  },
];

interface AppStats {
  app_id: string;
  usage_count: number;
  total_credits_used: number;
  last_used: string | null;
}

export default async function AppsManagementPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null; // Layout will redirect
  }

  // Get usage statistics for all apps
  const { data: usageData } = await supabase
    .from('ai_generations')
    .select('app_type, credits_used, created_at')
    .eq('user_id', session.user.id);

  // Aggregate stats by app
  const appStatsMap = new Map<string, AppStats>();
  
  usageData?.forEach((record) => {
    const appId = record.app_type || 'unknown';
    const existing = appStatsMap.get(appId) || {
      app_id: appId,
      usage_count: 0,
      total_credits_used: 0,
      last_used: null,
    };

    existing.usage_count += 1;
    existing.total_credits_used += record.credits_used || 0;
    
    if (!existing.last_used || record.created_at > existing.last_used) {
      existing.last_used = record.created_at;
    }

    appStatsMap.set(appId, existing);
  });

  // Get user credits
  const { data: userData } = await supabase
    .from('users')
    .select('credits')
    .eq('id', session.user.id)
    .single();

  const currentCredits = userData?.credits || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apps Management</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor all your AI-powered applications
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Available Credits</div>
            <div className="text-2xl font-bold text-gray-900">
              {currentCredits.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="text-sm text-gray-600">Total Apps</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {APPS_CATALOG.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">available</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="text-sm text-gray-600">Apps Used</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {appStatsMap.size}
          </div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="text-sm text-gray-600">Total Generations</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {usageData?.length || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">all time</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="text-sm text-gray-600">Credits Spent</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {Array.from(appStatsMap.values())
              .reduce((sum, stat) => sum + stat.total_credits_used, 0)
              .toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">total</div>
        </div>
      </div>

      {/* Apps Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS_CATALOG.map((app) => {
            const Icon = app.icon;
            const stats = appStatsMap.get(app.id);
            const hasBeenUsed = !!stats;

            return (
              <div
                key={app.id}
                className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all p-6 ${app.borderColor}`}
              >
                {/* App Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${app.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${app.iconColor}`} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {app.status === 'beta' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Beta
                      </span>
                    )}
                    {hasBeenUsed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* App Info */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>

                {/* Stats */}
                {hasBeenUsed ? (
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">Uses</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {stats.usage_count}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Credits</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {stats.total_credits_used}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 italic">Not yet used</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {app.credits} credits/use
                  </span>
                  <Link
                    href={app.href}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Open App
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Want to build your own AI app?
            </h3>
            <p className="text-gray-700 mb-4">
              Check out our developer portal to learn how to create and integrate custom AI applications
              into the CR AudioViz AI platform.
            </p>
            <div className="flex gap-3">
              <Link
                href="/developer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Developer Portal
              </Link>
              <Link
                href="/docs/api"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
