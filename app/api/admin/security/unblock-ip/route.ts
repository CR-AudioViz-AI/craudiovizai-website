// API Route: /api/admin/security/unblock-ip
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { ip_address } = await request.json();

    if (!ip_address) {
      return NextResponse.json(
        { error: 'ip_address is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Delete from blocklist
    const { error } = await supabase
      .from('security_ip_blocklist')
      .delete()
      .eq('ip_address', ip_address);

    if (error) throw error;

    // Log event
    await supabase.from('security_events').insert({
      event_type: 'ip_unblocked',
      event_category: 'manual_intervention',
      severity: 'info',
      description: `IP ${ip_address} was manually unblocked`,
      metadata: { ip_address },
      actor: 'admin',
      ip_address,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
