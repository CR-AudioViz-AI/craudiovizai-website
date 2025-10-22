import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, CheckCircle, XCircle, Scale, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-purple-100">
              Last Updated: October 21, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Agreement to Terms */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-blue-600" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-gray-600">
                <p className="text-sm">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you 
                  and CR AudioViz AI ("Company," "we," "us," or "our") concerning your access to and 
                  use of the craudiovizai.com website and related services (collectively, the "Services").
                </p>
                <p className="text-sm mt-4">
                  BY ACCESSING OR USING OUR SERVICES, YOU AGREE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE 
                  TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, YOU MAY NOT ACCESS OR USE THE SERVICES.
                </p>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">
                  You must be at least 13 years old to use our Services. If you are under 18, you 
                  represent that you have your parent or guardian's permission to use the Services.
                </p>
                <p className="text-sm">
                  By using our Services, you represent and warrant that you meet the eligibility 
                  requirements and that all information you provide is accurate and current.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Account Creation</h3>
                  <p className="text-sm">
                    To access certain features, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1 ml-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information to keep it accurate</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Account Termination</h3>
                  <p className="text-sm">
                    We reserve the right to suspend or terminate your account at any time for 
                    violations of these Terms or for any other reason, with or without notice.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credit System */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Credit System and Payments</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Credits</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Credits are our platform currency used to access tools and features</li>
                    <li>Free plan credits expire monthly; Pro and Professional plan credits do not expire</li>
                    <li>Credits are non-transferable and have no cash value</li>
                    <li>Credit costs for features may change with notice</li>
                    <li>Unused credits are forfeited upon account termination</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Subscriptions and Payments</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Subscription fees are billed in advance on a recurring basis</li>
                    <li>All payments are processed through secure third-party processors (Stripe, PayPal)</li>
                    <li>You authorize us to charge your payment method for all fees</li>
                    <li>Prices are subject to change with 30 days' notice</li>
                    <li>No refunds for partial months or unused credits, except as required by law</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Cancellation</h3>
                  <p className="text-sm">
                    You may cancel your subscription at any time. Cancellation takes effect at the 
                    end of your current billing period. You will retain access until that date.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card className="mb-8 border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <XCircle className="w-6 h-6 mr-3 text-red-600" />
                  Acceptable Use Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3 font-semibold">You agree NOT to use our Services to:</p>
                <ul className="list-disc list-inside text-sm space-y-2 ml-4">
                  <li>Violate any laws, regulations, or third-party rights</li>
                  <li>Upload or create illegal, harmful, or offensive content</li>
                  <li>Infringe intellectual property rights</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Services</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Scrape, spider, or crawl the Services</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Use the Services for any illegal or unauthorized purpose</li>
                </ul>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
                  <p className="text-sm font-semibold text-red-900">
                    Violation of these policies may result in immediate account termination and legal action.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-600" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Our Content</h3>
                  <p className="text-sm">
                    The Services and all content, features, and functionality are owned by CR AudioViz AI 
                    and are protected by copyright, trademark, and other intellectual property laws. You may 
                    not copy, modify, distribute, or create derivative works without our written permission.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Your Content</h3>
                  <p className="text-sm mb-2">
                    You retain ownership of content you create using our Services. However, by using our 
                    Services, you grant us:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>A worldwide, non-exclusive license to host, store, and display your content</li>
                    <li>The right to use your content to provide and improve our Services</li>
                    <li>The right to display your content in our marketplace (if you choose to list it)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Marketplace Submissions</h3>
                  <p className="text-sm">
                    If you submit content to our marketplace (games, apps, templates), you grant users 
                    the right to use your content according to the license you specify. We retain a 30% 
                    commission on all sales, as outlined in our Creator Agreement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Creator Revenue */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Creator Revenue Sharing</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">
                  Creators who list content in our marketplace receive 70% of net revenue, with CR AudioViz AI 
                  retaining 30% for platform maintenance, hosting, and support.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Payments are processed monthly for balances over $50</li>
                  <li>You are responsible for any applicable taxes on your earnings</li>
                  <li>Revenue share may be adjusted with 60 days' notice</li>
                  <li>We reserve the right to withhold payments for policy violations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-yellow-600" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Service Availability</h3>
                  <p className="text-sm">
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. 
                    We do not guarantee that the Services will be uninterrupted, error-free, or secure.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">AI-Generated Content</h3>
                  <p className="text-sm">
                    Content generated by our AI tools (including Javari) may not always be accurate, 
                    appropriate, or suitable for your purposes. You are responsible for reviewing and 
                    verifying all AI-generated content before use.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Limitation of Liability</h3>
                  <p className="text-sm">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, CR AUDIOVIZ AI SHALL NOT BE LIABLE FOR ANY 
                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR 
                    USE OF THE SERVICES.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Scale className="w-6 h-6 mr-3 text-blue-600" />
                  Indemnification
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm">
                  You agree to indemnify and hold harmless CR AudioViz AI from any claims, damages, 
                  losses, liabilities, and expenses arising from: (a) your use of the Services; 
                  (b) your violation of these Terms; (c) your violation of any rights of another; 
                  or (d) your content.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Governing Law and Disputes</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">
                  These Terms are governed by the laws of the State of Florida, United States, 
                  without regard to conflict of law principles.
                </p>
                <p className="text-sm">
                  Any disputes arising from these Terms or the Services shall be resolved through 
                  binding arbitration in Fort Myers, Florida, except that either party may seek 
                  injunctive relief in court.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm">
                  We reserve the right to modify these Terms at any time. We will notify you of 
                  material changes by email or through the Services. Your continued use of the 
                  Services after changes constitute acceptance of the modified Terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mb-8 bg-blue-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p className="text-sm mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:support@craudiovizai.com" className="text-blue-600 hover:text-blue-700">
                      support@craudiovizai.com
                    </a>
                  </div>
                  <div>
                    <strong>Location:</strong> Fort Myers, Florida, United States
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
