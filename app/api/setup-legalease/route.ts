import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    if (token !== 'legalease-setup-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Supabase client with service role
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

    // Check if table already exists
    const { data: existingData, error: checkError } = await supabase
      .from('legalease_documents')
      .select('id')
      .limit(1)

    if (!checkError) {
      return NextResponse.json({ 
        success: true, 
        message: 'Table already exists, migration not needed'
      })
    }

    // Execute SQL using Supabase SQL editor API
    // This uses the service role which has permissions
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS public.legalease_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        original_content TEXT NOT NULL,
        converted_content TEXT,
        document_type TEXT DEFAULT 'other' CHECK (document_type IN ('contract', 'agreement', 'terms', 'policy', 'other')),
        status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      `ALTER TABLE public.legalease_documents ENABLE ROW LEVEL SECURITY`,
      
      `DO $$ BEGIN
        CREATE POLICY "Users can view own legalease documents" ON public.legalease_documents FOR SELECT USING (auth.uid() = user_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$`,
      
      `DO $$ BEGIN
        CREATE POLICY "Users can create own legalease documents" ON public.legalease_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$`,
      
      `DO $$ BEGIN
        CREATE POLICY "Users can update own legalease documents" ON public.legalease_documents FOR UPDATE USING (auth.uid() = user_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$`,
      
      `DO $$ BEGIN
        CREATE POLICY "Users can delete own legalease documents" ON public.legalease_documents FOR DELETE USING (auth.uid() = user_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$`,
      
      `CREATE INDEX IF NOT EXISTS idx_legalease_documents_user_id ON public.legalease_documents(user_id)`,
      
      `CREATE INDEX IF NOT EXISTS idx_legalease_documents_created_at ON public.legalease_documents(created_at DESC)`
    ]

    // Try executing via pg library
    try {
      const { Client } = require('pg')
      
      // Get connection details from env
      const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
      
      if (dbUrl) {
        const client = new Client({ connectionString: dbUrl })
        await client.connect()
        
        for (const sql of sqlStatements) {
          await client.query(sql)
        }
        
        await client.end()
        
        return NextResponse.json({ 
          success: true, 
          message: 'Migration completed via direct connection'
        })
      }
    } catch (directError: any) {
      console.log('Direct connection failed:', directError.message)
    }

    // Fallback: Return SQL for manual execution
    return NextResponse.json({ 
      success: false,
      error: 'Cannot execute SQL automatically',
      message: 'Please run the SQL manually in Supabase Dashboard',
      sql: sqlStatements.join(';\n\n')
    }, { status: 500 })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Migration setup failed',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST with token to run legalease migration' })
}
