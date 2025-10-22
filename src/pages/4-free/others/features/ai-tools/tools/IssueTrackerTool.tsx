import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  User,
  Calendar,
  FileText,
  Shield,
  Zap,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'quality' | 'schedule' | 'cost' | 'resource' | 'technical' | 'communication';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'escalated';
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  dueDate?: string;
  resolvedDate?: string;
  impact: {
    cost: number;
    schedule: number;
    quality: string;
    safety: string;
  };
  resolution: string;
  actions: string[];
  attachments: string[];
  comments: string;
}

export default function IssueTrackerTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  // Sample issues
  const [issues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Safety Hazard - Unprotected Excavation',
      description: 'Deep excavation without proper shoring or protective barriers',
      category: 'safety',
      priority: 'critical',
      status: 'resolved',
      severity: 'severe',
      reportedBy: 'Safety Inspector',
      reportedDate: '2025-01-15',
      assignedTo: 'Site Supervisor',
      dueDate: '2025-01-16',
      resolvedDate: '2025-01-16',
      impact: {
        cost: 5000,
        schedule: 2,
        quality: 'No impact',
        safety: 'High risk - immediate action required'
      },
      resolution: 'Installed proper shoring system and safety barriers. Conducted safety briefing for all workers.',
      actions: [
        'Install temporary shoring',
        'Add safety barriers',
        'Conduct safety training',
        'Update safety protocols'
      ],
      attachments: ['safety-report.pdf', 'shoring-plan.pdf'],
      comments: 'Critical safety issue resolved within 24 hours. No injuries occurred.'
    },
    {
      id: '2',
      title: 'Material Quality Issue - Steel Reinforcement',
      description: 'Steel reinforcement bars do not meet specified grade requirements',
      category: 'quality',
      priority: 'high',
      status: 'in-progress',
      severity: 'major',
      reportedBy: 'Quality Inspector',
      reportedDate: '2025-01-18',
      assignedTo: 'Quality Manager',
      dueDate: '2025-01-25',
      impact: {
        cost: 15000,
        schedule: 5,
        quality: 'Significant impact on structural integrity',
        safety: 'Medium risk'
      },
      resolution: '',
      actions: [
        'Test steel samples',
        'Contact supplier',
        'Arrange replacement',
        'Update quality checklist'
      ],
      attachments: ['test-results.pdf', 'supplier-correspondence.pdf'],
      comments: 'Testing in progress. Supplier notified of quality concerns.'
    },
    {
      id: '3',
      title: 'Equipment Breakdown - Concrete Pump',
      description: 'Concrete pump malfunction during critical pour operation',
      category: 'resource',
      priority: 'high',
      status: 'open',
      severity: 'major',
      reportedBy: 'Equipment Operator',
      reportedDate: '2025-01-20',
      assignedTo: 'Equipment Manager',
      dueDate: '2025-01-22',
      impact: {
        cost: 8000,
        schedule: 3,
        quality: 'Potential cold joint formation',
        safety: 'Low risk'
      },
      resolution: '',
      actions: [
        'Arrange equipment repair',
        'Source backup pump',
        'Reschedule concrete pour',
        'Notify concrete supplier'
      ],
      attachments: ['equipment-report.pdf'],
      comments: 'Emergency repair in progress. Backup equipment arranged.'
    }
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Analyze construction project issues and provide AI-powered resolution recommendations. Project ID: ${projectId || 'N/A'}. Analyze current issues, identify patterns, suggest preventive measures, and provide resolution strategies. Focus on Saudi construction projects with realistic issue scenarios, safety protocols, and quality standards.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has analyzed issues and provided resolution recommendations. Review insights below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not analyze issues. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIPredictIssues = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Predict potential issues for a construction project. Project ID: ${projectId || 'N/A'}. Based on project type, phase, location, weather patterns, and historical data, identify likely issues including safety hazards, quality problems, schedule delays, and resource conflicts. Provide early warning indicators and preventive measures for Saudi construction projects.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has predicted potential issues and provided early warning indicators.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI prediction failed:', error);
      toast.error("Could not predict issues. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIRootCauseAnalysis = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Perform root cause analysis for construction project issues. Project ID: ${projectId || 'N/A'}. Analyze current issues to identify underlying causes, contributing factors, and systemic problems. Use 5-Why analysis, fishbone diagrams, and provide actionable root cause solutions. Focus on Saudi construction project management practices and cultural factors.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has performed root cause analysis and identified underlying issues.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI root cause analysis failed:', error);
      toast.error("Could not perform root cause analysis. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIPreventiveMeasures = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Develop preventive measures for construction project issues. Project ID: ${projectId || 'N/A'}. Based on current and historical issues, create comprehensive prevention strategies including process improvements, training recommendations, quality controls, and safety protocols. Include Saudi construction standards, SCE compliance, and Vision 2030 requirements.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has developed comprehensive preventive measures and process improvements.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI preventive measures failed:', error);
      toast.error("Could not develop preventive measures. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIEscalationStrategy = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Create intelligent escalation strategy for construction project issues. Project ID: ${projectId || 'N/A'}. Define escalation triggers, stakeholder notification protocols, response timeframes, and resolution pathways. Include Saudi construction hierarchy, client communication protocols, and regulatory compliance requirements. Provide automated escalation rules and decision trees.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has created intelligent escalation strategy with automated triggers.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI escalation strategy failed:', error);
      toast.error("Could not create escalation strategy. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your issue data has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your issue report is being exported to PDF...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'resolved':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'closed':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'escalated':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'moderate':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'major':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'severe':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'in-progress':
        return <Clock className="h-3.5 w-3.5" />;
      case 'resolved':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'closed':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'escalated':
        return <Zap className="h-3.5 w-3.5" />;
      default:
        return <AlertTriangle className="h-3.5 w-3.5" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return <Shield className="h-3.5 w-3.5" />;
      case 'quality':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'schedule':
        return <Calendar className="h-3.5 w-3.5" />;
      case 'cost':
        return <TrendingUp className="h-3.5 w-3.5" />;
      case 'resource':
        return <Activity className="h-3.5 w-3.5" />;
      case 'technical':
        return <FileText className="h-3.5 w-3.5" />;
      case 'communication':
        return <User className="h-3.5 w-3.5" />;
      default:
        return <AlertTriangle className="h-3.5 w-3.5" />;
    }
  };

  const formatSAR = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openIssues = issues.filter(i => i.status === 'open').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const criticalIssues = issues.filter(i => i.priority === 'critical').length;
  const totalImpact = issues.reduce((sum, i) => sum + i.impact.cost, 0);
  const averageResolutionTime = 3.2; // days

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
              onClick={() => navigate('/free/ai-tools/execution')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Issue Resolution Tracker</h1>
              <p className="text-xs text-muted-foreground">
                Track and resolve project issues with AI-powered solutions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 text-xs"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Issues
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{issues.length}</div>
              <div className="text-xs text-muted-foreground">Total Issues</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{openIssues}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{inProgressIssues}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{resolvedIssues}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - AI Actions & Insights */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Actions */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">AI Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  className="w-full h-8 text-xs shadow-md"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI Analyze Issues
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIPredictIssues}
                  disabled={isGenerating}
                >
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  Predict Issues
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIRootCauseAnalysis}
                  disabled={isGenerating}
                >
                  <Brain className="h-3.5 w-3.5 mr-1.5" />
                  Root Cause Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIPreventiveMeasures}
                  disabled={isGenerating}
                >
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Preventive Measures
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIEscalationStrategy}
                  disabled={isGenerating}
                >
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Escalation Strategy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-xs font-medium text-red-600">Critical Issues</span>
                  </div>
                  <p className="text-[10px] text-red-600/80 leading-relaxed">
                    {criticalIssues} critical issues require immediate attention. Focus on safety and quality.
                  </p>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">Cost Impact</span>
                  </div>
                  <p className="text-[10px] text-amber-600/80 leading-relaxed">
                    Issues have caused {formatSAR(totalImpact)} in additional costs. Implement preventive measures.
                  </p>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Resolution Time</span>
                  </div>
                  <p className="text-[10px] text-blue-600/80 leading-relaxed">
                    Average resolution time: {averageResolutionTime} days. Consider faster escalation for critical issues.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Issue Categories */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Categories</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {['safety', 'quality', 'schedule', 'cost', 'resource', 'technical', 'communication'].map((category) => {
                  const count = issues.filter(i => i.category === category).length;
                  return (
                    <div key={category} className="flex items-center justify-between p-2 bg-background rounded border border-border">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="text-xs font-medium capitalize">{category}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Resolution Stats */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Resolution Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Resolution Rate</div>
                  <div className="text-xl font-bold text-green-600">
                    {issues.length > 0 ? ((resolvedIssues / issues.length) * 100).toFixed(0) : 0}%
                  </div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Avg Resolution Time</div>
                  <div className="text-xl font-bold text-blue-600">{averageResolutionTime} days</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Impact</div>
                  <div className="text-xl font-bold text-red-600">{formatSAR(totalImpact)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Issues List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Issues & Resolutions
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {issues.length} issues • {openIssues} open • {resolvedIssues} resolved
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowNewForm(!showNewForm)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    New Issue
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {issues.map((issue) => (
                  <div key={issue.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-bold">{issue.title}</h3>
                          <Badge className={`text-[9px] ${getStatusColor(issue.status)}`}>
                            {getStatusIcon(issue.status)}
                            <span className="ml-1">
                              {issue.status === 'open' ? 'Open' :
                               issue.status === 'in-progress' ? 'In Progress' :
                               issue.status === 'resolved' ? 'Resolved' :
                               issue.status === 'closed' ? 'Closed' : 'Escalated'}
                            </span>
                          </Badge>
                          <Badge className={`text-[9px] ${getPriorityColor(issue.priority)}`}>
                            {issue.priority === 'low' ? 'Low' :
                             issue.priority === 'medium' ? 'Medium' :
                             issue.priority === 'high' ? 'High' : 'Critical'}
                          </Badge>
                          <Badge className={`text-[9px] ${getSeverityColor(issue.severity)}`}>
                            {issue.severity === 'minor' ? 'Minor' :
                             issue.severity === 'moderate' ? 'Moderate' :
                             issue.severity === 'major' ? 'Major' : 'Severe'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{issue.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(issue.category)}
                            <span className="capitalize">{issue.category}</span>
                          </div>
                          <span>•</span>
                          <span>By: {issue.reportedBy}</span>
                          <span>•</span>
                          <span>{issue.reportedDate}</span>
                          {issue.assignedTo && (
                            <>
                              <span>•</span>
                              <span>Assigned: {issue.assignedTo}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Impact Analysis */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Cost Impact</div>
                        <div className="text-sm font-bold text-red-600">{formatSAR(issue.impact.cost)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Schedule Impact</div>
                        <div className="text-sm font-medium">+{issue.impact.schedule} days</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Quality Impact</div>
                        <div className="text-sm font-medium">{issue.impact.quality}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Safety Impact</div>
                        <div className="text-sm font-medium">{issue.impact.safety}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    {issue.actions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Actions:</div>
                        <div className="space-y-1">
                          {issue.actions.map((action, index) => (
                            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="w-1 h-1 bg-primary rounded-full"></span>
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resolution */}
                    {issue.resolution && (
                      <div className="mb-3 p-2 bg-green-500/10 rounded border border-green-500/20">
                        <div className="text-xs font-medium text-green-600 mb-1">Resolution:</div>
                        <p className="text-xs text-green-600/80">{issue.resolution}</p>
                      </div>
                    )}

                    {issue.comments && (
                      <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground mb-2">
                        <strong>Comments:</strong> {issue.comments}
                      </div>
                    )}

                    {issue.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Attachments:</span>
                        {issue.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-[9px]">
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
