-- 014-ai-events-column-rename.sql
-- Fix TICKET #002: AI Events Database Column Mismatch
-- Renames event_data to data to match application code expectations

-- Rename the column
ALTER TABLE public.ai_events RENAME COLUMN event_data TO data;

-- Create GIN index for JSONB performance
CREATE INDEX IF NOT EXISTS idx_ai_events_data ON public.ai_events USING gin(data);

-- Verify the change
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_events' AND column_name = 'data'
  ) THEN
    RAISE NOTICE '✅ SUCCESS: Column renamed from event_data to data';
  ELSE
    RAISE EXCEPTION '❌ FAILED: Column data not found';
  END IF;
END $$;

-- Show current ai_events structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'ai_events'
ORDER BY ordinal_position;

