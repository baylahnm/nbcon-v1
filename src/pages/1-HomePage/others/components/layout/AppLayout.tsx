import { ReactNode, useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '../ui/sidebar';
import { TierAwareAppSidebar } from '@/components/navigation/TierAwareAppSidebar';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { Loader2, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { R } from '../../lib/routes';

// Dynamically import AI Drawer based on user role
const ClientAiDrawer = lazy(() => import('@/pages/4-free/others/features/ai/Drawer').then(m => ({ default: m.AiDrawer })));
const EngineerAiDrawer = lazy(() => import('@/pages/5-engineer/others/features/ai/Drawer').then(m => ({ default: m.AiDrawer })));
const EnterpriseAiDrawer = lazy(() => import('@/pages/6-enterprise/others/features/ai/Drawer').then(m => ({ default: m.AiDrawer })));
const AdminAiDrawer = lazy(() => import('@/pages/3-admin/others/features/ai/Drawer').then(m => ({ default: m.AiDrawer })));
interface AppLayoutProps {
  children?: ReactNode;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  const location = useLocation();
  const {
    user,
    profile,
    isLoading,
    isInitialized
  } = useAuthStore();
  const { userPermissions, isLoading: permissionsLoading } = usePortalAccess();
  const navigate = useNavigate();
  
  // AI Drawer state - placeholder for now
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Check if current route is a dashboard route
  const isDashboardRoute = ['/e', '/c', '/x', '/admin', '/free'].some(route => 
    location.pathname.startsWith(route)
  );

  // Get AI route based on role
  const getAIRoute = () => {
    switch (profile?.role) {
      case 'engineer':
        return R.engineer.ai;
      case 'client':
        return R.client.ai;
      case 'enterprise':
        return R.enterprise.ai;
      default:
        return '/ai'; // fallback
    }
  };

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!profile) {
        navigate('/auth/role');
      }
    }
  }, [user, profile, isInitialized, isLoading, navigate]);
  if (isLoading || !isInitialized || permissionsLoading) {
    return <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">nb</span>
          </div>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            {permissionsLoading ? 'Loading permissions...' : 'Loading nbocn...'}
          </p>
        </div>
      </div>;
  }
  if (!user || !profile) {
    return null; // Will redirect via useEffect
  }
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <TierAwareAppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-sidebar-border">
            <div className="flex items-center justify-between px-4 py-[12px] bg-[hsl(var(--background))]">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="text-lg font-bold">nbocn</h1>
                  <p className="text-muted-foreground capitalize text-xs">
                    {profile.role} Dashboard
                  </p>
                </div>
              </div>
              
              {/* Right Side: Theme Toggle + AI Button */}
              <div className="flex items-center gap-2">
                {/* Theme Dropdown */}
                <ThemeToggle />
                
                {/* AI Button - Only show on dashboard routes */}
                {isDashboardRoute && (
                  <button
                    onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
                    className="relative inline-flex h-9 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--primary)/0.3)_50%,hsl(var(--primary))_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-background px-3 py-1 text-sm font-medium text-foreground backdrop-blur-3xl gap-2">
                      <Bot className="w-4 h-4" />
                      AI
                    </span>
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-background" style={{ padding: '0px' }}>
            {children || <Outlet />}
          </main>
          
          {/* AI Drawer - Only show on dashboard routes */}
          {isDashboardRoute && isAiDrawerOpen && (
            <Suspense fallback={<div className="hidden" />}>
              {user?.role === 'client' && (
                <ClientAiDrawer
                  isOpen={isAiDrawerOpen}
                  onClose={() => setIsAiDrawerOpen(false)}
                  onOpenFull={() => navigate(getAIRoute())}
                />
              )}
              {user?.role === 'engineer' && (
                <EngineerAiDrawer
                  isOpen={isAiDrawerOpen}
                  onClose={() => setIsAiDrawerOpen(false)}
                  onOpenFull={() => navigate(getAIRoute())}
                />
              )}
              {user?.role === 'enterprise' && (
                <EnterpriseAiDrawer
                  isOpen={isAiDrawerOpen}
                  onClose={() => setIsAiDrawerOpen(false)}
                  onOpenFull={() => navigate(getAIRoute())}
                />
              )}
              {user?.role === 'admin' && (
                <AdminAiDrawer
                  isOpen={isAiDrawerOpen}
                  onClose={() => setIsAiDrawerOpen(false)}
                  onOpenFull={() => navigate(getAIRoute())}
                />
              )}
            </Suspense>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>;
}
