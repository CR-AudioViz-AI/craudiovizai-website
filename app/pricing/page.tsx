import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Check, X, Sparkles, Zap, Crown, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-2xl transition-all">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $0
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <CardDescription>Perfect for trying out the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">100 credits/month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Credits expire monthly</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Access to all 60+ tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Play 1,200+ games</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Chat with Javari</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Watermarks on exports</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Marketplace access</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-6 text-lg">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan - Featured */}
            <Card className="border-4 border-blue-500 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $49
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <CardDescription>For serious creators and businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">500 credits/month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">Credits never expire</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All tools & features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">No watermarks</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Marketplace access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Earn 70% on creations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Download source code</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                  Start Pro Plan
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 hover:shadow-2xl transition-all">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  Custom
                </div>
                <CardDescription>Up to 5 users, shared credits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">Custom credit allocation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">Up to 5 team members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">Shared credit pool</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">White-label options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">API access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg">
                    Get a Quote
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Credit System Explanation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Credits Work
              </h2>
              <p className="text-lg text-gray-600">
                Credits are used across all tools - simple and transparent
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                    What Are Credits?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="mb-3">
                    Credits are our universal currency. Each action on the platform costs a certain number of credits based on complexity and resources used.
                  </p>
                  <p>
                    Simple actions like generating a logo might cost 5 credits, while building a complete website with Javari might cost 50 credits.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-6 h-6 text-blue-600 mr-2" />
                    Top Up Anytime
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="mb-3">
                    Running low on credits? You can purchase additional credits at any time at the current per-credit rate.
                  </p>
                  <p>
                    Pro members get credits that never expire, so you can accumulate them over time.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
                Example Credit Costs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Logo Generation</span>
                  <span className="font-semibold text-blue-600">5 credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Social Media Graphic</span>
                  <span className="font-semibold text-blue-600">3 credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Blog Post (AI)</span>
                  <span className="font-semibold text-blue-600">10 credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Video Edit (1 min)</span>
                  <span className="font-semibold text-blue-600">15 credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Landing Page (Javari)</span>
                  <span className="font-semibold text-blue-600">25 credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Complete Website</span>
                  <span className="font-semibold text-blue-600">50+ credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Game Creation</span>
                  <span className="font-semibold text-blue-600">30 credits</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="text-gray-700">Chat Message (Javari)</span>
                  <span className="font-semibold text-blue-600">1 credit</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4 text-center">
                * Credit costs may vary based on complexity and resource usage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens to unused credits?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Free plan credits expire monthly. Pro and Professional plan credits never expire - they roll over indefinitely.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I buy more credits without upgrading?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Absolutely! You can purchase additional credits at any time at the current per-credit rate. Top-up credits follow the same expiration rules as your plan.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your purchase - no questions asked.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  We accept all major credit cards via Stripe, as well as PayPal. All transactions are secure and encrypted.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators building amazing things with CR AudioViz AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
              Start Free Trial
            </Button>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
