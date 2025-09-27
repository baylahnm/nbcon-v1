import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useAuthStore, initializeAuth } from '@/stores/auth';
import { Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiDrawer } from '@/features/ai/Drawer';
import { useAiStore } from '@/features/ai/store/useAiStore';
import { R } from '@/lib/routes';
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
  
  // AI Drawer state
  const { drawerOpen, setDrawerOpen } = useAiStore();
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
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, []);
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
          <p className="text-muted-foreground">Loading nbcon...</p>
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
                  <h1 className="text-lg font-bold">nbcon</h1>
                  <p className="text-muted-foreground capitalize text-xs">
                    {profile.role} Dashboard
                  </p>
                </div>
              </div>
              
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
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-background" style={{ padding: '0px' }}>
            {children || <Outlet />}
          </main>
          
          {/* AI Drawer - Only show on dashboard routes */}
          {isDashboardRoute && (
            <AiDrawer
              isOpen={isAiDrawerOpen}
              onClose={() => setIsAiDrawerOpen(false)}
              onOpenFull={() => navigate(getAIRoute())}
            />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>;
}
