import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Activity, CheckCircle2, FileText, Briefcase, Upload, MessageSquare, GraduationCap, Clock, Eye, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'milestone' | 'invoice' | 'job' | 'deliverable' | 'checkin' | 'message' | 'course';
  title: string;
  description?: string;
  timestamp: string;
  relativeTime: string;
  link?: string;
}

interface RecentActivityFeedProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'Milestone Completed',
    description: 'Foundation Analysis Report - NEOM Smart City',
    timestamp: '2025-10-10T14:30:00',
    relativeTime: '2 hours ago',
    link: '/engineer/projects/neom'
  },
  {
    id: '2',
    type: 'invoice',
    title: 'Invoice Paid',
    description: '85,000 SAR received from Saudi Aramco',
    timestamp: '2025-10-10T10:15:00',
    relativeTime: '6 hours ago',
    link: '/engineer/finance'
  },
  {
    id: '3',
    type: 'job',
    title: 'Job Application Submitted',
    description: 'Senior Structural Engineer - Saudi Binladin Group',
    timestamp: '2025-10-09T16:45:00',
    relativeTime: '1 day ago',
    link: '/engineer/jobs'
  },
  {
    id: '4',
    type: 'deliverable',
    title: 'Deliverable Uploaded',
    description: 'Structural Design Phase 1 - Red Sea Marina',
    timestamp: '2025-10-09T09:20:00',
    relativeTime: '1 day ago',
    link: '/engineer/job/upload'
  },
  {
    id: '5',
    type: 'checkin',
    title: 'Checked In',
    description: 'NEOM Smart City - Section A (8.5 hours logged)',
    timestamp: '2025-10-08T08:00:00',
    relativeTime: '2 days ago',
    link: '/engineer/checkin'
  },
  {
    id: '6',
    type: 'message',
    title: 'New Message',
    description: 'From Nasser Baylah about contract review',
    timestamp: '2025-10-08T14:30:00',
    relativeTime: '2 days ago',
    link: '/engineer/messages'
  },
  {
    id: '7',
    type: 'course',
    title: 'Course Progress',
    description: 'Completed "Advanced Structural Analysis" module 3',
    timestamp: '2025-10-07T18:00:00',
    relativeTime: '3 days ago',
    link: '/engineer/learning'
  },
];

export function RecentActivityFeed({ 
  activities = defaultActivities, 
  maxItems = 10 
}: RecentActivityFeedProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'milestone':
        return { Icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-500/10', ringColor: 'ring-green-500/20' };
      case 'invoice':
        return { Icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10', ringColor: 'ring-emerald-500/20' };
      case 'job':
        return { Icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-500/10', ringColor: 'ring-blue-500/20' };
      case 'deliverable':
        return { Icon: Upload, color: 'text-purple-600', bgColor: 'bg-purple-500/10', ringColor: 'ring-purple-500/20' };
      case 'checkin':
        return { Icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-500/10', ringColor: 'ring-amber-500/20' };
      case 'message':
        return { Icon: MessageSquare, color: 'text-cyan-600', bgColor: 'bg-cyan-500/10', ringColor: 'ring-cyan-500/20' };
      case 'course':
        return { Icon: GraduationCap, color: 'text-indigo-600', bgColor: 'bg-indigo-500/10', ringColor: 'ring-indigo-500/20' };
      default:
        return { Icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-500/10', ringColor: 'ring-gray-500/20' };
    }
  };

  // Group activities by date
  const groupedActivities = displayedActivities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel = 'This Week';
    if (date.toDateString() === today.toDateString()) {
      dateLabel = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = 'Yesterday';
    }

    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(activity);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

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
            <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your latest actions and updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">{activities.length}</Badge>
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
        <CardContent className="p-5 bg-background rounded-b-xl">
        <div className="space-y-4">
          {Object.entries(groupedActivities).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              {/* Date Label */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs font-medium text-muted-foreground px-2">
                  {dateLabel}
                </span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              {/* Activity Items */}
              <div className="space-y-2">
                {items.map((activity) => {
                  const { Icon, color, bgColor, ringColor } = getActivityIcon(activity.type);
                  
                  return (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/50"
                    >
                      {/* Icon */}
                      <div className={`${bgColor} p-2 rounded-lg ring-1 ${ringColor} flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight mb-0.5">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-muted-foreground">
                            {activity.relativeTime}
                          </span>
                          {activity.link && (
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-5 px-2 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Link to={activity.link}>
                                <Eye className="h-2.5 w-2.5 mr-1" />
                                View
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {activities.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View All Activity ({activities.length - maxItems} more)
            </Button>
          </div>
        )}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-8 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No recent activity</p>
            <p className="text-xs text-muted-foreground">
              Your activity feed will appear here
            </p>
          </div>
        )}
        </CardContent>
      )}
    </Card>
  );
}

