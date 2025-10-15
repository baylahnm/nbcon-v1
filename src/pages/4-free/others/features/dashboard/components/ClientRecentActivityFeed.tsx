import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Activity, CheckCircle2, FileText, Briefcase, Users, DollarSign, MessageSquare, ChevronUp, ChevronDown, Clock, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'quote' | 'payment' | 'project' | 'engineer' | 'message' | 'deadline';
  title: string;
  description: string;
  relativeTime: string;
  link?: string;
}

interface ClientRecentActivityFeedProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'quote',
    title: 'New Quote Received',
    description: 'Ahmed Al-Rashid submitted quote for Al-Khobar project',
    relativeTime: '30 min ago',
    link: '/free/quotes'
  },
  {
    id: '2',
    type: 'payment',
    description: 'Milestone payment released: 125,000 SAR for NEOM project',
    relativeTime: '2 hours ago',
    link: '/free/payments'
  },
  {
    id: '3',
    type: 'project',
    title: 'Milestone Completed',
    description: 'Foundation Review completed for Riyadh Metro Extension',
    relativeTime: '4 hours ago',
    link: '/free/myprojects'
  },
  {
    id: '4',
    type: 'engineer',
    title: 'Engineer Applications',
    description: '3 new engineers applied for Al-Khobar Commercial Center',
    relativeTime: '6 hours ago',
    link: '/free/browse'
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    description: 'From Eng. Mohammed regarding structural revisions',
    relativeTime: '1 day ago',
    link: '/free/messages'
  },
  {
    id: '6',
    type: 'deadline',
    title: 'Upcoming Deadline',
    description: 'NEOM Phase 2 - Site Survey due in 3 days',
    relativeTime: '1 day ago',
    link: '/free/myprojects'
  },
];

export function ClientRecentActivityFeed({ 
  activities = defaultActivities, 
  maxItems = 10 
}: ClientRecentActivityFeedProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'quote':
        return { Icon: FileText, color: 'text-green-600', bgColor: 'bg-green-500/10', ringColor: 'ring-green-500/20' };
      case 'payment':
        return { Icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10', ringColor: 'ring-emerald-500/20' };
      case 'project':
        return { Icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-500/10', ringColor: 'ring-blue-500/20' };
      case 'engineer':
        return { Icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-500/10', ringColor: 'ring-purple-500/20' };
      case 'message':
        return { Icon: MessageSquare, color: 'text-cyan-600', bgColor: 'bg-cyan-500/10', ringColor: 'ring-cyan-500/20' };
      case 'deadline':
        return { Icon: AlertCircle, color: 'text-amber-600', bgColor: 'bg-amber-500/10', ringColor: 'ring-amber-500/20' };
      default:
        return { Icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-500/10', ringColor: 'ring-gray-500/20' };
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest updates from your projects
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
              {displayedActivities.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-5 space-y-3 bg-background rounded-b-xl">
          {displayedActivities.map((activity) => {
            const { Icon, color, bgColor, ringColor } = getActivityIcon(activity.type);
            
            return (
              <div 
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <div className={`${bgColor} p-2.5 rounded-lg ring-1 ${ringColor} shrink-0`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed line-clamp-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.relativeTime}</span>
                  </div>
                </div>
                {activity.link && (
                  <Button 
                    asChild
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    <Link to={activity.link}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

export default ClientRecentActivityFeed;

