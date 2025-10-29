# 🧭 Unified Sidebar - Usage Guide

**Version:** 1.0.0  
**Status:** ✅ **IMPLEMENTED** - Ready to Use  
**Last Updated:** October 28, 2025

---

## 🚀 QUICK START

### Enable Tier-Aware Sidebar

```typescript
// In src/pages/1-HomePage/others/components/layout/AppLayout.tsx

import { TierAwareAppSidebar } from '@/components/navigation/TierAwareAppSidebar';

// Replace existing AppSidebar with:
<TierAwareAppSidebar />
```

That's it! The sidebar now uses menuConfig and enforces tier-based gating.

---

## 📝 ADDING MENU ITEMS

### Step 1: Add to menuConfig.ts

```typescript
// src/config/menuConfig.ts

export const CLIENT_MENU: MenuSection[] = [
  {
    id: 'my-section',
    label: 'My Section',
    defaultExpanded: true,
    items: [
      {
        id: 'my-feature',
        label: 'My Feature',
        description: 'Description shown in tooltip',
        icon: Star,                    // Lucide icon
        route: '/free/my-feature',
        roles: ['client'],
        requiredTier: 'pro',           // ← Locked for Free/Basic
        featureKey: 'my_feature',      // Optional
        isNew: true,                   // Shows "New" badge
      },
    ],
  },
];
```

### Step 2: That's It!

The sidebar automatically:
- ✅ Filters by role
- ✅ Locks items by tier
- ✅ Shows upgrade prompts
- ✅ Handles navigation

No additional code needed!

---

## 🎨 VISUAL CUSTOMIZATION

### Menu Item States

**Free Features (no requiredTier):**
```typescript
{
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard,
  route: '/free/dashboard',
  roles: ['client'],
  // No requiredTier = accessible to all
}
```

**Premium Features (with requiredTier):**
```typescript
{
  id: 'analytics',
  label: 'Advanced Analytics',
  icon: BarChart,
  route: '/free/analytics',
  roles: ['client'],
  requiredTier: 'pro',  // ← Locked for Free/Basic users
}
```

**New Features (with isNew):**
```typescript
{
  id: 'feature',
  label: 'New Feature',
  icon: Sparkles,
  route: '/free/feature',
  roles: ['client'],
  isNew: true,  // ← Shows green "New" badge
}
```

**Beta Features (with isBeta):**
```typescript
{
  id: 'beta',
  label: 'Beta Feature',
  icon: Flask,
  route: '/free/beta',
  roles: ['client'],
  isBeta: true,  // ← Shows blue "Beta" badge
}
```

**Coming Soon (with comingSoon):**
```typescript
{
  id: 'future',
  label: 'Future Feature',
  icon: Rocket,
  route: '/free/future',
  roles: ['client'],
  comingSoon: true,  // ← Disabled, shows "Soon" badge
}
```

---

## 🔐 TIER-BASED GATING

### Tier Hierarchy

```
Level 0: free       → No restrictions, all free features
Level 1: basic      → Unlocks basic tier items
Level 2: pro        → Unlocks basic + pro tier items
Level 3: enterprise → Unlocks all items
```

### What Users See

**Free User:**
```
📊 Dashboard          ← Accessible
📊 Browse Engineers   ← Accessible
🔒 AI Assistant [basic]   ← Locked, shows upgrade on click
🔒 Analytics [pro]        ← Locked, shows upgrade on click
```

**Pro User:**
```
📊 Dashboard          ← Accessible
🤖 AI Assistant       ← Accessible
📊 Analytics          ← Accessible
🔒 Team Mgmt [enterprise] ← Locked for enterprise only
```

**Enterprise User:**
```
📊 Dashboard          ← Accessible
🤖 AI Assistant       ← Accessible
📊 Team Management    ← Accessible
(No locked items)
```

---

## 🎯 BEST PRACTICES

### 1. Use Descriptive Labels

```typescript
// ❌ Bad
label: 'AI'

// ✅ Good
label: 'AI Assistant'
description: 'Chat with AI for project insights'
```

### 2. Group Related Items

```typescript
// ✅ Group AI features together
{
  id: 'ai-tools',
  label: 'AI Tools',
  items: [
    { id: 'ai-assistant', ... },
    { id: 'ai-planning', ... },
    { id: 'ai-budgeting', ... },
  ]
}
```

### 3. Set Appropriate Tiers

```typescript
// ✅ Basic features for paid users
{ id: 'ai-chat', requiredTier: 'basic' }

// ✅ Advanced features for pro users
{ id: 'analytics', requiredTier: 'pro' }

// ✅ Admin/team features for enterprise
{ id: 'team-mgmt', requiredTier: 'enterprise' }
```

### 4. Use Feature Keys for Flags

```typescript
{
  id: 'experimental',
  label: 'Experimental Feature',
  featureKey: 'enable_experimental',  // Check in runtime
  ...
}
```

---

## 🧪 TESTING YOUR CHANGES

### After Adding Menu Items

```bash
# 1. Run unit tests
pnpm test tests/unit/menuFiltering.test.ts

# 2. Check in browser (all tiers)
# → Login as free user
# → Verify locked items show correctly
# → Click locked item, verify upgrade prompt
# → Login as pro user
# → Verify locked items reduced
```

### Validation Checklist

- [ ] Item appears in correct section
- [ ] Icon displays correctly
- [ ] Route navigates to correct page
- [ ] Tier gating works (if requiredTier set)
- [ ] Tooltip shows on hover (locked items)
- [ ] Upgrade prompt shows on click (locked items)
- [ ] Active state highlights correctly
- [ ] Badges display properly

---

## 🔧 TROUBLESHOOTING

### Item Not Showing

**Check:**
1. `roles` array includes current user role
2. Item not filtered by section.roles
3. Section is expanded (defaultExpanded: true)

### Item Not Locked (Should Be)

**Check:**
1. `requiredTier` is set correctly
2. `tierMeetsRequirement()` function working
3. Current tier is actually lower

### Upgrade Prompt Not Opening

**Check:**
1. `onLockedClick` handler passed to SidebarSection
2. SidebarUpgradePrompt component mounted
3. State management working (upgradePromptItem)

---

## 📊 EXAMPLES

### Add AI Tool to Client Menu

```typescript
// In CLIENT_MENU, find 'ai-tools' section
{
  id: 'ai-tools',
  label: 'AI Tools',
  items: [
    // ... existing items
    {
      id: 'ai-cost-optimizer',        // ← NEW
      label: 'Cost Optimizer',
      description: 'AI-powered cost optimization',
      icon: DollarSign,
      route: '/free/ai-tools/cost-optimizer',
      roles: ['client'],
      requiredTier: 'pro',
      isNew: true,
    },
  ],
}
```

### Add Enterprise-Only Feature

```typescript
{
  id: 'team-analytics',
  label: 'Team Analytics',
  description: 'Advanced team performance metrics',
  icon: Users,
  route: '/enterprise/team-analytics',
  roles: ['enterprise'],
  requiredTier: 'enterprise',  // ← Only enterprise users
}
```

---

## ✅ QUICK REFERENCE

### Key Files

- **Config:** `src/config/menuConfig.ts`
- **Components:** `src/components/navigation/`
- **Types:** See menuConfig.ts interfaces
- **Tests:** `tests/unit/menuFiltering.test.ts`

### Key Functions

```typescript
import { getMenuForRole, getAllMenuItems, countLockedItems } from '@/config/menuConfig';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';

// Get menu
const menu = getMenuForRole('client');

// Count locked items
const locked = countLockedItems('client', 'free'); // e.g., 8

// Check tier
const canAccess = tierMeetsRequirement('free', 'basic'); // false
```

---

**Questions?** See `3-UNIFIED_SIDEBAR_DESIGN.md` for complete design details.

