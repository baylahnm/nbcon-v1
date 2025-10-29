# 🎯 Unified Tier-Aware Sidebar - Implementation Plan

**Status:** 📋 **PLANNED** (Ready to Execute)  
**Priority:** High  
**Estimated Time:** 8-10 hours  
**Dependencies:** ✅ Subscription system complete

---

## 📊 Executive Summary

Create a unified sidebar navigation system that:
- ✅ Works across all portals (Client, Engineer, Enterprise, Admin)
- ✅ Filters menu items by subscription tier
- ✅ Shows locked indicators for premium features
- ✅ Displays upgrade prompts inline
- ✅ Maintains consistent styling and UX

---

## 🏗️ Architecture

### Component Structure

```
src/
├── config/
│   └── menuConfig.ts          ← NEW: Centralized menu definitions
├── components/
│   └── navigation/
│       ├── AppSidebar.tsx     ← MODIFY: Add tier filtering
│       ├── SidebarItem.tsx    ← NEW: Individual menu item
│       └── SidebarSection.tsx ← NEW: Grouped section
```

---

## 📝 Phase 1: Menu Configuration (2 hours)

### Create `src/config/menuConfig.ts`

```typescript
/**
 * Unified Menu Configuration
 * Centralized navigation structure for all portals
 */

import { LucideIcon } from 'lucide-react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase,
  MessageSquare,
  Network,
  GraduationCap,
  DollarSign,
  Bot,
  Settings,
  HelpCircle,
  // ... more icons
} from 'lucide-react';
import type { UserRole, SubscriptionTier } from '@/shared/types/auth';

// ============================================================================
// TYPES
// ============================================================================

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  
  // Access Control
  roles: UserRole[];                    // Which roles can see this
  requiredTier?: SubscriptionTier;      // Minimum tier required
  featureKey?: string;                  // Optional feature flag
  
  // UI Metadata
  badge?: string | number;              // Badge text/count
  description?: string;                 // Tooltip text
  isNew?: boolean;                      // "New" indicator
  isBeta?: boolean;                     // "Beta" indicator
  
  // Nested Items
  children?: MenuItem[];                // Sub-menu items
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
  collapsible?: boolean;                // Can collapse section
  defaultExpanded?: boolean;            // Initial state
  roles?: UserRole[];                   // Section-level role filter
}

// ============================================================================
// MENU CONFIGURATION
// ============================================================================

/**
 * Client Portal Menu
 */
export const CLIENT_MENU: MenuSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    defaultExpanded: true,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        route: '/free/dashboard',
        roles: ['client'],
      },
      {
        id: 'browse-engineers',
        label: 'Browse Engineers',
        icon: Users,
        route: '/free/browse',
        roles: ['client'],
      },
      {
        id: 'calendar',
        label: 'Calendar',
        icon: Calendar,
        route: '/free/calendar',
        roles: ['client'],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    defaultExpanded: true,
    items: [
      {
        id: 'post-job',
        label: 'Post New Job',
        icon: Briefcase,
        route: '/free/job/new',
        roles: ['client'],
      },
      {
        id: 'my-projects',
        label: 'Projects',
        icon: Briefcase,
        route: '/free/myprojects',
        roles: ['client'],
      },
    ],
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    defaultExpanded: true,
    items: [
      {
        id: 'ai-assistant',
        label: 'AI Assistant',
        icon: Bot,
        route: '/free/ai',
        roles: ['client'],
        requiredTier: 'basic',  // ← Locked for Free users
        featureKey: 'ai_assistant',
      },
      {
        id: 'ai-planning',
        label: 'Project Planning',
        icon: Bot,
        route: '/free/ai-tools/planning',
        roles: ['client'],
        requiredTier: 'pro',    // ← Locked for Free/Basic
        featureKey: 'ai_planning_tools',
      },
      // ... more AI tools
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [
      {
        id: 'messages',
        label: 'Messages',
        icon: MessageSquare,
        route: '/free/messages',
        roles: ['client'],
      },
      {
        id: 'network',
        label: 'Network',
        icon: Network,
        route: '/free/network',
        roles: ['client'],
        requiredTier: 'basic',  // ← Premium feature
      },
    ],
  },
  {
    id: 'development',
    label: 'Development',
    items: [
      {
        id: 'learning',
        label: 'Learning',
        icon: GraduationCap,
        route: '/free/learning',
        roles: ['client'],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    items: [
      {
        id: 'finance',
        label: 'Finance',
        icon: DollarSign,
        route: '/free/finance',
        roles: ['client'],
        requiredTier: 'pro',    // ← Advanced feature
      },
    ],
  },
];

/**
 * Engineer Portal Menu
 */
export const ENGINEER_MENU: MenuSection[] = [
  // Similar structure for engineer portal
  // ... items specific to engineer role
];

/**
 * Enterprise Portal Menu
 */
export const ENTERPRISE_MENU: MenuSection[] = [
  // Similar structure for enterprise portal
  // ... items specific to enterprise role
];

/**
 * Get menu for specific role
 */
export function getMenuForRole(role: UserRole): MenuSection[] {
  switch (role) {
    case 'client':
      return CLIENT_MENU;
    case 'engineer':
      return ENGINEER_MENU;
    case 'enterprise':
      return ENTERPRISE_MENU;
    case 'admin':
      return ADMIN_MENU;
    default:
      return [];
  }
}
```

**Estimated:** 150-200 lines per portal menu × 4 portals = **~700 lines**

---

## 📝 Phase 2: Sidebar Components (3 hours)

### Create `src/components/navigation/SidebarItem.tsx`

```typescript
/**
 * Individual sidebar menu item with tier awareness
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, Crown } from 'lucide-react';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/pages/1-HomePage/others/components/ui/tooltip';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';
import type { MenuItem } from '@/config/menuConfig';
import type { SubscriptionTier } from '@/config/portalTypes';

interface SidebarItemProps {
  item: MenuItem;
  currentTier: SubscriptionTier;
  onUpgradeClick: (item: MenuItem) => void;
}

export function SidebarItem({ item, currentTier, onUpgradeClick }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.route;
  const isLocked = item.requiredTier && !tierMeetsRequirement(currentTier, item.requiredTier);

  if (isLocked) {
    // Locked Item - Shows in sidebar but disabled
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg cursor-not-allowed opacity-60",
              "hover:bg-muted/50 transition-colors"
            )}
            onClick={() => onUpgradeClick(item)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">{item.label}</span>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">
              {item.requiredTier}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-xs">
            Requires {item.requiredTier} tier or higher
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Unlocked Item - Full functionality
  return (
    <Link
      to={item.route}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted/50 text-foreground"
      )}
    >
      <item.icon className={cn(
        "h-4 w-4 flex-shrink-0",
        isActive ? "text-primary-foreground" : "text-muted-foreground"
      )} />
      <span className="text-sm font-medium truncate flex-1">{item.label}</span>
      
      {/* Badges */}
      {item.badge && (
        <Badge className="text-[9px]">
          {item.badge}
        </Badge>
      )}
      {item.isNew && (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">
          New
        </Badge>
      )}
      {item.isBeta && (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
          Beta
        </Badge>
      )}
    </Link>
  );
}
```

**Estimated:** ~120 lines

---

### Create `src/components/navigation/SidebarSection.tsx`

```typescript
/**
 * Collapsible sidebar section with grouped items
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { SidebarItem } from './SidebarItem';
import type { MenuSection, MenuItem } from '@/config/menuConfig';
import type { SubscriptionTier } from '@/config/portalTypes';

interface SidebarSectionProps {
  section: MenuSection;
  currentTier: SubscriptionTier;
  onUpgradeClick: (item: MenuItem) => void;
}

export function SidebarSection({ section, currentTier, onUpgradeClick }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded ?? true);

  return (
    <div className="space-y-1">
      {/* Section Header */}
      {section.collapsible ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.label}
          </span>
          <ChevronDown className={cn(
            "h-3 w-3 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )} />
        </button>
      ) : (
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.label}
          </span>
        </div>
      )}

      {/* Section Items */}
      {isExpanded && (
        <div className="space-y-0.5">
          {section.items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              currentTier={currentTier}
              onUpgradeClick={onUpgradeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Estimated:** ~80 lines

---

## 📝 Phase 3: AppSidebar Integration (2 hours)

### Modify `src/pages/1-HomePage/others/components/layout/AppLayout.tsx`

```typescript
/**
 * Update AppSidebar to use menuConfig
 */

import { usePortalAccess } from '@/hooks/usePortalAccess';
import { getMenuForRole } from '@/config/menuConfig';
import { SidebarSection } from '@/components/navigation/SidebarSection';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';
import { useNavigate } from 'react-router-dom';
import { FeatureGate } from '@/components/portal/shared/FeatureGate';

export function AppSidebar() {
  const navigate = useNavigate();
  const { userPermissions, user } = usePortalAccess();
  const currentRole = user?.role || 'client';
  const currentTier = userPermissions.subscriptionTier || 'free';

  // Get role-specific menu
  const menuSections = getMenuForRole(currentRole);

  // Filter sections by role
  const visibleSections = menuSections.filter(section => {
    if (!section.roles) return true;
    return section.roles.includes(currentRole);
  });

  // Handle upgrade click
  const handleUpgradeClick = (item: MenuItem) => {
    navigate('/subscription', {
      state: {
        feature: item.label,
        requiredTier: item.requiredTier,
        description: item.description,
      },
    });
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex items-center gap-2">
                <div className="bg-primary-gradient h-8 w-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">n.</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">nbcon</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {currentRole} Portal
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Tier Badge (if not free) */}
        {currentTier !== 'free' && (
          <div className="px-3 py-2">
            <Badge className="w-full justify-center bg-primary/10 text-primary border-primary/20 capitalize">
              <Crown className="h-3 w-3 mr-1" />
              {currentTier} Tier
            </Badge>
          </div>
        )}

        {/* Menu Sections */}
        <div className="space-y-4">
          {visibleSections.map((section) => (
            <SidebarSection
              key={section.id}
              section={section}
              currentTier={currentTier}
              onUpgradeClick={handleUpgradeClick}
            />
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        {/* Subscription Upgrade CTA (Free users only) */}
        {currentTier === 'free' && (
          <Card className="mx-2 mb-2 border-dashed border-primary/30">
            <CardContent className="p-3 text-center">
              <Crown className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium mb-1">Unlock Premium Features</p>
              <Button
                size="sm"
                className="w-full h-7 text-xs"
                onClick={() => navigate('/subscription')}
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  {/* User avatar and info */}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/subscription')}>
                  Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
```

**Changes Required:**
- Import menuConfig functions
- Add tier filtering logic
- Replace hardcoded menu items with dynamic rendering
- Add locked state handling
- Add upgrade CTA for free users

**Estimated:** 200-250 lines modified

---

## 📝 Phase 4: Page-Level Feature Gates (2 hours)

### Wrap Gated Pages with FeatureGate

**Example: AI Assistant Page**

```typescript
// src/pages/4-free/8-AIAssistantPage.tsx

import { FeatureGate } from '@/components/portal/shared/FeatureGate';

export default function AIAssistantPage() {
  return (
    <FeatureGate
      requiredTier="basic"
      featureName="AI Assistant"
      featureDescription="Get AI-powered insights and assistance for your projects"
    >
      {/* Existing AI Assistant content */}
      <AIAssistantContent />
    </FeatureGate>
  );
}
```

**Pages to Wrap:**

**Client Portal:**
- `8-AIAssistantPage.tsx` → Basic tier
- `15-AIToolsPlanningPage.tsx` → Pro tier
- `10-FinancePage.tsx` → Pro tier
- `6-NetworkPage.tsx` → Basic tier

**Engineer Portal:**
- `5-AIAssistantPage.tsx` → Basic tier
- `8-FinancePage.tsx` → Pro tier
- Similar pattern

**Estimated:** ~20 minutes per page × 8 pages = **~3 hours**

---

## 📝 Phase 5: Upgrade Flow Integration (1 hour)

### Create Upgrade Modal

```typescript
/**
 * src/components/portal/shared/UpgradeModal.tsx
 */

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  requiredTier: SubscriptionTier;
  description?: string;
}

export function UpgradeModal({ isOpen, onClose, feature, requiredTier, description }: UpgradeModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Upgrade Required
          </DialogTitle>
          <DialogDescription>
            {feature} requires {requiredTier} tier or higher
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {description || `Unlock ${feature} and many more features by upgrading your subscription.`}
          </p>

          {/* Feature highlights */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-xs font-semibold">What's included:</p>
            <ul className="text-xs space-y-1">
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                {feature}
              </li>
              {/* More benefits */}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={() => {
            navigate('/subscription');
            onClose();
          }}>
            <Crown className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Estimated:** ~100 lines

---

## 📝 Phase 6: Testing (2 hours)

### Create Test Files

**1. `tests/integration/sidebarFiltering.test.tsx`**

```typescript
describe('Sidebar Tier Filtering', () => {
  it('should hide pro features for free users', () => {
    // Mock free tier user
    renderSidebar({ tier: 'free' });
    
    expect(screen.queryByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText('pro')).toBeInTheDocument(); // Badge
    expect(screen.getByTestId('locked-icon')).toBeInTheDocument();
  });

  it('should show all features for enterprise users', () => {
    renderSidebar({ tier: 'enterprise' });
    
    expect(screen.queryByTestId('locked-icon')).not.toBeInTheDocument();
    expect(screen.queryByText(/upgrade/i)).not.toBeInTheDocument();
  });

  it('should navigate to subscription page on locked item click', async () => {
    renderSidebar({ tier: 'free' });
    
    const lockedItem = screen.getByText('Advanced Analytics').closest('div');
    fireEvent.click(lockedItem);
    
    expect(mockNavigate).toHaveBeenCalledWith('/subscription', expect.any(Object));
  });
});
```

**2. `tests/e2e/sidebarNavigation.spec.ts`**

```typescript
test.describe('Sidebar Navigation with Tier Gating', () => {
  test('free user sees locked indicators', async ({ page }) => {
    await loginAs(page, 'free');
    
    // Check for lock icons
    const lockedItems = page.locator('[data-testid="sidebar-item-locked"]');
    expect(await lockedItems.count()).toBeGreaterThan(0);
    
    // Click locked item
    await lockedItems.first().click();
    
    // Should navigate to subscription page
    await expect(page).toHaveURL(/\/subscription/);
  });

  test('pro user can access pro features', async ({ page }) => {
    await loginAs(page, 'pro');
    
    // No locked items for pro features
    const analyticsLink = page.locator('a:has-text("Advanced Analytics")');
    expect(await analyticsLink.isEnabled()).toBe(true);
    
    // Can navigate
    await analyticsLink.click();
    await expect(page).toHaveURL(/\/analytics/);
  });
});
```

**Estimated:** 15 test cases × ~20 lines each = **~300 lines**

---

## 📝 Phase 7: Documentation (1 hour)

### Update `docs/2-ARCHITECTURE_GUIDE.md`

Add section:

```markdown
## 🧭 Unified Sidebar Navigation

### Menu Configuration System

All portal navigation is centralized in `src/config/menuConfig.ts`.

**Structure:**
```typescript
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  roles: UserRole[];
  requiredTier?: SubscriptionTier;  // ← Tier gating
  featureKey?: string;
}
```

**Usage:**
```typescript
import { getMenuForRole } from '@/config/menuConfig';

const menu = getMenuForRole('client');
// Returns filtered menu for client portal
```

### Tier-Aware Menu Items

**Free Tier:**
- Sees all menu items
- Locked items show 🔒 icon + tier badge
- Clicking locked item → Upgrade modal

**Pro Tier:**
- All Pro+ items unlocked
- Only Enterprise items locked
- Full navigation access

**Visual States:**
- **Unlocked:** Full color icon, clickable
- **Locked:** Lock icon, badge, disabled, tooltip
- **Active:** Highlighted background, bold text
```

---

## 🎯 Success Criteria

### Functional Requirements ✅

- [ ] Menu items filter by user role
- [ ] Menu items lock by subscription tier
- [ ] Locked items show visual indicators (lock icon, badge)
- [ ] Locked items show upgrade modal on click
- [ ] Active route highlighted correctly
- [ ] Tier badge displays for paid users
- [ ] Upgrade CTA appears for free users
- [ ] All transitions smooth (no jarring changes)

### Technical Requirements ✅

- [ ] Type-safe with full TypeScript
- [ ] 0 linter errors
- [ ] Responsive (mobile collapse)
- [ ] Theme-agnostic (works with all 11 themes)
- [ ] Accessibility compliant (ARIA labels, keyboard nav)
- [ ] Performance (<100ms render)

### Test Requirements ✅

- [ ] 15+ integration tests written
- [ ] 10+ E2E scenarios written
- [ ] All tests passing
- [ ] Coverage >80%

---

## 📊 Estimated Effort

### Time Breakdown

```
Phase 1: Menu Configuration      2 hours
Phase 2: Sidebar Components      3 hours
Phase 3: AppSidebar Integration  2 hours
Phase 4: Page-Level Gates        3 hours (already partially done)
Phase 5: Upgrade Flow            1 hour
Phase 6: Testing                 2 hours
Phase 7: Documentation           1 hour
─────────────────────────────────────────
Total:                           14 hours
```

### Resource Requirements

- **Developer:** 1 senior frontend developer
- **Reviewer:** 1 senior developer (2 hours)
- **QA:** 1 QA engineer (3 hours)

---

## 🚀 Implementation Order

### Sprint Plan (2-day sprint)

**Day 1 (6 hours):**
1. Morning: Create menuConfig.ts (all portals)
2. Morning: Create SidebarItem + SidebarSection components
3. Afternoon: Integrate into AppSidebar
4. Afternoon: Test in browser (all 4 portals)

**Day 2 (4 hours):**
1. Morning: Wrap gated pages with FeatureGate
2. Morning: Create UpgradeModal
3. Afternoon: Write integration tests
4. Afternoon: Write E2E tests

**Post-Sprint (2 hours):**
1. Code review
2. Documentation update
3. Final testing
4. Deploy to staging

---

## ⚠️ Risks & Mitigations

### Risk 1: Breaking Existing Navigation

**Mitigation:**
- Implement behind feature flag `ENABLE_UNIFIED_SIDEBAR=false`
- Keep old sidebar code intact
- Gradual rollout (1 portal at a time)
- Easy rollback with flag

### Risk 2: Performance Impact

**Mitigation:**
- Memoize menu filtering with `useMemo()`
- Keep menuConfig static (no API calls)
- Lazy load upgrade modal
- Measure render time (<100ms target)

### Risk 3: Incomplete Tier Data

**Mitigation:**
- Default to 'free' tier if subscription not loaded
- Fail-open design (show all, lock appropriately)
- Loading state while subscription loads
- Retry logic for failed subscription fetch

---

## ✅ Pre-Implementation Checklist

Before starting implementation:

- [x] Subscription system complete
- [x] `tierMeetsRequirement()` function available
- [x] `usePortalAccess()` hook functional
- [x] `FeatureGate` component ready
- [x] Database schema supports subscriptions
- [ ] All 4 portal routes documented
- [ ] Icon library includes all needed icons
- [ ] Design approved (locked state UI)

---

## 📝 Post-Implementation Checklist

After implementation:

- [ ] All portals use unified sidebar
- [ ] Tier gating works correctly
- [ ] Locked items show upgrade prompts
- [ ] Navigation smooth and fast
- [ ] 0 TypeScript errors
- [ ] All tests passing (25+ cases)
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Deployed to staging
- [ ] User acceptance testing complete

---

## 🎯 Expected Outcomes

### User Experience

**Free User:**
- Sees full menu structure (transparency)
- Locked items clearly indicated (lock icon + badge)
- One-click access to upgrade flow
- Professional, non-intrusive prompts

**Pro User:**
- Clean menu (no locks for accessible features)
- Only enterprise features locked
- Smooth navigation experience

**Enterprise User:**
- Complete access
- No restrictions
- Full feature set

### Developer Experience

- Single source of truth for navigation
- Easy to add new menu items
- Type-safe configuration
- Testable and maintainable

### Business Outcomes

- Clear upgrade paths
- Increased conversion to paid tiers
- Reduced support (self-service discovery)
- Data-driven feature rollout

---

## 📚 Reference Implementation

### Similar Systems

**Notion:**
- Sidebar shows all features
- Locked features have 🔒 icon
- Click → Inline upgrade prompt

**Figma:**
- Free users see grayed-out premium tools
- Tooltip explains tier requirement
- Click → Modal with pricing

**Slack:**
- Free workspaces see "Upgrade" badges
- Premium features listed but disabled
- Prominent upgrade CTA in sidebar footer

---

## 🎉 Status

**Plan Status:** ✅ READY TO EXECUTE  
**Dependencies:** ✅ All met (subscription system complete)  
**Estimated Time:** 14 hours  
**Priority:** High  
**Complexity:** Medium  

**Recommendation:** Implement in next sprint after current phase fully deployed and validated.

---

**Plan Created:** October 28, 2025  
**Last Updated:** October 28, 2025  
**Maintained By:** Development Team

