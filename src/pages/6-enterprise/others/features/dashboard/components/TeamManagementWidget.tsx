import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { 
  Users, UserPlus, TrendingUp, Clock, CheckCircle, AlertTriangle,
  MoreHorizontal, Eye, MessageSquare
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  utilization: number;
  projects: number;
  lastActive: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmad Al-Rashid',
    role: 'Senior Project Manager',
    status: 'online',
    utilization: 85,
    projects: 3,
    lastActive: '2 min ago'
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    role: 'Lead Engineer',
    status: 'busy',
    utilization: 92,
    projects: 4,
    lastActive: '5 min ago'
  },
  {
    id: '3',
    name: 'Khalid Al-Mansouri',
    role: 'Quality Assurance',
    status: 'online',
    utilization: 78,
    projects: 2,
    lastActive: '1 min ago'
  },
  {
    id: '4',
    name: 'Noura Al-Saud',
    role: 'Business Analyst',
    status: 'offline',
    utilization: 65,
    projects: 2,
    lastActive: '2 hours ago'
  }
];

export function TeamManagementWidget() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-amber-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-amber-600';
    return 'text-green-600';
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
              <div className="bg-blue-500/10 h-[40px] w-[40px] flex items-center justify-center rounded-xl ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Team Management</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monitor team performance and utilization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                {mockTeamMembers.length}
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Team Overview Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">156</div>
                <div className="text-xs text-muted-foreground">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">142</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600">78%</div>
                <div className="text-xs text-muted-foreground">Avg Utilization</div>
              </div>
            </div>

            {/* Recent Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Recent Activity</h4>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs bg-blue-500/10 text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium ${getUtilizationColor(member.utilization)}`}>
                          {member.utilization}%
                        </p>
                        <p className="text-xs text-muted-foreground">{member.projects} projects</p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Progress value={member.utilization} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 text-xs">
                <UserPlus className="h-3 w-3 mr-1" />
                Add Member
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
