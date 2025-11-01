# Account Numbers Table Migration — Audit & Strategy

**Phase:** Phase C - Database & RLS Cleanup  
**Date:** 2025-02-02  
**Status:** Audit Complete — Ready for Migration Decision

---

## Overview

The `account_numbers` table contains a legacy `role` column (USER-DEFINED ENUM type) that must be migrated or removed as part of Phase C's role-to-tier migration. This document provides a complete audit of the table structure, data, and dependencies to inform the migration strategy.

**Key Finding:** The table is **currently empty** (0 rows), which simplifies the migration significantly.

---

## Current Data Snapshot

### Table Structure
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `account_number` | `text` | NO | `NULL` | Account identifier (e.g., "ENG000001") |
| `role` | `USER-DEFINED` (ENUM) | NO | `NULL` | **Legacy role column** — values: `engineer`, `client`, `enterprise`, `admin` |
| `user_id` | `uuid` | YES | `NULL` | Foreign key → `profiles.user_id` |
| `created_at` | `timestamptz` | NO | `now()` | Timestamp |
| `is_active` | `boolean` | YES | `true` | Active status flag |

### Data Statistics
- **Total Rows:** `0` (empty table)
- **Distinct Roles:** `0` (no data)
- **Distinct Users:** `0` (no data)
- **Active Accounts:** `0`
- **Inactive Accounts:** `0`

### ENUM Type Definition
- **Type Name:** `user_role`
- **Allowed Values:** 
  - `engineer`
  - `client`
  - `enterprise`
  - `admin`

### Foreign Keys
- `account_numbers.user_id` → `profiles.user_id` (FK constraint: `account_numbers_user_id_fkey`)

### RLS Policies
1. **"Allow system to insert account numbers"** (INSERT)
   - Allows system/trigger functions to insert records
   
2. **"Users can view their own account number"** (SELECT)
   - Using clause: `auth.uid() = user_id`
   - Users can only view their own account numbers

### Functions & Triggers

**Current Implementation Found:**
- **Function:** `generate_account_number(role_type user_role)` (ENUM parameter)
- **Function:** `assign_account_number()` — Trigger function attached to `profiles` table
- **Trigger:** `assign_account_number_trigger` (BEFORE INSERT on `profiles`)

**Functions that reference `account_numbers.role`:**

1. **`generate_account_number(role_type user_role)`** 
   - Signature: Accepts `user_role` ENUM (`engineer`, `client`, `enterprise`, `admin`)
   - Logic: Maps role to prefix (`ENG`, `CLI`, `ENT`, `ADM`)
   - **Current Implementation:** Queries `profiles` table (`WHERE role = role_type`) NOT `account_numbers`
   - Counter source: `profiles` table, not `account_numbers` table
   - Used by: `assign_account_number()` trigger function
   - Location: `supabase/migrations/20240101000001_base_schema.sql` (base version)
   - **Status:** ⚠️ Still references `role` column in `profiles` (which doesn't exist) — **Broken!**
   
2. **`assign_account_number()`** — Trigger function (BEFORE INSERT on `profiles`)
   - References: `NEW.role` to call `generate_account_number(NEW.role)`
   - Sets: `NEW.account_number` if NULL
   - Note: Legacy version also inserts into `account_numbers` table
   - Location: `supabase/fixes/007-simplify-account-number-trigger.sql` (simplified version)
   
3. **`assign_account_number_after()`** — Trigger function (AFTER INSERT on `profiles`)
   - ✅ **EXISTS** — Function is defined in database
   - Inserts: `(account_number, role, user_id)` into `account_numbers` table
   - Uses: `NEW.role` directly in INSERT statement
   - Status: **Currently NOT attached to any trigger** (no trigger found on profiles table)
   - Note: Function exists but may not be actively used (trigger removed in fix `007-simplify-account-number-trigger.sql`)

### Dependencies
- **Table depends on:** `profiles` table (via FK `user_id`)
- **Functions depend on:** 
  - `user_role` ENUM type (`generate_account_number`)
  - `profiles.role` column (but column doesn't exist — **FUNCTION IS BROKEN**)
  - `account_numbers.role` column (`assign_account_number_after`)
- **Triggers:** 
  - `assign_account_number_trigger` — EXISTS on `profiles` table (BEFORE INSERT)
  - `assign_account_number_after` trigger — **NOT FOUND** (function exists but trigger missing)

### ⚠️ CRITICAL FINDING: Function is Currently Broken

**Verified Function Definition:**
```sql
FROM public.profiles 
WHERE role = role_type AND account_number IS NOT NULL;
```

**Problem:** The function queries `profiles.role` which **was already dropped** in Phase B. This means:
- ❌ Function **will fail** when called (SQL error: column does not exist)
- ❌ Account numbers **cannot be generated** for new profile creation
- ⚠️ Any profile INSERT attempts **may fail** if trigger fires
- 🚨 Migration is **URGENT** to restore functionality

**Impact:** High — Profile creation workflow may be broken

---

## Migration Options

### Option A: Drop `role` Column (Recommended)

**Approach:**
1. Drop `account_numbers.role` column entirely
2. Update functions to use `subscription_tier` instead
3. Modify `generate_account_number()` to accept `subscription_tier` and map to prefix
4. Update trigger functions to read `NEW.subscription_tier` from profiles
5. Remove `role` from `assign_account_number_after()` INSERT statement

**Pros:**
- ✅ Simplest migration path (no data to migrate)
- ✅ Aligns with Phase C goal of removing all role columns
- ✅ Table is empty, so zero data loss risk
- ✅ Removes dependency on legacy `user_role` ENUM
- ✅ Cleaner schema going forward

**Cons:**
- ⚠️ Requires updating 3 functions and triggers
- ⚠️ Account number generation logic needs tier-to-prefix mapping

**Effort:** Medium (function updates + testing)

---

### Option B: Migrate to `subscription_tier` Column

**Approach:**
1. Add `subscription_tier` column to `account_numbers`
2. Populate from `profiles.subscription_tier` (via `user_id` FK)
3. Update functions to use `subscription_tier` instead of `role`
4. Drop `role` column after verification
5. Map subscription tiers to account number prefixes

**Pros:**
- ✅ Preserves historical data structure (if data existed)
- ✅ Allows future audit trail of tier changes

**Cons:**
- ❌ Unnecessary complexity (table is empty)
- ❌ Adds redundant data (already in `profiles` table)
- ❌ More migration steps
- ❌ Violates normalization (data duplication)

**Effort:** High (column addition + population + function updates + drop)

---

### Option C: Drop Table Entirely (Alternative)

**Approach:**
1. Assess if `account_numbers` table is actively used
2. If unused, drop table, functions, and triggers entirely
3. Remove from application code

**Pros:**
- ✅ Simplest path if table is unused
- ✅ Removes all role dependencies at once

**Cons:**
- ❌ May break existing functionality
- ❌ Requires full application audit
- ❌ No historical account number tracking

**Effort:** Low (if unused) / High (if used elsewhere)

---

## Recommended Approach

### ✅ **Option A: Drop `role` Column**

**Rationale:**
1. **Zero data risk** — Table is empty, no data migration needed
2. **Aligns with Phase C goals** — Remove all role column references
3. **Simplest migration path** — Direct column drop + function updates
4. **Future-proof** — Account numbers can be generated from `profiles.subscription_tier` on-the-fly
5. **No normalization issues** — Avoids data duplication

### Migration Steps

1. **Update `generate_account_number()` function** (URGENT — Function is currently broken)
   ```sql
   -- Change signature: generate_account_number(subscription_tier TEXT)
   -- Replace: WHERE role = role_type → WHERE subscription_tier = subscription_tier
   -- Map tiers to prefixes:
   --   'free' → 'FR' or 'USR' (free tier users)
   --   'basic' → 'BAS' or 'CLI' (basic tier)
   --   'pro' → 'PRO' or 'ENG' (pro tier / engineers)
   --   'enterprise' → 'ENT' (enterprise tier)
   -- Counter query: FROM profiles WHERE subscription_tier = tier_param AND account_number IS NOT NULL
   ```

2. **Update `assign_account_number()` trigger function** (URGENT — Currently broken)
   ```sql
   -- Current: NEW.account_number := generate_account_number(NEW.role);  ❌ BROKEN
   -- New: NEW.account_number := generate_account_number(NEW.subscription_tier); ✅
   -- Use NEW.subscription_tier directly (available in profiles table)
   ```

3. **Update `assign_account_number_after()` trigger function** (if trigger is re-enabled)
   ```sql
   -- Remove 'role' from INSERT statement:
   -- OLD: INSERT INTO account_numbers (account_number, role, user_id)
   -- NEW: INSERT INTO account_numbers (account_number, user_id)
   -- Note: Currently NOT attached to any trigger, may be safe to deprecate
   ```

4. **Drop `account_numbers.role` column**
   ```sql
   ALTER TABLE public.account_numbers
   DROP COLUMN IF EXISTS role;
   ```

5. **Optional: Drop `user_role` ENUM type** (after verifying no other dependencies)
   ```sql
   DROP TYPE IF EXISTS user_role; -- Only if unused elsewhere
   ```

---

## Migration Plan

### Prerequisites
- ✅ Phase B complete (`subscription_tier` column in `profiles`)
- ✅ Verify `account_numbers` remains empty (confirm before migration)
- ✅ Backup database (even though empty, safety first)

### Execution Order
1. **Audit functions** — Document all current function definitions
2. **Update functions** — Modify to use `subscription_tier`
3. **Test triggers** — Verify account number generation still works
4. **Drop column** — Remove `account_numbers.role`
5. **Re-run RLS audit** — Confirm zero role references
6. **Cleanup ENUM** — Drop `user_role` type if unused

### Testing Checklist
- [ ] `generate_account_number()` returns correct prefix for each tier (free, basic, pro, enterprise)
- [ ] `generate_account_number()` counter logic works (queries profiles.subscription_tier correctly)
- [ ] `assign_account_number()` trigger fires correctly on profile INSERT
- [ ] Account numbers are generated on profile creation (test with NEW profile)
- [ ] Account numbers format correctly (PREFIX + 6-digit number, e.g., "PRO000001")
- [ ] `assign_account_number_after()` can be updated/deprecated (currently unused)
- [ ] RLS policies still work (users can view own account numbers)
- [ ] No broken function dependencies after migration
- [ ] Verify no application code expects `account_numbers.role` column

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Functions break after column drop | Low | High | Update functions BEFORE dropping column |
| Account number generation fails | Low | Medium | Test trigger functions in staging first |
| ENUM type still referenced | Medium | Low | Check all dependencies before dropping ENUM |
| Application code expects `role` | Low | High | Audit application code for `account_numbers.role` references |

---

## Next Steps

1. ✅ **Audit Complete** — Documented current state
2. ⏳ **Function Analysis** — Review full function definitions in codebase
3. ⏳ **Create Migration** — Build `20250202000004_migrate_account_numbers_role.sql`
4. ⏳ **Test Migration** — Run on staging environment
5. ⏳ **Apply Migration** — Execute on production after verification
6. ⏳ **Update Checklist** — Mark Phase C tasks 5.1a-5.1c as complete

---

## Related Documentation

- [Phase C Checklist](./README.md)
- [Phase C Section Documentation](../2%205-%F0%9F%97%84%EF%B8%8FPhase%20C%20Database%20&%20RLS%20Cleanup%20(Section%205)%2029d608c2eef780b385e3edd6cad6b076.md)
- [Migration README](../../../supabase/migrations/README.md)

---

**Status:** ⚠️ **URGENT** — Functions are currently broken  
**Recommendation:** Drop `role` column (Option A)  
**Priority:** **CRITICAL** (functions fail because `profiles.role` doesn't exist)

### Immediate Action Required
The `generate_account_number()` function is **currently broken** because it references `profiles.role` which was already removed. This migration should be prioritized to restore account number generation functionality.

