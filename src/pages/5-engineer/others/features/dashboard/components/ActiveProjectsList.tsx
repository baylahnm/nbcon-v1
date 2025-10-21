import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Building, Calendar, Eye, Upload, MessageSquare, FolderOpen, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  nextMilestone: string;
  deadline: string;
  daysUntilDeadline: number;
}

interface ActiveProjectsListProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'NEOM Smart City Infrastructure',
    client: 'NEOM Company',
    progress: 68,
    status: 'on-track',
    nextMilestone: 'Foundation Analysis Report',
    deadline: 'Dec 18, 2025',
    daysUntilDeadline: 8
  },
  {
    id: '2',
    name: 'Aramco Refinery Expansion',
    client: 'Saudi Aramco',
    progress: 45,
    status: 'at-risk',
    nextMilestone: 'Structural Design Phase 2',
    deadline: 'Dec 22, 2025',
    daysUntilDeadline: 12
  },
  {
    id: '3',
    name: 'Red Sea Marina Development',
    client: 'Red Sea Global',
    progress: 82,
    status: 'on-track',
    nextMilestone: 'Environmental Assessment',
    deadline: 'Dec 15, 2025',
    daysUntilDeadline: 5
  },
];

export function ActiveProjectsList({ projects = defaultProjects }: ActiveProjectsListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'on-track':
        return { bg: 'bg-green-500/10', text: 'text-green-600', label: 'On Track' };
      case 'at-risk':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'At Risk' };
      case 'delayed':
        return { bg: 'bg-red-500/10', text: 'text-red-600', label: 'Delayed' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', label: 'Unknown' };
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-amber-600';
    return 'bg-red-600';
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
                    <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Active Projects</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track your ongoing work
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/engineer/projects">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                View All
              </Link>
            </Button>
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
        <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
        {projects.map((project) => {
          const statusColor = getStatusColor(project.status);
          
          return (
            <Card 
              key={project.id} 
              className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50"
            >
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                      {project.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {project.client}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${statusColor.bg} ${statusColor.text} border-0 font-medium whitespace-nowrap`}
                  >
                    {statusColor.label}
                  </Badge>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Next Milestone */}
                <div className="bg-muted/30 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Next Milestone</span>
                  </div>
                  <p className="text-sm font-medium leading-tight">{project.nextMilestone}</p>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-muted-foreground">Due:</span>
                    <span className="font-medium">{project.deadline}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] px-1.5 py-0 h-4 ${
                        project.daysUntilDeadline <= 7 ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                      }`}
                    >
                      {project.daysUntilDeadline} days
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-8 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <FolderOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No active projects</p>
            <p className="text-xs text-muted-foreground">
              Your active projects will appear here
            </p>
          </div>
        )}
        </CardContent>
      )}
    </Card>
  );
}

