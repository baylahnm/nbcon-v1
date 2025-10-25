import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { 
  MessageSquare, 
  FileText, 
  Users, 
  Mail,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  ArrowRight,
  Send,
  FileBarChart,
  MessageCircle,
  FolderOpen,
  Layers,
  Rocket,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { useProjectStore } from './others/stores/useProjectStore';
import { useProjectParamSync } from './others/features/ai-tools/hooks/useProjectParamSync';
import { CreateProjectDialog } from './others/features/ai-tools/components/CreateProjectDialog';

interface CommunicationTool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string;
  route: string;
}

const communicationTools: CommunicationTool[] = [
  {
    id: 'client-email',
    title: 'Client Update Email Generator',
    subtitle: 'AI-drafted personalized client updates',
    description: 'Generate professional client update emails with project status, milestones, and next steps.',
    icon: Mail,
    features: 'Templates, Status Updates, Notifications',
    route: '/free/ai-tools/communication/client-email'
  },
  {
    id: 'progress-report',
    title: 'Progress Report Builder',
    subtitle: 'Automated progress reports with insights',
    description: 'Create comprehensive progress reports with charts, metrics, and actionable insights.',
    icon: FileBarChart,
    features: 'Charts, Metrics, Summaries',
    route: '/free/ai-tools/communication/progress-report'
  },
  {
    id: 'meeting-minutes',
    title: 'Meeting Minutes Template',
    subtitle: 'AI-generated meeting documentation',
    description: 'Transform meeting recordings or notes into structured, professional meeting minutes.',
    icon: MessageCircle,
    features: 'Transcription, Action Items, Decisions',
    route: '/free/ai-tools/communication/meeting-minutes'
  },
  {
    id: 'rfi-manager',
    title: 'RFI Manager',
    subtitle: 'Request for Information tracking and responses',
    description: 'Streamline RFI processes with automated tracking, response generation, and follow-up management.',
    icon: FolderOpen,
    features: 'Tracking, Templates, Deadlines',
    route: '/free/ai-tools/communication/rfi-manager'
  },
  {
    id: 'presentation-deck',
    title: 'Presentation Deck Generator',
    subtitle: 'AI-created project presentations',
    description: 'Generate professional presentation decks with slides, charts, and project highlights.',
    icon: FileText,
    features: 'Templates, Charts, Highlights',
    route: '/free/ai-tools/communication/presentation-deck'
  }
];

export default function CommunicationReportingPage() {
  const navigate = useNavigate();
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

  const selectedProjectData = projects.find(p => p.id === selectedProjectId);

  const handleToolClick = (tool: CommunicationTool) => {
    navigate(tool.route);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'client-email':
        navigate('/free/ai-tools/communication/client-email');
        break;
      case 'progress-report':
        navigate('/free/ai-tools/communication/progress-report');
        break;
      case 'meeting-minutes':
        navigate('/free/ai-tools/communication/meeting-minutes');
        break;
      case 'rfi-manager':
        navigate('/free/ai-tools/communication/rfi-manager');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Communication & Reporting Tools</h1>
              <p className="text-xs text-muted-foreground">AI-powered communication and reporting solutions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Communication Plan
            </Button>
          </div>
        </div>

        {/* Project Selection & Communication Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Active Project */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Select Active Project</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="bg-muted/30 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No Projects Yet</p>
                    <p className="text-xs text-muted-foreground">Create your first project to get started</p>
                    <Button onClick={() => setShowCreateDialog(true)} className="h-8 text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  <>
                    <Select value={selectedProjectId || ''} onValueChange={selectProject}>
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
                      <div className="p-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold line-clamp-1">{selectedProjectData.name}</h3>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px]">
                            {selectedProjectData.status}
                          </Badge>
                        </div>
                        {selectedProjectData.description && (
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{selectedProjectData.description}</p>
                        )}
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{selectedProjectData.progress || 0}%</span>
                          </div>
                          <Progress value={selectedProjectData.progress || 0} className="h-2" />
                        </div>
                        {selectedProjectData.end_date && (
                          <p className="text-[10px] text-muted-foreground mt-2">
                            End Date: {new Date(selectedProjectData.end_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Communication Progress */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Communication Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs">
                    <span>Tools Completed</span>
                    <span>3/5</span>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Communication & Reporting Tools */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communicationTools.map((tool) => {
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
                  <CardContent className="p-4 space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      <span>{tool.features}</span>
                    </div>
                    <Button
                      onClick={() => handleToolClick(tool)}
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
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Client update email sent</p>
                  <p className="text-[10px] text-muted-foreground">Client Update Email</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  1 hour ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileBarChart className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Progress report generated</p>
                  <p className="text-[10px] text-muted-foreground">Progress Report</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  3 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Meeting minutes created</p>
                  <p className="text-[10px] text-muted-foreground">Meeting Minutes</p>
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
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Weekly client update - Week 12</p>
                  <p className="text-[10px] text-muted-foreground">Client Update Email</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileBarChart className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Monthly progress report</p>
                  <p className="text-[10px] text-muted-foreground">Progress Report</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  1 day ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Stakeholder presentation deck</p>
                  <p className="text-[10px] text-muted-foreground">Presentation Deck</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  2 days ago
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
              
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Select Communication Tool</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose from email generators, report builders, meeting minutes, RFI management, or presentation tools
                </p>
              </div>

              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm font-bold mb-2">AI Generates Content</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI analyzes project data and generates professional communication materials tailored to your needs
                </p>
              </div>

              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Review & Refine</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Review AI-generated content, make adjustments, and send or export your professional communications
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
                onClick={() => handleQuickAction('client-email')}
              >
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Client Email
              </Button>
              <Button 
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleQuickAction('progress-report')}
              >
                <FileBarChart className="h-3.5 w-3.5 mr-1.5" />
                Progress Report
              </Button>
              <Button 
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleQuickAction('meeting-minutes')}
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                Meeting Minutes
              </Button>
              <Button 
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleQuickAction('rfi-manager')}
              >
                <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                RFI Manager
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={(project) => {
          selectProject(project.id);
        }}
      />
    </div>
  );
}
