-- CR AudioViz AI - Missing Tables Migration
-- Creates all required tables for admin dashboard functionality
-- Timestamp: 2025-10-25 4:02 PM EST

-- ============================================================================
-- TABLE: user_preferences
-- Stores user preferences and settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Email preferences
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  product_updates BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  
  -- UI preferences
  theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  compact_mode BOOLEAN DEFAULT false,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one preferences record per user
  UNIQUE(user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TABLE: user_sessions
-- Tracks active user sessions for security
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  
  -- Session details
  ip_address INET,
  user_agent TEXT,
  device VARCHAR(100),
  browser VARCHAR(100),
  os VARCHAR(100),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  UNIQUE(session_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: api_keys
-- Manages API keys for user integrations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Key details
  key VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  request_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  
  UNIQUE(key)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON public.api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON public.api_keys(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own API keys" ON public.api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys" ON public.api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON public.api_keys
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: javari_config
-- Stores Javari AI configuration per user
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.javari_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Model settings
  model_name VARCHAR(50) DEFAULT 'gpt-4-turbo',
  model_version VARCHAR(20) DEFAULT '2024-04-09',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 2000,
  top_p DECIMAL(3,2) DEFAULT 1.0 CHECK (top_p >= 0 AND top_p <= 1),
  
  -- Behavior settings
  personality VARCHAR(20) DEFAULT 'professional' CHECK (personality IN ('professional', 'casual', 'creative', 'technical')),
  verbosity VARCHAR(20) DEFAULT 'balanced' CHECK (verbosity IN ('concise', 'balanced', 'detailed')),
  response_style VARCHAR(20) DEFAULT 'conversational' CHECK (response_style IN ('direct', 'conversational', 'educational')),
  include_examples BOOLEAN DEFAULT true,
  include_explanations BOOLEAN DEFAULT true,
  
  -- Feature toggles
  web_search_enabled BOOLEAN DEFAULT true,
  code_execution_enabled BOOLEAN DEFAULT true,
  image_generation_enabled BOOLEAN DEFAULT false,
  voice_response_enabled BOOLEAN DEFAULT false,
  multimodal_enabled BOOLEAN DEFAULT true,
  
  -- Limits
  daily_request_limit INTEGER DEFAULT 100,
  max_context_length INTEGER DEFAULT 8000,
  max_response_length INTEGER DEFAULT 4000,
  rate_limit_per_minute INTEGER DEFAULT 20,
  
  -- Integrations
  openai_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_javari_config_user_id ON public.javari_config(user_id);

-- Enable RLS
ALTER TABLE public.javari_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own Javari config" ON public.javari_config
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own Javari config" ON public.javari_config
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: javari_usage
-- Tracks Javari AI usage statistics
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.javari_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Request details
  conversation_id UUID,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  
  -- Performance
  response_time INTEGER, -- milliseconds
  status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_javari_usage_user_id ON public.javari_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_usage_conversation_id ON public.javari_usage(conversation_id);
CREATE INDEX IF NOT EXISTS idx_javari_usage_created_at ON public.javari_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_javari_usage_status ON public.javari_usage(status);

-- Enable RLS
ALTER TABLE public.javari_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own Javari usage" ON public.javari_usage
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: javari_conversations
-- Stores Javari AI conversation history
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.javari_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Conversation details
  title VARCHAR(255),
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadata
  model_used VARCHAR(50),
  total_tokens INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Status
  is_archived BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_javari_conversations_user_id ON public.javari_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_conversations_created_at ON public.javari_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_javari_conversations_archived ON public.javari_conversations(is_archived) WHERE is_archived = false;

-- Enable RLS
ALTER TABLE public.javari_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own conversations" ON public.javari_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" ON public.javari_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.javari_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.javari_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: transactions
-- Tracks all financial transactions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit_purchase', 'subscription', 'refund', 'adjustment')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Payment details
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  payment_method VARCHAR(50),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Credits
  credits_amount INTEGER,
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_intent ON public.transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: credits
-- Tracks user credit balances and usage
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Balance
  balance INTEGER DEFAULT 0 CHECK (balance >= 0),
  total_purchased INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  total_bonus INTEGER DEFAULT 0,
  
  -- Subscription credits
  subscription_credits INTEGER DEFAULT 0,
  subscription_credits_reset_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON public.credits(user_id);

-- Enable RLS
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own credits" ON public.credits
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: api_usage
-- Tracks API usage for rate limiting and analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- API details
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  
  -- Request details
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  
  -- Response
  status_code INTEGER,
  response_time INTEGER, -- milliseconds
  
  -- Rate limiting
  rate_limit_remaining INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_key_id ON public.api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON public.api_usage(endpoint);

-- Enable RLS
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own API usage" ON public.api_usage
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- ADDITIONAL: Update profiles table to add missing columns
-- ============================================================================

-- Add Javari API key column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'javari_api_key') THEN
    ALTER TABLE public.profiles ADD COLUMN javari_api_key VARCHAR(255);
  END IF;
END $$;

-- Add two-factor enabled column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'two_factor_enabled') THEN
    ALTER TABLE public.profiles ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add last password change column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'last_password_change') THEN
    ALTER TABLE public.profiles ADD COLUMN last_password_change TIMESTAMPTZ;
  END IF;
END $$;

-- Add is_deleted column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'is_deleted') THEN
    ALTER TABLE public.profiles ADD COLUMN is_deleted BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add deleted_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'deleted_at') THEN
    ALTER TABLE public.profiles ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary
SELECT 'Migration completed successfully!' AS status;
SELECT 'Created tables: user_preferences, user_sessions, api_keys, javari_config, javari_usage, javari_conversations, transactions, credits, api_usage' AS created_tables;
SELECT 'Updated profiles table with additional columns' AS updated_tables;
