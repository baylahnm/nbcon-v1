/**
 * Portal Navigation Utilities
 * 
 * Centralized navigation logic for breadcrumbs, recent pages, quick actions,
 * and route management across unified portal system. Includes localStorage
 * persistence and telemetry integration.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { supabase } from '@/shared/supabase/client';
import {
  PORTAL_REGISTRY,
  getPortalByRole,
  getPageById,
  getPageByPath,
  getNavigationGroups as getRegistryNavGroups,
  getDefaultDashboardPath,
} from '@/config/portalRegistry';
import type { UserRole } from '@/shared/types/auth';
import type {
  NavigationGroup,
  BreadcrumbItem,
  QuickAction,
  PageDefinition,
  PortalDefinition,
} from '@/config/portalTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

const RECENT_PAGES_KEY = 'nbcon-recent-pages';
const MAX_RECENT_PAGES = 10;
const PAGE_VISIT_DURATION_KEY = 'nbcon-page-visit-start';

// ============================================================================
// NAVIGATION GROUPS
// ============================================================================

/**
 * Get navigation groups for a role
 * 
 * @param role - User role
 * @returns Array of navigation groups with pages
 * 
 * @example
 * ```tsx
 * const groups = getNavigationGroups('engineer');
 * // Returns: [{ id: 'engineer-main', label: 'Main', pages: [...] }, ...]
 * ```
 */
export function getNavigationGroups(role: UserRole): NavigationGroup[] {
  return getRegistryNavGroups(role);
}

/**
 * Get flattened navigation items (for rendering)
 * 
 * @param role - User role
 * @param currentPath - Current route path for active state
 * @returns Flat array of navigation items
 */
export function getFlatNavigationItems(
  role: UserRole,
  currentPath?: string
): Array<{ page: PageDefinition; isActive: boolean; group: string }> {
  const groups = getNavigationGroups(role);
  const items: Array<{ page: PageDefinition; isActive: boolean; group: string }> = [];
  
  for (const group of groups) {
    for (const page of group.pages) {
      items.push({
        page,
        isActive: currentPath ? isActiveRoute(currentPath, page.path) : false,
        group: group.id,
      });
    }
  }
  
  return items;
}

// ============================================================================
// BREADCRUMB TRAIL
// ============================================================================

/**
 * Build breadcrumb trail from current pathname
 * 
 * @param pathname - Current route pathname
 * @param role - User role (for portal context)
 * @returns Array of breadcrumb items
 * 
 * @example
 * ```tsx
 * const trail = buildBreadcrumbTrail('/free/ai-tools/planning/charter', 'client');
 * // Returns: [
 * //   { id: 'home', label: 'Home', path: '/' },
 * //   { id: 'portal', label: 'Client Portal', path: '/free' },
 * //   { id: 'ai-tools', label: 'AI Tools', path: '/free/ai-tools/planning' },
 * //   { id: 'charter', label: 'Project Charter', path: undefined }
 * // ]
 * ```
 */
export function buildBreadcrumbTrail(
  pathname: string,
  role?: UserRole
): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];
  
  // Always start with Home
  trail.push({
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
  });
  
  // Get portal if role provided
  if (role) {
    const portal = getPortalByRole(role);
    if (portal) {
      trail.push({
        id: `portal-${role}`,
        label: portal.name,
        path: portal.basePath,
        icon: portal.icon,
      });
    }
  }
  
  // Parse pathname for page
  const page = getPageByPath(pathname, role);
  
  if (page) {
    // If page has parent, add parent first
    if (page.parentId && role) {
      const parent = getPageById(page.parentId, role);
      if (parent) {
        trail.push({
          id: parent.id,
          label: parent.title,
          path: parent.path,
          icon: parent.icon,
        });
      }
    }
    
    // Add current page (no path = not clickable)
    trail.push({
      id: page.id,
      label: page.title,
      path: undefined, // Current page not clickable
      icon: page.icon,
    });
  } else {
    // Parse pathname manually if not found in registry
    const segments = pathname.split('/').filter(Boolean);
    
    for (let i = 0; i < segments.length; i++) {
      const isLast = i === segments.length - 1;
      const segmentPath = '/' + segments.slice(0, i + 1).join('/');
      
      trail.push({
        id: segments[i],
        label: segments[i].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        path: isLast ? undefined : segmentPath,
      });
    }
  }
  
  return trail;
}

// ============================================================================
// PORTAL DASHBOARD
// ============================================================================

/**
 * Get default dashboard path for role
 * 
 * @param role - User role
 * @returns Dashboard path or fallback
 */
export function getPortalDashboard(role: UserRole): string {
  return getDefaultDashboardPath(role);
}

// ============================================================================
// QUICK ACTIONS
// ============================================================================

/**
 * Get quick action suggestions based on role and recent activity
 * 
 * @param role - User role
 * @param recentPages - Array of recently visited page IDs
 * @param limit - Maximum number of actions to return
 * @returns Array of quick actions
 */
export function getQuickActions(
  role: UserRole,
  recentPages?: string[],
  limit: number = 6
): QuickAction[] {
  const actions: QuickAction[] = [];
  
  // Role-specific quick actions
  const quickActionMap: Record<UserRole, QuickAction[]> = {
    client: [
      {
        id: 'qa-post-job',
        label: 'Post a Job',
        description: 'Find qualified engineers',
        icon: 'Briefcase',
        path: '/free/post-job',
        category: 'hiring',
        priority: 1,
      },
      {
        id: 'qa-browse-engineers',
        label: 'Browse Engineers',
        description: 'Explore talent pool',
        icon: 'Users',
        path: '/free/browse-engineers',
        category: 'hiring',
        priority: 2,
      },
      {
        id: 'qa-ai-charter',
        label: 'Generate Charter',
        description: 'AI-powered project charter',
        icon: 'FileText',
        path: '/free/ai-tools/planning/charter',
        category: 'ai-tools',
        priority: 3,
      },
      {
        id: 'qa-my-projects',
        label: 'My Projects',
        description: 'View active projects',
        icon: 'FolderOpen',
        path: '/free/my-projects',
        category: 'projects',
        priority: 4,
      },
      {
        id: 'qa-messages',
        label: 'Messages',
        description: 'Check communications',
        icon: 'MessageSquare',
        path: '/free/messages',
        category: 'communication',
        priority: 5,
      },
      {
        id: 'qa-ai-assistant',
        label: 'AI Assistant',
        description: 'Get instant help',
        icon: 'Bot',
        path: '/free/ai',
        category: 'ai-tools',
        priority: 6,
      },
    ],
    engineer: [
      {
        id: 'qa-find-jobs',
        label: 'Find Jobs',
        description: 'AI-powered job matching',
        icon: 'Briefcase',
        path: '/engineer/jobs',
        category: 'jobs',
        priority: 1,
      },
      {
        id: 'qa-check-in',
        label: 'Check-In',
        description: 'Site attendance tracking',
        icon: 'MapPin',
        path: '/engineer/check-in',
        category: 'work',
        priority: 2,
      },
      {
        id: 'qa-upload-deliverable',
        label: 'Upload Deliverable',
        description: 'Submit project work',
        icon: 'Upload',
        path: '/engineer/upload-deliverable',
        category: 'work',
        priority: 3,
      },
      {
        id: 'qa-ai-assistant',
        label: 'AI Assistant',
        description: 'Engineering chat',
        icon: 'Bot',
        path: '/engineer/ai',
        category: 'ai-tools',
        priority: 4,
      },
      {
        id: 'qa-learning',
        label: 'Learning',
        description: 'Professional development',
        icon: 'GraduationCap',
        path: '/engineer/learning',
        category: 'development',
        priority: 5,
      },
      {
        id: 'qa-profile',
        label: 'My Profile',
        description: 'Update profile',
        icon: 'User',
        path: '/engineer/profile',
        category: 'profile',
        priority: 6,
      },
    ],
    enterprise: [
      {
        id: 'qa-workforce',
        label: 'Workforce',
        description: 'Manage talent pool',
        icon: 'Users',
        path: '/enterprise/workforce',
        category: 'management',
        priority: 1,
      },
      {
        id: 'qa-post-jobs',
        label: 'Post Jobs',
        description: 'Bulk job posting',
        icon: 'Briefcase',
        path: '/enterprise/post-jobs',
        category: 'hiring',
        priority: 2,
      },
      {
        id: 'qa-business-intelligence',
        label: 'Analytics',
        description: 'Business intelligence',
        icon: 'BarChart3',
        path: '/enterprise/business-intelligence',
        category: 'analytics',
        priority: 3,
      },
      {
        id: 'qa-projects',
        label: 'Projects',
        description: 'Portfolio management',
        icon: 'FolderKanban',
        path: '/enterprise/projects',
        category: 'projects',
        priority: 4,
      },
      {
        id: 'qa-teams',
        label: 'Teams',
        description: 'Department structure',
        icon: 'Users2',
        path: '/enterprise/teams',
        category: 'management',
        priority: 5,
      },
      {
        id: 'qa-ai-tools',
        label: 'AI Tools',
        description: 'Comprehensive suite',
        icon: 'Sparkles',
        path: '/enterprise/ai-tools',
        category: 'ai-tools',
        priority: 6,
      },
    ],
    admin: [
      {
        id: 'qa-admin-dashboard',
        label: 'Dashboard',
        description: 'System overview',
        icon: 'LayoutDashboard',
        path: '/admin/dashboard',
        category: 'admin',
        priority: 1,
      },
    ],
  };
  
  const roleActions = quickActionMap[role] || [];
  
  // Boost priority for recently visited pages
  const scoredActions = roleActions.map((action) => {
    let score = action.priority;
    
    // Check if action's page was recently visited
    if (recentPages) {
      const pageId = getPageIdFromPath(action.path, role);
      if (pageId && recentPages.includes(pageId)) {
        score -= 10; // Higher priority (lower score)
      }
    }
    
    return { ...action, score };
  });
  
  // Sort by score and return top N
  return scoredActions
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

/**
 * Helper to get page ID from path
 */
function getPageIdFromPath(path: string, role: UserRole): string | undefined {
  const page = getPageByPath(path, role);
  return page?.id;
}

// ============================================================================
// PAGE VISIT TRACKING
// ============================================================================

/**
 * Track page visit with analytics
 * 
 * @param pageId - Page identifier
 * @param role - User role
 * @param duration - Time spent on page (seconds)
 */
export async function trackPageVisit(
  pageId: string,
  role: UserRole,
  duration?: number
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const page = getPageById(pageId, role);
    if (!page) return;
    
    // Log to Supabase ai_events table
    await supabase.from('ai_events').insert({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: {
        event_subtype: 'portal_page_view',
        portal: role,
        page_id: pageId,
        page_title: page.title,
        page_path: page.path,
        duration_seconds: duration,
      },
    });
    
    // Update recent pages in localStorage
    addToRecentPages(pageId, role);
  } catch (error) {
    console.error('[PortalNavigation] Failed to track page visit:', error);
  }
}

/**
 * Start tracking page visit duration
 * 
 * @param pageId - Page identifier
 */
export function startPageVisit(pageId: string): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.setItem(
    `${PAGE_VISIT_DURATION_KEY}-${pageId}`,
    Date.now().toString()
  );
}

/**
 * End tracking page visit and record duration
 * 
 * @param pageId - Page identifier
 * @param role - User role
 */
export async function endPageVisit(pageId: string, role: UserRole): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const startTime = sessionStorage.getItem(`${PAGE_VISIT_DURATION_KEY}-${pageId}`);
  if (!startTime) return;
  
  const duration = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
  sessionStorage.removeItem(`${PAGE_VISIT_DURATION_KEY}-${pageId}`);
  
  await trackPageVisit(pageId, role, duration);
}

// ============================================================================
// RECENT PAGES
// ============================================================================

/**
 * Add page to recent pages list
 * 
 * @param pageId - Page identifier
 * @param role - User role
 */
function addToRecentPages(pageId: string, role: UserRole): void {
  if (typeof window === 'undefined') return;
  
  const key = `${RECENT_PAGES_KEY}-${role}`;
  const stored = localStorage.getItem(key);
  let recent: string[] = stored ? JSON.parse(stored) : [];
  
  // Remove if already exists
  recent = recent.filter((id) => id !== pageId);
  
  // Add to front
  recent.unshift(pageId);
  
  // Limit size
  recent = recent.slice(0, MAX_RECENT_PAGES);
  
  localStorage.setItem(key, JSON.stringify(recent));
}

/**
 * Get recent pages for role
 * 
 * @param role - User role
 * @param limit - Maximum number of pages to return
 * @returns Array of page definitions
 */
export function getRecentPages(role: UserRole, limit: number = 5): PageDefinition[] {
  if (typeof window === 'undefined') return [];
  
  const key = `${RECENT_PAGES_KEY}-${role}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  try {
    const pageIds: string[] = JSON.parse(stored);
    const pages = pageIds
      .map((id) => getPageById(id, role))
      .filter((p): p is PageDefinition => p !== undefined)
      .slice(0, limit);
    
    return pages;
  } catch {
    return [];
  }
}

/**
 * Clear recent pages for role
 * 
 * @param role - User role
 */
export function clearRecentPages(role: UserRole): void {
  if (typeof window === 'undefined') return;
  
  const key = `${RECENT_PAGES_KEY}-${role}`;
  localStorage.removeItem(key);
}

// ============================================================================
// ACTIVE ROUTE CHECKING
// ============================================================================

/**
 * Check if route is currently active
 * 
 * Supports exact match and wildcard patterns
 * 
 * @param currentPath - Current pathname
 * @param pagePath - Page path to check
 * @returns true if route is active
 * 
 * @example
 * ```tsx
 * isActiveRoute('/engineer/jobs', '/engineer/jobs') // true
 * isActiveRoute('/engineer/learning/course/123', '/engineer/learning') // true
 * isActiveRoute('/free/dashboard', '/engineer/dashboard') // false
 * ```
 */
export function isActiveRoute(currentPath: string, pagePath: string): boolean {
  // Exact match
  if (currentPath === pagePath) return true;
  
  // Check if current path starts with page path (for nested routes)
  if (currentPath.startsWith(pagePath + '/')) return true;
  
  // Check for dynamic segments (e.g., /learning/course/:id)
  const pagePattern = pagePath.replace(/:[^/]+/g, '[^/]+');
  const regex = new RegExp(`^${pagePattern}(/|$)`);
  
  return regex.test(currentPath);
}

/**
 * Get active page from current pathname
 * 
 * @param pathname - Current pathname
 * @param role - User role
 * @returns Active page definition or undefined
 */
export function getActivePageFromPath(
  pathname: string,
  role: UserRole
): PageDefinition | undefined {
  const pages = getPagesByRole(role);
  
  // Try exact match first
  const exactMatch = pages.find((p) => p.path === pathname);
  if (exactMatch) return exactMatch;
  
  // Try pattern match for nested routes
  for (const page of pages) {
    if (isActiveRoute(pathname, page.path)) {
      return page;
    }
  }
  
  return undefined;
}

/**
 * Helper function to get all pages for a role
 */
function getPagesByRole(role: UserRole): PageDefinition[] {
  const portal = getPortalByRole(role);
  if (!portal) return [];
  
  const allPages: PageDefinition[] = [];
  
  function collectPages(pages: PageDefinition[]) {
    for (const page of pages) {
      allPages.push(page);
      if (page.children) {
        collectPages(page.children);
      }
    }
  }
  
  collectPages(portal.pages);
  return allPages;
}

// ============================================================================
// PORTAL SWITCHING
// ============================================================================

/**
 * Track portal switch event
 * 
 * @param fromRole - Previous role
 * @param toRole - New role
 */
export async function trackPortalSwitch(
  fromRole: UserRole,
  toRole: UserRole
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('ai_events').insert({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: {
        event_subtype: 'portal_switch',
        from_portal: fromRole,
        to_portal: toRole,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[PortalNavigation] Failed to track portal switch:', error);
  }
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

/**
 * Search pages by query
 * 
 * @param query - Search query
 * @param role - User role
 * @returns Matching pages
 */
export function searchPages(query: string, role: UserRole): PageDefinition[] {
  if (!query.trim()) return [];
  
  const pages = getPagesByRole(role);
  const lowerQuery = query.toLowerCase();
  
  return pages.filter((page) => {
    const titleMatch = page.title.toLowerCase().includes(lowerQuery);
    const descMatch = page.description.toLowerCase().includes(lowerQuery);
    const categoryMatch = page.category.toLowerCase().includes(lowerQuery);
    
    return titleMatch || descMatch || categoryMatch;
  });
}

/**
 * Get pages by category
 * 
 * @param category - Portal category
 * @param role - User role
 * @returns Pages in category
 */
export function getPagesByCategory(
  category: string,
  role: UserRole
): PageDefinition[] {
  const pages = getPagesByRole(role);
  return pages.filter((p) => p.category === category);
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export {
  getNavigationGroups,
  getFlatNavigationItems,
  buildBreadcrumbTrail,
  getPortalDashboard,
  getQuickActions,
  trackPageVisit,
  startPageVisit,
  endPageVisit,
  getRecentPages,
  clearRecentPages,
  isActiveRoute,
  getActivePageFromPath,
  trackPortalSwitch,
  searchPages,
  getPagesByCategory,
};

