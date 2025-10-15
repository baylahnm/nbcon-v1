import { ReactNode, useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '../ui/sidebar';
import { AppSidebar } from '../layout/AppSidebar';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
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
  const navigate = useNavigate();
  
  // AI Drawer state - placeholder for now
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Check if current route is a dashboard route
  const isDashboardRoute = ['/e', '/c', '/x', '/admin'].some(route => 
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
  if (isLoading || !isInitialized) {
    return <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">nb</span>
          </div>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading nbocn...</p>
        </div>
      </div>;
  }
  if (!user || !profile) {
    return null; // Will redirect via useEffect
  }
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-sidebar-border">
            <div className="flex items-center justify-between px-6 py-[12px]">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
                    className="flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    AI
                  </Button>
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
