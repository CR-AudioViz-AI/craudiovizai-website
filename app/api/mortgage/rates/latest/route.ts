/**
 * GET /api/mortgage/rates/latest
 * 
 * Get latest mortgage rates for specified locations
 * Integrated with crav-website backend
 * 
 * @timestamp 2025-11-13T03:35:00Z
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get('location_code') || 'US';
    const rateType = searchParams.get('rate_type');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build query for latest rates
    let query = supabase
      .from('mortgage_rates')
      .select('*')
      .eq('location_code', locationCode)
      .order('scraped_at', { ascending: false })
      .limit(limit);

    if (rateType) {
      query = query.eq('rate_type', rateType);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by rate type and get most recent
    const latestRates = data.reduce((acc: any[], rate: any) => {
      const existing = acc.find(r => r.rate_type === rate.rate_type);
      if (!existing) {
        acc.push(rate);
      }
      return acc;
    }, []);

    return NextResponse.json({
      success: true,
      location_code: locationCode,
      count: latestRates.length,
      rates: latestRates,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API] /mortgage/rates/latest error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
