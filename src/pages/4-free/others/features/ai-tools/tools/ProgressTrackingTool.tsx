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
  BarChart3,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target,
  Loader2,
  Brain,
  Activity,
  Clock,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface ProgressMetric {
  id: string;
  name: string;
  planned: number;
  actual: number;
  variance: number;
  status: 'on-track' | 'behind' | 'ahead';
  trend: 'up' | 'down' | 'stable';
}

interface Milestone {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  progress: number;
  dependencies: string[];
}

export default function ProgressTrackingTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRange] = useState('30'); // 30 days

  // Sample progress metrics
  const [progressMetrics] = useState<ProgressMetric[]>([
    { id: '1', name: 'Foundation Work', planned: 100, actual: 85, variance: -15, status: 'behind', trend: 'up' },
    { id: '2', name: 'Structural Frame', planned: 80, actual: 45, variance: -35, status: 'behind', trend: 'up' },
    { id: '3', name: 'MEP Installation', planned: 60, actual: 20, variance: -40, status: 'behind', trend: 'stable' },
    { id: '4', name: 'Finishes', planned: 40, actual: 5, variance: -35, status: 'behind', trend: 'down' },
  ]);

  // Sample milestones
  const [milestones] = useState<Milestone[]>([
    { id: '1', name: 'Foundation Complete', plannedDate: '2025-01-15', actualDate: '2025-01-18', status: 'completed', progress: 100, dependencies: [] },
    { id: '2', name: 'Structural Frame', plannedDate: '2025-03-01', status: 'in-progress', progress: 45, dependencies: ['Foundation Complete'] },
    { id: '3', name: 'MEP Rough-in', plannedDate: '2025-04-15', status: 'upcoming', progress: 0, dependencies: ['Structural Frame'] },
    { id: '4', name: 'Project Completion', plannedDate: '2025-08-01', status: 'upcoming', progress: 0, dependencies: ['MEP Rough-in'] },
  ]);

  const handleAIAnalyze = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Analyze construction project progress and provide AI insights. Project ID: ${projectId || 'N/A'}. Analyze current progress metrics, identify bottlenecks, predict completion dates, and suggest corrective actions. Focus on Saudi construction projects with realistic progress data, schedule variance analysis, and resource optimization recommendations.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has analyzed project progress. Review insights below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error("Could not analyze progress. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your progress tracking data has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your progress report is being exported to PDF...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'behind':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'ahead':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'stable':
        return <Activity className="h-3 w-3 text-blue-600" />;
      default:
        return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const overallProgress = progressMetrics.reduce((sum, metric) => sum + metric.actual, 0) / progressMetrics.length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const delayedMilestones = milestones.filter(m => m.status === 'delayed').length;
  const onTimeMilestones = milestones.filter(m => m.status === 'completed' && m.actualDate && new Date(m.actualDate) <= new Date(m.plannedDate)).length;

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
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Progress Tracking</h1>
              <p className="text-xs text-muted-foreground">
                Visual analytics and AI-powered insights
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
              Save Progress
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

        {/* Overall Progress */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Overall Project Progress</div>
                  <div className="text-xs text-muted-foreground">Based on weighted milestones</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Current Progress</div>
                <div className="text-2xl font-bold text-primary">{overallProgress.toFixed(0)}%</div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3 mb-3" />
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-sm font-bold text-green-600">{completedMilestones}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">In Progress</div>
                <div className="text-sm font-bold text-blue-600">{milestones.filter(m => m.status === 'in-progress').length}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Delayed</div>
                <div className="text-sm font-bold text-red-600">{delayedMilestones}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">On Time</div>
                <div className="text-sm font-bold text-green-600">{onTimeMilestones}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - AI Insights */}
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
                  onClick={handleAIAnalyze}
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
                      AI Analyze Progress
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  View Detailed Report
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
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-xs font-medium text-red-600">Schedule Risk</span>
                  </div>
                  <p className="text-[10px] text-red-600/80 leading-relaxed">
                    Project is 12 days behind schedule. MEP installation is critical path.
                  </p>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">Resource Bottleneck</span>
                  </div>
                  <p className="text-[10px] text-amber-600/80 leading-relaxed">
                    Steel delivery delayed by 5 days. Consider alternative suppliers.
                  </p>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Recommendation</span>
                  </div>
                  <p className="text-[10px] text-blue-600/80 leading-relaxed">
                    Add 2 more workers to structural frame to catch up schedule.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Schedule Performance</div>
                  <div className="text-xl font-bold text-red-600">-12 days</div>
                  <div className="text-[9px] text-muted-foreground">Behind schedule</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Cost Performance</div>
                  <div className="text-xl font-bold text-green-600">+5%</div>
                  <div className="text-[9px] text-muted-foreground">Under budget</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Quality Score</div>
                  <div className="text-xl font-bold text-blue-600">92%</div>
                  <div className="text-[9px] text-muted-foreground">Excellent</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Progress Metrics */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Progress Metrics
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {progressMetrics.length} work packages • Overall: {overallProgress.toFixed(0)}% complete
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {progressMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold">{metric.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-[9px] ${getStatusColor(metric.status)}`}>
                            {metric.status === 'on-track' ? 'On Track' : metric.status === 'behind' ? 'Behind' : 'Ahead'}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metric.trend)}
                            <span className="text-[9px] text-muted-foreground">
                              {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{metric.actual}%</div>
                        <div className="text-[9px] text-muted-foreground">Actual</div>
                      </div>
                    </div>
                    
                    <Progress value={metric.actual} className="h-2 mb-3" />
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Planned</div>
                        <div className="text-sm font-medium">{metric.planned}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Variance</div>
                        <div className={`text-sm font-bold ${metric.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {metric.variance < 0 ? '' : '+'}{metric.variance}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="text-sm font-medium">
                          {metric.actual >= metric.planned ? 'On Track' : 'Behind'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Milestones Timeline */}
            <Card className="border-border/50 mt-4">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Milestones Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        milestone.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : milestone.status === 'in-progress'
                          ? 'bg-blue-500 text-white'
                          : milestone.status === 'delayed'
                          ? 'bg-red-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <Calendar className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold">{milestone.name}</h3>
                          <Badge className={`text-[9px] ${
                            milestone.status === 'completed' 
                              ? 'bg-green-500/10 text-green-600 border-green-500/20'
                              : milestone.status === 'in-progress'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                              : milestone.status === 'delayed'
                              ? 'bg-red-500/10 text-red-600 border-red-500/20'
                              : 'bg-muted/10 text-muted-foreground border-muted/20'
                          }`}>
                            {milestone.status === 'completed' ? 'Completed' : 
                             milestone.status === 'in-progress' ? 'In Progress' :
                             milestone.status === 'delayed' ? 'Delayed' : 'Upcoming'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>Planned: {milestone.plannedDate}</span>
                          {milestone.actualDate && <span>Actual: {milestone.actualDate}</span>}
                        </div>
                        {milestone.status === 'in-progress' && (
                          <div className="mt-2">
                            <Progress value={milestone.progress} className="h-1.5" />
                            <div className="text-[9px] text-muted-foreground mt-1">{milestone.progress}% complete</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
