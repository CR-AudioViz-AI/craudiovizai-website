import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, MessageSquare, Zap, Code2, Wand2, Rocket } from 'lucide-react';

export default function JavariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Javari */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Javari Image */}
              <div className="order-2 lg:order-1">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    {/* TODO: Add actual Javari image - brunette woman */}
                    <Image
                      src="/images/javari-avatar.png"
                      alt="Javari - Your AI Master Builder"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Meet Javari
                </h1>
                <p className="text-xl md:text-2xl text-purple-100 mb-4">
                  Your AI Master Builder
                </p>
                <p className="text-lg text-purple-100 mb-8">
                  Just tell Javari what you want to create, and watch it come to life. 
                  From websites to mobile apps, games to business tools - Javari builds 
                  anything you can imagine. No coding required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Chatting
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
          </div>
        </div>
      </section>

      {/* What Javari Can Build */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Can Javari Build?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Javari is your master builder - capable of creating anything you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Websites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Complete websites, landing pages, portfolios, blogs, and more. Fully responsive and production-ready.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-blue-500">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Code2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Mobile Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  iOS and Android apps with native functionality. From simple utilities to complex applications.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-green-500">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Games</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browser games, puzzle games, arcade games, and more. Fun, engaging, and instantly playable.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-orange-500">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Rocket className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>E-commerce Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Full online stores with shopping carts, payment processing, inventory management, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-pink-500">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Business Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  CRMs, project managers, invoicing systems, analytics dashboards - whatever your business needs.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-indigo-500">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Creative Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Image editors, video tools, design apps, content generators - creative power at your fingertips.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Javari Works */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Javari Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building with Javari is as simple as having a conversation
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Describe Your Vision</h3>
                <p className="text-gray-600">
                  Tell Javari what you want to build in plain English. Be as detailed or as simple as you like.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Javari Asks Questions</h3>
                <p className="text-gray-600">
                  Javari will ask clarifying questions to understand exactly what you need and how you want it to work.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Watch It Build</h3>
                <p className="text-gray-600">
                  See your creation come to life in real-time. Javari generates code and creates live previews as she works.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Export or Refine</h3>
                <p className="text-gray-600">
                  Download your code, publish to production, or continue iterating with Javari until it's perfect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Javari is Different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <MessageSquare className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Conversational Interface</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Chat with Javari like you would a human developer. No technical jargon required - just describe what you want in your own words.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Real-Time Creation</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Watch your project come to life as Javari builds. See live previews and make changes on the fly.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Code2 className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Production-Ready Code</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                All code is clean, well-structured, and production-ready. Download and deploy immediately, or continue building.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Zap className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>No Limitations</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Javari can build anything - from simple landing pages to complex multi-page applications with databases and APIs.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat History & Projects */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="text-2xl">Organize Your Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Chat History</p>
                      <p className="text-gray-600 text-sm">
                        All your conversations with Javari are saved. Pick up right where you left off anytime.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Rocket className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Project-Based Chats</p>
                      <p className="text-gray-600 text-sm">
                        Tie conversations to specific projects. Keep everything organized and easy to find.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Code2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Export Anytime</p>
                      <p className="text-gray-600 text-sm">
                        Download your code at any point. You own everything Javari creates for you.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build with Javari?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Start creating anything you can imagine - no coding experience required
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Free Chat
            </Button>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                View Plans & Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
