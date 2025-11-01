# Supabase Migrations - Guardrails & Guidelines

This README explains the migration process, safety guardrails, and best practices for database schema changes in NBCON PRO.

## 📋 Migration Overview

Migrations are numbered sequentially using timestamp-based naming: `YYYYMMDDHHMMSS_description.sql`

**Example:** `20250202000001_add_subscription_tier.sql`

## 🔒 Guardrails & Safety Measures

### 1. **Idempotent Migrations**

All migrations must be **idempotent** (safe to run multiple times):

```sql
-- ✅ Good: Uses IF NOT EXISTS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT;

-- ❌ Bad: Will fail on second run
ALTER TABLE profiles ADD COLUMN subscription_tier TEXT;
```

### 2. **Transaction Wrapping**

Always wrap migrations in `BEGIN;` and `COMMIT;`:

```sql
BEGIN;
  -- Migration steps
COMMIT;
```

This ensures atomicity: if any step fails, the entire migration rolls back.

### 3. **Data Migration Safety**

When populating existing rows:

```sql
-- ✅ Good: Only updates NULL values
UPDATE profiles
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

-- ❌ Bad: Overwrites existing data
UPDATE profiles
SET subscription_tier = 'free';
```

### 4. **Column Addition Pattern**

When adding new columns to existing tables:

1. Add column with `IF NOT EXISTS`
2. Set default value
3. Populate existing rows with default
4. Add CHECK constraints
5. Create indexes
6. Verify with NOTICE logging

Example:
```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

UPDATE profiles
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

ALTER TABLE profiles
ADD CONSTRAINT check_subscription_tier 
CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise'));
```

### 5. **Column Removal Pattern**

**NEVER** drop columns in the same migration where you add replacements.

**Safe pattern:**
- Migration 1: Add new column (`subscription_tier`)
- Migration 2: Update all RLS policies to use new column
- Migration 3: Test and verify in staging
- Migration 4: Drop old column (`role`)

### 6. **RLS Policy Updates**

When updating RLS policies:

```sql
-- ✅ Good: Check if policy exists first
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'profiles_self_access'
  ) THEN
    EXECUTE 'ALTER POLICY "profiles_self_access" ON public.profiles USING (auth.uid() = user_id)';
  ELSE
    EXECUTE 'CREATE POLICY "profiles_self_access" ON public.profiles FOR SELECT USING (auth.uid() = user_id)';
  END IF;
END $$;
```

### 7. **Verification & Logging**

Always include verification steps:

```sql
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count
  FROM profiles
  WHERE subscription_tier IS NULL;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'Migration failed: % rows have NULL subscription_tier', row_count;
  END IF;
  
  RAISE NOTICE 'Migration complete: All profiles have subscription_tier set';
END $$;
```

## 📚 Migration Naming Convention

Format: `YYYYMMDDHHMMSS_description.sql`

- **YYYYMMDD**: Date (year, month, day)
- **HHMMSS**: Time (hour, minute, second) - used for ordering multiple migrations in one day
- **description**: Snake_case description of the change

**Examples:**
- `20250202000001_add_subscription_tier.sql`
- `20250202120000_update_rls_policies.sql`
- `20250202140000_drop_role_column.sql`

## 🚦 Migration Status Tracking

Track migration phases using comments in migration files:

```sql
-- Phase: Phase B - Access & Data Model (Section 4)
-- Version: NBCON PRO v2.0.1
-- Dependencies: Requires 20240101000001_base_schema.sql
```

## ⚠️ Critical Rules

### DO:
- ✅ Always test migrations in local/staging before production
- ✅ Keep migrations small and focused (one logical change per file)
- ✅ Include rollback instructions in migration comments
- ✅ Document dependencies between migrations
- ✅ Verify data integrity after each migration

### DON'T:
- ❌ Drop columns in the same migration that adds replacements
- ❌ Modify production data without backups
- ❌ Create migrations that depend on uncommitted code changes
- ❌ Skip verification steps
- ❌ Remove guardrails for "speed"

## 🔄 Rollback Procedures

Every migration should include rollback instructions in comments:

```sql
-- Rollback:
--   ALTER TABLE profiles DROP COLUMN IF EXISTS subscription_tier;
--   DROP INDEX IF EXISTS idx_profiles_subscription_tier;
```

For complex migrations, create a separate rollback migration file:
- `20250202000001_add_subscription_tier.sql`
- `20250202000002_rollback_subscription_tier.sql` (if needed)

## 📖 Current Migration Phases

### Phase A: UI Unification (Complete)
- Migration files related to UI changes (if any)

### Phase B: Access & Data Model (In Progress)
- `20250202000001_add_subscription_tier.sql` - Adds subscription_tier column

### Phase C: Database & RLS Cleanup (Planned)
- Will drop `role` column after Phase B verification

### Phase D: Testing & Documentation (Planned)
- Test migrations and documentation updates

## 🧪 Testing Migrations

Before applying to production:

1. **Local Testing:**
   ```bash
   supabase db reset  # Apply all migrations fresh
   supabase db diff   # Check for unexpected changes
   ```

2. **Staging Testing:**
   ```bash
   supabase db push --db-url $STAGING_URL
   ```

3. **Verification Queries:**
   ```sql
   -- Verify subscription_tier column exists
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'profiles' AND column_name = 'subscription_tier';
   
   -- Verify all rows have subscription_tier set
   SELECT subscription_tier, COUNT(*)
   FROM profiles
   GROUP BY subscription_tier;
   ```

## 🔗 Related Documentation

- **Phase B Plan:** `docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4).md`
- **Phase C Plan:** `docs/nbcon-new-plan/2 5-🗄️Phase C Database & RLS Cleanup (Section 5).md`
- **Supabase Docs:** https://supabase.com/docs/guides/database/migrations

## 📝 Migration Template

Use this template for new migrations:

```sql
-- Migration: Brief description
-- Phase: Phase X - Phase Name
-- Version: NBCON PRO vX.X.X
-- Date: YYYY-MM-DD
-- 
-- Purpose: Detailed description of what this migration does and why
--
-- This migration:
-- 1. Step 1 description
-- 2. Step 2 description
-- 3. Step 3 description
--
-- See: docs/nbcon-new-plan/section-reference.md

BEGIN;

-- ============================================================================
-- STEP 1: Description
-- ============================================================================

-- Migration code here

-- ============================================================================
-- STEP 2: Verification
-- ============================================================================

DO $$
BEGIN
  -- Verification code
  RAISE NOTICE 'Migration complete: Description';
END $$;

COMMIT;

-- ============================================================================
-- POST-MIGRATION NOTES
-- ============================================================================
--
-- Next Steps:
-- 1. Step 1
-- 2. Step 2
--
-- Rollback:
--   ROLLBACK commands here
--
-- Testing:
--   SELECT verification queries here
-- ============================================================================
```

## 🆘 Emergency Procedures

If a migration fails in production:

1. **DO NOT PANIC** - Most migrations are wrapped in transactions
2. Check the error message in Supabase logs
3. If transaction failed, database is in original state (safe)
4. Fix the migration file
5. Test locally
6. Apply fixed migration

If data corruption is suspected:

1. **STOP** all application writes if possible
2. Check backup status
3. Contact database administrator
4. Document the issue for post-mortem

---

**Last Updated:** February 2, 2025  
**Maintainer:** Database Team  
**Version:** 1.0.0

