/**
 * Section Header Component
 * 
 * Standardized section header with icon container, title, subtitle,
 * and optional badge or action button on the right.
 * 
 * Follows design system: bg-primary/10 icon containers, text-base titles,
 * text-xs subtitles.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Section Header Props
 */
export interface SectionHeaderProps {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Section title
   */
  title: string;
  
  /**
   * Optional subtitle
   */
  subtitle?: string;
  
  /**
   * Right side content (badge or button)
   */
  action?: React.ReactNode;
  
  /**
   * Icon color variant (defaults to primary)
   */
  iconColor?: 'primary' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Section Header Component
 * 
 * Displays section header with icon, title, and optional action.
 * 
 * @example
 * ```tsx
 * <SectionHeader
 *   icon={Briefcase}
 *   title="Recent Projects"
 *   subtitle="Last 30 days"
 *   action={<Badge variant="outline">12</Badge>}
 * />
 * ```
 */
export const SectionHeader = memo(function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  iconColor = 'primary',
  className = '',
}: SectionHeaderProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary ring-primary/20',
    blue: 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
    green: 'bg-green-500/10 text-green-600 ring-green-500/20',
    amber: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
    red: 'bg-red-500/10 text-red-600 ring-red-500/20',
    purple: 'bg-purple-500/10 text-purple-600 ring-purple-500/20',
  }[iconColor];
  
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-3">
        {/* Icon Container */}
        <div className={`${colorClasses} p-2 rounded-xl ring-1 shadow-md`}>
          <Icon className="h-4 w-4" />
        </div>
        
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Right: Action */}
      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </div>
  );
});

