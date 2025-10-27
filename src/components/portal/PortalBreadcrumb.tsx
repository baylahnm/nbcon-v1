/**
 * Portal Breadcrumb Component
 * 
 * Displays navigation breadcrumb trail showing Home → Portal → Category → Page.
 * Updates automatically based on current route via PortalContext.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { usePortalContext } from '@/context/PortalContext';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

/**
 * Portal Breadcrumb Component
 * 
 * Automatically builds breadcrumb trail from current route.
 * Uses PortalContext for trail data.
 * 
 * @example
 * ```tsx
 * <PortalBreadcrumb />
 * ```
 */
export function PortalBreadcrumb() {
  const { breadcrumbTrail, isLoading } = usePortalContext();
  
  if (isLoading || breadcrumbTrail.length === 0) {
    return null;
  }
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-2 text-xs p-3 bg-muted/20 rounded-lg border border-border/40"
    >
      {breadcrumbTrail.map((item, index) => {
        const isLast = index === breadcrumbTrail.length - 1;
        const Icon = item.icon ? 
          (require('lucide-react') as Record<string, LucideIcon>)[item.icon] || Home : 
          null;
        
        return (
          <div key={item.id} className="flex items-center gap-2">
            {/* Breadcrumb item */}
            {item.path ? (
              <Link
                to={item.path}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                {Icon && index === 0 && <Icon className="h-3 w-3" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 text-primary font-medium">
                {Icon && index === 0 && <Icon className="h-3 w-3" />}
                <span>{item.label}</span>
              </span>
            )}
            
            {/* Separator */}
            {!isLast && (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

