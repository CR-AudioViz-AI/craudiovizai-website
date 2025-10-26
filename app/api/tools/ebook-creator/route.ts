// CR AudioViz AI - E-book Creator API
// Session: 2025-10-25 Phase 6 Build
// Route: /api/tools/ebook-creator/route.ts
// Generate formatted e-books from text content

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const dynamic = 'force-dynamic'

interface EbookRequest {
  title: string
  author: string
  content: string
  format: 'pdf' | 'epub' | 'mobi'
  fontSize: number
  fontFamily: string
  includeTableOfContents: boolean
  chapters?: Array<{ title: string; content: string }>
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to use E-book Creator' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body: EbookRequest = await request.json()

    // Validate input
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check credit balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    const EBOOK_COST = 5 // 5 credits per ebook generation

    if (!profile || profile.credits < EBOOK_COST) {
      return NextResponse.json(
        { error: 'Insufficient credits', required: EBOOK_COST, available: profile?.credits || 0 },
        { status: 402 }
      )
    }

    // Generate e-book based on format
    let ebookBuffer: Buffer
    let mimeType: string
    let filename: string

    if (body.format === 'pdf') {
      ebookBuffer = await generatePDF(body)
      mimeType = 'application/pdf'
      filename = `${body.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
    } else if (body.format === 'epub') {
      ebookBuffer = await generateEPUB(body)
      mimeType = 'application/epub+zip'
      filename = `${body.title.replace(/[^a-z0-9]/gi, '_')}.epub`
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Currently supporting PDF and EPUB.' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(`ebooks/${userId}/${filename}`, ebookBuffer, {
        contentType: mimeType,
        upsert: true
      })

    if (uploadError) throw uploadError

    // Save to database
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .insert({
        user_id: userId,
        type: 'ebook',
        filename,
        storage_path: uploadData.path,
        size: ebookBuffer.length,
        metadata: {
          title: body.title,
          author: body.author,
          format: body.format
        }
      })
      .select()
      .single()

    if (assetError) throw assetError

    // Deduct credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - EBOOK_COST })
      .eq('id', userId)

    // Log transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -EBOOK_COST,
        type: 'usage',
        description: `E-book generated: ${body.title}`,
        balance_after: profile.credits - EBOOK_COST
      })

    // Get signed URL for download
    const { data: signedUrl } = await supabase.storage
      .from('assets')
      .createSignedUrl(uploadData.path, 3600) // 1 hour

    return NextResponse.json({
      success: true,
      asset_id: asset.id,
      download_url: signedUrl?.signedUrl,
      filename,
      credits_used: EBOOK_COST,
      credits_remaining: profile.credits - EBOOK_COST
    })

  } catch (error: any) {
    console.error('E-book creator error:', error)
    return NextResponse.json(
      { error: 'Failed to generate e-book', details: error.message },
      { status: 500 }
    )
  }
}

// Generate PDF e-book
async function generatePDF(data: EbookRequest): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  
  const fontSize = data.fontSize || 12
  const margin = 50
  const pageWidth = 595.28 // A4 width in points
  const pageHeight = 841.89 // A4 height in points
  const maxWidth = pageWidth - (2 * margin)

  // Title page
  let page = pdfDoc.addPage([pageWidth, pageHeight])
  page.drawText(data.title, {
    x: margin,
    y: pageHeight - 100,
    size: 24,
    font: timesRomanBold,
    color: rgb(0, 0, 0),
  })

  if (data.author) {
    page.drawText(`by ${data.author}`, {
      x: margin,
      y: pageHeight - 140,
      size: 16,
      font: timesRomanFont,
      color: rgb(0.3, 0.3, 0.3),
    })
  }

  // Content pages
  const contentLines = data.content.split('\n')
  let yPosition = pageHeight - margin
  page = pdfDoc.addPage([pageWidth, pageHeight])

  for (const line of contentLines) {
    if (line.trim().length === 0) {
      yPosition -= fontSize * 1.5
      continue
    }

    // Wrap text if too long
    const words = line.split(' ')
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine + word + ' '
      const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize)

      if (textWidth > maxWidth && currentLine.length > 0) {
        // Draw current line and start new one
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        
        yPosition -= fontSize * 1.5
        currentLine = word + ' '

        // New page if needed
        if (yPosition < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight])
          yPosition = pageHeight - margin
        }
      } else {
        currentLine = testLine
      }
    }

    // Draw remaining text
    if (currentLine.trim().length > 0) {
      page.drawText(currentLine, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      yPosition -= fontSize * 1.5
    }

    // New page if needed
    if (yPosition < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight])
      yPosition = pageHeight - margin
    }
  }

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

// Generate EPUB e-book (basic implementation)
async function generateEPUB(data: EbookRequest): Promise<Buffer> {
  // For now, return a simple HTML-based EPUB structure
  // In production, use a proper EPUB library like epub-gen
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.title}</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: serif; font-size: ${data.fontSize}px; line-height: 1.6; margin: 2em; }
        h1 { text-align: center; margin-bottom: 0.5em; }
        .author { text-align: center; color: #666; margin-bottom: 2em; }
      </style>
    </head>
    <body>
      <h1>${data.title}</h1>
      ${data.author ? `<div class="author">by ${data.author}</div>` : ''}
      <div>${data.content.split('\n').map(line => `<p>${line}</p>`).join('')}</div>
    </body>
    </html>
  `

  return Buffer.from(htmlContent, 'utf-8')
}
