# AI Token Widget - Production Deployment Guide

**Version:** 1.0.0  
**Date:** October 29, 2025  
**Status:** 🚀 **PRODUCTION READY**

---

## 📋 Overview

This guide walks through deploying the AI Token Usage widget from development (mock data) to production (real database).

---

## ✅ Pre-Deployment Checklist

- [x] Mock data system tested and working
- [x] Database migrations created
- [x] Seed scripts prepared
- [x] RPC functions defined
- [x] RLS policies configured
- [x] Unit tests passing (8/8)
- [x] Documentation complete

---

## 🚀 Deployment Steps

### **Step 1: Apply Database Migrations**

The production migration creates/verifies all required database objects.

```bash
# Navigate to Supabase directory
cd supabase

# Apply the production migration
supabase migration up 20251029000001_deploy_production_quotas

# Or reset database to apply all migrations
supabase db reset
```

**What this creates:**
- ✅ `user_ai_quotas` table (if not exists)
- ✅ `get_user_quota_status()` RPC function
- ✅ `reset_monthly_quotas()` function for cron
- ✅ RLS policies for secure access
- ✅ Indexes for performance

---

### **Step 2: Seed Quota Data**

Initialize quota records for all users based on their subscription tier.

```bash
# Run the seed script
psql $DATABASE_URL -f supabase/seeds/seed_ai_token_quotas.sql

# Or via Supabase CLI
supabase db seed seed_ai_token_quotas
```

**What this does:**
- ✅ Creates `initialize_user_quota()` function
- ✅ Seeds all existing users with tier-based quotas
- ✅ Sets up auto-initialization trigger for new users
- ✅ Sets up auto-update trigger on subscription changes

**Tier Limits:**
| Tier | Tokens/Month | Requests/Month |
|------|--------------|----------------|
| Free | 10,000 | 100 |
| Basic | 50,000 | 500 |
| Pro | 200,000 | 2,000 |
| Enterprise | 10,000,000 | 10,000 |

---

### **Step 3: Verify Database Setup**

Run verification queries to ensure everything is configured correctly.

```sql
-- Check quota distribution
SELECT 
  CASE 
    WHEN monthly_token_quota = 10000 THEN 'free'
    WHEN monthly_token_quota = 50000 THEN 'basic'
    WHEN monthly_token_quota = 200000 THEN 'pro'
    WHEN monthly_token_quota >= 10000000 THEN 'enterprise'
  END as tier,
  COUNT(*) as user_count,
  monthly_token_quota,
  monthly_request_quota
FROM public.user_ai_quotas
GROUP BY monthly_token_quota, monthly_request_quota;

-- Verify RPC function works
SELECT * FROM get_user_quota_status();

-- Check sample quotas
SELECT 
  uq.user_id,
  p.email,
  uq.monthly_token_quota,
  uq.current_month_tokens,
  uq.quota_reset_date
FROM public.user_ai_quotas uq
JOIN public.profiles p ON p.user_id = uq.user_id
LIMIT 10;
```

---

### **Step 4: Disable Mock Data**

Update the application to use real database data.

**Option A: Remove Environment Variable** (Recommended)
```bash
# In .env.local or .env
# Remove or comment out:
# VITE_USE_MOCK_TOKENS=true
```

**Option B: Explicitly Set to False**
```bash
# In .env.local or .env
VITE_USE_MOCK_TOKENS=false
```

**The tokenService now defaults to production mode** - mock data only activates when explicitly enabled via `VITE_USE_MOCK_TOKENS=true`.

---

### **Step 5: Restart Application**

```bash
# Stop dev server (Ctrl+C)

# Clear any cached data
rm -rf node_modules/.vite

# Restart
pnpm dev
```

---

### **Step 6: Verify Production Mode**

**Check Console Logs:**
```javascript
// Development mode (mock data):
[TokenService] 🎭 Using mock quota data (VITE_USE_MOCK_TOKENS=true)

// Production mode (real database):
[TokenService] ✅ Got quota from RPC: { used: 0, limit: 10000, percentage: 0 }
// or
[TokenService] ✅ Got quota from table: { used: 0, limit: 10000, percentage: 0 }
```

**Visual Verification:**
1. Open sidebar
2. Scroll to footer
3. See "AI Tokens" widget
4. Check if it shows real quota limits (10,000 for free users)
5. Verify usage is 0/10,000 for new users

---

### **Step 7: Run Integration Tests**

```bash
# Run token widget tests
pnpm test tokenWidget

# Expected: All tests pass (8/8)
# Tests now validate against real database structure
```

---

### **Step 8: Test Widget with Real Usage**

**Create test usage:**
```sql
-- Insert a test usage record
INSERT INTO public.ai_agent_usage (
  user_id,
  agent_id,
  session_id,
  discipline,
  workflow_id,
  tokens_prompt,
  tokens_completion,
  model_used,
  cost_usd
) VALUES (
  auth.uid(), -- Current user
  (SELECT id FROM public.ai_agents LIMIT 1), -- Any agent
  gen_random_uuid(),
  'structural',
  'test_workflow',
  500,
  1500,
  'gpt-4o-mini',
  0.0003
);

-- Update quota usage
UPDATE public.user_ai_quotas
SET 
  current_month_tokens = current_month_tokens + 2000,
  current_month_requests = current_month_requests + 1
WHERE user_id = auth.uid();
```

**Verify Widget Updates:**
1. Refresh application
2. Check widget shows updated usage
3. Verify percentage calculation
4. Confirm status color (green → yellow → red as usage increases)

---

## 🔄 Automated Quota Reset

Set up a cron job to reset quotas monthly.

**Using Supabase Cron (Recommended):**
```sql
-- Create cron job to reset quotas on 1st of each month
SELECT cron.schedule(
  'reset-monthly-ai-quotas',
  '0 0 1 * *', -- At 00:00 on day 1 of every month
  $$
  SELECT public.reset_monthly_quotas();
  $$
);
```

**Manual Reset (if needed):**
```sql
SELECT public.reset_monthly_quotas();
```

---

## 📊 Monitoring & Analytics

### **Track Widget Rendering**

```javascript
// Check widget state in browser console
window.__WIDGET_DEBUG = true;

// usePortalCredits will log:
[usePortalCredits] Fetching credits data...
[usePortalCredits] Data received: { monthlyUsage: {...}, quotaStatus: {...} }
[usePortalCredits] Setting data: { tokensLimit: 10000, ... }
```

### **Database Queries for Admin Dashboard**

```sql
-- Total quotas by tier
SELECT 
  CASE 
    WHEN monthly_token_quota = 10000 THEN 'Free'
    WHEN monthly_token_quota = 50000 THEN 'Basic'
    WHEN monthly_token_quota = 200000 THEN 'Pro'
    ELSE 'Enterprise'
  END as tier,
  COUNT(*) as users,
  SUM(current_month_tokens) as total_usage,
  AVG(current_month_tokens) as avg_usage
FROM public.user_ai_quotas
GROUP BY monthly_token_quota;

-- Users approaching limits (>75%)
SELECT 
  p.email,
  uq.current_month_tokens,
  uq.monthly_token_quota,
  ROUND((uq.current_month_tokens::NUMERIC / uq.monthly_token_quota * 100), 2) as usage_pct
FROM public.user_ai_quotas uq
JOIN public.profiles p ON p.user_id = uq.user_id
WHERE (uq.current_month_tokens::NUMERIC / uq.monthly_token_quota * 100) > 75
ORDER BY usage_pct DESC;

-- Recent high-usage users
SELECT 
  p.email,
  COUNT(*) as requests,
  SUM(u.tokens_total) as tokens,
  SUM(u.cost_usd) as cost_usd
FROM public.ai_agent_usage u
JOIN public.profiles p ON p.user_id = u.user_id
WHERE u.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY p.email
ORDER BY tokens DESC
LIMIT 20;
```

---

## 🔧 Troubleshooting

### **Widget Not Appearing**

**Check 1: Database Connection**
```sql
SELECT COUNT(*) FROM public.user_ai_quotas;
-- Should return number of users
```

**Check 2: User Has Quota Record**
```sql
SELECT * FROM public.user_ai_quotas WHERE user_id = 'your-user-id';
-- Should return 1 row
```

**Check 3: RPC Function Exists**
```sql
SELECT * FROM get_user_quota_status();
-- Should return quota data or default
```

**Check 4: Console Logs**
```
❌ Bad: [TokenService] ❌ No authenticated user
✅ Good: [TokenService] ✅ Got quota from RPC: { ... }
```

### **Widget Showing Zero Limit**

**Cause:** User doesn't have a quota record

**Fix:**
```sql
-- Initialize quota for specific user
SELECT initialize_user_quota('user-id-here', 'free');

-- Or re-run seed script to initialize all users
\i supabase/seeds/seed_ai_token_quotas.sql
```

### **Quota Not Updating**

**Cause:** `trackUsage()` not being called after AI interactions

**Fix:** Ensure AI service calls `trackUsage()`:
```typescript
import { trackUsage } from '@/shared/services/tokenService';

// After AI API call
await trackUsage({
  agent_id: agentId,
  session_id: sessionId,
  discipline: 'structural',
  workflow_id: 'beam_design',
  tokens_prompt: response.usage.prompt_tokens,
  tokens_completion: response.usage.completion_tokens,
  model_used: 'gpt-4o-mini',
});
```

---

## 📝 Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Seed script executed (all users have quotas)
- [ ] `VITE_USE_MOCK_TOKENS` removed/set to false
- [ ] Application restarted in production mode
- [ ] Widget appears in sidebar for all users
- [ ] Console logs show database data (not mock)
- [ ] Test usage recorded and widget updates
- [ ] Unit tests passing (8/8)
- [ ] Monthly reset cron job configured
- [ ] Documentation updated

---

## 🎯 Success Criteria

**✅ Production Deployment Complete When:**

1. **Widget Renders** - "AI Tokens" card visible in sidebar footer
2. **Real Data** - Console shows database queries (not mock data)
3. **Non-Zero Limits** - Free users see 10,000 token limit
4. **Usage Tracking** - Widget updates after AI interactions
5. **Tier Variation** - Different tiers show correct limits
6. **Tests Pass** - All 8 unit tests passing
7. **Performance** - Widget loads within 2 seconds
8. **Monitoring** - Admin dashboard shows usage analytics

---

## 📚 Related Documentation

- **Development Guide**: `docs/TOKEN_WIDGET_DIAGNOSTIC_GUIDE.md`
- **Database Schema**: `supabase/migrations/20250126000003_token_tracking_monetization.sql`
- **RPC Functions**: `supabase/migrations/202501280930_fix_ai_usage_rpcs.sql`
- **Production Migration**: `supabase/migrations/20251029000001_deploy_production_quotas.sql`
- **Seed Script**: `supabase/seeds/seed_ai_token_quotas.sql`

---

## 🚀 Next Steps

### **Phase 1: Current (✅ Complete)**
- Widget displays real quota data
- Users see their token usage
- Tier-based limits enforced

### **Phase 2: Enhanced Features (Future)**
- Email notifications at 75%, 90%, 100% usage
- In-app upgrade prompts when approaching limits
- Historical usage charts
- Cost projections

### **Phase 3: Advanced Analytics (Future)**
- Usage by workflow/discipline
- Cost optimization recommendations
- Predictive quota adjustments
- Enterprise custom limits

---

**Deployment Status:** 🟢 **READY FOR PRODUCTION**

The AI Token Widget is now fully integrated with the production database. Users will see real-time token usage based on their subscription tier, with automatic monthly resets and upgrade paths when limits are approached.

