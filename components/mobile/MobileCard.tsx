'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/**
 * Mobile Card Component
 * 
 * Touch-friendly card with proper spacing
 * Responsive padding (smaller on mobile, larger on desktop)
 */

export interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export function MobileCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}: MobileCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
    outlined: 'border-2 border-gray-300 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-900 shadow-lg',
  };

  const paddingStyles = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      className={cn(
        'rounded-lg',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Mobile Modal Component (Bottom Sheet Style)
 * 
 * Slides up from bottom on mobile
 * Full-screen on small devices
 * Centered dialog on desktop
 */

export interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnBackdrop?: boolean;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: MobileModalProps) {
  // Lock body scroll when modal is open
  React.useEffect(() => {
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

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'md:max-w-md',
    md: 'md:max-w-lg',
    lg: 'md:max-w-2xl',
    full: 'md:max-w-4xl',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div
          className={cn(
            // Mobile: Full width bottom sheet
            'w-full max-h-[90vh]',
            'bg-white dark:bg-gray-900',
            'rounded-t-2xl md:rounded-2xl',
            'shadow-2xl',
            'flex flex-col',
            'animate-in slide-in-from-bottom md:zoom-in-95',
            
            // Desktop: Centered dialog
            'md:w-full',
            sizeStyles[size]
          )}
        >
          {/* Drag Handle (mobile only) */}
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className={cn(
                  'min-h-[44px] min-w-[44px]',
                  'inline-flex items-center justify-center',
                  'rounded-lg',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'active:scale-95 transition-all'
                )}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-800">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Mobile Card Header
 */
export interface MobileCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function MobileCardHeader({
  title,
  subtitle,
  action,
  className,
  ...props
}: MobileCardHeaderProps) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4 mb-4', className)}
      {...props}
    >
      <div className="flex-1">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Mobile Card Footer
 */
export interface MobileCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileCardFooter({
  children,
  className,
  ...props
}: MobileCardFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Example usage:
 * 
 * // Card
 * <MobileCard variant="elevated" padding="lg">
 *   <MobileCardHeader 
 *     title="Welcome" 
 *     subtitle="Get started with your dashboard"
 *     action={<SettingsButton />}
 *   />
 *   <p>Card content goes here...</p>
 *   <MobileCardFooter>
 *     <MobileButton variant="outline">Cancel</MobileButton>
 *     <MobileButton variant="primary">Continue</MobileButton>
 *   </MobileCardFooter>
 * </MobileCard>
 * 
 * // Modal
 * <MobileModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   footer={
 *     <div className="flex gap-3 w-full">
 *       <MobileButton onClick={handleCancel} variant="outline" fullWidth>
 *         Cancel
 *       </MobileButton>
 *       <MobileButton onClick={handleConfirm} variant="primary" fullWidth>
 *         Confirm
 *       </MobileButton>
 *     </div>
 *   }
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </MobileModal>
 */
