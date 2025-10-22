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
  Shield,
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
  Search,
  Clock,
  BarChart3,
  ClipboardList,
  MessageSquare,
  Settings,
  Loader2,
  Layers,
  FileText,
  Target,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';
import { ROUTES, getRouteWithProject } from '@/shared/constants/routes';

interface QualityTool {
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

export default function QualityCompliancePage() {
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

  const qualityTools: QualityTool[] = [
    {
      id: '1',
      title: 'Quality Control Checklist',
      subtitle: 'AI-Generated Dynamic Checklists',
      description: 'Generate comprehensive quality control checklists tailored to project phases, trades, and Saudi construction standards.',
      features: 'Dynamic checklists, SCE compliance, Trade-specific items, Photo attachments, Progress tracking',
      icon: ClipboardList,
      route: '/free/ai-tools/quality/checklist',
      color: 'blue',
      status: 'active',
    },
    {
      id: '2',
      title: 'Inspection Report Builder',
      subtitle: 'Photo Documentation & AI Analysis',
      description: 'Create detailed inspection reports with photo documentation, AI-powered defect identification, and professional formatting.',
      features: 'Photo documentation, AI defect detection, Report templates, Digital signatures, Export options',
      icon: FileText,
      route: '/free/ai-tools/quality/inspection',
      color: 'green',
      status: 'active',
    },
    {
      id: '3',
      title: 'Compliance Tracker',
      subtitle: 'SCE & Building Codes Monitoring',
      description: 'Monitor compliance with Saudi Council of Engineers requirements and building codes with real-time tracking and alerts.',
      features: 'SCE compliance, Building codes, Regulatory alerts, Compliance scoring, Audit trails',
      icon: Shield,
      route: '/free/ai-tools/quality/compliance',
      color: 'amber',
      status: 'active',
    },
    {
      id: '4',
      title: 'Defect Punch List Manager',
      subtitle: 'AI Defect Detection & Prioritization',
      description: 'Identify, categorize, and prioritize construction defects with AI-powered analysis and automated task assignment.',
      features: 'AI defect detection, Priority scoring, Task assignment, Resolution tracking, Quality metrics',
      icon: Target,
      route: '/free/ai-tools/quality/defects',
      color: 'red',
      status: 'active',
    },
    {
      id: '5',
      title: 'Quality Metrics Dashboard',
      subtitle: 'Real-time KPIs & Trend Analysis',
      description: 'Monitor quality performance with real-time metrics, trend analysis, and predictive insights for continuous improvement.',
      features: 'Real-time KPIs, Trend analysis, Predictive insights, Quality scoring, Performance benchmarking',
      icon: BarChart3,
      route: '/free/ai-tools/quality/metrics',
      color: 'purple',
      status: 'active',
    },
  ];

  const handleToolClick = (route: string) => {
    navigate(getRouteWithProject(route, selectedProject));
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate quality and compliance insights for a construction project. Project ID: ${projectId || 'N/A'}. Provide recommendations for quality control, compliance monitoring, and defect prevention based on Saudi construction standards and SCE requirements.`;
      await sendMessage(prompt);
      toast.success("AI has generated quality insights. Review recommendations below.");
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate quality insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Quality & Compliance Tools</h1>
              <p className="text-xs text-muted-foreground">AI-powered quality management and compliance tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Quality Plan
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
                  <Settings className="h-4 w-4 text-primary" />
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
                      {selectedProjectData.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{selectedProjectData.progress}%</span>
                    </div>
                    <Progress value={selectedProjectData.progress} className="h-1.5" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quality Progress */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Quality Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tools Completed</span>
                  <span className="font-medium">3 / 5</span>
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

        {/* AI-Powered Quality & Compliance Tools */}
        <div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualityTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="border-border/50 hover:shadow-md transition-all">
                  <CardHeader className="p-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl ring-1 shadow-md bg-primary/10 text-primary border-primary/20">
                        <IconComponent className="h-4 w-4" />
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
                      disabled={!selectedProject}
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
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Quality inspection completed</p>
                  <p className="text-[10px] text-muted-foreground">Structural phase</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Compliance report generated</p>
                  <p className="text-[10px] text-muted-foreground">SCE requirements</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  4 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Defect identified and logged</p>
                  <p className="text-[10px] text-muted-foreground">MEP installation</p>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                  6 hours ago
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
                    <ClipboardList className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5">Quality Control Checklist</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Structural Phase</span>
                      <span>•</span>
                      <span>Oct 20, 2025</span>
                      <span>•</span>
                      <span>1.2 MB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <FileDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5">Compliance Status Report</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>SCE Requirements</span>
                      <span>•</span>
                      <span>Oct 18, 2025</span>
                      <span>•</span>
                      <span>245 KB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <FileDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5">Quality Metrics Dashboard</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Weekly Summary</span>
                      <span>•</span>
                      <span>Oct 15, 2025</span>
                      <span>•</span>
                      <span>180 KB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <FileDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How AI-Powered Quality Management Works */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                How AI-Powered Quality Management Works
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Select Tool</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose from 5 specialized quality tools based on your needs
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm font-bold mb-2">AI Generate</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Let AI create checklists, reports, and compliance documents from project data
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Review & Export</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Refine results and export to PDF, Excel, or quality management systems
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
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.QUALITY_CHECKLIST)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Checklist
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.QUALITY_INSPECTION)}
              >
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Inspection
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.QUALITY_COMPLIANCE)}
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Compliance
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.QUALITY_DEFECTS)}
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                Defects
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
