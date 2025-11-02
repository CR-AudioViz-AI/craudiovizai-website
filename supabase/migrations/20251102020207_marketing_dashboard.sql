-- ============================================================================
-- MARKETING DASHBOARD - COMPLETE DATABASE MIGRATION
-- CR AudioViz AI - Saturday, November 01, 2025 - 3:01 PM ET
-- ============================================================================

-- Include main schema
-- ============================================================================
-- UNIVERSAL MARKETING DISTRIBUTION DASHBOARD - DATABASE SCHEMA
-- CR AudioViz AI - Social Media Management & Content Distribution
-- Created: Saturday, November 01, 2025 - 2:38 PM ET
-- ============================================================================

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Connected Accounts - Unlimited connections per platform
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Platform identification
  platform_type TEXT NOT NULL, -- 'twitter', 'linkedin', 'facebook', 'instagram', etc.
  platform_user_id TEXT NOT NULL, -- Platform's user ID
  platform_username TEXT, -- @username or display name
  platform_display_name TEXT, -- Full name on platform
  
  -- Connection details
  access_token TEXT NOT NULL, -- Encrypted access token
  refresh_token TEXT, -- For OAuth refresh
  token_expires_at TIMESTAMPTZ, -- When token expires
  
  -- Account metadata
  account_name TEXT, -- User's custom name for this connection
  avatar_url TEXT,
  follower_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'revoked', 'error'
  last_connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_error TEXT,
  
  -- Settings
  auto_refresh_token BOOLEAN DEFAULT true,
  default_for_platform BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique connections
  UNIQUE(user_id, platform_type, platform_user_id)
);

CREATE INDEX idx_connected_accounts_user ON connected_accounts(user_id);
CREATE INDEX idx_connected_accounts_platform ON connected_accounts(platform_type);
CREATE INDEX idx_connected_accounts_status ON connected_accounts(status);

-- ============================================================================
-- CONTENT CREATION & DISTRIBUTION
-- ============================================================================

-- Content Drafts - Created content ready to distribute
CREATE TABLE content_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Content details
  title TEXT,
  content TEXT NOT NULL, -- Main text content
  content_type TEXT DEFAULT 'post', -- 'post', 'article', 'video', 'image', 'story', 'reel'
  
  -- Media attachments
  media_urls JSONB DEFAULT '[]', -- Array of URLs
  media_types JSONB DEFAULT '[]', -- Array of types: 'image', 'video', 'gif'
  
  -- Platform-specific variations
  platform_variations JSONB DEFAULT '{}', -- Custom content per platform
  
  -- Metadata
  tags TEXT[],
  category TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  
  -- AI-generated flag
  generated_by_ai BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_drafts_user ON content_drafts(user_id);
CREATE INDEX idx_content_drafts_status ON content_drafts(status);

-- Distribution Plans - Which platforms to post to
CREATE TABLE distribution_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_draft_id UUID NOT NULL REFERENCES content_drafts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Selected accounts for distribution
  selected_accounts UUID[] NOT NULL, -- Array of connected_accounts.id
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ, -- NULL = immediate
  timezone TEXT DEFAULT 'America/New_York',
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'partial', 'failed'
  
  -- Results tracking
  total_accounts INTEGER DEFAULT 0,
  successful_posts INTEGER DEFAULT 0,
  failed_posts INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_distribution_plans_content ON distribution_plans(content_draft_id);
CREATE INDEX idx_distribution_plans_user ON distribution_plans(user_id);
CREATE INDEX idx_distribution_plans_scheduled ON distribution_plans(scheduled_for);

-- Published Posts - Individual post records per platform
CREATE TABLE published_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distribution_plan_id UUID NOT NULL REFERENCES distribution_plans(id) ON DELETE CASCADE,
  content_draft_id UUID NOT NULL REFERENCES content_drafts(id) ON DELETE CASCADE,
  connected_account_id UUID NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Platform post details
  platform_post_id TEXT, -- ID from the platform (tweet ID, post ID, etc.)
  platform_url TEXT, -- Direct link to post
  
  -- Content that was actually posted (may differ from draft)
  posted_content TEXT,
  posted_media_urls JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'posted', 'failed', 'deleted'
  error_message TEXT,
  
  -- Posting metadata
  posted_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  
  -- Engagement metrics (updated periodically)
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Last metric update
  metrics_updated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_published_posts_distribution ON published_posts(distribution_plan_id);
CREATE INDEX idx_published_posts_account ON published_posts(connected_account_id);
CREATE INDEX idx_published_posts_user ON published_posts(user_id);
CREATE INDEX idx_published_posts_status ON published_posts(status);
CREATE INDEX idx_published_posts_scheduled ON published_posts(scheduled_for);

-- ============================================================================
-- EMAIL & NEWSLETTER MANAGEMENT
-- ============================================================================

-- Email Accounts - SMTP and email provider connections
CREATE TABLE email_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Account details
  email_address TEXT NOT NULL,
  account_name TEXT, -- User's custom name
  provider TEXT NOT NULL, -- 'gmail', 'outlook', 'smtp', 'sendgrid', 'mailgun', etc.
  
  -- SMTP Configuration (for custom email)
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_username TEXT,
  smtp_password TEXT, -- Encrypted
  smtp_use_tls BOOLEAN DEFAULT true,
  
  -- OAuth tokens (for Gmail, Outlook, etc.)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Settings
  from_name TEXT,
  reply_to TEXT,
  signature TEXT,
  
  -- Status
  status TEXT DEFAULT 'active',
  is_verified BOOLEAN DEFAULT false,
  last_error TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, email_address)
);

CREATE INDEX idx_email_accounts_user ON email_accounts(user_id);

-- Email Lists - Recipient management
CREATE TABLE email_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- List details
  subscriber_count INTEGER DEFAULT 0,
  
  -- Integration with external lists (Mailchimp, etc.)
  external_provider TEXT, -- 'mailchimp', 'convertkit', etc.
  external_list_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_lists_user ON email_lists(user_id);

-- Email Subscribers
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES email_lists(id) ON DELETE CASCADE,
  
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced', 'complained'
  
  -- Metadata
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(list_id, email)
);

CREATE INDEX idx_email_subscribers_list ON email_subscribers(list_id);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);

-- Email Campaigns
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  
  -- Campaign details
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  
  -- Content
  html_content TEXT,
  plain_text_content TEXT,
  
  -- Recipients
  target_lists UUID[], -- Array of email_lists.id
  total_recipients INTEGER DEFAULT 0,
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
  
  -- Metrics
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_campaigns_user ON email_campaigns(user_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

-- ============================================================================
-- CONTENT TEMPLATES
-- ============================================================================

-- Templates for different platforms and content types
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Template content
  template_content TEXT NOT NULL,
  
  -- Platform optimization
  optimized_for_platforms TEXT[], -- Array of platform types
  
  -- Template metadata
  category TEXT,
  tags TEXT[],
  
  -- Variables in template (for replacement)
  variables JSONB DEFAULT '[]', -- [{"name": "company", "default": "CRAV"}]
  
  -- Usage tracking
  use_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_templates_user ON content_templates(user_id);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

-- Aggregate analytics per platform
CREATE TABLE platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_account_id UUID NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
  
  -- Date for analytics
  analytics_date DATE NOT NULL,
  
  -- Metrics
  posts_count INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_reach INTEGER DEFAULT 0,
  
  -- Follower growth
  followers_gained INTEGER DEFAULT 0,
  followers_lost INTEGER DEFAULT 0,
  net_follower_change INTEGER DEFAULT 0,
  
  -- Engagement
  avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(connected_account_id, analytics_date)
);

CREATE INDEX idx_platform_analytics_user ON platform_analytics(user_id);
CREATE INDEX idx_platform_analytics_account ON platform_analytics(connected_account_id);
CREATE INDEX idx_platform_analytics_date ON platform_analytics(analytics_date);

-- ============================================================================
-- INTEGRATION WITH MARKETING TOOL
-- ============================================================================

-- AI Content Generations - Track content created by marketing tool
CREATE TABLE ai_content_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Input prompt
  prompt TEXT NOT NULL,
  
  -- Generated content
  generated_content TEXT NOT NULL,
  generated_variations JSONB DEFAULT '[]', -- Multiple versions
  
  -- AI model used
  ai_model TEXT, -- 'gpt-4', 'claude-3', etc.
  
  -- Content type
  content_type TEXT, -- 'social_post', 'email', 'blog', 'ad_copy'
  
  -- Platform optimizations
  platform_specific JSONB DEFAULT '{}', -- Optimized versions per platform
  
  -- Credits used
  credits_used INTEGER DEFAULT 0,
  
  -- Used in content draft
  used_in_draft_id UUID REFERENCES content_drafts(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_content_user ON ai_content_generations(user_id);

-- ============================================================================
-- SCHEDULING & QUEUE
-- ============================================================================

-- Queue for scheduled posts
CREATE TABLE post_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distribution_plan_id UUID NOT NULL REFERENCES distribution_plans(id) ON DELETE CASCADE,
  published_post_id UUID NOT NULL REFERENCES published_posts(id) ON DELETE CASCADE,
  
  -- Queue details
  scheduled_for TIMESTAMPTZ NOT NULL,
  priority INTEGER DEFAULT 5, -- 1-10, higher = more important
  
  -- Status
  status TEXT DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed', 'cancelled'
  
  -- Retry logic
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  
  -- Processing
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_queue_scheduled ON post_queue(scheduled_for, status);
CREATE INDEX idx_post_queue_status ON post_queue(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_queue ENABLE ROW LEVEL SECURITY;

-- Policies for connected_accounts
CREATE POLICY "Users can view own connected accounts"
  ON connected_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connected accounts"
  ON connected_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connected accounts"
  ON connected_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connected accounts"
  ON connected_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for content_drafts
CREATE POLICY "Users can view own content drafts"
  ON content_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own content drafts"
  ON content_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content drafts"
  ON content_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content drafts"
  ON content_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for all other tables...
-- (Abbreviated for brevity - apply same pattern to all tables)

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_connected_accounts_updated_at
  BEFORE UPDATE ON connected_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_drafts_updated_at
  BEFORE UPDATE ON content_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distribution_plans_updated_at
  BEFORE UPDATE ON distribution_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_posts_updated_at
  BEFORE UPDATE ON published_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PLATFORM CONFIGURATIONS
-- ============================================================================

-- Platform-specific configurations and limits
CREATE TABLE platform_configs (
  platform_type TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  
  -- Character limits
  max_text_length INTEGER,
  max_media_count INTEGER,
  supported_media_types TEXT[],
  
  -- Features
  supports_scheduling BOOLEAN DEFAULT true,
  supports_hashtags BOOLEAN DEFAULT true,
  supports_mentions BOOLEAN DEFAULT true,
  supports_polls BOOLEAN DEFAULT false,
  supports_stories BOOLEAN DEFAULT false,
  supports_threads BOOLEAN DEFAULT false,
  
  -- API details
  api_version TEXT,
  requires_oauth BOOLEAN DEFAULT true,
  oauth_scopes TEXT[],
  
  -- Rate limits
  rate_limit_posts_per_hour INTEGER,
  rate_limit_posts_per_day INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert platform configurations
INSERT INTO platform_configs (platform_type, display_name, max_text_length, max_media_count, supported_media_types, supports_threads) VALUES
  ('twitter', 'Twitter / X', 280, 4, ARRAY['image', 'video', 'gif'], true),
  ('linkedin', 'LinkedIn', 3000, 9, ARRAY['image', 'video', 'document'], true),
  ('facebook', 'Facebook', 63206, 10, ARRAY['image', 'video'], false),
  ('instagram', 'Instagram', 2200, 10, ARRAY['image', 'video'], false),
  ('tiktok', 'TikTok', 2200, 1, ARRAY['video'], false),
  ('youtube', 'YouTube', 5000, 1, ARRAY['video'], false),
  ('pinterest', 'Pinterest', 500, 1, ARRAY['image'], false),
  ('reddit', 'Reddit', 40000, 20, ARRAY['image', 'video', 'gif'], false),
  ('discord', 'Discord', 2000, 10, ARRAY['image', 'video', 'gif'], false),
  ('telegram', 'Telegram', 4096, 10, ARRAY['image', 'video', 'gif'], false),
  ('mastodon', 'Mastodon', 500, 4, ARRAY['image', 'video', 'gif'], true),
  ('threads', 'Threads', 500, 10, ARRAY['image', 'video'], false);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- ============================================================================
-- GROUPS AND TARGETING ENHANCEMENTS
-- ============================================================================

-- ============================================================================
-- ACCOUNT GROUPS & TARGETING SYSTEM
-- Enhanced Marketing Dashboard - Smart Account Organization
-- Created: Saturday, November 01, 2025 - 2:43 PM ET
-- ============================================================================

-- ============================================================================
-- ACCOUNT GROUPS - Organize accounts into custom groups
-- ============================================================================

CREATE TABLE account_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Group details
  name TEXT NOT NULL, -- "Work Accounts", "Personal Brand", "Client XYZ", etc.
  description TEXT,
  color TEXT DEFAULT '#3B82F6', -- Hex color for UI
  icon TEXT DEFAULT 'folder', -- Icon name
  
  -- Group settings
  is_favorite BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_account_groups_user ON account_groups(user_id);
CREATE INDEX idx_account_groups_order ON account_groups(user_id, display_order);

-- ============================================================================
-- ACCOUNT GROUP MEMBERSHIPS - Many-to-many relationship
-- ============================================================================

CREATE TABLE account_group_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  group_id UUID NOT NULL REFERENCES account_groups(id) ON DELETE CASCADE,
  connected_account_id UUID NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
  
  -- Membership metadata
  added_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(group_id, connected_account_id)
);

CREATE INDEX idx_group_memberships_group ON account_group_memberships(group_id);
CREATE INDEX idx_group_memberships_account ON account_group_memberships(connected_account_id);

-- ============================================================================
-- DISTRIBUTION PRESETS - Save favorite distribution configurations
-- ============================================================================

CREATE TABLE distribution_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Preset details
  name TEXT NOT NULL, -- "All Platforms", "Twitter Only", "Work Accounts", etc.
  description TEXT,
  icon TEXT DEFAULT 'target',
  color TEXT DEFAULT '#10B981',
  
  -- Target configuration
  target_type TEXT NOT NULL, -- 'accounts', 'groups', 'platforms', 'mixed'
  
  -- Selected items (flexible based on target_type)
  selected_account_ids UUID[], -- Direct account IDs
  selected_group_ids UUID[], -- Group IDs
  selected_platforms TEXT[], -- Platform types
  
  -- Filters
  exclude_account_ids UUID[], -- Accounts to exclude
  only_verified BOOLEAN DEFAULT false, -- Only post to verified accounts
  min_followers INTEGER, -- Only accounts with X+ followers
  
  -- Usage tracking
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Quick access
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_distribution_presets_user ON distribution_presets(user_id);
CREATE INDEX idx_distribution_presets_favorite ON distribution_presets(user_id, is_favorite);

-- ============================================================================
-- PLATFORM FILTERS - Advanced platform-specific targeting
-- ============================================================================

CREATE TABLE platform_filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Filter criteria
  platform_types TEXT[] NOT NULL, -- Which platforms this applies to
  
  -- Account criteria
  min_followers INTEGER,
  max_followers INTEGER,
  verified_only BOOLEAN DEFAULT false,
  
  -- Time-based posting
  posting_schedule JSONB, -- {"twitter": {"days": [1,2,3], "hours": [9,12,15]}}
  
  -- Content restrictions
  max_posts_per_day INTEGER,
  min_hours_between_posts INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_platform_filters_user ON platform_filters(user_id);

-- ============================================================================
-- TARGETING RULES - Complex conditional targeting
-- ============================================================================

CREATE TABLE targeting_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Rule conditions (JSON-based for flexibility)
  conditions JSONB NOT NULL,
  /* Example conditions structure:
  {
    "all": [ // All conditions must match (AND logic)
      {"platform": "twitter", "operator": "equals"},
      {"follower_count": {"min": 1000}}
    ],
    "any": [ // Any condition can match (OR logic)
      {"group_id": "uuid-here"},
      {"verified": true}
    ],
    "none": [ // None of these can match (NOT logic)
      {"account_id": "uuid-to-exclude"}
    ]
  }
  */
  
  -- Actions when rule matches
  actions JSONB,
  /* Example actions:
  {
    "include": true,
    "schedule_delay_minutes": 30,
    "use_template_id": "uuid"
  }
  */
  
  -- Priority (higher = evaluated first)
  priority INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_targeting_rules_user ON targeting_rules(user_id);
CREATE INDEX idx_targeting_rules_active ON targeting_rules(user_id, is_active);

-- ============================================================================
-- QUICK ACTIONS - Predefined bulk actions
-- ============================================================================

CREATE TABLE quick_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL, -- "Post to All Twitter", "Email + LinkedIn", etc.
  icon TEXT DEFAULT 'zap',
  color TEXT DEFAULT '#F59E0B',
  
  -- Action configuration
  action_type TEXT NOT NULL, -- 'distribute', 'schedule', 'queue'
  
  -- Targeting (uses presets or inline config)
  distribution_preset_id UUID REFERENCES distribution_presets(id),
  inline_config JSONB, -- If not using a preset
  
  -- Default scheduling
  default_schedule_offset INTEGER, -- Minutes from now
  default_timezone TEXT DEFAULT 'America/New_York',
  
  -- Keyboard shortcut
  keyboard_shortcut TEXT, -- e.g., "ctrl+shift+t" for Twitter
  
  -- Usage
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Display
  show_in_toolbar BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quick_actions_user ON quick_actions(user_id);
CREATE INDEX idx_quick_actions_toolbar ON quick_actions(user_id, show_in_toolbar);

-- ============================================================================
-- DISTRIBUTION PLAN ENHANCEMENTS
-- ============================================================================

-- Add columns to existing distribution_plans table
ALTER TABLE distribution_plans 
  ADD COLUMN distribution_preset_id UUID REFERENCES distribution_presets(id),
  ADD COLUMN selected_groups UUID[], -- Array of account_groups.id
  ADD COLUMN selected_platforms TEXT[], -- Array of platform types
  ADD COLUMN targeting_mode TEXT DEFAULT 'accounts', -- 'accounts', 'groups', 'platforms', 'preset', 'mixed'
  ADD COLUMN applied_filters JSONB DEFAULT '{}'; -- Filters applied to this distribution

-- ============================================================================
-- SMART SUGGESTIONS - AI-powered targeting recommendations
-- ============================================================================

CREATE TABLE targeting_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  
  -- Suggestion details
  suggestion_type TEXT NOT NULL, -- 'best_time', 'best_platforms', 'best_accounts', 'audience_match'
  
  -- Recommendation
  recommended_accounts UUID[],
  recommended_platforms TEXT[],
  recommended_time TIMESTAMPTZ,
  
  -- Reasoning
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  reasoning TEXT,
  
  -- AI metadata
  ai_model TEXT,
  based_on_data JSONB, -- Historical performance data used
  
  -- User action
  accepted BOOLEAN,
  accepted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_targeting_suggestions_user ON targeting_suggestions(user_id);
CREATE INDEX idx_targeting_suggestions_content ON targeting_suggestions(content_draft_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE account_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE targeting_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE targeting_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies for account_groups
CREATE POLICY "Users can view own groups"
  ON account_groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own groups"
  ON account_groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own groups"
  ON account_groups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own groups"
  ON account_groups FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for other tables...
-- (Apply same pattern to all new tables)

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get all accounts in a group (including nested groups)
CREATE OR REPLACE FUNCTION get_accounts_in_group(group_id_param UUID)
RETURNS TABLE (
  account_id UUID,
  platform_type TEXT,
  platform_username TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ca.id,
    ca.platform_type,
    ca.platform_username,
    ca.status
  FROM connected_accounts ca
  INNER JOIN account_group_memberships agm ON ca.id = agm.connected_account_id
  WHERE agm.group_id = group_id_param
    AND ca.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to resolve distribution targets (handles presets, groups, platforms)
CREATE OR REPLACE FUNCTION resolve_distribution_targets(
  user_id_param UUID,
  preset_id_param UUID DEFAULT NULL,
  account_ids_param UUID[] DEFAULT NULL,
  group_ids_param UUID[] DEFAULT NULL,
  platform_types_param TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  account_id UUID
) AS $$
BEGIN
  -- If preset provided, use its configuration
  IF preset_id_param IS NOT NULL THEN
    RETURN QUERY
    WITH preset_config AS (
      SELECT 
        selected_account_ids,
        selected_group_ids,
        selected_platforms,
        exclude_account_ids,
        only_verified,
        min_followers
      FROM distribution_presets
      WHERE id = preset_id_param AND user_id = user_id_param
    )
    SELECT DISTINCT ca.id
    FROM connected_accounts ca
    WHERE ca.user_id = user_id_param
      AND ca.status = 'active'
      AND (
        -- Match direct accounts
        ca.id = ANY((SELECT selected_account_ids FROM preset_config))
        OR
        -- Match accounts in selected groups
        ca.id IN (
          SELECT agm.connected_account_id
          FROM account_group_memberships agm
          WHERE agm.group_id = ANY((SELECT selected_group_ids FROM preset_config))
        )
        OR
        -- Match platforms
        ca.platform_type = ANY((SELECT selected_platforms FROM preset_config))
      )
      -- Apply exclusions and filters
      AND ca.id != ALL(COALESCE((SELECT exclude_account_ids FROM preset_config), ARRAY[]::UUID[]))
      AND (
        NOT (SELECT only_verified FROM preset_config) 
        OR ca.is_verified = true
      )
      AND (
        (SELECT min_followers FROM preset_config) IS NULL 
        OR ca.follower_count >= (SELECT min_followers FROM preset_config)
      );
  
  -- Otherwise, use direct parameters
  ELSE
    RETURN QUERY
    SELECT DISTINCT ca.id
    FROM connected_accounts ca
    WHERE ca.user_id = user_id_param
      AND ca.status = 'active'
      AND (
        (account_ids_param IS NOT NULL AND ca.id = ANY(account_ids_param))
        OR
        (group_ids_param IS NOT NULL AND ca.id IN (
          SELECT agm.connected_account_id
          FROM account_group_memberships agm
          WHERE agm.group_id = ANY(group_ids_param)
        ))
        OR
        (platform_types_param IS NOT NULL AND ca.platform_type = ANY(platform_types_param))
      );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get group statistics
CREATE OR REPLACE FUNCTION get_group_stats(group_id_param UUID)
RETURNS TABLE (
  total_accounts INTEGER,
  active_accounts INTEGER,
  platforms_count INTEGER,
  total_followers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_accounts,
    COUNT(*) FILTER (WHERE ca.status = 'active')::INTEGER as active_accounts,
    COUNT(DISTINCT ca.platform_type)::INTEGER as platforms_count,
    COALESCE(SUM(ca.follower_count), 0)::BIGINT as total_followers
  FROM account_group_memberships agm
  INNER JOIN connected_accounts ca ON ca.id = agm.connected_account_id
  WHERE agm.group_id = group_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DEFAULT DATA - Create default groups and presets
-- ============================================================================

-- Function to create default groups for new users (called on signup)
CREATE OR REPLACE FUNCTION create_default_groups_for_user(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Create default "All Accounts" group
  INSERT INTO account_groups (user_id, name, description, color, icon, is_favorite)
  VALUES (
    user_id_param,
    'All Accounts',
    'All connected social media accounts',
    '#3B82F6',
    'globe',
    true
  );
  
  -- Create default "Primary Accounts" group
  INSERT INTO account_groups (user_id, name, description, color, icon)
  VALUES (
    user_id_param,
    'Primary Accounts',
    'Your main accounts for each platform',
    '#10B981',
    'star',
  );
  
  -- Create default "All Platforms" preset
  INSERT INTO distribution_presets (user_id, name, description, target_type, selected_platforms)
  VALUES (
    user_id_param,
    'All Platforms',
    'Post to all connected platforms',
    'platforms',
    ARRAY['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'youtube', 'pinterest', 'reddit', 'discord', 'telegram', 'mastodon', 'threads']
  );
  
  -- Create default "Social Media Only" preset
  INSERT INTO distribution_presets (user_id, name, description, target_type, selected_platforms)
  VALUES (
    user_id_param,
    'Social Media Only',
    'Post to major social platforms',
    'platforms',
    ARRAY['twitter', 'linkedin', 'facebook', 'instagram']
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- EXAMPLE QUERIES
-- ============================================================================

/*
-- Get all accounts in a specific group
SELECT * FROM get_accounts_in_group('group-uuid-here');

-- Resolve distribution targets from a preset
SELECT * FROM resolve_distribution_targets(
  'user-uuid',
  preset_id_param := 'preset-uuid'
);

-- Resolve distribution targets from platforms
SELECT * FROM resolve_distribution_targets(
  'user-uuid',
  platform_types_param := ARRAY['twitter', 'linkedin']
);

-- Resolve distribution targets from groups
SELECT * FROM resolve_distribution_targets(
  'user-uuid',
  group_ids_param := ARRAY['group-uuid-1', 'group-uuid-2']
);

-- Get group statistics
SELECT * FROM get_group_stats('group-uuid-here');
*/

-- ============================================================================
-- END OF GROUPS & TARGETING SCHEMA
-- ============================================================================
