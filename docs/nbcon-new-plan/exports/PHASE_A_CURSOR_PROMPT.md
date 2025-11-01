# Phase A: UI Unification — Cursor Implementation Prompt

## Context & Objective

NBCON currently uses **three separate portal layouts** (`ClientLayout`, `EngineerLayout`, `EnterpriseLayout`) with role-based routing (`/free/*`, `/engineer/*`, `/enterprise/*`). 

**Goal:** Consolidate into a **single unified interface** (`AppLayout`) where feature visibility is determined **solely by `subscription_tier`** (Free → Basic → Pro → Enterprise), not user roles.

---

## Implementation Scope

### Phase A Deliverables (from Section 2.3):

1. **`AppLayout.tsx`** — Base container (header + sidebar + content + toolbar slot)
2. **`TierAwareSidebar.tsx`** — Dynamic menu filtered by `subscription_tier`
3. **`UnifiedDashboard.tsx`** — Shared dashboard template for all tiers
4. **`FeatureGate.tsx`** — Wrapper that checks `subscription_tier` and shows upgrade CTA
5. **`CoPilotToolbar.tsx`** — Persistent floating toolbar for AI tools
6. **`menuConfig.ts`** — Single source of truth for navigation (replaces role-based logic)
7. **`AppRouter.tsx`** — Unified tier-aware routing (replaces `/free/*`, `/engineer/*`, `/enterprise/*`)

---

## Current State Analysis

**Existing Components:**
- `src/pages/2-auth/others/layouts/ClientLayout.tsx`
- `src/pages/2-auth/others/layouts/EngineerLayout.tsx`
- `src/pages/2-auth/others/layouts/EnterpriseLayout.tsx`
- `src/router/portalRoutes.tsx` — role-based route generation
- `src/config/portalRegistry.ts` — role-based page definitions
- `src/routes/RoleRouter.tsx` — role-based routing

**Current Access Logic:**
- `src/hooks/usePortalAccess.ts` — checks `user.role` + `subscriptionTier`
- Routes use `UserRole` ('client' | 'engineer' | 'enterprise')
- Navigation filtered by `allowedRoles` in `portalRegistry.ts`

---

## Architecture Requirements

### 1. Unified Layout Structure

```tsx
// Target: src/components/portal/AppLayout.tsx
// Structure:
<AppLayout>
  <AppHeader /> {/* User menu, theme toggle, notifications */}
  <TierAwareSidebar /> {/* Dynamic menu from menuConfig.ts */}
  <main>
    <FeatureGate requiredTier="pro">
      {/* Page content */}
    </FeatureGate>
  </main>
  <CoPilotToolbar /> {/* Floating AI toolbar */}
</AppLayout>
```

### 2. Navigation Configuration

```tsx
// Target: src/config/menuConfig.ts
export const menuConfig = [
  { 
    label: "Overview", 
    icon: LayoutDashboard, 
    route: "/overview", 
    plan: "free" 
  },
  { 
    label: "Projects", 
    icon: Folder, 
    route: "/projects", 
    plan: "free" 
  },
  { 
    label: "AI Tools", 
    icon: CpuChip, 
    route: "/ai-tools", 
    plan: "pro" 
  },
  { 
    label: "Finance", 
    icon: Banknotes, 
    route: "/finance", 
    plan: "pro" 
  },
  { 
    label: "Enterprise Ops", 
    icon: BuildingOffice2, 
    route: "/enterprise", 
    plan: "enterprise" 
  },
];
```

### 3. Access Hook Migration

```tsx
// Current: usePortalAccess() returns userRole
// Target: usePortalAccess() returns subscriptionTier only
const { subscriptionTier, isAdmin } = usePortalAccess();

// Remove all role checks, use tierMeetsRequirement() instead
const visibleItems = menuConfig.filter(
  item => tierMeetsRequirement(subscriptionTier, item.plan)
);
```

### 4. FeatureGate Component

```tsx
// Target: src/components/portal/FeatureGate.tsx
<FeatureGate requiredTier="pro">
  <AIToolsContent />
</FeatureGate>

// If user tier < requiredTier:
// - Show upgrade modal/prompt
// - Do NOT render locked content
```

---

## Implementation Steps

### Step 1: Create `menuConfig.ts`
**Location:** `src/config/menuConfig.ts`
- Define all routes with `plan` requirement (not `role`)
- Reference: `docs/nbcon-new-plan/1 2- 🧭 Menu Navigation 29d608c2eef78029bf41c1f4fff4c343.md`
- Map all 53 pages from `portalRegistry.ts` to tier-based config

### Step 2: Implement `tierMeetsRequirement()` Utility
**Location:** `src/shared/utils/tierUtils.ts`
```tsx
const TIER_HIERARCHY = ['free', 'basic', 'pro', 'enterprise'];

export function tierMeetsRequirement(
  userTier: SubscriptionTier, 
  requiredTier: SubscriptionTier
): boolean {
  return TIER_HIERARCHY.indexOf(userTier) >= 
         TIER_HIERARCHY.indexOf(requiredTier);
}
```

### Step 3: Update `usePortalAccess()` Hook
**Location:** `src/hooks/usePortalAccess.ts`
- Remove `userRole` checks
- Return `{ subscriptionTier, isAdmin, ...permissions }`
- Use `tierMeetsRequirement()` for all access checks

### Step 4: Create `AppLayout.tsx`
**Location:** `src/components/portal/AppLayout.tsx`
- Merge common elements from ClientLayout/EngineerLayout/EnterpriseLayout
- Include header, sidebar slot, content area, toolbar slot
- Support theme switching (light/dark/system)
- Responsive (mobile sidebar collapses)

### Step 5: Create `TierAwareSidebar.tsx`
**Location:** `src/components/portal/TierAwareSidebar.tsx`
- Read from `menuConfig.ts`
- Filter items using `tierMeetsRequirement(subscriptionTier, item.plan)`
- Show locked items with 🔒 icon + upgrade prompt on hover
- Groups: Core, Projects, AI Tools, Finance, Enterprise Ops, Settings

### Step 6: Create `UnifiedDashboard.tsx`
**Location:** `src/components/portal/UnifiedDashboard.tsx`
- Widget-based layout (KPI cards, charts, activity feed)
- Tier-aware widgets (hide/show based on plan)
- Quick actions bar
- Responsive grid

### Step 7: Create/Update `FeatureGate.tsx`
**Location:** `src/components/portal/FeatureGate.tsx`
- Props: `requiredTier`, `children`, `fallback?`
- Check `subscriptionTier` via `usePortalAccess()`
- If locked: show upgrade modal with Stripe checkout link
- If unlocked: render children

### Step 8: Create `CoPilotToolbar.tsx`
**Location:** `src/components/portal/CoPilotToolbar.tsx`
- Floating toolbar (bottom-center or right-side)
- Actions: AI Chat, Quick Actions, Docs, Agents
- Hover cards with descriptions
- Tier-aware actions (lock pro+ features)

### Step 9: Create Unified Router
**Location:** `src/router/AppRouter.tsx`
- Replace role-based routes (`/free/*`, `/engineer/*`, `/enterprise/*`)
- Single route structure: `/dashboard`, `/projects`, `/ai-tools`, etc.
- Use `AppLayout` for all authenticated routes
- Wrap routes with `FeatureGate` where needed

### Step 10: Migration & Cleanup
- Redirect legacy routes (`/free/*` → `/dashboard`, etc.)
- Remove `ClientLayout`, `EngineerLayout`, `EnterpriseLayout`
- Update `portalRegistry.ts` to use tier-based permissions
- Remove all `role` checks from components

---

## Design Rules (Critical)

1. **One Source of Truth:** Menus defined in `menuConfig.ts` only
2. **Plan-Driven Visibility:** Controlled exclusively by `tierMeetsRequirement()`
3. **No Role Forks:** Remove `role` entirely from UI logic
4. **Consistent Toolbar:** `CoPilotToolbar` visible on all routes
5. **Responsive Layout:** Mobile parity with Tailwind breakpoints

---

## Testing Requirements

- Snapshot tests for `AppLayout`, `TierAwareSidebar`, `UnifiedDashboard`
- Unit tests for `tierMeetsRequirement()` logic
- E2E tests for tier-based navigation (Free/Basic/Pro/Enterprise)
- Visual regression tests for layout consistency

---

## Success Criteria

✅ Single `AppLayout` replaces all three portal layouts
✅ Sidebar filters dynamically by `subscription_tier`
✅ All routes accessible via unified paths (no `/free/*`, `/engineer/*`)
✅ `FeatureGate` enforces tier restrictions with upgrade prompts
✅ Zero `role` checks in UI components
✅ CI builds pass (lint, type, tests)

---

## Reference Documents

- Full spec: `docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3) 29d608c2eef780efbc77f0aed3eea0ca.md`
- Menu structure: `docs/nbcon-new-plan/1 2- 🧭 Menu Navigation 29d608c2eef78029bf41c1f4fff4c343.md`
- Access model: `docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4) 29d608c2eef780fd9a40ca180e4a7a6b.md`

---

## Next Steps After Phase A

- Phase B: Migrate database schema (add `subscription_tier`, remove `role`)
- Phase C: Update RLS policies to use `is_admin` + `subscription_tier`
- Phase D: Comprehensive testing suite

---

**Ready for Implementation** — Begin with Step 1 (menuConfig.ts) and proceed sequentially.

