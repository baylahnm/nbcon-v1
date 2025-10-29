# Subscription System Integration

> **Purpose:** Technical guide for activating and maintaining the subscription enforcement infrastructure.

---

## 🏗️ Infrastructure Components

### Core Modules

| Component | File | Status | Purpose |
|-----------|------|--------|---------|
| **Subscription Service** | `src/shared/services/subscriptionService.ts` | ✅ Complete | Tier management, quota enforcement |
| **FeatureGate Component** | `src/components/portal/shared/FeatureGate.tsx` | ✅ Complete | UI gating with upgrade prompts |
| **Auth Store** | `src/pages/2-auth/others/stores/auth.ts` | ✅ Complete | Subscription data persistence |
| **Portal Access Hook** | `src/hooks/usePortalAccess.ts` | ✅ Complete | Permission checking |
| **Portal Registry** | `src/config/portalRegistry.ts` | ⚠️ Ready | Page definitions (awaiting activation) |

---

## 🔧 Subscription Service API

### Core Functions

```typescript
// Get user's full subscription details
const subscription = await getUserSubscription(userId);
// Returns: { tier, status, periodEnd, features, limits, ... }

// Quick tier lookup
const tier = await getUserSubscriptionTier(userId);
// Returns: 'free' | 'basic' | 'pro' | 'enterprise'

// Check feature access
const hasAccess = await hasFeatureAccess('advanced-analytics', userId);
// Returns: boolean

// Check usage quota
const quota = await checkUsageQuota('ai_tokens', userId);
// Returns: { allowed, used, limit, remaining, resetDate }

// Compare tiers
const meetsRequirement = tierMeetsRequirement('pro', 'basic');
// Returns: true (pro >= basic)

// Get upgrade path
const upgrades = getUpgradePath('basic');
// Returns: ['pro', 'enterprise']
```

### Tier Hierarchy

```typescript
const TIER_HIERARCHY = {
  'free': 0,
  'basic': 1,
  'pro': 2,
  'enterprise': 3,
};
```

---

## 🎨 FeatureGate Component Usage

### Full Card Prompt

```tsx
<FeatureGate
  requiredTier="pro"
  featureName="Advanced Analytics"
  featureDescription="Get detailed insights and predictive analytics"
>
  <AnalyticsDashboard />
</FeatureGate>
```

### Inline Banner

```tsx
<FeatureGate
  requiredTier="pro"
  featureName="API Access"
  inline={true}
>
  <APIKeysPanel />
</FeatureGate>
```

### Custom Fallback

```tsx
<FeatureGate
  requiredTier="enterprise"
  fallback={<CustomUpgradeMessage />}
>
  <SSOSettings />
</FeatureGate>
```

---

## 💾 Auth Store Integration

### Subscription Fields

```typescript
interface AuthenticatedUser {
  // ... existing fields
  subscriptionTier?: 'free' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus?: 'active' | 'trialing' | 'past_due' | 'canceled';
  subscriptionPeriodEnd?: Date;
  subscriptionFeatures?: string[];
  subscriptionLimits?: Record<string, number>;
}
```

### Auto-Loading on Login

```typescript
// In auth.ts
export const useAuthStore = create<AuthState>((set, get) => ({
  // ...
  loadSubscriptionData: async () => {
    const user = get().user;
    if (!user) return;
    
    const subscription = await getUserSubscription(user.id);
    
    if (subscription) {
      set({
        user: {
          ...user,
          subscriptionTier: subscription.tier,
          subscriptionStatus: subscription.status,
          subscriptionFeatures: subscription.features,
          subscriptionLimits: subscription.limits,
        }
      });
    } else {
      // Default to free tier
      set({
        user: {
          ...user,
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
        }
      });
    }
  },
}));
```

---

## 🗺️ Portal Registry Configuration

### Page Definition Structure

```typescript
interface PageDefinition {
  id: string;
  title: string;
  path: string;
  icon: string;
  permissions: {
    allowedRoles: UserRole[];
    requiredSubscription?: SubscriptionTier | SubscriptionTier[];
    // ...
  };
  // ...
}
```

### Adding Subscription Requirements

```typescript
// In portalRegistry.ts
{
  id: 'client-ai-assistant',
  title: 'AI Assistant',
  path: '/free/ai',
  icon: 'Bot',
  permissions: {
    allowedRoles: ['client'],
    requiredSubscription: 'pro', // ⚡ Add this field
  },
  category: 'ai-tools',
  // ...
}
```

### Access Enforcement

```typescript
// hasPageAccess() in portalRegistry.ts
export function hasPageAccess(
  page: PageDefinition,
  userRole: UserRole,
  userSubscription?: SubscriptionTier,
  enabledFeatures?: string[]
): boolean {
  // Check role
  if (!page.permissions.allowedRoles.includes(userRole)) {
    return false;
  }
  
  // Check subscription tier
  if (page.permissions.requiredSubscription) {
    const currentTier = userSubscription || 'free';
    
    if (!tierMeetsRequirement(currentTier, page.permissions.requiredSubscription)) {
      return false;
    }
  }
  
  return true;
}
```

---

## ✅ Activation Checklist

### Step 1: Activate Portal Registry Gating

```typescript
// For each page that requires subscription:
// 1. Open src/config/portalRegistry.ts
// 2. Find page definition
// 3. Add requiredSubscription field

// Example: Activate AI Tools gating
{
  id: 'client-ai-tools-planning',
  // ... existing fields
  permissions: {
    allowedRoles: ['client'],
    requiredSubscription: 'pro', // ⚡ ADD THIS
  },
}
```

### Step 2: Add Feature Gates to Components

```tsx
// In page components
import { FeatureGate } from '@/components/portal/shared/FeatureGate';

export function AIToolsPage() {
  return (
    <FeatureGate 
      requiredTier="pro"
      featureName="AI Tools Suite"
    >
      {/* Protected content */}
    </FeatureGate>
  );
}
```

### Step 3: Enforce Quotas in AI RPCs

```typescript
// Before AI RPC calls
const quota = await checkUsageQuota('ai_tokens', userId);

if (!quota.allowed) {
  // Show upgrade prompt or quota exceeded message
  return;
}

// Proceed with AI operation
const result = await aiClient.chat(message);

// Increment usage
await incrementUsage('ai_tokens', tokensUsed, userId);
```

### Step 4: Test Each Tier

- [ ] Run Phase 0: Infrastructure verification
- [ ] Run Phase 1: Free tier diagnostic
- [ ] Run Phase 2: Basic tier diagnostic  
- [ ] Run Phase 3: Pro tier diagnostic
- [ ] Run Phase 4: Enterprise tier diagnostic

---

## 📊 Database Schema Requirements

### Subscription Plans Table

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY,
  plan_type TEXT NOT NULL, -- 'free' | 'basic' | 'premium' | 'enterprise'
  name TEXT NOT NULL,
  price_monthly DECIMAL,
  features JSONB NOT NULL, -- {"ai_assistant": true, ...}
  limits JSONB NOT NULL,   -- {"api_calls": 1000, ...}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES subscription_plans(id),
  subscription_status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Usage Tracking Table

```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🐛 Troubleshooting

### Issue: Subscription Not Loading

**Symptoms:** User shows as 'free' even with active subscription

**Solutions:**
1. Check `loadSubscriptionData()` is called on login
2. Verify Supabase query in `getUserSubscription()`
3. Check `subscription_status = 'active'` filter
4. Confirm plan type mapping (`premium` → `pro`)

### Issue: FeatureGate Not Showing

**Symptoms:** Protected content visible to wrong tier

**Solutions:**
1. Verify `usePortalAccess()` returns correct tier
2. Check `tierMeetsRequirement()` logic
3. Ensure `subscriptionTier` field in user object
4. Validate `requiredTier` prop on FeatureGate

### Issue: Page Access Denied Incorrectly

**Symptoms:** User with correct tier can't access page

**Solutions:**
1. Check `requiredSubscription` field in portalRegistry
2. Verify `hasPageAccess()` function logic
3. Confirm user's `subscriptionTier` is set
4. Check tier hierarchy order

---

## 🔄 Subscription Lifecycle

### 1. User Signs Up

```typescript
// Create free tier subscription
const { data: freePlan } = await supabase
  .from('subscription_plans')
  .select('id')
  .eq('plan_type', 'free')
  .single();

await supabase.from('subscriptions').insert({
  user_id: newUser.id,
  plan_id: freePlan.id,
  subscription_status: 'active',
});
```

### 2. User Upgrades

```typescript
// Stripe webhook handler
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('stripe_price_id', subscription.items.data[0].price.id)
    .single();

  await supabase
    .from('subscriptions')
    .update({
      plan_id: plan.id,
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq('stripe_subscription_id', subscription.id);
}
```

### 3. Quota Reset

```typescript
// Monthly cron job
export async function resetMonthlyQuotas() {
  await supabase
    .from('usage_tracking')
    .update({ usage_count: 0 })
    .lte('period_end', new Date());
}
```

---

## 📚 Related Files

### Core Implementation

- `src/shared/services/subscriptionService.ts` (389 lines)
- `src/components/portal/shared/FeatureGate.tsx` (320 lines)
- `src/pages/2-auth/others/stores/auth.ts` (674 lines)
- `src/hooks/usePortalAccess.ts` (308 lines)
- `src/config/portalRegistry.ts` (1,200 lines)

### Tests

- `tests/unit/subscriptionService.spec.ts` (60+ tests)
- `tests/e2e/subscriptionGating.spec.ts` (E2E scenarios)
- `tests/integration/featureGate.spec.tsx` (Component tests)

### Database

- `supabase/migrations/*_subscription_tables.sql`
- `supabase/seeds/seed_ai_token_quotas.sql`

---

**See Also:**  
- [Tier Descriptions](tiers.md) for feature allocation  
- [Navigation System](navigation.md) for menu configuration  
- [Testing Guide](tests.md) for validation procedures

