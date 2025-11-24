import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { Activity, Shield, Eye, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AIMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Activity className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              AI Monitoring
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8">
              24/7 monitoring of AI systems for safety and performance
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Shield className="w-10 h-10 md:w-12 md:h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Safety Monitoring</h3>
                  <p className="text-xs md:text-sm text-gray-600">Content filtering and safety checks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Eye className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Quality Assurance</h3>
                  <p className="text-xs md:text-sm text-gray-600">Output quality monitoring</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Performance</h3>
                  <p className="text-xs md:text-sm text-gray-600">Real-time performance tracking</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="container mx-auto text-center">
          <CheckCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">All AI Systems Normal</h2>
          <p className="text-base md:text-lg text-green-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Our AI monitoring systems are active and operational
          </p>
          <Link href="/status" className="inline-block">
            <MobileButton size="lg" className="bg-white text-green-600 hover:bg-green-50">
              View Full Status
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
