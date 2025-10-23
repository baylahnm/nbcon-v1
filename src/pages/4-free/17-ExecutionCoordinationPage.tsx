import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  Construction,
  FileDown,
  Plus,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  BarChart3,
  ClipboardList,
  MessageSquare,
  Settings,
  Layers,
  Rocket,
} from 'lucide-react';
import { ROUTES, getRouteWithProject } from '@/shared/constants/routes';

interface ExecutionTool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  status: 'active' | 'pending' | 'completed';
}

export default function ExecutionCoordinationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const [selectedProject, setSelectedProject] = useState('1');

  // Sample project data
  const projects = [
    { id: '1', name: 'Riyadh Office Complex', status: 'active', progress: 65 },
    { id: '2', name: 'Jeddah Residential Tower', status: 'planning', progress: 15 },
    { id: '3', name: 'Dammam Industrial Facility', status: 'active', progress: 40 },
  ];

  const executionTools: ExecutionTool[] = [
    {
      id: '1',
      title: 'Daily Site Log',
      subtitle: 'Weather, Safety & Progress',
      description: 'Generate comprehensive daily site reports with weather conditions, safety incidents, work progress, and team attendance.',
      features: 'Weather tracking, Safety logs, Progress photos, Team attendance, Equipment status',
      icon: ClipboardList,
      route: ROUTES.AI_TOOLS.EXECUTION_DAILY_LOG,
      color: 'blue',
      status: 'active',
    },
    {
      id: '2',
      title: 'Progress Dashboard',
      subtitle: 'Visual Analytics & AI Insights',
      description: 'Real-time progress tracking with AI-powered insights, schedule variance analysis, and predictive completion forecasts.',
      features: 'Visual progress tracking, Schedule variance, AI predictions, Resource utilization, Milestone tracking',
      icon: BarChart3,
      route: ROUTES.AI_TOOLS.EXECUTION_PROGRESS,
      color: 'green',
      status: 'active',
    },
    {
      id: '3',
      title: 'Change Order Manager',
      subtitle: 'Approval Workflow & Cost Tracking',
      description: 'Streamline change order processes with automated workflows, cost impact analysis, and approval tracking.',
      features: 'Change request forms, Approval workflows, Cost impact analysis, Document management, Status tracking',
      icon: Settings,
      route: ROUTES.AI_TOOLS.EXECUTION_CHANGE_ORDERS,
      color: 'amber',
      status: 'active',
    },
    {
      id: '4',
      title: 'Meeting Planner',
      subtitle: 'Agenda Generation & Follow-ups',
      description: 'AI-powered meeting coordination with automated agenda generation, action item tracking, and follow-up reminders.',
      features: 'Agenda generation, Action items, Follow-up tracking, Meeting minutes, Stakeholder coordination',
      icon: MessageSquare,
      route: ROUTES.AI_TOOLS.EXECUTION_MEETINGS,
      color: 'purple',
      status: 'active',
    },
    {
      id: '5',
      title: 'Issue Resolution',
      subtitle: 'Priority Matrix & Escalation',
      description: 'Track and resolve project issues with priority classification, escalation workflows, and resolution analytics.',
      features: 'Issue classification, Priority matrix, Escalation workflows, Resolution tracking, Performance metrics',
      icon: AlertTriangle,
      route: ROUTES.AI_TOOLS.EXECUTION_ISSUES,
      color: 'red',
      status: 'active',
    },
  ];


  const handleToolClick = (route: string) => {
    navigate(getRouteWithProject(route, selectedProject));
  };

  const getColorClasses = (color: string) => {
    // Use consistent theme-agnostic styling
    return 'bg-primary/10 text-primary border-primary/20';
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const activeIssues = 3;
  const pendingChanges = 2;
  const upcomingMeetings = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Construction className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Execution & Coordination</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered project execution and team coordination
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Execution Plan
            </Button>
          </div>
        </div>

        {/* Top Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Active Project */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Select Active Project</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
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
                    <span className="text-xs font-medium">{selectedProjectData.name}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px]">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{selectedProjectData.progress}%</span>
                    </div>
                    <Progress value={selectedProjectData.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-bold text-primary">
                      {selectedProjectData.status}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Execution Progress */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Execution Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tools Completed</span>
                  <span className="font-medium">3 / {executionTools.length}</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-primary">3</div>
                  <div className="text-[9px] text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-amber-600">1</div>
                  <div className="text-[9px] text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-muted-foreground">1</div>
                  <div className="text-[9px] text-muted-foreground">Not Started</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Execution Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executionTools.map((tool) => (
            <Card key={tool.id} className="border-border/50 hover:shadow-md transition-all">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <tool.icon className="h-4 w-4 text-primary" />
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
                >
                  Launch Tool →
                </Button>
              </CardContent>
            </Card>
          ))}
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
                  <ClipboardList className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Daily site log updated</p>
                  <p className="text-[10px] text-muted-foreground">Daily Site Log</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Progress dashboard updated</p>
                  <p className="text-[10px] text-muted-foreground">Progress Dashboard</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  4 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Change order processed</p>
                  <p className="text-[10px] text-muted-foreground">Change Order Manager</p>
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
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Outputs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Progress Report - Week 12</p>
                  <p className="text-[10px] text-muted-foreground">Progress Dashboard</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  1 day ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Meeting minutes generated</p>
                  <p className="text-[10px] text-muted-foreground">Meeting Planner</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  2 days ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Issue resolution summary</p>
                  <p className="text-[10px] text-muted-foreground">Issue Resolution</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  3 days ago
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              How It Works?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background border border-border rounded-lg hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Select Project</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose your active construction project to manage execution and coordination activities.
                </p>
              </div>
              <div className="text-center p-4 bg-background border border-border rounded-lg hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Launch AI Tools</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use AI-powered tools for daily logs, progress tracking, change orders, meetings, and issue resolution.
                </p>
              </div>
              <div className="text-center p-4 bg-background border border-border rounded-lg hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Monitor & Coordinate</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track progress, manage changes, coordinate meetings, and resolve issues with AI assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
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
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.EXECUTION_DAILY_LOG)}
              >
                <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                Daily Log
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.EXECUTION_PROGRESS)}
              >
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                Progress
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.EXECUTION_CHANGE_ORDERS)}
              >
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Changes
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.EXECUTION_MEETINGS)}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Meetings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
