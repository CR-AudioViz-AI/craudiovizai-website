import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles, Gamepad2, Wand2, Code2 } from 'lucide-react';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-navy-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your Creative Path
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Build apps, design games, or create anything you can imagine with our AI-powered tools
            </p>
          </div>
        </div>
      </section>

      {/* Main Solutions Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Apps Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wand2 className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Apps & Tools</CardTitle>
                <CardDescription className="text-lg mt-2">
                  60+ powerful apps for creating, designing, and building
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Website & Landing Page Builders</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Design Tools (Logos, Flyers, Social Graphics)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Video & Audio Editors</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Marketing & Business Tools</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">AI-Powered Content Creation</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Print-on-Demand Design Tools</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Build Your Own Apps</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Create custom apps and host them or take the code
                      </p>
                    </div>
                    <Code2 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <Link href="/apps" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                    Explore Apps & Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Games Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-500">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Games</CardTitle>
                <CardDescription className="text-lg mt-2">
                  1,200+ games ready to play, or build your own
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Action & Adventure Games (200+)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Puzzle & Strategy Games (250+)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Casual & Arcade Games (300+)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Sports & Racing Games (150+)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">RPG & Simulation Games (200+)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Educational Games (100+)</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-900">Build Your Own Games</p>
                      <p className="text-xs text-green-700 mt-1">
                        Create games and earn 70% commission or take the code
                      </p>
                    </div>
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <Link href="/games" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
                    Explore Games Library
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Create & Earn
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Build</h3>
                <p className="text-gray-600">
                  Use our tools or game/app builder to create something amazing
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose</h3>
                <p className="text-gray-600">
                  Host on our platform for shared profit or download the code
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn</h3>
                <p className="text-gray-600">
                  Get 70% commission on every use of your creation on our platform
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 inline-block">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  💡 Keep Your Code
                </p>
                <p className="text-sm text-yellow-800">
                  If you take your code, we'll create our own improved version to offer as part of our package
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators building amazing apps and games
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                View Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
