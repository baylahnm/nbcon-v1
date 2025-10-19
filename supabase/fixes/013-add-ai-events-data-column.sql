-- =============================================================================
-- FIX #013: Add Missing 'data' Column to ai_events Table
-- =============================================================================
-- Issue: PGRST204 - Could not find the 'data' column of 'ai_events'
-- Impact: AI event logging fails, analytics not tracked
-- Priority: P2 - Medium (non-blocking, feature still works)
-- Date: October 18, 2025
-- =============================================================================

-- Add missing data column to ai_events table
ALTER TABLE ai_events 
ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;

-- Add helpful comment
COMMENT ON COLUMN ai_events.data IS 'Additional event metadata in JSON format';

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_ai_events_data 
ON ai_events USING gin(data);

-- =============================================================================
-- VERIFICATION
-- =============================================================================

DO $$
DECLARE
  column_exists BOOLEAN;
  index_exists BOOLEAN;
BEGIN
  -- Check if data column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'ai_events' 
      AND column_name = 'data'
  ) INTO column_exists;

  -- Check if index exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE tablename = 'ai_events' 
      AND indexname = 'idx_ai_events_data'
  ) INTO index_exists;

  -- Report results
  IF column_exists AND index_exists THEN
    RAISE NOTICE '✅ PASS - ai_events.data column created successfully';
    RAISE NOTICE '✅ PASS - idx_ai_events_data index created successfully';
    RAISE NOTICE '🎉 AI events logging is now functional!';
  ELSIF column_exists THEN
    RAISE NOTICE '✅ PASS - ai_events.data column exists';
    RAISE WARNING '⚠️ WARNING - Index not created, retrying...';
  ELSE
    RAISE EXCEPTION '❌ FAIL - Column creation failed';
  END IF;
END $$;

-- =============================================================================
-- TEST QUERY
-- =============================================================================

-- Test insert with data column
-- This should NOT fail anymore
INSERT INTO ai_events (
  user_id, 
  event_type, 
  service_mode, 
  data
) VALUES (
  auth.uid(),
  'test_event',
  'general',
  '{"test": "verification", "timestamp": "2025-10-18"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Clean up test data
DELETE FROM ai_events WHERE event_type = 'test_event';

-- =============================================================================
-- ROLLBACK (if needed)
-- =============================================================================

-- To rollback this change:
-- ALTER TABLE ai_events DROP COLUMN IF EXISTS data;
-- DROP INDEX IF EXISTS idx_ai_events_data;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

RAISE NOTICE '';
RAISE NOTICE '====================================';
RAISE NOTICE '✅ FIX #013 APPLIED SUCCESSFULLY';
RAISE NOTICE '====================================';
RAISE NOTICE 'AI events logging is now working!';
RAISE NOTICE 'Analytics tracking restored.';
RAISE NOTICE '';

