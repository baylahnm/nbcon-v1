/**
 * Tier-Aware Sidebar Component
 * 
 * Dynamic navigation sidebar that filters menu items based on user's subscription tier.
 * Replaces role-based sidebar logic with plan-driven visibility.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3)
 */

import React, { useMemo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Lock, 
  ChevronRight, 
  ChevronDown,
  type LucideIcon 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/pages/1-HomePage/others/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/pages/1-HomePage/others/components/ui/collapsible';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { 
  getMenuSectionsForTier, 
  type TierMenuSection,
  type TierMenuItem 
} from '../../config/menuConfig';
import type { SubscriptionTier } from '@/shared/types/subscription';

/**
 * Placeholder function for upgrade modal trigger
 * 
 * TODO: Replace with actual upgrade modal hook/function
 * @param requiredTier - The tier required to access the locked feature
 */
function handleUpgradePrompt(requiredTier: SubscriptionTier): void {
  // Placeholder: In production, this should:
  // 1. Open an upgrade modal dialog
  // 2. Show tier comparison
  // 3. Redirect to Stripe checkout
  console.log(`[Upgrade Modal] User needs to upgrade to ${requiredTier}`);
  
  // Example implementation pattern:
  // const { openUpgradeModal } = useUpgradeModal();
  // openUpgradeModal({ requiredTier });
}

interface TierAwareSidebarProps {
  /** Optional custom className */
  className?: string;
  /** Whether sidebar is collapsible */
  collapsible?: 'offcanvas' | 'icon' | 'none';
}

/**
 * Tier-Aware Sidebar Component
 * 
 * Renders navigation menu filtered by user's subscription tier.
 * Shows locked items with upgrade prompts.
 * 
 * @example
 * ```tsx
 * <TierAwareSidebar collapsible="icon" />
 * ```
 */
export default function TierAwareSidebar({ 
  className,
  collapsible = 'offcanvas'
}: TierAwareSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const { subscriptionTier, isAdmin, canAccessTier } = usePortalAccess();
  
  // Get filtered menu sections based on tier
  // Memoized to avoid re-computation on every render
  const menuSections = useMemo(() => {
    return getMenuSectionsForTier(subscriptionTier);
  }, [subscriptionTier]);
  
  // Track collapsed state for each section
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => {
      // Initialize with sections that have defaultExpanded: false
      const defaultCollapsed = new Set<string>();
      menuSections.forEach((section) => {
        if (section.defaultExpanded === false) {
          defaultCollapsed.add(section.id);
        }
      });
      return defaultCollapsed;
    }
  );
  
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);
  
  // Check if a route is currently active
  const isActiveRoute = useCallback((route: string) => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  }, [location.pathname]);
  
  // Check if user can access a menu item
  const canAccessItem = useCallback((item: TierMenuItem): boolean => {
    return canAccessTier(item.plan);
  }, [canAccessTier]);
  
  // Render a single menu item
  const renderMenuItem = useCallback((item: TierMenuItem) => {
    const accessible = canAccessItem(item);
    const active = isActiveRoute(item.route);
    
    const content = (
      <SidebarMenuButton
        asChild={accessible}
        tooltip={item.label}
        className={cn(
          accessible && "cursor-pointer",
          !accessible && "opacity-60 cursor-not-allowed",
          active && accessible && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
        onClick={accessible ? undefined : () => handleUpgradePrompt(item.plan)}
      >
        {accessible ? (
          <Link to={item.route} className="flex items-center gap-2 w-full">
            <item.icon className="h-4 w-4 shrink-0" />
            {state === 'expanded' && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-accent">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
            {state === 'expanded' && (
              <>
                <span className="flex-1 text-muted-foreground">{item.label}</span>
                <Lock className="h-3 w-3 text-muted-foreground" />
              </>
            )}
          </div>
        )}
      </SidebarMenuButton>
    );
    
    return (
      <SidebarMenuItem key={item.id}>
        {content}
      </SidebarMenuItem>
    );
  }, [canAccessItem, isActiveRoute, state]);
  
  // Render a section with collapsible support
  const renderSection = useCallback((section: TierMenuSection) => {
    const isCollapsed = collapsedSections.has(section.id);
    const hasItems = section.items.length > 0;
    
    if (!hasItems) {
      return null;
    }
    
    // If section is not collapsible or collapsed state is disabled, render flat
    if (!section.collapsible && section.collapsible !== undefined) {
      return (
        <SidebarGroup key={section.id}>
          {section.label && state === 'expanded' && (
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {section.items.map(renderMenuItem)}
          </SidebarMenu>
        </SidebarGroup>
      );
    }
    
    // Collapsible section
    return (
      <SidebarGroup key={section.id}>
        <Collapsible
          open={!isCollapsed}
          onOpenChange={() => toggleSection(section.id)}
          className="group/collapsible"
        >
          {section.label && (
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md px-2 py-1.5 transition-colors">
                <span>{section.label}</span>
                {state === 'expanded' && (
                  isCollapsed ? (
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
                  )
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
            <SidebarMenu>
              {section.items.map(renderMenuItem)}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    );
  }, [collapsedSections, toggleSection, renderMenuItem, state]);
  
  // If no menu sections available, show empty state
  if (menuSections.length === 0) {
    return (
      <Sidebar className={className} collapsible={collapsible}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  No menu items available
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }
  
  return (
    <Sidebar className={className} collapsible={collapsible}>
      <SidebarContent>
        {/* Tier indicator (only when expanded) */}
        {state === 'expanded' && (
          <SidebarGroup>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Plan: <span className="font-medium capitalize">{subscriptionTier}</span>
              {isAdmin && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[10px]">
                  Admin
                </span>
              )}
            </div>
          </SidebarGroup>
        )}
        
        {/* Render all menu sections */}
        {menuSections.map(renderSection)}
      </SidebarContent>
    </Sidebar>
  );
}

// Export named export for convenience
export { TierAwareSidebar };

