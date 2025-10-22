import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About CR AudioViz AI
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Empowering creators to build amazing things with AI
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  At CR AudioViz AI, we believe that everyone should have the power to create amazing digital experiences, 
                  regardless of their technical expertise. We're on a mission to democratize creativity through AI-powered tools.
                </p>
                <p className="text-gray-600">
                  Founded in 2024, we've built a comprehensive platform that combines 60+ creative tools, AI assistance, 
                  and a thriving marketplace to help creators bring their ideas to life.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg h-64"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">100K+</h3>
                  <p className="text-sm text-gray-600">Active Creators</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">60+</h3>
                  <p className="text-sm text-gray-600">Creative Tools</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">1200+</h3>
                  <p className="text-sm text-gray-600">Games Available</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">$2.4M</h3>
                  <p className="text-sm text-gray-600">Creator Earnings</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our mission
          </p>
          <Link href="/careers">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              View Open Positions
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
