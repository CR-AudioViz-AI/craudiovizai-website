import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  
  // Fetch projects marked to show on homepage
  const { data: comingSoonProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('show_on_homepage', true)
    .eq('is_public', true)
    .order('display_order');

  return (
    <div className="min-h-screen">
      {/* Hero Section - Javari Introduction */}
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left Side - Content */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Launch AI-Powered Websites, Agents, Avatars, Tools, and Apps—All from One Modular Ecosystem.
              </h1>
              
              <p className="text-lg text-gray-700 mb-4">
                CR AudioViz AI LLC is a modular SaaS company that builds intelligent tools, custom apps, and branded websites using <span className="font-semibold text-blue-600">Javari AI</span>—our adaptive engine for scalable, high-performance development. Our mission is to help businesses and individuals succeed by delivering systems that connect, automate, and evolve.
              </p>
              
              <p className="text-base text-gray-600 mb-8">
                Your Story. Our Design.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/javari">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold">
                    Start Building
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-semibold"
                  >
                    Learn more about us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Javari Avatar (Dark Hair) */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-64 h-64">
                <Image
                  src="/avatars/JavariAvatar.png"
                  alt="Javari AI - Your AI Assistant"
                  width={256}
                  height={256}
                  className="rounded-full shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRAIverse Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left Side - CRAI Avatar (Blonde Hair) */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-64 h-64">
                <Image
                  src="/avatars/CRAIAvatar.png"
                  alt="CRAI - Your CRAIverse Guide"
                  width={256}
                  height={256}
                  className="rounded-full shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Coming Soon
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Welcome to the CRAIVerse
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                At the heart of our ecosystem is CRAIVerse—a unified avatar world designed to replace the fragmented internet with a truly connected experience. CRAIVerse bridges people, brands, and organizations through intelligent interfaces, modular logic, and seamless integration.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Support First Responders & Military Families</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Build Faith Communities & Memorial Spaces</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Help Small & Large Businesses Expand Their Reach & Connect with More Customers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Empower Artists, Musicians & Singers to Reach New Audiences Worldwide</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Launch Print-on-Demand Products in Minutes</span>
                </li>
              </ul>

              <Link href="/craiverse">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold">
                  Explore CRAIverse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Projects Section */}
      {comingSoonProjects && comingSoonProjects.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-red-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Coming Soon
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                New Projects on the Horizon
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Exciting new tools and features coming soon to help you build faster
              </p>
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {comingSoonProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow bg-white">
                  <CardHeader>
                    <div className="text-4xl mb-2">{project.icon}</div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {project.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{project.description}</p>
                    <div className="mt-4">
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Media Links Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect With Us</h3>
            <p className="text-gray-600 mb-8">Follow us across all platforms</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">AngelList</a>
              <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Behance</a>
              <a href="#" className="px-4 py-2 bg-yellow-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Clubhouse</a>
              <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Discord</a>
              <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Facebook</a>
              <a href="#" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">GitHub</a>
              <a href="#" className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Glassdoor</a>
              <a href="#" className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Google Business</a>
              <a href="#" className="px-4 py-2 bg-blue-700 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Indeed</a>
              <a href="#" className="px-4 py-2 bg-pink-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Instagram</a>
              <a href="#" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold hover:opacity-80 transition">Lemonde</a>
              <a href="#" className="px-4 py-2 bg-blue-700 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">LinkedIn</a>
              <a href="#" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Medium</a>
              <a href="#" className="px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Newsletter</a>
              <a href="#" className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Pinterest</a>
              <a href="#" className="px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Product Hunt</a>
              <a href="#" className="px-4 py-2 bg-red-700 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Quora</a>
              <a href="#" className="px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Reddit</a>
              <a href="#" className="px-4 py-2 bg-purple-700 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Slack</a>
              <a href="#" className="px-4 py-2 bg-yellow-300 text-gray-900 rounded-full text-sm font-semibold hover:opacity-80 transition">Snapchat</a>
              <a href="#" className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Substack</a>
              <a href="#" className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Telegram</a>
              <a href="#" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Threads</a>
              <a href="#" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">TikTok</a>
              <a href="#" className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Tumblr</a>
              <a href="#" className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">Twitch</a>
              <a href="#" className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">WhatsApp</a>
              <a href="#" className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:opacity-80 transition">YouTube</a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner - Javari AI Focus */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-6">
              Coming Soon
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Delivering intelligent tools, custom-built apps, and branded digital experiences via JavariAI.
            </h2>
            
            <p className="text-lg text-gray-300 mb-8">
              Explore our strategic portfolio of groundbreaking AI initiatives and enterprise solutions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
