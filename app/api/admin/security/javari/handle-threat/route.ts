// API Route: /api/admin/security/javari/handle-threat
import { NextRequest, NextResponse } from 'next/server';
import { javariHandleThreat } from '@/lib/security/javari-security-handler';

export async function POST(request: NextRequest) {
  try {
    const { threat_id } = await request.json();

    if (!threat_id) {
      return NextResponse.json(
        { error: 'threat_id is required' },
        { status: 400 }
      );
    }

    const result = await javariHandleThreat(threat_id);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
