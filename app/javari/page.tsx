import { MobileButton } from '@/components/mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Code, Zap, Brain, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JavariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Bot className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
              Meet Javari AI
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8">
              Your autonomous AI development assistant that builds production-ready apps
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="flex-1">
                <MobileButton size="lg" fullWidth className="bg-white text-purple-600 hover:bg-purple-50">
                  Chat with Javari
                </MobileButton>
              </a>
              <Link href="/pricing" className="flex-1">
                <MobileButton size="lg" fullWidth variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  View Plans
                </MobileButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">What Javari Can Do</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Code className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Build Apps</h3>
                  <p className="text-xs md:text-sm text-gray-600">Full-stack apps in minutes</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Deploy Instantly</h3>
                  <p className="text-xs md:text-sm text-gray-600">Push to GitHub & Vercel</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Brain className="w-10 h-10 md:w-12 md:h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Self-Improving</h3>
                  <p className="text-xs md:text-sm text-gray-600">Learns from every project</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-pink-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Fortune 50 Quality</h3>
                  <p className="text-xs md:text-sm text-gray-600">Production-ready code</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10x</div>
                <div className="text-xs md:text-sm text-gray-600">Faster Development</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-xs md:text-sm text-gray-600">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">1000+</div>
                <div className="text-xs md:text-sm text-gray-600">Apps Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-xs md:text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Start chatting with Javari and bring your ideas to life
          </p>
          <a href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-block">
            <MobileButton size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Launch Javari AI <ArrowRight className="w-4 h-4 ml-2" />
            </MobileButton>
          </a>
        </div>
      </section>
    </div>
  );
}
