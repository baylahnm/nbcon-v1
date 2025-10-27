/**
 * Unified Dashboard Template
 * 
 * Template component for role-specific dashboards with consistent layout
 * and design system across all portals.
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/shared/types/auth';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Stat configuration for overview cards
 */
export interface StatConfig {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: string;
}

/**
 * Quick action button configuration
 */
export interface QuickActionConfig {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  badge?: string;
  disabled?: boolean;
}

/**
 * Widget configuration for sidebar
 */
export interface WidgetConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  className?: string;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  role: UserRole;
  pageTitle: string;
  pageIcon: LucideIcon;
  stats: StatConfig[];
  quickActions: QuickActionConfig[];
  mainContent: React.ReactNode;
  widgets: WidgetConfig[];
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  stat: StatConfig;
}

function StatCard({ stat }: StatCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleRad = Math.atan2(y - centerY, x - centerX);
    wrapperRef.current.style.setProperty('--rotation', `${angleRad}rad`);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: 'linear-gradient(hsl(var(--card)), hsl(var(--card))), linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      data-testid={`dashboard-stat-${stat.id}`}
    >
      <Card className="bg-transparent border-0">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  'bg-primary h-[32px] w-[32px] rounded-lg flex items-center justify-center transition-transform',
                  isHovered && 'scale-110'
                )}
              >
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              {stat.trend && (
                <Badge
                  className={cn(
                    'text-[9px]',
                    stat.trend.isPositive
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  )}
                >
                  {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
                  {stat.trend.label && ` ${stat.trend.label}`}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold tracking-tight mt-1">{stat.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// QUICK ACTION COMPONENT
// ============================================================================

interface QuickActionProps {
  action: QuickActionConfig;
}

function QuickAction({ action }: QuickActionProps) {
  return (
    <Button
      onClick={action.onClick}
      variant={action.variant || 'outline'}
      className="h-auto flex-col items-start gap-2 p-4 hover:bg-accent hover:border-accent"
      disabled={action.disabled}
      data-testid={`dashboard-action-${action.id}`}
    >
      <div className="flex items-center gap-2 w-full">
        <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20">
          <action.icon className="h-4 w-4 text-primary" />
        </div>
        {action.badge && (
          <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[9px]">
            {action.badge}
          </Badge>
        )}
      </div>
      <div className="text-left w-full">
        <p className="text-sm font-medium">{action.label}</p>
        {action.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
        )}
      </div>
    </Button>
  );
}

// ============================================================================
// WIDGET COMPONENT
// ============================================================================

interface WidgetProps {
  widget: WidgetConfig;
}

function Widget({ widget }: WidgetProps) {
  return (
    <Card className={widget.className} data-testid={`dashboard-widget-${widget.id}`}>
      <CardContent className="p-4">
        <h3 className="text-base font-semibold mb-4">{widget.title}</h3>
        {widget.content}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PAGE HEADER COMPONENT
// ============================================================================

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
}

function PageHeader({ title, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}

// ============================================================================
// MAIN UNIFIED DASHBOARD COMPONENT
// ============================================================================

export interface UnifiedDashboardProps {
  config: DashboardConfig;
  className?: string;
}

/**
 * UnifiedDashboard - Template component for all role-specific dashboards
 * 
 * Provides consistent layout, spacing, and design system across portals.
 * Role-specific content is injected via config props.
 * 
 * @example
 * ```tsx
 * const clientDashboardConfig: DashboardConfig = {
 *   role: 'client',
 *   pageTitle: 'Dashboard',
 *   pageIcon: LayoutDashboard,
 *   stats: [...],
 *   quickActions: [...],
 *   mainContent: <ActiveProjectsList />,
 *   widgets: [...],
 * };
 * 
 * <UnifiedDashboard config={clientDashboardConfig} />
 * ```
 */
export function UnifiedDashboard({ config, className }: UnifiedDashboardProps) {
  return (
    <div className={cn('p-4 space-y-4', className)} data-testid={`dashboard-${config.role}`}>
      {/* Page Header */}
      <PageHeader title={config.pageTitle} icon={config.pageIcon} />

      {/* Overview Stats Grid */}
      {config.stats.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-testid="dashboard-stats"
        >
          {config.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      )}

      {/* Quick Actions Hub */}
      {config.quickActions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-testid="dashboard-quick-actions"
            >
              {config.quickActions.map((action) => (
                <QuickAction key={action.id} action={action} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content + Widgets Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4" data-testid="dashboard-main-content">
          {config.mainContent}
        </div>

        {/* Widgets Sidebar */}
        {config.widgets.length > 0 && (
          <div className="space-y-4" data-testid="dashboard-widgets">
            {config.widgets.map((widget) => (
              <Widget key={widget.id} widget={widget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

/**
 * Loading skeleton for dashboard
 */
export function UnifiedDashboardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="h-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

