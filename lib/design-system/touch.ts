/**
 * Touch & Gesture System
 * CR AudioViz AI Design System
 * 
 * Mobile-specific interaction patterns
 * Follows Apple/Google guidelines for touch targets
 */

/**
 * Minimum touch target sizes (Apple/Google guidelines)
 */
export const TOUCH_TARGETS = {
  // Minimum recommended sizes
  minimum: '44px',      // iOS minimum
  recommended: '48px',  // Material Design minimum
  comfortable: '56px',  // Comfortable for most users
  large: '64px',        // Large buttons, primary actions
} as const;

/**
 * Touch target utilities (Tailwind classes)
 */
export const touchTarget = {
  // Standard button/link
  default: 'min-h-[48px] min-w-[48px] inline-flex items-center justify-center',
  
  // Small touch target (use sparingly)
  sm: 'min-h-[44px] min-w-[44px] inline-flex items-center justify-center',
  
  // Large touch target (primary actions)
  lg: 'min-h-[56px] min-w-[56px] inline-flex items-center justify-center',
  
  // Extra large (hero CTAs)
  xl: 'min-h-[64px] min-w-[64px] inline-flex items-center justify-center',
  
  // Full width button (mobile)
  full: 'min-h-[52px] w-full inline-flex items-center justify-center',
} as const;

/**
 * Touch spacing (between interactive elements)
 */
export const TOUCH_SPACING = {
  minimum: '8px',   // Absolute minimum
  comfortable: '12px', // Recommended
  spacious: '16px',    // Plenty of room
} as const;

/**
 * Touch spacing utilities
 */
export const touchSpacing = {
  // Stack buttons vertically with proper spacing
  stack: 'space-y-3', // 12px between buttons
  
  // Horizontal button group
  group: 'space-x-3', // 12px between buttons
  
  // Grid of touch targets
  grid: 'grid gap-3',
} as const;

/**
 * Active/pressed states for touch feedback
 */
export const touchFeedback = {
  // Scale down on press
  scale: 'active:scale-95 transition-transform',
  
  // Darken on press
  darken: 'active:brightness-90 transition-all',
  
  // Both effects
  full: 'active:scale-95 active:brightness-90 transition-all duration-100',
  
  // Ripple effect (requires JS)
  ripple: 'relative overflow-hidden',
} as const;

/**
 * Gesture utilities
 */
export const gestures = {
  // Swipeable element
  swipeable: 'touch-pan-x',
  
  // Pinch-zoomable
  zoomable: 'touch-pinch-zoom',
  
  // Scrollable
  scrollable: 'overflow-auto -webkit-overflow-scrolling-touch',
  
  // Draggable
  draggable: 'cursor-move touch-none',
} as const;

/**
 * Mobile interaction patterns
 */
export const mobileInteractions = {
  // Tap highlight (iOS/Android)
  noHighlight: '-webkit-tap-highlight-color-transparent',
  
  // Prevent text selection
  noSelect: 'select-none',
  
  // Prevent zoom on double-tap
  noZoom: 'touch-manipulation',
  
  // Smooth scrolling
  smoothScroll: 'scroll-smooth',
  
  // Momentum scrolling (iOS)
  momentum: 'overflow-auto -webkit-overflow-scrolling-touch',
} as const;

/**
 * Pull-to-refresh pattern
 */
export const pullToRefresh = {
  container: 'relative overflow-hidden',
  indicator: 'absolute top-0 left-0 right-0 transform transition-transform',
  pulling: 'translate-y-16',
  releasing: 'translate-y-0',
} as const;

/**
 * Bottom sheet patterns
 */
export const bottomSheet = {
  container: 'fixed inset-x-0 bottom-0 z-50',
  backdrop: 'fixed inset-0 bg-black/50 z-40',
  sheet: 'bg-white rounded-t-2xl p-6 transform transition-transform',
  closed: 'translate-y-full',
  open: 'translate-y-0',
  handle: 'w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4',
} as const;

/**
 * Swipe actions (like iOS Mail)
 */
export const swipeActions = {
  container: 'relative overflow-hidden',
  content: 'relative z-10 bg-white transition-transform',
  actions: 'absolute inset-y-0 right-0 flex',
  action: 'flex items-center justify-center w-20 text-white',
  delete: 'bg-red-500',
  archive: 'bg-blue-500',
  edit: 'bg-gray-500',
} as const;

/**
 * React hook for touch gestures
 */
export interface TouchGestureHandlers {
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTouchCancel?: (e: React.TouchEvent) => void;
}

/**
 * Swipe direction detection helper
 */
export function detectSwipeDirection(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  threshold: number = 50
): 'left' | 'right' | 'up' | 'down' | null {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > threshold) {
      return deltaX > 0 ? 'right' : 'left';
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > threshold) {
      return deltaY > 0 ? 'down' : 'up';
    }
  }
  
  return null;
}

/**
 * Touch/click handler (works on both mobile and desktop)
 */
export function createTouchHandler(
  callback: () => void,
  options?: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
  }
): TouchGestureHandlers & { onClick?: () => void } {
  return {
    onTouchEnd: (e) => {
      if (options?.preventDefault) e.preventDefault();
      if (options?.stopPropagation) e.stopPropagation();
      callback();
    },
    onClick: callback,
  };
}

/**
 * Haptic feedback (Vibration API)
 */
export const haptics = {
  // Light tap
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  // Medium tap
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  
  // Heavy tap
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },
  
  // Success pattern
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  
  // Error pattern
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 100, 20, 100, 20]);
    }
  },
} as const;

/**
 * Safe area insets (for notch devices)
 */
export const safeAreaInsets = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
} as const;

/**
 * iOS-specific fixes
 */
export const iosFixes = {
  // Prevent iOS Safari scrolling issues
  fixedPosition: 'fixed inset-0',
  
  // Prevent iOS zoom on input focus (use 16px font)
  preventZoom: 'text-base',
  
  // Prevent iOS bounce scroll
  noBounce: 'overscroll-none',
  
  // Safe area padding
  safeTop: 'pt-[env(safe-area-inset-top)]',
  safeBottom: 'pb-[env(safe-area-inset-bottom)]',
} as const;
