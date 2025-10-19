import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import {
  Users,
  Briefcase,
  Award,
  Star,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Helper to get initials from name string
const getInitialsFromName = (name: string): string => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

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
    details?: string;
  };
  onClickRelated?: (relatedId: string) => void;
}

const activityConfig = {
  connection: {
    icon: Users,
    colors: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' }
  },
  project: {
    icon: Briefcase,
    colors: { bg: 'bg-success/10', icon: 'text-success', ring: 'ring-success/20' }
  },
  certification: {
    icon: Award,
    colors: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' }
  },
  endorsement: {
    icon: Star,
    colors: { bg: 'bg-warning/10', icon: 'text-warning', ring: 'ring-warning/20' }
  },
  post: {
    icon: FileText,
    colors: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' }
  }
};

export function ActivityFeedItem({ activity, onClickRelated }: ActivityFeedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = activityConfig[activity.type];
  const ActivityIcon = config.icon;

  return (
    <div className="rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-4 p-4">
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
          {getInitialsFromName(activity.user.name)}
        </AvatarFallback>
      </Avatar>

      {/* Expand/Collapse Button */}
      {activity.details && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}
    </div>

    {/* Expanded Details Section */}
    {isExpanded && activity.details && (
      <div className="px-4 pb-4 pt-2 border-t border-border/40 mt-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {activity.details}
        </p>
      </div>
    )}
    </div>
  );
}

