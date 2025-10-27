/**
 * Page Header Component
 * 
 * Standardized page header with gradient icon container, title, subtitle,
 * and action buttons. Used across all portal pages for consistency.
 * 
 * Follows strict design system: bg-primary-gradient icons, text-base titles,
 * text-xs subtitles, gap-3 spacing.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Page Header Props
 */
export interface PageHeaderProps {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Page title (text-base font-bold)
   */
  title: string;
  
  /**
   * Page subtitle/description (text-xs text-muted-foreground)
   */
  subtitle?: string;
  
  /**
   * Action buttons (right side)
   */
  actions?: React.ReactNode;
  
  /**
   * Additional badges or labels
   */
  badge?: React.ReactNode;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Page Header Component
 * 
 * Displays page branding with icon, title, subtitle, and actions.
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   icon={LayoutDashboard}
 *   title="Dashboard"
 *   subtitle="Welcome to your command center"
 *   actions={
 *     <>
 *       <Button size="sm">New Project</Button>
 *       <Button size="sm" variant="outline">Settings</Button>
 *     </>
 *   }
 * />
 * ```
 */
export const PageHeader = memo(function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  badge,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`flex items-center justify-between pb-6 border-b border-border/40 ${className}`}>
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-3">
        {/* Icon Container (Gradient) */}
        <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </div>
        
        {/* Title & Subtitle */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Right: Actions */}
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
});

