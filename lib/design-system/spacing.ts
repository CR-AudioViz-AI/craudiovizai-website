/**
 * Mobile-First Spacing System
 * CR AudioViz AI Design System
 * 
 * Mobile uses smaller spacing, desktop uses larger
 * All values in pixels, converted to Tailwind classes
 */

/**
 * Base spacing scale (Tailwind defaults)
 * Mobile should use smaller values (0-6)
 * Desktop can use larger values (6-12+)
 */
export const SPACING = {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

/**
 * Mobile-specific spacing patterns
 */
export const mobileSpacing = {
  // Container padding
  containerPadding: {
    mobile: 'px-4',      // 16px
    tablet: 'md:px-8',   // 32px
    desktop: 'lg:px-12', // 48px
  },
  
  // Section spacing (vertical)
  sectionSpacing: {
    mobile: 'py-8',      // 32px
    tablet: 'md:py-12',  // 48px
    desktop: 'lg:py-16', // 64px
  },
  
  // Card padding
  cardPadding: {
    mobile: 'p-4',      // 16px
    tablet: 'md:p-6',   // 24px
    desktop: 'lg:p-8',  // 32px
  },
  
  // Stack spacing (between elements)
  stackSpacing: {
    tight: 'space-y-2',   // 8px
    normal: 'space-y-4',  // 16px
    loose: 'space-y-6',   // 24px
  },
  
  // Grid gap
  gridGap: {
    mobile: 'gap-4',     // 16px
    tablet: 'md:gap-6',  // 24px
    desktop: 'lg:gap-8', // 32px
  },
  
  // Button padding
  buttonPadding: {
    sm: 'px-4 py-2',     // 16x8px
    md: 'px-6 py-3',     // 24x12px
    lg: 'px-8 py-4',     // 32x16px
  },
  
  // Input padding
  inputPadding: {
    mobile: 'px-4 py-3',     // 16x12px (44px min height)
    desktop: 'md:px-4 md:py-3', // Same for consistency
  },
} as const;

/**
 * Margin utilities (mobile-first)
 */
export const margin = {
  // Margin top responsive
  topResponsive: 'mt-4 md:mt-8 lg:mt-12',
  
  // Margin bottom responsive
  bottomResponsive: 'mb-4 md:mb-8 lg:mb-12',
  
  // Margin horizontal responsive
  xResponsive: 'mx-4 md:mx-8 lg:mx-auto',
  
  // Margin auto (centering)
  center: 'mx-auto',
} as const;

/**
 * Padding utilities (mobile-first)
 */
export const padding = {
  // Section padding (full responsive)
  section: 'px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16',
  
  // Container padding
  container: 'px-4 md:px-8 lg:px-12',
  
  // Card padding
  card: 'p-4 md:p-6 lg:p-8',
  
  // Small padding
  sm: 'p-2 md:p-3',
  
  // Medium padding
  md: 'p-4 md:p-6',
  
  // Large padding
  lg: 'p-6 md:p-8 lg:p-10',
} as const;

/**
 * Safe area insets (for iOS notch, etc.)
 */
export const safeArea = {
  top: 'pt-safe',
  bottom: 'pb-safe',
  left: 'pl-safe',
  right: 'pr-safe',
  all: 'p-safe',
} as const;

/**
 * Maximum widths for content
 */
export const maxWidth = {
  mobile: 'max-w-full',
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  prose: 'max-w-prose', // ~65 characters
} as const;

/**
 * Helper function to generate responsive spacing classes
 */
export function responsiveSpacing(
  mobile: number,
  tablet?: number,
  desktop?: number
): string {
  const classes = [`p-${mobile}`];
  if (tablet) classes.push(`md:p-${tablet}`);
  if (desktop) classes.push(`lg:p-${desktop}`);
  return classes.join(' ');
}

/**
 * Helper function for responsive gap
 */
export function responsiveGap(
  mobile: number,
  tablet?: number,
  desktop?: number
): string {
  const classes = [`gap-${mobile}`];
  if (tablet) classes.push(`md:gap-${tablet}`);
  if (desktop) classes.push(`lg:gap-${desktop}`);
  return classes.join(' ');
}
