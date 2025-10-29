# Unified Navigation System

> **Purpose:** Plan-based sidebar menu configuration and visibility rules for NBCON's subscription tiers.

---

## 🎯 Objective

Design a **unified side navigation menu** that dynamically adjusts based on the user's subscription plan (`free`, `basic`, `pro`, `enterprise`).

### Requirements

- ✅ Scalable and future-proof
- ✅ Easy to maintain and extend
- ✅ Free of role-based conditions (purely plan-based gating)
- ✅ Clear upgrade prompts for locked features

---

## 🧩 Menu Configuration Structure

### TypeScript Definition

```tsx
interface MenuItem {
  label: string;
  route: string;
  icon: string;  // Lucide icon name
  requiredPlan: 'free' | 'basic' | 'pro' | 'enterprise';
  featureKey: string;
  children?: MenuItem[];
}
```

### Example Configuration

```tsx
const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'LayoutDashboard',
    requiredPlan: 'free',
    featureKey: 'dashboard'
  },
  {
    label: 'AI Tools',
    route: '/ai-tools',
    icon: 'Sparkles',
    requiredPlan: 'pro',
    featureKey: 'ai-tools-advanced'
  }
];
```

---

## 🔐 Plan-Based Visibility Logic

### Tier Hierarchy Check

```tsx
function planMeetsRequirement(
  userPlan: SubscriptionTier,
  requiredPlan: SubscriptionTier
): boolean {
  const order = ['free', 'basic', 'pro', 'enterprise'];
  return order.indexOf(userPlan) >= order.indexOf(requiredPlan);
}
```

### Filter Visible Items

```tsx
const { subscriptionTier } = usePortalAccess();

const visibleMenuItems = allMenuItems.filter(item =>
  planMeetsRequirement(subscriptionTier, item.requiredPlan)
);
```

---

## 🚧 Feature Gating with Upgrade Prompts

### FeatureGate Component Usage

```tsx
<FeatureGate 
  requiredTier="pro" 
  featureName="AI Assistant"
  featureDescription="Access specialized AI agents and unlimited AI usage"
>
  <MenuItem label="AI Assistant" route="/ai-assistant" />
</FeatureGate>
```

### Denied Access Behavior

- ✅ Show disabled state or tooltip
- ✅ Redirect to `/subscription` with upgrade CTA
- ✅ Display clear tier requirement message

---

## 🧭 Complete Navigation Structure

### Core Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Overview | `LayoutDashboard` | `/overview` | `free` |
| Dashboard | `PresentationChartBar` | `/dashboard` | `free` |
| Calendar | `Calendar` | `/calendar` | `free` |

### Engineers / Jobs Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Browse Engineers | `Users` | `/engineers` | `basic` |
| Browse Jobs | `Briefcase` | `/jobs` | `free` |
| Post New Job | `PlusCircle` | `/post-job` | `basic` |
| Applications | `DocumentText` | `/applications` | `free` |

### Projects Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Projects | `Folder` | `/projects` | `free` |
| My Projects | `ClipboardDocumentList` | `/my-projects` | `free` |

### AI Tools Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| AI Tools Hub | `CpuChip` | `/ai-tools` | `pro` |
| AI Assistant | `Sparkles` | `/ai-tools/assistant` | `pro` |
| Project Planning | `Bars3BottomLeft` | `/ai-tools/planning` | `pro` |
| Cost & Budgeting | `CurrencyDollar` | `/ai-tools/budgeting` | `pro` |
| Execution & Coordination | `ArrowPath` | `/ai-tools/execution` | `pro` |
| Quality & Compliance | `CheckCircle` | `/ai-tools/quality` | `pro` |
| Communication & Reporting | `ChatBubbleLeftEllipsis` | `/ai-tools/communication` | `pro` |
| Closure & Handover | `ArchiveBoxArrowDown` | `/ai-tools/closure` | `pro` |

### Communication Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Messages | `ChatBubbleOvalLeft` | `/messages` | `basic` |
| Network | `UserGroup` | `/network` | `basic` |

### Learning & Development Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Learning | `BookOpen` | `/learning` | `free` |
| Development | `AcademicCap` | `/development` | `free` |

### Business & Finance Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Finance | `Banknotes` | `/finance` | `pro` |
| Timesheets | `Clock` | `/timesheets` | `pro` |
| Subscription | `CreditCard` | `/subscription` | `free` |

### Enterprise Operations Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Workforce Management | `UsersCog` | `/enterprise/workforce` | `enterprise` |
| Teams Management | `Users` | `/enterprise/teams` | `enterprise` |
| Contracts & Compliance | `DocumentCheck` | `/enterprise/contracts` | `enterprise` |
| Company Profile | `BuildingOffice2` | `/enterprise/profile` | `enterprise` |
| Business Intelligence | `ChartPie` | `/enterprise/bi` | `enterprise` |

### Settings & Support Section

| Label | Icon | Route | Required Plan |
|-------|------|-------|---------------|
| Help | `QuestionMarkCircle` | `/help` | `free` |
| Settings | `Cog6Tooth` | `/settings` | `free` |

---

## 📦 Implementation Checklist

### 1. Menu Configuration File

- [ ] Create `src/config/menuConfig.ts`
- [ ] Define all menu items with `requiredPlan` field
- [ ] Group items into logical sections
- [ ] Add icon mappings

### 2. Visibility Logic

- [ ] Implement `planMeetsRequirement()` helper
- [ ] Wire to `usePortalAccess()` hook
- [ ] Filter menu items in sidebar component
- [ ] Handle nested menu items

### 3. Feature Gating

- [ ] Wrap restricted items with `<FeatureGate>`
- [ ] Add upgrade CTAs to locked items
- [ ] Implement `/subscription` navigation
- [ ] Add tooltips for tier requirements

### 4. Testing

- [ ] Test each tier's visible menu items
- [ ] Verify upgrade prompts appear correctly
- [ ] Test navigation redirects
- [ ] Validate unlock logic on tier upgrades

---

## 🧱 Future-Proofing

### Adding New Features

```tsx
// In menuConfig.ts
{
  label: 'New Feature',
  route: '/new-feature',
  icon: 'Star',
  requiredPlan: 'pro',  // Set appropriate tier
  featureKey: 'new-feature'
}
```

### Adding New Plans

```tsx
// Update tier order in planMeetsRequirement
const order = ['free', 'basic', 'growth', 'pro', 'enterprise'];
```

### Feature Flags

```tsx
interface MenuItem {
  // ... existing fields
  featureFlag?: string;  // Optional feature flag
  betaOnly?: boolean;    // Beta users only
}
```

---

## 📚 Related Files

- **Implementation:** `src/pages/1-HomePage/others/components/layout/AppSidebar.tsx`
- **Registry:** `src/config/portalRegistry.ts`
- **Access Hook:** `src/hooks/usePortalAccess.ts`
- **Feature Gate:** `src/components/portal/shared/FeatureGate.tsx`

---

**See Also:**  
- [Tier Descriptions](tiers.md) for feature allocation  
- [Testing Guide](tests.md) for navigation validation  
- [Integration Guide](integration.md) for `portalRegistry` activation

