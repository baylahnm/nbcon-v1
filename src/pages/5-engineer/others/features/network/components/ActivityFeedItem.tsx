import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { getUserInitials } from '../../../../../1-HomePage/others/lib/userUtils';
import {
  Users,
  Briefcase,
  Award,
  Star,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface ActivityFeedItemProps {
  activity: {
    id: string;
    type: 'connection' | 'project' | 'certification' | 'endorsement' | 'post';
    user: {
      name: string;
      avatar?: string;
    };
    content: string;
    timestamp: string;
    relatedTo?: string;
  };
  onClickRelated?: (relatedId: string) => void;
}

const activityConfig = {
  connection: {
    icon: Users,
    colors: { bg: 'bg-blue-500/10', icon: 'text-blue-600', ring: 'ring-blue-500/20' }
  },
  project: {
    icon: Briefcase,
    colors: { bg: 'bg-green-500/10', icon: 'text-green-600', ring: 'ring-green-500/20' }
  },
  certification: {
    icon: Award,
    colors: { bg: 'bg-purple-500/10', icon: 'text-purple-600', ring: 'ring-purple-500/20' }
  },
  endorsement: {
    icon: Star,
    colors: { bg: 'bg-amber-500/10', icon: 'text-amber-600', ring: 'ring-amber-500/20' }
  },
  post: {
    icon: FileText,
    colors: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' }
  }
};

export function ActivityFeedItem({ activity, onClickRelated }: ActivityFeedItemProps) {
  const config = activityConfig[activity.type];
  const ActivityIcon = config.icon;

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
      {/* Activity Icon (Color-coded) */}
      <div className={`${config.colors.bg} p-2.5 rounded-full ring-1 ${config.colors.ring}`}>
        <ActivityIcon className={`h-4 w-4 ${config.colors.icon}`} />
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">{activity.user.name}</span>
            {' '}
            <span className="text-muted-foreground">{activity.content}</span>
          </p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {activity.timestamp}
          </span>
        </div>

        {/* Related Content (if any) */}
        {activity.relatedTo && (
          <button 
            className="text-xs text-primary hover:underline mt-1"
            onClick={() => onClickRelated?.(activity.id)}
          >
            {activity.relatedTo}
          </button>
        )}
      </div>

      {/* User Avatar (Small) */}
      <Avatar className="h-8 w-8 ring-1 ring-border">
        <AvatarImage src={activity.user.avatar} />
        <AvatarFallback className="text-xs">
          {getUserInitials(activity.user.name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

