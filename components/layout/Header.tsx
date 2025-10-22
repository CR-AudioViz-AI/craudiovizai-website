'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="CR AudioViz AI - Your Story. Our Design." 
              width={480}
              height={160}
              priority
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>

            <Link href="/apps" className="text-gray-700 hover:text-gray-900 transition-colors">
              Apps
            </Link>

            <Link href="/games" className="text-gray-700 hover:text-gray-900 transition-colors">
              Games
            </Link>

            <Link href="/javari" className="text-gray-700 hover:text-gray-900 transition-colors">
              Javari AI
            </Link>

            <Link href="/craiverse" className="text-gray-700 hover:text-gray-900 transition-colors">
              CRAIVerse
            </Link>

            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>

          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link href="/" className="block text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link href="/apps" className="block text-gray-700 hover:text-gray-900">
                Apps
              </Link>
              <Link href="/games" className="block text-gray-700 hover:text-gray-900">
                Games
              </Link>
              <Link href="/javari" className="block text-gray-700 hover:text-gray-900">
                Javari AI
              </Link>
              <Link href="/craiverse" className="block text-gray-700 hover:text-gray-900">
                CRAIVerse
              </Link>
              <Link href="/pricing" className="block text-gray-700 hover:text-gray-900">
                Pricing
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
}
