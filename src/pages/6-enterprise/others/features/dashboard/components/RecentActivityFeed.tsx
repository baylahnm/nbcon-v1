import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { 
  Activity, Clock, CheckCircle, AlertTriangle, DollarSign, 
  Users, Briefcase, MessageSquare, FileText, MoreHorizontal,
  Eye, TrendingUp, Calendar, Bell
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'project' | 'payment' | 'team' | 'system' | 'message' | 'approval';
  title: string;
  description: string;
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
  amount?: string;
  project?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Received',
    description: 'NEOM Authority payment of 125,000 SAR processed successfully',
    user: {
      name: 'Ahmad Al-Rashid',
      role: 'Finance Manager'
    },
    timestamp: '2 minutes ago',
    status: 'success',
    amount: '125,000 SAR',
    project: 'NEOM City Infrastructure'
  },
  {
    id: '2',
    type: 'project',
    title: 'Project Milestone Completed',
    description: 'Phase 2 of Aramco Refinery Expansion completed ahead of schedule',
    user: {
      name: 'Fatima Al-Zahra',
      role: 'Project Manager'
    },
    timestamp: '15 minutes ago',
    status: 'success',
    project: 'Aramco Refinery Expansion'
  },
  {
    id: '3',
    type: 'team',
    title: 'New Team Member Added',
    description: 'Khalid Al-Mansouri joined the Quality Assurance team',
    user: {
      name: 'HR Department',
      role: 'Human Resources'
    },
    timestamp: '1 hour ago',
    status: 'info'
  },
  {
    id: '4',
    type: 'approval',
    title: 'Budget Approval Required',
    description: 'SABIC Chemical Plant budget increase needs your approval',
    user: {
      name: 'Noura Al-Saud',
      role: 'Business Analyst'
    },
    timestamp: '2 hours ago',
    status: 'warning',
    amount: '50,000 SAR',
    project: 'SABIC Chemical Plant'
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    description: 'Red Sea Global sent a message regarding project timeline',
    user: {
      name: 'Red Sea Global',
      role: 'Client'
    },
    timestamp: '3 hours ago',
    status: 'info',
    project: 'Red Sea Resort Development'
  },
  {
    id: '6',
    type: 'system',
    title: 'System Update',
    description: 'Dashboard analytics updated with latest Q1 2024 data',
    timestamp: '4 hours ago',
    status: 'info'
  }
];

export function RecentActivityFeed() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Add mouse tracking for animated gradient
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return DollarSign;
      case 'project': return Briefcase;
      case 'team': return Users;
      case 'system': return Activity;
      case 'message': return MessageSquare;
      case 'approval': return FileText;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/10';
      case 'warning': return 'bg-amber-500/10';
      case 'error': return 'bg-red-500/10';
      case 'info': return 'bg-blue-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-0.5"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
    >
      <Card className="bg-transparent border-0 h-full">
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 h-[40px] w-[40px] flex items-center justify-center rounded-xl ring-1 ring-cyan-500/20 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Activity</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest updates and notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                {mockActivities.length}
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Activity Feed */}
            <div className="space-y-3">
              {mockActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`${getStatusBg(activity.status)} p-2 rounded-lg ring-1 ring-current/20`}>
                        <ActivityIcon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                      </div>
                      {index < mockActivities.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-medium text-foreground">{activity.title}</h5>
                            {activity.amount && (
                              <Badge variant="outline" className="text-xs">
                                {activity.amount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                          
                          {activity.user && (
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={activity.user.avatar} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-medium text-foreground">{activity.user.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.user.role}</p>
                              </div>
                            </div>
                          )}
                          
                          {activity.project && (
                            <div className="flex items-center gap-1 mb-2">
                              <Briefcase className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{activity.project}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View All Activity
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Bell className="h-3 w-3 mr-1" />
                Notifications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
