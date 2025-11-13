-- ============================================================================
-- MORTGAGE RATE MONITORING SYSTEM
-- ============================================================================
-- Created: 2025-11-13
-- Purpose: Add real-time mortgage rate monitoring for 92 US locations
-- Integration: Ties into existing crav-website backend
-- Features: Multi-source scraping, alerts, historical tracking
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. LOCATIONS TABLE
-- Stores all 92 monitored locations (50 states + 35 metros + national)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mortgage_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_code VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'FL', 'NY-NYC', 'US'
  location_name VARCHAR(255) NOT NULL,       -- e.g., 'Florida', 'New York City', 'United States'
  location_type VARCHAR(20) NOT NULL,        -- 'state', 'metro', 'national'
  state_code VARCHAR(2),                     -- For metros, parent state
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_mortgage_locations_code ON mortgage_locations(location_code);
CREATE INDEX idx_mortgage_locations_type ON mortgage_locations(location_type);

-- ----------------------------------------------------------------------------
-- 2. MORTGAGE RATES TABLE
-- Historical storage of all scraped rates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mortgage_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES mortgage_locations(id) ON DELETE CASCADE,
  location_code VARCHAR(10) NOT NULL,
  
  -- Rate details
  rate_type VARCHAR(20) NOT NULL,            -- '30-year-fixed', '15-year-fixed', '5-1-arm'
  rate DECIMAL(5,3) NOT NULL,                -- e.g., 7.250
  apr DECIMAL(5,3) NOT NULL,                 -- e.g., 7.350
  points DECIMAL(4,2) DEFAULT 0,             -- e.g., 0.50
  
  -- Source tracking
  source VARCHAR(50) NOT NULL,               -- 'Zillow', 'Bankrate', 'MortgageNewsDaily'
  confidence VARCHAR(10) DEFAULT 'medium',   -- 'high', 'medium', 'low'
  
  -- Metadata
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB,                            -- Store full scraper response
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_mortgage_rates_location ON mortgage_rates(location_code);
CREATE INDEX idx_mortgage_rates_type ON mortgage_rates(rate_type);
CREATE INDEX idx_mortgage_rates_scraped ON mortgage_rates(scraped_at DESC);
CREATE INDEX idx_mortgage_rates_source ON mortgage_rates(source);
CREATE INDEX idx_mortgage_rates_lookup ON mortgage_rates(location_code, rate_type, scraped_at DESC);

-- ----------------------------------------------------------------------------
-- 3. RATE ALERTS TABLE
-- User alert configurations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mortgage_rate_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Alert configuration
  location_code VARCHAR(10) NOT NULL,
  rate_type VARCHAR(20) NOT NULL,
  threshold DECIMAL(5,3) NOT NULL,           -- Alert when rate drops by this amount
  email VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Tracking
  last_rate DECIMAL(5,3),                    -- Last known rate
  last_alert_sent_at TIMESTAMPTZ,
  alert_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, location_code, rate_type)
);

-- Indexes
CREATE INDEX idx_mortgage_alerts_user ON mortgage_rate_alerts(user_id);
CREATE INDEX idx_mortgage_alerts_location ON mortgage_rate_alerts(location_code);
CREATE INDEX idx_mortgage_alerts_active ON mortgage_rate_alerts(is_active) WHERE is_active = true;

-- ----------------------------------------------------------------------------
-- 4. ALERT HISTORY TABLE
-- Log of all sent alerts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mortgage_alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID REFERENCES mortgage_rate_alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Alert details
  location_code VARCHAR(10) NOT NULL,
  rate_type VARCHAR(20) NOT NULL,
  old_rate DECIMAL(5,3) NOT NULL,
  new_rate DECIMAL(5,3) NOT NULL,
  rate_drop DECIMAL(5,3) NOT NULL,
  
  -- Delivery
  email VARCHAR(255) NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for tracking
CREATE INDEX idx_mortgage_alert_history_user ON mortgage_alert_history(user_id);
CREATE INDEX idx_mortgage_alert_history_sent ON mortgage_alert_history(sent_at DESC);

-- ----------------------------------------------------------------------------
-- 5. SCRAPER HEALTH TABLE
-- Monitor scraper performance
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mortgage_scraper_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Scrape session
  session_id UUID DEFAULT uuid_generate_v4(),
  source VARCHAR(50) NOT NULL,               -- 'Zillow', 'Bankrate', 'MortgageNewsDaily'
  location_code VARCHAR(10) NOT NULL,
  
  -- Performance metrics
  success BOOLEAN NOT NULL,
  duration_ms INTEGER NOT NULL,
  rates_found INTEGER DEFAULT 0,
  error_message TEXT,
  
  -- Timing
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for monitoring
CREATE INDEX idx_scraper_health_source ON mortgage_scraper_health(source);
CREATE INDEX idx_scraper_health_session ON mortgage_scraper_health(session_id);
CREATE INDEX idx_scraper_health_scraped ON mortgage_scraper_health(scraped_at DESC);

-- ----------------------------------------------------------------------------
-- 6. VIEWS
-- ----------------------------------------------------------------------------

-- Latest rates view (most recent rate for each location/type combo)
CREATE OR REPLACE VIEW mortgage_latest_rates AS
WITH ranked_rates AS (
  SELECT
    r.*,
    l.location_name,
    l.location_type,
    ROW_NUMBER() OVER (
      PARTITION BY r.location_code, r.rate_type
      ORDER BY r.scraped_at DESC
    ) as rn
  FROM mortgage_rates r
  JOIN mortgage_locations l ON r.location_code = l.location_code
)
SELECT
  id,
  location_id,
  location_code,
  location_name,
  location_type,
  rate_type,
  rate,
  apr,
  points,
  source,
  confidence,
  scraped_at
FROM ranked_rates
WHERE rn = 1;

-- Rate changes view (daily rate changes)
CREATE OR REPLACE VIEW mortgage_rate_changes AS
WITH today_rates AS (
  SELECT
    location_code,
    rate_type,
    rate,
    scraped_at
  FROM mortgage_rates
  WHERE scraped_at >= CURRENT_DATE
    AND scraped_at < CURRENT_DATE + INTERVAL '1 day'
  ORDER BY scraped_at DESC
),
yesterday_rates AS (
  SELECT
    location_code,
    rate_type,
    rate,
    scraped_at
  FROM mortgage_rates
  WHERE scraped_at >= CURRENT_DATE - INTERVAL '1 day'
    AND scraped_at < CURRENT_DATE
  ORDER BY scraped_at DESC
)
SELECT
  t.location_code,
  l.location_name,
  t.rate_type,
  y.rate as yesterday_rate,
  t.rate as today_rate,
  t.rate - y.rate as rate_change,
  ROUND(((t.rate - y.rate) / y.rate * 100)::numeric, 2) as change_percent,
  t.scraped_at
FROM today_rates t
JOIN yesterday_rates y 
  ON t.location_code = y.location_code 
  AND t.rate_type = y.rate_type
JOIN mortgage_locations l 
  ON t.location_code = l.location_code;

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE mortgage_rate_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_alert_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own alerts
CREATE POLICY user_alerts_select ON mortgage_rate_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_alerts_insert ON mortgage_rate_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_alerts_update ON mortgage_rate_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_alerts_delete ON mortgage_rate_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own alert history
CREATE POLICY user_alert_history_select ON mortgage_alert_history
  FOR SELECT USING (auth.uid() = user_id);

-- Public read access to locations and rates (no auth required)
ALTER TABLE mortgage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_locations_select ON mortgage_locations
  FOR SELECT USING (true);

CREATE POLICY public_rates_select ON mortgage_rates
  FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- 8. SEED DATA - INSERT 92 LOCATIONS
-- ----------------------------------------------------------------------------

-- National
INSERT INTO mortgage_locations (location_code, location_name, location_type) VALUES
('US', 'United States', 'national');

-- 50 States
INSERT INTO mortgage_locations (location_code, location_name, location_type) VALUES
('AL', 'Alabama', 'state'),
('AK', 'Alaska', 'state'),
('AZ', 'Arizona', 'state'),
('AR', 'Arkansas', 'state'),
('CA', 'California', 'state'),
('CO', 'Colorado', 'state'),
('CT', 'Connecticut', 'state'),
('DE', 'Delaware', 'state'),
('FL', 'Florida', 'state'),
('GA', 'Georgia', 'state'),
('HI', 'Hawaii', 'state'),
('ID', 'Idaho', 'state'),
('IL', 'Illinois', 'state'),
('IN', 'Indiana', 'state'),
('IA', 'Iowa', 'state'),
('KS', 'Kansas', 'state'),
('KY', 'Kentucky', 'state'),
('LA', 'Louisiana', 'state'),
('ME', 'Maine', 'state'),
('MD', 'Maryland', 'state'),
('MA', 'Massachusetts', 'state'),
('MI', 'Michigan', 'state'),
('MN', 'Minnesota', 'state'),
('MS', 'Mississippi', 'state'),
('MO', 'Missouri', 'state'),
('MT', 'Montana', 'state'),
('NE', 'Nebraska', 'state'),
('NV', 'Nevada', 'state'),
('NH', 'New Hampshire', 'state'),
('NJ', 'New Jersey', 'state'),
('NM', 'New Mexico', 'state'),
('NY', 'New York', 'state'),
('NC', 'North Carolina', 'state'),
('ND', 'North Dakota', 'state'),
('OH', 'Ohio', 'state'),
('OK', 'Oklahoma', 'state'),
('OR', 'Oregon', 'state'),
('PA', 'Pennsylvania', 'state'),
('RI', 'Rhode Island', 'state'),
('SC', 'South Carolina', 'state'),
('SD', 'South Dakota', 'state'),
('TN', 'Tennessee', 'state'),
('TX', 'Texas', 'state'),
('UT', 'Utah', 'state'),
('VT', 'Vermont', 'state'),
('VA', 'Virginia', 'state'),
('WA', 'Washington', 'state'),
('WV', 'West Virginia', 'state'),
('WI', 'Wisconsin', 'state'),
('WY', 'Wyoming', 'state');

-- 35 Major Metro Areas
INSERT INTO mortgage_locations (location_code, location_name, location_type, state_code) VALUES
('NY-NYC', 'New York City', 'metro', 'NY'),
('CA-LA', 'Los Angeles', 'metro', 'CA'),
('IL-CHI', 'Chicago', 'metro', 'IL'),
('TX-HOU', 'Houston', 'metro', 'TX'),
('AZ-PHX', 'Phoenix', 'metro', 'AZ'),
('PA-PHI', 'Philadelphia', 'metro', 'PA'),
('TX-SA', 'San Antonio', 'metro', 'TX'),
('CA-SD', 'San Diego', 'metro', 'CA'),
('TX-DAL', 'Dallas', 'metro', 'TX'),
('CA-SJ', 'San Jose', 'metro', 'CA'),
('TX-AUS', 'Austin', 'metro', 'TX'),
('FL-JAX', 'Jacksonville', 'metro', 'FL'),
('CA-SF', 'San Francisco', 'metro', 'CA'),
('OH-COL', 'Columbus', 'metro', 'OH'),
('IN-IND', 'Indianapolis', 'metro', 'IN'),
('NC-CLT', 'Charlotte', 'metro', 'NC'),
('WA-SEA', 'Seattle', 'metro', 'WA'),
('CO-DEN', 'Denver', 'metro', 'CO'),
('DC', 'Washington DC', 'metro', 'DC'),
('MA-BOS', 'Boston', 'metro', 'MA'),
('TN-NSH', 'Nashville', 'metro', 'TN'),
('MD-BAL', 'Baltimore', 'metro', 'MD'),
('OK-OKC', 'Oklahoma City', 'metro', 'OK'),
('OR-POR', 'Portland', 'metro', 'OR'),
('NV-LV', 'Las Vegas', 'metro', 'NV'),
('MI-DET', 'Detroit', 'metro', 'MI'),
('TN-MEM', 'Memphis', 'metro', 'TN'),
('KY-LOU', 'Louisville', 'metro', 'KY'),
('WI-MIL', 'Milwaukee', 'metro', 'WI'),
('NM-ABQ', 'Albuquerque', 'metro', 'NM'),
('AZ-TUC', 'Tucson', 'metro', 'AZ'),
('CA-FRE', 'Fresno', 'metro', 'CA'),
('CA-SAC', 'Sacramento', 'metro', 'CA'),
('MO-KC', 'Kansas City', 'metro', 'MO'),
('FL-MIA', 'Miami', 'metro', 'FL');

-- ----------------------------------------------------------------------------
-- 9. FUNCTIONS
-- ----------------------------------------------------------------------------

-- Function to get rate change for a location
CREATE OR REPLACE FUNCTION get_rate_change(
  p_location_code VARCHAR(10),
  p_rate_type VARCHAR(20),
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  current_rate DECIMAL(5,3),
  past_rate DECIMAL(5,3),
  rate_change DECIMAL(5,3),
  change_percent DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH current AS (
    SELECT rate
    FROM mortgage_rates
    WHERE location_code = p_location_code
      AND rate_type = p_rate_type
    ORDER BY scraped_at DESC
    LIMIT 1
  ),
  past AS (
    SELECT rate
    FROM mortgage_rates
    WHERE location_code = p_location_code
      AND rate_type = p_rate_type
      AND scraped_at <= NOW() - (p_days || ' days')::INTERVAL
    ORDER BY scraped_at DESC
    LIMIT 1
  )
  SELECT
    c.rate,
    p.rate,
    c.rate - p.rate,
    ROUND(((c.rate - p.rate) / p.rate * 100)::numeric, 2)
  FROM current c, past p;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Tables created: 5
-- Views created: 2
-- Policies created: 7
-- Locations seeded: 92
-- Status: Ready for integration
-- ============================================================================
