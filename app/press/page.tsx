import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image as ImageIcon, Video, Mail, ExternalLink } from 'lucide-react';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Press Kit
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Media resources, company information, and brand assets for journalists and creators
            </p>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Company Overview</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Company Name</h3>
                    <p className="text-gray-600">CR AudioViz AI</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Founded</h3>
                    <p className="text-gray-600">2024</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Headquarters</h3>
                    <p className="text-gray-600">Fort Myers, Florida, USA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Industry</h3>
                    <p className="text-gray-600">AI Technology, Creative Tools, SaaS</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">
                      CR AudioViz AI is a comprehensive AI-powered platform that empowers creators to build apps, 
                      games, websites, and more with 60+ creative tools, 1,200+ games, and Javari AI assistant. 
                      We're democratizing creativity through accessible, powerful technology.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Brand Assets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Logos & Icons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Official CR AudioViz AI logos in various formats and color schemes
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Logo Pack (ZIP)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Product Screenshots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    High-resolution screenshots of our platform and features
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Screenshots (ZIP)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-green-600" />
                    Videos & Demos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Product demos, tutorials, and promotional videos
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Video Library
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-orange-600" />
                    Brand Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Official brand guidelines, colors, fonts, and usage rules
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Guidelines (PDF)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Press Releases</h2>
            
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        CR AudioViz AI Launches Revolutionary AI Assistant Javari
                      </h3>
                      <p className="text-sm text-gray-500">October 21, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Fort Myers, FL - CR AudioViz AI today announced the launch of Javari, an advanced AI 
                    assistant that helps creators build apps, websites, and games through natural conversation...
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Platform Reaches 100,000 Active Creators Milestone
                      </h3>
                      <p className="text-sm text-gray-500">September 15, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    CR AudioViz AI celebrates surpassing 100,000 active creators using the platform to build 
                    innovative apps, games, and digital experiences...
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        CR AudioViz AI Introduces CRAIverse Marketplace
                      </h3>
                      <p className="text-sm text-gray-500">August 1, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    New marketplace enables creators to monetize their work with 70/30 revenue split, 
                    democratizing access to creative tools and content...
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Leadership Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold text-gray-900">Founder & CEO</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Visionary leader with 15+ years in AI and creative technology. 
                        Former lead engineer at major tech companies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold text-gray-900">Chief Technology Officer</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Expert in machine learning and scalable systems. PhD in Computer Science 
                        from Stanford University.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Media Inquiries
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            For press inquiries, interviews, or additional information, please contact our media team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:press@craudiovizai.com">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Mail className="w-5 h-5 mr-2" />
                press@craudiovizai.com
              </Button>
            </a>
            <a href="mailto:media@craudiovizai.com">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Mail className="w-5 h-5 mr-2" />
                media@craudiovizai.com
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
