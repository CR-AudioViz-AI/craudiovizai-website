import { AdminNavigation } from '@/components/AdminNavigation';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/signin?redirectTo=/admin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
