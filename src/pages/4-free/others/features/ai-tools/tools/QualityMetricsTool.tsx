import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Loader2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Users,
  Settings,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface QualityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
  category: string;
}

interface QualityKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
  lastUpdated: string;
}

interface QualityTrend {
  id: string;
  name: string;
  data: Array<{
    date: string;
    value: number;
  }>;
  color: string;
}

export default function QualityMetricsTool() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([
    {
      id: '1',
      name: 'Overall Quality Score',
      value: 92,
      target: 90,
      unit: '%',
      trend: 'up',
      change: 2.5,
      status: 'excellent',
      description: 'Overall project quality rating based on all quality indicators',
      category: 'overall'
    },
    {
      id: '2',
      name: 'Defect Rate',
      value: 2.3,
      target: 3.0,
      unit: '%',
      trend: 'down',
      change: -0.8,
      status: 'good',
      description: 'Percentage of defective work identified during inspections',
      category: 'defects'
    },
    {
      id: '3',
      name: 'First Pass Yield',
      value: 87,
      target: 85,
      unit: '%',
      trend: 'up',
      change: 3.2,
      status: 'excellent',
      description: 'Percentage of work passing quality inspection on first attempt',
      category: 'efficiency'
    },
    {
      id: '4',
      name: 'Compliance Score',
      value: 95,
      target: 90,
      unit: '%',
      trend: 'stable',
      change: 0.0,
      status: 'excellent',
      description: 'Compliance with SCE requirements and building codes',
      category: 'compliance'
    },
    {
      id: '5',
      name: 'Rework Rate',
      value: 4.2,
      target: 5.0,
      unit: '%',
      trend: 'down',
      change: -1.1,
      status: 'good',
      description: 'Percentage of work requiring rework due to quality issues',
      category: 'efficiency'
    },
    {
      id: '6',
      name: 'Safety Score',
      value: 88,
      target: 85,
      unit: '%',
      trend: 'up',
      change: 2.3,
      status: 'excellent',
      description: 'Safety compliance and incident-free work performance',
      category: 'safety'
    }
  ]);

  const [qualityKPIs, setQualityKPIs] = useState<QualityKPI[]>([
    {
      id: '1',
      title: 'Quality Index',
      value: 92,
      target: 90,
      unit: 'points',
      trend: 'up',
      change: 2.5,
      status: 'excellent',
      description: 'Composite quality score based on multiple indicators',
      lastUpdated: '2024-01-20'
    },
    {
      id: '2',
      title: 'Customer Satisfaction',
      value: 94,
      target: 90,
      unit: '%',
      trend: 'up',
      change: 1.8,
      status: 'excellent',
      description: 'Client satisfaction rating based on quality deliverables',
      lastUpdated: '2024-01-19'
    },
    {
      id: '3',
      title: 'On-Time Delivery',
      value: 89,
      target: 85,
      unit: '%',
      trend: 'up',
      change: 2.1,
      status: 'excellent',
      description: 'Percentage of quality milestones delivered on time',
      lastUpdated: '2024-01-18'
    },
    {
      id: '4',
      title: 'Cost of Quality',
      value: 3.2,
      target: 4.0,
      unit: '%',
      trend: 'down',
      change: -0.5,
      status: 'excellent',
      description: 'Cost of quality activities as percentage of total project cost',
      lastUpdated: '2024-01-17'
    }
  ]);

  const [qualityTrends, setQualityTrends] = useState<QualityTrend[]>([
    {
      id: '1',
      name: 'Quality Score Trend',
      color: 'blue',
      data: [
        { date: '2024-01-01', value: 85 },
        { date: '2024-01-05', value: 87 },
        { date: '2024-01-10', value: 89 },
        { date: '2024-01-15', value: 91 },
        { date: '2024-01-20', value: 92 }
      ]
    },
    {
      id: '2',
      name: 'Defect Rate Trend',
      color: 'red',
      data: [
        { date: '2024-01-01', value: 4.2 },
        { date: '2024-01-05', value: 3.8 },
        { date: '2024-01-10', value: 3.2 },
        { date: '2024-01-15', value: 2.8 },
        { date: '2024-01-20', value: 2.3 }
      ]
    },
    {
      id: '3',
      name: 'Compliance Score Trend',
      color: 'green',
      data: [
        { date: '2024-01-01', value: 88 },
        { date: '2024-01-05', value: 90 },
        { date: '2024-01-10', value: 92 },
        { date: '2024-01-15', value: 94 },
        { date: '2024-01-20', value: 95 }
      ]
    }
  ]);

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const categories = [
    { value: 'overall', label: 'Overall' },
    { value: 'defects', label: 'Defects' },
    { value: 'efficiency', label: 'Efficiency' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'safety', label: 'Safety' }
  ];

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate comprehensive quality metrics analysis for a construction project. Project ID: ${projectId || 'N/A'}. Period: ${selectedPeriod}. Category: ${selectedCategory}. Provide AI-powered insights into quality trends, performance indicators, benchmarking against industry standards, and recommendations for quality improvement based on Saudi construction practices.`;
      await sendMessage(prompt);
      toast.success("AI has generated quality metrics insights. Review analysis below.");
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate quality insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Quality metrics saved successfully!");
    } catch (error) {
      console.error('Save failed:', error);
      toast.error("Could not save quality metrics. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast.success("Quality metrics report exported to PDF");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/10 text-green-600';
      case 'good': return 'bg-blue-500/10 text-blue-600';
      case 'warning': return 'bg-yellow-500/10 text-yellow-600';
      case 'critical': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Target className="h-4 w-4 text-blue-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const overallScore = qualityMetrics.find(m => m.id === '1')?.value || 0;
  const defectRate = qualityMetrics.find(m => m.id === '2')?.value || 0;
  const complianceScore = qualityMetrics.find(m => m.id === '4')?.value || 0;
  const safetyScore = qualityMetrics.find(m => m.id === '6')?.value || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="container mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Quality Metrics Dashboard</h1>
              <p className="text-xs text-muted-foreground">Real-time KPIs and trend analysis</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-8 text-xs"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save Data
                </>
              )}
            </Button>
            <Button 
              className="h-8 text-xs shadow-md"
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
                  AI Analyze
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="h-8 text-xs"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Dashboard Filters</CardTitle>
                <p className="text-xs text-muted-foreground">Configure metrics view and analysis period</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="border border-border h-10">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border border-border h-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Key Performance Indicators</CardTitle>
                <p className="text-xs text-muted-foreground">Critical quality metrics and targets</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityKPIs.map((kpi) => (
                <div key={kpi.id} className="p-4 bg-background border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(kpi.trend)}
                      <h3 className="text-sm font-bold">{kpi.title}</h3>
                    </div>
                    <Badge className={`text-[9px] ${getStatusColor(kpi.status)}`}>
                      {kpi.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{kpi.value}</span>
                      <span className="text-sm text-muted-foreground">/ {kpi.target}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                      </span>
                      <span className="text-xs text-muted-foreground">vs target</span>
                    </div>
                    <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                    <p className="text-xs text-muted-foreground">Updated: {kpi.lastUpdated}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics Grid */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Quality Metrics</CardTitle>
                <p className="text-xs text-muted-foreground">Detailed quality performance indicators</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qualityMetrics.map((metric) => (
                <div key={metric.id} className="p-4 bg-background border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <h3 className="text-sm font-bold">{metric.name}</h3>
                    </div>
                    <Badge className={`text-[9px] ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{metric.value}{metric.unit}</span>
                      <span className="text-sm text-muted-foreground">Target: {metric.target}{metric.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span className="text-xs text-muted-foreground">change</span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Trends */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Quality Trends</CardTitle>
                <p className="text-xs text-muted-foreground">Performance trends over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              {qualityTrends.map((trend) => (
                <div key={trend.id} className="p-4 bg-background border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold">{trend.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${trend.color}-500`}></div>
                      <span className="text-xs text-muted-foreground">Trend Line</span>
                    </div>
                  </div>
                  <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Chart visualization would be here</p>
                      <p className="text-xs text-muted-foreground">Data points: {trend.data.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Actions */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">AI-Powered Quality Analysis</CardTitle>
                <p className="text-xs text-muted-foreground">Leverage AI for enhanced quality insights</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    AI Analyze
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is benchmarking quality...")}
              >
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Benchmark
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is predicting quality trends...")}
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Predict Trends
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast.success("AI is generating recommendations...")}
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
