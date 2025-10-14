import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Building2, Users, Briefcase, DollarSign, TrendingUp, 
  Calendar, MessageSquare, BarChart3, Settings, Bell, User,
  FileText, Target, Clock, AlertTriangle, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight,
  Plus, Eye, Zap, Activity, PieChart as PieChartIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../1-HomePage/others/components/ui/avatar";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { useAuthStore } from "../../../stores/auth";
import { getUserDisplayName } from '../../../../../1-HomePage/others/lib/userUtils';
import { Link } from "react-router-dom";
import { R } from "../../../../../1-HomePage/others/lib/routes";

// Enterprise-specific components
import { EnterpriseOverviewStats } from './EnterpriseOverviewStats';
import { TeamManagementWidget } from './TeamManagementWidget';
import { ProjectOversightWidget } from './ProjectOversightWidget';
import { FinancialOverviewWidget } from './FinancialOverviewWidget';
import { EnterpriseQuickActions } from './EnterpriseQuickActions';
import { RecentActivityFeed } from './RecentActivityFeed';
import { AIAssistantWidget } from './AIAssistantWidget';

export function DashboardContent() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  
  // Get user display name
  const displayName = getUserDisplayName(profile);

  // Get role display
  const getRoleDisplay = () => {
    if (profile?.role === 'enterprise') {
        return 'Enterprise Manager';
    }
    return profile?.role || 'Professional';
  };

  // Handle stat card clicks
  const handleStatClick = (stat: string) => {
    switch (stat) {
      case 'projects':
        navigate('/enterprise/team-projects');
          break;
      case 'team':
        navigate('/enterprise/team');
        break;
      case 'finance':
        navigate('/enterprise/finance');
        break;
      case 'analytics':
        navigate('/enterprise/analytics');
        break;
      case 'vendors':
        navigate('/enterprise/vendors');
        break;
      case 'performance':
        navigate('/enterprise/performance');
        break;
      default:
        break;
    }
  };

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="container mx-auto px-4 py-4 space-y-4">
        
        {/* Header */}
        <div className="pb-6 border-b border-border/40">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                    <div>
                  <h1 className="text-base font-bold tracking-tight">
                    Welcome back, {displayName}
                      </h1>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {getCurrentDate()} • {getRoleDisplay()}
                  </p>
                </div>
        </div>
              <Badge variant="outline" className="h-8 px-3 text-xs flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Enterprise Dashboard
              </Badge>
              </CardContent>
            </Card>
          </div>
          
        {/* Section 1: Enterprise Overview Stats */}
        <EnterpriseOverviewStats 
          activeProjects={24}
          teamMembers={156}
          monthlyRevenue="2,450,000 SAR"
          pendingApprovals={8}
          vendorPartnerships={42}
          onStatClick={handleStatClick}
        />

        {/* Section 2: AI Assistant */}
        <AIAssistantWidget userRole={profile?.role} />

        {/* Section 3: Enterprise Quick Actions */}
        <EnterpriseQuickActions userRole={profile?.role} />

        {/* Section 4 & 5: Team Management and Project Oversight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TeamManagementWidget />
          <ProjectOversightWidget />
      </div>

        {/* Section 6: Financial Overview */}
        <FinancialOverviewWidget 
          monthlyRevenue="2,450,000 SAR"
          quarterlyGrowth={18}
          pendingPayments="450,000 SAR"
          totalBudget="15,200,000 SAR"
        />

        {/* Section 7: Recent Activity */}
        <RecentActivityFeed />

      </div>
    </div>
  );
}