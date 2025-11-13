'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Crown, 
  Building2,
  HelpCircle, 
  ArrowRight,
  Star,
  Users,
  Shield,
  Infinity,
  GraduationCap,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (monthly: number, annual: number) => {
    return billingCycle === 'monthly' ? monthly : annual;
  };

  const getSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage;
  };

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

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-full p-2 max-w-md mx-auto">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'annual' 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Annual
                <span className="ml-2 text-sm font-bold text-green-400">Save 17%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-xl mb-2">Creative Starter</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $0
                  <span className="text-base font-normal text-gray-500">/month</span>
                </div>
                <CardDescription className="text-sm">Try out the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 mb-6 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">100 monthly AI credits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">10 creative tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">50 games</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">2GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Basic templates (500+)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Ticket support (48-72hr)</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Watermarked exports</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">3 projects max</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-5">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">Creative Pro</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${getPrice(19, 190)}
                  <span className="text-base font-normal text-gray-500">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {billingCycle === 'annual' && (
                    <span className="text-green-600 font-medium">Save ${getSavings(19, 190) * 12}</span>
                  )}
                  {billingCycle === 'monthly' && 'For individual creators'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 mb-6 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1,000 monthly AI credits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">ALL 60+ creative tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1,000+ games library</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">50GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Premium templates (5,000+)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">No watermarks</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited projects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Javari AI assistant (basic)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Market Oracle (5 picks/week)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Ticket support (12-24hr)</span>
                  </li>
                </ul>
                <Link href="/signup?plan=starter">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan - Featured */}
            <Card className="border-4 border-purple-500 shadow-2xl relative transform lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  MOST POPULAR
                </span>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-2">Creative Business</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${getPrice(49, 490)}
                  <span className="text-base font-normal text-gray-500">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {billingCycle === 'annual' && (
                    <span className="text-green-600 font-medium">Save ${getSavings(49, 490) * 12}</span>
                  )}
                  {billingCycle === 'monthly' && 'For teams & businesses'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 mb-6 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">5,000 monthly AI credits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Everything in Starter, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">500GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority AI (2x faster)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Team collaboration (5 members)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Brand kit & templates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Javari AI (advanced + memory)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Market Oracle (unlimited)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">API access (10K req/month)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom domain</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Remove branding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority ticket support (4-8hr)</span>
                  </li>
                </ul>
                <Link href="/signup?plan=pro">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-5">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-800 hover:shadow-xl transition-all">
              <CardHeader className="text-center pb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">Creative Corporation</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${getPrice(199, 1990)}
                  <span className="text-base font-normal text-gray-500">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {billingCycle === 'annual' && (
                    <span className="text-green-600 font-medium">Save ${getSavings(199, 1990) * 12}</span>
                  )}
                  {billingCycle === 'monthly' && 'For large organizations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 mb-6 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium flex items-center gap-1">
                      <Infinity className="w-4 h-4" /> Unlimited AI credits*
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Everything in Pro, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited storage*</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom AI model training</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited team members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">SSO/SAML authentication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">White-label options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">99.9% SLA guarantee</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Premium support (1-2hr)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Quarterly business reviews</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Custom contract terms</span>
                  </li>
                </ul>
                <Link href="/contact?plan=enterprise">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5">
                    Contact Sales
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-3 text-center">*Fair use policy applies</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Special Discounts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Special Discounts Available
              </h2>
              <p className="text-lg text-gray-600">
                We support students, educators, and nonprofits with exclusive pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Student/Educator Discount */}
              <Card className="border-2 border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Student & Educator</CardTitle>
                      <CardDescription>50% off Creative Pro</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      $24.50<span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      or $245/year (normally $380)
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Eligibility:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Valid .edu email address, OR</li>
                      <li>• School/university ID upload, OR</li>
                      <li>• SheerID verification</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> Verification required via support ticket. Must re-verify annually.
                    </p>
                  </div>

                  <Link href="/contact?type=student-discount">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Apply for Discount
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Nonprofit Discount */}
              <Card className="border-2 border-green-200 bg-green-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Nonprofit Organizations</CardTitle>
                      <CardDescription>40% off any paid tier</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      Up to 40% off
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Creative Pro at $29.40/month (normally $49)
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Eligibility:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• IRS 501(c)(3) determination letter, OR</li>
                      <li>• Charity Navigator listing, OR</li>
                      <li>• Percent Pledge verification</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> Verification required via support ticket. Must re-verify annually.
                    </p>
                  </div>

                  <Link href="/contact?type=nonprofit-discount">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Apply for Discount
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>

            {/* Startup Package */}
            <div className="mt-8">
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Zap className="w-8 h-8 text-purple-600" />
                        <h3 className="text-2xl font-bold text-gray-900">Startup Package</h3>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Get Creative Pro for just <span className="font-bold text-purple-600">$29/month</span> for your first 3 months (41% off)
                      </p>
                      <p className="text-sm text-gray-500">
                        For companies less than 2 years old with under 10 employees and less than $1M revenue
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href="/contact?type=startup-package">
                        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Compare All Features
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-purple-50">Pro</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Monthly AI Credits</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">100</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">5,000</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited*</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Creative Tools</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">10</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">60+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">60+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">60+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Games Library</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">50</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1,000+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">1,000+</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1,000+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Cloud Storage</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">2GB</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">50GB</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">500GB</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited*</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Team Members</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">5</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Javari AI Assistant</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">Advanced</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Advanced</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Market Oracle</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">5 picks/week</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Priority AI Processing</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">API Access</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">10K req/mo</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">SSO/SAML</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-purple-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Support Response Time</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">48-72hr</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">12-24hr</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 bg-purple-50">4-8hr</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1-2hr</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              *Fair use policy applies to unlimited features
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "What happens when I run out of AI credits?",
                  a: "Your AI features will be paused until the next billing cycle, or you can purchase additional credit packs at any time. We'll notify you when you're running low."
                },
                {
                  q: "Can I switch plans at any time?",
                  a: "Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle."
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes! All paid plans include a 14-day free trial. No credit card required to start. Cancel anytime during the trial with no charges."
                },
                {
                  q: "What's your refund policy?",
                  a: "We offer a 30-day money-back guarantee on all annual plans. If you're not satisfied, contact support for a full refund within 30 days of purchase."
                },
                {
                  q: "How do discounts work?",
                  a: "Student, educator, and nonprofit discounts require verification through our support ticket system. Once approved, the discount applies automatically to your subscription and must be re-verified annually."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards (Visa, Mastercard, Amex, Discover), PayPal, and can arrange invoicing for Enterprise customers."
                },
                {
                  q: "What's the fair use policy for Enterprise unlimited features?",
                  a: "Our fair use policy allows for 50,000 AI credits per user per month on average and 5TB of storage. Most customers never reach these limits. If you need more, we can discuss custom limits."
                },
                {
                  q: "Can I add more team members to my Pro plan?",
                  a: "Yes! Additional team members on the Pro plan are $10/user/month. Enterprise plans include unlimited team members at no extra cost."
                }
              ].map((faq, index) => (
                <Card key={index} className="border-2 hover:border-blue-300 transition-all cursor-pointer">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">{faq.q}</CardTitle>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                  {openFaq === index && (
                    <CardContent>
                      <p className="text-gray-600">{faq.a}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join thousands of creators using CR AudioViz AI to bring their ideas to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact?type=demo">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-purple-200 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

    </div>
  );
}
