'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LogOut, User, Menu, X } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

interface HeaderProps {
  variant?: 'light' | 'dark'
}

export default function GlobalHeader({ variant = 'light' }: HeaderProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUser(user)
      // Check if user is admin (you'll need to add this to your user_profiles table)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      setIsAdmin(profile?.role === 'admin')
    }
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function generateBreadcrumbs() {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Home', href: '/' }]
    
    let currentPath = ''
    paths.forEach((path) => {
      currentPath += `/${path}`
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label, href: currentPath })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  const isDark = variant === 'dark'

  return (
    <header className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border-b border-gray-200 shadow-sm`}>
      {/* ROW 1: Logo, Nav Links, Auth */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CR</span>
            </div>
            <span className="hidden sm:block font-bold text-xl">
              CR AudioViz AI
            </span>
          </Link>

          {/* Navigation Links - Center (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/apps" 
              className={`font-medium transition-colors ${
                pathname?.startsWith('/apps') 
                  ? 'text-blue-600' 
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Apps
            </Link>
            <Link 
              href="/docs" 
              className={`font-medium transition-colors ${
                pathname?.startsWith('/docs')
                  ? 'text-blue-600'
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Docs
            </Link>
            <Link 
              href="/support" 
              className={`font-medium transition-colors ${
                pathname?.startsWith('/support')
                  ? 'text-blue-600'
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Support
            </Link>
          </nav>

          {/* Auth - Right */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: Breadcrumbs, Admin + Email */}
        {user && (
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            
            {/* Breadcrumbs - Left */}
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-gray-400">›</span>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-600 font-medium">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Admin + Email - Right */}
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                </Link>
              )}
              <span className="text-sm text-gray-600 font-medium">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/apps"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apps
            </Link>
            <Link
              href="/docs"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/support"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
