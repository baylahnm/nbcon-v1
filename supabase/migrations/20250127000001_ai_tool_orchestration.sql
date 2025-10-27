-- ============================================================================
-- AI Tool Orchestration Schema
-- 
-- Creates tables for cross-tool session management, workflow execution,
-- and orchestration telemetry.
-- 
-- @version 1.0.0
-- @created January 27, 2025
-- ============================================================================

-- ============================================================================
-- TABLE: ai_tool_sessions
-- Stores active tool sessions with workflow state and context
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_tool_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  project_id UUID, -- References project (flexible - could be client_projects or enterprise_projects)
  
  -- Current state
  current_phase TEXT, -- Project phase: initiation, planning, design, execution, monitoring, closure
  active_tool TEXT, -- Currently active tool ID
  previous_tool TEXT, -- Last used tool ID
  tool_chain TEXT[] DEFAULT '{}', -- Sequence of tools used
  
  -- Context
  shared_context JSONB DEFAULT '{}', -- Data shared across tools
  pending_inputs JSONB DEFAULT '{}', -- Inputs waiting for next tool
  active_workflow JSONB, -- Active workflow pipeline state
  
  -- Statistics
  interactions_count INT DEFAULT 0,
  total_tokens_used BIGINT DEFAULT 0,
  total_cost_usd DECIMAL(10,6) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_tool_sessions_user ON public.ai_tool_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_sessions_project ON public.ai_tool_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_sessions_conversation ON public.ai_tool_sessions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_sessions_active_tool ON public.ai_tool_sessions(active_tool);
CREATE INDEX IF NOT EXISTS idx_ai_tool_sessions_created ON public.ai_tool_sessions(created_at DESC);

-- ============================================================================
-- TABLE: ai_tool_interactions
-- Stores individual tool interactions within sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_tool_interactions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES public.ai_tool_sessions(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL, -- From tool registry
  
  -- Execution details
  action TEXT NOT NULL, -- Action performed (e.g., 'generate', 'analyze', 'calculate')
  inputs JSONB DEFAULT '{}', -- Input parameters
  outputs JSONB DEFAULT '{}', -- Generated outputs
  
  -- Performance metrics
  tokens_used INT,
  cost_usd DECIMAL(10,6),
  duration_ms INT,
  
  -- Outcome
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_ai_tool_interactions_session ON public.ai_tool_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_interactions_tool ON public.ai_tool_interactions(tool_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_interactions_created ON public.ai_tool_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tool_interactions_success ON public.ai_tool_interactions(success);

-- GIN index for searching outputs
CREATE INDEX IF NOT EXISTS idx_ai_tool_interactions_outputs ON public.ai_tool_interactions USING gin(outputs);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.ai_tool_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.ai_tool_sessions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert their own sessions"
ON public.ai_tool_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update their own sessions"
ON public.ai_tool_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions"
ON public.ai_tool_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Users can view interactions in their sessions
CREATE POLICY "Users can view their session interactions"
ON public.ai_tool_interactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.ai_tool_sessions
    WHERE id = ai_tool_interactions.session_id
    AND user_id = auth.uid()
  )
);

-- Users can insert interactions in their sessions
CREATE POLICY "Users can insert session interactions"
ON public.ai_tool_interactions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_tool_sessions
    WHERE id = ai_tool_interactions.session_id
    AND user_id = auth.uid()
  )
);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Update session updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_tool_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_update_ai_tool_session_timestamp ON public.ai_tool_sessions;
CREATE TRIGGER trigger_update_ai_tool_session_timestamp
  BEFORE UPDATE ON public.ai_tool_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_tool_session_timestamp();

-- Update session statistics when interaction added
CREATE OR REPLACE FUNCTION update_session_stats_on_interaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_tool_sessions
  SET
    interactions_count = interactions_count + 1,
    total_tokens_used = total_tokens_used + COALESCE(NEW.tokens_used, 0),
    total_cost_usd = total_cost_usd + COALESCE(NEW.cost_usd, 0),
    updated_at = now()
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats
DROP TRIGGER IF EXISTS trigger_update_session_stats ON public.ai_tool_interactions;
CREATE TRIGGER trigger_update_session_stats
  AFTER INSERT ON public.ai_tool_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_stats_on_interaction();

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Session summary view
CREATE OR REPLACE VIEW public.ai_tool_session_summary AS
SELECT
  s.id,
  s.user_id,
  s.project_id,
  s.current_phase,
  s.tool_chain,
  s.interactions_count,
  s.total_tokens_used,
  s.total_cost_usd,
  s.created_at,
  s.updated_at,
  EXTRACT(EPOCH FROM (s.updated_at - s.created_at)) / 60 AS duration_minutes,
  array_length(s.tool_chain, 1) AS tools_used,
  CONCAT(p.first_name, ' ', p.last_name) AS user_name,
  p.role AS user_role
FROM public.ai_tool_sessions s
JOIN public.profiles p ON s.user_id = p.user_id
ORDER BY s.created_at DESC;

-- Tool popularity view
CREATE OR REPLACE VIEW public.ai_tool_popularity AS
SELECT
  tool_id,
  COUNT(*) AS total_invocations,
  COUNT(DISTINCT session_id) AS unique_sessions,
  AVG(duration_ms) AS avg_duration_ms,
  SUM(tokens_used) AS total_tokens,
  SUM(cost_usd) AS total_cost,
  (COUNT(*) FILTER (WHERE success = true))::FLOAT / COUNT(*) AS success_rate
FROM public.ai_tool_interactions
GROUP BY tool_id
ORDER BY total_invocations DESC;

-- Workflow chain analysis
CREATE OR REPLACE VIEW public.ai_workflow_chains AS
SELECT
  tool_chain,
  COUNT(*) AS frequency,
  AVG(interactions_count) AS avg_interactions,
  AVG(total_cost_usd) AS avg_cost,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60) AS avg_duration_minutes
FROM public.ai_tool_sessions
WHERE array_length(tool_chain, 1) > 1
GROUP BY tool_chain
ORDER BY frequency DESC
LIMIT 100;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables created
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'ai_tool_sessions') THEN
    RAISE NOTICE '✅ ai_tool_sessions table created successfully';
  ELSE
    RAISE EXCEPTION '❌ ai_tool_sessions table creation failed';
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'ai_tool_interactions') THEN
    RAISE NOTICE '✅ ai_tool_interactions table created successfully';
  ELSE
    RAISE EXCEPTION '❌ ai_tool_interactions table creation failed';
  END IF;
END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '  AI TOOL ORCHESTRATION SCHEMA - MIGRATION COMPLETE';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Tables created: ai_tool_sessions, ai_tool_interactions';
  RAISE NOTICE '✅ Indexes created: 9 performance indexes';
  RAISE NOTICE '✅ RLS policies: 6 security policies';
  RAISE NOTICE '✅ Triggers: 2 auto-update triggers';
  RAISE NOTICE '✅ Views: 3 analytics views';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready for: Session management, workflow tracking, telemetry';
  RAISE NOTICE '════════════════════════════════════════════════════════';
END $$;

