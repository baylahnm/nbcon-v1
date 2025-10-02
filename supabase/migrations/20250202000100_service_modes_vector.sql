-- Add service mode metadata and vector memory support for AI workflows

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Ensure ai_threads table exists so we can attach service context
CREATE TABLE IF NOT EXISTS public.ai_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  mode TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_starred BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  message_count INTEGER DEFAULT 0,
  last_message TEXT
);

ALTER TABLE IF EXISTS public.ai_threads
  ADD COLUMN IF NOT EXISTS service_mode TEXT,
  ADD COLUMN IF NOT EXISTS service_metadata JSONB;

-- Optional metadata for AI messages
ALTER TABLE IF EXISTS public.ai_messages
  ADD COLUMN IF NOT EXISTS service_mode TEXT,
  ADD COLUMN IF NOT EXISTS service_metadata JSONB;

-- Vectorized memory table for retrieval augmented generation
CREATE TABLE IF NOT EXISTS public.ai_message_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.ai_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_message_memory_thread_idx
  ON public.ai_message_memory (thread_id);

CREATE INDEX IF NOT EXISTS ai_message_memory_user_idx
  ON public.ai_message_memory (user_id);

CREATE INDEX IF NOT EXISTS ai_message_memory_embedding_idx
  ON public.ai_message_memory
  USING ivfflat (embedding vector_l2_ops);
