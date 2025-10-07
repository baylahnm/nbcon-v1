-- 009-shared-ai.sql
-- Shared AI features and tracking

-- Create AI service modes table
CREATE TABLE public.ai_service_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode_name TEXT NOT NULL UNIQUE,
  mode_description TEXT,
  mode_config JSONB NOT NULL, -- AI service configuration
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI events tracking table
CREATE TABLE public.ai_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  session_id TEXT,
  event_type TEXT CHECK (event_type IN ('chat_start', 'chat_end', 'message_sent', 'message_received', 'tool_used', 'error_occurred')) NOT NULL,
  event_data JSONB, -- Event-specific data
  ai_model TEXT,
  ai_provider TEXT,
  processing_time_ms INTEGER,
  token_count INTEGER,
  cost_usd DECIMAL(10,6),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI conversations table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  conversation_title TEXT,
  ai_service_mode TEXT REFERENCES public.ai_service_modes(mode_name),
  conversation_type TEXT CHECK (conversation_type IN ('chat', 'code_review', 'documentation', 'analysis', 'generation')) DEFAULT 'chat',
  context_data JSONB, -- Conversation context and metadata
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI messages table
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('user', 'assistant', 'system', 'tool')) NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text', 'code', 'markdown', 'json', 'image')) DEFAULT 'text',
  metadata JSONB, -- Message metadata (tokens, model info, etc.)
  parent_message_id UUID REFERENCES public.ai_messages(id),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI tools table
CREATE TABLE public.ai_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL UNIQUE,
  tool_description TEXT,
  tool_category TEXT, -- e.g., 'code', 'analysis', 'generation', 'utility'
  tool_config JSONB NOT NULL, -- Tool configuration and parameters
  tool_permissions JSONB, -- Role-based tool permissions
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI tool usage table
CREATE TABLE public.ai_tool_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id),
  conversation_id UUID REFERENCES public.ai_conversations(id),
  usage_context JSONB, -- Context of tool usage
  input_data JSONB, -- Input data for the tool
  output_data JSONB, -- Output data from the tool
  execution_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI usage analytics table
CREATE TABLE public.ai_usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id),
  date DATE NOT NULL,
  total_messages INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10,6) DEFAULT 0,
  conversation_count INTEGER DEFAULT 0,
  tool_usage_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS for AI tables
ALTER TABLE public.ai_service_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI tables
-- AI service modes policies
CREATE POLICY "Anyone can view active AI service modes"
ON public.ai_service_modes FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage AI service modes"
ON public.ai_service_modes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- AI events policies
CREATE POLICY "Users can view their own AI events"
ON public.ai_events FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert AI events"
ON public.ai_events FOR INSERT
WITH CHECK (true); -- Allow system to insert events

CREATE POLICY "Admins can view all AI events"
ON public.ai_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- AI conversations policies
CREATE POLICY "Users can manage their own AI conversations"
ON public.ai_conversations FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all AI conversations"
ON public.ai_conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- AI messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.ai_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON public.ai_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_conversations
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all AI messages"
ON public.ai_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- AI tools policies
CREATE POLICY "Anyone can view active AI tools"
ON public.ai_tools FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage AI tools"
ON public.ai_tools FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- AI tool usage policies
CREATE POLICY "Users can view their own tool usage"
ON public.ai_tool_usage FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert tool usage data"
ON public.ai_tool_usage FOR INSERT
WITH CHECK (true); -- Allow system to insert usage data

CREATE POLICY "Admins can view all tool usage"
ON public.ai_tool_usage FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- AI usage analytics policies
CREATE POLICY "Users can view their own usage analytics"
ON public.ai_usage_analytics FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert usage analytics"
ON public.ai_usage_analytics FOR INSERT
WITH CHECK (true); -- Allow system to insert analytics data

CREATE POLICY "Admins can view all usage analytics"
ON public.ai_usage_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for AI tables
CREATE INDEX idx_ai_service_modes_active ON public.ai_service_modes(is_active) WHERE is_active = true;
CREATE INDEX idx_ai_service_modes_default ON public.ai_service_modes(is_default) WHERE is_default = true;
CREATE INDEX idx_ai_events_user_id ON public.ai_events(user_id);
CREATE INDEX idx_ai_events_type ON public.ai_events(event_type);
CREATE INDEX idx_ai_events_created_at ON public.ai_events(created_at);
CREATE INDEX idx_ai_events_session_id ON public.ai_events(session_id);
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_active ON public.ai_conversations(is_active) WHERE is_active = true;
CREATE INDEX idx_ai_conversations_last_activity ON public.ai_conversations(last_activity_at);
CREATE INDEX idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_type ON public.ai_messages(message_type);
CREATE INDEX idx_ai_messages_created_at ON public.ai_messages(created_at);
CREATE INDEX idx_ai_messages_not_deleted ON public.ai_messages(is_deleted) WHERE is_deleted = false;
CREATE INDEX idx_ai_tools_active ON public.ai_tools(is_active) WHERE is_active = true;
CREATE INDEX idx_ai_tools_category ON public.ai_tools(tool_category);
CREATE INDEX idx_ai_tool_usage_user_id ON public.ai_tool_usage(user_id);
CREATE INDEX idx_ai_tool_usage_tool_id ON public.ai_tool_usage(tool_id);
CREATE INDEX idx_ai_tool_usage_success ON public.ai_tool_usage(success);
CREATE INDEX idx_ai_tool_usage_created_at ON public.ai_tool_usage(created_at);
CREATE INDEX idx_ai_usage_analytics_user_id ON public.ai_usage_analytics(user_id);
CREATE INDEX idx_ai_usage_analytics_date ON public.ai_usage_analytics(date);

-- Function to update conversation last activity
CREATE OR REPLACE FUNCTION update_ai_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_conversations
  SET last_activity_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation activity when message is created
CREATE TRIGGER update_ai_conversation_activity_trigger
  AFTER INSERT ON public.ai_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_conversation_activity();

-- Function to update tool usage count
CREATE OR REPLACE FUNCTION update_tool_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_tools
  SET usage_count = usage_count + 1,
      updated_at = NEW.created_at
  WHERE id = NEW.tool_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tool usage count
CREATE TRIGGER update_tool_usage_count_trigger
  AFTER INSERT ON public.ai_tool_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_usage_count();
