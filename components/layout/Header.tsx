'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, LogOut, User, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

// Hardcoded navigation links - these will ALWAYS work regardless of database state
const DEFAULT_NAV_LINKS = [
  { id: 'home', label: 'Home', href: '/', display_order: 0 },
  { id: 'apps', label: 'Apps', href: '/apps', display_order: 1 },
  { id: 'games', label: 'Games', href: '/games', display_order: 2 },
  { id: 'javari', label: 'Javari AI', href: '/javari', display_order: 3 },
  { id: 'craiverse', label: 'CRAIverse', href: '/craiverse', display_order: 4 },
  { id: 'pricing', label: 'Pricing', href: '/pricing', display_order: 5 },
  { id: 'about', label: 'About', href: '/about', display_order: 6 },
  { id: 'contact', label: 'Contact', href: '/contact', display_order: 7 },
]

interface NavLink {
  id: string
  label: string
  href: string
  display_order: number
}

interface UserData {
  id: string
  email: string
  is_admin?: boolean
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [navLinks, setNavLinks] = useState<NavLink[]>(DEFAULT_NAV_LINKS)
  const [user, setUser] = useState<UserData | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  // Fetch navigation links from database (with fallback to defaults)
  useEffect(() => {
    async function fetchNavLinks() {
      try {
        const { data, error } = await supabase
          .from('navigation_links')
          .select('id, label, href, display_order')
          .eq('category', 'header')
          .eq('is_visible', true)
          .order('display_order')

        if (error) {
          console.warn('Navigation links fetch error, using defaults:', error.message)
          return // Keep using DEFAULT_NAV_LINKS
        }

        if (data && data.length > 0) {
          setNavLinks(data)
        }
        // If data is empty, keep using DEFAULT_NAV_LINKS
      } catch (err) {
        console.warn('Navigation fetch failed, using defaults')
        // Keep using DEFAULT_NAV_LINKS
      }
    }

    fetchNavLinks()
  }, [supabase])

  // Check auth state
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authUser.id)
            .single()

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            is_admin: profile?.is_admin || false
          })
        }
      } catch (err) {
        // User not logged in
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          is_admin: false // Will be checked separately
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setShowDropdown(false)
    window.location.href = '/'
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const getUserInitial = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
  }

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
                className="h-12 md:h-14 w-auto"
                priority
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
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                  )}
                </Link>
              ))}
              {/* Team Link - always visible */}
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
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium">
                      {getUserInitial()}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      {user.is_admin && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 text-center">
        <p className="text-sm font-semibold tracking-wide transition-opacity duration-500">
          CR = Creative Results
        </p>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <Image
                src="/craudiovizailogo.png"
                alt="CR AudioViz AI"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            
            <nav className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base ${
                    isActive(link.href)
                      ? 'bg-purple-100 text-purple-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/team"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base ${
                  isActive('/team')
                    ? 'bg-purple-100 text-purple-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Meet the Team
              </Link>
            </nav>

            <div className="px-4 py-6 border-t space-y-3">
              {user ? (
                <>
                  {user.is_admin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
