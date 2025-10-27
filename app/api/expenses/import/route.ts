// app/api/expenses/import/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getOrgId, errorResponse, successResponse, auditLog } from '@/lib/expenses/supabase-server'

// POST /api/expenses/import - Import expenses from CSV
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const orgId = await getOrgId(request)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'expenses' // expenses or subscriptions

    if (!file) {
      return errorResponse('No file provided', 400)
    }

    if (!['expenses', 'subscriptions'].includes(type)) {
      return errorResponse('Invalid type. Valid types: expenses, subscriptions', 400)
    }

    // Read CSV content
    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return errorResponse('CSV file must contain at least a header row and one data row', 400)
    }

    // Parse CSV (simple parser, assumes comma-separated)
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })

    let imported = 0
    let failed = 0
    const errors: string[] = []

    if (type === 'expenses') {
      // Expected columns: date, amount, description, vendor, category
      const requiredFields = ['date', 'amount']
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const rowNum = i + 2 // +2 because header is line 1, data starts at line 2

        // Validate required fields
        const missingFields = requiredFields.filter(field => !row[field])
        if (missingFields.length > 0) {
          errors.push(`Row ${rowNum}: Missing required fields: ${missingFields.join(', ')}`)
          failed++
          continue
        }

        // Validate date format
        if (isNaN(Date.parse(row.date))) {
          errors.push(`Row ${rowNum}: Invalid date format: ${row.date}`)
          failed++
          continue
        }

        // Validate amount
        const amount = parseFloat(row.amount)
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Row ${rowNum}: Invalid amount: ${row.amount}`)
          failed++
          continue
        }

        // Find or create vendor
        let vendorId = null
        if (row.vendor) {
          const { data: vendor } = await supabase
            .from('vendors')
            .select('id')
            .eq('org_id', orgId)
            .eq('name', row.vendor)
            .single()

          if (vendor) {
            vendorId = vendor.id
          } else {
            // Create new vendor
            const { data: newVendor, error: vendorError } = await supabase
              .from('vendors')
              .insert({ org_id: orgId, name: row.vendor })
              .select('id')
              .single()
            
            if (!vendorError && newVendor) {
              vendorId = newVendor.id
            }
          }
        }

        // Find or create category
        let categoryId = null
        if (row.category) {
          const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('org_id', orgId)
            .eq('name', row.category)
            .single()

          if (category) {
            categoryId = category.id
          } else {
            // Create new category
            const { data: newCategory, error: categoryError } = await supabase
              .from('categories')
              .insert({ 
                org_id: orgId, 
                name: row.category,
                type: 'other'
              })
              .select('id')
              .single()
            
            if (!categoryError && newCategory) {
              categoryId = newCategory.id
            }
          }
        }

        // Insert expense
        const { error: insertError } = await supabase
          .from('expenses')
          .insert({
            org_id: orgId,
            date: row.date,
            amount: amount,
            description: row.description || '',
            vendor_id: vendorId,
            category_id: categoryId
          })

        if (insertError) {
          errors.push(`Row ${rowNum}: Failed to insert: ${insertError.message}`)
          failed++
        } else {
          imported++
        }
      }
    } else if (type === 'subscriptions') {
      // Expected columns: name, amount, billing_cycle, vendor, status
      const requiredFields = ['name', 'amount', 'billing_cycle']
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const rowNum = i + 2

        // Validate required fields
        const missingFields = requiredFields.filter(field => !row[field])
        if (missingFields.length > 0) {
          errors.push(`Row ${rowNum}: Missing required fields: ${missingFields.join(', ')}`)
          failed++
          continue
        }

        // Validate amount
        const amount = parseFloat(row.amount)
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Row ${rowNum}: Invalid amount: ${row.amount}`)
          failed++
          continue
        }

        // Validate billing cycle
        const validCycles = ['monthly', 'quarterly', 'annual']
        if (!validCycles.includes(row.billing_cycle.toLowerCase())) {
          errors.push(`Row ${rowNum}: Invalid billing_cycle: ${row.billing_cycle}. Must be one of: ${validCycles.join(', ')}`)
          failed++
          continue
        }

        // Find or create vendor
        let vendorId = null
        if (row.vendor) {
          const { data: vendor } = await supabase
            .from('vendors')
            .select('id')
            .eq('org_id', orgId)
            .eq('name', row.vendor)
            .single()

          if (vendor) {
            vendorId = vendor.id
          } else {
            const { data: newVendor, error: vendorError } = await supabase
              .from('vendors')
              .insert({ org_id: orgId, name: row.vendor })
              .select('id')
              .single()
            
            if (!vendorError && newVendor) {
              vendorId = newVendor.id
            }
          }
        }

        // Find or create category
        let categoryId = null
        if (row.category) {
          const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('org_id', orgId)
            .eq('name', row.category)
            .single()

          if (category) {
            categoryId = category.id
          } else {
            const { data: newCategory, error: categoryError } = await supabase
              .from('categories')
              .insert({ 
                org_id: orgId, 
                name: row.category,
                type: 'subscription'
              })
              .select('id')
              .single()
            
            if (!categoryError && newCategory) {
              categoryId = newCategory.id
            }
          }
        }

        // Parse next_renewal_date if provided
        let nextRenewalDate = null
        if (row.next_renewal_date && !isNaN(Date.parse(row.next_renewal_date))) {
          nextRenewalDate = row.next_renewal_date
        }

        // Insert subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            org_id: orgId,
            name: row.name,
            amount: amount,
            billing_cycle: row.billing_cycle.toLowerCase(),
            status: row.status?.toLowerCase() || 'active',
            vendor_id: vendorId,
            category_id: categoryId,
            next_renewal_date: nextRenewalDate,
            auto_renew: row.auto_renew?.toLowerCase() === 'true' || row.auto_renew?.toLowerCase() === 'yes'
          })

        if (insertError) {
          errors.push(`Row ${rowNum}: Failed to insert: ${insertError.message}`)
          failed++
        } else {
          imported++
        }
      }
    }

    // Audit log
    await auditLog(supabase, {
      org_id: orgId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action: 'import',
      entity: type,
      entity_id: 'bulk',
      payload: { 
        imported, 
        failed, 
        filename: file.name,
        total_rows: rows.length
      }
    })

    return successResponse({
      imported,
      failed,
      total_rows: rows.length,
      errors: errors.slice(0, 50) // Limit to first 50 errors
    })
  } catch (error: any) {
    console.error('Error in POST /api/expenses/import:', error)
    return errorResponse(error.message || 'Internal server error', 500)
  }
}
