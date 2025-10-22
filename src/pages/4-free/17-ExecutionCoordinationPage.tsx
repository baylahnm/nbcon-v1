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
  ArrowLeft,
  Sparkles,
  Save,
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
  Bot,
  Loader2,
  Layers,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';
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
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive execution coordination plan for a construction project. Project ID: ${projectId || 'N/A'}. Include daily site log templates, progress tracking metrics, change order procedures, meeting coordination protocols, and issue resolution workflows. Focus on Saudi construction practices and SCE compliance requirements.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated execution coordination plan. Review tools below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate coordination plan. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleToolClick = (route: string) => {
    navigate(getRouteWithProject(route, selectedProject));
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      green: 'bg-green-500/10 text-green-600 border-green-500/20',
      amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      red: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-primary/10 text-primary border-primary/20';
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const activeIssues = 3;
  const pendingChanges = 2;
  const upcomingMeetings = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
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
            <Button
              variant="outline"
              className="h-8 text-xs"
              onClick={handleAIGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  AI Generate Plan
                </>
              )}
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={() => navigate('/free/ai')}
            >
              <Bot className="h-3.5 w-3.5 mr-1.5" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Project Selector */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Select Active Project</div>
                  <div className="text-xs text-muted-foreground">Choose project to manage execution</div>
                </div>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="border border-border h-10 w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <span>{project.name}</span>
                        <Badge className={`text-[9px] ${
                          project.status === 'active' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}>
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Execution Progress */}
        {selectedProjectData && (
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Execution Progress</div>
                    <div className="text-xs text-muted-foreground">{selectedProjectData.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Overall Progress</div>
                  <div className="text-sm font-bold text-primary">{selectedProjectData.progress}%</div>
                </div>
              </div>
              <Progress value={selectedProjectData.progress} className="h-2 mb-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Active Issues</div>
                  <div className="text-sm font-bold text-red-600">{activeIssues}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pending Changes</div>
                  <div className="text-sm font-bold text-amber-600">{pendingChanges}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Upcoming Meetings</div>
                  <div className="text-sm font-bold text-blue-600">{upcomingMeetings}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Execution Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executionTools.map((tool) => (
            <Card key={tool.id} className="border-border/50 hover:shadow-md transition-all">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ring-1 shadow-md ${getColorClasses(tool.color)}`}>
                    <tool.icon className="h-4 w-4" />
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

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Activities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Daily Site Log Updated</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">
                    Completed
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Weather: 28°C, Clear • Safety: 0 incidents • Progress: Foundation 85% complete
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Change Order #CO-2025-001</span>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">
                    Pending
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Client requested additional electrical outlets • Cost impact: +15,000 SAR
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Weekly Progress Meeting</span>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
                    Scheduled
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Tomorrow 10:00 AM • Agenda: Progress review, issue resolution, next week planning
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Outputs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Progress Report - Week 12</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">
                    Generated
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Foundation 85% • Structural 15% • MEP 5% • Overall: 65% complete
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Issue Resolution Summary</span>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
                    Resolved
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  3 issues resolved this week • Average resolution time: 2.5 days
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Meeting Minutes - Coordination</span>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[9px]">
                    Shared
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Action items: 5 assigned • Follow-ups: 3 scheduled • Decisions: 8 made
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">How It Works</CardTitle>
            </div>
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
