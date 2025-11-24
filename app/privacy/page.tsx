import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { Shield, Lock, Eye, UserCheck, Database, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-3">
              Your privacy and data security are our top priorities
            </p>
            <p className="text-xs md:text-sm text-blue-200">
              Last Updated: October 22, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Privacy at a Glance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Encrypted Data</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    All data encrypted in transit and at rest with AES-256
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Eye className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">No Data Selling</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    We never sell your personal information to third parties
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Your Control</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Export or delete your data anytime from your dashboard
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Information We Collect
                </h2>
                <div className="text-sm md:text-base text-gray-600 space-y-3">
                  <p>We collect information you provide directly, including name, email, and payment information when you create an account or make purchases.</p>
                  <p>We automatically collect usage data, device information, and cookies to improve our services and your experience.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  How We Use Your Information
                </h2>
                <div className="text-sm md:text-base text-gray-600 space-y-3">
                  <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                  <p>We may use aggregated, anonymized data for analytics and to improve our platform.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Data Security
                </h2>
                <div className="text-sm md:text-base text-gray-600 space-y-3">
                  <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits.</p>
                  <p>Your payment information is processed by PCI-compliant payment processors and never stored on our servers.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                  Your Rights
                </h2>
                <div className="text-sm md:text-base text-gray-600 space-y-3">
                  <p>You have the right to access, correct, or delete your personal data at any time through your account settings.</p>
                  <p>You can opt out of marketing communications and request a copy of all data we hold about you.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Contact our privacy team for any questions or concerns
          </p>
          <Link href="/contact?subject=Privacy" className="inline-block">
            <MobileButton size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Contact Privacy Team
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
