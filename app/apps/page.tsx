import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles, Code2, Music, Mail, Zap, Download, Share2, CheckCircle , FileText, File } from 'lucide-react';

const embeddedApps = [
  {
    id: 'builder',
    icon: '🏗️',
    iconComponent: Code2,
    name: 'App Builder',
    description: 'Build production-ready applications with AI assistance. No coding required.',
    features: [
      'AI-powered code generation',
      'Export full source code',
      'Host or sell your apps',
      'Custom branding options'
    ],
    status: 'live',
    href: '/apps/builder',
    color: 'blue',
  },
  {
    id: 'pdf-builder',
    icon: '📄',
    iconComponent: File,
    name: 'PDF Builder Pro',
    description: 'Create professional PDFs with AI-powered content generation and templates.',
    features: [
      'AI content generation',
      'Professional templates',
      'Custom layouts & design',
      'Export high-quality PDFs'
    ],
    status: 'live',
    href: '/apps/pdf-builder',
    color: 'red',
    creditCost: 5,
  },
  {
    id: 'music-builder',
    icon: '🎵',
    iconComponent: Music,
    name: 'Music Builder',
    description: 'Create original music with AI-powered composition and production tools.',
    features: [
      'AI music composition',
      'Multiple genres & styles',
      'Professional audio quality',
      'Export & share tracks'
    ],
    status: 'live',
    href: '/apps/music-builder',
    color: 'purple',
  },
  {
    id: 'newsletter',
    icon: '📧',
    iconComponent: Mail,
    name: 'Newsletter Pro',
    description: 'Enterprise email marketing platform for campaigns, audiences, and analytics.',
    features: [
      'Campaign management',
      'Audience segmentation',
      'Performance analytics',
      'Template designer'
    ],
    status: 'live',
    href: '/apps/newsletter',
    color: 'green',
  },  {
    id: 'legalease',
    icon: '⚖️',
    iconComponent: FileText,
    name: 'LegalEase AI',
    description: 'Transform legal documents into plain English and vice versa with AI-powered translation.',
    features: [
      'Bidirectional legal translation',
      'Extract key terms & obligations',
      '15+ professional legal templates',
      'Export to PDF/DOCX'
    ],
    status: 'live',
    href: '/apps/legalease',
    color: 'amber',
  },

];

const comingSoonApps = [
  {
    icon: '🔐',
    name: 'Javari AI',
    description: 'Autonomous AI assistant with secure credential management and automation.',
    status: 'coming-soon',
  },
  {
    icon: '🎨',
    name: 'Design Studio',
    description: 'Professional design tools for graphics, logos, and branding materials.',
    status: 'coming-soon',
  },
  {
    icon: '📊',
    name: 'Analytics Pro',
    description: 'Advanced data analytics and visualization platform.',
    status: 'coming-soon',
  },
  {
    icon: '🎮',
    name: 'Game Creator',
    description: 'Build and publish browser-based games with no coding.',
    status: 'coming-soon',
  },
  {
    icon: '📝',
    name: 'Content Writer',
    description: 'AI-powered content creation for blogs, articles, and marketing copy.',
    status: 'coming-soon',
  },
  {
    icon: '🎬',
    name: 'Video Editor',
    description: 'Professional video editing suite with AI enhancements.',
    status: 'coming-soon',
  },
];

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              60+ Creative Apps & Tools
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Everything you need to create, design, and build - all powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Build Custom App
              </Button>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Apps Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <CheckCircle className="inline-block w-4 h-4 mr-1" />
              Live Now
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Apps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Launch these production-ready apps instantly. Each app runs in your browser with full functionality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {embeddedApps.map((app) => {
              const IconComponent = app.iconComponent;
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
                green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                amber: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
              };

              return (
                <Card key={app.id} className="border-2 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl shadow-sm">
                        {app.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          <Zap className="w-3 h-3" />
                          Live
                        </div>
                        {app.creditCost && (
                          <div className="text-xs text-gray-600 font-medium">
                            {app.creditCost} credits/use
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {app.name}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {app.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 mb-6">
                      {app.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={app.href} className="mt-auto">
                      <Button 
                        className={`w-full bg-gradient-to-r ${colorClasses[app.color as keyof typeof colorClasses]} text-white py-6 text-base font-semibold shadow-md`}
                      >
                        <IconComponent className="w-5 h-5 mr-2" />
                        Launch {app.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              More Apps in Development
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're constantly building new tools to expand your creative capabilities. Here's what's coming next.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
            {comingSoonApps.map((app, idx) => (
              <Card key={idx} className="border-2 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-3">{app.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{app.name}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom App Builder CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    <Code2 className="inline-block w-8 h-8 mr-2 text-blue-600" />
                    Need a Custom App?
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Let Javari AI build exactly what you need - no coding required
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI-Powered</p>
                    <p className="text-sm text-gray-600">Describe your app, Javari builds it</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Full Ownership</p>
                    <p className="text-sm text-gray-600">Download complete source code</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Earn Revenue</p>
                    <p className="text-sm text-gray-600">Sell on marketplace (70% revenue)</p>
                  </div>
                </div>
              </div>
              <Link href="/apps/builder">
                <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-md">
                  <Code2 className="w-5 h-5 mr-2" />
                  Start Building Custom App
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of creators using our platform to bring their ideas to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
