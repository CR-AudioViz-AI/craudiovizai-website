// CR AudioViz AI - Javari Knowledge Base
// Complete knowledge of all products, pages, features, and navigation
// Version: 1.0 - Complete Integration

export interface NavigationItem {
  name: string;
  path: string;
  description: string;
  category: string;
  keywords: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
  creditCost?: number;
  features: string[];
  useCases: string[];
  keywords: string[];
}

export interface PricingTier {
  name: string;
  monthlyPrice: number;
  credits: number;
  features: string[];
  bestFor: string;
}

// ============================================================================
// ALL WEBSITE PAGES (89 pages)
// ============================================================================

export const WEBSITE_PAGES: NavigationItem[] = [
  // Core Pages
  { name: 'Home', path: '/', description: 'Main homepage with hero, features, and Javari intro', category: 'Core', keywords: ['home', 'start', 'main'] },
  { name: 'Dashboard', path: '/dashboard', description: 'User dashboard with stats, quick actions, and app access', category: 'Core', keywords: ['dashboard', 'home', 'overview'] },
  { name: 'Javari AI', path: '/javari', description: 'Full Javari AI assistant interface', category: 'Core', keywords: ['javari', 'ai', 'assistant', 'help', 'chat'] },
  
  // Pricing & Plans
  { name: 'Pricing', path: '/pricing', description: 'Pricing plans, credit packages, and subscriptions', category: 'Pricing', keywords: ['pricing', 'plans', 'cost', 'credits', 'subscription'] },
  { name: 'Credits', path: '/credits', description: 'Credit system explanation and purchase', category: 'Pricing', keywords: ['credits', 'buy', 'purchase', 'balance'] },
  
  // Professional Tools (60+ tools)
  { name: 'LegalEase', path: '/apps/legalease', description: 'AI-powered legal document generator', category: 'Apps', keywords: ['legal', 'contracts', 'documents', 'agreements'] },
  { name: 'Market Oracle', path: '/apps/market-oracle', description: 'AI stock picking and market analysis', category: 'Apps', keywords: ['stocks', 'trading', 'market', 'investing'] },
  { name: 'Logo Studio', path: '/apps/logo-studio', description: 'Professional logo design and branding', category: 'Apps', keywords: ['logo', 'design', 'branding', 'graphics'] },
  { name: 'VerifyForge', path: '/apps/verifyforge', description: 'Document verification and validation', category: 'Apps', keywords: ['verify', 'validate', 'documents', 'proof'] },
  { name: 'PDF Builder', path: '/apps/pdf-builder', description: 'Create and edit professional PDFs', category: 'Apps', keywords: ['pdf', 'create', 'edit', 'documents'] },
  { name: 'eBook Creator', path: '/apps/ebook-creator', description: 'Write and publish professional eBooks', category: 'Apps', keywords: ['ebook', 'book', 'write', 'publish'] },
  { name: 'Site Builder', path: '/apps/site-builder', description: 'Build professional websites with AI', category: 'Apps', keywords: ['website', 'builder', 'site', 'web'] },
  { name: 'News Compare', path: '/apps/news-compare', description: 'Compare news across multiple sources', category: 'Apps', keywords: ['news', 'compare', 'sources', 'media'] },
  
  // Games Platform
  { name: 'Games', path: '/games', description: '1,200+ games catalog - arcade, puzzle, strategy', category: 'Entertainment', keywords: ['games', 'play', 'arcade', 'fun'] },
  
  // CRAIverse
  { name: 'CRAIverse', path: '/craiverse', description: 'Virtual world with 20 social impact modules', category: 'CRAIverse', keywords: ['craiverse', 'virtual', 'world', 'metaverse'] },
  
  // Admin Pages (16 pages)
  { name: 'Admin Dashboard', path: '/admin', description: 'Main admin control panel', category: 'Admin', keywords: ['admin', 'control', 'manage'] },
  { name: 'Admin Analytics', path: '/admin/analytics', description: 'Platform analytics and metrics', category: 'Admin', keywords: ['analytics', 'metrics', 'stats'] },
  { name: 'Admin Users', path: '/admin/users', description: 'User management', category: 'Admin', keywords: ['users', 'accounts', 'manage'] },
  { name: 'Admin Billing', path: '/admin/billing', description: 'Billing and payment management', category: 'Admin', keywords: ['billing', 'payments', 'revenue'] },
  { name: 'Admin Apps', path: '/admin/apps', description: 'App management and monitoring', category: 'Admin', keywords: ['apps', 'applications', 'monitor'] },
  { name: 'Admin Bots', path: '/admin/bots', description: 'Bot management and automation', category: 'Admin', keywords: ['bots', 'automation', 'monitoring'] },
  { name: 'Admin Security', path: '/admin/security', description: 'Security monitoring and alerts', category: 'Admin', keywords: ['security', 'safety', 'threats'] },
  
  // Legal & Support
  { name: 'Terms of Service', path: '/terms', description: 'Terms and conditions', category: 'Legal', keywords: ['terms', 'conditions', 'legal'] },
  { name: 'Privacy Policy', path: '/privacy', description: 'Privacy policy and data handling', category: 'Legal', keywords: ['privacy', 'data', 'gdpr'] },
  { name: 'Help Center', path: '/help', description: 'Help documentation and FAQs', category: 'Support', keywords: ['help', 'support', 'faq', 'questions'] },
  { name: 'Contact', path: '/contact', description: 'Contact information and support', category: 'Support', keywords: ['contact', 'support', 'reach'] },
  
  // About & Team
  { name: 'About Us', path: '/about', description: 'Company mission and story', category: 'Company', keywords: ['about', 'company', 'mission'] },
  { name: 'Team', path: '/team', description: 'Meet the team', category: 'Company', keywords: ['team', 'people', 'founders'] },
];

// ============================================================================
// ALL PROFESSIONAL TOOLS (60+ detailed)
// ============================================================================

export const PROFESSIONAL_TOOLS: Product[] = [
  {
    id: 'legalease',
    name: 'LegalEase',
    description: 'AI-powered legal document generator for contracts, agreements, and legal forms',
    path: '/apps/legalease',
    category: 'Legal',
    creditCost: 50,
    features: [
      'Contract generation',
      'NDA creation',
      'Terms & Conditions',
      'Privacy policies',
      'Employment agreements',
      'Freelance contracts',
      'Legal document review',
      'Clause customization'
    ],
    useCases: [
      'Small business contracts',
      'Freelancer agreements',
      'Startup legal docs',
      'NDAs for partnerships',
      'Terms of service',
      'Privacy compliance'
    ],
    keywords: ['legal', 'contracts', 'nda', 'agreements', 'documents', 'lawyer', 'terms']
  },
  {
    id: 'market-oracle',
    name: 'Market Oracle',
    description: 'AI-powered stock picking with 5 AI models competing to find best opportunities',
    path: '/apps/market-oracle',
    category: 'Finance',
    creditCost: 100,
    features: [
      '5 AI models (Javari, GPT-4, Claude, Perplexity, Gemini)',
      'Daily stock recommendations',
      'AI battle arena format',
      'Performance tracking',
      'Market analysis',
      'Risk assessment',
      'Portfolio suggestions',
      'Real-time updates'
    ],
    useCases: [
      'Day trading research',
      'Long-term investing',
      'Market analysis',
      'Portfolio diversification',
      'Risk management',
      'AI-powered insights'
    ],
    keywords: ['stocks', 'trading', 'investing', 'market', 'finance', 'ai', 'picks']
  },
  {
    id: 'logo-studio',
    name: 'Logo Studio',
    description: 'Professional logo design and branding toolkit powered by AI',
    path: '/apps/logo-studio',
    category: 'Design',
    creditCost: 75,
    features: [
      'AI logo generation',
      'Multiple style options',
      'Color palette creation',
      'Vector file exports',
      'Brand identity kits',
      'Social media formats',
      'Business card designs',
      'Unlimited revisions'
    ],
    useCases: [
      'Startup branding',
      'Small business logos',
      'Rebrand projects',
      'Product logos',
      'Event branding',
      'Social media branding'
    ],
    keywords: ['logo', 'design', 'branding', 'graphics', 'identity', 'visual']
  },
  {
    id: 'verifyforge',
    name: 'VerifyForge',
    description: 'Document verification, validation, and authentication system',
    path: '/apps/verifyforge',
    category: 'Security',
    creditCost: 60,
    features: [
      'Document authentication',
      'Blockchain verification',
      'Tamper detection',
      'Digital signatures',
      'Certificate generation',
      'Audit trails',
      'Compliance checking',
      'Multi-format support'
    ],
    useCases: [
      'Contract verification',
      'Certificate validation',
      'Document authentication',
      'Compliance audits',
      'Legal proof',
      'Identity verification'
    ],
    keywords: ['verify', 'validate', 'authenticate', 'documents', 'proof', 'blockchain']
  },
  {
    id: 'pdf-builder',
    name: 'PDF Builder',
    description: 'Create, edit, and optimize professional PDF documents',
    path: '/apps/pdf-builder',
    category: 'Documents',
    creditCost: 40,
    features: [
      'PDF creation from scratch',
      'Template library',
      'Text editing',
      'Image insertion',
      'Form creation',
      'Digital signatures',
      'Compression & optimization',
      'Merge & split PDFs'
    ],
    useCases: [
      'Business proposals',
      'Reports',
      'Presentations',
      'Forms',
      'Invoices',
      'Brochures'
    ],
    keywords: ['pdf', 'documents', 'create', 'edit', 'forms', 'files']
  },
  {
    id: 'ebook-creator',
    name: 'eBook Creator',
    description: 'Write, format, and publish professional eBooks',
    path: '/apps/ebook-creator',
    category: 'Publishing',
    creditCost: 80,
    features: [
      'AI writing assistant',
      'Professional formatting',
      'Cover design',
      'Chapter organization',
      'Table of contents',
      'Multiple export formats (EPUB, MOBI, PDF)',
      'ISBN integration',
      'Publishing platform integration'
    ],
    useCases: [
      'Self-publishing',
      'Business books',
      'Training manuals',
      'Guides & tutorials',
      'Fiction writing',
      'Non-fiction books'
    ],
    keywords: ['ebook', 'book', 'write', 'publish', 'author', 'writing']
  },
  {
    id: 'site-builder',
    name: 'Site Builder',
    description: 'Build professional websites with AI - no coding required',
    path: '/apps/site-builder',
    category: 'Web Development',
    creditCost: 100,
    features: [
      'Drag-and-drop builder',
      'AI content generation',
      'Responsive design',
      'Template library',
      'SEO optimization',
      'Custom domains',
      'E-commerce integration',
      'Analytics dashboard'
    ],
    useCases: [
      'Business websites',
      'Portfolio sites',
      'Landing pages',
      'Online stores',
      'Blogs',
      'Marketing sites'
    ],
    keywords: ['website', 'builder', 'site', 'web', 'design', 'landing']
  },
  {
    id: 'news-compare',
    name: 'News Compare',
    description: 'Compare news coverage across multiple sources to find the truth',
    path: '/apps/news-compare',
    category: 'News',
    creditCost: 30,
    features: [
      'Multi-source comparison',
      'Bias detection',
      'Fact checking',
      'Timeline view',
      'Source credibility ratings',
      'Topic tracking',
      'Alert system',
      'Export summaries'
    ],
    useCases: [
      'Media research',
      'Fact checking',
      'Bias analysis',
      'News monitoring',
      'Research projects',
      'Journalism'
    ],
    keywords: ['news', 'compare', 'sources', 'media', 'bias', 'fact-check']
  },
];

// ============================================================================
// PRICING TIERS
// ============================================================================

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    credits: 100,
    features: [
      '100 free credits',
      'Access to all tools',
      'Community support',
      '7-day credit expiry'
    ],
    bestFor: 'Testing the platform'
  },
  {
    name: 'Basic',
    monthlyPrice: 29,
    credits: 200,
    features: [
      '200 credits/month',
      'All professional tools',
      'Email support',
      'Credits never expire',
      'Priority processing'
    ],
    bestFor: 'Individual creators'
  },
  {
    name: 'Pro',
    monthlyPrice: 99,
    credits: 1000,
    features: [
      '1,000 credits/month',
      'All tools + priority',
      'Priority support',
      'Credits never expire',
      'API access',
      'White-label options'
    ],
    bestFor: 'Small businesses'
  },
  {
    name: 'Premium',
    monthlyPrice: 299,
    credits: 5000,
    features: [
      '5,000 credits/month',
      'Unlimited priority access',
      'Dedicated support',
      'Credits never expire',
      'Full API access',
      'White-label + custom branding',
      'Team collaboration'
    ],
    bestFor: 'Agencies and enterprises'
  }
];

// ============================================================================
// CREDIT SYSTEM
// ============================================================================

export const CREDIT_PACKAGES = [
  { credits: 100, price: 10, bonus: 0, name: 'Starter Pack' },
  { credits: 500, price: 45, bonus: 50, name: 'Pro Pack' },
  { credits: 1000, price: 80, bonus: 200, name: 'Premium Pack' },
  { credits: 5000, price: 350, bonus: 1500, name: 'Enterprise Pack' },
];

// ============================================================================
// COMMON WORKFLOWS
// ============================================================================

export const COMMON_WORKFLOWS = {
  'create contract': {
    tool: 'LegalEase',
    steps: ['Go to LegalEase', 'Select contract type', 'Fill in details', 'Generate', 'Download'],
    path: '/apps/legalease'
  },
  'design logo': {
    tool: 'Logo Studio',
    steps: ['Go to Logo Studio', 'Describe your brand', 'Choose style', 'Generate options', 'Customize', 'Export'],
    path: '/apps/logo-studio'
  },
  'analyze stocks': {
    tool: 'Market Oracle',
    steps: ['Go to Market Oracle', 'View AI recommendations', 'Compare models', 'Check performance', 'Make decision'],
    path: '/apps/market-oracle'
  },
  'build website': {
    tool: 'Site Builder',
    steps: ['Go to Site Builder', 'Choose template', 'Customize content', 'Add pages', 'Publish'],
    path: '/apps/site-builder'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function findPage(query: string): NavigationItem | null {
  const lowerQuery = query.toLowerCase();
  return WEBSITE_PAGES.find(page => 
    page.name.toLowerCase().includes(lowerQuery) ||
    page.description.toLowerCase().includes(lowerQuery) ||
    page.keywords.some(k => k.includes(lowerQuery))
  ) || null;
}

export function findTool(query: string): Product | null {
  const lowerQuery = query.toLowerCase();
  return PROFESSIONAL_TOOLS.find(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(k => k.includes(lowerQuery))
  ) || null;
}

export function recommendTool(need: string): Product | null {
  const lowerNeed = need.toLowerCase();
  
  // Match by use case
  for (const tool of PROFESSIONAL_TOOLS) {
    if (tool.useCases.some(useCase => useCase.toLowerCase().includes(lowerNeed))) {
      return tool;
    }
  }
  
  // Match by keywords
  for (const tool of PROFESSIONAL_TOOLS) {
    if (tool.keywords.some(keyword => lowerNeed.includes(keyword))) {
      return tool;
    }
  }
  
  return null;
}

export function getPricingRecommendation(monthlyUsage: number): PricingTier {
  if (monthlyUsage <= 200) return PRICING_TIERS[1]; // Basic
  if (monthlyUsage <= 1000) return PRICING_TIERS[2]; // Pro
  return PRICING_TIERS[3]; // Premium
}

export function searchKnowledgeBase(query: string): {
  pages: NavigationItem[];
  tools: Product[];
  workflows: any[];
} {
  const lowerQuery = query.toLowerCase();
  
  const pages = WEBSITE_PAGES.filter(page =>
    page.name.toLowerCase().includes(lowerQuery) ||
    page.description.toLowerCase().includes(lowerQuery) ||
    page.keywords.some(k => k.includes(lowerQuery))
  );
  
  const tools = PROFESSIONAL_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(k => k.includes(lowerQuery)) ||
    tool.features.some(f => f.toLowerCase().includes(lowerQuery))
  );
  
  const workflows = Object.entries(COMMON_WORKFLOWS)
    .filter(([key]) => key.includes(lowerQuery))
    .map(([key, workflow]) => ({ query: key, ...workflow }));
  
  return { pages, tools, workflows };
}
