'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Bookmark, User, LogOut, CreditCard, TrendingUp } from 'lucide-react';

// TODO: Replace with actual user session/auth
interface User {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'professional' | 'admin';
  credits: number;
  planExpiration: string;
  isAdmin: boolean;
}

// Mock user - replace with actual auth
const mockUser: User | null = null; // Set to null for logged out, or user object for logged in

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // TODO: Replace with actual auth state
  const user = mockUser;
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              {/* TODO: Replace with actual logo */}
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CR</span>
              </div>
            </div>
            <span className="hidden md:inline-block font-bold text-xl text-gray-900">
              CR AudioViz AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>

            {/* Solutions Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/apps"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <div className="text-sm font-medium leading-none">Apps & Tools</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                              60+ creative apps for designing, building, and creating
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/games"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-600"
                          >
                            <div className="text-sm font-medium leading-none">Games</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                              1,200+ games ready to play or build your own
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>

            <Link href="/craiverse" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              CRAIverse
            </Link>

            <Link href="/javari" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Javari
            </Link>

            {/* Placeholder for newsletters/ebooks page */}
            <Link href="/resources" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
              Resources
            </Link>

            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Bookmark Button */}
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Bookmark className="h-5 w-5" />
            </Button>

            {/* Not Logged In */}
            {!isLoggedIn && (
              <>
                <Link href="/login" className="hidden sm:inline-block">
                  <Button variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Logged In */}
            {isLoggedIn && user && (
              <>
                {/* Credit Bar (Desktop) */}
                <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-blue-900">
                      {user.plan === 'admin' ? 'Admin' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      {user.isAdmin ? 'Unlimited' : `${user.credits.toLocaleString()} credits`}
                    </div>
                    {!user.isAdmin && (
                      <div className="text-xs text-gray-600">
                        Renews {user.planExpiration}
                      </div>
                    )}
                  </div>
                  {!user.isAdmin && (
                    <div className="flex flex-col space-y-1">
                      <Link href="/credits/top-up">
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          Top Up
                        </Button>
                      </Link>
                      <Link href="/pricing">
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          Upgrade
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline-block">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Mobile Credit Info */}
                    <div className="lg:hidden px-2 py-2 bg-blue-50 rounded m-2">
                      <div className="text-xs font-semibold text-blue-900">
                        {user.plan === 'admin' ? 'Admin' : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        {user.isAdmin ? 'Unlimited' : `${user.credits.toLocaleString()} credits`}
                      </div>
                      {!user.isAdmin && (
                        <div className="text-xs text-gray-600">
                          Renews {user.planExpiration}
                        </div>
                      )}
                    </div>
                    
                    {!user.isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/credits/top-up" className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Top Up Credits
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/pricing" className="cursor-pointer">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Upgrade Plan
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer text-purple-600 font-semibold">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Solutions</p>
                <Link
                  href="/apps"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 pl-4 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apps & Tools
                </Link>
                <Link
                  href="/games"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 pl-4 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Games
                </Link>
              </div>

              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              <Link
                href="/craiverse"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                CRAIverse
              </Link>

              <Link
                href="/javari"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Javari
              </Link>

              <Link
                href="/resources"
                className="text-sm font-medium text-gray-400 hover:text-gray-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources (Coming Soon)
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {!isLoggedIn && (
                <div className="pt-4 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
