import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
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
  DollarSign,
  Loader2,
  Brain,
  Target,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'good' | 'warning' | 'over';
}

export default function BudgetTrackerTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Budget categories
  const [categories] = useState<BudgetCategory[]>([
    { 
      id: '1', 
      name: 'Labor', 
      planned: 300000, 
      actual: 345000, 
      variance: 45000, 
      variancePercent: 15,
      status: 'over'
    },
    { 
      id: '2', 
      name: 'Materials', 
      planned: 450000, 
      actual: 420000, 
      variance: -30000, 
      variancePercent: -7,
      status: 'good'
    },
    { 
      id: '3', 
      name: 'Equipment', 
      planned: 150000, 
      actual: 85000, 
      variance: -65000, 
      variancePercent: -43,
      status: 'good'
    },
    { 
      id: '4', 
      name: 'Subcontractors', 
      planned: 100000, 
      actual: 0, 
      variance: 0, 
      variancePercent: 0,
      status: 'warning'
    },
  ]);

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
  const totalRemaining = totalPlanned - totalActual;
  const utilizationPercent = (totalActual / totalPlanned) * 100;
  const projectedFinal = 1045000; // Sample projection

  const handleAIAnalyze = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Analyze budget performance for a construction project. Project ID: ${projectId || 'N/A'}. Compare planned vs actual spending across categories (Labor, Materials, Equipment, Subcontractors). Identify variances, spending trends, at-risk categories, and forecast final costs. Provide recommendations for budget realignment and corrective actions. Focus on Saudi construction projects.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has analyzed budget performance. Check insights below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error("Could not analyze budget. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your budget tracker data has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your budget report is being exported to PDF...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'over':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const healthScore = Math.min(100, Math.max(0, 100 - Math.abs(utilizationPercent - 85)));

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
              onClick={() => navigate('/free/ai-tools/budgeting')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Budget Tracker</h1>
              <p className="text-xs text-muted-foreground">
                Real-time variance analysis and forecasting
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
              Save Tracker
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

        {/* Budget Health */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Budget Health</div>
                  <div className="text-xs text-muted-foreground">{utilizationPercent.toFixed(1)}% Utilized</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Spent / Budget</div>
                <div className="text-sm font-bold text-primary">
                  {totalActual.toLocaleString()} / {totalPlanned.toLocaleString()} SAR
                </div>
              </div>
            </div>
            <Progress value={utilizationPercent} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Remaining: {totalRemaining.toLocaleString()} SAR</span>
              <Badge className={healthScore >= 70 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'} style={{ fontSize: '9px' }}>
                {healthScore >= 70 ? 'Healthy' : 'At Risk'}
              </Badge>
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
                      AI Analyze Spending
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
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">Labor Overrun</span>
                  </div>
                  <p className="text-[10px] text-amber-600/80 leading-relaxed">
                    Labor costs trending +15% over budget. Consider resource optimization.
                  </p>
                </div>

                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Equipment Savings</span>
                  </div>
                  <p className="text-[10px] text-green-600/80 leading-relaxed">
                    65K SAR saved on equipment. Can offset labor overrun.
                  </p>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Recommendation</span>
                  </div>
                  <p className="text-[10px] text-blue-600/80 leading-relaxed">
                    Reallocate +45K from Equipment to Labor category.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Forecast */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Forecast</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="text-center p-3 bg-background rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Projected Final Cost</div>
                  <div className="text-xl font-bold text-primary">{projectedFinal.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-amber-600">Projected Overrun</span>
                    <span className="font-bold text-amber-600">+45K SAR</span>
                  </div>
                  <div className="text-[10px] text-amber-600/80">
                    +4.5% over original budget
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Variance Table */}
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
                        Budget Variance Analysis
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {categories.length} categories • {totalActual.toLocaleString()} SAR spent
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xs font-bold">Category</div>
                  <div className="text-xs font-bold text-right">Planned</div>
                  <div className="text-xs font-bold text-right">Actual</div>
                  <div className="text-xs font-bold text-right">Variance</div>
                  <div className="text-xs font-bold text-right">%</div>
                  <div className="text-xs font-bold text-center">Alert</div>
                </div>

                {/* Category Rows */}
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="grid grid-cols-6 gap-2 p-3 bg-background rounded-lg border border-border">
                      <div className="text-xs font-medium">{category.name}</div>
                      <div className="text-xs text-right">{category.planned.toLocaleString()}</div>
                      <div className="text-xs text-right font-medium">{category.actual.toLocaleString()}</div>
                      <div className={`text-xs text-right font-bold ${category.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {category.variance >= 0 ? '+' : ''}{category.variance.toLocaleString()}
                      </div>
                      <div className={`text-xs text-right font-bold ${category.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {category.variance >= 0 ? '+' : ''}{category.variancePercent}%
                      </div>
                      <div className="flex items-center justify-center">
                        <Badge className={`text-[9px] ${getStatusColor(category.status)}`}>
                          {category.status === 'good' ? 'Good' : category.status === 'over' ? 'Over' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="space-y-1 px-3">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Utilization</span>
                        <span className="font-medium">
                          {category.actual > 0 ? ((category.actual / category.planned) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={category.actual > 0 ? (category.actual / category.planned) * 100 : 0} 
                        className="h-1.5" 
                      />
                    </div>
                  </div>
                ))}

                {/* Total Row */}
                <div className="grid grid-cols-6 gap-2 p-3 bg-primary/5 rounded-lg border-2 border-primary/20 mt-4">
                  <div className="text-xs font-bold">TOTAL</div>
                  <div className="text-xs text-right font-bold">{totalPlanned.toLocaleString()}</div>
                  <div className="text-xs text-right font-bold text-primary">{totalActual.toLocaleString()}</div>
                  <div className={`text-xs text-right font-bold ${totalActual > totalPlanned ? 'text-red-600' : 'text-green-600'}`}>
                    {totalActual > totalPlanned ? '+' : ''}{(totalActual - totalPlanned).toLocaleString()}
                  </div>
                  <div className={`text-xs text-right font-bold ${totalActual > totalPlanned ? 'text-red-600' : 'text-green-600'}`}>
                    {((totalActual - totalPlanned) / totalPlanned * 100).toFixed(1)}%
                  </div>
                  <div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

