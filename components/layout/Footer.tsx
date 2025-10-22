'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavigationLink {
  id: string
  label: string
  href: string
  category: string
  is_visible: boolean
  display_order: number
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([]);
  const [resourceLinks, setResourceLinks] = useState<NavigationLink[]>([]);
  const [companyLinks, setCompanyLinks] = useState<NavigationLink[]>([]);
  const [legalLinks, setLegalLinks] = useState<NavigationLink[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchLinks = async () => {
      // Fetch all footer links
      const { data } = await supabase
        .from('navigation_links')
        .select('*')
        .in('category', ['footer-navigation', 'footer-resources', 'footer-company', 'footer-legal'])
        .eq('is_visible', true)
        .order('display_order');

      if (data) {
        setNavigationLinks(data.filter(link => link.category === 'footer-navigation'));
        setResourceLinks(data.filter(link => link.category === 'footer-resources'));
        setCompanyLinks(data.filter(link => link.category === 'footer-company'));
        setLegalLinks(data.filter(link => link.category === 'footer-legal'));
      }
    };

    fetchLinks();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">CR AudioViz AI</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your Story. Our Design. Empowering creators with AI-powered tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation - Same as Header */}
          {navigationLinks.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                {navigationLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {resourceLinks.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                {resourceLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company */}
          {companyLinks.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          {legalLinks.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {currentYear} CR AudioViz AI. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="mailto:support@craudiovizai.com" className="flex items-center hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                support@craudiovizai.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
