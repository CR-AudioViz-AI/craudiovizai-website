// lib/expenses/validation.ts
// Zod validation schemas for expense tracker

import { z } from 'zod'

// Vendor schemas
export const VendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required').max(200),
  website: z.string().url().optional().or(z.literal('')),
  tax_id: z.string().optional(),
  notes: z.string().optional()
})

export const CreateVendorSchema = VendorSchema

export const UpdateVendorSchema = VendorSchema.partial()

// Category schemas
export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  type: z.enum(['subscription', 'one_time', 'payroll', 'tax', 'other']).default('subscription'),
  deductible: z.boolean().default(true),
  tax_category: z.string().optional()
})

export const CreateCategorySchema = CategorySchema

export const UpdateCategorySchema = CategorySchema.partial()

// Subscription schemas
export const SubscriptionSchema = z.object({
  vendor_id: z.string().uuid().optional(),
  name: z.string().min(1, 'Subscription name is required').max(200),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  billing_interval: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  active: z.boolean().default(true),
  renewal_term: z.string().default('annual'),
  auto_renew: z.boolean().default(true),
  grace_days: z.number().int().min(0).default(0)
})

export const CreateSubscriptionSchema = SubscriptionSchema

export const UpdateSubscriptionSchema = SubscriptionSchema.partial()

// Expense schemas
export const ExpenseSchema = z.object({
  vendor_id: z.string().uuid().optional(),
  subscription_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  txn_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  due_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  payment_method: z.string().optional(),
  receipt_url: z.string().url().optional().or(z.literal(''))
})

export const CreateExpenseSchema = ExpenseSchema

export const UpdateExpenseSchema = ExpenseSchema.partial()

// Alert schemas
export const AcknowledgeAlertSchema = z.object({
  alert_id: z.number().int().positive()
})

export const SnoozeAlertSchema = z.object({
  alert_id: z.number().int().positive(),
  snooze_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
})

// Report schemas
export const ReportQuerySchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  group_by: z.enum(['month', 'date', 'subscription', 'vendor', 'category', 'tag', 'type']).optional(),
  vendor_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  subscription_id: z.string().uuid().optional()
})

// CSV Import schema
export const ImportExpenseSchema = z.object({
  txn_date: z.string(),
  amount: z.number(),
  vendor_name: z.string().optional(),
  description: z.string().optional(),
  category_name: z.string().optional(),
  payment_method: z.string().optional()
})

// Type exports
export type Vendor = z.infer<typeof VendorSchema>
export type CreateVendor = z.infer<typeof CreateVendorSchema>
export type UpdateVendor = z.infer<typeof UpdateVendorSchema>

export type Category = z.infer<typeof CategorySchema>
export type CreateCategory = z.infer<typeof CreateCategorySchema>
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>

export type Subscription = z.infer<typeof SubscriptionSchema>
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>
export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>

export type Expense = z.infer<typeof ExpenseSchema>
export type CreateExpense = z.infer<typeof CreateExpenseSchema>
export type UpdateExpense = z.infer<typeof UpdateExpenseSchema>

export type ReportQuery = z.infer<typeof ReportQuerySchema>
export type ImportExpense = z.infer<typeof ImportExpenseSchema>
