// API Route: /api/admin/security/stats
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get total threats
    const { count: total_threats } = await supabase
      .from('security_threats')
      .select('*', { count: 'exact', head: true });

    // Get blocked count
    const { count: blocked_count } = await supabase
      .from('security_threats')
      .select('*', { count: 'exact', head: true })
      .eq('blocked', true);

    // Get honeypot catches
    const { count: honeypot_catches } = await supabase
      .from('security_honeypot_catches')
      .select('*', { count: 'exact', head: true })
      .eq('still_active', true);

    // Get Javari handled
    const { count: javari_handled } = await supabase
      .from('security_threats')
      .select('*', { count: 'exact', head: true })
      .eq('handled_by_javari', true);

    // Get threat types breakdown
    const { data: threats } = await supabase
      .from('security_threats')
      .select('threat_type');

    const threat_types: Record<string, number> = {};
    threats?.forEach(t => {
      threat_types[t.threat_type] = (threat_types[t.threat_type] || 0) + 1;
    });

    // Get severity breakdown
    const { data: severities } = await supabase
      .from('security_threats')
      .select('severity');

    const severity_breakdown: Record<string, number> = {};
    severities?.forEach(s => {
      severity_breakdown[s.severity] = (severity_breakdown[s.severity] || 0) + 1;
    });

    return NextResponse.json({
      total_threats: total_threats || 0,
      blocked_count: blocked_count || 0,
      honeypot_catches: honeypot_catches || 0,
      active_threats: (total_threats || 0) - (blocked_count || 0),
      javari_handled: javari_handled || 0,
      false_positives: 0, // TODO: Implement
      threat_types,
      severity_breakdown,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
