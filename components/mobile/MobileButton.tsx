'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Mobile-Optimized Button Component
 * 
 * Features:
 * - Minimum 48x48px touch target
 * - Touch feedback (scale + brightness)
 * - Loading state
 * - Full-width option for mobile
 * - Proper disabled state
 * 
 * Usage:
 * <MobileButton>Click me</MobileButton>
 * <MobileButton variant="primary" size="lg" fullWidth>Sign Up</MobileButton>
 */

export interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    const sizeStyles = {
      sm: 'min-h-[44px] px-4 py-2 text-sm',
      md: 'min-h-[48px] px-6 py-3 text-base',
      lg: 'min-h-[56px] px-8 py-4 text-lg',
      xl: 'min-h-[64px] px-10 py-5 text-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium',
          'transition-all duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          
          // Touch feedback
          'active:scale-95 active:brightness-90',
          
          // No tap highlight
          '-webkit-tap-highlight-color-transparent',
          
          // Variant
          variantStyles[variant],
          
          // Size
          sizeStyles[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Disabled
          (disabled || loading) && 'opacity-50 cursor-not-allowed active:scale-100',
          
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

MobileButton.displayName = 'MobileButton';

/**
 * Button Group Component (stacks on mobile)
 */
interface MobileButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function MobileButtonGroup({
  children,
  className,
  orientation = 'horizontal',
}: MobileButtonGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        orientation === 'horizontal'
          ? 'flex-col sm:flex-row'
          : 'flex-col',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Example usage:
 * 
 * // Primary CTA
 * <MobileButton variant="primary" size="lg" fullWidth>
 *   Get Started
 * </MobileButton>
 * 
 * // With loading state
 * <MobileButton loading={isSubmitting}>
 *   Submit
 * </MobileButton>
 * 
 * // With icon
 * <MobileButton icon={<CheckIcon />} iconPosition="left">
 *   Confirm
 * </MobileButton>
 * 
 * // Button group (stacks on mobile)
 * <MobileButtonGroup>
 *   <MobileButton variant="outline">Cancel</MobileButton>
 *   <MobileButton variant="primary">Confirm</MobileButton>
 * </MobileButtonGroup>
 */
