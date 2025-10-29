-- CR AudioViz AI - JavariAI Enhanced Database Schema
-- Adds memory system, file uploads, tool calling, and streaming support
-- @timestamp October 28, 2025 - 12:22 PM EST

-- JavariAI User Memory Table (Persistent memory across sessions)
CREATE TABLE IF NOT EXISTS javari_user_memory (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{
    "preferred_provider": "openai",
    "preferred_model": "gpt-4-turbo",
    "temperature": 0.7,
    "max_tokens": 2000,
    "tone": "professional",
    "response_length": "balanced",
    "code_style": "commented",
    "language_preference": "en"
  }'::jsonb,
  project_context JSONB DEFAULT '{
    "current_projects": [],
    "active_workflows": [],
    "recent_tools_used": [],
    "common_tasks": [],
    "skills_level": {}
  }'::jsonb,
  learning_data JSONB DEFAULT '{
    "successful_patterns": [],
    "failed_attempts": [],
    "feedback_history": [],
    "improvement_areas": [],
    "cost_preferences": {"optimize_for": "balance"}
  }'::jsonb,
  interaction_history JSONB DEFAULT '{
    "total_conversations": 0,
    "favorite_topics": [],
    "common_questions": [],
    "time_patterns": {},
    "productivity_insights": []
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for memory table
CREATE INDEX IF NOT EXISTS idx_javari_memory_user_id ON javari_user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_memory_updated ON javari_user_memory(last_updated DESC);

-- JavariAI File Uploads Table
CREATE TABLE IF NOT EXISTS javari_file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- document, image, code, audio, video
  file_size INTEGER NOT NULL,
  file_extension TEXT NOT NULL,
  analysis_result JSONB,
  storage_path TEXT, -- Optional: S3/Supabase storage path
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for file uploads
CREATE INDEX IF NOT EXISTS idx_javari_uploads_user_id ON javari_file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_uploads_type ON javari_file_uploads(file_type);
CREATE INDEX IF NOT EXISTS idx_javari_uploads_created ON javari_file_uploads(created_at DESC);

-- JavariAI Tool Executions Table
CREATE TABLE IF NOT EXISTS javari_tool_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_parameters JSONB NOT NULL,
  execution_result JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Add indexes for tool executions
CREATE INDEX IF NOT EXISTS idx_javari_tools_user_id ON javari_tool_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_tools_conversation ON javari_tool_executions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_javari_tools_status ON javari_tool_executions(status);
CREATE INDEX IF NOT EXISTS idx_javari_tools_created ON javari_tool_executions(created_at DESC);

-- JavariAI Prompt Templates Table
CREATE TABLE IF NOT EXISTS javari_prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- content, code, marketing, planning, etc.
  description TEXT,
  prompt_text TEXT NOT NULL,
  variables TEXT[], -- Array of variable names like ['TYPE', 'PLATFORM']
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for prompt templates
CREATE INDEX IF NOT EXISTS idx_javari_templates_category ON javari_prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_javari_templates_public ON javari_prompt_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_javari_templates_rating ON javari_prompt_templates(rating DESC);

-- JavariAI User Feedback Table
CREATE TABLE IF NOT EXISTS javari_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  feedback_type TEXT, -- helpful, unhelpful, incorrect, inappropriate
  provider TEXT,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for feedback
CREATE INDEX IF NOT EXISTS idx_javari_feedback_user_id ON javari_user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_feedback_conversation ON javari_user_feedback(conversation_id);
CREATE INDEX IF NOT EXISTS idx_javari_feedback_rating ON javari_user_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_javari_feedback_created ON javari_user_feedback(created_at DESC);

-- JavariAI Streaming Sessions Table (for active streaming responses)
CREATE TABLE IF NOT EXISTS javari_streaming_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, aborted
  chunks_received INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Add indexes for streaming sessions
CREATE INDEX IF NOT EXISTS idx_javari_streaming_user_id ON javari_streaming_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_javari_streaming_status ON javari_streaming_sessions(status);
CREATE INDEX IF NOT EXISTS idx_javari_streaming_started ON javari_streaming_sessions(started_at DESC);

-- Create function to auto-update last_updated timestamp
CREATE OR REPLACE FUNCTION update_javari_memory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for memory updates
DROP TRIGGER IF EXISTS trigger_update_javari_memory_timestamp ON javari_user_memory;
CREATE TRIGGER trigger_update_javari_memory_timestamp
  BEFORE UPDATE ON javari_user_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_javari_memory_timestamp();

-- Create function to get user's personalized recommendations
CREATE OR REPLACE FUNCTION get_javari_recommendations(p_user_id UUID)
RETURNS TABLE (
  recommendation TEXT,
  category TEXT,
  priority INTEGER
) AS $$
DECLARE
  v_memory RECORD;
  v_stats RECORD;
BEGIN
  -- Get user memory and stats
  SELECT * INTO v_memory FROM javari_user_memory WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Get usage stats
  SELECT 
    COUNT(*) as total_conversations,
    AVG(cost) as avg_cost,
    SUM(total_tokens) as total_tokens
  INTO v_stats
  FROM javari_usage_stats
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '30 days';
  
  -- Generate cost optimization recommendations
  IF v_stats.avg_cost > 0.05 THEN
    RETURN QUERY SELECT 
      'Consider using GPT-3.5-turbo or Claude Haiku for routine tasks to reduce costs by up to 90%'::TEXT,
      'cost_optimization'::TEXT,
      1;
  END IF;
  
  -- Generate tool recommendations based on patterns
  IF (v_memory.interaction_history->>'total_conversations')::INTEGER > 10 THEN
    IF 'technical' = ANY(ARRAY(SELECT jsonb_array_elements_text(v_memory.interaction_history->'favorite_topics'))) THEN
      RETURN QUERY SELECT 
        'Try the Code Generator tool - it might speed up your development workflow'::TEXT,
        'tool_suggestion'::TEXT,
        2;
    END IF;
  END IF;
  
  -- Generate productivity recommendations
  RETURN QUERY SELECT 
    'Your most productive time is based on your usage patterns - check Analytics for insights'::TEXT,
    'productivity'::TEXT,
    3;
  
END;
$$ LANGUAGE plpgsql;

-- Create view for comprehensive user analytics
CREATE OR REPLACE VIEW javari_user_complete_analytics AS
SELECT 
  u.user_id,
  u.total_conversations,
  u.total_tokens_used,
  u.total_cost,
  u.avg_tokens_per_conversation,
  u.avg_cost_per_conversation,
  u.providers_used,
  u.requests_by_provider,
  m.preferences,
  m.interaction_history,
  m.project_context,
  (SELECT COUNT(*) FROM javari_file_uploads WHERE user_id = u.user_id) as files_uploaded,
  (SELECT COUNT(*) FROM javari_tool_executions WHERE user_id = u.user_id AND status = 'completed') as tools_executed,
  (SELECT AVG(rating) FROM javari_user_feedback WHERE user_id = u.user_id) as avg_feedback_rating
FROM javari_user_analytics u
LEFT JOIN javari_user_memory m ON u.user_id = m.user_id;

-- Row Level Security Policies
ALTER TABLE javari_user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_tool_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE javari_streaming_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY javari_memory_user_policy ON javari_user_memory
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY javari_uploads_user_policy ON javari_file_uploads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY javari_tools_user_policy ON javari_tool_executions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY javari_feedback_user_policy ON javari_user_feedback
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY javari_streaming_user_policy ON javari_streaming_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Everyone can read public prompt templates
CREATE POLICY javari_templates_read_policy ON javari_prompt_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

-- Users can create their own templates
CREATE POLICY javari_templates_insert_policy ON javari_prompt_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update their own templates
CREATE POLICY javari_templates_update_policy ON javari_prompt_templates
  FOR UPDATE USING (created_by = auth.uid());

-- Insert default prompt templates
INSERT INTO javari_prompt_templates (name, category, description, prompt_text, variables, is_public) VALUES
  ('Content Creation', 'content', 'Generate various types of content', 'I need help creating [TYPE] content for [PLATFORM]. My target audience is [AUDIENCE] and my goal is [GOAL]. The tone should be [TONE].', ARRAY['TYPE', 'PLATFORM', 'AUDIENCE', 'GOAL', 'TONE'], true),
  ('Code Review', 'code', 'Comprehensive code review', 'Please review this [LANGUAGE] code for:\n1. Performance optimization\n2. Security vulnerabilities\n3. Best practices\n4. Code quality\n\nCode:\n[CODE]', ARRAY['LANGUAGE', 'CODE'], true),
  ('Project Planning', 'planning', 'Plan projects effectively', 'Help me plan a [PROJECT_TYPE] project:\n- Timeline: [TIMELINE]\n- Budget: [BUDGET]\n- Team size: [TEAM_SIZE]\n- Key deliverables: [DELIVERABLES]', ARRAY['PROJECT_TYPE', 'TIMELINE', 'BUDGET', 'TEAM_SIZE', 'DELIVERABLES'], true),
  ('Marketing Strategy', 'marketing', 'Create marketing strategies', 'Create a marketing strategy for [PRODUCT]:\n- Target market: [MARKET]\n- Budget: [BUDGET]\n- Goals: [GOALS]\n- Timeline: [TIMELINE]', ARRAY['PRODUCT', 'MARKET', 'BUDGET', 'GOALS', 'TIMELINE'], true),
  ('Image Generation Prompt', 'creative', 'Optimize AI image prompts', 'Create optimized prompt for [SUBJECT]:\n- Style: [STYLE]\n- Mood: [MOOD]\n- Details: [DETAILS]\n- Quality: [QUALITY]', ARRAY['SUBJECT', 'STYLE', 'MOOD', 'DETAILS', 'QUALITY'], true)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE javari_user_memory IS 'Persistent memory system for personalized AI experience across sessions';
COMMENT ON TABLE javari_file_uploads IS 'Tracks all file uploads and analysis results';
COMMENT ON TABLE javari_tool_executions IS 'Logs all tool executions with results and performance metrics';
COMMENT ON TABLE javari_prompt_templates IS 'Reusable prompt templates for common tasks';
COMMENT ON TABLE javari_user_feedback IS 'User feedback on conversation quality for continuous improvement';
COMMENT ON TABLE javari_streaming_sessions IS 'Active streaming response sessions for real-time updates';
