'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="CR AudioViz AI - Your Story. Our Design." 
              width={180}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            
            {/* Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                Products
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/features" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    All Features
                  </Link>
                  <Link href="/tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    60+ Creative Tools
                  </Link>
                  <Link href="/javari" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Javari AI Assistant
                  </Link>
                  <Link href="/marketplace" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Marketplace
                  </Link>
                  <Link href="/games" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    1200+ Games
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                Resources
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Blog
                  </Link>
                  <Link href="/tutorials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Tutorials
                  </Link>
                  <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Help Center
                  </Link>
                  <Link href="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    FAQ
                  </Link>
                  <Link href="/api-docs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    API Docs
                  </Link>
                </div>
              </div>
            </div>

            {/* Company Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                Company
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    About Us
                  </Link>
                  <Link href="/careers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Careers
                  </Link>
                  <Link href="/press" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Press Kit
                  </Link>
                  <Link href="/partners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Partners
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gary-100">
                    Contact
                  </Link>
                </div>
              </div>
            </div>

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
              <Link href="/features" className="block text-gray-700 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="block text-gray-700 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/marketplace" className="block text-gray-700 hover:text-gray-900">
                Marketplace
              </Link>
              <Link href="/blog" className="block text-gray-700 hover:text-gray-900">
                Blog
              </Link>
              <Link href="/help" className="block text-gray-700 hover:text-gray-900">
                Help Center
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-gray-900">
                Contact
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
