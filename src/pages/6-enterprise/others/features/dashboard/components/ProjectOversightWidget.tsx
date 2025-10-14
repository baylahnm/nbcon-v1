import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { 
  Briefcase, Calendar, Clock, CheckCircle, AlertTriangle, 
  MoreHorizontal, Eye, TrendingUp, Users, DollarSign
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  progress: number;
  budget: string;
  teamSize: number;
  deadline: string;
  daysRemaining: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'NEOM City Infrastructure',
    client: 'NEOM Authority',
    status: 'on-track',
    progress: 75,
    budget: '45.2M SAR',
    teamSize: 24,
    deadline: '2024-03-15',
    daysRemaining: 89
  },
  {
    id: '2',
    name: 'Aramco Refinery Expansion',
    client: 'Saudi Aramco',
    status: 'at-risk',
    progress: 45,
    budget: '28.5M SAR',
    teamSize: 18,
    deadline: '2024-02-28',
    daysRemaining: 72
  },
  {
    id: '3',
    name: 'SABIC Chemical Plant',
    client: 'SABIC',
    status: 'on-track',
    progress: 92,
    budget: '12.8M SAR',
    teamSize: 12,
    deadline: '2024-01-30',
    daysRemaining: 44
  },
  {
    id: '4',
    name: 'Red Sea Resort Development',
    client: 'Red Sea Global',
    status: 'delayed',
    progress: 35,
    budget: '67.3M SAR',
    teamSize: 32,
    deadline: '2024-04-20',
    daysRemaining: 125
  }
];

export function ProjectOversightWidget() {
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
      case 'on-track': return 'bg-green-500/10 text-green-600 ring-green-500/20';
      case 'at-risk': return 'bg-amber-500/10 text-amber-600 ring-amber-500/20';
      case 'delayed': return 'bg-red-500/10 text-red-600 ring-red-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-600 ring-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 ring-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return CheckCircle;
      case 'at-risk': return AlertTriangle;
      case 'delayed': return Clock;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
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
              <div className="bg-green-500/10 h-[40px] w-[40px] flex items-center justify-center rounded-xl ring-1 ring-green-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Project Oversight</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monitor project progress and performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                {mockProjects.length}
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Project Overview Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">24</div>
                <div className="text-xs text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">18</div>
                <div className="text-xs text-muted-foreground">On Track</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600">6</div>
                <div className="text-xs text-muted-foreground">At Risk</div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Recent Projects</h4>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              
              {mockProjects.map((project) => {
                const StatusIcon = getStatusIcon(project.status);
                return (
                  <div key={project.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-foreground truncate">{project.name}</h5>
                        <p className="text-xs text-muted-foreground truncate">{project.client}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{project.budget}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{project.teamSize} team</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{project.daysRemaining}d left</span>
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
                <TrendingUp className="h-3 w-3 mr-1" />
                View Reports
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                All Projects
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
