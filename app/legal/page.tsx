import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileText, 
  Lock, 
  Eye, 
  Cookie,
  Scale,
  AlertCircle,
  CheckCircle2,
  Download
} from 'lucide-react';
import Link from 'next/link';

/**
 * Legal Page
 * Comprehensive legal documentation and policies
 * 
 * Created: October 31, 2025
 */

export default function LegalPage() {
  const lastUpdated = 'October 31, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Legal & Compliance
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Transparency, compliance, and your rights. Everything you need to know 
              about using CR AudioViz AI's platform.
            </p>
            <Badge className="bg-white/20 text-white border-white/30">
              Last Updated: {lastUpdated}
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/terms">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Terms of Service</h3>
                  <p className="text-sm text-gray-600">Platform usage terms</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/privacy">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Lock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Privacy Policy</h3>
                  <p className="text-sm text-gray-600">Data protection info</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Cookie className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Cookie Policy</h3>
                <p className="text-sm text-gray-600">How we use cookies</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Eye className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">DMCA Policy</h3>
                <p className="text-sm text-gray-600">Copyright protection</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DMCA Policy */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl">DMCA Policy</CardTitle>
              </div>
              <p className="text-sm text-gray-600">
                Digital Millennium Copyright Act Compliance
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Copyright Infringement Notification</h3>
              <p>
                CR AudioViz AI, LLC respects the intellectual property rights of others and expects 
                users to do the same. We respond to notices of alleged copyright infringement that 
                comply with the Digital Millennium Copyright Act ("DMCA").
              </p>

              <h3>Filing a DMCA Notice</h3>
              <p>
                If you believe that your copyrighted work has been copied in a way that constitutes 
                copyright infringement and is accessible via our Service, please notify our copyright 
                agent by providing the following information:
              </p>

              <ul>
                <li>
                  <strong>Identification of the copyrighted work:</strong> A description of the copyrighted 
                  work that you claim has been infringed, including the URL where the work exists or a 
                  copy of it.
                </li>
                <li>
                  <strong>Identification of the infringing material:</strong> The exact URL or other 
                  specific location on our Service where the material you claim is infringing is located.
                </li>
                <li>
                  <strong>Your contact information:</strong> Your address, telephone number, and email address.
                </li>
                <li>
                  <strong>Statement of good faith:</strong> A statement that you have a good faith belief 
                  that the disputed use is not authorized by the copyright owner, its agent, or the law.
                </li>
                <li>
                  <strong>Statement of accuracy:</strong> A statement, made under penalty of perjury, that 
                  the information in your notice is accurate and that you are the copyright owner or 
                  authorized to act on the copyright owner's behalf.
                </li>
                <li>
                  <strong>Signature:</strong> An electronic or physical signature of the copyright owner 
                  or a person authorized to act on their behalf.
                </li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-lg mt-6">
                <h4 className="font-semibold mb-2">Submit DMCA Notices To:</h4>
                <p className="mb-2">
                  <strong>Email:</strong> legal@craudiovizai.com<br />
                  <strong>Subject Line:</strong> DMCA Takedown Request
                </p>
                <p className="mb-2">
                  <strong>Mail:</strong><br />
                  DMCA Agent<br />
                  CR AudioViz AI, LLC<br />
                  17868 Terracina Dr<br />
                  Fort Myers, FL 33913
                </p>
              </div>

              <h3>Counter-Notification</h3>
              <p>
                If you believe that content you posted was removed or disabled by mistake or 
                misidentification, you may file a counter-notification containing:
              </p>

              <ul>
                <li>Your physical or electronic signature</li>
                <li>Identification of the content that was removed and its location</li>
                <li>A statement under penalty of perjury that the content was removed by mistake</li>
                <li>Your name, address, and telephone number</li>
                <li>A statement consenting to jurisdiction of Federal District Court</li>
              </ul>

              <h3>Repeat Infringer Policy</h3>
              <p>
                CR AudioViz AI has a policy of terminating, in appropriate circumstances, users 
                who are deemed to be repeat infringers. We may also limit access to the Service 
                and/or terminate accounts of users who infringe any intellectual property rights 
                of others.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">Important Note</p>
                    <p className="text-sm text-yellow-800">
                      Misrepresentation in a DMCA notice or counter-notice may result in legal liability. 
                      We recommend consulting with an attorney before filing a DMCA notice or counter-notice.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Policy */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Cookie className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl">Cookie Policy</CardTitle>
              </div>
              <p className="text-sm text-gray-600">
                How we use cookies and similar technologies
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>What Are Cookies?</h3>
              <p>
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our Service.
              </p>

              <h3>Types of Cookies We Use</h3>

              <div className="space-y-4 not-prose">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Essential Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Required for the Service to function properly. These include authentication 
                          cookies and security cookies. You cannot opt-out of these cookies.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Functional Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Remember your preferences and settings (language, theme, etc.) to provide 
                          enhanced, personalized features.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Help us understand how visitors interact with our Service by collecting and 
                          reporting information anonymously. We use Google Analytics for this purpose.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Marketing Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Used to track visitors across websites to display relevant advertisements. 
                          These cookies are used by third-party advertisers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3>Managing Your Cookie Preferences</h3>
              <p>
                You can manage your cookie preferences through:
              </p>
              <ul>
                <li>Our cookie consent banner (appears on first visit)</li>
                <li>Your account settings (for logged-in users)</li>
                <li>Your browser settings (to block or delete cookies)</li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-lg mt-6">
                <h4 className="font-semibold mb-3">Update Your Preferences</h4>
                <Button>
                  Manage Cookie Settings
                </Button>
              </div>

              <h3>Third-Party Cookies</h3>
              <p>
                Some cookies are placed by third-party services that appear on our pages:
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> Website usage analytics</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Vercel:</strong> Hosting and performance monitoring</li>
                <li><strong>Social Media:</strong> Sharing and embedding content</li>
              </ul>

              <p>
                These third parties have their own privacy policies and cookie policies. 
                We encourage you to review them.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Accessibility Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Scale className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl">Accessibility Statement</CardTitle>
              </div>
              <p className="text-sm text-gray-600">
                Our commitment to digital accessibility
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Our Commitment</h3>
              <p>
                CR AudioViz AI is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards.
              </p>

              <h3>Conformance Status</h3>
              <p>
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. 
                These guidelines explain how to make web content more accessible for people with disabilities.
              </p>

              <h3>Accessibility Features</h3>
              <ul>
                <li>Keyboard navigation support throughout the platform</li>
                <li>Screen reader compatibility (tested with NVDA, JAWS, VoiceOver)</li>
                <li>Sufficient color contrast ratios for text and interactive elements</li>
                <li>Alternative text for images and visual content</li>
                <li>Consistent and predictable navigation</li>
                <li>Resizable text without loss of functionality</li>
                <li>Form labels and error identification</li>
                <li>Skip navigation links for screen readers</li>
              </ul>

              <h3>Known Limitations</h3>
              <p>
                Despite our best efforts, some limitations may exist:
              </p>
              <ul>
                <li>Some user-generated content may not meet accessibility standards</li>
                <li>Third-party integrations may have accessibility limitations</li>
                <li>AI-generated content may occasionally lack proper context</li>
              </ul>

              <h3>Feedback</h3>
              <p>
                We welcome your feedback on the accessibility of our Service. Please let us know if 
                you encounter accessibility barriers:
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mt-6">
                <p className="mb-2">
                  <strong>Email:</strong> accessibility@craudiovizai.com<br />
                  <strong>Phone:</strong> (859) 446-9770
                </p>
                <p className="text-sm">
                  We aim to respond to accessibility feedback within 3 business days.
                </p>
              </div>

              <h3>Technical Specifications</h3>
              <p>
                Accessibility of CR AudioViz AI relies on the following technologies:
              </p>
              <ul>
                <li>HTML5</li>
                <li>WAI-ARIA</li>
                <li>CSS</li>
                <li>JavaScript</li>
              </ul>

              <p>
                These technologies are relied upon for conformance with the accessibility standards used.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compliance & Certifications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We maintain the highest standards of legal and regulatory compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-gray-600">European data protection</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">CCPA Compliant</h3>
                <p className="text-sm text-gray-600">California privacy rights</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Scale className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">WCAG 2.2 AA</h3>
                <p className="text-sm text-gray-600">Accessibility standards</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
                <p className="text-sm text-gray-600">Security compliance (pending)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Legal Questions?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our legal team is here to help. Contact us with any questions about our policies, 
            compliance, or legal requirements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Contact Legal Team
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Download className="mr-2 w-5 h-5" />
              Download All Policies
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-6">
            Email: legal@craudiovizai.com | Phone: (859) 446-9770
          </p>
        </div>
      </section>
    </div>
  );
}
