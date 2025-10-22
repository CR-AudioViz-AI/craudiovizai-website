import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              Please read these terms carefully before using CR AudioViz AI
            </p>
            <p className="text-sm text-blue-200">
              Last Updated: October 22, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700 text-sm">
                  By accessing or using CR AudioViz AI, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            
            {/* Section 1 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                
                <p className="text-gray-600 mb-4">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and 
                  CR AudioViz AI ("Company," "we," "us," or "our") regarding your use of the CR AudioViz AI 
                  platform, including all features, tools, services, and content (collectively, the "Service").
                </p>

                <p className="text-gray-600 mb-4">
                  By creating an account, accessing the platform, or using any of our services, you acknowledge 
                  that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>

                <p className="text-gray-600">
                  If you are using the Service on behalf of an organization, you represent and warrant that you 
                  have the authority to bind that organization to these Terms.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Eligibility
                </h2>
                
                <p className="text-gray-600 mb-4">
                  You must be at least 13 years old to use the Service. If you are between 13 and 18 years old, 
                  you must have your parent or legal guardian's permission to use the Service.
                </p>

                <p className="text-gray-600 mb-4">
                  By using the Service, you represent and warrant that:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li>• You meet the age requirements stated above</li>
                  <li>• All information you provide is accurate and complete</li>
                  <li>• You will maintain the accuracy of such information</li>
                  <li>• Your use of the Service does not violate any applicable law or regulation</li>
                  <li>• You have not been previously banned from the Service</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Account Registration and Security
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Account Creation
                </h3>
                <p className="text-gray-600 mb-4">
                  To access certain features of the Service, you must create an account. When creating an account, 
                  you agree to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Provide accurate, current, and complete information</li>
                  <li>• Maintain and promptly update your account information</li>
                  <li>• Not impersonate any person or entity</li>
                  <li>• Not create multiple accounts for deceptive purposes</li>
                  <li>• Not share your account with others</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Account Security
                </h3>
                <p className="text-gray-600 mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all 
                  activities that occur under your account. You agree to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Choose a strong, unique password</li>
                  <li>• Enable two-factor authentication when available</li>
                  <li>• Immediately notify us of any unauthorized use of your account</li>
                  <li>• Not share your password with anyone</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  We are not liable for any loss or damage arising from your failure to comply with these security requirements.
                </p>
              </CardContent>
            </Card>

            {/* Section 4 - Credits & Payments */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Credits, Subscriptions, and Payments
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Credit System
                </h3>
                <p className="text-gray-600 mb-4">
                  Our platform uses a credit-based system for using tools and features. Credits are our internal 
                  currency and have no cash value. Key credit rules:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• <strong>Free Plan:</strong> Credits expire monthly and do not roll over</li>
                  <li>• <strong>Pro & Professional Plans:</strong> Credits never expire while your subscription is active</li>
                  <li>• <strong>Grace Period:</strong> You have 10 days after subscription expiration to renew and keep your credits</li>
                  <li>• <strong>After Grace Period:</strong> All unused credits are permanently forfeited</li>
                  <li>• Credits are non-refundable and cannot be exchanged for cash</li>
                  <li>• Credit costs for tools and features may change with 30 days notice</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Subscriptions
                </h3>
                <p className="text-gray-600 mb-4">
                  Subscription plans automatically renew at the end of each billing cycle unless canceled. By subscribing, you authorize us to charge your payment method:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Monthly or annual subscription fees</li>
                  <li>• Any applicable taxes</li>
                  <li>• Additional credit purchases</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Refund Policy
                </h3>
                <p className="text-gray-600 mb-4 font-semibold">
                  14-Day Money-Back Guarantee (First-Time Subscribers Only):
                </p>
                <p className="text-gray-600 mb-4">
                  We offer a 14-day money-back guarantee for first-time subscribers, but ONLY if you:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Have NOT used any credits</li>
                  <li>• Have NOT generated, downloaded, or exported any content</li>
                  <li>• Have NOT accessed any paid features</li>
                  <li>• Request a refund within 14 days of initial payment</li>
                </ul>
                <p className="text-gray-600 mb-4 font-semibold">
                  Once you use any credits or features, all payments are final and non-refundable.
                </p>
                <p className="text-gray-600">
                  Canceling your subscription does not entitle you to a refund for the current billing period. 
                  You will retain access until the end of the paid period.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Price Changes
                </h3>
                <p className="text-gray-600">
                  We may change subscription prices or credit costs at any time. For existing subscribers, 
                  price changes will take effect at the next renewal after 30 days' notice. Continued use 
                  of the Service after a price change constitutes acceptance of the new prices.
                </p>
              </CardContent>
            </Card>

            {/* Section 5 - User Content */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. User Content and Intellectual Property
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Your Content
                </h3>
                <p className="text-gray-600 mb-4">
                  You retain all ownership rights to content you create, upload, or submit to the Service 
                  ("Your Content"). However, by uploading Your Content, you grant us a worldwide, non-exclusive, 
                  royalty-free license to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Store, host, and display Your Content</li>
                  <li>• Process and analyze Your Content to provide and improve the Service</li>
                  <li>• Display Your Content in public areas of the platform (if you choose to make it public)</li>
                  <li>• Use Your Content for promotional purposes (with your permission)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Content Responsibilities
                </h3>
                <p className="text-gray-600 mb-4">
                  You are solely responsible for Your Content and the consequences of posting or publishing it. 
                  You represent and warrant that:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• You own or have the necessary rights to Your Content</li>
                  <li>• Your Content does not violate any intellectual property rights</li>
                  <li>• Your Content does not violate these Terms or applicable laws</li>
                  <li>• Your Content is not defamatory, obscene, or otherwise objectionable</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Marketplace Sales
                </h3>
                <p className="text-gray-600 mb-4">
                  When you sell content in our marketplace:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• You grant buyers the licenses specified in the listing (personal use, commercial use, etc.)</li>
                  <li>• You earn 70% of the sale price (we retain 30%)</li>
                  <li>• You are responsible for honoring the license terms</li>
                  <li>• You must not sell content you don't have rights to</li>
                  <li>• Award winners earn 80% for 30 days after winning</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Our Intellectual Property
                </h3>
                <p className="text-gray-600">
                  The Service, including all software, designs, text, graphics, and other content (excluding Your Content), 
                  is owned by CR AudioViz AI and is protected by copyright, trademark, and other intellectual property laws. 
                  You may not copy, modify, distribute, or create derivative works without our express written permission.
                </p>
              </CardContent>
            </Card>

            {/* Section 6 - Prohibited Conduct */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Prohibited Conduct
                </h2>
                
                <p className="text-gray-600 mb-4">
                  You agree NOT to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Violate any laws or regulations</li>
                  <li>• Infringe on anyone's intellectual property rights</li>
                  <li>• Upload malicious code, viruses, or malware</li>
                  <li>• Harass, threaten, or intimidate other users</li>
                  <li>• Impersonate another person or entity</li>
                  <li>• Create fake accounts or engage in deceptive practices</li>
                  <li>• Scrape, crawl, or data mine the Service</li>
                  <li>• Attempt to gain unauthorized access to any part of the Service</li>
                  <li>• Interfere with or disrupt the Service</li>
                  <li>• Use automated tools (bots) without permission</li>
                  <li>• Resell or commercially exploit the Service without permission</li>
                  <li>• Share your account credentials</li>
                  <li>• Upload pornographic, violent, or hateful content</li>
                  <li>• Spam, scam, or engage in fraudulent activity</li>
                  <li>• Reverse engineer or attempt to extract source code</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  Violation of these rules may result in immediate account suspension or termination without refund.
                </p>
              </CardContent>
            </Card>

            {/* Section 7 - Termination */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Termination
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Your Right to Terminate
                </h3>
                <p className="text-gray-600 mb-4">
                  You may cancel your account at any time from your account settings. Upon cancellation:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Your subscription will not renew at the end of the current billing period</li>
                  <li>• You will retain access until the end of the paid period</li>
                  <li>• No refunds will be provided for the remaining time</li>
                  <li>• You have 10 days after expiration to renew and keep your credits</li>
                  <li>• After 10 days, all credits are forfeited</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Our Right to Terminate
                </h3>
                <p className="text-gray-600 mb-4">
                  We reserve the right to suspend or terminate your account at any time, with or without notice, if:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• You violate these Terms</li>
                  <li>• You engage in fraudulent or illegal activity</li>
                  <li>• Your payment method fails repeatedly</li>
                  <li>• We discontinue the Service</li>
                  <li>• Required by law or court order</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  Upon termination by us for cause, no refunds will be provided, and you forfeit all credits immediately.
                </p>
              </CardContent>
            </Card>

            {/* Section 8 - Disclaimers */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Disclaimers and Warranties
                </h2>
                
                <p className="text-gray-600 mb-4 uppercase font-semibold">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>

                <p className="text-gray-600 mb-4">
                  We disclaim all warranties, including but not limited to:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Warranties of merchantability and fitness for a particular purpose</li>
                  <li>• Warranties that the Service will be uninterrupted, secure, or error-free</li>
                  <li>• Warranties regarding the accuracy, reliability, or quality of content</li>
                  <li>• Warranties that defects will be corrected</li>
                </ul>

                <p className="text-gray-600 mb-4">
                  We do not guarantee that:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• The Service will meet your specific requirements</li>
                  <li>• Your content will be secure or not lost</li>
                  <li>• Results obtained from the Service will be accurate or reliable</li>
                  <li>• AI-generated content will be error-free or suitable for your purpose</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  You use the Service at your own risk. We recommend backing up important content regularly.
                </p>
              </CardContent>
            </Card>

            {/* Section 9 - Limitation of Liability */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Limitation of Liability
                </h2>
                
                <p className="text-gray-600 mb-4 uppercase font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CR AUDIOVIZ AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>

                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Loss of profits, revenue, or business opportunities</li>
                  <li>• Loss of data or content</li>
                  <li>• Loss of goodwill or reputation</li>
                  <li>• Cost of substitute services</li>
                  <li>• Personal injury or property damage</li>
                </ul>

                <p className="text-gray-600 mb-4 uppercase font-semibold">
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE 
                  SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
                </p>

                <p className="text-gray-600">
                  Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. 
                  In such jurisdictions, our liability will be limited to the maximum extent permitted by law.
                </p>
              </CardContent>
            </Card>

            {/* Section 10 - Indemnification */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Indemnification
                </h2>
                
                <p className="text-gray-600 mb-4">
                  You agree to indemnify, defend, and hold harmless CR AudioViz AI, its officers, directors, employees, 
                  and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including 
                  reasonable attorneys' fees) arising out of or related to:
                </p>

                <ul className="space-y-2 text-gray-600">
                  <li>• Your use of the Service</li>
                  <li>• Your Content</li>
                  <li>• Your violation of these Terms</li>
                  <li>• Your violation of any rights of another person or entity</li>
                  <li>• Your violation of any applicable laws or regulations</li>
                </ul>

                <p className="text-gray-600 mt-4">
                  We reserve the right to assume the exclusive defense and control of any matter subject to 
                  indemnification by you, in which case you agree to cooperate with our defense.
                </p>
              </CardContent>
            </Card>

            {/* Section 11 - Governing Law & Disputes */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Governing Law and Dispute Resolution
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Governing Law
                </h3>
                <p className="text-gray-600 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Florida, 
                  United States, without regard to its conflict of law provisions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Dispute Resolution
                </h3>
                <p className="text-gray-600 mb-4">
                  Any dispute arising out of or relating to these Terms or the Service shall be resolved through:
                </p>
                <ol className="space-y-2 text-gray-600 mb-4 list-decimal ml-6">
                  <li><strong>Informal Negotiation:</strong> First, contact us at legal@craudiovizai.com to attempt to resolve the dispute informally</li>
                  <li><strong>Binding Arbitration:</strong> If informal resolution fails, disputes shall be resolved through binding arbitration in accordance with the American Arbitration Association rules</li>
                  <li><strong>Class Action Waiver:</strong> You agree to resolve disputes on an individual basis only, not as part of a class action or representative proceeding</li>
                </ol>

                <p className="text-gray-600">
                  Notwithstanding the above, we may seek injunctive relief in any court of competent jurisdiction 
                  to protect our intellectual property rights.
                </p>
              </CardContent>
            </Card>

            {/* Section 12 - Miscellaneous */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Miscellaneous
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Changes to Terms
                </h3>
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these Terms at any time. When we make significant changes, we will:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Update the "Last Updated" date</li>
                  <li>• Notify you via email or prominent platform notice</li>
                  <li>• Require acceptance for material changes</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Your continued use after changes constitutes acceptance of the new Terms.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Entire Agreement
                </h3>
                <p className="text-gray-600 mb-4">
                  These Terms, along with our Privacy Policy, constitute the entire agreement between you and 
                  CR AudioViz AI regarding the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Severability
                </h3>
                <p className="text-gray-600 mb-4">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will 
                  remain in full force and effect.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Waiver
                </h3>
                <p className="text-gray-600 mb-4">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Assignment
                </h3>
                <p className="text-gray-600">
                  You may not assign or transfer these Terms or your account without our written consent. 
                  We may assign these Terms without restriction.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h2>
                
                <p className="text-gray-600 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>

                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> <a href="mailto:legal@craudiovizai.com" className="text-blue-600 hover:underline">legal@craudiovizai.com</a></p>
                  <p><strong>Support:</strong> <a href="mailto:support@craudiovizai.com" className="text-blue-600 hover:underline">support@craudiovizai.com</a></p>
                  <p><strong>Mail:</strong> CR AudioViz AI, Legal Department, Fort Myers, FL 33901, USA</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
