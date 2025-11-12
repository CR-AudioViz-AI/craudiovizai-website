import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!

// Tracked repositories for documentation
const TRACKED_REPOS = [
  'crav-javari-ai',
  'crav-market-oracle',
  'craudiovizai-website',
  'crav-admin-dashboard',
  'crav-documentation'
]

// Documentation categories based on folder structure
const CATEGORY_MAP: Record<string, string> = {
  'ai-learning': 'ai-learning',
  'business': 'business',
  'customer': 'customer',
  'operations': 'operations',
  'technical': 'technical'
}

function verifyGitHubSignature(payload: string, signature: string): boolean {
  if (!signature) return false
  
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}

function extractCategoryFromPath(filePath: string): string | null {
  const parts = filePath.split('/')
  const categoryFolder = parts[0]
  return CATEGORY_MAP[categoryFolder] || null
}

async function fetchFileContent(repo: string, path: string, ref: string = 'main'): Promise<{ content: string; sha: string } | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/CR-AudioViz-AI/${repo}/contents/${path}?ref=${ref}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch file: ${response.statusText}`)
      return null
    }

    const data = await response.json()
    
    if (data.type !== 'file') {
      console.error(`Path is not a file: ${path}`)
      return null
    }

    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    return { content, sha: data.sha }

  } catch (error) {
    console.error('Error fetching file content:', error)
    return null
  }
}

function extractTitle(content: string, filePath: string): string {
  // Try to extract title from markdown
  const titleMatch = content.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    return titleMatch[1].trim()
  }

  // Fallback to filename
  const fileName = filePath.split('/').pop()
  return fileName?.replace(/\.md$/i, '').replace(/[-_]/g, ' ') || 'Untitled'
}

function extractTags(content: string): string[] {
  const tags: string[] = []
  
  // Extract from frontmatter if exists
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const tagsMatch = frontmatterMatch[1].match(/tags:\s*\[([^\]]+)\]/)
    if (tagsMatch) {
      tags.push(...tagsMatch[1].split(',').map(t => t.trim()))
    }
  }

  // Extract from hashtags
  const hashtagMatches = content.matchAll(/#(\w+)/g)
  for (const match of hashtagMatches) {
    if (!tags.includes(match[1])) {
      tags.push(match[1])
    }
  }

  return tags
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256') || ''
    const event = request.headers.get('x-github-event')
    const deliveryId = request.headers.get('x-github-delivery')

    // Verify webhook signature
    if (!verifyGitHubSignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const repoName = payload.repository?.name

    // Check if this is a tracked repo
    if (!TRACKED_REPOS.includes(repoName)) {
      console.log(`Ignoring webhook from untracked repo: ${repoName}`)
      return NextResponse.json({ message: 'Repo not tracked' })
    }

    // Create Supabase client (service role for webhook operations)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Log webhook delivery
    await supabase.from('webhook_deliveries').insert({
      delivery_id: deliveryId,
      event_type: event || 'unknown',
      action: payload.action,
      repo_name: repoName,
      sender: payload.sender?.login,
      payload: payload,
      processed: false
    })

    // Handle push event (file changes)
    if (event === 'push') {
      const commits = payload.commits || []
      const ref = payload.ref?.replace('refs/heads/', '')
      
      let filesProcessed = 0
      let filesFailed = 0

      // Start sync operation
      const { data: syncOp } = await supabase
        .from('sync_operations')
        .insert({
          operation_type: 'incremental',
          repo_name: repoName,
          status: 'in_progress',
          triggered_by: 'webhook'
        })
        .select()
        .single()

      for (const commit of commits) {
        const allFiles = [
          ...(commit.added || []),
          ...(commit.modified || [])
        ]

        // Filter for markdown files in tracked folders
        const mdFiles = allFiles.filter((file: string) => 
          file.endsWith('.md') && 
          Object.keys(CATEGORY_MAP).some(cat => file.startsWith(cat + '/'))
        )

        for (const filePath of mdFiles) {
          try {
            const category = extractCategoryFromPath(filePath)
            if (!category) continue

            const fileData = await fetchFileContent(repoName, filePath, ref)
            if (!fileData) {
              filesFailed++
              continue
            }

            const title = extractTitle(fileData.content, filePath)
            const tags = extractTags(fileData.content)
            
            // Determine subcategory from path
            const pathParts = filePath.split('/')
            const subcategory = pathParts.length > 2 ? pathParts[1] : null

            // Upsert documentation
            const { error } = await supabase
              .from('documentation')
              .upsert({
                repo_name: repoName,
                file_path: filePath,
                title,
                content: fileData.content,
                category,
                subcategory,
                tags,
                github_sha: fileData.sha,
                last_synced_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'repo_name,file_path'
              })

            if (error) {
              console.error(`Failed to upsert ${filePath}:`, error)
              filesFailed++
            } else {
              filesProcessed++
            }

          } catch (error) {
            console.error(`Error processing file ${filePath}:`, error)
            filesFailed++
          }
        }

        // Handle deleted files
        const removed = commit.removed || []
        for (const filePath of removed) {
          if (filePath.endsWith('.md')) {
            await supabase
              .from('documentation')
              .delete()
              .eq('repo_name', repoName)
              .eq('file_path', filePath)
          }
        }
      }

      // Update sync operation
      if (syncOp) {
        await supabase
          .from('sync_operations')
          .update({
            status: filesFailed > 0 ? 'completed_with_errors' : 'completed',
            files_synced: filesProcessed,
            files_failed: filesFailed,
            completed_at: new Date().toISOString()
          })
          .eq('id', syncOp.id)
      }

      // Mark webhook as processed
      await supabase
        .from('webhook_deliveries')
        .update({
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('delivery_id', deliveryId)

      return NextResponse.json({
        success: true,
        files_processed: filesProcessed,
        files_failed: filesFailed
      })
    }

    // Handle other events (e.g., repository created, renamed, etc.)
    return NextResponse.json({ message: 'Event received but not processed' })

  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to check webhook status
export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data: deliveries, error } = await supabase
      .from('webhook_deliveries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    const { data: syncs } = await supabase
      .from('sync_operations')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit)

    return NextResponse.json({
      recent_deliveries: deliveries,
      recent_syncs: syncs
    })

  } catch (error: any) {
    console.error('Webhook status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch webhook status' },
      { status: 500 }
    )
  }
}
