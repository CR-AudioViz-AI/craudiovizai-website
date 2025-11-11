import { NextResponse } from 'next/server'
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

// Define available apps - this could later be moved to a database

// Force dynamic rendering - required for using dynamic Next.js features
export const dynamic = 'force-dynamic';

const AVAILABLE_APPS = [
  {
    id: 'logo-creator',
    name: 'Logo Creator',
    description: 'Create professional logos with AI',
    category: 'design',
    creditsPerUse: 5,
    icon: '🎨',
    url: '/apps/logo-creator',
    status: 'active'
  },
  {
    id: 'ebook-creator',
    name: 'Ebook Creator',
    description: 'Generate complete ebooks with AI',
    category: 'content',
    creditsPerUse: 10,
    icon: '📚',
    url: '/apps/ebook-creator',
    status: 'active'
  },
  {
    id: 'music-builder',
    name: 'Music Builder',
    description: 'Create original music tracks',
    category: 'audio',
    creditsPerUse: 8,
    icon: '🎵',
    url: '/apps/music-builder',
    status: 'active'
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Edit and enhance videos with AI',
    category: 'video',
    creditsPerUse: 15,
    icon: '🎬',
    url: '/apps/video-editor',
    status: 'coming-soon'
  },
  {
    id: 'social-scheduler',
    name: 'Social Media Scheduler',
    description: 'Schedule and manage social posts',
    category: 'marketing',
    creditsPerUse: 3,
    icon: '📱',
    url: '/apps/social-scheduler',
    status: 'active'
  },
  {
    id: 'landing-page-builder',
    name: 'Landing Page Builder',
    description: 'Build conversion-optimized landing pages',
    category: 'web',
    creditsPerUse: 7,
    icon: '🌐',
    url: '/apps/landing-page-builder',
    status: 'active'
  },
  {
    id: 'paycheck-calculator',
    name: 'Paycheck Calculator',
    description: 'Calculate take-home pay and deductions',
    category: 'finance',
    creditsPerUse: 1,
    icon: '💰',
    url: '/apps/paycheck-calculator',
    status: 'active'
  }
]

export async function GET(request: Request) {
  try {
    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let apps = AVAILABLE_APPS

    // Filter by category if specified
    if (category) {
      apps = apps.filter(app => app.category === category)
    }

    // Filter by status if specified
    if (status) {
      apps = apps.filter(app => app.status === status)
    }

    // Get unique categories
    const categories = Array.from(new Set(AVAILABLE_APPS.map(app => app.category)))

    return NextResponse.json({
      apps,
      categories,
      total: apps.length
    })

  } catch (error: unknown) {
    logError('Apps list API error:\', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
