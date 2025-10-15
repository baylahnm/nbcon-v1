import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { useAuthStore } from "../../../stores/auth";
import { getUserDisplayName } from '../../../../../1-HomePage/others/lib/userUtils';

// Import client dashboard widgets
import { ClientOverviewStats } from './ClientOverviewStats';
import { ClientQuickActionsHub } from './ClientQuickActionsHub';
import { ClientActiveProjectsList } from './ClientActiveProjectsList';
import { ClientRecentActivityFeed } from './ClientRecentActivityFeed';

export function DashboardContent() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  
  // Get user display name
  const displayName = getUserDisplayName(profile);

  // Get role display
  const getRoleDisplay = () => {
    if (profile?.role === 'client') {
      return 'Project Manager';
    }
    return profile?.role || 'Professional';
  };

  // Handle stat card clicks
  const handleStatClick = (stat: string) => {
    switch (stat) {
      case 'projects':
        navigate('/free/projects');
        break;
      case 'engineers':
        navigate('/free/browse-engineers');
        break;
      case 'quotes':
        navigate('/free/quotes');
        break;
      case 'finance':
        navigate('/free/finance');
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
      <div className="px-6 py-4 space-y-4">
        
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
            </CardContent>
          </Card>
        </div>
        
        {/* Section 1: Overview Stats */}
        <ClientOverviewStats 
          activeProjects={6}
          totalEngineers={24}
          pendingQuotes={8}
          totalSpent="1,245,000 SAR"
          onStatClick={handleStatClick}
        />

        {/* Section 2: Quick Actions */}
        <ClientQuickActionsHub userRole={profile?.role} />

        {/* Section 3 & 4: Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Active Projects */}
          <ClientActiveProjectsList />
          
          {/* Recent Activity */}
          <ClientRecentActivityFeed />
        </div>

      </div>
    </div>
  );
}
