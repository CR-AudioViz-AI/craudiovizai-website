'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    
    // TODO: Implement newsletter subscription
    // For now, just show success message
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info with Subscribe */}
          <div className="lg:col-span-1 flex flex-col items-center text-center">
            <h3 className="text-white font-bold text-base mb-4">CR AudioViz AI, LLC.</h3>
            
            {/* Subscribe Section */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 w-full max-w-xs">
              <h4 className="text-white font-semibold text-sm mb-2">Stay Connected</h4>
              <p className="text-xs text-gray-400 mb-3">
                Get updates on new releases and features
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <Button 
                  type="submit" 
                  disabled={subscribeStatus === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-xs py-2"
                >
                  {subscribeStatus === 'loading' ? 'Subscribing...' : 
                   subscribeStatus === 'success' ? '✓ Subscribed!' : 'Subscribe'}
                </Button>
              </form>
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
