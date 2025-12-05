-- Support Tickets Table for Auto-Generated Error Tickets
-- Run this in Supabase SQL Editor

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  error_type VARCHAR(50) NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  page_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  browser_info TEXT,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  assigned_bot VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(50),
  auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bot_activity_log table
CREATE TABLE IF NOT EXISTS bot_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_name VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_severity ON support_tickets(severity);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON support_tickets(assigned_bot);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_activity_bot ON bot_activity_log(bot_name);
CREATE INDEX IF NOT EXISTS idx_bot_activity_timestamp ON bot_activity_log(timestamp DESC);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_activity_log ENABLE ROW LEVEL SECURITY;

-- Policies for support_tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON support_tickets
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated can insert" ON support_tickets
  FOR INSERT WITH CHECK (true);

-- Policies for bot_activity_log  
CREATE POLICY "Anyone can view bot activity" ON bot_activity_log
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert" ON bot_activity_log
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Comment for documentation
COMMENT ON TABLE support_tickets IS 'Auto-generated support tickets from error boundary and monitoring systems';
COMMENT ON TABLE bot_activity_log IS 'Log of all bot actions for auditing and debugging';
