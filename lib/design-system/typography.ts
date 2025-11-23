/**
 * Mobile-First Typography System
 * CR AudioViz AI Design System
 * 
 * Key rules:
 * - Base font: 16px minimum (prevents iOS zoom on input focus)
 * - Use rem units (relative to root)
 * - Mobile uses smaller sizes, desktop uses larger
 * - Line height: 1.5-1.6 for readability
 */

/**
 * Font sizes (mobile-first)
 */
export const FONT_SIZES = {
  // Mobile (default)
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px - MINIMUM for mobile to prevent zoom
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  
  // Heading sizes (mobile)
  h1Mobile: '1.75rem',  // 28px
  h2Mobile: '1.5rem',   // 24px
  h3Mobile: '1.25rem',  // 20px
  h4Mobile: '1.125rem', // 18px
  h5Mobile: '1rem',     // 16px
  h6Mobile: '0.875rem', // 14px
  
  // Heading sizes (desktop)
  h1Desktop: '3rem',     // 48px
  h2Desktop: '2.25rem',  // 36px
  h3Desktop: '1.875rem', // 30px
  h4Desktop: '1.5rem',   // 24px
  h5Desktop: '1.25rem',  // 20px
  h6Desktop: '1rem',     // 16px
} as const;

/**
 * Line heights
 */
export const LINE_HEIGHTS = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/**
 * Font weights
 */
export const FONT_WEIGHTS = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

/**
 * Typography presets (mobile-first)
 */
export const typography = {
  // Body text
  body: {
    mobile: 'text-base leading-relaxed',
    desktop: 'md:text-lg',
  },
  
  // Small text
  small: {
    mobile: 'text-sm leading-normal',
    desktop: 'md:text-base',
  },
  
  // Tiny text (captions, labels)
  tiny: {
    mobile: 'text-xs leading-normal',
    desktop: 'md:text-sm',
  },
  
  // Headings
  h1: {
    mobile: 'text-[28px] font-bold leading-tight tracking-tight',
    desktop: 'md:text-5xl md:leading-tight',
  },
  
  h2: {
    mobile: 'text-2xl font-bold leading-tight',
    desktop: 'md:text-4xl',
  },
  
  h3: {
    mobile: 'text-xl font-semibold leading-snug',
    desktop: 'md:text-3xl',
  },
  
  h4: {
    mobile: 'text-lg font-semibold leading-snug',
    desktop: 'md:text-2xl',
  },
  
  h5: {
    mobile: 'text-base font-semibold leading-normal',
    desktop: 'md:text-xl',
  },
  
  h6: {
    mobile: 'text-sm font-semibold leading-normal',
    desktop: 'md:text-lg',
  },
  
  // Display (hero text)
  display: {
    mobile: 'text-3xl font-extrabold leading-tight tracking-tight',
    desktop: 'md:text-6xl lg:text-7xl',
  },
  
  // Lead paragraph
  lead: {
    mobile: 'text-lg leading-relaxed',
    desktop: 'md:text-xl md:leading-relaxed',
  },
  
  // Quote
  quote: {
    mobile: 'text-lg italic leading-relaxed',
    desktop: 'md:text-xl',
  },
  
  // Code
  code: {
    mobile: 'text-sm font-mono',
    desktop: 'md:text-base',
  },
} as const;

/**
 * Helper function to generate full typography classes
 */
export function getTypographyClasses(variant: keyof typeof typography): string {
  const styles = typography[variant];
  return `${styles.mobile} ${styles.desktop}`;
}

/**
 * Responsive heading classes (use in components)
 */
export const headings = {
  h1: 'text-[28px] font-bold leading-tight tracking-tight md:text-5xl md:leading-tight',
  h2: 'text-2xl font-bold leading-tight md:text-4xl',
  h3: 'text-xl font-semibold leading-snug md:text-3xl',
  h4: 'text-lg font-semibold leading-snug md:text-2xl',
  h5: 'text-base font-semibold leading-normal md:text-xl',
  h6: 'text-sm font-semibold leading-normal md:text-lg',
} as const;

/**
 * Text utilities
 */
export const textUtils = {
  // Truncate
  truncate: 'truncate',
  truncate2: 'line-clamp-2',
  truncate3: 'line-clamp-3',
  
  // Alignment
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  
  // Transform
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  
  // Wrapping
  wrap: 'text-wrap',
  nowrap: 'whitespace-nowrap',
  balance: 'text-balance', // Better wrapping for headings
} as const;

/**
 * Link styles
 */
export const links = {
  // Standard link
  default: 'text-primary hover:underline focus:underline',
  
  // Subtle link
  subtle: 'text-muted-foreground hover:text-foreground transition-colors',
  
  // Button-like link
  button: 'text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-md',
  
  // Nav link
  nav: 'text-foreground/70 hover:text-foreground transition-colors',
} as const;

/**
 * Accessible font size (never below 16px on mobile)
 */
export function accessibleFontSize(size: string): string {
  // Always ensure minimum 16px on mobile to prevent iOS zoom
  return `text-base ${size}`;
}

/**
 * Input font size (prevents iOS zoom on focus)
 */
export const INPUT_FONT_SIZE = 'text-base'; // 16px minimum

/**
 * Reading width (optimal line length)
 */
export const READING_WIDTH = {
  narrow: 'max-w-prose',  // ~65 characters
  normal: 'max-w-2xl',    // ~80 characters
  wide: 'max-w-4xl',      // ~100 characters
} as const;
