/**
 * CR AudioViz AI Mobile-First Design System
 * 
 * Import everything from here:
 * import { BREAKPOINTS, typography, touchTarget } from '@/lib/design-system';
 */

// Breakpoints & Responsive
export * from './breakpoints';

// Spacing
export * from './spacing';

// Typography
export * from './typography';

// Touch & Gestures
export * from './touch';

/**
 * Quick imports for common patterns
 */
export { BREAKPOINTS, mediaQueries, responsive, isMobileViewport, isTouchDevice } from './breakpoints';
export { mobileSpacing, padding, margin } from './spacing';
export { typography, headings, links, INPUT_FONT_SIZE } from './typography';
export { touchTarget, touchFeedback, gestures, haptics } from './touch';

/**
 * Design system version
 */
export const DESIGN_SYSTEM_VERSION = '1.0.0';

/**
 * Mobile-first principles
 */
export const PRINCIPLES = {
  // Base font size (prevents iOS zoom)
  BASE_FONT_SIZE: '16px',
  
  // Minimum touch target
  MIN_TOUCH_TARGET: '48px',
  
  // Minimum spacing between touch targets
  MIN_TOUCH_SPACING: '8px',
  
  // Mobile breakpoint
  MOBILE_BREAKPOINT: 768,
  
  // Recommended max content width
  MAX_CONTENT_WIDTH: '1280px',
} as const;

/**
 * Utility: Combine classes safely
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility: Get responsive classes
 */
export function getResponsiveClasses(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  return classes.join(' ');
}
