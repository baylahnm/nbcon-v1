/**
 * Portal Context Provider
 * 
 * Central state management for unified portal system. Manages current portal,
 * active page, navigation groups, breadcrumbs, and provides navigation utilities.
 * 
 * Subscribes to auth changes and automatically updates portal configuration
 * when user role changes.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import {
  getPortalByRole,
  getPageById,
  getPageByPath,
} from '@/config/portalRegistry';
import {
  buildBreadcrumbTrail,
  getNavigationGroups,
  startPageVisit,
  endPageVisit,
  trackNavigation,
} from '@/utils/portalNavigation';
import { trackPageView } from '@/services/portalAnalytics';
import type { UserRole } from '@/shared/types/auth';
import type {
  PortalDefinition,
  PageDefinition,
  NavigationGroup,
  BreadcrumbItem,
} from '@/config/portalTypes';

/**
 * Portal context value interface
 */
export interface PortalContextValue {
  // Current state
  currentPortal: PortalDefinition | null;
  currentPage: PageDefinition | null;
  navigationGroups: NavigationGroup[];
  breadcrumbTrail: BreadcrumbItem[];
  
  // Navigation functions
  navigateToPage: (pageId: string) => void;
  canAccessPage: (pageId: string) => boolean;
  
  // User context
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Portal context
 */
const PortalContext = createContext<PortalContextValue | undefined>(undefined);

/**
 * Portal Provider Props
 */
export interface PortalProviderProps {
  children: React.ReactNode;
}

/**
 * Portal Provider Component
 * 
 * Wrap your app with this provider to enable portal context throughout.
 * 
 * @example
 * ```tsx
 * <PortalProvider>
 *   <App />
 * </PortalProvider>
 * ```
 */
export function PortalProvider({ children }: PortalProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Auth integration
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  
  // Portal access hook
  const portalAccess = usePortalAccess();
  
  // State
  const [currentPortal, setCurrentPortal] = useState<PortalDefinition | null>(null);
  const [currentPage, setCurrentPage] = useState<PageDefinition | null>(null);
  const [previousPageId, setPreviousPageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const userRole = user?.role || null;
  
  // Load portal based on user role
  useEffect(() => {
    if (!user) {
      setCurrentPortal(null);
      setIsLoading(false);
      return;
    }
    
    const portal = getPortalByRole(user.role);
    setCurrentPortal(portal || null);
    setIsLoading(false);
  }, [user]);
  
  // Update current page based on location
  useEffect(() => {
    if (!userRole) {
      setCurrentPage(null);
      return;
    }
    
    const page = getPageByPath(location.pathname, userRole);
    
    // Track navigation if page changed
    if (page && currentPage && page.id !== currentPage.id) {
      // Track navigation from previous to current
      trackNavigation(userRole, currentPage.id, page.id).catch(console.error);
      
      // End previous page visit
      if (previousPageId) {
        endPageVisit(previousPageId, userRole).catch(console.error);
      }
      
      // Start new page visit
      startPageVisit(page.id);
      setPreviousPageId(page.id);
    } else if (page && !currentPage) {
      // First page visit in session
      startPageVisit(page.id);
      setPreviousPageId(page.id);
    }
    
    setCurrentPage(page || null);
  }, [location.pathname, userRole, currentPage, previousPageId]);
  
  // Cleanup: end page visit on unmount
  useEffect(() => {
    return () => {
      if (previousPageId && userRole && currentPage) {
        endPageVisit(previousPageId, userRole).catch(console.error);
      }
    };
  }, [previousPageId, userRole, currentPage]);
  
  // Memoized navigation groups
  const navigationGroups = useMemo(() => {
    if (!userRole) return [];
    return getNavigationGroups(userRole);
  }, [userRole]);
  
  // Memoized breadcrumb trail
  const breadcrumbTrail = useMemo(() => {
    return buildBreadcrumbTrail(location.pathname, userRole || undefined);
  }, [location.pathname, userRole]);
  
  // Navigate to page by ID
  const navigateToPage = useCallback(
    (pageId: string) => {
      if (!userRole) {
        console.warn('[PortalContext] Cannot navigate: No user role');
        return;
      }
      
      const page = getPageById(pageId, userRole);
      if (!page) {
        console.warn(`[PortalContext] Page not found: ${pageId}`);
        return;
      }
      
      // Check access
      if (!portalAccess.canAccessPage(pageId)) {
        console.warn(`[PortalContext] Access denied: ${pageId}`);
        return;
      }
      
      navigate(page.path);
    },
    [userRole, navigate, portalAccess]
  );
  
  // Can access page wrapper
  const canAccessPage = useCallback(
    (pageId: string): boolean => {
      return portalAccess.canAccessPage(pageId);
    },
    [portalAccess]
  );
  
  // Context value
  const value: PortalContextValue = {
    currentPortal,
    currentPage,
    navigationGroups,
    breadcrumbTrail,
    navigateToPage,
    canAccessPage,
    userRole,
    isLoading: isLoading || isAuthLoading,
    isAuthenticated,
  };
  
  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  );
}

/**
 * Use Portal Context Hook
 * 
 * Access portal context values and navigation functions.
 * Must be used within a PortalProvider.
 * 
 * @throws Error if used outside PortalProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentPortal, navigateToPage, canAccessPage } = usePortalContext();
 *   
 *   return (
 *     <div>
 *       <h1>{currentPortal?.name}</h1>
 *       <button onClick={() => navigateToPage('engineer-dashboard')}>
 *         Go to Dashboard
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortalContext(): PortalContextValue {
  const context = useContext(PortalContext);
  
  if (context === undefined) {
    throw new Error(
      'usePortalContext must be used within a PortalProvider. ' +
      'Wrap your app with <PortalProvider> to use portal context.'
    );
  }
  
  return context;
}

/**
 * Optional hook that returns undefined instead of throwing
 * 
 * Useful for components that may or may not be within a PortalProvider.
 */
export function usePortalContextOptional(): PortalContextValue | undefined {
  return useContext(PortalContext);
}

/**
 * Export provider and hooks
 */
export { PortalContext, PortalProvider, usePortalContext, usePortalContextOptional };
export type { PortalContextValue };

