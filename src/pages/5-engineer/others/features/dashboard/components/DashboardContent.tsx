import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { useAuthStore } from "../../../stores/auth";
import { getUserDisplayName } from '../../../../../1-HomePage/others/lib/userUtils';

// Import new dashboard components
import { AIAssistantWidget } from './AIAssistantWidget';
import { QuickActionsHub } from './QuickActionsHub';
import { OverviewStats } from './OverviewStats';
import { ActiveProjectsList } from './ActiveProjectsList';
import { EarningsWidget } from './EarningsWidget';
import { RecentActivityFeed } from './RecentActivityFeed';

export function DashboardContent() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  
  // Get user display name
  const displayName = getUserDisplayName(profile);

  // Get role display
  const getRoleDisplay = () => {
    if (profile?.role === 'engineer') {
        return 'Senior Structural Engineer';
    }
    return profile?.role || 'Professional';
  };

  // Handle stat card clicks
  const handleStatClick = (stat: string) => {
    switch (stat) {
      case 'projects':
        navigate('/engineer/projects');
        break;
      case 'invoices':
        navigate('/engineer/finance');
        break;
      case 'revenue':
        navigate('/engineer/finance');
        break;
      case 'profile':
        navigate('/engineer/profile');
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
        <div className="pb-0 border-b border-border/40">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
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
                <Home className="h-4 w-4" />
                Dashboard
              </Badge>
              </CardContent>
            </Card>
          </div>
          
        {/* Section 1: Overview Stats */}
        <OverviewStats 
          activeProjects={6}
          pendingInvoices={3}
          pendingInvoicesAmount="45,000 SAR"
          monthlyRevenue="52,800 SAR"
          profileCompletion={85}
          onStatClick={handleStatClick}
        />

        {/* Section 2: AI Assistant */}
        <AIAssistantWidget userRole={profile?.role} />

        {/* Section 3: Quick Actions */}
        <QuickActionsHub userRole={profile?.role} />

        {/* Section 4 & 5: Projects and Earnings */}
        <div className="space-y-4">
          {/* Active Projects */}
          <ActiveProjectsList />
          
          {/* Earnings Widget */}
          <EarningsWidget 
            weeklyEarnings="12,750 SAR"
            monthlyEarnings="52,800 SAR"
            monthlyGrowth={12}
          />
        </div>

        {/* Section 6: Recent Activity */}
        <RecentActivityFeed />

      </div>
    </div>
  );
}
