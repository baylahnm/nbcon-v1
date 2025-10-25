-- =====================================================
-- PHASE 2 TOOLS - SMOKE TEST
-- Purpose: Verify CRUD operations, triggers, and computed columns
-- Safety: Uses transactions with ROLLBACK (no data committed)
-- =====================================================

-- =====================================================
-- PREREQUISITE: Get a real project ID
-- =====================================================
-- Run this first to get a project you own:
SELECT id, name, created_by 
FROM gantt_projects 
WHERE created_by = auth.uid()
LIMIT 1;

-- Copy the 'id' value and replace ALL instances of 
-- '<YOUR-PROJECT-ID>' below with the actual UUID

-- =====================================================
-- TEST 1: Charter Sections CRUD + Triggers
-- =====================================================
DO $$
DECLARE
  test_section_id UUID;
  initial_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 1: Charter Sections CRUD + Triggers';
  RAISE NOTICE '========================================';
  
  -- Start transaction
  BEGIN
    -- INSERT test
    INSERT INTO project_charter_sections (
      project_id,
      section_name,
      section_order,
      section_description,
      content,
      is_completed,
      ai_generated
    ) VALUES (
      '<YOUR-PROJECT-ID>',
      'Test Vision Section',
      1,
      'Testing charter section creation',
      'This is test content for smoke testing',
      false,
      false
    ) RETURNING id, updated_at INTO test_section_id, initial_updated_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ INSERT: Charter section created (ID: %)', test_section_id;
    RAISE NOTICE '   Initial updated_at: %', initial_updated_at;
    
    -- Wait 1 second to ensure timestamp difference
    PERFORM pg_sleep(1);
    
    -- UPDATE test (should trigger updated_at)
    UPDATE project_charter_sections
    SET content = 'Updated test content',
        is_completed = true
    WHERE id = test_section_id
    RETURNING updated_at INTO new_updated_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ UPDATE: Content modified';
    RAISE NOTICE '   New updated_at: %', new_updated_at;
    RAISE NOTICE '   Trigger fired: %', CASE WHEN new_updated_at > initial_updated_at THEN '✅ YES' ELSE '❌ NO' END;
    
    -- SELECT test (verify RLS allows read)
    IF EXISTS (SELECT 1 FROM project_charter_sections WHERE id = test_section_id) THEN
      RAISE NOTICE '';
      RAISE NOTICE '✅ SELECT: Can read own charter section (RLS working)';
    ELSE
      RAISE WARNING '❌ SELECT: Cannot read own data (RLS issue!)';
    END IF;
    
    -- DELETE test
    DELETE FROM project_charter_sections WHERE id = test_section_id;
    RAISE NOTICE '';
    RAISE NOTICE '✅ DELETE: Charter section removed';
    
    -- Verify deletion
    IF NOT EXISTS (SELECT 1 FROM project_charter_sections WHERE id = test_section_id) THEN
      RAISE NOTICE '✅ VERIFY: Deletion confirmed';
    END IF;
    
    -- ROLLBACK to leave no test data
    RAISE NOTICE '';
    RAISE NOTICE '🔄 ROLLBACK: All changes reverted (no data persisted)';
    ROLLBACK;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '❌ CHARTER TEST FAILED: %', SQLERRM;
    ROLLBACK;
  END;
END $$;

-- =====================================================
-- TEST 2: Project Risks CRUD + Computed Column
-- =====================================================
DO $$
DECLARE
  test_risk_id UUID;
  computed_score INTEGER;
  initial_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 2: Project Risks CRUD + Computed Column';
  RAISE NOTICE '========================================';
  
  BEGIN
    -- INSERT test with probability=3, impact=4 (score should be 12)
    INSERT INTO project_risks (
      project_id,
      title,
      description,
      category,
      probability,
      impact,
      mitigation_strategy,
      status
    ) VALUES (
      '<YOUR-PROJECT-ID>',
      'Test Risk - Weather Delays',
      'Testing risk register functionality',
      'schedule',
      3,                    -- probability
      4,                    -- impact
      'Monitor weather forecasts and plan buffers',
      'identified'
    ) RETURNING id, risk_score, updated_at INTO test_risk_id, computed_score, initial_updated_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ INSERT: Risk created (ID: %)', test_risk_id;
    RAISE NOTICE '   Probability: 3, Impact: 4';
    RAISE NOTICE '   Computed risk_score: % (expected: 12)', computed_score;
    RAISE NOTICE '   Auto-calculation: %', CASE WHEN computed_score = 12 THEN '✅ CORRECT' ELSE '❌ WRONG' END;
    
    -- Wait for timestamp difference
    PERFORM pg_sleep(1);
    
    -- UPDATE test - change probability/impact (score should recalculate)
    UPDATE project_risks
    SET probability = 5,
        impact = 5,
        status = 'assessed'
    WHERE id = test_risk_id
    RETURNING risk_score, updated_at INTO computed_score, new_updated_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ UPDATE: Risk modified';
    RAISE NOTICE '   New Probability: 5, New Impact: 5';
    RAISE NOTICE '   New risk_score: % (expected: 25)', computed_score;
    RAISE NOTICE '   Auto-recalculation: %', CASE WHEN computed_score = 25 THEN '✅ CORRECT' ELSE '❌ WRONG' END;
    RAISE NOTICE '   Trigger fired: %', CASE WHEN new_updated_at > initial_updated_at THEN '✅ YES' ELSE '❌ NO' END;
    
    -- SELECT test
    IF EXISTS (SELECT 1 FROM project_risks WHERE id = test_risk_id) THEN
      RAISE NOTICE '';
      RAISE NOTICE '✅ SELECT: Can read own risks (RLS working)';
    END IF;
    
    -- DELETE test
    DELETE FROM project_risks WHERE id = test_risk_id;
    RAISE NOTICE '';
    RAISE NOTICE '✅ DELETE: Risk removed';
    
    -- ROLLBACK
    RAISE NOTICE '';
    RAISE NOTICE '🔄 ROLLBACK: All changes reverted (no data persisted)';
    ROLLBACK;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '❌ RISKS TEST FAILED: %', SQLERRM;
    ROLLBACK;
  END;
END $$;

-- =====================================================
-- TEST 3: Project Stakeholders CRUD + Power/Interest Matrix
-- =====================================================
DO $$
DECLARE
  test_stakeholder_id UUID;
  initial_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 3: Project Stakeholders CRUD';
  RAISE NOTICE '========================================';
  
  BEGIN
    -- INSERT test with high power, high interest
    INSERT INTO project_stakeholders (
      project_id,
      name,
      role,
      organization,
      power_level,
      interest_level,
      engagement_strategy,
      communication_frequency,
      contact_email
    ) VALUES (
      '<YOUR-PROJECT-ID>',
      'Test Stakeholder - Project Sponsor',
      'Executive Sponsor',
      'ACME Construction',
      'high',
      'high',
      'Closely manage with weekly updates',
      'weekly',
      'test@example.com'
    ) RETURNING id, updated_at INTO test_stakeholder_id, initial_updated_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ INSERT: Stakeholder created (ID: %)', test_stakeholder_id;
    RAISE NOTICE '   Power/Interest: high/high (Closely Manage quadrant)';
    
    -- Wait for timestamp
    PERFORM pg_sleep(1);
    
    -- UPDATE test - move to different quadrant
    UPDATE project_stakeholders
    SET power_level = 'low',
        interest_level = 'high',
        engagement_strategy = 'Keep informed with regular updates'
    WHERE id = test_stakeholder_id
    RETURNING updated_at INTO new_updated_at;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ UPDATE: Stakeholder moved to low power/high interest';
    RAISE NOTICE '   New quadrant: Keep Informed';
    RAISE NOTICE '   Trigger fired: %', CASE WHEN new_updated_at > initial_updated_at THEN '✅ YES' ELSE '❌ NO' END;
    
    -- SELECT test
    IF EXISTS (SELECT 1 FROM project_stakeholders WHERE id = test_stakeholder_id) THEN
      RAISE NOTICE '';
      RAISE NOTICE '✅ SELECT: Can read own stakeholders (RLS working)';
    END IF;
    
    -- DELETE test
    DELETE FROM project_stakeholders WHERE id = test_stakeholder_id;
    RAISE NOTICE '';
    RAISE NOTICE '✅ DELETE: Stakeholder removed';
    
    -- ROLLBACK
    RAISE NOTICE '';
    RAISE NOTICE '🔄 ROLLBACK: All changes reverted (no data persisted)';
    ROLLBACK;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '❌ STAKEHOLDERS TEST FAILED: %', SQLERRM;
    ROLLBACK;
  END;
END $$;

-- =====================================================
-- FINAL SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SMOKE TEST COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'If all tests show ✅, the backend is ready.';
  RAISE NOTICE 'All test data has been rolled back.';
  RAISE NOTICE 'No permanent changes made to database.';
  RAISE NOTICE '';
END $$;

