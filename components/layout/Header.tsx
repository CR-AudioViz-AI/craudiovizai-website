'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MobileButton } from '@/components/mobile';
import { Menu, X, User, Shield, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Hardcoded navigation links - ALWAYS show these (database is optional enhancement)
const DEFAULT_NAV_LINKS = [
  { id: 'home', label: 'Home', href: '/', is_visible: true, display_order: 0 },
  { id: 'apps', label: 'Apps', href: '/apps', is_visible: true, display_order: 1 },
  { id: 'games', label: 'Games', href: '/games', is_visible: true, display_order: 2 },
  { id: 'javari', label: 'Javari AI', href: '/javari', is_visible: true, display_order: 3 },
  { id: 'craiverse', label: 'CRAIverse', href: '/craiverse', is_visible: true, display_order: 4 },
  { id: 'pricing', label: 'Pricing', href: '/pricing', is_visible: true, display_order: 5 },
  { id: 'about', label: 'About', href: '/about', is_visible: true, display_order: 6 },
  { id: 'contact', label: 'Contact', href: '/contact', is_visible: true, display_order: 7 },
];

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
  // ALWAYS use hardcoded links - database is disabled to prevent empty navigation
  const navLinks = DEFAULT_NAV_LINKS;
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
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
              className="h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.filter(link => link.is_visible).map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`text-sm transition-colors relative ${
                  isActive(link.href)
                    ? 'text-blue-600 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    {isAdmin && (
                      <Link href="/admin">
                        <Button variant="ghost" size="sm" className="text-gray-700">
                          <Shield className="w-4 h-4 mr-1" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="text-gray-700">
                        <User className="w-4 h-4 mr-1" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="text-gray-700">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
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
          <MobileButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </MobileButton>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              {navLinks.filter(link => link.is_visible).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            <Shield className="w-5 h-5 mr-2" />
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-5 h-5 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-center text-gray-700 hover:bg-gray-50"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold"
                        >
                          Get Started Free
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
