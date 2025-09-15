import { ReactNode, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useAuthStore, initializeAuth } from '@/stores/auth';
import { Loader2 } from 'lucide-react';
interface AppLayoutProps {
  children?: ReactNode;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  const {
    user,
    profile,
    isLoading,
    isInitialized
  } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        navigate('/auth/phone');
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
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
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
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>;
}