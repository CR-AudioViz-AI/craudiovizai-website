import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Server, FileCheck, AlertTriangle, CheckCircle, Key } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Security & Compliance
            </h1>
            <p className="text-xl text-green-100">
              Your data security is our top priority. Learn how we protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-lg text-gray-600">
              We implement multiple layers of security to protect your data and ensure platform integrity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  End-to-end encryption for data in transit and at rest
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Secure authentication with optional 2FA
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Server className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Cloud hosting with redundancy and backups
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  24/7 security monitoring and threat detection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              How We Protect Your Data
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Lock className="w-6 h-6 mr-3 text-green-600" />
                    Encryption Standards
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">TLS 1.3 Encryption</p>
                      <p className="text-sm">All data transmitted between your device and our servers is encrypted using the latest TLS 1.3 protocol</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">AES-256 Encryption</p>
                      <p className="text-sm">Data at rest is encrypted using industry-standard AES-256 encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Encrypted Backups</p>
                      <p className="text-sm">All backup data is encrypted and stored in geographically distributed locations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Key className="w-6 h-6 mr-3 text-blue-600" />
                    Access Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Role-Based Access</p>
                      <p className="text-sm">Granular permission controls ensure users only access what they need</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</p>
                      <p className="text-sm">Optional 2FA adds an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Session Management</p>
                      <p className="text-sm">Automatic session timeouts and secure token handling</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Server className="w-6 h-6 mr-3 text-purple-600" />
                    Infrastructure Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Cloud Hosting</p>
                      <p className="text-sm">Hosted on Vercel and Supabase with enterprise-grade security and 99.9% uptime</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Regular Backups</p>
                      <p className="text-sm">Automated daily backups with point-in-time recovery capabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">DDoS Protection</p>
                      <p className="text-sm">Advanced protection against distributed denial-of-service attacks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Eye className="w-6 h-6 mr-3 text-orange-600" />
                    Monitoring & Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">24/7 Monitoring</p>
                      <p className="text-sm">Continuous monitoring of systems for suspicious activity and threats</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Incident Response</p>
                      <p className="text-sm">Dedicated security team ready to respond to any incidents immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Security Audits</p>
                      <p className="text-sm">Regular third-party security audits and penetration testing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Security */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Payment Security
            </h2>
            <Card className="border-2 border-green-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Stripe Integration</h3>
                      <p className="text-sm text-gray-600">
                        PCI DSS Level 1 certified payment processing. We never store your card details on our servers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">PayPal Integration</h3>
                      <p className="text-sm text-gray-600">
                        Secure PayPal payments with buyer protection and encrypted transactions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Compliance & Certifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">GDPR Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Full compliance with EU General Data Protection Regulation
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">CCPA Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Adherence to California Consumer Privacy Act requirements
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Working towards SOC 2 Type II certification for enterprise clients
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Your Security Responsibilities
            </h2>
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <AlertTriangle className="w-6 h-6 mr-3 text-yellow-600" />
                  Best Practices for Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Use a strong, unique password (at least 12 characters with mixed case, numbers, and symbols)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Enable two-factor authentication (2FA) for additional security</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Never share your password or account credentials with anyone</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Log out when using shared or public computers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Be cautious of phishing emails and always verify sender addresses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Regularly review your account activity for any suspicious behavior</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Report any security concerns immediately to support@craudiovizai.com</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Report Security Issue */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Report a Security Issue
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            If you discover a security vulnerability, please report it to us immediately. 
            We take all security reports seriously.
          </p>
          <a href="mailto:support@craudiovizai.com?subject=Security%20Issue">
            <button className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Report Security Issue
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
