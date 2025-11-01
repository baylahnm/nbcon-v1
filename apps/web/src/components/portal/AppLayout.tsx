/**
 * Unified App Layout Component
 * 
 * Main application layout that combines header, tier-aware sidebar, content area,
 * and CoPilot toolbar. Replaces role-based layouts with unified tier-driven interface.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3)
 */

import { ReactNode } from 'react';
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from '@/pages/1-HomePage/others/components/ui/sidebar';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Building2,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/pages/1-HomePage/others/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import TierAwareSidebar from './TierAwareSidebar';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { useAuthStore } from '@/pages/1-HomePage/others/stores/auth';
import { ThemeToggle } from '@/pages/1-HomePage/others/components/ui/theme-toggle';

interface AppLayoutProps {
  /** Child content to render in the main area */
  children: ReactNode;
  /** Optional custom className for the layout container */
  className?: string;
}

/**
 * AppLayout Component
 * 
 * Unified layout that provides:
 * - Responsive sidebar with tier-based navigation
 * - Header with workspace switcher, notifications, theme toggle, user menu
 * - Main content area with proper padding
 * - CoPilot toolbar placeholder
 * - Footer slot placeholder
 * 
 * @example
 * ```tsx
 * <AppLayout>
 *   <DashboardContent />
 * </AppLayout>
 * ```
 */
export default function AppLayout({ 
  children,
  className 
}: AppLayoutProps) {
  const { subscriptionTier, isAdmin } = usePortalAccess();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  
  // Placeholder for user display name
  const userDisplayName = profile?.fullName || user?.email?.split('@')[0] || 'User';
  const userInitials = userDisplayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
  
  // Placeholder handlers
  const handleSignOut = () => {
    console.log('[Sign Out] Placeholder - Implement logout logic');
    // TODO: Implement sign out logic
    // useAuthStore.getState().signOut();
  };
  
  const handleWorkspaceSwitch = () => {
    console.log('[Workspace Switcher] Placeholder - Implement workspace switching');
  };
  
  const handleNotificationClick = () => {
    console.log('[Notifications] Placeholder - Implement notification panel');
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn('flex min-h-screen w-full bg-background', className)}>
        {/* Tier-Aware Sidebar */}
        <TierAwareSidebar collapsible="offcanvas" />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            {/* Left Section: Sidebar Trigger + Workspace Switcher */}
            <div className="flex items-center gap-2 flex-1">
              <SidebarTrigger />
              
              {/* Workspace Switcher Placeholder */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWorkspaceSwitch}
                  className="h-8 gap-2 px-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Workspace</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </div>
            </div>
            
            {/* Right Section: Notifications + Theme + User Menu */}
            <div className="flex items-center gap-2">
              {/* Notifications Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationClick}
                className="relative h-9 w-9"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
                {/* Notification badge placeholder */}
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={profile?.avatarUrl || undefined} 
                        alt={userDisplayName}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] px-1.5 py-0 capitalize"
                        >
                          {subscriptionTier}
                        </Badge>
                        {isAdmin && (
                          <Badge 
                            variant="destructive" 
                            className="text-[10px] px-1.5 py-0"
                          >
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
          
          {/* Footer Slot Placeholder (for future status bar) */}
          <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-2">
              <div className="text-xs text-muted-foreground text-center">
                {/* Status bar placeholder */}
                <div className="flex items-center justify-center gap-4">
                  <span>Status: Ready</span>
                  <span>•</span>
                  <span>Plan: {subscriptionTier}</span>
                  {/* Future: Add status bar components here */}
                </div>
              </div>
            </div>
          </footer>
          
          {/* CoPilot Toolbar Placeholder */}
          <div className="fixed bottom-4 right-4 z-50">
            {/* Placeholder for CoPilotToolbar component */}
            <div className="hidden">
              {/* TODO: Replace with actual CoPilotToolbar component */}
              {/* <CoPilotToolbar /> */}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Export named export for convenience
export { AppLayout };

