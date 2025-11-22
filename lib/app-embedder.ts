// CR AudioViz AI - Unified App Embedding System
// Location: lib/app-embedder.ts

export interface EmbeddedApp {
  id: string
  name: string
  slug: string
  description: string
  category: 'creative' | 'business' | 'developer' | 'analysis' | 'gaming'
  icon: string
  deploymentUrl: string
  repository: string
  status: 'active' | 'beta' | 'coming-soon'
  credits: {
    free: number
    pro: number
  }
  javariEnabled: boolean
  features: string[]
}

export const EMBEDDED_APPS: EmbeddedApp[] = [
  // CREATIVE TOOLS
  {
    id: 'ebook-creator',
    name: 'eBook Creator',
    slug: 'ebook-creator',
    description: 'Create professional eBooks with AI assistance',
    category: 'creative',
    icon: '📚',
    deploymentUrl: 'https://crav-ebook-creator.vercel.app',
    repository: 'crav-ebook-creator',
    status: 'active',
    credits: { free: 10, pro: 1 },
    javariEnabled: true,
    features: ['AI Writing', 'Templates', 'Export PDF/EPUB', 'Cover Design']
  },
  {
    id: 'logo-studio',
    name: 'Logo Studio',
    slug: 'logo-studio',
    description: 'Design professional logos in minutes',
    category: 'creative',
    icon: '🎨',
    deploymentUrl: 'https://crav-logo-studio.vercel.app',
    repository: 'crav-logo-studio',
    status: 'active',
    credits: { free: 5, pro: 1 },
    javariEnabled: true,
    features: ['AI Generation', 'Vector Export', '1000+ Templates', 'Brand Kit']
  },
  {
    id: 'site-builder',
    name: 'Site Builder',
    slug: 'site-builder',
    description: 'Build websites without code',
    category: 'creative',
    icon: '🌐',
    deploymentUrl: 'https://crav-site-builder.vercel.app',
    repository: 'crav-site-builder',
    status: 'active',
    credits: { free: 15, pro: 2 },
    javariEnabled: true,
    features: ['Drag & Drop', 'Responsive', 'SEO Tools', 'Custom Domain']
  },
  {
    id: 'pdf-builder',
    name: 'PDF Builder',
    slug: 'pdf-builder',
    description: 'Create and edit PDFs with ease',
    category: 'business',
    icon: '📄',
    deploymentUrl: 'https://crav-pdf-builder.vercel.app',
    repository: 'crav-pdf-builder',
    status: 'active',
    credits: { free: 10, pro: 1 },
    javariEnabled: true,
    features: ['Merge/Split', 'Edit Text', 'Fill Forms', 'Digital Signatures']
  },
  {
    id: 'newsletter',
    name: 'Newsletter Creator',
    slug: 'newsletter',
    description: 'Design beautiful email newsletters',
    category: 'business',
    icon: '📧',
    deploymentUrl: 'https://crav-newsletter.vercel.app',
    repository: 'crav-newsletter',
    status: 'beta',
    credits: { free: 5, pro: 1 },
    javariEnabled: false,
    features: ['AI Content', 'Templates', 'Analytics', 'Automation']
  },
  {
    id: 'music-builder',
    name: 'Music Builder',
    slug: 'music-builder',
    description: 'Compose music with AI',
    category: 'creative',
    icon: '🎵',
    deploymentUrl: 'https://crav-music-builder.vercel.app',
    repository: 'crav-music-builder',
    status: 'beta',
    credits: { free: 20, pro: 3 },
    javariEnabled: false,
    features: ['AI Composition', '50+ Instruments', 'MIDI Export', 'Stem Separation']
  },
  {
    id: 'social-graphics',
    name: 'Social Graphics',
    slug: 'social-graphics',
    description: 'Create social media graphics',
    category: 'creative',
    icon: '📱',
    deploymentUrl: 'https://crav-social-graphics.vercel.app',
    repository: 'crav-social-graphics',
    status: 'beta',
    credits: { free: 10, pro: 1 },
    javariEnabled: false,
    features: ['All Platforms', 'Templates', 'Brand Assets', 'Scheduling']
  },
  
  // BUSINESS TOOLS
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    slug: 'invoice-generator',
    description: 'Professional invoices in seconds',
    category: 'business',
    icon: '🧾',
    deploymentUrl: 'https://crav-invoice-generator.vercel.app',
    repository: 'crav-invoice-generator',
    status: 'beta',
    credits: { free: 5, pro: 1 },
    javariEnabled: false,
    features: ['Auto Calculations', 'Multi-Currency', 'Payment Tracking', 'Recurring']
  },
  {
    id: 'builder',
    name: 'Document Builder',
    slug: 'builder',
    description: 'Create any document with AI',
    category: 'business',
    icon: '📝',
    deploymentUrl: 'https://crav-builder.vercel.app',
    repository: 'crav-builder',
    status: 'active',
    credits: { free: 10, pro: 2 },
    javariEnabled: true,
    features: ['AI Writing', '100+ Templates', 'Collaboration', 'Export All Formats']
  },
  {
    id: 'legalease',
    name: 'LegalEase',
    slug: 'legalease',
    description: 'Translate legal ↔ plain English',
    category: 'business',
    icon: '⚖️',
    deploymentUrl: 'https://crav-legalease.vercel.app',
    repository: 'crav-legalease',
    status: 'active',
    credits: { free: 5, pro: 1 },
    javariEnabled: true,
    features: ['115+ Templates', 'AI Translation', 'Contract Review', 'Clause Library']
  },
  
  // ANALYSIS TOOLS
  {
    id: 'market-oracle',
    name: 'Market Oracle',
    slug: 'market-oracle',
    description: 'AI stock picking battle',
    category: 'analysis',
    icon: '📈',
    deploymentUrl: 'https://crav-market-oracle.vercel.app',
    repository: 'crav-market-oracle',
    status: 'active',
    credits: { free: 0, pro: 0 },
    javariEnabled: true,
    features: ['5 AI Models', 'Real-Time Data', 'Backtesting', 'Leaderboard']
  },
  {
    id: 'news-compare',
    name: 'News Compare',
    slug: 'news-compare',
    description: 'Compare news across sources',
    category: 'analysis',
    icon: '📰',
    deploymentUrl: 'https://crav-news-compare.vercel.app',
    repository: 'crav-news-compare',
    status: 'active',
    credits: { free: 0, pro: 0 },
    javariEnabled: true,
    features: ['Bias Detection', 'Source Comparison', 'Fact Checking', 'Trending Topics']
  },
  {
    id: 'competitive-intelligence',
    name: 'Competitive Intelligence',
    slug: 'competitive-intelligence',
    description: 'Track competitor news & trends',
    category: 'analysis',
    icon: '🔍',
    deploymentUrl: 'https://crav-competitive-intelligence.vercel.app',
    repository: 'crav-competitive-intelligence',
    status: 'active',
    credits: { free: 0, pro: 0 },
    javariEnabled: true,
    features: ['14 Categories', 'AI Analysis', 'Alerts', 'Reports']
  },
  
  // DEVELOPER TOOLS
  {
    id: 'verifyforge',
    name: 'VerifyForge',
    slug: 'verifyforge',
    description: 'Test websites, apps & APIs',
    category: 'developer',
    icon: '🧪',
    deploymentUrl: 'https://crav-verifyforge.vercel.app',
    repository: 'crav-verifyforge',
    status: 'beta',
    credits: { free: 20, pro: 3 },
    javariEnabled: false,
    features: ['Auto Testing', 'Load Testing', 'Security Scans', 'CI/CD Integration']
  },
  
  // GAMING
  {
    id: 'games',
    name: 'Games Platform',
    slug: 'games',
    description: '1,200+ free games',
    category: 'gaming',
    icon: '🎮',
    deploymentUrl: 'https://crav-games.vercel.app',
    repository: 'crav-games',
    status: 'active',
    credits: { free: 0, pro: 0 },
    javariEnabled: true,
    features: ['1200+ Games', 'Multiplayer', 'Tournaments', 'Creator Tools']
  },
  
  // AI ASSISTANT
  {
    id: 'javari',
    name: 'Javari AI',
    slug: 'javari',
    description: 'Your autonomous AI assistant',
    category: 'developer',
    icon: '🤖',
    deploymentUrl: 'https://javariai.com',
    repository: 'crav-javari',
    status: 'active',
    credits: { free: 0, pro: 0 },
    javariEnabled: true,
    features: ['Multi-AI', 'Code Generation', 'Knowledge Base', 'Auto-Fix']
  }
]

// Helper functions
export function getAppBySlug(slug: string): EmbeddedApp | undefined {
  return EMBEDDED_APPS.find(app => app.slug === slug)
}

export function getAppsByCategory(category: string): EmbeddedApp[] {
  return EMBEDDED_APPS.filter(app => app.category === category)
}

export function getActiveApps(): EmbeddedApp[] {
  return EMBEDDED_APPS.filter(app => app.status === 'active')
}

export function getAppsWithJavari(): EmbeddedApp[] {
  return EMBEDDED_APPS.filter(app => app.javariEnabled)
}

export function generateAppUrl(app: EmbeddedApp, embed: boolean = false): string {
  if (embed) {
    return `/apps/${app.slug}`
  }
  return app.deploymentUrl
}
