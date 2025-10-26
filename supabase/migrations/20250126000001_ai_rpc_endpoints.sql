-- =====================================================
-- Phase 1: AI Stack RPC Endpoints
-- Created: 2025-01-26
-- Purpose: Server-authoritative AI conversation state
-- =====================================================

-- =====================================================
-- Function 1: Get All Threads for Current User
-- RPC: get_ai_threads()
-- Returns: All conversations for authenticated user
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_ai_threads()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  conversation_title TEXT,
  ai_service_mode TEXT,
  conversation_type TEXT,
  context_data JSONB,
  is_active BOOLEAN,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Return user's conversations ordered by last activity
  RETURN QUERY
  SELECT 
    ac.id,
    ac.user_id,
    ac.conversation_title,
    ac.ai_service_mode,
    ac.conversation_type,
    ac.context_data,
    ac.is_active,
    ac.last_activity_at,
    ac.created_at,
    ac.updated_at
  FROM public.ai_conversations ac
  WHERE ac.user_id = auth.uid()
  ORDER BY ac.last_activity_at DESC NULLS LAST, ac.created_at DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_ai_threads() TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.get_ai_threads() IS 'Fetches all AI conversations for the authenticated user, ordered by last activity';


-- =====================================================
-- Function 2: Get Messages for Specific Thread
-- RPC: get_thread_messages(thread_id UUID)
-- Returns: All messages in a conversation
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_thread_messages(thread_id UUID)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  message_type TEXT,
  content TEXT,
  content_type TEXT,
  metadata JSONB,
  parent_message_id UUID,
  is_deleted BOOLEAN,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify user owns this conversation
  IF NOT EXISTS (
    SELECT 1 FROM public.ai_conversations 
    WHERE id = thread_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: conversation not found or unauthorized';
  END IF;

  -- Return messages ordered chronologically
  RETURN QUERY
  SELECT 
    am.id,
    am.conversation_id,
    am.message_type,
    am.content,
    am.content_type,
    am.metadata,
    am.parent_message_id,
    am.is_deleted,
    am.created_at
  FROM public.ai_messages am
  WHERE am.conversation_id = thread_id
    AND am.is_deleted = false
  ORDER BY am.created_at ASC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_thread_messages(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.get_thread_messages(UUID) IS 'Fetches all messages for a specific conversation with authorization check';


-- =====================================================
-- Function 3: Add Message to Thread
-- RPC: add_thread_message(thread_id UUID, message_type TEXT, content TEXT, metadata JSONB)
-- Returns: Created message
-- =====================================================
CREATE OR REPLACE FUNCTION public.add_thread_message(
  p_thread_id UUID,
  p_message_type TEXT,
  p_content TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  message_type TEXT,
  content TEXT,
  content_type TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_message_id UUID;
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify user owns this conversation
  IF NOT EXISTS (
    SELECT 1 FROM public.ai_conversations 
    WHERE id = p_thread_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: conversation not found or unauthorized';
  END IF;

  -- Validate message type
  IF p_message_type NOT IN ('user', 'assistant', 'system') THEN
    RAISE EXCEPTION 'Invalid message_type. Must be: user, assistant, or system';
  END IF;

  -- Insert message
  INSERT INTO public.ai_messages (
    conversation_id,
    message_type,
    content,
    content_type,
    metadata,
    is_deleted,
    created_at
  ) VALUES (
    p_thread_id,
    p_message_type,
    p_content,
    'text',
    p_metadata,
    false,
    NOW()
  )
  RETURNING ai_messages.id INTO v_message_id;

  -- Update conversation's last_activity_at
  UPDATE public.ai_conversations
  SET 
    last_activity_at = NOW(),
    updated_at = NOW()
  WHERE id = p_thread_id;

  -- Return created message
  RETURN QUERY
  SELECT 
    am.id,
    am.conversation_id,
    am.message_type,
    am.content,
    am.content_type,
    am.metadata,
    am.created_at
  FROM public.ai_messages am
  WHERE am.id = v_message_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.add_thread_message(UUID, TEXT, TEXT, JSONB) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.add_thread_message(UUID, TEXT, TEXT, JSONB) IS 'Adds a new message to a conversation with authorization check and updates last activity';


-- =====================================================
-- Function 4: Create New Thread
-- RPC: create_ai_thread(title TEXT, mode TEXT, type TEXT)
-- Returns: Created conversation
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_ai_thread(
  p_title TEXT,
  p_mode TEXT DEFAULT 'chat',
  p_type TEXT DEFAULT 'general'
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  conversation_title TEXT,
  ai_service_mode TEXT,
  conversation_type TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_thread_id UUID;
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert new conversation
  INSERT INTO public.ai_conversations (
    user_id,
    conversation_title,
    ai_service_mode,
    conversation_type,
    is_active,
    last_activity_at,
    created_at,
    updated_at
  ) VALUES (
    auth.uid(),
    p_title,
    p_mode,
    p_type,
    true,
    NOW(),
    NOW(),
    NOW()
  )
  RETURNING ai_conversations.id INTO v_thread_id;

  -- Return created thread
  RETURN QUERY
  SELECT 
    ac.id,
    ac.user_id,
    ac.conversation_title,
    ac.ai_service_mode,
    ac.conversation_type,
    ac.is_active,
    ac.created_at
  FROM public.ai_conversations ac
  WHERE ac.id = v_thread_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_ai_thread(TEXT, TEXT, TEXT) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.create_ai_thread(TEXT, TEXT, TEXT) IS 'Creates a new AI conversation thread for the authenticated user';


-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index on last_activity_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_activity 
ON public.ai_conversations(user_id, last_activity_at DESC);

-- Index on created_at for message ordering
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at 
ON public.ai_messages(conversation_id, created_at ASC);

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify functions are created:
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name LIKE '%thread%'
-- ORDER BY routine_name;

