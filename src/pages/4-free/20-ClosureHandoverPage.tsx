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
  CheckCircle, 
  FileText, 
  BookOpen,
  Shield,
  FileBarChart,
  Plus,
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
  Archive,
  Award,
  ClipboardCheck,
  FileCheck,
  Lightbulb
} from 'lucide-react';

// Import shared components
import { ROUTES } from '@/shared/constants/routes';

// Mock projects data
const mockProjects = [
  { id: '1', name: 'NEOM Infrastructure Phase 2', status: 'closing', progress: 95 },
  { id: '2', name: 'Riyadh Metro Extension', status: 'handover', progress: 88 },
  { id: '3', name: 'Al-Khobar Commercial Center', status: 'warranty', progress: 92 },
];

interface ClosureTool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  route: string;
  features: string;
  colorVariant: 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning';
  status: 'completed' | 'in-progress' | 'not-started';
  lastUsed?: string;
}

const closureTools: ClosureTool[] = [
  {
    id: 'closeout-checklist',
    title: 'Project Closeout Checklist',
    subtitle: 'Comprehensive project closure verification',
    description: 'AI-powered checklist ensuring all project deliverables, documentation, and handover requirements are completed.',
    icon: ClipboardCheck,
    route: ROUTES.AI_TOOLS.CLOSURE_CLOSEOUT_CHECKLIST,
    features: 'Automated verification, compliance tracking, stakeholder sign-offs',
    colorVariant: 'success',
    status: 'completed',
    lastUsed: '2 hours ago'
  },
  {
    id: 'as-built-docs',
    title: 'As-Built Documentation Generator',
    subtitle: 'Automated as-built documentation creation',
    description: 'Generate comprehensive as-built drawings, specifications, and documentation packages for project handover.',
    icon: FileText,
    route: ROUTES.AI_TOOLS.CLOSURE_AS_BUILT_DOCS,
    features: 'Drawing generation, specification compilation, digital handover',
    colorVariant: 'primary',
    status: 'in-progress',
    lastUsed: '1 day ago'
  },
  {
    id: 'lessons-learned',
    title: 'Lessons Learned Compiler',
    subtitle: 'Knowledge capture and analysis',
    description: 'Systematically capture, analyze, and document project lessons learned for future reference and improvement.',
    icon: Lightbulb,
    route: ROUTES.AI_TOOLS.CLOSURE_LESSONS_LEARNED,
    features: 'Knowledge extraction, pattern analysis, recommendation engine',
    colorVariant: 'accent',
    status: 'completed',
    lastUsed: '3 days ago'
  },
  {
    id: 'warranty-docs',
    title: 'Warranty Documentation Builder',
    subtitle: 'Warranty and maintenance documentation',
    description: 'Create comprehensive warranty documentation, maintenance schedules, and service agreements.',
    icon: Shield,
    route: ROUTES.AI_TOOLS.CLOSURE_WARRANTY_DOCS,
    features: 'Warranty tracking, maintenance scheduling, service agreements',
    colorVariant: 'warning',
    status: 'not-started'
  },
  {
    id: 'final-report',
    title: 'Final Report Generator',
    subtitle: 'Comprehensive project closure report',
    description: 'Generate detailed final project reports including performance metrics, achievements, and recommendations.',
    icon: FileBarChart,
    route: ROUTES.AI_TOOLS.CLOSURE_FINAL_REPORT,
    features: 'Performance analysis, achievement tracking, recommendation engine',
    colorVariant: 'secondary',
    status: 'in-progress',
    lastUsed: '5 days ago'
  }
];

const recentActivities = [
  {
    id: '1',
    type: 'closeout',
    title: 'Project Closeout Checklist completed',
    description: 'All 47 closure items verified and approved',
    timestamp: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    type: 'documentation',
    title: 'As-Built drawings generated',
    description: '15 drawings updated and ready for handover',
    timestamp: '1 day ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'lessons',
    title: 'Lessons Learned analysis completed',
    description: '12 key insights identified and documented',
    timestamp: '3 days ago',
    status: 'completed'
  },
  {
    id: '4',
    type: 'warranty',
    title: 'Warranty documentation started',
    description: 'Initial warranty framework created',
    timestamp: '1 week ago',
    status: 'in-progress'
  }
];

const recentOutputs = [
  {
    id: '1',
    title: 'Project Closeout Report',
    type: 'document',
    size: '2.4 MB',
    created: '2 hours ago',
    status: 'ready'
  },
  {
    id: '2',
    title: 'As-Built Drawing Set',
    type: 'drawings',
    size: '15.7 MB',
    created: '1 day ago',
    status: 'ready'
  },
  {
    id: '3',
    title: 'Lessons Learned Summary',
    type: 'report',
    size: '856 KB',
    created: '3 days ago',
    status: 'ready'
  }
];

export default function ClosureHandoverPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState('1');

  const handleToolClick = (tool: ClosureTool) => {
    navigate(tool.route);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'ai-assistant') {
      navigate('/free/ai');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Closure & Handover Tools</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered project closure and handover management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Closure
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
                  <Briefcase className="h-4 w-4 text-primary" />
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
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{project.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${
                            project.status === 'closing' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                            project.status === 'handover' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                            'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Project Progress</span>
                  <span>{mockProjects.find(p => p.id === selectedProject)?.progress}%</span>
                </div>
                <Progress 
                  value={mockProjects.find(p => p.id === selectedProject)?.progress || 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Closure Status Overview */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Closure Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-primary">3</div>
                  <div className="text-[9px] text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-amber-600">2</div>
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

        {/* AI Tools Grid */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Archive className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">Closure & Handover Tools</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {closureTools.map((tool) => {
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
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] ${
                            tool.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                            tool.status === 'in-progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            'bg-muted/10 text-muted-foreground border-muted/20'
                          }`}
                        >
                          {tool.status === 'completed' ? 'Completed' :
                           tool.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                        </Badge>
                        {tool.lastUsed && (
                          <span className="text-[9px] text-muted-foreground">
                            {tool.lastUsed}
                          </span>
                        )}
                      </div>
                      <Button 
                        className="w-full h-8 text-xs"
                        onClick={() => handleToolClick(tool)}
                      >
                        <IconComponent className="h-3.5 w-3.5 mr-1.5" />
                        Launch Tool
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-muted-foreground">{activity.timestamp}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-[9px] ${
                          activity.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
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
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentOutputs.map((output) => (
                <div key={output.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{output.title}</h4>
                      <p className="text-xs text-muted-foreground">{output.type} • {output.size} • {output.created}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]"
                    >
                      {output.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works? */}
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
                  Choose the project you want to close out and hand over to stakeholders
                </p>
              </div>

              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Launch AI Tool</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use AI-powered tools to generate documentation, checklists, and reports
                </p>
              </div>

              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Review & Handover</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Review generated outputs and complete project handover to stakeholders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
