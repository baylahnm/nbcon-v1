import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Building, Calendar, Users, Eye, FolderOpen, TrendingUp, ChevronUp, ChevronDown, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  engineers: number;
  progress: number;
  status: 'in-progress' | 'planning' | 'review' | 'completed';
  nextMilestone: string;
  deadline: string;
  budget: string;
}

interface ClientActiveProjectsListProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'Al-Khobar Commercial Center',
    engineers: 5,
    progress: 68,
    status: 'in-progress',
    nextMilestone: 'Structural Design Phase 2',
    deadline: 'Dec 28, 2025',
    budget: '850,000 SAR'
  },
  {
    id: '2',
    name: 'Riyadh Metro Extension',
    engineers: 3,
    progress: 25,
    status: 'planning',
    nextMilestone: 'Environmental Impact Study',
    deadline: 'Jan 15, 2026',
    budget: '2,100,000 SAR'
  },
  {
    id: '3',
    name: 'NEOM Infrastructure Phase 2',
    engineers: 8,
    progress: 42,
    status: 'in-progress',
    nextMilestone: 'Foundation Review',
    deadline: 'Feb 10, 2026',
    budget: '3,500,000 SAR'
  },
];

export function ClientActiveProjectsList({ projects = defaultProjects }: ClientActiveProjectsListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'in-progress':
        return { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' };
      case 'planning':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Planning' };
      case 'review':
        return { bg: 'bg-purple-500/10', text: 'text-purple-600', label: 'Under Review' };
      case 'completed':
        return { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Completed' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', label: 'Unknown' };
    }
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
      <CardHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Active Projects</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your ongoing projects
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/free/myprojects">
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
        <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
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
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{project.engineers} Engineers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{project.budget}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${statusColor.bg} ${statusColor.text} border-0 text-xs shrink-0`}>
                      {statusColor.label}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Next: {project.nextMilestone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Due {project.deadline}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-[11px]"
                    >
                      <Link to={`/free/myprojects/${project.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-[11px]"
                      onClick={() => {/* Handle engineer management */}}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Engineers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

export default ClientActiveProjectsList;

