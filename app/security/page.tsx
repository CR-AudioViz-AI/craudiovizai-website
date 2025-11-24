import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { Shield, Lock, Server, Key, Eye, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Security
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-green-100 mb-3">
              Enterprise-grade security protecting your data and creations
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Security Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Lock className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">AES-256 Encryption</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    All data encrypted at rest and in transit
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Server className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">SOC 2 Compliant</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Infrastructure meets enterprise standards
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Key className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">2FA Authentication</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Two-factor authentication available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Eye className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">24/7 Monitoring</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Continuous security monitoring and alerts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">DDoS Protection</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Enterprise-grade attack mitigation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Regular Audits</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Third-party security audits quarterly
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="container mx-auto text-center">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Report a Security Issue</h2>
          <p className="text-base md:text-lg text-green-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Found a vulnerability? We appreciate responsible disclosure
          </p>
          <Link href="/contact?subject=Security" className="inline-block">
            <MobileButton size="lg" className="bg-white text-green-600 hover:bg-green-50">
              Report Security Issue
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
