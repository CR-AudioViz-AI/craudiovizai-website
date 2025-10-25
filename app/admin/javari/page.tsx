import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import JavariChatInterface from '@/components/JavariChatInterface';

/**
 * Javari AI - Main Chat Page
 * Full-featured conversational AI assistant
 * 
 * Features:
 * - Server-side authentication
 * - Real-time chat interface
 * - Voice capabilities
 * - Credit tracking
 * - Conversation history
 * 
 * Session: 2025-10-25 - Saturday
 */

export const dynamic = 'force-dynamic';

export default async function JavariPage() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin?redirect=/admin/javari');
  }

  return (
    <div className="h-screen flex flex-col">
      <JavariChatInterface />
    </div>
  );
}
