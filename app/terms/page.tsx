import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { FileText, Scale, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Terms of Service
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-3">
              Please read these terms carefully before using our platform
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              Last Updated: October 22, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Key Points</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card className="border-green-200">
                <CardContent className="p-4 md:p-6">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">You Own Your Content</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    All content you create using our tools belongs to you. Export anytime.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4 md:p-6">
                  <Scale className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Fair Usage Policy</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Credits are subject to fair use. No automated abuse or reselling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">1. Acceptance of Terms</h2>
                <p className="text-sm md:text-base text-gray-600">
                  By accessing or using CR AudioViz AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">2. Account Registration</h2>
                <p className="text-sm md:text-base text-gray-600">
                  You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and all activities under it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">3. Credits and Payments</h2>
                <p className="text-sm md:text-base text-gray-600">
                  Credits are non-refundable except as required by law. Unused credits on paid plans never expire. Free tier credits reset monthly. We reserve the right to modify pricing with 30 days notice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">4. Content Ownership</h2>
                <p className="text-sm md:text-base text-gray-600">
                  You retain full ownership of all content you create using our platform. We claim no intellectual property rights over your creations. You grant us a limited license only to provide our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">5. Prohibited Uses</h2>
                <p className="text-sm md:text-base text-gray-600">
                  You may not use our services for illegal activities, harassment, spam, malware distribution, or any purpose that violates these terms or applicable laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">6. Termination</h2>
                <p className="text-sm md:text-base text-gray-600">
                  We may suspend or terminate your account for violations of these terms. You may cancel your account at any time. Upon termination, you may export your content within 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto text-center">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Questions About Terms?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Contact our legal team for any questions about these terms
          </p>
          <Link href="/contact?subject=Legal" className="inline-block">
            <MobileButton size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Contact Legal Team
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
