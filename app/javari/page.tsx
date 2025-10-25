'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, MessageSquare, Zap, Code2, Wand2, Rocket, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { JavariChat } from '@/components/javari/JavariChat';

export default function JavariPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartChat = () => {
    if (!user) {
      window.location.href = '/auth/login?redirect=/javari';
      return;
    }
    setShowChat(true);
  };

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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                      <Sparkles className="w-32 h-32 text-white" />
                    </div>
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
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
                    onClick={handleStartChat}
                    disabled={loading}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {loading ? 'Loading...' : user ? 'Start Chatting' : 'Sign In to Chat'}
                  </Button>
                  <Link href="/pricing">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-full"
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

      {/* Chat Modal */}
      {showChat && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Chat with Javari</h2>
                  <p className="text-purple-100 text-sm">Your AI Master Builder</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setShowChat(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Chat Component */}
            <div className="flex-1 overflow-hidden">
              <JavariChat userId={user.id} />
            </div>
          </div>
        </div>
      )}

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
                  <Code2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Websites & Web Apps</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Landing pages, portfolios, e-commerce stores, SaaS applications - anything that lives on the web.
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Mobile Applications</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                iOS and Android apps with native features, push notifications, and seamless user experiences.
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Games & Interactive</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Browser games, mobile games, educational tools, quizzes - anything interactive and engaging.
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Business Tools</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                CRM systems, project managers, dashboards, analytics tools - anything to run your business better.
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI-Powered Features</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Chatbots, content generators, recommendation engines - add AI to any application.
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>API Integrations</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Connect to Stripe, Mailchimp, Slack, or any service. Javari handles all the complex integration work.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building with Javari is as simple as having a conversation
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Describe What You Want</h3>
                <p className="text-gray-600">
                  Tell Javari what you want to build in plain English. Be as detailed or as vague as you like - Javari will ask clarifying questions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Watch Javari Build</h3>
                <p className="text-gray-600">
                  Javari creates your application in real-time. See the code being written, preview the design, and provide feedback as it's built.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Refine & Deploy</h3>
                <p className="text-gray-600">
                  Make changes, add features, fix bugs - all through conversation. When you're happy, deploy your app with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Javari is Different */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Javari is Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlike other AI tools, Javari actually builds complete, production-ready applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <Code2 className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Real, Working Code</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Not mockups or prototypes - Javari creates actual applications with databases, authentication, APIs, and everything you need.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Wand2 className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Iterative Building</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Start with something simple and evolve it. Add features, change designs, fix bugs - all through natural conversation.
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Rocket className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Production Ready</CardTitle>
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
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
              onClick={handleStartChat}
              disabled={loading}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {loading ? 'Loading...' : user ? 'Start Free Chat' : 'Sign In to Start'}
            </Button>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-full"
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
