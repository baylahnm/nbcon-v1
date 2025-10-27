/**
 * Loading State Component
 * 
 * Skeleton loading states for different layout types.
 * Provides consistent loading UX across all portal pages.
 * 
 * Follows design system: bg-muted/30 skeletons, animate-pulse,
 * spacing matched to real components.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { memo } from 'react';

/**
 * Loading state variant types
 */
export type LoadingVariant = 'page' | 'grid' | 'list' | 'card' | 'form' | 'stats';

/**
 * Loading State Props
 */
export interface LoadingStateProps {
  /**
   * Loading variant to display
   */
  variant?: LoadingVariant;
  
  /**
   * Number of skeleton items (for grid/list)
   */
  count?: number;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Loading State Component
 * 
 * Displays appropriate skeleton based on variant.
 * 
 * @example
 * ```tsx
 * <LoadingState variant="grid" count={6} />
 * <LoadingState variant="stats" />
 * <LoadingState variant="form" />
 * ```
 */
export const LoadingState = memo(function LoadingState({
  variant = 'page',
  count = 3,
  className = '',
}: LoadingStateProps) {
  switch (variant) {
    case 'stats':
      return <StatsLoadingSkeleton className={className} />;
    
    case 'grid':
      return <GridLoadingSkeleton count={count} className={className} />;
    
    case 'list':
      return <ListLoadingSkeleton count={count} className={className} />;
    
    case 'card':
      return <CardLoadingSkeleton className={className} />;
    
    case 'form':
      return <FormLoadingSkeleton className={className} />;
    
    case 'page':
    default:
      return <PageLoadingSkeleton className={className} />;
  }
});

/**
 * Page loading skeleton (header + stats + content)
 */
const PageLoadingSkeleton = memo(function PageLoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Content */}
      <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
    </div>
  );
});

/**
 * Stats grid loading skeleton
 */
const StatsLoadingSkeleton = memo(function StatsLoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-muted/30 rounded-lg p-5 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-muted rounded-lg" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
});

/**
 * Grid loading skeleton
 */
const GridLoadingSkeleton = memo(function GridLoadingSkeleton({ 
  count = 6, 
  className = '' 
}: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-muted/30 rounded-lg p-5 space-y-3 animate-pulse">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
});

/**
 * List loading skeleton
 */
const ListLoadingSkeleton = memo(function ListLoadingSkeleton({ 
  count = 5, 
  className = '' 
}: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
          <div className="h-10 w-10 bg-muted rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-muted rounded" />
            <div className="h-2 w-2/3 bg-muted rounded" />
          </div>
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
});

/**
 * Card loading skeleton
 */
const CardLoadingSkeleton = memo(function CardLoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-muted/30 rounded-lg p-5 space-y-4 animate-pulse ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-muted rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-4/5 bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-muted rounded" />
        <div className="h-8 w-20 bg-muted rounded" />
      </div>
    </div>
  );
});

/**
 * Form loading skeleton
 */
const FormLoadingSkeleton = memo(function FormLoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-3 w-24 bg-muted/30 rounded" />
          <div className="h-10 w-full bg-muted/30 rounded-lg" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <div className="h-10 w-24 bg-muted/30 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    </div>
  );
});

/**
 * Export component and variants
 */
export { LoadingState, StatsLoadingSkeleton, GridLoadingSkeleton, ListLoadingSkeleton };

