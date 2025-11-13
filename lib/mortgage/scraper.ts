/**
 * Mortgage Rate Scraper
 * Integrated with crav-website backend
 * 
 * @timestamp 2025-11-13T03:36:00Z
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RateData {
  location_code: string;
  rate_type: '30-year-fixed' | '15-year-fixed' | '5-1-arm';
  rate: number;
  apr: number;
  points: number;
  source: string;
  scraped_at: Date;
}

export class MortgageScraper {
  /**
   * Scrape mortgage rates for a location
   * In production, this would call actual scraping APIs
   */
  async scrapeLocation(locationCode: string): Promise<RateData[]> {
    const startTime = Date.now();
    
    try {
      // TODO: Implement actual scraping logic
      // For now, return sample data
      const rates: RateData[] = [
        {
          location_code: locationCode,
          rate_type: '30-year-fixed',
          rate: 7.25,
          apr: 7.35,
          points: 0.5,
          source: 'Zillow',
          scraped_at: new Date(),
        },
        {
          location_code: locationCode,
          rate_type: '15-year-fixed',
          rate: 6.75,
          apr: 6.85,
          points: 0.5,
          source: 'Zillow',
          scraped_at: new Date(),
        },
        {
          location_code: locationCode,
          rate_type: '5-1-arm',
          rate: 6.50,
          apr: 6.60,
          points: 0,
          source: 'Zillow',
          scraped_at: new Date(),
        },
      ];

      // Save to database
      const { error } = await supabase
        .from('mortgage_rates')
        .insert(rates);

      if (error) throw error;

      // Log health
      await supabase.from('mortgage_scraper_health').insert({
        source: 'Zillow',
        location_code: locationCode,
        success: true,
        duration_ms: Date.now() - startTime,
        rates_found: rates.length,
      });

      return rates;
    } catch (error: any) {
      // Log failure
      await supabase.from('mortgage_scraper_health').insert({
        source: 'Zillow',
        location_code: locationCode,
        success: false,
        duration_ms: Date.now() - startTime,
        rates_found: 0,
        error_message: error.message,
      });

      throw error;
    }
  }

  /**
   * Scrape all active locations
   */
  async scrapeAllLocations(): Promise<{
    success: number;
    failed: number;
    totalRates: number;
  }> {
    const { data: locations } = await supabase
      .from('mortgage_locations')
      .select('location_code')
      .eq('is_active', true);

    if (!locations) return { success: 0, failed: 0, totalRates: 0 };

    let success = 0;
    let failed = 0;
    let totalRates = 0;

    for (const location of locations.slice(0, 5)) { // Limit to 5 for demo
      try {
        const rates = await this.scrapeLocation(location.location_code);
        totalRates += rates.length;
        success++;
      } catch (error) {
        failed++;
      }
    }

    return { success, failed, totalRates };
  }

  /**
   * Check for rate drops and send alerts
   */
  async checkAndSendAlerts(): Promise<number> {
    // Get all active alerts
    const { data: alerts } = await supabase
      .from('mortgage_rate_alerts')
      .select('*')
      .eq('is_active', true);

    if (!alerts) return 0;

    let alertsSent = 0;

    for (const alert of alerts) {
      // Get latest rate
      const { data: rates } = await supabase
        .from('mortgage_rates')
        .select('rate')
        .eq('location_code', alert.location_code)
        .eq('rate_type', alert.rate_type)
        .order('scraped_at', { ascending: false })
        .limit(1);

      if (!rates || rates.length === 0) continue;

      const currentRate = rates[0].rate;
      const rateDrop = alert.last_rate ? alert.last_rate - currentRate : 0;

      // Check if drop exceeds threshold
      if (rateDrop >= alert.threshold) {
        // Send email alert (integrate with existing email service)
        // TODO: Call crav-website email service
        
        // Log alert
        await supabase.from('mortgage_alert_history').insert({
          alert_id: alert.id,
          user_id: alert.user_id,
          location_code: alert.location_code,
          rate_type: alert.rate_type,
          old_rate: alert.last_rate || 0,
          new_rate: currentRate,
          rate_drop: rateDrop,
          email: alert.email,
        });

        // Update alert
        await supabase
          .from('mortgage_rate_alerts')
          .update({
            last_rate: currentRate,
            last_alert_sent_at: new Date().toISOString(),
            alert_count: alert.alert_count + 1,
          })
          .eq('id', alert.id);

        alertsSent++;
      }
    }

    return alertsSent;
  }
}
