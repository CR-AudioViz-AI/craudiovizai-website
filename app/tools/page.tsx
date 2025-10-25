import Link from 'next/link';
import { 
  Wand2, Share2, FileText, QrCode, Image, Mail, Layout, 
  Palette, TrendingUp, Calendar, FileSpreadsheet, Video,
  Mic, Megaphone, Smartphone, Globe, Code, Sparkles
} from 'lucide-react';

/**
 * Tools Landing Page
 * Showcase all available creative tools
 * 
 * Session: 2025-10-25 - Saturday
 */

const TOOLS = [
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Create stunning AI-generated images from text descriptions',
    icon: Wand2,
    gradient: 'from-purple-500 to-pink-600',
    href: '/tools/image-generator',
    credits: 10,
    category: 'Creative',
    featured: true,
  },
  {
    id: 'social-media-post',
    name: 'Social Media Post Creator',
    description: 'Generate engaging content for any social platform',
    icon: Share2,
    gradient: 'from-blue-500 to-indigo-600',
    href: '/tools/social-media-post',
    credits: 5,
    category: 'Marketing',
    featured: true,
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Create professional, ATS-friendly resumes with AI assistance',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-600',
    href: '/tools/resume-builder',
    credits: 0,
    category: 'Professional',
    featured: true,
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create custom QR codes for websites, WiFi, and more',
    icon: QrCode,
    gradient: 'from-indigo-500 to-purple-600',
    href: '/tools/qr-code-generator',
    credits: 0,
    category: 'Utility',
    featured: true,
  },
  {
    id: 'email-template',
    name: 'Email Template Builder',
    description: 'Design professional email templates that convert',
    icon: Mail,
    gradient: 'from-red-500 to-orange-600',
    href: '/tools/email-template',
    credits: 5,
    category: 'Marketing',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'landing-page',
    name: 'Landing Page Builder',
    description: 'Build high-converting landing pages in minutes',
    icon: Layout,
    gradient: 'from-green-500 to-emerald-600',
    href: '/tools/landing-page',
    credits: 10,
    category: 'Marketing',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'logo-designer',
    name: 'Logo Designer',
    description: 'Create unique logos with AI-powered design',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-600',
    href: '/tools/logo-designer',
    credits: 15,
    category: 'Creative',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'seo-optimizer',
    name: 'SEO Optimizer',
    description: 'Optimize your content for search engines',
    icon: TrendingUp,
    gradient: 'from-yellow-500 to-orange-600',
    href: '/tools/seo-optimizer',
    credits: 5,
    category: 'Marketing',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar',
    description: 'Plan and schedule your content strategy',
    icon: Calendar,
    gradient: 'from-teal-500 to-cyan-600',
    href: '/tools/content-calendar',
    credits: 0,
    category: 'Marketing',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'spreadsheet-analyzer',
    name: 'Spreadsheet Analyzer',
    description: 'Get insights from your data with AI analysis',
    icon: FileSpreadsheet,
    gradient: 'from-green-600 to-teal-600',
    href: '/tools/spreadsheet-analyzer',
    credits: 10,
    category: 'Business',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Edit and enhance your videos with AI',
    icon: Video,
    gradient: 'from-purple-600 to-indigo-600',
    href: '/tools/video-editor',
    credits: 20,
    category: 'Creative',
    featured: false,
    comingSoon: true,
  },
  {
    id: 'podcast-creator',
    name: 'Podcast Creator',
    description: 'Create and edit podcasts with AI assistance',
    icon: Mic,
    gradient: 'from-blue-600 to-purple-600',
    href: '/tools/podcast-creator',
    credits: 15,
    category: 'Creative',
    featured: false,
    comingSoon: true,
  },
];

const CATEGORIES = [
  'All',
  'Creative',
  'Marketing',
  'Professional',
  'Business',
  'Utility',
];

export const metadata = {
  title: 'Creative Tools | CR AudioViz AI',
  description: '60+ AI-powered creative tools for content creation, marketing, and business',
};

export default function ToolsLandingPage() {
  const featuredTools = TOOLS.filter(tool => tool.featured);
  const availableTools = TOOLS.filter(tool => !tool.comingSoon);
  const comingSoonTools = TOOLS.filter(tool => tool.comingSoon);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Creative Tools</h1>
            <p className="text-xl mb-8 text-blue-100">
              60+ AI-powered tools to supercharge your creativity and productivity
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                <p className="font-semibold">{availableTools.length}</p>
                <p className="text-blue-100">Available Now</p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                <p className="font-semibold">{comingSoonTools.length}</p>
                <p className="text-blue-100">Coming Soon</p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg">
                <p className="font-semibold">$0</p>
                <p className="text-blue-100">Free to Start</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Tools */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map(tool => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${tool.gradient}`} />
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                        {tool.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {tool.credits === 0 ? 'Free' : `${tool.credits} credits`}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* All Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">All Tools</h2>
          
          {/* Available Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {availableTools.map(tool => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-xl transition-all p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                          {tool.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {tool.credits === 0 ? 'Free' : `${tool.credits} credits`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Coming Soon Tools */}
          {comingSoonTools.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Coming Soon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comingSoonTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="relative bg-white dark:bg-slate-800 rounded-lg shadow p-6 opacity-75"
                    >
                      <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded">
                        Coming Soon
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {tool.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                              {tool.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Something Amazing?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators using CR AudioViz AI tools
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 bg-white/20 backdrop-blur text-white border-2 border-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
