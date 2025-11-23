'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MobileButton } from '@/components/mobile';
import { Menu, X, User, Shield, LogOut } from 'lucide-react';
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

  // Fetch navigation links
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

  useEffect(() => {
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
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

    // Listen for navigation changes in real-time
    const navChannel = supabase
      .channel('navigation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'navigation_links',
          filter: 'category=eq.header'
        },
        () => {
          fetchNavLinks();
        }
      )
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      navChannel.unsubscribe();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image 
                src="/craudiovizailogo.png" 
                alt="CR AudioViz AI - Your Story. Our Design." 
                width={180}
                height={60}
                priority
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`text-sm transition-colors relative ${
                    isActive(link.href)
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-5 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
                  )}
                </Link>
              ))}
              
              <Link
                href="/team"
                className={`text-sm transition-colors relative ${
                  isActive('/team')
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Meet the Team
                {isActive('/team') && (
                  <span className="absolute -bottom-5 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
                )}
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {!loading && (
                <>
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link href="/admin">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </Button>
                        </Link>
                      )}
                      <Button 
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                      </Link>
                      <Link href="/signup">
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Slide-in Menu */}
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Image 
                  src="/craudiovizailogo.png" 
                  alt="CR AudioViz AI" 
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
                <button
                  onClick={closeMobileMenu}
                  className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`block min-h-[48px] px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(link.href)
                          ? 'bg-purple-50 text-purple-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <Link
                    href="/team"
                    onClick={closeMobileMenu}
                    className={`block min-h-[48px] px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive('/team')
                        ? 'bg-purple-50 text-purple-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Meet the Team
                  </Link>
                </div>
              </nav>

              {/* User Actions Footer */}
              {!loading && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  {user ? (
                    <>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      {isAdmin && (
                        <Link href="/admin" onClick={closeMobileMenu}>
                          <MobileButton 
                            variant="outline" 
                            fullWidth
                            icon={<Shield className="w-5 h-5" />}
                            iconPosition="left"
                          >
                            Admin Dashboard
                          </MobileButton>
                        </Link>
                      )}
                      <MobileButton 
                        onClick={handleLogout}
                        variant="outline"
                        fullWidth
                        icon={<LogOut className="w-5 h-5" />}
                        iconPosition="left"
                      >
                        Log Out
                      </MobileButton>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={closeMobileMenu}>
                        <MobileButton variant="outline" fullWidth>
                          Log In
                        </MobileButton>
                      </Link>
                      <Link href="/signup" onClick={closeMobileMenu}>
                        <MobileButton 
                          variant="primary" 
                          fullWidth
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Get Started Free
                        </MobileButton>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
