-- ============================================================================
-- JAVARI CORE PRINCIPLES - DATABASE SCHEMA
-- Version: 1.0
-- Created: November 1, 2025
-- Purpose: Support all 10 core principles with production-grade infrastructure
-- ============================================================================

-- ============================================================================
-- PRINCIPLE 10: RESPONSE MODE FLEXIBILITY
-- ============================================================================

-- Customer preferences including Javari response mode
CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Response mode settings
    javari_response_mode TEXT NOT NULL DEFAULT 'balanced' CHECK (javari_response_mode IN ('concise', 'balanced', 'conversational')),
    
    -- Other preferences
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- ============================================================================
-- PRINCIPLE 5: UNIVERSAL AUTO-SAVE SYSTEM
-- ============================================================================

-- Projects for organizing customer work
CREATE TABLE IF NOT EXISTS customer_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset types enumeration
CREATE TYPE asset_type AS ENUM (
    'app',
    'game', 
    'tool',
    'document',
    'media_image',
    'media_video',
    'media_audio',
    'data',
    'script',
    'config'
);

-- Customer assets with auto-save metadata
CREATE TABLE IF NOT EXISTS customer_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES customer_projects(id) ON DELETE CASCADE,
    
    -- Asset metadata
    name TEXT NOT NULL,
    description TEXT,
    asset_type asset_type NOT NULL,
    file_path TEXT, -- Cloud storage path
    file_size BIGINT, -- Bytes
    file_extension TEXT,
    
    -- Version tracking
    version_number INTEGER DEFAULT 1,
    is_latest_version BOOLEAN DEFAULT true,
    parent_asset_id UUID REFERENCES customer_assets(id),
    
    -- Search and organization
    tags TEXT[], -- Array of tags for searchability
    search_keywords TEXT[], -- Additional search terms
    
    -- Auto-save tracking
    auto_saved BOOLEAN DEFAULT true,
    save_trigger TEXT, -- 'manual', 'auto', 'scheduled'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset version history
CREATE TABLE IF NOT EXISTS asset_version_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES customer_assets(id) ON DELETE CASCADE,
    
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    change_description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- PRINCIPLE 4: COMPREHENSIVE AUTO-DOCUMENTATION
-- ============================================================================

-- Documentation types
CREATE TYPE doc_type AS ENUM (
    'api',
    'component',
    'schema',
    'deployment',
    'troubleshooting',
    'architecture',
    'changelog'
);

-- Auto-generated documentation
CREATE TABLE IF NOT EXISTS auto_documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES customer_projects(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES customer_assets(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    doc_type doc_type NOT NULL,
    content TEXT NOT NULL, -- Markdown format
    file_path TEXT, -- Storage path if saved as file
    
    -- Versioning
    version TEXT DEFAULT '1.0',
    
    -- Metadata
    tags TEXT[],
    related_doc_ids UUID[], -- Links to related documentation
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRINCIPLE 6: SECRETS VAULT MANAGEMENT
-- ============================================================================

-- Credential types
CREATE TYPE credential_type AS ENUM (
    'api_key',
    'oauth_token',
    'database_credential',
    'encryption_key',
    'access_token',
    'personal_access_token',
    'other'
);

-- Encrypted secrets vault
CREATE TABLE IF NOT EXISTS customer_secrets_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES customer_projects(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL, -- User-friendly name
    credential_type credential_type NOT NULL,
    
    -- Encrypted value (encrypted at application layer before storage)
    encrypted_value TEXT NOT NULL,
    encryption_key_id TEXT NOT NULL, -- Reference to encryption key used
    
    -- Metadata
    description TEXT,
    service_name TEXT, -- e.g., 'GitHub', 'Stripe', 'OpenAI'
    expires_at TIMESTAMPTZ, -- For credentials with expiration
    
    -- Access tracking
    last_accessed_at TIMESTAMPTZ,
    access_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, project_id, name)
);

-- Secrets access audit log
CREATE TABLE IF NOT EXISTS secrets_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_id UUID NOT NULL REFERENCES customer_secrets_vault(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    access_type TEXT NOT NULL CHECK (access_type IN ('read', 'create', 'update', 'delete')),
    accessed_by TEXT, -- 'user', 'javari', 'system'
    ip_address TEXT,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRINCIPLE 7: PERSONAL TOUCH & RELATIONSHIP BUILDING
-- ============================================================================

-- Important dates for customers
CREATE TABLE IF NOT EXISTS customer_important_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    date_type TEXT NOT NULL CHECK (date_type IN ('birthday', 'work_anniversary', 'company_founding', 'project_launch', 'milestone', 'holiday')),
    date_value DATE NOT NULL,
    
    -- Display settings
    title TEXT NOT NULL, -- e.g., "Roy's Birthday"
    description TEXT,
    send_reminder BOOLEAN DEFAULT true,
    reminder_days_before INTEGER DEFAULT 0, -- 0 = on the day
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT true, -- Annual recurrence
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRINCIPLE 8: ERROR ACCOUNTABILITY & AUTO-CREDITS
-- ============================================================================

-- Error types
CREATE TYPE error_source AS ENUM (
    'javari_code',
    'javari_guidance',
    'javari_hallucination',
    'javari_automation',
    'system_error',
    'infrastructure',
    'customer_input',
    'third_party'
);

-- Error tracking and accountability
CREATE TABLE IF NOT EXISTS error_accountability_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Error details
    error_source error_source NOT NULL,
    error_description TEXT NOT NULL,
    error_context JSONB, -- Additional context
    
    -- Fault determination
    is_javari_fault BOOLEAN NOT NULL,
    fault_reasoning TEXT NOT NULL, -- Why it's Javari's fault or not
    
    -- Credit processing
    credit_issued BOOLEAN DEFAULT false,
    credit_amount INTEGER, -- Credits issued
    credit_processed_at TIMESTAMPTZ,
    
    -- Customer notification
    customer_notified BOOLEAN DEFAULT false,
    notification_sent_at TIMESTAMPTZ,
    
    -- Related entities
    conversation_id UUID, -- Link to conversation where error occurred
    task_id UUID, -- Link to task if applicable
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Auto-credits ledger
CREATE TABLE IF NOT EXISTS customer_credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'credit', 'debit', 'refund', 'error_credit')),
    amount INTEGER NOT NULL, -- Positive for additions, negative for deductions
    
    -- Transaction details
    description TEXT NOT NULL,
    reference_id UUID, -- Links to error_log, purchase, etc.
    
    -- Balance tracking
    balance_after INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRINCIPLE 9: FULL TRANSPARENCY
-- ============================================================================

-- Task status tracking for transparency
CREATE TABLE IF NOT EXISTS javari_task_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    task_description TEXT NOT NULL,
    task_type TEXT, -- 'code_generation', 'api_call', 'deployment', etc.
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Transparency details
    estimated_duration_seconds INTEGER,
    actual_duration_seconds INTEGER,
    confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100), -- Javari's confidence
    
    -- Cost transparency
    estimated_token_cost INTEGER,
    actual_token_cost INTEGER,
    
    -- Results
    result_summary TEXT,
    error_message TEXT,
    
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Customer preferences indexes
CREATE INDEX IF NOT EXISTS idx_customer_preferences_user ON customer_preferences(user_id);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user ON customer_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON customer_projects(status);

-- Assets indexes
CREATE INDEX IF NOT EXISTS idx_assets_user ON customer_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON customer_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON customer_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_tags ON customer_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_assets_keywords ON customer_assets USING GIN(search_keywords);
CREATE INDEX IF NOT EXISTS idx_assets_created ON customer_assets(created_at DESC);

-- Documentation indexes
CREATE INDEX IF NOT EXISTS idx_docs_user ON auto_documentation(user_id);
CREATE INDEX IF NOT EXISTS idx_docs_project ON auto_documentation(project_id);
CREATE INDEX IF NOT EXISTS idx_docs_type ON auto_documentation(doc_type);
CREATE INDEX IF NOT EXISTS idx_docs_tags ON auto_documentation USING GIN(tags);

-- Secrets vault indexes
CREATE INDEX IF NOT EXISTS idx_secrets_user ON customer_secrets_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_secrets_project ON customer_secrets_vault(project_id);
CREATE INDEX IF NOT EXISTS idx_secrets_service ON customer_secrets_vault(service_name);
CREATE INDEX IF NOT EXISTS idx_secrets_expires ON customer_secrets_vault(expires_at);

-- Important dates indexes
CREATE INDEX IF NOT EXISTS idx_dates_user ON customer_important_dates(user_id);
CREATE INDEX IF NOT EXISTS idx_dates_value ON customer_important_dates(date_value);
CREATE INDEX IF NOT EXISTS idx_dates_reminder ON customer_important_dates(send_reminder) WHERE send_reminder = true;

-- Error log indexes
CREATE INDEX IF NOT EXISTS idx_errors_user ON error_accountability_log(user_id);
CREATE INDEX IF NOT EXISTS idx_errors_source ON error_accountability_log(error_source);
CREATE INDEX IF NOT EXISTS idx_errors_fault ON error_accountability_log(is_javari_fault) WHERE is_javari_fault = true;
CREATE INDEX IF NOT EXISTS idx_errors_created ON error_accountability_log(created_at DESC);

-- Credit ledger indexes
CREATE INDEX IF NOT EXISTS idx_credits_user ON customer_credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_type ON customer_credit_ledger(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credits_created ON customer_credit_ledger(created_at DESC);

-- Task log indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user ON javari_task_log(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON javari_task_log(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON javari_task_log(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_version_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_secrets_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE secrets_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_important_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_accountability_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_task_log ENABLE ROW LEVEL SECURITY;

-- Customer preferences policies
CREATE POLICY "Users can view own preferences" ON customer_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON customer_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON customer_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON customer_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON customer_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON customer_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON customer_projects FOR DELETE USING (auth.uid() = user_id);

-- Assets policies
CREATE POLICY "Users can view own assets" ON customer_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assets" ON customer_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assets" ON customer_assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assets" ON customer_assets FOR DELETE USING (auth.uid() = user_id);

-- Asset version history policies
CREATE POLICY "Users can view own asset versions" ON asset_version_history FOR SELECT 
    USING (EXISTS (SELECT 1 FROM customer_assets WHERE id = asset_version_history.asset_id AND user_id = auth.uid()));
CREATE POLICY "Users can create asset versions" ON asset_version_history FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM customer_assets WHERE id = asset_version_history.asset_id AND user_id = auth.uid()));

-- Documentation policies
CREATE POLICY "Users can view own docs" ON auto_documentation FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own docs" ON auto_documentation FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own docs" ON auto_documentation FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own docs" ON auto_documentation FOR DELETE USING (auth.uid() = user_id);

-- Secrets vault policies (extra security - users can only see their own)
CREATE POLICY "Users can view own secrets" ON customer_secrets_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own secrets" ON customer_secrets_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own secrets" ON customer_secrets_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own secrets" ON customer_secrets_vault FOR DELETE USING (auth.uid() = user_id);

-- Secrets access log policies (read-only for users)
CREATE POLICY "Users can view own secret access logs" ON secrets_access_log FOR SELECT 
    USING (EXISTS (SELECT 1 FROM customer_secrets_vault WHERE id = secrets_access_log.secret_id AND user_id = auth.uid()));

-- Important dates policies
CREATE POLICY "Users can view own dates" ON customer_important_dates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own dates" ON customer_important_dates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dates" ON customer_important_dates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dates" ON customer_important_dates FOR DELETE USING (auth.uid() = user_id);

-- Error log policies (read-only for users)
CREATE POLICY "Users can view own error logs" ON error_accountability_log FOR SELECT USING (auth.uid() = user_id);

-- Credit ledger policies (read-only for users)
CREATE POLICY "Users can view own credits" ON customer_credit_ledger FOR SELECT USING (auth.uid() = user_id);

-- Task log policies (read-only for users)
CREATE POLICY "Users can view own tasks" ON javari_task_log FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_preferences_updated_at BEFORE UPDATE ON customer_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_projects_updated_at BEFORE UPDATE ON customer_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_assets_updated_at BEFORE UPDATE ON customer_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auto_documentation_updated_at BEFORE UPDATE ON auto_documentation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_secrets_vault_updated_at BEFORE UPDATE ON customer_secrets_vault FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_important_dates_updated_at BEFORE UPDATE ON customer_important_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA / DEFAULTS
-- ============================================================================

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO customer_preferences (user_id, javari_response_mode)
    VALUES (NEW.id, 'balanced')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create preferences when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_preferences();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

COMMENT ON TABLE customer_preferences IS 'Stores user preferences including Javari response mode (Principle 10)';
COMMENT ON TABLE customer_projects IS 'Project organization for customer work (Principle 5)';
COMMENT ON TABLE customer_assets IS 'Universal auto-save system for all customer-created content (Principle 5)';
COMMENT ON TABLE asset_version_history IS 'Version tracking for customer assets (Principle 5)';
COMMENT ON TABLE auto_documentation IS 'Auto-generated documentation for everything built (Principle 4)';
COMMENT ON TABLE customer_secrets_vault IS 'Encrypted secrets storage with audit trail (Principle 6)';
COMMENT ON TABLE secrets_access_log IS 'Audit log for all secret access (Principle 6)';
COMMENT ON TABLE customer_important_dates IS 'Personal dates for relationship building (Principle 7)';
COMMENT ON TABLE error_accountability_log IS 'Error tracking and accountability determination (Principle 8)';
COMMENT ON TABLE customer_credit_ledger IS 'Credit transaction history including auto-credits (Principle 8)';
COMMENT ON TABLE javari_task_log IS 'Task tracking for full transparency (Principle 9)';
