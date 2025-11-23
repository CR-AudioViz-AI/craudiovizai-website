import { Button } from '@/components/ui/button';
import { MobileButton } from '@/components/mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { 
  Facebook, Instagram, Linkedin, Youtube, Twitter, Github, 
  MessageSquare, Mail, BookOpen, Twitch
} from 'lucide-react';

import FeaturedApps from '@/components/home/FeaturedApps';

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
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 px-4 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                Launch AI-Powered Websites, Agents, Avatars, Tools, and Apps—All from One Modular Ecosystem.
              </h1>
              
              <p className="text-base md:text-lg text-gray-700 mb-4">
                CR AudioViz AI LLC is a modular SaaS company that builds intelligent tools, custom apps, and branded websites using{' '}
                <span className="font-semibold text-blue-600">Javari AI</span>
                —our adaptive engine for scalable, high-performance development. Our mission is to help businesses and individuals succeed by delivering systems that connect, automate, and evolve.
              </p>
              
              <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                Your Story. Our Design.
              </p>

              {/* Two CTA Buttons - Stack on mobile, row on desktop */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <a 
                  href="https://javari-ai.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <MobileButton 
                    size="lg" 
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    Start Building
                  </MobileButton>
                </a>
                <Link href="/about" className="w-full sm:w-auto">
                  <MobileButton 
                    size="lg" 
                    variant="outline"
                    fullWidth
                  >
                    Learn more about us
                  </MobileButton>
                </Link>
              </div>
            </div>

            {/* Right Side - Javari Avatar */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <Image
                  src="/avatars/javariavatar.png"
                  alt="Javari AI - Your AI Assistant"
                  width={256}
                  height={256}
                  className="rounded-full shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRAIverse Section */}
      <section className="px-4 py-12 md:px-8 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left Side - CRAI Avatar */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <Image
                  src="/avatars/craiavatar.png"
                  alt="CRAI - Your CRAIverse Guide"
                  width={256}
                  height={256}
                  className="rounded-full shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Coming Soon
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Welcome to the CRAIVerse
              </h2>
              
              <p className="text-base md:text-lg text-gray-700 mb-6">
                At the heart of our ecosystem is CRAIVerse—a unified avatar world designed to replace the fragmented internet with a truly connected experience. CRAIVerse bridges people, brands, and organizations through intelligent interfaces, modular logic, and seamless integration.
              </p>

              <ul className="space-y-3 mb-6 md:mb-8 text-left max-w-xl mx-auto lg:mx-0">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm md:text-base text-gray-700">Support First Responders & Military Families</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm md:text-base text-gray-700">Build Faith Communities & Memorial Spaces</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm md:text-base text-gray-700">Help Small & Large Businesses Expand Their Reach & Connect with More Customers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm md:text-base text-gray-700">Empower Artists, Musicians & Singers to Reach New Audiences Worldwide</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm md:text-base text-gray-700">Launch Print-on-Demand Products in Minutes</span>
                </li>
              </ul>

              <Link href="/craiverse" className="w-full sm:w-auto inline-block">
                <MobileButton 
                  size="lg" 
                  fullWidth
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white sm:w-auto"
                >
                  Explore CRAIverse
                </MobileButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <FeaturedApps />

      {/* Coming Soon Projects Section */}
      {comingSoonProjects && comingSoonProjects.length > 0 && (
        <section className="px-4 py-12 md:px-8 md:py-16 bg-gradient-to-br from-red-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Coming Soon
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                New Projects on the Horizon
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Exciting new tools and features coming soon to help you build faster
              </p>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {comingSoonProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow bg-white"
                >
                  <CardHeader>
                    <div className="text-4xl mb-2">{project.icon}</div>
                    <CardTitle className="text-lg md:text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {project.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-gray-600">{project.description}</p>
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
    </div>
  );
}
