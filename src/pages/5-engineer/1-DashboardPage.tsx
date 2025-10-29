/**
 * Engineer Dashboard Page
 * AI-powered dashboard with conversations, jobs, and stats
 */

import { AIPoweredDashboard } from '@/components/portal/shared/AIPoweredDashboard';
import { Briefcase, DollarSign, CheckCircle, Star, Search, Clock, FileText, TrendingUp, Target, MapPin, Upload, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <AIPoweredDashboard
      role="engineer"
      userName={user?.name || 'Engineer'}
      
      // Simple mode - no advanced components
      useAdvancedComponents={false}
      
      // Engineer statistics
      stats={[
        {
          id: 'active-jobs',
          label: 'Active Jobs',
          value: '5',
          icon: Briefcase,
          trend: { value: 25, isPositive: true },
          trendData: [3, 4, 3, 5, 4, 5]
        },
        {
          id: 'total-earnings',
          label: 'Total Earnings',
          value: 'SAR 28,500',
          icon: DollarSign,
          trend: { value: 15, isPositive: true },
          trendData: [20000, 22000, 21000, 25000, 26000, 28500]
        },
        {
          id: 'completed-tasks',
          label: 'Completed Tasks',
          value: '24',
          icon: CheckCircle,
          trend: { value: 20, isPositive: true },
          trendData: [15, 18, 16, 20, 22, 24]
        },
        {
          id: 'rating',
          label: 'Rating',
          value: '4.8',
          icon: Star,
          trend: { value: 4, isPositive: true },
          trendData: [4.5, 4.6, 4.7, 4.7, 4.8, 4.8]
        }
      ]}
      
      // Quick actions for AI toolbar
      quickActions={[
        { id: 'find-jobs', label: 'Find jobs', icon: Search, onClick: () => navigate('/engineer/jobs') },
        { id: 'check-in', label: 'Check in', icon: MapPin, onClick: () => navigate('/engineer/checkin') },
        { id: 'upload', label: 'Upload deliverable', icon: Upload, onClick: () => navigate('/engineer/job/upload') },
        { id: 'calendar', label: 'Calendar', icon: Calendar, onClick: () => navigate('/engineer/calendar') },
        { id: 'view-earnings', label: 'View earnings', icon: DollarSign, onClick: () => navigate('/engineer/finance') },
        { id: 'summary', label: 'Summary', icon: TrendingUp, onClick: () => navigate('/engineer/ai') }
      ]}
      
      // Recent jobs (shown as projects)
      projects={[
        {
          id: '1',
          title: 'Structural Review - Riyadh Tower',
          tasks: 8,
          budget: '8500',
          progress: 60,
          status: 'in-progress',
          description: 'Structural analysis and review for high-rise tower project in Riyadh.',
          type: 'Structural Engineering',
          location: 'Riyadh, Saudi Arabia',
          created: '01/15/2025',
          lastUpdated: '01/27/2025'
        }
      ]}
      
      // Conversations
      conversations={[
        { id: '1', title: 'Job Application - Tower Project', date: 'Oct 28', isStarred: true },
        { id: '2', title: 'Client Q&A - HVAC Design', date: 'Oct 27', isStarred: false }
      ]}
      
      aiWelcomeMessage="Hello! I can help you find jobs, manage your tasks, track earnings, and optimize your engineering career. What would you like to know?"
    />
  );
}
