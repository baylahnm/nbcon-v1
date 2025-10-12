import { 
  Award, 
  Briefcase, 
  FileCheck, 
  Star,
  UserPlus,
  GraduationCap
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

export function ActivityFeed() {
  // Mock data
  const activities = [
    {
      id: '1',
      type: 'project_completed',
      icon: Briefcase,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-500/10',
      iconRing: 'ring-green-500/20',
      title: 'Completed NEOM project',
      description: 'NEOM Smart City Infrastructure',
      timestamp: '2 days ago'
    },
    {
      id: '2',
      type: 'certification',
      icon: Award,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-500/10',
      iconRing: 'ring-amber-500/20',
      title: 'Earned new certification',
      description: 'PMP Certification renewed',
      timestamp: '1 week ago'
    },
    {
      id: '3',
      type: 'skills',
      icon: Star,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/10',
      iconRing: 'ring-blue-500/20',
      title: 'Added 3 new skills',
      description: 'Tekla, STAAD.Pro, BIM 360',
      timestamp: '2 weeks ago'
    },
    {
      id: '4',
      type: 'review',
      icon: Star,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-500/10',
      iconRing: 'ring-purple-500/20',
      title: 'Received 5-star review',
      description: 'From Mohammed Al-Zahrani',
      timestamp: '2 weeks ago'
    },
    {
      id: '5',
      type: 'connection',
      icon: UserPlus,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-500/10',
      iconRing: 'ring-cyan-500/20',
      title: 'New connection',
      description: 'Connected with Sarah Johnson',
      timestamp: '3 weeks ago'
    },
    {
      id: '6',
      type: 'profile_update',
      icon: FileCheck,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      iconRing: 'ring-primary/20',
      title: 'Profile updated',
      description: 'Added work experience',
      timestamp: '1 month ago'
    }
  ];

  return (
    <Card className="gap-0 border-border/50">
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Recent Activity</h3>
          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
            {activities.length} items
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide bg-background rounded-b-xl">
        {activities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <div 
              key={activity.id}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div className={`${activity.iconBg} p-2 rounded-lg ring-1 ${activity.iconRing} flex-shrink-0`}>
                <Icon className={`h-3.5 w-3.5 ${activity.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-0.5 truncate">{activity.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{activity.description}</p>
                <p className="text-[9px] text-muted-foreground/60 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

