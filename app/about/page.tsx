import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Target, Eye, Heart, Users, Lightbulb, Rocket, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About CR AudioViz AI
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Empowering creators, businesses, and communities through AI-powered tools and social impact initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                CR AudioViz AI was founded with a simple yet powerful vision: to democratize technology 
                and make professional-grade creative tools accessible to everyone, regardless of technical 
                expertise or resources.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Based in Fort Myers, Florida, we've built a platform that combines cutting-edge AI 
                technology with a deep commitment to social impact. From helping first responders and 
                military families through our CRAIverse initiative to empowering small businesses with 
                enterprise-level tools, we're driven by the belief that technology should serve humanity.
              </p>
              <p className="text-lg leading-relaxed">
                Today, thousands of creators, businesses, and organizations use CR AudioViz AI to build 
                websites, create games, design graphics, and connect communities. But we're just getting 
                started—our vision extends far beyond what we've built so far.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Mission */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    To empower individuals, businesses, and communities by providing accessible, 
                    AI-powered creative tools and building meaningful connections through technology. 
                    We believe everyone deserves access to professional-grade tools, regardless of 
                    their technical background or financial resources.
                  </p>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    To become the world's leading platform for AI-powered creation and social impact, 
                    where anyone can bring their ideas to life and where technology bridges gaps between 
                    people, causes, and opportunities. We envision a future where creativity and social 
                    good go hand in hand.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Our Core Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <Card className="hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Social Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Technology should serve humanity. We're committed to making a positive difference in communities
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Professional tools shouldn't require professional expertise. We make technology accessible to all
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    We're committed to delivering the highest quality products and support to our users
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              What Makes Us Different
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <Card className="border-2">
                <CardHeader>
                  <Rocket className="w-12 h-12 text-blue-600 mb-3" />
                  <CardTitle>AI-First Approach</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    We don't just add AI as a feature—our entire platform is built around intelligent 
                    automation. Javari, our master AI builder, can create anything you imagine without 
                    requiring you to write a single line of code.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Globe className="w-12 h-12 text-green-600 mb-3" />
                  <CardTitle>Social Impact Focus</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    CRAIverse isn't just a product—it's our commitment to using technology for good. 
                    From supporting first responders to helping small businesses thrive, social impact 
                    is woven into everything we do.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Heart className="w-12 h-12 text-purple-600 mb-3" />
                  <CardTitle>Community-First</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    We believe in fair revenue sharing (70/30 split for creators), supporting user-generated 
                    content, and building a platform where everyone can succeed together. Your success is our success.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              By The Numbers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">60+</div>
                <div className="text-gray-600">Creative Tools</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">1,200+</div>
                <div className="text-gray-600">Games</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-gray-600">Social Impact Modules</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">70%</div>
                <div className="text-gray-600">Creator Revenue Share</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us on Our Mission
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're a creator, business owner, or part of a community organization, 
            we'd love to have you on this journey with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
              Get Started Free
            </Button>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
