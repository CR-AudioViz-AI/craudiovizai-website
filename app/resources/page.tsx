import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { BookOpen, FileText, Video, Download, ExternalLink, Code } from 'lucide-react';
import Link from 'next/link';

const resources = [
  { icon: BookOpen, name: 'Documentation', description: 'Complete guides and API reference', link: '/knowledge-base', color: 'blue' },
  { icon: Video, name: 'Video Tutorials', description: 'Step-by-step video guides', link: '/tutorials', color: 'purple' },
  { icon: FileText, name: 'Blog', description: 'Tips, news, and insights', link: '/blog', color: 'green' },
  { icon: Code, name: 'API Reference', description: 'Developer documentation', link: '/docs/api', color: 'orange' },
  { icon: Download, name: 'Downloads', description: 'Brand assets and templates', link: '/press', color: 'pink' },
  { icon: ExternalLink, name: 'Community', description: 'Join our Discord and forums', link: '/community', color: 'indigo' },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Resources
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8">
              Everything you need to succeed with CR AudioViz AI
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Link key={resource.name} href={resource.link}>
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                      <CardContent className="p-4 md:p-6 text-center">
                        <Icon className={`w-10 h-10 md:w-12 md:h-12 text-${resource.color}-600 mx-auto mb-3 md:mb-4`} />
                        <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{resource.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600">{resource.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Popular Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Getting Started Guide', link: '/help/getting-started' },
                { title: 'How Credits Work', link: '/help/credits' },
                { title: 'Javari AI Documentation', link: '/javari' },
                { title: 'API Quick Start', link: '/docs/api/quickstart' },
                { title: 'Marketplace Guide', link: '/help/marketplace' },
                { title: 'Contact Support', link: '/contact' },
              ].map((item) => (
                <Link key={item.title} href={item.link}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                      <span className="font-medium text-sm md:text-base text-gray-900">{item.title}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Our support team is here to assist you
          </p>
          <Link href="/contact" className="inline-block">
            <MobileButton size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Contact Support
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
