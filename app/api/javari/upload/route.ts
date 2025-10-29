/**
 * CR AudioViz AI - JavariAI File Upload & Analysis
 * Handles file uploads and analysis for documents, images, code, PDFs
 * @timestamp October 28, 2025 - 12:20 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ALLOWED_FILE_TYPES = {
  documents: ['.txt', '.md', '.pdf', '.doc', '.docx'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  code: ['.js', '.ts', '.py', '.java', '.cpp', '.html', '.css', '.json'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a'],
  video: ['.mp4', '.mov', '.avi', '.webm']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const analysisType = formData.get('analysis_type') as string || 'auto';
    const additionalContext = formData.get('context') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Detect file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const detectedType = detectFileType(fileExtension);

    if (!detectedType) {
      return NextResponse.json({ 
        error: 'Unsupported file type' 
      }, { status: 400 });
    }

    // Read file content
    const buffer = Buffer.from(await file.arrayBuffer());

    // Analyze file based on type
    let analysis;
    switch (detectedType) {
      case 'image':
        analysis = await analyzeImage(buffer, file.type, additionalContext);
        break;
      case 'document':
        analysis = await analyzeDocument(buffer, fileExtension, additionalContext);
        break;
      case 'code':
        analysis = await analyzeCode(buffer, fileExtension, additionalContext);
        break;
      case 'audio':
        analysis = await analyzeAudio(buffer, fileExtension, additionalContext);
        break;
      default:
        analysis = { error: 'Analysis not supported for this file type' };
    }

    // Store file metadata
    const fileRecord = {
      user_id: user.id,
      file_name: file.name,
      file_type: detectedType,
      file_size: file.size,
      file_extension: fileExtension,
      analysis_result: analysis,
      created_at: new Date().toISOString()
    };

    await supabase.from('javari_file_uploads').insert(fileRecord);

    return NextResponse.json({
      success: true,
      file_info: {
        name: file.name,
        type: detectedType,
        size: file.size
      },
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function detectFileType(extension: string): string | null {
  for (const [type, extensions] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  return null;
}

async function analyzeImage(
  buffer: Buffer,
  mimeType: string,
  context: string
): Promise<any> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Convert buffer to base64
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: context || 'Analyze this image in detail. Describe what you see, including objects, people, colors, composition, style, and any notable features. Also suggest creative uses or improvements.'
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const description = response.choices[0]?.message?.content || '';

    return {
      type: 'image',
      description: description,
      suggestions: extractSuggestions(description),
      tokens_used: response.usage?.total_tokens || 0,
      model_used: 'gpt-4-turbo'
    };

  } catch (error) {
    console.error('Image analysis error:', error);
    return {
      type: 'image',
      error: 'Failed to analyze image',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function analyzeDocument(
  buffer: Buffer,
  extension: string,
  context: string
): Promise<any> {
  try {
    let text = buffer.toString('utf-8');
    
    // Truncate if too long (max 8000 characters for analysis)
    if (text.length > 8000) {
      text = text.substring(0, 8000) + '\n\n[Document truncated for analysis...]';
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a document analysis expert. Analyze documents for key information, structure, and provide actionable insights.'
        },
        {
          role: 'user',
          content: `${context || 'Analyze this document and provide:'}\n\n1. Summary of main points\n2. Document structure and organization\n3. Key takeaways\n4. Suggested improvements\n5. Action items (if any)\n\nDocument:\n\n${text}`
        }
      ],
      max_tokens: 1500
    });

    const analysis = response.choices[0]?.message?.content || '';

    return {
      type: 'document',
      file_extension: extension,
      word_count: text.split(/\s+/).length,
      character_count: text.length,
      analysis: analysis,
      key_points: extractKeyPoints(analysis),
      tokens_used: response.usage?.total_tokens || 0,
      model_used: 'gpt-4-turbo'
    };

  } catch (error) {
    console.error('Document analysis error:', error);
    return {
      type: 'document',
      error: 'Failed to analyze document',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function analyzeCode(
  buffer: Buffer,
  extension: string,
  context: string
): Promise<any> {
  try {
    const code = buffer.toString('utf-8');
    
    // Determine language
    const language = getLanguageFromExtension(extension);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer and software engineer. Analyze code for quality, security, performance, and best practices.'
        },
        {
          role: 'user',
          content: `${context || `Analyze this ${language} code and provide:`}\n\n1. Code quality assessment\n2. Security vulnerabilities\n3. Performance issues\n4. Best practices violations\n5. Suggested improvements\n6. Refactoring opportunities\n\nCode:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ],
      max_tokens: 1500
    });

    const analysis = response.choices[0]?.message?.content || '';

    return {
      type: 'code',
      language: language,
      file_extension: extension,
      line_count: code.split('\n').length,
      character_count: code.length,
      analysis: analysis,
      security_issues: extractSecurityIssues(analysis),
      performance_issues: extractPerformanceIssues(analysis),
      suggestions: extractSuggestions(analysis),
      tokens_used: response.usage?.total_tokens || 0,
      model_used: 'gpt-4-turbo'
    };

  } catch (error) {
    console.error('Code analysis error:', error);
    return {
      type: 'code',
      error: 'Failed to analyze code',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function analyzeAudio(
  buffer: Buffer,
  extension: string,
  context: string
): Promise<any> {
  // For audio, we'd typically use Whisper API for transcription
  // For now, return a placeholder
  return {
    type: 'audio',
    file_extension: extension,
    file_size: buffer.length,
    message: 'Audio analysis coming soon. Will include transcription, speaker identification, and sentiment analysis.',
    tokens_used: 0
  };
}

function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.html': 'html',
    '.css': 'css',
    '.json': 'json',
    '.xml': 'xml',
    '.sql': 'sql',
    '.php': 'php',
    '.rb': 'ruby',
    '.go': 'go',
    '.rs': 'rust'
  };
  return languageMap[extension] || 'unknown';
}

function extractKeyPoints(text: string): string[] {
  const points: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/^[\d.•-]\s+/)) {
      points.push(line.trim());
    }
  }
  
  return points.slice(0, 5); // Return top 5 points
}

function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes('suggest') || 
        lines[i].toLowerCase().includes('recommend') ||
        lines[i].toLowerCase().includes('consider')) {
      suggestions.push(lines[i].trim());
    }
  }
  
  return suggestions.slice(0, 5);
}

function extractSecurityIssues(text: string): string[] {
  const issues: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('security') ||
        line.toLowerCase().includes('vulnerability') ||
        line.toLowerCase().includes('exploit')) {
      issues.push(line.trim());
    }
  }
  
  return issues;
}

function extractPerformanceIssues(text: string): string[] {
  const issues: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('performance') ||
        line.toLowerCase().includes('slow') ||
        line.toLowerCase().includes('optimize')) {
      issues.push(line.trim());
    }
  }
  
  return issues;
}

// GET endpoint for file history
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const { data: files, error } = await supabase
      .from('javari_file_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      files: files || [],
      count: files?.length || 0
    });

  } catch (error) {
    console.error('File history fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file history' },
      { status: 500 }
    );
  }
}
