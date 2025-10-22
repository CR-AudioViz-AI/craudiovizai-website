'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavigationLink {
  id: string
  label: string
  href: string
  is_visible: boolean
  display_order: number
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Fetch navigation links from database
    const fetchNavLinks = async () => {
      const { data } = await supabase
        .from('navigation_links')
        .select('id, label, href, is_visible, display_order')
        .eq('category', 'header')
        .eq('is_visible', true)
        .order('display_order');
      
      if (data) {
        setNavLinks(data);
      }
    };

    fetchNavLinks();

    // Check current user and admin status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      // Force a hard reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

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
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`transition-colors relative ${
                  isActive(link.href)
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  // Logged In State
                  <>
                    {isAdmin && (
                      <Link href="/admin">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  // Logged Out State
                  <>
                    <Link href="/login">
                      <Button variant="ghost">Log In</Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
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
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`block transition-colors ${
                    isActive(link.href)
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {!loading && (
                  <>
                    {user ? (
                      // Logged In Mobile State
                      <>
                        <div className="px-4 py-2 text-sm text-gray-600">
                          {user.email}
                        </div>
                        {isAdmin && (
                          <Link href="/admin" className="block">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                              <Shield className="w-4 h-4" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                        <Button 
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full"
                        >
                          Log Out
                        </Button>
                      </>
                    ) : (
                      // Logged Out Mobile State
                      <>
                        <Link href="/login" className="block">
                          <Button variant="outline" className="w-full">Log In</Button>
                        </Link>
                        <Link href="/signup" className="block">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                            Get Started Free
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
}
