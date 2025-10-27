/**
 * Portal Routes Generator
 * 
 * Dynamically generates React Router v6 routes from portal registry with:
 * - Lazy-loaded components for performance
 * - Permission-based route protection
 * - Nested route support (AI tools, learning courses)
 * - Role-aware redirects and error handling
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { PortalLayout } from '@/components/portal';
import { PORTAL_REGISTRY, getDefaultDashboardPath } from '@/config/portalRegistry';
import type { PageDefinition, UserRole } from '@/config/portalTypes';

// ============================================================================
// PROTECTED ROUTE WRAPPER
// ============================================================================

/**
 * Protected Route Component
 * 
 * Wraps routes with permission checking. Redirects to 403 or fallback
 * if user lacks access.
 */
function ProtectedRoute({
  pageId,
  children,
}: {
  pageId: string;
  children: React.ReactNode;
}) {
  const { canAccessPage, isAuthenticated, isLoading, userRole } = usePortalAccess();
  const location = useLocation();
  
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  // Not authenticated - redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Check page access
  if (!canAccessPage(pageId)) {
    return (
      <PortalLayout>
        <AccessDenied pageId={pageId} userRole={userRole} />
      </PortalLayout>
    );
  }
  
  return <>{children}</>;
}

// ============================================================================
// LAZY COMPONENT LOADER
// ============================================================================

/**
 * Create lazy-loaded component from path
 * 
 * Handles both absolute and relative import paths.
 */
function createLazyComponent(componentPath: string) {
  // Convert file path to relative import
  // Example: "src/pages/4-free/2-DashboardPage.tsx" → "@/pages/4-free/2-DashboardPage"
  const importPath = componentPath
    .replace(/^src\//, '@/')
    .replace(/\.tsx?$/, '');
  
  return lazy(() => 
    import(/* @vite-ignore */ importPath)
      .then((module) => ({ default: module.default || module }))
      .catch((error) => {
        console.error(`Failed to load component: ${importPath}`, error);
        return { default: ComponentLoadError };
      })
  );
}

/**
 * Component load error fallback
 */
function ComponentLoadError() {
  return (
    <PortalLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <div className="bg-red-500/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-base font-semibold mb-2">Failed to Load Page</h2>
        <p className="text-xs text-muted-foreground max-w-md">
          The page component could not be loaded. Please refresh the page or contact support.
        </p>
      </div>
    </PortalLayout>
  );
}

// ============================================================================
// ROUTE GENERATION
// ============================================================================

/**
 * Generate routes for a single page (with children)
 */
function generatePageRoute(page: PageDefinition, role: UserRole): JSX.Element {
  const LazyComponent = createLazyComponent(page.component);
  
  return (
    <Route
      key={page.id}
      path={page.path.replace(`/${role === 'client' ? 'free' : role}`, '')} // Remove base path
      element={
        <ProtectedRoute pageId={page.id}>
          <Suspense fallback={<LoadingSkeleton />}>
            <PortalLayout>
              <LazyComponent />
            </PortalLayout>
          </Suspense>
        </ProtectedRoute>
      }
    >
      {/* Nested routes (children) */}
      {page.children && page.children.map((child) => (
        <Route
          key={child.id}
          path={child.path.replace(page.path, '').replace(/^\//, '')} // Relative to parent
          element={
            <ProtectedRoute pageId={child.id}>
              <Suspense fallback={<LoadingSkeleton />}>
                {(() => {
                  const ChildComponent = createLazyComponent(child.component);
                  return <ChildComponent />;
                })()}
              </Suspense>
            </ProtectedRoute>
          }
        />
      ))}
    </Route>
  );
}

/**
 * Generate all routes for a portal
 */
function generatePortalRoutes(role: UserRole): JSX.Element[] {
  const portal = PORTAL_REGISTRY[role];
  if (!portal) return [];
  
  return portal.pages.map((page) => generatePageRoute(page, role));
}

// ============================================================================
// PORTAL ROUTES COMPONENT
// ============================================================================

/**
 * Portal Routes Component
 * 
 * Main routing component that generates all portal routes dynamically.
 * Includes authentication checks, permission enforcement, and error handling.
 * 
 * @example
 * ```tsx
 * <PortalRoutes />
 * ```
 */
export function PortalRoutes() {
  const { isAuthenticated, userRole } = usePortalAccess();
  
  return (
    <Routes>
      {/* Client Portal Routes */}
      <Route path="/free/*" element={<>{generatePortalRoutes('client')}</>}>
        {generatePortalRoutes('client')}
      </Route>
      
      {/* Engineer Portal Routes */}
      <Route path="/engineer/*" element={<>{generatePortalRoutes('engineer')}</>}>
        {generatePortalRoutes('engineer')}
      </Route>
      
      {/* Enterprise Portal Routes */}
      <Route path="/enterprise/*" element={<>{generatePortalRoutes('enterprise')}</>}>
        {generatePortalRoutes('enterprise')}
      </Route>
      
      {/* Root redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated && userRole ? (
            <Navigate to={getDefaultDashboardPath(userRole)} replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      
      {/* 404 Not Found */}
      <Route 
        path="*" 
        element={
          <PortalLayout>
            <NotFound />
          </PortalLayout>
        } 
      />
    </Routes>
  );
}

// ============================================================================
// FALLBACK COMPONENTS
// ============================================================================

/**
 * Loading skeleton component
 */
function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
        <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
        <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
        <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
      </div>
      <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
    </div>
  );
}

/**
 * Access denied component
 */
function AccessDenied({ pageId, userRole }: { pageId: string; userRole: UserRole | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
      <div className="bg-amber-500/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 ring-1 ring-amber-500/20">
        <span className="text-2xl">🔒</span>
      </div>
      <h2 className="text-base font-semibold mb-2">Access Denied</h2>
      <p className="text-xs text-muted-foreground max-w-md mb-6">
        You don't have permission to access this page. This page may require a different
        role, subscription tier, or feature access.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => window.history.back()}
          className="text-xs text-primary hover:underline"
        >
          ← Go Back
        </button>
        {userRole && (
          <a
            href={getDefaultDashboardPath(userRole)}
            className="text-xs text-primary hover:underline"
          >
            Return to Dashboard →
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * 404 Not Found component
 */
function NotFound() {
  const { userRole } = usePortalAccess();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
      <div className="bg-muted/50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">404</span>
      </div>
      <h2 className="text-base font-semibold mb-2">Page Not Found</h2>
      <p className="text-xs text-muted-foreground max-w-md mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      {userRole && (
        <a
          href={getDefaultDashboardPath(userRole)}
          className="text-xs text-primary hover:underline"
        >
          Return to Dashboard →
        </a>
      )}
    </div>
  );
}

/**
 * Export main component
 */
export default PortalRoutes;

