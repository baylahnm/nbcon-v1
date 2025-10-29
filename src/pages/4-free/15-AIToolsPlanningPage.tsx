import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useProjectParamSync } from './others/features/ai-tools/hooks/useProjectParamSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Alert, AlertDescription } from '@/pages/1-HomePage/others/components/ui/alert';
import { FeatureGate } from '@/components/portal/shared/FeatureGate';
import { 
  Rocket, 
  Target, 
  Plus, 
  FileText, 
  Calendar as CalendarIcon,
  Upload,
  Briefcase,
  TrendingUp,
  Users,
  Clock,
  Layers,
  Calendar,
  AlertTriangle,
  Download,
  Sparkles,
  ChevronRight,
  BarChart3,
  Network,
  DollarSign,
  Info,
  Loader2
} from 'lucide-react';

// Import shared components
import { ROUTES } from '@/shared/constants/routes';
import { useProjectStore } from './others/stores/useProjectStore';
import { CreateProjectDialog } from './others/features/ai-tools/components/CreateProjectDialog';

interface AITool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  route: string;
  features: string;
  colorVariant: 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning';
  status: 'available' | 'in-progress' | 'completed';
  lastUpdated?: string;
  aiCapability: string;
  humanTask: string;
}

const planningTools: AITool[] = [
  {
    id: 'charter',
    title: 'Project Charter Generator',
    subtitle: 'AI-powered charter creation',
    description: 'Create comprehensive project charter with AI assistance for project initiation and stakeholder alignment',
    icon: FileText,
    route: '/free/ai-tools/planning/charter',
    features: 'Templates, AI Generation, Approval Workflow',
    colorVariant: 'primary',
    status: 'available',
    aiCapability: 'AI generates charter from project details',
    humanTask: 'Review, edit, and approve charter'
  },
  {
    id: 'wbs',
    title: 'WBS Builder',
    subtitle: 'Visual work breakdown structure',
    description: 'Create hierarchical project breakdown with AI suggestions and drag-and-drop interface',
    icon: Network,
    route: '/free/ai-tools/planning/wbs',
    features: 'Hierarchy, AI Suggestions, Export Options',
    colorVariant: 'secondary',
    status: 'available',
    aiCapability: 'AI creates hierarchical task breakdown',
    humanTask: 'Adjust hierarchy and add custom tasks'
  },
  {
    id: 'stakeholders',
    title: 'Stakeholder Mapper',
    subtitle: 'Power and interest analysis',
    description: 'Map stakeholders with power/interest matrix and communication strategies',
    icon: Users,
    route: '/free/ai-tools/planning/stakeholders',
    features: 'Matrix Analysis, Communication Plans, Engagement',
    colorVariant: 'success',
    status: 'available',
    aiCapability: 'AI identifies key stakeholders and influence',
    humanTask: 'Validate positions and engagement strategies'
  },
  {
    id: 'risks',
    title: 'Risk Register',
    subtitle: 'Comprehensive risk analysis',
    description: 'Identify and track project risks with heat map and mitigation strategies',
    icon: AlertTriangle,
    route: '/free/ai-tools/planning/risks',
    features: 'Risk Matrix, Mitigation Plans, Monitoring',
    colorVariant: 'warning',
    status: 'available',
    aiCapability: 'AI scans for technical, schedule, cost risks',
    humanTask: 'Assign owners and mitigation plans'
  },
  {
    id: 'timeline',
    title: 'Timeline Builder',
    subtitle: 'AI-powered scheduling',
    description: 'Create realistic project schedules with AI optimization and dependency management',
    icon: CalendarIcon,
    route: '/free/ai-tools/planning/timeline',
    features: 'Dependencies, Critical Path, Milestones',
    colorVariant: 'accent',
    status: 'available',
    aiCapability: 'AI creates schedule from WBS and constraints',
    humanTask: 'Adjust dates and dependencies'
  },
  {
    id: 'gantt',
    title: 'Gantt Chart Builder',
    subtitle: 'Visual project timeline management',
    description: 'Create comprehensive Gantt charts with AI generation, drag-and-drop editing, and construction-specific features',
    icon: BarChart3,
    route: ROUTES.AI_TOOLS.PLANNING_GANTT,
    features: 'AI Generation, Drag & Drop, Crew Management, Punch Lists',
    colorVariant: 'primary',
    status: 'available',
    aiCapability: 'AI generates complete project timeline from natural language',
    humanTask: 'Refine timeline, assign resources, track progress'
  },
  {
    id: 'resources',
    title: 'Resource Planner',
    subtitle: 'Optimized resource allocation',
    description: 'Allocate team members and equipment optimally with AI optimization and capacity planning',
    icon: Target,
    route: '/free/ai-tools/planning/resources',
    features: 'Capacity Planning, Skills Matching, Workload',
    colorVariant: 'muted',
    status: 'available',
    aiCapability: 'AI optimizes allocation based on skills',
    humanTask: 'Approve assignments and resolve conflicts'
  }
];

export default function AIToolsPlanningPage() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Sync URL ?project=<id> ↔ store (bidirectional)
  useProjectParamSync();
  
  // Use unified project store instead of mock data
  const { 
    projects, 
    selectedProjectId, 
    selectProject, 
    loadUserProjects,
    isLoading: projectsLoading 
  } = useProjectStore();
  
  if (process.env.NODE_ENV !== 'production') {
    console.log("🔍 AIToolsPlanningPage loaded:", window.location.pathname);
  }

  // Load projects on mount
  useEffect(() => {
    loadUserProjects();
  }, [loadUserProjects]);

  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      selectProject(projects[0].id);
    }
  }, [projects, selectedProjectId, selectProject]);

  // Get selected project details (from database instead of mock)
  const selectedProjectData = projects.find(p => p.id === selectedProjectId);

  // Theme-agnostic color system - All icons same color, containers vary by opacity
  const getColorClasses = (variant: 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning') => {
    const colorMap: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
      primary: { 
        bg: 'bg-primary/10', 
        text: 'text-primary',  // All icons use text-primary
        ring: 'ring-primary/20', 
        badge: 'bg-primary/10 text-primary border-primary/20' 
      },
      secondary: { 
        bg: 'bg-primary/15', 
        text: 'text-primary',  // All icons use text-primary
        ring: 'ring-primary/25', 
        badge: 'bg-primary/15 text-primary border-primary/25' 
      },
      accent: { 
        bg: 'bg-primary/20', 
        text: 'text-primary',  // All icons use text-primary
        ring: 'ring-primary/30', 
        badge: 'bg-primary/20 text-primary border-primary/30' 
      },
      muted: { 
        bg: 'bg-primary/8', 
        text: 'text-primary',  // All icons use text-primary
        ring: 'ring-primary/18', 
        badge: 'bg-primary/8 text-primary border-primary/18' 
      },
      success: { 
        bg: 'bg-primary/12', 
        text: 'text-primary',  // All icons use text-primary
        ring: 'ring-primary/22', 
        badge: 'bg-primary/12 text-primary border-primary/22' 
      },
      warning: { 
        bg: 'bg-primary/6', 
        text: 'text-primary',  // All icons use text-primary
        ring: 'ring-primary/16', 
        badge: 'bg-primary/6 text-primary border-primary/16' 
      },
    };
    return colorMap[variant];
  };

  const handleToolClick = (route: string) => {
    console.log('🎯 handleToolClick called with route:', route);
    console.log('🎯 selectedProjectId:', selectedProjectId);
    console.log('🎯 Route starts with /free/ai-tools/planning/?', route.startsWith('/free/ai-tools/planning/'));
    console.log('🎯 Current location before navigation:', window.location.pathname);
    
    if (!selectedProjectId) {
      console.log('❌ No project selected, showing alert');
      // Show alert to select project first
      return;
    }
    setSelectedTool(route);
    // Navigate to tool detail page - all 6 tools now implemented
    if (route.startsWith('/free/ai-tools/planning/')) {
      console.log('✅ Absolute route matches! Navigating to:', `${route}?project=${selectedProjectId}`);
      navigate(`${route}?project=${selectedProjectId}`);
    } else {
      console.log('❌ Route does not match, navigating to AI assistant');
      console.log('❌ Route was:', route);
      console.log('❌ Expected: /free/ai-tools/planning/ or gantt');
      // For other tools, show coming soon (or navigate to AI assistant with prompt)
      navigate('/free/ai');
    }
  };

  return (
    <FeatureGate
      requiredTier="pro"
      featureName="AI Project Planning Tools"
      featureDescription="Access 7 AI-powered planning tools including Charter Generator, WBS Builder, Timeline Builder, and more"
    >
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Project Planning Tools</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered project planning and resource allocation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button 
              className="h-8 text-xs"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Create Project Dialog */}
        <CreateProjectDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={(project) => {
            selectProject(project.id);
            console.log('✅ Project created and selected:', project.name);
          }}
        />

        {/* Top Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Active Project */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Select Active Project</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Loading State */}
              {projectsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {/* No Projects State */}
              {!projectsLoading && projects.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <div className="bg-muted/30 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No Projects Yet</p>
                    <p className="text-xs text-muted-foreground">Create your first project to get started</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Project
                  </Button>
                </div>
              )}

              {/* Project Selector */}
              {!projectsLoading && projects.length > 0 && (
                <>
                  <Select 
                    value={selectedProjectId || undefined} 
                    onValueChange={selectProject}
                  >
                    <SelectTrigger className="border border-border h-10">
                      <SelectValue placeholder="Choose a project to work on..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedProjectData && (
                    <div className="p-4 bg-background rounded-lg border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">{selectedProjectData.name}</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px]">
                          {selectedProjectData.status}
                        </Badge>
                      </div>
                      {selectedProjectData.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {selectedProjectData.description}
                        </p>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{selectedProjectData.progress || 0}%</span>
                        </div>
                        <Progress value={selectedProjectData.progress || 0} className="h-1.5" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Type: </span>
                          <span className="font-medium capitalize">{selectedProjectData.project_type}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Tasks: </span>
                          <span className="font-medium">{selectedProjectData.task_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Planning Progress */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Planning Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tools Completed</span>
                  <span className="font-medium">2 / {planningTools.length}</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-primary">2</div>
                  <div className="text-[9px] text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-amber-600">1</div>
                  <div className="text-[9px] text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-muted-foreground">3</div>
                  <div className="text-[9px] text-muted-foreground">Not Started</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Planning Tools */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planningTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="border-border/50 hover:shadow-md transition-all">
                  <CardHeader className="p-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-bold tracking-tight">
                          {tool.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2.5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      <span>{tool.features}</span>
                    </div>
                    <Button
                      onClick={() => handleToolClick(tool.route)}
                      className="w-full h-8 text-xs shadow-md"
                      disabled={!selectedProjectId}
                    >
                      Launch Tool →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Activities */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Activities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Rocket className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Project charter created</p>
                  <p className="text-[10px] text-muted-foreground">Charter Generator</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">WBS structure updated</p>
                  <p className="text-[10px] text-muted-foreground">WBS Generator</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  4 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Stakeholder analysis completed</p>
                  <p className="text-[10px] text-muted-foreground">Stakeholder Manager</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  1 day ago
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Outputs */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Outputs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Rocket className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5">Project Charter</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>NEOM Phase 2</span>
                      <span>•</span>
                      <span>Oct 20, 2025</span>
                      <span>•</span>
                      <span>1.2 MB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5">Work Breakdown Structure</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Infrastructure</span>
                      <span>•</span>
                      <span>Oct 18, 2025</span>
                      <span>•</span>
                      <span>245 KB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5">Stakeholder Register</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Analysis Report</span>
                      <span>•</span>
                      <span>Oct 15, 2025</span>
                      <span>•</span>
                      <span>180 KB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              How It Works?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Select Project</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose an active project or create a new one to start planning
                </p>
              </div>

              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Launch AI Tool</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI generates initial outputs based on project context and best practices
                </p>
              </div>

              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Review & Refine</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Customize AI suggestions, add details, and save to project repository
                </p>
              </div>
            </div>

          </CardContent>
        </Card>


        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.PLANNING_WBS)}
              >
                <Layers className="h-3.5 w-3.5 mr-1.5" />
                WBS
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.PLANNING_TIMELINE)}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Schedule
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.PLANNING_RESOURCES)}
              >
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Resources
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.PLANNING_RISKS)}
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                Risks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nested tool routes render here */}
        <Outlet />

      </div>

    </div>
    </FeatureGate>
  );
}
