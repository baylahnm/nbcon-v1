/**
 * Enterprise Dashboard Page (Unified)
 * Renders the shared UnifiedDashboard template to ensure consistent UI across portals.
 */

import { UnifiedDashboard } from '@/components/portal/shared/UnifiedDashboard';
import { LayoutDashboard, Users, Briefcase, DollarSign, TrendingUp, UserPlus, BarChart3, FileText, Target, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SubscriptionTier } from '@/shared/types/subscription';

export function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      id: 'team-members',
      label: 'Team Members',
      value: '24',
      icon: Users,
      trend: { value: 14, isPositive: true },
    },
    {
      id: 'active-projects',
      label: 'Active Projects',
      value: '12',
      icon: Briefcase,
      trend: { value: 20, isPositive: true },
    },
    {
      id: 'budget-utilization',
      label: 'Budget Utilization',
      value: '67%',
      icon: DollarSign,
      trend: { value: 8, isPositive: true },
    },
    {
      id: 'team-performance',
      label: 'Team Performance',
      value: '92%',
      icon: TrendingUp,
      trend: { value: 5, isPositive: true },
    }
  ];

  const quickActions = [
    { id: 'add-member', label: 'Add team member', icon: UserPlus, onClick: () => navigate('/enterprise/team-projects') },
    { id: 'new-project', label: 'New project', icon: Briefcase, onClick: () => navigate('/enterprise/post-project') },
    { id: 'analytics', label: 'View analytics', icon: BarChart3, onClick: () => navigate('/enterprise/analytics') },
    { id: 'reports', label: 'Generate report', icon: FileText, onClick: () => navigate('/enterprise/reports') },
    { id: 'budget', label: 'Budget overview', icon: DollarSign, onClick: () => navigate('/enterprise/finance'), requiredTier: 'pro' as SubscriptionTier },
    { id: 'calendar', label: 'Calendar', icon: Calendar, onClick: () => navigate('/enterprise/calendar') },
  ];

  const config = {
    role: 'enterprise' as const,
    pageTitle: 'Dashboard',
    pageIcon: LayoutDashboard,
    stats,
    quickActions,
    mainContent: (
      <div className="space-y-4">
        {/* Placeholder for enterprise-specific main content; keep unified layout */}
        <div className="bg-background border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Welcome to your enterprise overview.</p>
        </div>
      </div>
    ),
    widgets: [
      {
        id: 'goals',
        title: 'Quarter Goals',
        content: (
          <ul className="text-sm list-disc pl-4 space-y-1">
            <li>Improve budget utilization</li>
            <li>Accelerate project delivery</li>
            <li>Upskill team performance</li>
          </ul>
        ),
      },
    ],
  };

  return <UnifiedDashboard config={config} />;
}

export default DashboardPage;
