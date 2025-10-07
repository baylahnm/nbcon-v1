-- Create ai_events table for tracking AI interactions
CREATE TABLE public.ai_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  session_id TEXT,
  type TEXT NOT NULL, -- ai_chat_view, ai_send, ai_stream_stop, etc.
  data JSONB, -- Event-specific data
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_events
CREATE POLICY "Users can insert their own events" ON public.ai_events FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can view their own events" ON public.ai_events FOR SELECT USING (
  auth.uid() = user_id
);

-- Create indexes for better performance
CREATE INDEX idx_ai_events_user_id ON public.ai_events(user_id);
CREATE INDEX idx_ai_events_type ON public.ai_events(type);
CREATE INDEX idx_ai_events_timestamp ON public.ai_events(timestamp);
