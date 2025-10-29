# 🔐 Supabase Test User Setup Instructions

**Required Before E2E Tests Can Run**

---

## Step 1: Create Auth Users

Go to your Supabase dashboard: https://supabase.com/dashboard/project/joloqygeooyntwxjpxwv

Navigate to **Authentication → Users** and create these 4 users:

### User 1: Free Tier
- **Email:** `free@nbcon.org`
- **Password:** `Test1234@`
- **Auto Confirm:** ✅ Yes

### User 2: Basic Tier
- **Email:** `basic@nbcon.org`
- **Password:** `Test1234@`
- **Auto Confirm:** ✅ Yes

### User 3: Pro Tier
- **Email:** `info@nbcon.org`
- **Password:** `Qazwsx1234@`
- **Auto Confirm:** ✅ Yes (or may already exist)

### User 4: Enterprise Tier
- **Email:** `mahdi.n.baylah@outlook.com`
- **Password:** `Qazwsx1234@`
- **Auto Confirm:** ✅ Yes (or may already exist)

---

## Step 2: Run Subscription Assignment Script

After creating users in Auth, run this SQL in **Supabase SQL Editor**:

```bash
# Navigate to: SQL Editor → New Query
# Paste contents from: database/scripts/create-test-users.sql
# Click "Run" to execute
```

This will:
- ✅ Find the 4 test users by email
- ✅ Assign appropriate subscription plans
- ✅ Initialize AI token quotas per tier
- ✅ Set subscription status to 'active'

---

## Step 3: Verify Setup

Run this verification query in SQL Editor:

```sql
SELECT 
  p.email,
  p.role,
  sp.plan_type as subscription_tier,
  s.subscription_status,
  uq.monthly_token_quota,
  uq.monthly_request_quota
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.user_id
LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
LEFT JOIN user_ai_quotas uq ON uq.user_id = p.user_id
WHERE p.email IN (
  'free@nbcon.org',
  'basic@nbcon.org',
  'info@nbcon.org',
  'mahdi.n.baylah@outlook.com'
)
ORDER BY sp.plan_type;
```

**Expected Output:**

| email | role | subscription_tier | status | token_quota | request_quota |
|-------|------|-------------------|--------|-------------|---------------|
| free@nbcon.org | client | free | active | 10,000 | 100 |
| basic@nbcon.org | client | basic | active | 50,000 | 500 |
| info@nbcon.org | client | premium | active | 200,000 | 2,000 |
| mahdi.n.baylah@outlook.com | enterprise | enterprise | active | 10,000,000 | 10,000 |

---

## Step 4: Enable E2E Tests

Once setup is complete, run:

```bash
pnpm exec playwright test tests/e2e/subscriptionGating.spec.ts
```

All 15 tests should now pass! ✅

---

## Alternative: Use Supabase CLI

If you have Supabase CLI configured:

```bash
# Link to project (if not already)
npx supabase link --project-ref joloqygeooyntwxjpxwv

# Run the seeding script
npx supabase db execute -f database/scripts/create-test-users.sql
```

---

**Status:** ⚠️ Awaiting manual Supabase Auth user creation  
**Time Required:** ~5-10 minutes  
**Next:** Once done, proceed to E2E tests

