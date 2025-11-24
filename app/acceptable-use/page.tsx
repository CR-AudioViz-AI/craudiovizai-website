import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { AlertTriangle, CheckCircle, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Acceptable Use Policy
            </h1>
            <p className="text-base md:text-lg text-orange-100">
              Last Updated: October 22, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Allowed */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" /> Allowed Uses
            </h2>
            <div className="space-y-3 md:space-y-4">
              {[
                'Creating apps, games, and content for personal or commercial use',
                'Using AI tools to enhance your creative work',
                'Selling your creations on our marketplace',
                'Collaborating with team members on projects',
                'Integrating with our API for legitimate purposes',
              ].map((item) => (
                <Card key={item} className="border-green-200">
                  <CardContent className="p-4 md:p-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-gray-700">{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-2">
              <XCircle className="w-8 h-8 text-red-600" /> Prohibited Uses
            </h2>
            <div className="space-y-3 md:space-y-4">
              {[
                'Creating illegal, harmful, or offensive content',
                'Automated abuse, scraping, or excessive API usage',
                'Reselling credits or account access',
                'Harassment, spam, or malicious activities',
                'Violating intellectual property rights',
                'Circumventing security measures',
              ].map((item) => (
                <Card key={item} className="border-red-200">
                  <CardContent className="p-4 md:p-6 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-gray-700">{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto text-center">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Questions?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Contact us if you're unsure about acceptable use
          </p>
          <Link href="/contact?subject=Acceptable Use" className="inline-block">
            <MobileButton size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Contact Us
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
