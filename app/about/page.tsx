import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { Users, Target, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
              About CR AudioViz AI
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
              Empowering creators to build amazing things with AI
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-4">
                  At CR AudioViz AI, we believe that everyone should have the power to create amazing digital experiences, 
                  regardless of their technical expertise. We're on a mission to democratize creativity through AI-powered tools.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Founded in 2024, we've built a comprehensive platform that combines 60+ creative tools, AI assistance, 
                  and a thriving marketplace to help creators bring their ideas to life.
                </p>
              </div>
              
              {/* Placeholder for image/visual */}
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl h-48 md:h-64 lg:h-80 flex items-center justify-center">
                <p className="text-white text-lg font-semibold">Our Story</p>
              </div>
            </div>

            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2">
                    100K+
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">Active Creators</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2">
                    60+
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">Creative Tools</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2">
                    1200+
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">Games Available</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2">
                    $2.4M
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">Creator Earnings</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Your Story. Our Design.
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              We started CR AudioViz AI with a simple vision: make professional-grade creative tools accessible to everyone. 
              Today, we're proud to serve over 100,000 creators worldwide, helping them bring their ideas to life through 
              the power of AI.
            </p>
            <p className="text-base md:text-lg text-gray-600">
              From small business owners to enterprise teams, from hobbyists to professional creators—we're here to help 
              you tell your story, your way.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-lg md:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our mission
          </p>
          <Link href="/careers" className="inline-block w-full sm:w-auto">
            <MobileButton 
              size="lg" 
              fullWidth
              className="bg-white text-purple-600 hover:bg-purple-50 sm:w-auto"
            >
              View Open Positions
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
