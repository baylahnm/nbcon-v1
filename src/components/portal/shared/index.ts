/**
 * Portal Shared Components - Export Barrel
 * 
 * Centralized exports for reusable portal UI components.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

export { PageHeader } from './PageHeader';
export type { PageHeaderProps } from './PageHeader';

export { StatsGrid } from './StatsGrid';
export type { StatsGridProps, StatItem } from './StatsGrid';

export { QuickActionHub } from './QuickActionHub';
export type { QuickActionHubProps, QuickActionItem } from './QuickActionHub';

export { SectionHeader } from './SectionHeader';
export type { SectionHeaderProps } from './SectionHeader';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { 
  LoadingState,
  StatsLoadingSkeleton,
  GridLoadingSkeleton,
  ListLoadingSkeleton,
} from './LoadingState';
export type { LoadingStateProps, LoadingVariant } from './LoadingState';

