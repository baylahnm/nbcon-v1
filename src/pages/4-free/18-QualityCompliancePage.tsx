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
  Clock,
  BarChart3,
  ClipboardList,
  MessageSquare,
  Settings,
  Bot,
  Loader2,
  Layers,
  FileText,
  Search,
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
      <div className="container mx-auto px-6 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Quality & Compliance Tools</h1>
              <p className="text-xs text-muted-foreground">AI-powered quality management and compliance tracking</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-8 text-xs"
              onClick={() => navigate('/free/ai-tools')}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to AI Tools
            </Button>
            <Button 
              className="h-8 text-xs shadow-md"
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
                  AI Quality Insights
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Project Selector */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Select Active Project</CardTitle>
                  <p className="text-xs text-muted-foreground">Choose project to link quality tools</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Project
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-80 border border-border h-10">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{project.name}</span>
                        <Badge variant="outline" className="ml-2 text-[9px]">
                          {project.progress}%
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProjectData && (
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{selectedProjectData.name}</div>
                  <Badge 
                    variant={selectedProjectData.status === 'active' ? 'default' : 'secondary'}
                    className="text-[9px]"
                  >
                    {selectedProjectData.status}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quality Progress Widget */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Quality Progress</CardTitle>
                <p className="text-xs text-muted-foreground">Overall quality compliance status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Score</span>
                  <span className="text-sm font-bold text-green-600">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality Checks</span>
                  <span className="text-sm font-bold text-blue-600">156/180</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Defects Resolved</span>
                  <span className="text-sm font-bold text-amber-600">23/28</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SCE Compliance</span>
                  <span className="text-sm font-bold text-purple-600">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {qualityTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="group hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/30 overflow-hidden gap-0"
            >
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <tool.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-bold tracking-tight">{tool.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.subtitle}</p>
                  </div>
                  <Badge 
                    variant={tool.status === 'active' ? 'default' : 'secondary'}
                    className="text-[9px]"
                  >
                    {tool.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Key Features:</h4>
                  <p className="text-xs text-muted-foreground">{tool.features}</p>
                </div>

                <Button 
                  className="w-full h-8 text-xs shadow-md"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Launch Tool →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Recent Activities</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest quality management actions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="bg-green-500/10 p-1.5 rounded-lg">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality inspection completed</p>
                  <p className="text-xs text-muted-foreground">Structural phase - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="bg-blue-500/10 p-1.5 rounded-lg">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Compliance report generated</p>
                  <p className="text-xs text-muted-foreground">SCE requirements - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="bg-amber-500/10 p-1.5 rounded-lg">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Defect identified and logged</p>
                  <p className="text-xs text-muted-foreground">MEP installation - 6 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileDown className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Recent Outputs</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest quality reports and documents</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:shadow-md transition-all">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <ClipboardList className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality Control Checklist</p>
                  <p className="text-xs text-muted-foreground">Structural Phase - PDF</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <FileDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:shadow-md transition-all">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Compliance Status Report</p>
                  <p className="text-xs text-muted-foreground">SCE Requirements - PDF</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <FileDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:shadow-md transition-all">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality Metrics Dashboard</p>
                  <p className="text-xs text-muted-foreground">Weekly Summary - PDF</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <FileDown className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">How It Works</CardTitle>
                <p className="text-xs text-muted-foreground">Simple 3-step process for quality management</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Select Project</h3>
                  <p className="text-xs text-muted-foreground">Choose your active project to link all quality tools and maintain context.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Launch AI Tool</h3>
                  <p className="text-xs text-muted-foreground">Click any quality tool to access AI-powered features for comprehensive quality management.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Review & Refine</h3>
                  <p className="text-xs text-muted-foreground">AI generates content, you review and refine to ensure accuracy and compliance.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Quick Links</CardTitle>
                <p className="text-xs text-muted-foreground">Access quality tools and related features</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick('/free/ai-tools/quality/checklist')}
              >
                <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                Checklists
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick('/free/ai-tools/quality/inspection')}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Inspections
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick('/free/ai-tools/quality/compliance')}
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Compliance
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick('/free/ai-tools/quality/defects')}
              >
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Defects
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick('/free/ai-tools/quality/metrics')}
              >
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary-gradient"
          onClick={() => navigate('/free/ai')}
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
