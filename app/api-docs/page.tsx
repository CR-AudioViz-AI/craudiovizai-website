import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Book, Zap, Key, Shield, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Code className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              API Documentation
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Build powerful integrations with the CR AudioViz AI platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get API Key
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Start</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-6 h-6 mr-3 text-blue-600" />
                  1. Get Your API Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  First, you'll need to generate an API key from your account dashboard.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>
                    curl https://api.craudiovizai.com/v1/auth<br/>
                    -H "Authorization: Bearer YOUR_API_KEY"
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-purple-600" />
                  2. Make Your First Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Here's a simple example to generate a logo using our API:
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                  <code>
                    {`curl -X POST https://api.craudiovizai.com/v1/tools/logo-generator \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Modern tech company logo",
    "style": "minimalist",
    "colors": ["#0066FF", "#000000"]
  }'`}
                  </code>
                </div>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-green-600" />
                  3. Handle the Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  All API responses follow this structure:
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>
                    {`{
  "success": true,
  "data": {
    "id": "logo_abc123",
    "url": "https://cdn.craudiovizai.com/logos/abc123.png",
    "credits_used": 5
  },
  "message": "Logo generated successfully"
}`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">API Endpoints</h2>
            
            <div className="space-y-6">
              {/* Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Tools API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">POST /v1/tools/logo-generator</code>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Logo</span>
                    </div>
                    <p className="text-sm text-gray-600">Generate logos with AI</p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">POST /v1/tools/website-builder</code>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">Website</span>
                    </div>
                    <p className="text-sm text-gray-600">Build complete websites</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">POST /v1/tools/video-editor</code>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">Video</span>
                    </div>
                    <p className="text-sm text-gray-600">Edit and process videos</p>
                  </div>

                  <Button variant="link" className="px-0">
                    View all 60+ tool endpoints →
                  </Button>
                </CardContent>
              </Card>

              {/* Javari */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Javari AI API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">POST /v1/javari/chat</code>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded">Chat</span>
                    </div>
                    <p className="text-sm text-gray-600">Send messages to Javari AI</p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">POST /v1/javari/build</code>
                      <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded">Build</span>
                    </div>
                    <p className="text-sm text-gray-600">Build apps/websites with Javari</p>
                  </div>

                  <Button variant="link" className="px-0">
                    View Javari documentation →
                  </Button>
                </CardContent>
              </Card>

              {/* Account */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-teal-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">GET /v1/account/credits</code>
                      <span className="text-xs px-2 py-1 bg-teal-100 text-teal-600 rounded">Credits</span>
                    </div>
                    <p className="text-sm text-gray-600">Check credit balance</p>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm font-mono">GET /v1/account/usage</code>
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded">Usage</span>
                    </div>
                    <p className="text-sm text-gray-600">View usage statistics</p>
                  </div>

                  <Button variant="link" className="px-0">
                    View account endpoints →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs & Libraries */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              SDKs & Client Libraries
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">JavaScript</h3>
                  <p className="text-sm text-gray-600 mb-4">Node.js & Browser</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Python</h3>
                  <p className="text-sm text-gray-600 mb-4">pip install craudioviz</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Ruby</h3>
                  <p className="text-sm text-gray-600 mb-4">gem install craudioviz</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Go</h3>
                  <p className="text-sm text-gray-600 mb-4">go get craudioviz</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Rate Limits & Pricing</h2>
            
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Plan</th>
                        <th className="text-left py-3 px-4">Rate Limit</th>
                        <th className="text-left py-3 px-4">Monthly Requests</th>
                        <th className="text-left py-3 px-4">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Free</td>
                        <td className="py-3 px-4">10 req/min</td>
                        <td className="py-3 px-4">1,000</td>
                        <td className="py-3 px-4">$0</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Pro</td>
                        <td className="py-3 px-4">60 req/min</td>
                        <td className="py-3 px-4">100,000</td>
                        <td className="py-3 px-4">$49/mo</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold">Professional</td>
                        <td className="py-3 px-4">300 req/min</td>
                        <td className="py-3 px-4">1,000,000</td>
                        <td className="py-3 px-4">Custom</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold">Enterprise</td>
                        <td className="py-3 px-4">Unlimited</td>
                        <td className="py-3 px-4">Unlimited</td>
                        <td className="py-3 px-4">Contact Sales</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start integrating the CR AudioViz AI platform into your applications today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Key className="w-5 h-5 mr-2" />
              Get API Key
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
