import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!

interface FileItem {
  name: string
  path: string
  type: 'file' | 'dir'
  sha: string
  size: number
  download_url: string | null
}

// Fetch directory contents recursively
async function fetchDirectoryContents(
  repo: string,
  path: string = '',
  ref: string = 'main'
): Promise<FileItem[]> {
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
      console.error(`Failed to fetch directory: ${response.statusText}`)
      return []
    }

    const items = await response.json()
    return Array.isArray(items) ? items : []

  } catch (error) {
    console.error('Error fetching directory:', error)
    return []
  }
}

// Fetch file content
async function fetchFileContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    return await response.text()
  } catch (error) {
    console.error('Error fetching file content:', error)
    return null
  }
}

// Extract metadata from markdown
function extractMetadata(content: string, filePath: string) {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : filePath.split('/').pop()?.replace(/\.md$/i, '') || 'Untitled'

  const tags: string[] = []
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const tagsMatch = frontmatterMatch[1].match(/tags:\s*\[([^\]]+)\]/)
    if (tagsMatch) {
      tags.push(...tagsMatch[1].split(',').map(t => t.trim()))
    }
  }

  const hashtagMatches = content.matchAll(/#(\w+)/g)
  for (const match of hashtagMatches) {
    if (!tags.includes(match[1])) {
      tags.push(match[1])
    }
  }

  return { title, tags }
}

// Determine category from path
function getCategoryFromPath(path: string): string | null {
  const categories = ['ai-learning', 'business', 'customer', 'operations', 'technical']
  const firstPart = path.split('/')[0]
  return categories.includes(firstPart) ? firstPart : null
}

// POST /api/documentation/sync - Trigger manual sync
export async function POST(request: Request) {
  try {
    // Verify authorization (should be admin or service role)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const body = await request.json()
    const { repos, type = 'full' } = body // type: 'full' or 'incremental'

    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json(
        { error: 'repos array is required' },
        { status: 400 }
      )
    }

    const results = []

    for (const repo of repos) {
      // Create sync operation record
      const { data: syncOp } = await supabase
        .from('sync_operations')
        .insert({
          operation_type: type,
          repo_name: repo,
          status: 'in_progress',
          triggered_by: 'manual'
        })
        .select()
        .single()

      let filesSynced = 0
      let filesFailed = 0
      const errors: string[] = []

      try {
        // Get all markdown files from documentation folders
        const docsFolders = ['ai-learning', 'business', 'customer', 'operations', 'technical']
        
        for (const folder of docsFolders) {
          const files = await fetchDirectoryContents(repo, folder)
          
          for (const file of files) {
            if (file.type === 'file' && file.name.endsWith('.md')) {
              try {
                if (!file.download_url) {
                  errors.push(`No download URL for ${file.path}`)
                  filesFailed++
                  continue
                }

                const content = await fetchFileContent(file.download_url)
                if (!content) {
                  errors.push(`Failed to fetch content: ${file.path}`)
                  filesFailed++
                  continue
                }

                const { title, tags } = extractMetadata(content, file.path)
                const category = getCategoryFromPath(file.path)
                
                if (!category) {
                  errors.push(`Invalid category for ${file.path}`)
                  filesFailed++
                  continue
                }

                const pathParts = file.path.split('/')
                const subcategory = pathParts.length > 2 ? pathParts[1] : null

                // Upsert documentation
                const { error: upsertError } = await supabase
                  .from('documentation')
                  .upsert({
                    repo_name: repo,
                    file_path: file.path,
                    title,
                    content,
                    category,
                    subcategory,
                    tags,
                    github_sha: file.sha,
                    last_synced_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }, {
                    onConflict: 'repo_name,file_path'
                  })

                if (upsertError) {
                  errors.push(`Failed to upsert ${file.path}: ${upsertError.message}`)
                  filesFailed++
                } else {
                  filesSynced++
                }

              } catch (fileError: any) {
                errors.push(`Error processing ${file.path}: ${fileError.message}`)
                filesFailed++
              }
            } else if (file.type === 'dir') {
              // Recursively process subdirectories
              const subFiles = await fetchDirectoryContents(repo, file.path)
              // Process subFiles (simplified for now - could make this fully recursive)
            }
          }
        }

        // Update sync operation
        if (syncOp) {
          await supabase
            .from('sync_operations')
            .update({
              status: filesFailed > 0 ? 'completed_with_errors' : 'completed',
              files_synced: filesSynced,
              files_failed: filesFailed,
              error_details: errors.length > 0 ? { errors } : null,
              completed_at: new Date().toISOString()
            })
            .eq('id', syncOp.id)
        }

        results.push({
          repo,
          success: true,
          files_synced: filesSynced,
          files_failed: filesFailed,
          errors: errors.length > 0 ? errors.slice(0, 10) : undefined // Limit error list
        })

      } catch (repoError: any) {
        if (syncOp) {
          await supabase
            .from('sync_operations')
            .update({
              status: 'failed',
              files_synced: filesSynced,
              files_failed: filesFailed,
              error_details: { error: repoError.message },
              completed_at: new Date().toISOString()
            })
            .eq('id', syncOp.id)
        }

        results.push({
          repo,
          success: false,
          error: repoError.message
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total_files_synced: results.reduce((sum, r) => sum + (r.files_synced || 0), 0),
      total_files_failed: results.reduce((sum, r) => sum + (r.files_failed || 0), 0)
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}

// GET /api/documentation/sync - Get sync status
export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { searchParams } = new URL(request.url)
    const repo = searchParams.get('repo')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('sync_operations')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit)

    if (repo) {
      query = query.eq('repo_name', repo)
    }

    const { data: operations, error } = await query

    if (error) throw error

    // Get summary stats
    const { data: stats } = await supabase
      .from('sync_operations')
      .select('status, operation_type')

    const summary = {
      total_operations: stats?.length || 0,
      by_status: {
        pending: stats?.filter(s => s.status === 'pending').length || 0,
        in_progress: stats?.filter(s => s.status === 'in_progress').length || 0,
        completed: stats?.filter(s => s.status === 'completed').length || 0,
        failed: stats?.filter(s => s.status === 'failed').length || 0,
        completed_with_errors: stats?.filter(s => s.status === 'completed_with_errors').length || 0
      },
      by_type: {
        full_sync: stats?.filter(s => s.operation_type === 'full_sync').length || 0,
        incremental: stats?.filter(s => s.operation_type === 'incremental').length || 0
      }
    }

    return NextResponse.json({
      operations,
      summary
    })

  } catch (error: any) {
    console.error('Sync status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sync status' },
      { status: 500 }
    )
  }
}
