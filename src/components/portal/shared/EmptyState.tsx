/**
 * Empty State Component
 * 
 * Centered empty state display with icon, heading, description, and CTA.
 * Used when lists/grids have no data.
 * 
 * Follows design system: bg-muted/50 icon circle, text-base heading,
 * text-xs description, Button size sm.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Empty State Props
 */
export interface EmptyStateProps {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Heading text
   */
  title: string;
  
  /**
   * Description text
   */
  description: string;
  
  /**
   * Call-to-action button or element
   */
  action?: React.ReactNode;
  
  /**
   * Icon size variant
   */
  iconSize?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Empty State Component
 * 
 * Displays centered empty state with icon, message, and CTA.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Inbox}
 *   title="No projects yet"
 *   description="Create your first project to get started"
 *   action={<Button size="sm">Create Project</Button>}
 * />
 * ```
 */
export const EmptyState = memo(function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconSize = 'md',
  className = '',
}: EmptyStateProps) {
  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };
  
  const iconInnerSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {/* Icon Circle */}
      <div className={`${iconSizes[iconSize]} bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`${iconInnerSizes[iconSize]} text-muted-foreground`} />
      </div>
      
      {/* Heading */}
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      
      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
});

