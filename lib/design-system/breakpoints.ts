/**
 * Mobile-First Responsive Breakpoints
 * CR AudioViz AI Design System
 * 
 * Usage:
 * - Default styles = Mobile (320px+)
 * - Use breakpoints for larger screens
 * - Mobile-first approach: style mobile, then add desktop overrides
 */

export const BREAKPOINTS = {
  // Mobile (default - no prefix needed)
  mobile: 320,
  
  // Small phones (iPhone SE)
  xs: 375,
  
  // Large phones / Small tablets
  sm: 640,
  
  // Tablets (iPad)
  md: 768,
  
  // Laptops
  lg: 1024,
  
  // Desktops
  xl: 1280,
  
  // Large desktops
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Media query helpers
 */
export const mediaQueries = {
  mobile: `(max-width: ${BREAKPOINTS.xs - 1}px)`,
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  
  // Utility queries
  isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  isTablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  isDesktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  
  // Touch device detection
  isTouch: '(hover: none) and (pointer: coarse)',
  isNonTouch: '(hover: hover) and (pointer: fine)',
} as const;

/**
 * React hook for responsive breakpoints
 */
export function useBreakpoint() {
  if (typeof window === 'undefined') return 'lg'; // SSR default
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.xs) return 'mobile';
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

/**
 * Check if current viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Tailwind responsive utilities
 * Use these in className strings
 */
export const responsive = {
  // Hide on mobile, show on desktop
  hideOnMobile: 'hidden md:block',
  
  // Show on mobile, hide on desktop
  showOnMobile: 'block md:hidden',
  
  // Stack on mobile, row on desktop
  stackOnMobile: 'flex flex-col md:flex-row',
  
  // Full width on mobile, auto on desktop
  fullOnMobile: 'w-full md:w-auto',
  
  // Single column on mobile, grid on desktop
  gridOnDesktop: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Padding responsive
  paddingResponsive: 'p-4 md:p-8 lg:p-12',
  
  // Text size responsive
  textResponsive: 'text-base md:text-lg lg:text-xl',
  
  // Gap responsive
  gapResponsive: 'gap-4 md:gap-6 lg:gap-8',
} as const;

/**
 * Container max widths for content
 */
export const containerWidths = {
  mobile: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;
