/**
 * Portal Access Control Hook
 * 
 * Role-based access control and permission checking for unified portal system.
 * Integrates with Zustand auth store and feature flags to enforce page-level
 * permissions across Client, Engineer, and Enterprise portals.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { useMemo } from 'react';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { getFeatureFlags } from '@/shared/config/featureFlags';
import {
  PORTAL_REGISTRY,
  getPortalByRole,
  getPagesByRole,
  hasPageAccess as registryHasPageAccess,
  getPageById,
  getPageByPath,
} from '@/config/portalRegistry';
import type { UserRole } from '@/shared/types/auth';
import type { SubscriptionTier } from '@/shared/types/subscription';
import type {
  PageDefinition,
  PortalDefinition,
  PagePermissions,
} from '@/config/portalTypes';

/**
 * Portal access hook return type
 */
export interface UsePortalAccessReturn {
  // Core checks
  canAccessPage: (pageId: string) => boolean;
  canAccessPortal: (role: UserRole) => boolean;
  
  // Page queries
  getAccessiblePages: () => PageDefinition[];
  getCurrentPortal: () => PortalDefinition | undefined;
  
  // User info
  userRole: UserRole | null;
  userPermissions: {
    canAccessAITools: boolean;
    canManageProjects: boolean;
    canPostJobs: boolean;
    canAccessFinance: boolean;
    canAccessAnalytics: boolean;
    canManageTeams: boolean;
    subscriptionTier?: SubscriptionTier;
  };
  
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Portal access control hook
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { canAccessPage, userRole, isAuthenticated } = usePortalAccess();
 *   
 *   if (!isAuthenticated) return <LoginPrompt />;
 *   if (!canAccessPage('engineer-profile')) return <AccessDenied />;
 *   
 *   return <ProfileContent />;
 * }
 * ```
 */
export function usePortalAccess(): UsePortalAccessReturn {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const userRole = user?.role || null;
  
  // Memoized permission checks based on subscription tier
  const userPermissions = useMemo(() => {
    if (!user) {
      return {
        canAccessAITools: false,
        canManageProjects: false,
        canPostJobs: false,
        canAccessFinance: false,
        canAccessAnalytics: false,
        canManageTeams: false,
        subscriptionTier: 'free' as SubscriptionTier,
      };
    }
    
    const tier = user.subscriptionTier || 'free';
    
    return {
      canAccessAITools: ['basic', 'pro', 'enterprise'].includes(tier),
      canManageProjects: ['pro', 'enterprise'].includes(tier),
      canPostJobs: ['basic', 'pro', 'enterprise'].includes(tier),
      canAccessFinance: ['pro', 'enterprise'].includes(tier),
      canAccessAnalytics: tier === 'enterprise',
      canManageTeams: tier === 'enterprise',
      subscriptionTier: tier as SubscriptionTier,
    };
  }, [user]);
  
  /**
   * Check if user can access a specific page
   */
  const canAccessPage = useMemo(() => {
    return (pageId: string): boolean => {
      if (!user) return false;
      
      const page = getPageById(pageId, user.role);
      if (!page) return false;
      
      return checkPagePermissions(page, user.role, userPermissions.subscriptionTier);
    };
  }, [user, userPermissions]);
  
  /**
   * Check if user can access a portal
   */
  const canAccessPortal = useMemo(() => {
    return (role: UserRole): boolean => {
      if (!user) return false;
      return user.role === role;
    };
  }, [user]);
  
  /**
   * Get all pages accessible by current user
   */
  const getAccessiblePages = useMemo(() => {
    return (): PageDefinition[] => {
      if (!user) return [];
      
      const allPages = getPagesByRole(user.role);
      return filterPagesByAccess(allPages, user.role, userPermissions.subscriptionTier);
    };
  }, [user, userPermissions]);
  
  /**
   * Get current user's portal
   */
  const getCurrentPortal = useMemo(() => {
    return (): PortalDefinition | undefined => {
      if (!user) return undefined;
      return getPortalByRole(user.role);
    };
  }, [user]);
  
  return {
    canAccessPage,
    canAccessPortal,
    getAccessiblePages,
    getCurrentPortal,
    userRole,
    userPermissions,
    isAuthenticated,
    isLoading,
  };
}

/**
 * Check if user has permission to access a page
 * 
 * @param page - Page definition to check
 * @param userRole - User's role
 * @param subscription - User's subscription tier
 * @returns true if user can access page
 */
export function checkPagePermissions(
  page: PageDefinition,
  userRole: UserRole,
  subscription?: SubscriptionTier
): boolean {
  // Get enabled feature flags
  const featureFlags = getFeatureFlags();
  const enabledFeatures = Object.entries(featureFlags)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);
  
  // Use registry's hasPageAccess with all context
  return registryHasPageAccess(
    page,
    userRole,
    subscription,
    enabledFeatures
  );
}

/**
 * Get portal by user role
 * 
 * @param role - User role
 * @returns Portal definition or undefined
 */
export function getPortalForRole(role: UserRole | null): PortalDefinition | undefined {
  if (!role) return undefined;
  return getPortalByRole(role);
}

/**
 * Filter pages by access permissions
 * 
 * @param pages - Array of pages to filter
 * @param userRole - User's role
 * @param subscription - User's subscription tier
 * @returns Filtered array of accessible pages
 */
export function filterPagesByAccess(
  pages: PageDefinition[],
  userRole: UserRole,
  subscription?: SubscriptionTier
): PageDefinition[] {
  return pages.filter((page) => 
    checkPagePermissions(page, userRole, subscription)
  );
}

/**
 * Get current user role from auth store
 * 
 * @returns User role or null if not authenticated
 */
export function getCurrentUserRole(): UserRole | null {
  const user = useAuthStore.getState().user;
  return user?.role || null;
}

/**
 * Check if page requires specific subscription
 * 
 * @param page - Page definition
 * @returns true if subscription is required
 */
export function requiresSubscription(page: PageDefinition): boolean {
  return !!page.permissions.requiredSubscription;
}

/**
 * Check if page requires feature flags
 * 
 * @param page - Page definition
 * @returns true if feature flags are required
 */
export function requiresFeatureFlags(page: PageDefinition): boolean {
  return !!page.permissions.requiredFeatureFlags && 
         page.permissions.requiredFeatureFlags.length > 0;
}

/**
 * Get missing requirements for page access
 * 
 * @param page - Page definition
 * @param userRole - User's role
 * @param subscription - User's subscription tier
 * @returns Object with missing requirements
 */
export function getMissingRequirements(
  page: PageDefinition,
  userRole: UserRole,
  subscription?: SubscriptionTier
): {
  missingRole: boolean;
  missingSubscription: boolean;
  missingFeatures: string[];
} {
  const result = {
    missingRole: false,
    missingSubscription: false,
    missingFeatures: [] as string[],
  };
  
  // Check role
  if (!page.permissions.allowedRoles.includes(userRole)) {
    result.missingRole = true;
  }
  
  // Check subscription
  if (page.permissions.requiredSubscription) {
    const required = Array.isArray(page.permissions.requiredSubscription)
      ? page.permissions.requiredSubscription
      : [page.permissions.requiredSubscription];
    
    if (!subscription || !required.includes(subscription)) {
      result.missingSubscription = true;
    }
  }
  
  // Check feature flags
  if (page.permissions.requiredFeatureFlags) {
    const flags = getFeatureFlags();
    const enabledFeatures = Object.entries(flags)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);
    
    for (const requiredFlag of page.permissions.requiredFeatureFlags) {
      if (!enabledFeatures.includes(requiredFlag)) {
        result.missingFeatures.push(requiredFlag);
      }
    }
  }
  
  return result;
}

