/**
 * Unified Portal Architecture - Type Definitions
 * 
 * Complete TypeScript type system for portal registry, navigation,
 * permissions, and routing across Client, Engineer, and Enterprise portals.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import type { UserRole } from '@/shared/types/auth';
import type { SubscriptionTier } from '@/shared/types/subscription';
import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * Portal categories for navigation grouping
 */
export type PortalCategory =
  | 'overview'
  | 'dashboard'
  | 'browse'
  | 'calendar'
  | 'projects'
  | 'ai-tools'
  | 'communication'
  | 'development'
  | 'business'
  | 'support';

/**
 * Page permission configuration
 */
export interface PagePermissions {
  allowedRoles: UserRole[];
  requiredSubscription?: SubscriptionTier | SubscriptionTier[];
  requiredFeatureFlags?: string[];
  minProjectPhase?: string;
  customCheck?: (user: unknown) => boolean;
}

/**
 * Page badge configuration
 */
export interface PageBadge {
  text: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  condition?: (user: unknown) => boolean; // Show badge conditionally
}

/**
 * Page definition in portal registry
 */
export interface PageDefinition {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string; // Lucide icon name
  component: string; // Component import path
  lazyComponent?: LazyExoticComponent<ComponentType<unknown>>; // Lazy-loaded component
  permissions: PagePermissions;
  category: PortalCategory;
  order: number;
  showInSidebar: boolean;
  badge?: PageBadge;
  children?: PageDefinition[]; // Nested routes
  parentId?: string; // Parent page ID
  metadata?: {
    estimatedTime?: number; // Minutes
    complexity?: 'low' | 'medium' | 'high';
    tags?: string[];
    isNew?: boolean;
    isPopular?: boolean;
  };
}

/**
 * Navigation group in sidebar
 */
export interface NavigationGroup {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  pages: PageDefinition[];
  order: number;
  collapsible: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Portal definition (Client, Engineer, Enterprise, Admin)
 */
export interface PortalDefinition {
  role: UserRole;
  basePath: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  pages: PageDefinition[];
  navigationGroups: NavigationGroup[];
  defaultPage: string; // Page ID to redirect to (usually dashboard)
  theme?: {
    primary?: string;
    accent?: string;
  };
}

/**
 * Complete portal registry
 */
export interface PortalRegistry {
  client: PortalDefinition;
  engineer: PortalDefinition;
  enterprise: PortalDefinition;
  admin: PortalDefinition;
}

/**
 * Portal navigation item (flattened for rendering)
 */
export interface PortalNavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: PageBadge;
  isActive: boolean;
  isAccessible: boolean;
  children?: PortalNavItem[];
}

/**
 * Breadcrumb trail item
 */
export interface BreadcrumbItem {
  id: string;
  label: string;
  path?: string; // undefined if not clickable (current page)
  icon?: string;
}

/**
 * Quick action definition
 */
export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: string;
  path: string;
  category: string;
  priority: number; // For sorting
  showCondition?: (user: unknown) => boolean;
}

/**
 * Portal analytics event
 */
export interface PortalAnalyticsEvent {
  event_type: 'portal_page_view' | 'portal_navigation' | 'portal_switch' | 'quick_action_used';
  portal: UserRole;
  page_id?: string;
  from_page?: string;
  to_page?: string;
  from_portal?: UserRole;
  to_portal?: UserRole;
  action_id?: string;
  duration_seconds?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Re-export SubscriptionTier for convenience
 * (Primary import should be from @/shared/types/subscription)
 */
export type { SubscriptionTier } from '@/shared/types/subscription';

