/**
 * Unified App Router
 * 
 * Consolidates role-based routes into tier-aware routing system.
 * Replaces `/free/*`, `/engineer/*`, `/enterprise/*` with unified paths.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3)
 */

import React, { lazy, Suspense } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate,
  type RouteObject 
} from 'react-router-dom';
import AppLayout from '@/components/portal/AppLayout';
import { FeatureGate } from '@/components/portal/FeatureGate';
import { UnifiedDashboard } from '@/components/portal/UnifiedDashboard';
import CoPilotToolbar from '@/components/portal/CoPilotToolbar';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { menuConfig } from '@/config/menuConfig';
import type { SubscriptionTier } from '@/shared/types/subscription';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';

// ============================================================================
// PLACEHOLDER PAGE COMPONENTS
// ============================================================================

/**
 * Placeholder page components
 * TODO: Replace with actual page implementations from apps/web/src/pages/
 */

function DashboardPage() {
  return (
    <UnifiedDashboard
      title="Dashboard"
      description="Overview of your projects, tasks, and activity"
      quickActions={[]}
      widgets={[]}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Dashboard content will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function OverviewPage() {
  return (
    <UnifiedDashboard
      title="Overview"
      description="Platform introduction and getting started"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Overview content will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function CalendarPage() {
  return (
    <UnifiedDashboard
      title="Calendar"
      description="Multi-source event visualization"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Calendar content will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function EngineersPage() {
  return (
    <UnifiedDashboard
      title="Browse Engineers"
      description="Find and hire verified Saudi engineers"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Engineers directory will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function JobsPage() {
  return (
    <UnifiedDashboard
      title="Browse Jobs"
      description="Find engineering opportunities"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Jobs listing will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function ProjectsPage() {
  return (
    <UnifiedDashboard
      title="Projects"
      description="Manage your engineering projects"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Projects management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function AIToolsPage() {
  return (
    <UnifiedDashboard
      title="AI Tools"
      description="AI-powered engineering tools and assistants"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          AI Tools hub will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function FinancePage() {
  return (
    <UnifiedDashboard
      title="Finance"
      description="Manage invoices, payments, and financial records"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Finance management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function EnterpriseOpsPage() {
  return (
    <UnifiedDashboard
      title="Enterprise Operations"
      description="Workforce, teams, contracts, and business intelligence"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Enterprise operations will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function MessagesPage() {
  return (
    <UnifiedDashboard
      title="Messages"
      description="Real-time communication"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Messages will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function LearningPage() {
  return (
    <UnifiedDashboard
      title="Learning"
      description="Tutorials, certifications, and progress tracking"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Learning hub will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function SettingsPage() {
  return (
    <UnifiedDashboard
      title="Settings"
      description="Preferences, appearance, notifications, and account settings"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Settings will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function HelpPage() {
  return (
    <UnifiedDashboard
      title="Help"
      description="Knowledge base, tutorials, and AI helpdesk assistant"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Help center will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function PostJobPage() {
  return (
    <UnifiedDashboard
      title="Post New Job"
      description="Create a new job posting"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Post job form will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function ApplicationsPage() {
  return (
    <UnifiedDashboard
      title="Applications"
      description="Manage job applications"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Applications management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function MyProjectsPage() {
  return (
    <UnifiedDashboard
      title="My Projects"
      description="Your owned and participated projects"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          My projects listing will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function NetworkPage() {
  return (
    <UnifiedDashboard
      title="Network"
      description="Directory of verified professionals and organizations"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Network directory will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function DevelopmentPage() {
  return (
    <UnifiedDashboard
      title="Development"
      description="Professional development and skill building"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Development tools will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function TimesheetsPage() {
  return (
    <UnifiedDashboard
      title="Timesheets"
      description="Record work hours, approvals, and cost analysis"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Timesheets management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function SubscriptionPage() {
  return (
    <UnifiedDashboard
      title="Subscription"
      description="Current plan, billing, and upgrade flow"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Subscription management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

// Nested AI Tools routes
function AIAssistantPage() {
  return (
    <UnifiedDashboard
      title="AI Assistant"
      description="Contextual chatbot for workflows and document drafting"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          AI Assistant chat will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function AIPlanningPage() {
  return (
    <UnifiedDashboard
      title="Project Planning"
      description="WBS builder, risk matrix, timeline automation"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          AI Planning tools will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

// Enterprise nested routes
function EnterpriseWorkforcePage() {
  return (
    <UnifiedDashboard
      title="Workforce Management"
      description="Manage engineers, rates, and capacity planning"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Workforce management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function EnterpriseTeamsPage() {
  return (
    <UnifiedDashboard
      title="Teams Management"
      description="Organizational hierarchy, access control, roles"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Teams management will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function EnterpriseContractsPage() {
  return (
    <UnifiedDashboard
      title="Contracts & Compliance"
      description="Manage vendor SLAs, audit logs, and document trails"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Contracts and compliance will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function EnterpriseProfilePage() {
  return (
    <UnifiedDashboard
      title="Company Profile"
      description="Enterprise-level branding, data, and identity setup"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Company profile will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function EnterpriseBIPage() {
  return (
    <UnifiedDashboard
      title="Business Intelligence"
      description="Cross-project analytics, performance insights, and forecasting"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Business intelligence dashboard will be implemented here.
        </p>
      </div>
    </UnifiedDashboard>
  );
}

function NotFoundPage() {
  return (
    <UnifiedDashboard title="Page Not Found">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="text-6xl font-bold text-muted-foreground">404</div>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => window.history.back()}
          className="text-sm text-primary hover:underline"
        >
          ← Go Back
        </button>
      </div>
    </UnifiedDashboard>
  );
}

// ============================================================================
// ROUTE MAPPING
// ============================================================================

/**
 * Map route paths to page components
 */
const routeComponentMap: Record<string, React.ComponentType> = {
  // Core
  '/overview': OverviewPage,
  '/dashboard': DashboardPage,
  '/calendar': CalendarPage,
  
  // Talent & Jobs
  '/engineers': EngineersPage,
  '/jobs': JobsPage,
  '/post-job': PostJobPage,
  '/applications': ApplicationsPage,
  
  // Projects
  '/projects': ProjectsPage,
  '/my-projects': MyProjectsPage,
  
  // AI Tools
  '/ai-tools': AIToolsPage,
  '/ai-tools/assistant': AIAssistantPage,
  '/ai-tools/planning': AIPlanningPage,
  // TODO: Add remaining AI tool sub-routes (budgeting, execution, quality, communication, closure)
  
  // Communication
  '/messages': MessagesPage,
  '/network': NetworkPage,
  
  // Learning
  '/learning': LearningPage,
  '/development': DevelopmentPage,
  
  // Finance
  '/finance': FinancePage,
  '/timesheets': TimesheetsPage,
  '/subscription': SubscriptionPage,
  
  // Enterprise Ops
  '/enterprise': EnterpriseOpsPage,
  '/enterprise/workforce': EnterpriseWorkforcePage,
  '/enterprise/teams': EnterpriseTeamsPage,
  '/enterprise/contracts': EnterpriseContractsPage,
  '/enterprise/profile': EnterpriseProfilePage,
  '/enterprise/bi': EnterpriseBIPage,
  
  // Settings & Support
  '/settings': SettingsPage,
  '/help': HelpPage,
};

// ============================================================================
// PROTECTED ROUTE WRAPPER
// ============================================================================

/**
 * Protected Route Component
 * 
 * Wraps routes with authentication and tier-based access control.
 */
function ProtectedRoute({
  requiredTier,
  featureId,
  children,
}: {
  requiredTier?: SubscriptionTier;
  featureId?: string;
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, userPermissions } = usePortalAccess();
  const user = useAuthStore((state) => state.user);
  const userTier = userPermissions.subscriptionTier || 'free';
  const isAdmin = (user && 'is_admin' in user && user.is_admin === true) || false;

  // Loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 space-y-4">
          <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Not authenticated - redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Tier-based access control
  if (requiredTier && requiredTier !== 'free') {
    const hasAccess = isAdmin || tierMeetsRequirement(userTier, requiredTier);
    
    if (!hasAccess) {
      return (
        <AppLayout>
          <FeatureGate
            requiredTier={requiredTier}
            featureId={featureId}
          >
            {children}
          </FeatureGate>
        </AppLayout>
      );
    }
  }

  // Render with AppLayout
  return (
    <AppLayout>
      {children}
      <CoPilotToolbar />
    </AppLayout>
  );
}

// ============================================================================
// ROUTE GENERATION
// ============================================================================

/**
 * Generate routes from menu configuration
 */
function generateRoutes(): RouteObject[] {
  const routes: RouteObject[] = [];

  // Iterate through menu config sections
  menuConfig.forEach((section) => {
    section.items.forEach((item) => {
      const Component = routeComponentMap[item.route];
      
      if (Component) {
        routes.push({
          path: item.route,
          element: (
            <ProtectedRoute
              requiredTier={item.plan}
              featureId={item.featureId}
            >
              <Suspense fallback={
                <div className="p-4">
                  <div className="h-8 w-48 bg-muted/30 rounded animate-pulse mb-4" />
                  <div className="h-64 bg-muted/30 rounded animate-pulse" />
                </div>
              }>
                <Component />
              </Suspense>
            </ProtectedRoute>
          ),
        });
      }

      // Handle nested children (if any)
      if (item.children) {
        item.children.forEach((child) => {
          const ChildComponent = routeComponentMap[child.route];
          if (ChildComponent) {
            routes.push({
              path: child.route,
              element: (
                <ProtectedRoute
                  requiredTier={child.plan}
                  featureId={child.featureId}
                >
                  <Suspense fallback={
                    <div className="p-4">
                      <div className="h-8 w-48 bg-muted/30 rounded animate-pulse mb-4" />
                      <div className="h-64 bg-muted/30 rounded animate-pulse" />
                    </div>
                  }>
                    <ChildComponent />
                  </Suspense>
                </ProtectedRoute>
              ),
            });
          }
        });
      }
    });
  });

  return routes;
}

// ============================================================================
// LEGACY REDIRECTS
// ============================================================================

/**
 * Generate redirect routes from legacy paths to new unified paths
 */
function generateLegacyRedirects(): RouteObject[] {
  return [
    // Legacy role-based paths → unified paths
    {
      path: '/free',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/free/*',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/engineer',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/engineer/*',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/enterprise',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/enterprise/*',
      element: <Navigate to="/dashboard" replace />,
    },
    // Common legacy dashboard paths
    {
      path: '/free/dashboard',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/engineer/dashboard',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/enterprise/dashboard',
      element: <Navigate to="/dashboard" replace />,
    },
  ];
}

// ============================================================================
// ROOT REDIRECT
// ============================================================================

/**
 * Root redirect component
 * Redirects authenticated users to dashboard, unauthenticated to auth
 */
function RootRedirect() {
  const { isAuthenticated, isLoading } = usePortalAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-48 bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/auth" replace />;
}

// ============================================================================
// ROUTER CONFIGURATION
// ============================================================================

/**
 * Create browser router with all routes
 */
const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <RootRedirect />,
  },
  
  // Legacy redirects (must come before main routes)
  ...generateLegacyRedirects(),
  
  // Main application routes
  ...generateRoutes(),
  
  // 404 Not Found
  {
    path: '*',
    element: (
      <AppLayout>
        <NotFoundPage />
        <CoPilotToolbar />
      </AppLayout>
    ),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

// ============================================================================
// ROUTER PROVIDER COMPONENT
// ============================================================================

/**
 * AppRouter Component
 * 
 * Main router provider component using React Router v6's createBrowserRouter.
 * Provides unified tier-aware routing with legacy path redirects.
 * 
 * @example
 * ```tsx
 * <AppRouter />
 * ```
 */
export default function AppRouter() {
  return <RouterProvider router={router} />;
}

// Named export for convenience
export { AppRouter };

