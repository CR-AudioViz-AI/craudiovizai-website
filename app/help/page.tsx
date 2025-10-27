import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Mail, 
  FileText,
  Lightbulb,
  Settings,
  CreditCard,
  Users,
  Zap,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Search our knowledge base or browse articles by category
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search for help articles, tutorials, or guides..."
                  className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 h-14 text-lg"
                />
                <Button className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-3">
                Popular searches: Getting started, Credits, Javari, Payments, Account settings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/tutorials">
                <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-center text-lg">Video Tutorials</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    Watch step-by-step video guides
                  </CardContent>
                </Card>
              </Link>

              <Link href="/faq">
                <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-500">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-center text-lg">FAQ</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    Find answers to common questions
                  </CardContent>
                </Card>
              </Link>

              <Link href="/api-docs">
                <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Book className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-center text-lg">API Docs</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    Developer documentation
                  </CardContent>
                </Card>
              </Link>

              <Link href="/contact">
                <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-500">
                  <CardHeader>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-center text-lg">Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-gray-600">
                    Get help from our team
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Browse by Category
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Lightbulb className="w-6 h-6 mr-3 text-yellow-600" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/help/welcome" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Welcome to CR AudioViz AI
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/first-steps" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Your First Steps on the Platform
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/dashboard-tour" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Dashboard Tour
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/credits-explained" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Understanding Credits
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/choosing-plan" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Choosing the Right Plan
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Account & Billing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CreditCard className="w-6 h-6 mr-3 text-green-600" />
                    Account & Billing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/help/manage-account" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Managing Your Account
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/payment-methods" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Payment Methods
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/subscription-changes" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Changing Your Subscription
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/refund-policy" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/invoices" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Viewing Invoices
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Using Javari */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Zap className="w-6 h-6 mr-3 text-purple-600" />
                    Using Javari AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Introduction to Javari
                      </Link>
                    </li>
                    <li>
                      <Link href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Writing Effective Prompts
                      </Link>
                    </li>
                    <li>
                      <Link href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Building Websites with Javari
                      </Link>
                    </li>
                    <li>
                      <Link href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Creating Apps with Javari
                      </Link>
                    </li>
                    <li>
                      <Link href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Tips & Best Practices
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Tools & Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Settings className="w-6 h-6 mr-3 text-blue-600" />
                    Tools & Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/help/tools-overview" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Overview of All Tools
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/design-tools" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Design & Graphics Tools
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/video-tools" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Video Editing Tools
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/code-tools" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Code & Development Tools
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/game-builder" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Game Builder Guide
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Marketplace */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Users className="w-6 h-6 mr-3 text-orange-600" />
                    Marketplace & CRAIverse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/help/marketplace-intro" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Introduction to Marketplace
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/selling-content" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Selling Your Creations
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/revenue-share" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Understanding Revenue Share (70/30)
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/buyer-guide" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Buying from Marketplace
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/craiverse-guide" className="text-blue-600 hover:text-blue-700 hover:underline">
                        CRAIverse Dashboard Guide
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="w-6 h-6 mr-3 text-red-600" />
                    Troubleshooting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/help/login-issues" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Login & Access Issues
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/payment-failed" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Payment Failed or Declined
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/credits-missing" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Credits Not Showing Up
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/slow-performance" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Slow Performance Issues
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/error-messages" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Common Error Messages
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Most Popular Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "How to Get Started with Javari AI", views: "15.2K views" },
                { title: "Understanding the Credit System", views: "12.8K views" },
                { title: "Building Your First Website", views: "10.5K views" },
                { title: "Selling in the Marketplace", views: "9.3K views" },
                { title: "Credit Expiration Rules Explained", views: "8.7K views" },
                { title: "How to Top Up Credits", views: "7.9K views" }
              ].map((article, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-xs text-gray-500">{article.views}</p>
                    <Link href={`/help/${idx}`}>
                      <Button variant="link" className="px-0 mt-2">
                        Read Article →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help. Contact us and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            Average response time: 2 hours • Support available 24/7
          </p>
        </div>
      </section>
    </div>
  );
}
