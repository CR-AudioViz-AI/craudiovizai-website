import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// Get relevant documentation for a question
async function getRelevantDocs(supabase: any, question: string, category?: string): Promise<any[]> {
  const { data, error } = await supabase.rpc('search_documentation', {
    search_query: question,
    category_filter: category,
    limit_results: 5
  })

  if (error) {
    console.error('Error searching docs:', error)
    return []
  }

  return data || []
}

// Build context from relevant documentation
function buildContext(docs: any[]): string {
  if (docs.length === 0) {
    return 'No relevant documentation found.'
  }

  return docs.map((doc, index) => {
    return `
Document ${index + 1}: ${doc.title}
Category: ${doc.category} ${doc.subcategory ? `> ${doc.subcategory}` : ''}
Content:
${doc.content}
---
`
  }).join('\n')
}

// POST /api/documentation/ai - Ask AI about documentation
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const body = await request.json()
    const { question, category, context: additionalContext } = body

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Get relevant documentation
    const relevantDocs = await getRelevantDocs(supabase, question, category)
    const docsContext = buildContext(relevantDocs)

    // Build system prompt
    const systemPrompt = `You are a helpful AI assistant for CR AudioViz AI platform documentation. Your role is to answer user questions accurately based on the provided documentation.

Guidelines:
- Answer based ONLY on the provided documentation
- If the answer isn't in the documentation, say so clearly
- Be concise but thorough
- Include relevant examples from the docs when helpful
- If multiple approaches exist, explain the options
- Format your response in clear markdown
- For code examples, use proper syntax highlighting

Current context:
${additionalContext ? `User is currently on: ${additionalContext.page || 'unknown page'}` : ''}
${additionalContext?.userRole ? `User role: ${additionalContext.userRole}` : ''}
`

    const userMessage = `Here is the relevant documentation:

${docsContext}

User question: ${question}

Please provide a clear, helpful answer based on the documentation above.`

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userMessage
      }]
    })

    const answer = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Unable to generate answer'

    // Get user ID if authenticated
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    // Save Q&A to database
    const { data: savedQA, error: saveError } = await supabase
      .from('doc_questions')
      .insert({
        user_id: userId,
        question,
        answer,
        context: {
          category,
          additional_context: additionalContext,
          num_docs_used: relevantDocs.length
        },
        sources: relevantDocs.map(doc => doc.id),
        ai_model: 'claude-sonnet-4',
        answered_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving Q&A:', saveError)
    }

    return NextResponse.json({
      answer,
      sources: relevantDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        subcategory: doc.subcategory
      })),
      question_id: savedQA?.id
    })

  } catch (error: any) {
    console.error('AI documentation Q&A error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process question' },
      { status: 500 }
    )
  }
}

// GET /api/documentation/ai - Get user's question history
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const { data: questions, error } = await supabase
      .from('doc_questions')
      .select('id, question, answer, sources, rating, created_at, answered_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Get source docs details
    const allSourceIds = questions?.flatMap(q => q.sources || []) || []
    const uniqueSourceIds = [...new Set(allSourceIds)]

    const { data: sourceDocs } = await supabase
      .from('documentation')
      .select('id, title, category, subcategory')
      .in('id', uniqueSourceIds)

    const sourceMap = new Map(sourceDocs?.map(doc => [doc.id, doc]) || [])

    // Enrich questions with source details
    const enrichedQuestions = questions?.map(q => ({
      ...q,
      sources: q.sources?.map((id: string) => sourceMap.get(id)).filter(Boolean) || []
    }))

    return NextResponse.json({ questions: enrichedQuestions })

  } catch (error: any) {
    console.error('Error fetching question history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

// PATCH /api/documentation/ai - Rate an answer
export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { question_id, rating, feedback } = body

    if (!question_id) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 })
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify the question belongs to the user
    const { data: question } = await supabase
      .from('doc_questions')
      .select('user_id')
      .eq('id', question_id)
      .single()

    if (!question || question.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update rating/feedback
    const { data, error } = await supabase
      .from('doc_questions')
      .update({
        rating,
        feedback
      })
      .eq('id', question_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ question: data })

  } catch (error: any) {
    console.error('Error rating answer:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit rating' },
      { status: 500 }
    )
  }
}
