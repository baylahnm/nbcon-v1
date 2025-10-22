import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Alert, AlertDescription } from '@/pages/1-HomePage/others/components/ui/alert';
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
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
  ChevronRight,
  BarChart3,
  Network,
  DollarSign,
  Info
} from 'lucide-react';

// Import shared components
import { FloatingAIButton } from './others/features/ai-tools/components/FloatingAIButton';

// Mock projects data
const mockProjects = [
  { id: '1', name: 'NEOM Infrastructure Phase 2', status: 'planning', progress: 45 },
  { id: '2', name: 'Riyadh Metro Extension', status: 'initiation', progress: 15 },
  { id: '3', name: 'Al-Khobar Commercial Center', status: 'planning', progress: 68 },
];

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: any;
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
    description: 'Create comprehensive project charter with AI assistance',
    icon: FileText,
    colorVariant: 'primary',
    status: 'available',
    aiCapability: 'AI generates charter from project details',
    humanTask: 'Review, edit, and approve charter'
  },
  {
    id: 'wbs',
    title: 'WBS Builder',
    description: 'Visual Work Breakdown Structure with AI suggestions',
    icon: Network,
    colorVariant: 'secondary',
    status: 'available',
    aiCapability: 'AI creates hierarchical task breakdown',
    humanTask: 'Adjust hierarchy and add custom tasks'
  },
  {
    id: 'stakeholders',
    title: 'Stakeholder Mapper',
    description: 'Map stakeholders with power/interest matrix',
    icon: Users,
    colorVariant: 'success',
    status: 'available',
    aiCapability: 'AI identifies key stakeholders and influence',
    humanTask: 'Validate positions and engagement strategies'
  },
  {
    id: 'risks',
    title: 'Risk Register',
    description: 'Identify and track project risks with heat map',
    icon: AlertTriangle,
    colorVariant: 'warning',
    status: 'available',
    aiCapability: 'AI scans for technical, schedule, cost risks',
    humanTask: 'Assign owners and mitigation plans'
  },
  {
    id: 'timeline',
    title: 'Timeline Builder',
    description: 'Visual Gantt chart with critical path analysis',
    icon: CalendarIcon,
    colorVariant: 'accent',
    status: 'available',
    aiCapability: 'AI creates schedule from WBS and constraints',
    humanTask: 'Adjust dates and dependencies'
  },
  {
    id: 'resources',
    title: 'Resource Planner',
    description: 'Allocate team members and equipment optimally',
    icon: Target,
    colorVariant: 'muted',
    status: 'available',
    aiCapability: 'AI optimizes allocation based on skills',
    humanTask: 'Approve assignments and resolve conflicts'
  }
];

export default function AIToolsPlanningPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Get selected project details
  const currentProject = mockProjects.find(p => p.id === selectedProject);

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

  const handleToolClick = (toolId: string) => {
    if (!selectedProject) {
      // Show alert to select project first
      return;
    }
    setSelectedTool(toolId);
    // Navigate to tool detail page - all 6 tools now implemented
    const validTools = ['charter', 'wbs', 'stakeholders', 'risks', 'timeline', 'resources'];
    if (validTools.includes(toolId)) {
      navigate(`/free/ai-tools/planning/${toolId}?project=${selectedProject}`);
    } else {
      // For other tools, show coming soon (or navigate to AI assistant with prompt)
      navigate('/free/ai');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md hover:scale-110 transition-transform duration-300">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Project Setup & Planning
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered Toolkit
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Interactive AI tools to initiate projects, plan work, and allocate resources
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button size="sm" className="h-8 text-xs shadow-md">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Project
            </Button>
          </div>
        </div>

        {/* Project Selector & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Project Selector */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Select Active Project
                </CardTitle>
                <Badge variant="outline" className="text-[9px]">
                  {mockProjects.length} Projects
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="h-10 border border-border">
                    <SelectValue placeholder="Choose a project to work on..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.name}</span>
                          <Badge variant="outline" className="text-[9px]">
                            {project.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentProject && (
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold">{currentProject.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Status: {currentProject.status}
                        </p>
                      </div>
                      <Badge className={`text-xs ${
                        currentProject.progress >= 60 ? 'bg-primary/15 text-primary border-primary/25' :
                        currentProject.progress >= 30 ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-primary/5 text-primary border-primary/15'
                      }`}>
                        {currentProject.progress}% Complete
                      </Badge>
                    </div>
                    <Progress value={currentProject.progress} className="h-2" />
                  </div>
                )}

                {!selectedProject && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Select a project to unlock AI-powered planning tools and track progress
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-base font-bold tracking-tight">Planning Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tools Completed</span>
                    <span className="font-bold">2/6</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>

                <div className="pt-3 border-t border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Charter</span>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">WBS</span>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Stakeholders</span>
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Risk Register</span>
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools Grid - Interactive Tools */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold">AI-Powered Planning Tools</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Interactive tools that combine human expertise with AI automation
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              View Guide
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planningTools.map((tool) => {
              const colors = getColorClasses(tool.colorVariant);
              const isDisabled = !selectedProject;

              return (
                <Card 
                  key={tool.id}
                  className={`group relative overflow-hidden border-border/50 transition-all duration-300 ${
                    isDisabled 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && handleToolClick(tool.id)}
                >
                  {/* Status Badge */}
                  {tool.status === 'completed' && (
                    <div className="absolute top-3 right-3">
                      <Badge className="text-[9px] bg-primary/15 text-primary border-primary/25">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                        Done
                      </Badge>
                    </div>
                  )}
                  {tool.status === 'in-progress' && (
                    <div className="absolute top-3 right-3">
                      <Badge className="text-[9px] bg-primary/10 text-primary border-primary/20">
                        <Clock className="h-2.5 w-2.5 mr-1" />
                        In Progress
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md ${
                        !isDisabled && 'group-hover:scale-110'
                      } transition-transform duration-300`}>
                        <tool.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-bold tracking-tight mb-1">
                          {tool.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {/* AI & Human Tasks */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{tool.aiCapability}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{tool.humanTask}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full h-8 text-xs shadow-md hover:shadow-xl transition-all"
                      disabled={isDisabled}
                    >
                      {isDisabled ? 'Select Project First' : 'Launch Tool'}
                      {!isDisabled && <ChevronRight className="h-3.5 w-3.5 ml-1.5" />}
                    </Button>

                    {/* Last Updated */}
                    {tool.lastUpdated && (
                      <p className="text-[10px] text-muted-foreground text-center">
                        Updated {tool.lastUpdated}
                      </p>
                    )}
                  </CardContent>

                  {/* Hover Indicator */}
                  {!isDisabled && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              How AI-Powered Planning Works
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

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/40">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium">Auto-save drafts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium">Export to PDF/Excel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium">Team collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium">AI suggestions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Outputs */}
        {selectedProject && (
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Recent Outputs
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  View All →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Project Charter v2.3</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Generated 2 hours ago • 8 pages • PDF</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md shrink-0">
                    <Network className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Work Breakdown Structure (WBS)</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Generated yesterday • 47 work packages • Excel</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Stakeholder Register</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Last updated 3 days ago • 24 stakeholders • PDF</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
          <CardContent className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              QUICK LINKS
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                onClick={() => navigate('/free/myprojects')}
              >
                <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                My Projects
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                onClick={() => navigate('/free/calendar')}
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                Calendar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                onClick={() => navigate('/free/finance')}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                Budget Overview
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                onClick={() => navigate('/free/ai')}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Floating AI Button */}
      <FloatingAIButton />
    </div>
  );
}
