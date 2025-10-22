import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles, Code2, Download, Share2 } from 'lucide-react';

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-navy-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              60+ Creative Apps & Tools
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Everything you need to create, design, and build - all powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Build Custom App
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
      </section>

      {/* App Builder Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    <Code2 className="inline-block w-8 h-8 mr-2 text-blue-600" />
                    App Builder
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Create custom apps with AI assistance - no coding required
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI-Powered</p>
                    <p className="text-sm text-gray-600">Let Javari build your app</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Host or Export</p>
                    <p className="text-sm text-gray-600">Keep code or earn 70%</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Full Control</p>
                    <p className="text-sm text-gray-600">Download source code</p>
                  </div>
                </div>
              </div>
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Start Building Your App
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Embedded Apps Dashboard Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Apps & Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse by category or search to find exactly what you need
            </p>
          </div>

          {/* This is where the Bolt-built dashboard will be embedded */}
          <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px]">
            <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Apps Dashboard Integration Point
              </h3>
              <p className="text-gray-500 mb-4">
                This is where we'll embed your Bolt-built apps dashboard
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  📋 TODO: Embed Bolt Dashboard
                </p>
                <ul className="text-sm text-blue-800 text-left space-y-1">
                  <li>• All 60+ apps will be categorized and displayed here</li>
                  <li>• Search and filter functionality</li>
                  <li>• Each app card shows: icon, name, description, credit cost</li>
                  <li>• Click to launch app or learn more</li>
                  <li>• Apps pull from Supabase database</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            App Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {[
              { name: 'Website & Development', icon: '🌐', count: 5 },
              { name: 'Design & Branding', icon: '🎨', count: 5 },
              { name: 'Content Creation', icon: '✍️', count: 5 },
              { name: 'Video & Audio', icon: '🎬', count: 5 },
              { name: 'Marketing', icon: '📢', count: 5 },
              { name: 'Business Tools', icon: '💼', count: 5 },
              { name: 'Print-on-Demand', icon: '👕', count: 5 },
              { name: 'AI Tools', icon: '🤖', count: 5 },
              { name: 'Utilities', icon: '🔧', count: 5 },
              { name: 'Mobile', icon: '📱', count: 5 },
              { name: 'Social Media', icon: '📱', count: 5 },
              { name: 'Education', icon: '📚', count: 5 },
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{category.count} apps</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Info Section */}
      <section className="py-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Build Apps, Earn Revenue
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Create custom apps and choose your path
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Host on Our Platform</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-100">
                  <ul className="space-y-2">
                    <li>✓ Earn 70% commission on every use</li>
                    <li>✓ Automated payments</li>
                    <li>✓ Analytics dashboard</li>
                    <li>✓ No hosting costs</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Take Your Code</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-100">
                  <ul className="space-y-2">
                    <li>✓ Download complete source code</li>
                    <li>✓ Full ownership and control</li>
                    <li>✓ Host anywhere you want</li>
                    <li>✓ No ongoing fees</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
