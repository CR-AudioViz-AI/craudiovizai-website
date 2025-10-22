import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-teal-600 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Quick answers to common questions about CR AudioViz AI
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 h-12"
                />
                <Button className="bg-white text-green-600 hover:bg-green-50 h-12">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* General Questions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">General Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is CR AudioViz AI?</AccordionTrigger>
                    <AccordionContent>
                      CR AudioViz AI is a comprehensive AI-powered platform that empowers creators to build apps, games, 
                      websites, and more. We offer 60+ creative tools, 1,200+ games, and Javari AI assistant to help you 
                      bring your ideas to life without extensive coding knowledge.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Who is CR AudioViz AI for?</AccordionTrigger>
                    <AccordionContent>
                      Our platform is perfect for entrepreneurs, small businesses, content creators, designers, developers, 
                      educators, and anyone who wants to create digital content without the complexity of traditional 
                      development tools. Whether you're a complete beginner or an experienced professional, our tools 
                      scale to your needs.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Do I need coding experience?</AccordionTrigger>
                    <AccordionContent>
                      No coding experience is required! Our AI-powered tools, especially Javari, guide you through the 
                      creation process using natural language. However, if you are a developer, you have full access to 
                      the code and can customize everything to your heart's content.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>What can I build with CR AudioViz AI?</AccordionTrigger>
                    <AccordionContent>
                      You can build websites, mobile apps, games, graphics, videos, logos, presentations, e-commerce stores, 
                      landing pages, and much more. Our 60+ tools cover design, development, marketing, and content creation. 
                      You can also purchase complete apps from our marketplace and white-label them.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Credits & Pricing */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Credits & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do credits work?</AccordionTrigger>
                    <AccordionContent>
                      Credits are our universal currency for using tools and features. Each action costs a certain number 
                      of credits based on complexity. For example, a simple logo might cost 5 credits, while building a 
                      complete website might cost 50 credits. Free plan credits expire monthly, but Pro and Professional 
                      plan credits NEVER expire and roll over indefinitely!
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Do credits expire?</AccordionTrigger>
                    <AccordionContent>
                      It depends on your plan:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><strong>Free Plan:</strong> Credits expire monthly (no rollover)</li>
                        <li><strong>Pro Plan ($49/mo):</strong> Credits NEVER expire and roll over indefinitely while plan is active</li>
                        <li><strong>Professional Plan:</strong> Credits NEVER expire and roll over indefinitely while plan is active</li>
                      </ul>
                      <p className="mt-2">
                        If your plan expires, you have a <strong>10-day grace period</strong> to renew and keep all your credits!
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>What is the 10-day grace period?</AccordionTrigger>
                    <AccordionContent>
                      If your paid subscription expires (due to cancellation or failed payment), you have 10 days to 
                      renew your plan. During this grace period, all your accumulated credits remain available. If you 
                      renew within 10 days, you keep all your credits. After 10 days without renewal, all credits are 
                      permanently forfeited.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I buy more credits without upgrading my plan?</AccordionTrigger>
                    <AccordionContent>
                      Yes! You can purchase additional credits at any time. Top-up credits follow the same expiration 
                      rules as your current plan. If you're on the Free plan, top-up credits expire monthly. If you're 
                      on Pro or Professional, top-up credits never expire while your plan is active.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Can I change my plan anytime?</AccordionTrigger>
                    <AccordionContent>
                      Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and 
                      downgrades take effect at the end of your current billing cycle. Your credits are preserved during 
                      plan changes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Apps & Marketplace */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Apps & Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Can I purchase apps outright instead of using credits?</AccordionTrigger>
                    <AccordionContent>
                      Yes! Most apps offer two options:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><strong>Credit-Based Usage:</strong> Pay per use with credits (no code ownership)</li>
                        <li><strong>One-Time Purchase:</strong> Buy the complete source code ($49-$499 depending on app)</li>
                      </ul>
                      <p className="mt-2">
                        When you purchase an app, you get full commercial rights and can host it anywhere or use our 
                        platform for free lifetime updates!
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>What's the difference between hosting on your platform vs. self-hosting?</AccordionTrigger>
                    <AccordionContent>
                      <strong>Hosting on CR AudioViz AI (Recommended):</strong>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>FREE lifetime updates automatically applied</li>
                        <li>FREE bug fixes and security patches</li>
                        <li>FREE technical support</li>
                        <li>Small hosting fee: $5-20/mo</li>
                      </ul>
                      <strong className="block mt-3">Self-Hosting:</strong>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Full code ownership and control</li>
                        <li>Host on your own servers</li>
                        <li>No automatic updates (snapshot at purchase)</li>
                        <li>Optional support plan: $99/mo or $499/year</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I sell my creations in the marketplace?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely! Pro and Professional plan members can sell their creations (apps, games, templates, 
                      graphics, etc.) in our marketplace. You earn 70% of the sale price, and we take 30% for platform 
                      fees, hosting, and payment processing. Payments are processed monthly for balances over $50.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I white-label apps I purchase?</AccordionTrigger>
                    <AccordionContent>
                      Yes! When you purchase an app outright, you receive full commercial rights including white-labeling. 
                      You can rebrand, modify, and resell the app as your own. Perfect for agencies and resellers!
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Javari AI */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Javari AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is Javari?</AccordionTrigger>
                    <AccordionContent>
                      Javari is our AI assistant that helps you build apps, websites, games, and more through natural 
                      conversation. Just describe what you want to create, and Javari guides you through the entire 
                      process, writes code, generates designs, and answers questions. Think of Javari as your personal 
                      creative partner!
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How many messages can I send to Javari?</AccordionTrigger>
                    <AccordionContent>
                      Each message to Javari costs 1 credit. With the Pro plan's 500 credits/month (that never expire!), 
                      you can have extensive conversations. Complex requests that generate code or designs may cost 
                      additional credits depending on the output.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can Javari build anything I ask for?</AccordionTrigger>
                    <AccordionContent>
                      Javari can build a wide range of apps, websites, games, and tools. However, AI has limitations. 
                      Very complex enterprise applications or highly specialized features may require additional 
                      development. Javari will always let you know what's possible and guide you to the best solution.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Refunds & Cancellation */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Refunds & Cancellation</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                    <AccordionContent>
                      We offer a <strong>14-day money-back guarantee</strong> for first-time subscribers, but ONLY if you:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Have NOT used any credits</li>
                        <li>Have NOT generated, downloaded, or exported any content</li>
                        <li>Have NOT accessed any paid features</li>
                        <li>Request within 14 days of initial payment</li>
                      </ul>
                      <p className="mt-2 font-semibold">
                        Once you use any credits or features, all payments are final and non-refundable.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                    <AccordionContent>
                      You can cancel your subscription anytime from your account settings. Cancellation takes effect at 
                      the end of your current billing period. You retain full access until then, and you have 10 days 
                      after expiration to renew and keep all your credits. No refunds are provided upon cancellation.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>What happens to my credits when I cancel?</AccordionTrigger>
                    <AccordionContent>
                      When you cancel, your subscription continues until the end of the billing period. After that, 
                      you have a 10-day grace period to renew. If you renew within 10 days, all your credits are 
                      preserved. After 10 days without renewal, all credits are permanently forfeited.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Technical */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Technical Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What browsers do you support?</AccordionTrigger>
                    <AccordionContent>
                      CR AudioViz AI works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend 
                      using Chrome for the best experience. Internet Explorer is not supported.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is there a mobile app?</AccordionTrigger>
                    <AccordionContent>
                      We have a mobile-responsive web app that works great on phones and tablets. Native iOS and Android 
                      apps are coming soon! You'll be able to create, edit, and manage your projects on the go.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How secure is my data?</AccordionTrigger>
                    <AccordionContent>
                      We take security seriously. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). 
                      We're GDPR and CCPA compliant. Payment processing is handled by Stripe and PayPal (PCI DSS Level 1). 
                      We never store your payment information on our servers.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I export my data?</AccordionTrigger>
                    <AccordionContent>
                      Yes! You can export all your creations, projects, and data at any time. We believe your work is 
                      yours, and you should never be locked in. Different file formats are available depending on the 
                      type of content.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
