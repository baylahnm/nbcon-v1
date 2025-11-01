/**
 * Unified Dashboard Component
 * 
 * Flexible dashboard layout with widgets, quick actions, and tier-based gating.
 * Supports KPI cards, activity feeds, and task widgets with FeatureGate integration.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3)
 */

import React, { type ReactNode, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Calendar,
  User,
  MessageSquare,
  Bell,
  Briefcase,
  DollarSign,
  type LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Skeleton } from '@/pages/1-HomePage/others/components/ui/skeleton';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { FeatureGate } from './FeatureGate';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import type { SubscriptionTier } from '@/shared/types/subscription';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Widget configuration for dashboard widgets
 */
export interface DashboardWidgetConfig {
  /** Unique widget identifier */
  id: string;
  /** Widget title */
  title: string;
  /** Optional description */
  description?: string;
  /** Widget type for rendering logic */
  type: 'kpi' | 'activity-feed' | 'upcoming-tasks' | 'custom';
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Minimum tier required to view this widget */
  requiredTier?: SubscriptionTier;
  /** Optional feature ID for tracking */
  featureId?: string;
  /** Widget data (varies by type) */
  data?: unknown;
  /** Custom render function for 'custom' type */
  render?: (data: unknown) => ReactNode;
  /** Grid span (1-12) */
  span?: number;
}

/**
 * Quick action configuration
 */
export interface QuickActionConfig {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action description */
  description?: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Click handler */
  onClick: () => void;
  /** Minimum tier required */
  requiredTier?: SubscriptionTier;
  /** Optional feature ID */
  featureId?: string;
  /** Optional badge/count */
  badge?: string | number;
  /** Whether action is disabled */
  disabled?: boolean;
}

/**
 * UnifiedDashboard props
 */
export interface UnifiedDashboardProps {
  /** Dashboard title */
  title?: string;
  /** Dashboard description/subtitle */
  description?: string;
  /** Array of widget configurations */
  widgets?: DashboardWidgetConfig[];
  /** Array of quick action configurations */
  quickActions?: QuickActionConfig[];
  /** Main content area children */
  children?: ReactNode;
  /** Optional className */
  className?: string;
  /** Whether dashboard is loading */
  isLoading?: boolean;
}

// ============================================================================
// SAMPLE WIDGET DATA (Placeholder)
// ============================================================================

/**
 * Placeholder KPI data
 */
const placeholderKPIData = {
  activeProjects: { value: 12, change: +5.2, trend: 'up' },
  totalSpent: { value: '1,245,000', change: +12.8, trend: 'up' },
  pendingTasks: { value: 8, change: -3.1, trend: 'down' },
  completionRate: { value: 87, change: +2.4, trend: 'up' },
};

/**
 * Placeholder activity feed data
 */
const placeholderActivityFeed = [
  { id: '1', type: 'project', action: 'created', subject: 'New Residential Building Project', user: 'Ahmed Al-Mansouri', time: '2 hours ago', icon: Briefcase },
  { id: '2', type: 'message', action: 'sent', subject: 'Project proposal discussion', user: 'Sarah Al-Saud', time: '4 hours ago', icon: MessageSquare },
  { id: '3', type: 'task', action: 'completed', subject: 'Site survey completed', user: 'Mohammed Ali', time: '1 day ago', icon: CheckCircle },
  { id: '4', type: 'payment', action: 'received', subject: 'Invoice #1234 paid', user: 'System', time: '2 days ago', icon: DollarSign },
];

/**
 * Placeholder upcoming tasks data
 */
const placeholderUpcomingTasks = [
  { id: '1', title: 'Review architectural drawings', project: 'Residential Complex', dueDate: 'Tomorrow', priority: 'high', icon: AlertCircle },
  { id: '2', title: 'Approve budget proposal', project: 'Commercial Tower', dueDate: 'Jan 30', priority: 'medium', icon: DollarSign },
  { id: '3', title: 'Site inspection', project: 'Industrial Plant', dueDate: 'Feb 2', priority: 'low', icon: CheckCircle },
  { id: '4', title: 'Client meeting', project: 'All Projects', dueDate: 'Feb 5', priority: 'medium', icon: Calendar },
];

// ============================================================================
// WIDGET COMPONENTS
// ============================================================================

/**
 * KPI Card Widget
 */
function KPICardWidget({
  title,
  description,
  icon: Icon,
  data,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  data?: { value: string | number; change?: number; trend?: 'up' | 'down' };
}) {
  const displayData = data || placeholderKPIData.activeProjects;
  const hasTrend = displayData.change !== undefined;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayData.value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {hasTrend && (
          <div className="flex items-center gap-1 mt-2">
            {displayData.trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
            )}
            <span className={cn(
              'text-xs',
              displayData.trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {displayData.change && displayData.change > 0 ? '+' : ''}{displayData.change}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Activity Feed Widget
 */
function ActivityFeedWidget({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data?: typeof placeholderActivityFeed;
}) {
  const activities = data || placeholderActivityFeed;
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => {
              const ActivityIcon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.subject}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Upcoming Tasks Widget
 */
function UpcomingTasksWidget({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data?: typeof placeholderUpcomingTasks;
}) {
  const tasks = data || placeholderUpcomingTasks;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {tasks.map((task) => {
              const TaskIcon = task.icon;
              return (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <TaskIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.project}</p>
                      </div>
                      <Badge variant="outline" className={cn('text-xs', getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Render widget based on type
 */
function renderWidget(widget: DashboardWidgetConfig) {
  const { type, title, description, icon, data, render } = widget;
  
  switch (type) {
    case 'kpi':
      return <KPICardWidget title={title} description={description} icon={icon} data={data as any} />;
    case 'activity-feed':
      return <ActivityFeedWidget title={title} description={description} data={data as any} />;
    case 'upcoming-tasks':
      return <UpcomingTasksWidget title={title} description={description} data={data as any} />;
    case 'custom':
      return render ? render(data) : <Card><CardContent>Custom widget: {title}</CardContent></Card>;
    default:
      return <Card><CardContent>Unknown widget type</CardContent></Card>;
  }
}

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

/**
 * Dashboard Skeleton for loading state
 */
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      
      {/* Widgets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * UnifiedDashboard Component
 * 
 * Flexible dashboard with widgets, quick actions, and tier-based gating.
 * 
 * @example
 * ```tsx
 * <UnifiedDashboard
 *   title="My Dashboard"
 *   description="Overview of all your projects"
 *   widgets={widgetConfigs}
 *   quickActions={actionConfigs}
 * >
 *   <CustomContent />
 * </UnifiedDashboard>
 * ```
 */
export default function UnifiedDashboard({
  title = 'Dashboard',
  description,
  widgets = [],
  quickActions = [],
  children,
  className,
  isLoading = false,
}: UnifiedDashboardProps) {
  const { subscriptionTier } = usePortalAccess();
  
  // Filter widgets and actions by tier
  const visibleWidgets = useMemo(() => {
    return widgets.filter(widget => {
      if (!widget.requiredTier) return true;
      // Widget gating is handled by FeatureGate wrapper
      return true; // Include all, FeatureGate will handle visibility
    });
  }, [widgets]);
  
  const visibleActions = useMemo(() => {
    return quickActions.filter(action => {
      if (!action.requiredTier) return true;
      // Use tierMeetsRequirement logic (will be handled by FeatureGate in rendering)
      return true; // Include all, FeatureGate will handle visibility
    });
  }, [quickActions]);
  
  // Loading state
  if (isLoading) {
    return <DashboardSkeleton className={className} />;
  }
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <Badge variant="secondary" className="capitalize">
              {subscriptionTier}
            </Badge>
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      
      {/* Quick Actions Grid */}
      {visibleActions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {visibleActions.map((action) => {
              const ActionIcon = action.icon;
              const content = (
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 py-4 hover:bg-accent transition-colors"
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  <div className="relative">
                    <ActionIcon className="h-5 w-5" />
                    {action.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
                  {action.description && (
                    <span className="text-[10px] text-muted-foreground text-center line-clamp-2">
                      {action.description}
                    </span>
                  )}
                </Button>
              );
              
              // Wrap in FeatureGate if tier required
              if (action.requiredTier) {
                return (
                  <div key={action.id}>
                    <FeatureGate
                      requiredTier={action.requiredTier}
                      featureId={action.featureId}
                      fallback={
                        <Button
                          variant="outline"
                          className="h-auto flex-col gap-2 py-4 opacity-50 cursor-not-allowed"
                          disabled
                        >
                          <ActionIcon className="h-5 w-5" />
                          <span className="text-xs font-medium">{action.label}</span>
                        </Button>
                      }
                    >
                      {content}
                    </FeatureGate>
                  </div>
                );
              }
              
              return <div key={action.id}>{content}</div>;
            })}
          </div>
        </section>
      )}
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content Column */}
        <div className="space-y-6">
          {children}
        </div>
        
        {/* Widget Sidebar */}
        {visibleWidgets.length > 0 && (
          <aside className="space-y-6">
            {visibleWidgets.map((widget) => {
              const widgetContent = renderWidget(widget);
              
              // Wrap in FeatureGate if tier required
              if (widget.requiredTier) {
                return (
                  <div key={widget.id}>
                    <FeatureGate
                      requiredTier={widget.requiredTier}
                      featureId={widget.featureId}
                    >
                      {widgetContent}
                    </FeatureGate>
                  </div>
                );
              }
              
              return <div key={widget.id}>{widgetContent}</div>;
            })}
          </aside>
        )}
      </div>
    </div>
  );
}

// Export named export for convenience
export { UnifiedDashboard };

