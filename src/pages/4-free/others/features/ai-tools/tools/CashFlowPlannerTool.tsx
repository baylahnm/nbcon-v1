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
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  Loader2,
  BarChart3,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface CashFlowMonth {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
  cumulative: number;
  hasGap: boolean;
}

export default function CashFlowPlannerTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [timelineMonths, setTimelineMonths] = useState<string>('12');

  // Sample cash flow data (12 months)
  const [cashFlowData] = useState<CashFlowMonth[]>([
    { month: 'Jan 2025', inflow: 250000, outflow: 180000, net: 70000, cumulative: 70000, hasGap: false },
    { month: 'Feb 2025', inflow: 180000, outflow: 320000, net: -140000, cumulative: -70000, hasGap: true },
    { month: 'Mar 2025', inflow: 420000, outflow: 280000, net: 140000, cumulative: 70000, hasGap: false },
    { month: 'Apr 2025', inflow: 350000, outflow: 380000, net: -30000, cumulative: 40000, hasGap: false },
    { month: 'May 2025', inflow: 280000, outflow: 420000, net: -140000, cumulative: -100000, hasGap: true },
    { month: 'Jun 2025', inflow: 520000, outflow: 350000, net: 170000, cumulative: 70000, hasGap: false },
    { month: 'Jul 2025', inflow: 380000, outflow: 280000, net: 100000, cumulative: 170000, hasGap: false },
    { month: 'Aug 2025', inflow: 420000, outflow: 450000, net: -30000, cumulative: 140000, hasGap: false },
    { month: 'Sep 2025', inflow: 350000, outflow: 320000, net: 30000, cumulative: 170000, hasGap: false },
    { month: 'Oct 2025', inflow: 280000, outflow: 380000, net: -100000, cumulative: 70000, hasGap: false },
    { month: 'Nov 2025', inflow: 450000, outflow: 280000, net: 170000, cumulative: 240000, hasGap: false },
    { month: 'Dec 2025', inflow: 320000, outflow: 350000, net: -30000, cumulative: 210000, hasGap: false },
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate monthly cash flow projections for a construction project. Project ID: ${projectId || 'N/A'}. Create ${timelineMonths}-month cash flow schedule showing monthly inflows (payments received from client) and outflows (expenses: labor, materials, equipment). Include payment milestones, funding requirements, and identify potential cash gaps. Use realistic payment terms for Saudi construction projects (typically net 30-60 days).`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated cash flow schedule. Review and adjust as needed.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate cash flow schedule. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your cash flow schedule has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your cash flow schedule is being exported to PDF...");
  };

  const totalInflow = cashFlowData.reduce((sum, m) => sum + m.inflow, 0);
  const totalOutflow = cashFlowData.reduce((sum, m) => sum + m.outflow, 0);
  const netCashFlow = totalInflow - totalOutflow;
  const fundingGaps = cashFlowData.filter(m => m.hasGap).length;

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
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Cash Flow Planner</h1>
              <p className="text-xs text-muted-foreground">
                Monthly projections with AI-powered scheduling
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
              Save Schedule
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-xl ring-1 ring-green-500/20 shadow-md">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Total Inflow</div>
                  <div className="text-lg font-bold text-green-600">{totalInflow.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-xl ring-1 ring-red-500/20 shadow-md">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Total Outflow</div>
                  <div className="text-lg font-bold text-red-600">{totalOutflow.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Net Cash Flow</div>
                  <div className="text-lg font-bold text-primary">{netCashFlow.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-xl ring-1 ring-amber-500/20 shadow-md">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Funding Gaps</div>
                  <div className="text-lg font-bold text-amber-600">{fundingGaps}</div>
                  <div className="text-[9px] text-muted-foreground">Months</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Timeline Selector */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="text-xs font-medium">Projection Period</div>
                  <Select value={timelineMonths} onValueChange={setTimelineMonths}>
                    <SelectTrigger className="border border-border h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="18">18 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI Generate Schedule
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Optimize Cash Flow
                </Button>
              </CardContent>
            </Card>

            {/* Funding Gaps Alert */}
            {fundingGaps > 0 && (
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardHeader className="p-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2 rounded-xl ring-1 ring-amber-500/20 shadow-md">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight text-amber-600">
                      Funding Gaps Detected
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs text-amber-600/90 leading-relaxed">
                    {fundingGaps} months show negative cash flow. Consider:
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-amber-600/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                      <span>Bridge loan for short-term funding</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-600/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                      <span>Negotiate advance payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-600/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                      <span>Adjust milestone schedule</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Cash Flow Table */}
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
                        Monthly Cash Flow
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timelineMonths} months projection • {cashFlowData.length} entries
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xs font-bold">Month</div>
                  <div className="text-xs font-bold text-right">Inflow</div>
                  <div className="text-xs font-bold text-right">Outflow</div>
                  <div className="text-xs font-bold text-right">Net</div>
                  <div className="text-xs font-bold text-right">Cumulative</div>
                  <div className="text-xs font-bold text-center">Status</div>
                </div>

                {/* Table Rows */}
                {cashFlowData.map((month, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-6 gap-2 p-3 rounded-lg border transition-all ${
                      month.hasGap
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-background border-border hover:shadow-sm'
                    }`}
                  >
                    <div className="text-xs font-medium">{month.month}</div>
                    <div className="text-xs text-right font-medium text-green-600">
                      +{month.inflow.toLocaleString()}
                    </div>
                    <div className="text-xs text-right font-medium text-red-600">
                      -{month.outflow.toLocaleString()}
                    </div>
                    <div className={`text-xs text-right font-bold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {month.net >= 0 ? '+' : ''}{month.net.toLocaleString()}
                    </div>
                    <div className={`text-xs text-right font-bold ${month.cumulative >= 0 ? 'text-primary' : 'text-red-600'}`}>
                      {month.cumulative.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center">
                      {month.hasGap ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">
                          Gap
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">
                          OK
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Milestones */}
            <Card className="border-border/50 mt-4">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">
                    Payment Milestones
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Mobilization Payment</span>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">
                      Received
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Jan 15, 2025</span>
                    <span className="font-bold text-green-600">+250,000 SAR</span>
                  </div>
                </div>

                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Foundation Completion</span>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Mar 30, 2025</span>
                    <span className="font-bold text-primary">+420,000 SAR</span>
                  </div>
                </div>

                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Structural Work Payment</span>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
                      Upcoming
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Jun 15, 2025</span>
                    <span className="font-bold text-primary">+520,000 SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

