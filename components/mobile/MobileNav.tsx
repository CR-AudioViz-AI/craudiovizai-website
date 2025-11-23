'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { X, Menu } from 'lucide-react';

/**
 * Mobile Navigation Component
 * Hamburger menu that slides in from left
 * Full-screen overlay on mobile
 * 
 * Usage:
 * <MobileNav links={navLinks} />
 */

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavLink[]; // Submenu items
}

interface MobileNavProps {
  links: NavLink[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MobileNav({ links, logo, footer, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      {/* Hamburger Button (always visible on mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed top-4 left-4 z-50',
          'md:hidden', // Hide on desktop
          'min-h-[48px] min-w-[48px]',
          'inline-flex items-center justify-center',
          'bg-white dark:bg-gray-900 rounded-lg shadow-lg',
          'border border-gray-200 dark:border-gray-800',
          'active:scale-95 transition-transform',
          className
        )}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50',
          'w-full max-w-sm', // Full width up to 384px
          'bg-white dark:bg-gray-900',
          'shadow-2xl',
          'transform transition-transform duration-300 ease-in-out',
          'md:hidden', // Hide on desktop
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {logo || <div className="text-xl font-bold">Menu</div>}
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              'min-h-[48px] min-w-[48px]',
              'inline-flex items-center justify-center',
              'rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'active:scale-95 transition-all'
            )}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                {link.children ? (
                  // Expandable menu item
                  <div>
                    <button
                      onClick={() => toggleExpanded(link.label)}
                      className={cn(
                        'w-full min-h-[48px] px-4 py-3',
                        'flex items-center justify-between',
                        'text-left text-base font-medium',
                        'rounded-lg',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'active:scale-95 transition-all'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {link.icon}
                        {link.label}
                        {link.badge && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                            {link.badge}
                          </span>
                        )}
                      </span>
                      <svg
                        className={cn(
                          'w-5 h-5 transition-transform',
                          expandedItems.has(link.label) && 'rotate-180'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Submenu */}
                    {expandedItems.has(link.label) && link.children && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'block min-h-[44px] px-4 py-3',
                                'text-sm text-gray-600 dark:text-gray-400',
                                'rounded-lg',
                                'hover:bg-gray-100 dark:hover:bg-gray-800',
                                'active:scale-95 transition-all'
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Regular link
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block min-h-[48px] px-4 py-3',
                      'flex items-center gap-3',
                      'text-base font-medium',
                      'rounded-lg',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'active:scale-95 transition-all'
                    )}
                  >
                    {link.icon}
                    {link.label}
                    {link.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Example usage:
 * 
 * const navLinks: NavLink[] = [
 *   { href: '/', label: 'Home', icon: <HomeIcon /> },
 *   { 
 *     href: '/tools', 
 *     label: 'Tools',
 *     children: [
 *       { href: '/tools/pdf', label: 'PDF Builder' },
 *       { href: '/tools/graphics', label: 'Graphics' }
 *     ]
 *   },
 *   { href: '/pricing', label: 'Pricing', badge: 'New' }
 * ];
 * 
 * <MobileNav links={navLinks} logo={<Logo />} />
 */
