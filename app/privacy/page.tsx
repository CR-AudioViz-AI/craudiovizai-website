import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Database, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100">
              Last Updated: October 21, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-blue-600" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-gray-600">
                <p>
                  CR AudioViz AI ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our platform, located at craudiovizai.com.
                </p>
                <p className="mt-4">
                  By accessing or using our services, you agree to the collection and use of 
                  information in accordance with this Privacy Policy. If you do not agree with 
                  our policies and practices, please do not use our services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Database className="w-6 h-6 mr-3 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-sm">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1 ml-4">
                    <li>Name and email address (for account registration)</li>
                    <li>Payment information (processed securely through Stripe and PayPal)</li>
                    <li>Profile information (username, avatar, bio)</li>
                    <li>Content you create using our tools</li>
                    <li>Communications with our support team</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                  <p className="text-sm">
                    When you use our services, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, features used, time spent)</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Credit usage and transaction history</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-sm space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your transactions and manage your credits</li>
                  <li>Send you technical notices, updates, and security alerts</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues and fraud</li>
                  <li>Personalize your experience with AI-powered recommendations</li>
                  <li>Send you newsletters and marketing communications (with your consent)</li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Share Your Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-blue-600" />
                  How We Share Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                  <p className="text-sm">
                    We share information with third-party service providers who perform services on our behalf:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1 ml-4">
                    <li>Payment processors (Stripe, PayPal)</li>
                    <li>Cloud hosting services (Vercel, Supabase)</li>
                    <li>AI services (OpenAI)</li>
                    <li>Email service providers</li>
                    <li>Analytics providers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                  <p className="text-sm">
                    We may disclose your information if required to do so by law or in response to 
                    valid requests by public authorities (e.g., a court or government agency).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
                  <p className="text-sm">
                    If we are involved in a merger, acquisition, or sale of assets, your information 
                    may be transferred as part of that transaction.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-blue-900">
                    We do not sell your personal information to third parties.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-600" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information, including:
                </p>
                <ul className="list-disc list-inside text-sm space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
                <p className="text-sm mt-4 italic">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. 
                  While we strive to protect your information, we cannot guarantee its absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">You have the right to:</p>
                <ul className="list-disc list-inside text-sm space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Object:</strong> Object to processing of your information for certain purposes</li>
                </ul>
                <p className="text-sm mt-4">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:support@craudiovizai.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    support@craudiovizai.com
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-blue-600" />
                  Cookies and Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm mb-3">
                  We use cookies and similar tracking technologies to track activity on our service 
                  and store certain information. You can instruct your browser to refuse all cookies 
                  or to indicate when a cookie is being sent.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Essential Cookies:</strong> Required for the platform to function properly
                  </div>
                  <div>
                    <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform
                  </div>
                  <div>
                    <strong>Preference Cookies:</strong> Remember your settings and preferences
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm">
                  Our services are not intended for children under the age of 13. We do not knowingly 
                  collect personal information from children under 13. If you are a parent or guardian 
                  and believe your child has provided us with personal information, please contact us 
                  immediately.
                </p>
              </CardContent>
            </Card>

            {/* International Users */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm">
                  Your information may be transferred to and maintained on computers located outside 
                  of your state, province, country, or other governmental jurisdiction where data 
                  protection laws may differ. We ensure appropriate safeguards are in place for such 
                  transfers.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="text-sm">
                  We may update our Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                  You are advised to review this Privacy Policy periodically for any changes.
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
                  If you have any questions about this Privacy Policy, please contact us:
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
                  <div>
                    <strong>Website:</strong>{' '}
                    <a href="https://craudiovizai.com" className="text-blue-600 hover:text-blue-700">
                      craudiovizai.com
                    </a>
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
