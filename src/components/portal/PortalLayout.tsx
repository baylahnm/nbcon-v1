/**
 * Portal Layout Component
 * 
 * Main layout wrapper for unified portal system. Provides consistent structure
 * across Client, Engineer, and Enterprise portals with responsive sidebar,
 * header, breadcrumb, and content area.
 * 
 * Integrates with PortalContext for automatic configuration based on user role.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { useState } from 'react';
import { usePortalContext } from '@/context/PortalContext';
import { PortalSidebar } from './PortalSidebar';
import { PortalHeader } from './PortalHeader';
import { PortalBreadcrumb } from './PortalBreadcrumb';
import { Sheet, SheetContent } from '@/pages/1-HomePage/others/components/ui/sheet';

/**
 * Portal Layout Props
 */
export interface PortalLayoutProps {
  /**
   * Page content
   */
  children: React.ReactNode;
  
  /**
   * Show sidebar (default: true)
   */
  showSidebar?: boolean;
  
  /**
   * Show header (default: true)
   */
  showHeader?: boolean;
  
  /**
   * Show breadcrumb (default: true)
   */
  showBreadcrumb?: boolean;
  
  /**
   * Additional header actions
   */
  headerActions?: React.ReactNode;
  
  /**
   * Custom class name for content area
   */
  contentClassName?: string;
}

/**
 * Portal Layout Component
 * 
 * Provides unified layout structure for all portal pages.
 * Automatically configures based on user role via PortalContext.
 * 
 * @example
 * ```tsx
 * function DashboardPage() {
 *   return (
 *     <PortalLayout>
 *       <div className="p-4">
 *         <h1>Dashboard Content</h1>
 *       </div>
 *     </PortalLayout>
 *   );
 * }
 * ```
 */
export function PortalLayout({
  children,
  showSidebar = true,
  showHeader = true,
  showBreadcrumb = true,
  headerActions,
  contentClassName = '',
}: PortalLayoutProps) {
  const { isLoading, isAuthenticated } = usePortalContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-3">
          <div className="bg-primary-gradient h-16 w-16 rounded-xl shadow-md flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <p className="text-sm text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {children}
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="hidden lg:block">
          <PortalSidebar />
        </div>
      )}
      
      {/* Mobile Sidebar Drawer */}
      {showSidebar && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-60">
            <PortalSidebar />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
        {/* Scrollable Container */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {/* Header */}
            {showHeader && (
              <PortalHeader
                onMobileMenuClick={() => setMobileMenuOpen(true)}
                actions={headerActions}
                showPortalSwitcher={true}
              />
            )}
            
            {/* Breadcrumb */}
            {showBreadcrumb && <PortalBreadcrumb />}
            
            {/* Page Content */}
            <div className={contentClassName}>
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

