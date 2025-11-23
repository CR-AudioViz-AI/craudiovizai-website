'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Mobile-Optimized Input Component
 * 
 * Features:
 * - Minimum 16px font size (prevents iOS zoom)
 * - Minimum 44px height (touch-friendly)
 * - Proper input types for mobile keyboards
 * - Error state handling
 * - Full-width on mobile
 * 
 * Usage:
 * <MobileInput type="email" label="Email" />
 * <MobileInput type="tel" label="Phone" />
 */

export interface MobileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      fullWidth = true,
      className,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Set proper inputMode based on type
    let inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode'] = 'text';
    if (type === 'email') inputMode = 'email';
    if (type === 'tel') inputMode = 'tel';
    if (type === 'number') inputMode = 'numeric';
    if (type === 'url') inputMode = 'url';

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            inputMode={inputMode}
            className={cn(
              // Base styles
              'w-full min-h-[44px] px-4 py-3',
              'text-base', // 16px minimum - prevents iOS zoom
              'rounded-lg',
              'border border-gray-300 dark:border-gray-700',
              'bg-white dark:bg-gray-900',
              'text-gray-900 dark:text-gray-100',
              
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              
              // Disabled state
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800',
              
              // Icon padding
              icon && 'pl-10',
              
              // Error state
              error && 'border-red-500 focus:ring-red-500',
              
              // Prevent tap highlight
              '-webkit-tap-highlight-color-transparent',
              
              className
            )}
            {...props}
          />
        </div>

        {/* Hint */}
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';

/**
 * Textarea Component (mobile-optimized)
 */
export interface MobileTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const MobileTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MobileTextareaProps
>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      className,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            // Base styles
            'w-full px-4 py-3',
            'text-base', // 16px minimum - prevents iOS zoom
            'rounded-lg',
            'border border-gray-300 dark:border-gray-700',
            'bg-white dark:bg-gray-900',
            'text-gray-900 dark:text-gray-100',
            'resize-y',
            
            // Focus states
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800',
            
            // Error state
            error && 'border-red-500 focus:ring-red-500',
            
            // Prevent tap highlight
            '-webkit-tap-highlight-color-transparent',
            
            className
          )}
          {...props}
        />

        {/* Hint */}
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MobileTextarea.displayName = 'MobileTextarea';

/**
 * Select Component (mobile-optimized)
 */
export interface MobileSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const MobileSelect = React.forwardRef<HTMLSelectElement, MobileSelectProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      options,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        {/* Select */}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            // Base styles
            'w-full min-h-[44px] px-4 py-3',
            'text-base', // 16px minimum - prevents iOS zoom
            'rounded-lg',
            'border border-gray-300 dark:border-gray-700',
            'bg-white dark:bg-gray-900',
            'text-gray-900 dark:text-gray-100',
            'cursor-pointer',
            
            // Focus states
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800',
            
            // Error state
            error && 'border-red-500 focus:ring-red-500',
            
            // Prevent tap highlight
            '-webkit-tap-highlight-color-transparent',
            
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Hint */}
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MobileSelect.displayName = 'MobileSelect';

/**
 * Example usage:
 * 
 * // Email input (shows email keyboard on mobile)
 * <MobileInput 
 *   type="email" 
 *   label="Email Address" 
 *   placeholder="you@example.com"
 *   error={errors.email}
 * />
 * 
 * // Phone input (shows numeric keyboard)
 * <MobileInput 
 *   type="tel" 
 *   label="Phone Number" 
 *   placeholder="(555) 123-4567"
 * />
 * 
 * // With icon
 * <MobileInput 
 *   type="email" 
 *   label="Email" 
 *   icon={<MailIcon />}
 * />
 * 
 * // Textarea
 * <MobileTextarea 
 *   label="Message" 
 *   rows={6}
 *   placeholder="Tell us more..."
 * />
 * 
 * // Select
 * <MobileSelect
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 * />
 */
