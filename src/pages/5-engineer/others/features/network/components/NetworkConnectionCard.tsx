import { Card, CardContent, CardHeader } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { getUserInitials } from '../../../../../1-HomePage/others/lib/userUtils';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Target,
  Briefcase,
  Users,
  MessageSquare,
  ExternalLink,
  Award,
  MoreHorizontal,
  Calendar,
  Clock,
  Activity,
  TrendingUp
} from 'lucide-react';

interface NetworkConnectionCardProps {
  connection: {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    specialty: string;
    experience: string;
    avatar?: string;
    verified: boolean;
    connectionDate: string;
    connectionStrength: 'weak' | 'medium' | 'strong';
    mutualConnections: number;
    lastActive: string;
    recentActivity?: string;
    projects: number;
    endorsements: number;
    certifications?: string[];
  };
  onMessage: (connectionId: string) => void;
  onViewProfile?: (connectionId: string) => void;
  onEndorse?: (connectionId: string) => void;
}

export function NetworkConnectionCard({ 
  connection, 
  onMessage,
  onViewProfile,
  onEndorse
}: NetworkConnectionCardProps) {
  // Calculate connection strength percentage
  const strengthPercentage = 
    connection.connectionStrength === 'strong' ? 100 
    : connection.connectionStrength === 'medium' ? 66 
    : 33;

  const strengthColor = 
    connection.connectionStrength === 'strong' ? 'bg-green-500' 
    : connection.connectionStrength === 'medium' ? 'bg-amber-500' 
    : 'bg-blue-500';

  return (
    <Card className="gap-0 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      {/* Header Section */}
      <CardHeader className="p-4 pb-3 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 shadow-md group-hover:ring-primary/40 transition-all">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                {getUserInitials(connection.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* Name + Verified Badge */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold tracking-tight truncate">
                  {connection.name}
                </h3>
                {connection.verified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
              </div>

              {/* Title */}
              <p className="text-sm text-muted-foreground truncate mb-0.5">
                {connection.title}
              </p>

              {/* Company */}
              <button className="flex items-center gap-1.5 text-xs text-primary hover:underline transition-colors">
                <Building2 className="h-3 w-3" />
                {connection.company}
              </button>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                {connection.location}
              </div>

              {/* Connection Strength Indicator */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${strengthColor}`}
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {connection.connectionStrength} connection
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status + Last Active */}
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Connected
            </Badge>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {connection.lastActive}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
        {/* Metadata Grid - 3 Columns */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/40">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Target className="h-3.5 w-3.5" />
              <span>Specialty</span>
            </div>
            <div className="font-medium text-sm">{connection.specialty}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Experience</span>
            </div>
            <div className="font-medium text-sm">{connection.experience}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Users className="h-3.5 w-3.5" />
              <span>Mutual</span>
            </div>
            <div className="font-medium text-sm text-primary">
              {connection.mutualConnections} connections
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {connection.recentActivity && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
            <Activity className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {connection.recentActivity}
            </p>
          </div>
        )}

        {/* Certifications Pills */}
        {connection.certifications && connection.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {connection.certifications.map((cert, idx) => (
              <button 
                key={idx}
                className="px-3 py-1 rounded-full text-[10px] font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                {cert}
              </button>
            ))}
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>{connection.projects} projects</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>{connection.endorsements} endorsements</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Connected {new Date(connection.connectionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[11px]"
            onClick={() => onMessage(connection.id)}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[11px]"
            onClick={() => onViewProfile?.(connection.id)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-7 text-[11px]"
            onClick={() => onEndorse?.(connection.id)}
          >
            <Award className="h-3 w-3 mr-1" />
            Endorse
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

