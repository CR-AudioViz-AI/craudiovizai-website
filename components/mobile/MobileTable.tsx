'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Mobile-Responsive Table
 * 
 * Displays as cards on mobile, table on desktop
 * Automatically adapts based on screen size
 */

export interface MobileTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  mobileLabel?: string; // Override label for mobile card view
  hideOnMobile?: boolean; // Hide this column on mobile
}

export interface MobileTableProps<T> {
  data: T[];
  columns: MobileTableColumn<T>[];
  keyField: keyof T;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function MobileTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: MobileTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Mobile View (Cards) */}
      <div className="block md:hidden space-y-4">
        {data.map((row) => (
          <div
            key={String(row[keyField])}
            onClick={() => onRowClick?.(row)}
            className={cn(
              'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4',
              onRowClick && 'cursor-pointer active:scale-98 transition-transform'
            )}
          >
            {columns
              .filter((col) => !col.hideOnMobile)
              .map((col) => {
                const value = typeof col.key === 'string' ? row[col.key] : row[col.key as keyof T];
                const label = col.mobileLabel || col.header;
                
                return (
                  <div key={String(col.key)} className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="text-sm text-right ml-4">
                      {col.render ? col.render(value, row) : String(value)}
                    </span>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-gray-100 dark:border-gray-800',
                  onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                {columns.map((col) => {
                  const value = typeof col.key === 'string' ? row[col.key] : row[col.key as keyof T];
                  
                  return (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 text-sm"
                    >
                      {col.render ? col.render(value, row) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Status Badge Component (useful for table cells)
 */
export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {children}
    </span>
  );
}

/**
 * Example usage:
 * 
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   status: 'active' | 'inactive';
 *   created: string;
 * }
 * 
 * const columns: MobileTableColumn<User>[] = [
 *   { 
 *     key: 'name', 
 *     header: 'Name' 
 *   },
 *   { 
 *     key: 'email', 
 *     header: 'Email',
 *     hideOnMobile: true // Hide on mobile cards
 *   },
 *   { 
 *     key: 'status', 
 *     header: 'Status',
 *     render: (value) => (
 *       <StatusBadge status={value === 'active' ? 'success' : 'neutral'}>
 *         {value}
 *       </StatusBadge>
 *     )
 *   },
 *   { 
 *     key: 'created', 
 *     header: 'Created',
 *     mobileLabel: 'Date', // Different label for mobile
 *     render: (value) => new Date(value).toLocaleDateString()
 *   }
 * ];
 * 
 * <MobileTable
 *   data={users}
 *   columns={columns}
 *   keyField="id"
 *   onRowClick={(user) => console.log('Clicked:', user)}
 *   emptyMessage="No users found"
 * />
 */
