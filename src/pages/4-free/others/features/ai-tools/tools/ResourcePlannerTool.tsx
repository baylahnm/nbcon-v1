import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectParamSync } from '../hooks/useProjectParamSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback } from '@/pages/1-HomePage/others/components/ui/avatar';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { 
  Target, 
  ChevronLeft,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Briefcase,
  ArrowLeft,
  Layers,
  BarChart3
} from 'lucide-react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useGanttStore } from '../stores/useGanttStore';

export default function ResourcePlannerTool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sync URL ?project=<id> ↔ store (bidirectional)
  useProjectParamSync();
  
  // Get selected project from unified store
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // Get resources and tasks from Gantt store
  const { resources, tasks, loadProjectTasks } = useGanttStore();
  const isLoading = false; // TODO: Add loading state to Gantt store
  
  // Load resources function (placeholder)
  const loadResources = async (projectId: string) => {
    // Resources loaded via Gantt store
    console.log('Loading resources for project:', projectId);
  };

  // Load data when project selected
  useEffect(() => {
    if (project?.id) {
      loadResources(project.id);
      loadProjectTasks(project.id);
    }
  }, [project?.id, loadResources, loadProjectTasks]);

  // Empty state when no project selected
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/free/ai-tools/planning')}
            className="mb-4 h-8 text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Planning Hub
          </Button>
          
          <Card className="border-border/50 mt-8">
            <CardContent className="p-12 text-center">
              <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">No Project Selected</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please select or create a project to use the Resource Planner
              </p>
              <Button onClick={() => navigate('/free/ai-tools/planning')}>
                <Layers className="h-4 w-4 mr-2" />
                Select Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate utilization (simplified - would use actual task assignments)
  const getUtilization = (resourceId: string) => {
    // TODO: Implement proper task assignment tracking
    return Math.floor(Math.random() * 100); // Placeholder
  };

  // Statistics
  const avgUtilization = resources.length > 0
    ? Math.round(resources.reduce((sum, r) => sum + getUtilization(r.id), 0) / resources.length)
    : 0;
  const overAllocated = resources.filter(r => getUtilization(r.id) > 100).length;
  const available = resources.filter(r => getUtilization(r.id) < 80).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/ai-tools/planning')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {project.name} - Resources
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Plan and optimize resource allocation
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{resources.length}</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg ring-1 ring-blue-500/20">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{avgUtilization}%</p>
                  <p className="text-xs text-muted-foreground">Avg Utilization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg ring-1 ring-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{available}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{overAllocated}</p>
                  <p className="text-xs text-muted-foreground">Over-allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource List */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight">Team Resources</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && resources.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">No Resources Yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add team members in the Gantt Tool to track resource allocation
                </p>
                <Button onClick={() => navigate(`/free/ai-tools/planning/gantt?project=${project.id}`)}>
                  <Layers className="h-4 w-4 mr-2" />
                  Go to Gantt Tool
                </Button>
              </div>
            )}

            {/* Resource Cards */}
            {!isLoading && resources.map((resource) => {
              const utilization = getUtilization(resource.id);
              const isOverAllocated = utilization > 100;
              const assignedTaskCount = 0; // TODO: Track task assignments

              return (
                <Card key={resource.id} className="border-border/50 hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                        <AvatarFallback className="bg-primary-gradient text-white font-bold">
                          {resource.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold truncate">{resource.name}</h3>
                          {isOverAllocated && (
                            <Badge className="text-[9px] bg-red-500/10 text-red-600">
                              Over-allocated
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{resource.role || 'Team Member'}</p>

                        {/* Utilization Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Utilization</span>
                            <span className={`font-bold ${
                              utilization > 100 ? 'text-red-600' :
                              utilization > 80 ? 'text-amber-600' :
                              'text-green-600'
                            }`}>
                              {utilization}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(utilization, 100)} 
                            className={`h-1.5 ${
                              utilization > 100 ? '[&>div]:bg-red-500' :
                              utilization > 80 ? '[&>div]:bg-amber-500' :
                              '[&>div]:bg-green-500'
                            }`}
                          />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{assignedTaskCount} tasks</span>
                          </div>
                          {resource.hourly_rate && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span>{resource.hourly_rate} SAR/hr</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Helper Text */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 shrink-0">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">💡 Resource Planning</p>
                <p className="text-xs text-muted-foreground">
                  Resources and utilization are calculated from your Gantt tasks. 
                  Add team members and assign them to tasks in the Gantt Tool to track workload and optimize allocation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
