import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Database, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              Your privacy and data security are our top priorities
            </p>
            <p className="text-sm text-blue-200">
              Last Updated: October 22, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Privacy at a Glance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Encrypted Data</h3>
                  <p className="text-sm text-gray-600">
                    All data encrypted in transit and at rest with AES-256
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">No Data Selling</h3>
                  <p className="text-sm text-gray-600">
                    We never sell your personal information to third parties
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Your Control</h3>
                  <p className="text-sm text-gray-600">
                    Export or delete your data anytime from your dashboard
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            
            {/* Section 1 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-blue-600" />
                  1. Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Information You Provide
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Account Information:</strong> Name, email address, password, profile photo</li>
                  <li><strong>Payment Information:</strong> Processed securely through Stripe and PayPal (we do not store credit card numbers)</li>
                  <li><strong>Content:</strong> Files, projects, apps, games, art, music, and other content you create or upload</li>
                  <li><strong>Communications:</strong> Messages, support tickets, and feedback you send us</li>
                  <li><strong>Profile Information:</strong> Bio, social media links, portfolio items, and other optional profile details</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Automatically Collected Information
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Usage Data:</strong> Features used, time spent, pages visited, clicks, and interactions</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Location Data:</strong> General location based on IP address (not precise GPS)</li>
                  <li><strong>Cookies:</strong> Small files that help us remember your preferences and improve your experience</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-green-600" />
                  2. How We Use Your Information
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We use your information to provide, improve, and personalize our services:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li><strong>Provide Services:</strong> Process payments, deliver features, store your content, and enable platform functionality</li>
                  <li><strong>Improve Platform:</strong> Analyze usage patterns, identify bugs, and develop new features</li>
                  <li><strong>Personalization:</strong> Recommend relevant tools, content, and opportunities based on your activity</li>
                  <li><strong>Communications:</strong> Send transactional emails (receipts, notifications), marketing emails (with your consent), and important updates</li>
                  <li><strong>Security:</strong> Detect fraud, prevent abuse, and protect user safety</li>
                  <li><strong>Legal Compliance:</strong> Comply with laws, respond to legal requests, and enforce our terms</li>
                  <li><strong>Customer Support:</strong> Respond to your questions and resolve issues</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Information Sharing
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We do not sell your personal information. We share information only in these limited circumstances:
                </p>

                <ul className="space-y-3 text-gray-600">
                  <li>
                    <strong>Service Providers:</strong> We work with trusted companies that help us operate the platform:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• Payment processors (Stripe, PayPal)</li>
                      <li>• Cloud hosting (AWS, Google Cloud)</li>
                      <li>• Email services (SendGrid)</li>
                      <li>• Analytics (Google Analytics, Mixpanel)</li>
                      <li>• Customer support tools (Intercom, Zendesk)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Public Content:</strong> Content you choose to make public (marketplace items, public profiles, published work) is visible to other users
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose information to comply with laws, court orders, or government requests
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share information for other purposes with your explicit permission
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Data Security
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li><strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256 for data at rest</li>
                  <li><strong>Access Controls:</strong> Strict employee access policies with multi-factor authentication</li>
                  <li><strong>Regular Audits:</strong> Third-party security audits and penetration testing</li>
                  <li><strong>Secure Infrastructure:</strong> Enterprise-grade cloud hosting with redundancy and backups</li>
                  <li><strong>Monitoring:</strong> 24/7 automated security monitoring and threat detection</li>
                  <li><strong>Incident Response:</strong> Documented procedures for security breaches</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Your Privacy Rights
                </h2>
                
                <p className="text-gray-600 mb-4">
                  You have the following rights regarding your personal information:
                </p>

                <ul className="space-y-3 text-gray-600">
                  <li><strong>Access:</strong> Request a copy of all personal data we have about you</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information in your account settings</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data (subject to legal retention requirements)</li>
                  <li><strong>Export:</strong> Download your data in a portable format from your dashboard</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (transactional emails cannot be disabled)</li>
                  <li><strong>Do Not Track:</strong> We respect browser "Do Not Track" signals</li>
                  <li><strong>Objection:</strong> Object to certain processing of your data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  To exercise these rights, contact us at <a href="mailto:privacy@craudiovizai.com" className="text-blue-600 hover:underline">privacy@craudiovizai.com</a> or use the data controls in your account settings.
                </p>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Cookies and Tracking
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to improve your experience:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li><strong>Essential Cookies:</strong> Required for the platform to function (login sessions, security)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use the platform</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and customizations</li>
                  <li><strong>Marketing Cookies:</strong> Track effectiveness of our advertising (with your consent)</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.
                </p>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Children's Privacy
                </h2>
                
                <p className="text-gray-600 mb-4">
                  Our platform is not intended for children under 13 years old. We do not knowingly collect personal information from children under 13.
                </p>

                <p className="text-gray-600 mb-4">
                  For users aged 13-17, we require parental consent for certain features and limit data collection in accordance with applicable laws.
                </p>

                <p className="text-gray-600">
                  If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information.
                </p>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. International Data Transfers
                </h2>
                
                <p className="text-gray-600 mb-4">
                  CR AudioViz AI is based in the United States. If you access our platform from outside the US, your information will be transferred to, stored, and processed in the United States.
                </p>

                <p className="text-gray-600 mb-4">
                  We comply with applicable data protection laws, including GDPR for European users and CCPA for California residents.
                </p>

                <p className="text-gray-600">
                  For European users, we use Standard Contractual Clauses approved by the European Commission to protect your data.
                </p>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Data Retention
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                  <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days; some data retained for legal/business purposes up to 7 years</li>
                  <li><strong>Content:</strong> Your uploaded content is deleted when you delete it or close your account</li>
                  <li><strong>Backups:</strong> Data in backups may persist for up to 90 days</li>
                  <li><strong>Legal Requirements:</strong> Some data retained longer to comply with legal obligations (e.g., tax records, transaction history)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 10 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Third-Party Links
                </h2>
                
                <p className="text-gray-600">
                  Our platform may contain links to third-party websites, apps, or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </CardContent>
            </Card>

            {/* Section 11 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Changes to This Policy
                </h2>
                
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. When we make significant changes, we will:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li>• Update the "Last Updated" date at the top of this page</li>
                  <li>• Notify you via email (for material changes)</li>
                  <li>• Display a prominent notice on the platform</li>
                  <li>• Require you to accept the new policy (for significant changes)</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  Your continued use of the platform after changes take effect constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact Us About Privacy
                </h2>
                
                <p className="text-gray-600 mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>

                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> <a href="mailto:privacy@craudiovizai.com" className="text-blue-600 hover:underline">privacy@craudiovizai.com</a></p>
                  <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@craudiovizai.com" className="text-blue-600 hover:underline">dpo@craudiovizai.com</a></p>
                  <p><strong>Mail:</strong> CR AudioViz AI, Attn: Privacy Department, Fort Myers, FL 33901, USA</p>
                </div>

                <p className="text-gray-600 mt-4 text-sm">
                  For European users: You have the right to lodge a complaint with your local data protection authority if you believe we have not adequately addressed your concerns.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
