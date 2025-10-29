/**
 * Enterprise Dashboard Page
 * AI-powered dashboard with conversations, team projects, and stats
 */

import { AIPoweredDashboard } from '@/components/portal/shared/AIPoweredDashboard';
import { Users, Briefcase, DollarSign, TrendingUp, UserPlus, BarChart3, FileText, Target, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <AIPoweredDashboard
      role="enterprise"
      userName={user?.name || 'Enterprise Admin'}
      
      // Simple mode - no advanced components
      useAdvancedComponents={false}
      
      // Enterprise statistics
      stats={[
        {
          id: 'team-members',
          label: 'Team Members',
          value: '24',
          icon: Users,
          trend: { value: 14, isPositive: true },
          trendData: [18, 19, 20, 21, 23, 24]
        },
        {
          id: 'active-projects',
          label: 'Active Projects',
          value: '12',
          icon: Briefcase,
          trend: { value: 20, isPositive: true },
          trendData: [8, 9, 10, 10, 11, 12]
        },
        {
          id: 'budget-utilization',
          label: 'Budget Utilization',
          value: '67%',
          icon: DollarSign,
          trend: { value: 8, isPositive: true },
          trendData: [55, 58, 62, 64, 65, 67]
        },
        {
          id: 'team-performance',
          label: 'Team Performance',
          value: '92%',
          icon: TrendingUp,
          trend: { value: 5, isPositive: true },
          trendData: [85, 87, 89, 90, 91, 92]
        }
      ]}
      
      // Quick actions for AI toolbar
      quickActions={[
        { id: 'add-member', label: 'Add team member', icon: UserPlus, onClick: () => navigate('/enterprise/team') },
        { id: 'new-project', label: 'New project', icon: Briefcase, onClick: () => navigate('/enterprise/projects') },
        { id: 'analytics', label: 'View analytics', icon: BarChart3, onClick: () => navigate('/enterprise/analytics') },
        { id: 'reports', label: 'Generate report', icon: FileText, onClick: () => navigate('/enterprise/reports') },
        { id: 'budget', label: 'Budget overview', icon: DollarSign, onClick: () => navigate('/enterprise/finance') },
        { id: 'summary', label: 'Summary', icon: TrendingUp, onClick: () => navigate('/enterprise/ai') }
      ]}
      
      // Recent projects
      projects={[
        {
          id: '1',
          title: 'Corporate Tower Expansion',
          tasks: 45,
          budget: '12500K',
          progress: 34,
          status: 'in-progress',
          description: 'Large-scale office tower expansion project with 24 team members assigned.',
          type: 'Enterprise Development',
          location: 'Riyadh, Saudi Arabia',
          created: '09/01/2024',
          lastUpdated: '01/28/2025'
        }
      ]}
      
      // Conversations
      conversations={[
        { id: '1', title: 'Team Performance Analysis', date: 'Oct 28', isStarred: true },
        { id: '2', title: 'Budget Allocation Q1', date: 'Oct 27', isStarred: false },
        { id: '3', title: 'Resource Planning', date: 'Oct 26', isStarred: true }
      ]}
      
      aiWelcomeMessage="Hello! I can help you manage your team, analyze performance, optimize budgets, and coordinate enterprise projects. What would you like to explore?"
    />
  );
}

export default DashboardPage;
