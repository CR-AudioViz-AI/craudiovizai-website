-- CR AudioViz AI - JavariAI Database Schema
-- Supports multi-provider AI conversations with autonomous learning
-- @timestamp October 28, 2025 - 11:50 AM EST

-- JavariAI Conversations Table
CREATE TABLE IF NOT EXISTS javari_conversations (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  messages JSONB NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_javari_conversations_user_id ON javari_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_conversations_created_at ON javari_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_javari_conversations_provider ON javari_conversations(provider);

-- JavariAI Usage Statistics Table
CREATE TABLE IF NOT EXISTS javari_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_javari_usage_user_id ON javari_usage_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_usage_created_at ON javari_usage_stats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_javari_usage_provider ON javari_usage_stats(provider);

-- JavariAI Learning Patterns Table (Autonomous Learning)
CREATE TABLE IF NOT EXISTS javari_learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_type TEXT NOT NULL, -- technical, creative, analytical, support, general
  message_count INTEGER DEFAULT 0,
  avg_message_length INTEGER DEFAULT 0,
  response_length INTEGER DEFAULT 0,
  response_quality INTEGER DEFAULT 3, -- 1-5 scale
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_efficiency DECIMAL(10, 8) DEFAULT 0, -- cost per token
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_javari_learning_user_id ON javari_learning_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_learning_type ON javari_learning_patterns(conversation_type);
CREATE INDEX IF NOT EXISTS idx_javari_learning_provider ON javari_learning_patterns(provider);

-- JavariAI Provider Performance Table (Self-Healing Analytics)
CREATE TABLE IF NOT EXISTS javari_provider_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time DECIMAL(10, 3) DEFAULT 0, -- milliseconds
  avg_tokens INTEGER DEFAULT 0,
  avg_cost DECIMAL(10, 6) DEFAULT 0,
  uptime_percentage DECIMAL(5, 2) DEFAULT 100.00,
  last_failure_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_javari_provider_model ON javari_provider_performance(provider, model);

-- Add AI credits column to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'ai_credits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ai_credits INTEGER DEFAULT 100;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_ai_usage'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_ai_usage TIMESTAMPTZ;
  END IF;
END $$;

-- Create function to update provider performance
CREATE OR REPLACE FUNCTION update_provider_performance(
  p_provider TEXT,
  p_model TEXT,
  p_success BOOLEAN,
  p_response_time DECIMAL,
  p_tokens INTEGER,
  p_cost DECIMAL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO javari_provider_performance (
    provider, 
    model, 
    total_requests, 
    successful_requests, 
    failed_requests,
    avg_response_time,
    avg_tokens,
    avg_cost,
    last_success_at,
    last_failure_at
  )
  VALUES (
    p_provider,
    p_model,
    1,
    CASE WHEN p_success THEN 1 ELSE 0 END,
    CASE WHEN p_success THEN 0 ELSE 1 END,
    p_response_time,
    p_tokens,
    p_cost,
    CASE WHEN p_success THEN NOW() ELSE NULL END,
    CASE WHEN p_success THEN NULL ELSE NOW() END
  )
  ON CONFLICT (provider, model) 
  DO UPDATE SET
    total_requests = javari_provider_performance.total_requests + 1,
    successful_requests = javari_provider_performance.successful_requests + CASE WHEN p_success THEN 1 ELSE 0 END,
    failed_requests = javari_provider_performance.failed_requests + CASE WHEN p_success THEN 0 ELSE 1 END,
    avg_response_time = (javari_provider_performance.avg_response_time * javari_provider_performance.total_requests + p_response_time) / (javari_provider_performance.total_requests + 1),
    avg_tokens = (javari_provider_performance.avg_tokens * javari_provider_performance.total_requests + p_tokens) / (javari_provider_performance.total_requests + 1),
    avg_cost = (javari_provider_performance.avg_cost * javari_provider_performance.total_requests + p_cost) / (javari_provider_performance.total_requests + 1),
    uptime_percentage = (javari_provider_performance.successful_requests + CASE WHEN p_success THEN 1 ELSE 0 END)::DECIMAL / (javari_provider_performance.total_requests + 1) * 100,
    last_success_at = CASE WHEN p_success THEN NOW() ELSE javari_provider_performance.last_success_at END,
    last_failure_at = CASE WHEN p_success THEN javari_provider_performance.last_failure_at ELSE NOW() END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create view for user AI analytics
CREATE OR REPLACE VIEW javari_user_analytics AS
SELECT 
  u.user_id,
  COUNT(DISTINCT u.id) as total_conversations,
  SUM(u.total_tokens) as total_tokens_used,
  SUM(u.cost) as total_cost,
  AVG(u.total_tokens) as avg_tokens_per_conversation,
  AVG(u.cost) as avg_cost_per_conversation,
  COUNT(DISTINCT u.provider) as providers_used,
  json_object_agg(u.provider, COUNT(*)) as requests_by_provider
FROM javari_usage_stats u
GROUP BY u.user_id;

-- Row Level Security Policies
ALTER TABLE javari_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_learning_patterns ENABLE ROW LEVEL SECURITY;

-- Users can only see their own conversations
CREATE POLICY javari_conversations_user_policy ON javari_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own usage stats
CREATE POLICY javari_usage_user_policy ON javari_usage_stats
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own learning patterns
CREATE POLICY javari_learning_user_policy ON javari_learning_patterns
  FOR ALL USING (auth.uid() = user_id);

-- Everyone can read provider performance (public stats)
CREATE POLICY javari_provider_read_policy ON javari_provider_performance
  FOR SELECT USING (true);

COMMENT ON TABLE javari_conversations IS 'Stores all JavariAI conversation history with multi-provider support';
COMMENT ON TABLE javari_usage_stats IS 'Tracks detailed usage statistics per AI provider and model';
COMMENT ON TABLE javari_learning_patterns IS 'Autonomous learning system tracking conversation patterns for optimization';
COMMENT ON TABLE javari_provider_performance IS 'Real-time provider performance metrics for self-healing fallback decisions';
