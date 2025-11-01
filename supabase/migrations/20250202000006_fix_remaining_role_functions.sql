-- Migration: Fix remaining functions referencing profiles.role (Phase C)
-- Phase: Phase C - Database & RLS Cleanup (Section 5)
-- Version: NBCON PRO v2.0.2
-- Date: 2025-02-02
--
-- Purpose: Update functions that still reference the dropped profiles.role column
-- to use subscription_tier + is_admin instead.
--
-- Functions fixed:
--   1. has_feature_access() - Replace SELECT role with is_admin check
--   2. create_default_dashboard_layout() - Replace NEW.role::TEXT with NEW.subscription_tier
--
-- See: docs/nbcon-new-plan/phase-c/README.md (Tasks 3.4, 3.5)
-- See: docs/nbcon-new-plan/phase-c/FUNCTION_VERIFICATION.md

BEGIN;

-- ============================================================================
-- STEP 1: Fix has_feature_access() function
-- ============================================================================

-- Replace role-based logic with is_admin + subscription_tier
CREATE OR REPLACE FUNCTION public.has_feature_access(user_uuid uuid, feature_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_is_admin BOOLEAN;
  user_tier TEXT;
  user_plan subscription_plan;
BEGIN
  -- Get user's admin status and subscription tier from profiles
  -- Phase C: Replaced profiles.role with is_admin + subscription_tier
  SELECT is_admin, subscription_tier 
  INTO user_is_admin, user_tier
  FROM profiles 
  WHERE user_id = user_uuid;
  
  -- Admin has access to all features (using is_admin flag)
  IF user_is_admin = true THEN
    RETURN true;
  END IF;
  
  -- Get user's active plan
  SELECT plan INTO user_plan FROM get_active_subscription(user_uuid);
  
  -- Check feature access based on plan
  CASE user_plan
    WHEN 'client_monthly_45' THEN
      RETURN feature_name IN ('unlimited_jobs', 'quote_management', 'escrow', 'zatca');
    WHEN 'engineer_monthly_60' THEN
      RETURN feature_name IN ('job_matching', 'portfolio', 'instant_payouts', 'mobile_app');
    WHEN 'enterprise_monthly_120' THEN
      RETURN feature_name IN ('team_management', 'sso', 'custom_integrations', 'white_label');
    WHEN 'admin_free' THEN
      RETURN true;
    ELSE
      RETURN false;
  END CASE;
END;
$$;

-- Add comment documenting the change
COMMENT ON FUNCTION public.has_feature_access(uuid, text) IS 
  'Checks if a user has access to a specific feature based on subscription plan and admin status.
   Phase C: Updated to use is_admin flag instead of profiles.role column.';

-- ============================================================================
-- STEP 2: Fix create_default_dashboard_layout() function
-- ============================================================================

-- Replace NEW.role::TEXT with NEW.subscription_tier
CREATE OR REPLACE FUNCTION public.create_default_dashboard_layout()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  default_config JSONB;
  template_config JSONB;
BEGIN
  -- Get default template for user subscription tier
  -- Phase C: Replaced NEW.role::TEXT with NEW.subscription_tier
  SELECT dt.template_config INTO template_config
  FROM public.dashboard_templates dt
  WHERE dt.template_type = NEW.subscription_tier::TEXT
    AND dt.is_active = true
    AND dt.is_system_template = true
  LIMIT 1;
  
  -- If no template found, create basic default config
  IF template_config IS NULL THEN
    default_config := '{
      "widgets": [],
      "layout": "grid",
      "columns": 3,
      "rows": 4
    }'::JSONB;
  ELSE
    default_config := template_config;
  END IF;
  
  -- Create default dashboard layout
  INSERT INTO public.dashboard_layouts (user_id, layout_name, layout_type, role_specific, layout_config)
  VALUES (
    NEW.user_id,
    'Default Dashboard',
    'default',
    true,
    default_config
  );
  
  RETURN NEW;
END;
$$;

-- Add comment documenting the change
COMMENT ON FUNCTION public.create_default_dashboard_layout() IS 
  'Trigger function that creates a default dashboard layout for new profiles.
   Phase C: Updated to use subscription_tier instead of role column.';

-- ============================================================================
-- STEP 3: Verification
-- ============================================================================

DO $$
DECLARE
  has_feature_access_exists BOOLEAN;
  create_dashboard_exists BOOLEAN;
  has_feature_refs_role BOOLEAN;
  create_dashboard_refs_role BOOLEAN;
BEGIN
  -- Check if functions exist
  SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'has_feature_access'
  ) INTO has_feature_access_exists;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'create_default_dashboard_layout'
  ) INTO create_dashboard_exists;
  
  -- Check if they still reference role
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    WHERE p.proname = 'has_feature_access'
      AND pg_get_functiondef(p.oid) LIKE '%profiles.role%'
      AND pg_get_functiondef(p.oid) NOT LIKE '%--%'
  ) INTO has_feature_refs_role;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    WHERE p.proname = 'create_default_dashboard_layout'
      AND pg_get_functiondef(p.oid) LIKE '%NEW.role%'
      AND pg_get_functiondef(p.oid) NOT LIKE '%--%'
  ) INTO create_dashboard_refs_role;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Verification:';
  RAISE NOTICE '========================================';
  RAISE NOTICE '  has_feature_access() exists: %', 
    CASE WHEN has_feature_access_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  has_feature_access() role references: %', 
    CASE WHEN has_feature_refs_role THEN '❌ Still references role' ELSE '✅ No role references' END;
  RAISE NOTICE '  create_default_dashboard_layout() exists: %', 
    CASE WHEN create_dashboard_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  create_default_dashboard_layout() role references: %', 
    CASE WHEN create_dashboard_refs_role THEN '❌ Still references role' ELSE '✅ No role references' END;
  RAISE NOTICE '';
  
  IF NOT has_feature_access_exists THEN
    RAISE EXCEPTION 'has_feature_access() function not found after migration';
  END IF;
  
  IF NOT create_dashboard_exists THEN
    RAISE EXCEPTION 'create_default_dashboard_layout() function not found after migration';
  END IF;
  
  IF has_feature_refs_role THEN
    RAISE EXCEPTION 'has_feature_access() still references profiles.role';
  END IF;
  
  IF create_dashboard_refs_role THEN
    RAISE EXCEPTION 'create_default_dashboard_layout() still references NEW.role';
  END IF;
  
  RAISE NOTICE '✅ All functions updated successfully!';
  RAISE NOTICE '========================================';
END
$$;

COMMIT;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (for emergency use only)
-- ============================================================================
--
-- To rollback this migration:
--
-- BEGIN;
--   -- Restore has_feature_access() with role reference
--   -- (Requires profiles.role column to exist)
--   CREATE OR REPLACE FUNCTION public.has_feature_access(user_uuid uuid, feature_name text)
--   RETURNS boolean
--   LANGUAGE plpgsql
--   SECURITY DEFINER
--   AS $$
--   DECLARE
--     user_role text;
--     user_plan subscription_plan;
--   BEGIN
--     SELECT role INTO user_role FROM profiles WHERE user_id = user_uuid;
--     IF user_role = 'admin' THEN
--       RETURN true;
--     END IF;
--     -- ... rest of function ...
--   END;
--   $$;
--
--   -- Restore create_default_dashboard_layout() with role reference
--   -- (Requires profiles.role column to exist)
--   CREATE OR REPLACE FUNCTION public.create_default_dashboard_layout()
--   RETURNS TRIGGER
--   LANGUAGE plpgsql
--   AS $$
--   BEGIN
--     SELECT dt.template_config INTO template_config
--     FROM public.dashboard_templates dt
--     WHERE dt.template_type = NEW.role::TEXT
--     -- ... rest of function ...
--   END;
--   $$;
-- COMMIT;
--
-- Note: Rollback requires profiles.role column to be restored first.
-- This should only be used if absolutely necessary.

