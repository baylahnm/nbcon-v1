import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { getUserInitials } from '../../../../../1-HomePage/others/lib/userUtils';
import {
  CheckCircle2,
  Users,
  Clock,
  UserCheck,
  X,
  ExternalLink
} from 'lucide-react';

interface ConnectionRequestCardProps {
  request: {
    id: string;
    requester: {
      id: string;
      name: string;
      title: string;
      company: string;
      avatar?: string;
      verified: boolean;
    };
    message?: string;
    timestamp: string;
    mutualConnections: number;
  };
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export function ConnectionRequestCard({ 
  request, 
  onAccept, 
  onDecline,
  onViewProfile
}: ConnectionRequestCardProps) {
  return (
    <Card className="gap-0 border-l-4 border-l-primary hover:shadow-md transition-all">
      <CardContent className="p-4 bg-background rounded-xl">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Requester Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={request.requester.avatar} />
              <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                {getUserInitials(request.requester.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold truncate">
                  {request.requester.name}
                </h4>
                {request.requester.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {request.requester.title} @ {request.requester.company}
              </p>
              
              {/* Request Message */}
              {request.message && (
                <p className="text-xs text-foreground/70 mt-2 p-2 bg-muted/50 rounded-lg line-clamp-2 leading-relaxed">
                  "{request.message}"
                </p>
              )}

              {/* Mutual Connections */}
              <div className="flex items-center gap-1 text-[10px] text-primary mt-2">
                <Users className="h-3 w-3" />
                <span>{request.mutualConnections} mutual connections</span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{request.timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 h-7 text-[11px]"
            onClick={() => onAccept(request.id)}
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[11px]"
            onClick={() => onDecline(request.id)}
          >
            <X className="h-3 w-3 mr-1" />
            Decline
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-[11px]"
            onClick={() => onViewProfile?.(request.requester.id)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

