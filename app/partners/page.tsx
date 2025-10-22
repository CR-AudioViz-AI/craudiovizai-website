import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Partner Program
            </h1>
            <p className="text-xl text-cyan-100 mb-8">
              Join forces with CR AudioViz AI and grow together
            </p>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Why Partner With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-center">Revenue Growth</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                  <p>Earn competitive commissions and recurring revenue through our partnership programs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-center">Expand Your Reach</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                  <p>Access our growing community of 100,000+ creators and businesses worldwide</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-center">Cutting-Edge Tech</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                  <p>Integrate with our AI-powered platform and offer innovative solutions to your customers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Partnership Opportunities
            </h2>

            <div className="space-y-8">
              {/* Affiliate Partners */}
              <Card className="border-2 border-teal-200">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Star className="w-6 h-6 mr-3 text-teal-600" />
                    Affiliate Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Earn commissions by promoting CR AudioViz AI to your audience. Perfect for content creators, 
                        influencers, and educators.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Up to 30% recurring commission</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>90-day cookie duration</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Marketing materials provided</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Dedicated affiliate dashboard</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                        Join Affiliate Program
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technology Partners */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-blue-600" />
                    Technology Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Integrate your tools and services with our platform. Build powerful integrations 
                        that benefit both our user bases.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>API access and documentation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Co-marketing opportunities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Technical support from our team</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Featured in our marketplace</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Become a Tech Partner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reseller Partners */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                    Reseller Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-4">
                        White-label our platform or resell to your clients. Perfect for agencies, 
                        consultants, and system integrators.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Volume discounts up to 40%</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>White-label options available</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Dedicated account manager</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Sales and technical training</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                        Become a Reseller
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education Partners */}
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Users className="w-6 h-6 mr-3 text-orange-600" />
                    Education Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Bring CR AudioViz AI to your students. Special pricing for schools, universities, 
                        and training organizations.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Special education pricing</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Curriculum and learning materials</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Teacher training programs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Student progress tracking</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                        Partner with Education
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Our Partners
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                  <div className="text-gray-400 text-center">Partner Logo {i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Partner?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Let's grow together. Contact our partnerships team to get started.
          </p>
          <Link href="/contact?subject=Partnership">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-cyan-50">
              Contact Partnership Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
