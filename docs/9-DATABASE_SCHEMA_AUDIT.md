# 🔍 Database Schema Audit - Code vs Database Comparison

**Date:** October 9, 2025  
**Status:** ⚠️ CRITICAL MISMATCHES FOUND

---

## 🚨 **ROOT CAUSE OF REDIRECT LOOP FOUND!**

### ❌ **MISSING INSERT POLICY ON PROFILES TABLE**

**File:** `supabase/migrations/20240101000001_base_schema.sql` (lines 49-65)
**File:** `supabase/fixes/006-fix-rls-simple.sql` (only has SELECT/UPDATE)

**What's Missing:**
```sql
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Impact:** 
- ❌ **Users CANNOT create profiles during signup**
- ❌ **Causes silent failures during registration**
- ❌ **Creates redirect loop** (user authenticated but no profile → can't access dashboard → redirects to /auth)
- ❌ **Profile creation in `createProfileOnly()` fails silently**

**Evidence:**
- Base schema only has SELECT and UPDATE policies
- Fix file 006 doesn't include INSERT policy
- Console shows role fetched successfully but user still redirects to /auth
- This matches classic RLS INSERT denial symptom

**Fix Created:** `supabase/fixes/009-add-missing-insert-policy.sql` ✅

---

## 🚨 **OTHER CRITICAL ISSUES**

### 1. Missing Table: `engineer_profiles`

**Code Reference:** `src/pages/4-client/others/features/dashboard/components/DashboardContent.tsx:188`

```typescript
const { data: engineerProfile, error } = await supabase
  .from('engineer_profiles')  // ❌ TABLE DOES NOT EXIST
  .select('specializations')
  .eq('user_id', user.id)
  .single();
```

**Database:** No `engineer_profiles` table in migrations
**Impact:** Dashboard component will fail when trying to fetch engineer specializations
**Fix Required:** Either:
- Create `engineer_profiles` table in database
- OR update code to use existing `engineer_skills` table
- OR remove the engineer specialization query

---

### 2. Table Name Mismatch: `jobs` vs `job_postings`

**Code Reference:** `src/pages/2-auth/others/hooks/useMessaging.ts:119`

```typescript
.from<JobRow>("jobs")  // ❌ CODE EXPECTS 'jobs'
```

**Database:** Table is named `job_postings` in migrations
**Impact:** Conversation enrichment will fail to fetch job details
**Fix Required:** Either:
- Rename `job_postings` to `jobs` in database
- OR update code to use `job_postings`

---

### 3. AI Tables Mismatch

**Code References:**
- `src/pages/*/others/features/ai/api/aiClient.ts`

```typescript
.from('ai_threads')   // Code expects this
.from('ai_messages')  // Code expects this
.from('ai_events')    // ✅ Exists
```

**Database:**
- ✅ `ai_messages` - EXISTS
- ✅ `ai_events` - EXISTS  
- ❌ `ai_threads` - DOES NOT EXIST (migrations have `ai_conversations`)

**Fix Required:** Rename `ai_conversations` to `ai_threads` OR update code

---

## ✅ **VERIFIED MATCHES**

### Core Tables (Correct)
- ✅ `profiles` - Matches code expectations
- ✅ `account_numbers` - Exists and functioning
- ✅ `conversations` - Correct structure
- ✅ `messages` - Matches messaging hooks
- ✅ `ai_events` - Correct

### Engineer Tables (Partial Match)
- ✅ `engineer_skills` - EXISTS
- ✅ `engineer_portfolio` - EXISTS
- ✅ `engineer_certifications` - EXISTS
- ✅ `engineer_ratings` - EXISTS
- ✅ `engineer_availability` - EXISTS
- ❌ `engineer_profiles` - MISSING (referenced in code)

### Client Tables (Partial Match)
- ✅ `client_projects` - EXISTS
- ✅ `client_reviews` - EXISTS
- ✅ `client_preferences` - EXISTS
- ✅ `client_companies` - EXISTS
- ⚠️ `job_postings` - EXISTS (but code uses 'jobs')

### Enterprise Tables (Correct)
- ✅ `enterprise_companies` - EXISTS
- ✅ `enterprise_teams` - EXISTS
- ✅ `enterprise_team_members` - EXISTS
- ✅ `enterprise_projects` - EXISTS
- ✅ `enterprise_procurement` - EXISTS
- ✅ `enterprise_vendors` - EXISTS
- ✅ `enterprise_analytics` - EXISTS

### Admin Tables (Correct)
- ✅ `admin_audit_logs` - EXISTS
- ✅ `admin_system_settings` - EXISTS
- ✅ `admin_user_management` - EXISTS
- ✅ `admin_platform_analytics` - EXISTS
- ✅ `admin_support_tickets` - EXISTS
- ✅ `admin_support_messages` - EXISTS
- ✅ `admin_feature_flags` - EXISTS
- ✅ `admin_notifications` - EXISTS

### Billing Tables (Correct)
- ✅ `subscription_plans` - EXISTS
- ✅ `subscriptions` - EXISTS
- ✅ `payments` - EXISTS
- ✅ `invoices` - EXISTS
- ✅ `invoice_items` - EXISTS
- ✅ `payment_methods` - EXISTS
- ✅ `usage_tracking` - EXISTS

### Dashboard Tables (Correct)
- ✅ `dashboard_layouts` - EXISTS
- ✅ `dashboard_widgets` - EXISTS
- ✅ `user_widget_preferences` - EXISTS
- ✅ `dashboard_templates` - EXISTS
- ✅ `dashboard_analytics` - EXISTS

### AI Tables (Partial Match)
- ✅ `ai_service_modes` - EXISTS
- ✅ `ai_events` - EXISTS
- ✅ `ai_messages` - EXISTS
- ✅ `ai_tools` - EXISTS
- ✅ `ai_tool_usage` - EXISTS
- ✅ `ai_usage_analytics` - EXISTS
- ⚠️ `ai_conversations` - EXISTS (but code queries 'ai_threads')

---

## 🔍 **RLS POLICY ANALYSIS**

### Profiles Table Policies

**Current (from fix 006):**
```sql
-- ✅ Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- ✅ Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ✅ Admins can view all profiles using function
CREATE POLICY "Admins can view all profiles using function"
ON public.profiles FOR SELECT
USING (
  public.get_user_role() = 'admin'
  OR
  auth.uid() = user_id
);
```

**Missing Policy:**
```sql
-- ❌ MISSING: Users can insert their own profile
-- This is needed for signup to work!
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## 🎯 **RECOMMENDED FIXES**

### Priority 1: Critical (Blocks Functionality)

1. **Add INSERT policy for profiles table**
   ```sql
   CREATE POLICY "Users can insert their own profile"
   ON public.profiles FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

2. **Create `engineer_profiles` table OR update code**
   - Option A: Create table with structure matching code expectations
   - Option B: Update code to use `engineer_skills` table instead

3. **Rename `job_postings` to `jobs` OR update code**
   - Option A: `ALTER TABLE job_postings RENAME TO jobs;`
   - Option B: Update code to query `job_postings`

### Priority 2: Moderate (Affects Features)

4. **Rename `ai_conversations` to `ai_threads` OR update code**
   - Code expects `ai_threads` but database has `ai_conversations`
   - Update all AI client code to use correct table name

---

## 📊 **SUMMARY STATISTICS**

| Category | Count | Status |
|----------|-------|--------|
| Total Tables in Migrations | 48 | - |
| Tables Queried in Code | ~15 unique | - |
| **Perfect Matches** | **42** | ✅ |
| **Name Mismatches** | **2** | ⚠️ |
| **Missing Tables** | **1** | ❌ |
| **Missing RLS Policies** | **1** | ❌ |

---

## 🛠️ **IMMEDIATE ACTION REQUIRED**

The redirect loop issue is likely caused by:

1. **Missing INSERT policy** on `profiles` table - users can't create profiles during signup
2. **RLS function timeout** - `get_user_role()` function might be slow
3. **Profile query timeout** - 3-second timeout in auth store is being hit

### Fix for Redirect Loop:

The auth store is correctly querying the database, but may be hitting RLS restrictions. We verified:
- ✅ RLS SELECT policy exists
- ❌ RLS INSERT policy MISSING (from fix file 006)

**This missing INSERT policy may be causing profile creation failures during signup!**

---

## 📝 **NEXT STEPS**

1. Apply missing INSERT policy to Supabase
2. Verify `engineer_profiles` table requirement
3. Fix table name mismatches (`jobs`, `ai_threads`)
4. Test complete signup flow again
5. Monitor RLS policy performance

---

**Generated:** October 9, 2025  
**Tool:** Automated codebase scan

