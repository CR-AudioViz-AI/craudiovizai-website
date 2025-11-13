/**
 * GET /api/cron/mortgage-rates
 * 
 * Automated cron job to scrape mortgage rates every hour
 * Integrated with crav-website cron system
 * 
 * @timestamp 2025-11-13T03:37:00Z
 */

import { NextRequest, NextResponse } from 'next/server';
import { MortgageScraper } from '@/lib/mortgage/scraper';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting mortgage rate scraping...');
    const startTime = Date.now();

    const scraper = new MortgageScraper();
    
    // Scrape all locations
    const scrapeResults = await scraper.scrapeAllLocations();
    
    // Check for alerts
    const alertsSent = await scraper.checkAndSendAlerts();
    
    const duration = Date.now() - startTime;

    console.log('[CRON] Mortgage scraping complete:', {
      success: scrapeResults.success,
      failed: scrapeResults.failed,
      totalRates: scrapeResults.totalRates,
      alertsSent,
      duration: `${duration}ms`,
    });

    return NextResponse.json({
      success: true,
      scraping: scrapeResults,
      alertsSent,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[CRON] Mortgage scraping error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
