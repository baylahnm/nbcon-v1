/**
 * Portal Sidebar Component
 * 
 * Dynamic navigation sidebar displaying portal pages organized by groups.
 * Supports collapsible sections, active highlighting, badges, and nested routes.
 * 
 * Follows strict design system: icon containers, typography, spacing, theme-agnostic.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortalContext } from '@/context/PortalContext';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import { isActiveRoute } from '@/utils/portalNavigation';

/**
 * Portal Sidebar Component
 * 
 * Renders navigation sidebar with collapsible groups.
 * 
 * @example
 * ```tsx
 * <PortalSidebar />
 * ```
 */
export function PortalSidebar() {
  const { navigationGroups, currentPortal, userRole } = usePortalContext();
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  
  // Initialize collapsed state from default settings
  useMemo(() => {
    const defaultCollapsed = new Set<string>();
    for (const group of navigationGroups) {
      if (group.defaultCollapsed) {
        defaultCollapsed.add(group.id);
      }
    }
    setCollapsedGroups(defaultCollapsed);
  }, [navigationGroups]);
  
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };
  
  if (!currentPortal || !userRole) {
    return null;
  }
  
  return (
    <aside className="w-60 bg-background border-r border-border flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-4 border-b border-border/40">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">nbcon</h2>
            <p className="text-xs text-muted-foreground">{currentPortal.name}</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-4">
          {navigationGroups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.id);
            const GroupIcon = (require('lucide-react') as Record<string, LucideIcon>)[group.icon];
            
            return (
              <div key={group.id} className="space-y-2">
                {/* Group Header */}
                {group.collapsible ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {GroupIcon && <GroupIcon className="h-3.5 w-3.5" />}
                      <span>{group.label}</span>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {GroupIcon && <GroupIcon className="h-3.5 w-3.5" />}
                    <span>{group.label}</span>
                  </div>
                )}
                
                {/* Group Pages */}
                {!isCollapsed && (
                  <div className="space-y-1">
                    {group.pages.filter((p) => p.showInSidebar).map((page) => {
                      const PageIcon = (require('lucide-react') as Record<string, LucideIcon>)[page.icon];
                      const isActive = isActiveRoute(location.pathname, page.path);
                      
                      return (
                        <Link
                          key={page.id}
                          to={page.path}
                          className={`
                            flex items-center justify-between gap-2 h-9 px-3 rounded-lg
                            text-xs transition-all duration-200
                            ${isActive 
                              ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20 shadow-sm' 
                              : 'text-foreground hover:bg-muted/50 hover:text-foreground'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {PageIcon && (
                              <div className={`
                                flex-shrink-0
                                ${isActive ? '' : 'opacity-70'}
                              `}>
                                <PageIcon className="h-4 w-4" />
                              </div>
                            )}
                            <span className="truncate">{page.title}</span>
                          </div>
                          
                          {/* Badge */}
                          {page.badge && (
                            <Badge 
                              variant={page.badge.variant || 'default'}
                              className="text-[9px] px-1.5 py-0 h-4 flex-shrink-0"
                            >
                              {page.badge.text}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* User Section */}
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center ring-1 ring-primary/20">
            <span className="text-sm font-semibold text-primary">
              {userRole[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{currentPortal.name}</p>
            <p className="text-[10px] text-muted-foreground truncate capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

