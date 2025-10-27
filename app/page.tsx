import { Button } from '@/components/ui/button';
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
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-10 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Left Side - Content */}
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Launch AI-Powered Websites, Agents, Avatars, Tools, and Apps—All from One Modular Ecosystem.
              </h1>
              
              <p className="text-sm text-gray-700 mb-3">
                CR AudioViz AI LLC is a modular SaaS company that builds intelligent tools, custom apps, and branded websites using <span className="font-semibold text-blue-600">Javari AI</span>—our adaptive engine for scalable, high-performance development. Our mission is to help businesses and individuals succeed by delivering systems that connect, automate, and evolve.
              </p>
              
              <p className="text-xs text-gray-600 mb-6">
                Your Story. Our Design.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-5 text-base font-semibold">
                    Start Building
                  </Button>
                </a>
                <Link href="/about">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-5 text-base font-semibold"
                  >
                    Learn more about us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Javari Avatar (Dark Hair) */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-48 h-48">
                <Image
                  src="/avatars/JavariAvatar.png"
                  alt="Javari AI - Your AI Assistant"
                  width={192}
                  height={192}
                  className="rounded-full shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRAIverse Section */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Left Side - CRAI Avatar (Blonde Hair) */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-48 h-48">
                <Image
                  src="/avatars/CRAIAvatar.png"
                  alt="CRAI - Your CRAIverse Guide"
                  width={192}
                  height={192}
                  className="rounded-full shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Coming Soon
              </div>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Welcome to the CRAIVerse
              </h2>
              
              <p className="text-sm text-gray-700 mb-5">
                At the heart of our ecosystem is CRAIVerse—a unified avatar world designed to replace the fragmented internet with a truly connected experience. CRAIVerse bridges people, brands, and organizations through intelligent interfaces, modular logic, and seamless integration.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Support First Responders & Military Families</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Build Faith Communities & Memorial Spaces</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Help Small & Large Businesses Expand Their Reach & Connect with More Customers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Empower Artists, Musicians & Singers to Reach New Audiences Worldwide</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Launch Print-on-Demand Products in Minutes</span>
                </li>
              </ul>

              <Link href="/craiverse">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-5 text-base font-semibold">
                  Explore CRAIverse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <FeaturedApps />

      {/* Coming Soon Projects Section */}
      {comingSoonProjects && comingSoonProjects.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-red-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Coming Soon
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                New Projects on the Horizon
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
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

      {/* Bottom Banner - Javari AI Focus */}
      <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Coming Soon
            </div>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
              Delivering intelligent tools, custom-built apps, and branded digital experiences via JavariAI.
            </h2>
            
            <p className="text-base text-gray-300">
              Explore our strategic portfolio of groundbreaking AI initiatives and enterprise solutions
            </p>
          </div>
        </div>
      </section>

      {/* Social Media Links Section - Below Bottom Banner */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Connect With Us</h3>
            <p className="text-sm text-gray-600 mb-6">Follow us across all platforms</p>
            
            <div className="flex flex-wrap justify-center gap-2">
              {/* Facebook */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Facebook className="w-3 h-3" />
                Facebook
              </a>
              
              {/* Instagram */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Instagram className="w-3 h-3" />
                Instagram
              </a>
              
              {/* LinkedIn */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#0A66C2] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Linkedin className="w-3 h-3" />
                LinkedIn
              </a>
              
              {/* YouTube */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#FF0000] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Youtube className="w-3 h-3" />
                YouTube
              </a>
              
              {/* Twitter/X */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Twitter className="w-3 h-3" />
                X
              </a>
              
              {/* TikTok */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
                TikTok
              </a>
              
              {/* GitHub */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#181717] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Github className="w-3 h-3" />
                GitHub
              </a>
              
              {/* Discord */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#5865F2] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <MessageSquare className="w-3 h-3" />
                Discord
              </a>
              
              {/* Twitch */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#9146FF] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Twitch className="w-3 h-3" />
                Twitch
              </a>
              
              {/* Reddit */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#FF4500] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </a>
              
              {/* Pinterest */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#E60023] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
                Pinterest
              </a>
              
              {/* Snapchat */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#FFFC00] text-black rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
                </svg>
                Snapchat
              </a>
              
              {/* Telegram */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#26A5E4] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
              
              {/* WhatsApp */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              
              {/* Medium */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <BookOpen className="w-3 h-3" />
                Medium
              </a>
              
              {/* Slack */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#4A154B] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                </svg>
                Slack
              </a>
              
              {/* Quora */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#B92B27] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.738 18.701c-.831-1.635-1.805-3.287-3.708-3.287-.362 0-.727.061-1.059.209l-.095-1.023c.523-.13 1.023-.2 1.483-.2 2.142 0 3.681 1.356 4.613 3.157.405-.804.625-1.715.625-2.674 0-3.358-2.725-6.083-6.083-6.083S2.431 11.525 2.431 14.883c0 3.357 2.725 6.082 6.083 6.082 1.461 0 2.802-.515 3.858-1.375l.366 1.111zm-.081-7.091c-.403 0-.73-.326-.73-.73s.326-.73.73-.73.73.326.73.73-.327.73-.73.73zm1.815-2.662h-1.094c-.403-.948-.925-1.865-1.565-2.662h2.276c1.154 0 2.09.936 2.09 2.09v.572h-1.707zm4.727 0v-.572c0-1.822-1.478-3.299-3.299-3.299H8.956c-.403 0-.73-.326-.73-.73s.326-.73.73-.73h6.944c2.628 0 4.76 2.132 4.76 4.76v.572H19.2z"/>
                </svg>
                Quora
              </a>
              
              {/* Threads */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142l-.126 1.974a11.853 11.853 0 0 0-2.496-.118c-1.022.056-1.845.347-2.447.868-.577.499-.867 1.17-.839 1.942.024.681.32 1.283.858 1.743.548.467 1.302.7 2.205.656 1.168-.056 2.029-.444 2.566-1.154.47-.622.755-1.483.873-2.635l-.015-.083c-.013-.091-.025-.183-.034-.274a5.493 5.493 0 0 0-.17-1.012c-.443-1.598-1.516-2.616-3.195-3.027-.816-.2-1.682-.3-2.576-.298-.9.002-1.766.102-2.578.298-1.68.405-2.752 1.412-3.196 2.997-.22.785-.329 1.63-.329 2.513 0 .883.109 1.728.329 2.513.444 1.586 1.517 2.593 3.197 2.998.812.196 1.678.296 2.577.296.9 0 1.766-.1 2.578-.296 1.68-.406 2.753-1.414 3.197-3.001.219-.785.328-1.63.328-2.513 0-.882-.109-1.727-.328-2.512l1.974-.481c.256 1.055.385 2.173.385 3.333 0 1.159-.129 2.278-.385 3.333-.507 2.09-1.694 3.564-3.532 4.383-1.104.492-2.368.743-3.754.743z"/>
                </svg>
                Threads
              </a>
              
              {/* Product Hunt */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#DA552F] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.881 4.2 4.199 0 2.319-1.882 4.201-4.201 4.201z"/>
                </svg>
                Product Hunt
              </a>
              
              {/* AngelList */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.465 9.954c.735-2.236 1.506-4.515 2.243-6.771.14-.417.327-.777.486-1.148.092-.221.454-.302.666-.237.211.066.454.177.608.353.226.251.356.619.444.963.843 3.276 1.684 6.553 2.521 9.832.011.04.011.084.011.126-1.674-.649-3.348-1.298-5.022-1.947-.03-.009-.051-.04-.095-.073.097-.318.189-.627.138-.946zm-2.606 3.408c-1.045 2.097-2.086 4.194-3.119 6.295-.109.221-.363.472-.592.494-.292.029-.659-.107-.863-.316-.29-.297-.434-.696-.563-1.083-1.078-3.233-2.153-6.467-3.227-9.7-.021-.062-.032-.126-.053-.207 1.677.602 3.349 1.203 5.021 1.805.074.027.134.132.183.213.601 1.006 1.199 2.014 1.794 3.023.058.099.103.207.157.312.019.041.061.073.092.109l.17-.745zM9.465 3.183c.735 2.236 1.506 4.515 2.243 6.771.14.417.327.777.486 1.148.092.221.454.302.666.237.211-.066.454-.177.608-.353.226-.251.356-.619.444-.963.843-3.276 1.684-6.553 2.521-9.832.011-.04.011-.084.011-.126-1.674.649-3.348 1.298-5.022 1.947-.03.009-.051.04-.095.073-.097-.318-.189-.627-.138-.946z"/>
                </svg>
                AngelList
              </a>
              
              {/* Behance */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#1769FF] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 6.174V17.52h7.287c.394 0 .863-.04 1.414-.12a5.894 5.894 0 0 0 1.473-.447c.473-.209.898-.508 1.276-.898.378-.39.673-.898.886-1.523.213-.626.32-1.361.32-2.206 0-.945-.197-1.693-.59-2.243a3.736 3.736 0 0 0-1.504-1.287 3.11 3.11 0 0 0 1.08-1.134c.26-.492.39-1.063.39-1.713 0-.709-.133-1.307-.4-1.792-.267-.486-.626-.882-1.08-1.19a4.486 4.486 0 0 0-1.504-.65A8.047 8.047 0 0 0 6.445 2H0zm15.41 3.225v1.358h5.233V9.399H15.41zM3.67 8.488h2.787c.433 0 .827.047 1.181.142.354.094.65.228.886.401.236.173.413.39.532.65.118.26.177.555.177.886 0 .63-.177 1.11-.532 1.437-.354.326-.85.488-1.485.488H3.67V8.488zm0 7.287h3.21c.315 0 .63-.04.944-.118a2.24 2.24 0 0 0 .827-.39c.236-.181.425-.425.567-.732.142-.307.213-.677.213-1.11 0-.709-.197-1.24-.59-1.594-.394-.354-.945-.531-1.653-.531H3.67v4.475zm15.41-3.67c.03.551.146.992.346 1.323.2.33.448.583.744.756.295.173.614.284.956.331.342.048.673.071.991.071.394 0 .827-.04 1.299-.118a5.73 5.73 0 0 0 1.346-.39v2.088a6.453 6.453 0 0 1-1.594.39c-.58.095-1.212.142-1.898.142-.827 0-1.573-.095-2.24-.283a4.675 4.675 0 0 1-1.713-.886c-.48-.402-.85-.922-1.11-1.56-.26-.637-.39-1.394-.39-2.27 0-.827.118-1.575.354-2.242a5.098 5.098 0 0 1 1.004-1.736c.433-.48.957-.85 1.571-1.11.614-.26 1.307-.39 2.077-.39.744 0 1.417.13 2.018.39.6.26 1.11.63 1.528 1.11.417.48.732 1.063.945 1.748.212.686.318 1.457.318 2.313v.827H19.08zm0-1.831h5.08c0-.276-.03-.567-.09-.874a2.197 2.197 0 0 0-.307-.827 1.823 1.823 0 0 0-.65-.638c-.276-.165-.63-.248-1.063-.248-.394 0-.744.071-1.051.213a2.126 2.126 0 0 0-.744.567 2.445 2.445 0 0 0-.449.803 3.726 3.726 0 0 0-.177 1.004z"/>
                </svg>
                Behance
              </a>
              
              {/* Glassdoor */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#0CAA41] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.097 24v-10.062h5.641c.382 0 .691-.309.691-.691V8.372c0-.382-.309-.691-.691-.691h-5.641V0H8.359c-.382 0-.691.309-.691.691v10.062H2.027c-.382 0-.691.309-.691.691v4.875c0 .382.309.691.691.691h5.641V24h5.429z"/>
                </svg>
                Glassdoor
              </a>
              
              {/* Indeed */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#003A9B] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.566 21.563v-8.762c0-.813-.607-1.407-1.407-1.407s-1.407.606-1.407 1.407v8.762c0 .813.607 1.407 1.407 1.407.8-.012 1.407-.606 1.407-1.407zM10.16 9.009c1.105 0 2.077-.97 2.077-2.077 0-1.106-.972-2.077-2.078-2.077-1.105 0-2.076.97-2.076 2.077 0 1.118.97 2.077 2.076 2.077zm12.173 1.39c-.728-3.098-3.377-5.383-6.595-5.47V.83c0-.472-.35-.83-.834-.83a.816.816 0 0 0-.593.252L8.058 6.15c-.203.214-.325.472-.325.752 0 .606.484 1.092 1.092 1.092h6.533c1.935 0 3.495 1.56 3.495 3.495v9.947c0 .606.484 1.092 1.092 1.092.606 0 1.092-.484 1.092-1.092v-9.947c.012-.363-.012-.728-.094-1.08z"/>
                </svg>
                Indeed
              </a>
              
              {/* Tumblr */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#35465C] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z"/>
                </svg>
                Tumblr
              </a>
              
              {/* Clubhouse */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#F2C94C] text-black rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.67 22.28h-.08a8.35 8.35 0 01-5-1.84A15 15 0 013 11.72a14.84 14.84 0 011.93-7.36 8.37 8.37 0 017.69-3.69 8.37 8.37 0 016.93 12.11 15.11 15.11 0 01-5.89 8.66 8.38 8.38 0 01-.99.84z"/>
                </svg>
                Clubhouse
              </a>
              
              {/* Substack */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#FF6719] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Mail className="w-3 h-3" />
                Substack
              </a>
              
              {/* Newsletter */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <Mail className="w-3 h-3" />
                Newsletter
              </a>
              
              {/* Google Business */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-[#4285F4] text-white rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </a>
              
              {/* Lemonde */}
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-400 text-gray-900 rounded-full text-xs font-semibold hover:opacity-80 transition">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6C6.698 21.6 2.4 17.302 2.4 12S6.698 2.4 12 2.4 21.6 6.698 21.6 12 17.302 21.6 12 21.6z"/>
                </svg>
                Lemonde
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


