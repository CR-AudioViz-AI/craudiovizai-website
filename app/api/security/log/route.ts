import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

export async function POST(request: NextRequest) {
  try {
    const { ip, type, path, timestamp } = await request.json();
    const supabase = createClient();

    await supabase.from('security_logs').insert({
      ip_address: ip,
      threat_type: type,
      path_accessed: path,
      user_agent: request.headers.get('user-agent'),
      created_at: timestamp
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
