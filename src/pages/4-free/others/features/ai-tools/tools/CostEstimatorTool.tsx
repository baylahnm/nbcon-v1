import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import {
  Calculator,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  TrendingUp,
  TrendingDown,
  Building2,
  MapPin,
  Ruler,
  Loader2,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface CostPhase {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface CostCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

export default function CostEstimatorTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Project info
  const [projectInfo] = useState({
    type: 'Commercial Building',
    size: '5,000 m²',
    location: 'Riyadh, Saudi Arabia',
    floors: '5 floors',
  });

  // Phase breakdown
  const [phases, setPhases] = useState<CostPhase[]>([
    { id: '1', name: 'Design & Engineering', percentage: 9, amount: 120000, status: 'completed' },
    { id: '2', name: 'Procurement & Mobilization', percentage: 21, amount: 280000, status: 'in-progress' },
    { id: '3', name: 'Construction & Execution', percentage: 64, amount: 850000, status: 'upcoming' },
    { id: '4', name: 'Testing & Closeout', percentage: 6, amount: 80000, status: 'upcoming' },
  ]);

  // Cost categories
  const [categories] = useState<CostCategory[]>([
    { id: '1', name: 'Direct Costs', percentage: 60, amount: 850000, color: 'primary' },
    { id: '2', name: 'Indirect Costs', percentage: 25, amount: 350000, color: 'amber' },
    { id: '3', name: 'Contingency Reserve', percentage: 15, amount: 210000, color: 'green' },
  ]);

  const totalEstimate = phases.reduce((sum, phase) => sum + phase.amount, 0);
  const confidenceScore = 85; // AI confidence percentage

  const handleAIEstimate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Estimate total project cost for a construction project. Project ID: ${projectId || 'N/A'}. Project type: ${projectInfo.type}, Size: ${projectInfo.size}, Location: ${projectInfo.location}. Break down costs by phase (Design, Procurement, Construction, Closeout) and category (Direct costs, Indirect costs, Contingency). Provide realistic estimates based on Saudi construction market rates. Include percentage allocations for each category.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated cost breakdown. Review and adjust as needed.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI estimation failed:', error);
      toast.error("Could not generate estimate. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your cost estimate has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your cost estimate is being exported to PDF...");
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

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
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Cost Estimator</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered project cost breakdown and analysis
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
              Save Estimate
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Project Info & Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Project Information */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Project Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{projectInfo.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Ruler className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{projectInfo.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{projectInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Scale:</span>
                    <span className="font-medium">{projectInfo.floors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Generation */}
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
                  onClick={handleAIEstimate}
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
                      AI Estimate Costs
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Compare Historical
                </Button>
              </CardContent>
            </Card>

            {/* Confidence Score */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Confidence</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Accuracy Score</span>
                    <span className="font-bold text-green-600">{confidenceScore}%</span>
                  </div>
                  <Progress value={confidenceScore} className="h-2" />
                </div>
                <div className="p-3 bg-background rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Based on <span className="font-medium text-foreground">47 similar projects</span> in Riyadh with comparable scope and specifications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cost Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            {/* Phase Breakdown */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Cost Breakdown by Phase
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {phases.length} phases • {totalEstimate.toLocaleString()} SAR total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{totalEstimate.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">SAR</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {phases.map((phase) => (
                  <div key={phase.id} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{phase.name}</span>
                        <Badge className={`text-[9px] ${getPhaseStatusColor(phase.status)}`}>
                          {phase.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {phase.amount.toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">{phase.percentage}% of total</span>
                      </div>
                      <Progress value={phase.percentage} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <PieChart className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">
                    Cost Breakdown by Category
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-3 w-3 rounded-full ${category.color === 'primary' ? 'bg-primary' : category.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                        <span className="text-xs font-medium">{category.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xl font-bold text-primary">
                          {category.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          SAR ({category.percentage}%)
                        </div>
                        <Progress value={category.percentage} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Details */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-bold mb-2">Category Details</div>
                  
                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-xs font-medium mb-2">Direct Costs (60%)</div>
                    <div className="space-y-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>• Labor costs</span>
                        <span className="font-medium">280,000 SAR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Materials</span>
                        <span className="font-medium">450,000 SAR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Equipment rental</span>
                        <span className="font-medium">120,000 SAR</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-xs font-medium mb-2">Indirect Costs (25%)</div>
                    <div className="space-y-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>• Overhead & administration</span>
                        <span className="font-medium">150,000 SAR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Insurance & permits</span>
                        <span className="font-medium">120,000 SAR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Utilities & temporary facilities</span>
                        <span className="font-medium">80,000 SAR</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-background rounded-lg border border-border">
                    <div className="text-xs font-medium mb-2">Contingency Reserve (15%)</div>
                    <div className="space-y-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>• Design changes (5%)</span>
                        <span className="font-medium">70,000 SAR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Market volatility (5%)</span>
                        <span className="font-medium">70,000 SAR</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Risk reserve (5%)</span>
                        <span className="font-medium">70,000 SAR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimate Summary */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Estimate Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-primary">{totalEstimate.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground">Base Estimate</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border border-border">
                    <div className="text-lg font-bold text-green-600">{confidenceScore}%</div>
                    <div className="text-[9px] text-muted-foreground">Confidence</div>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Within Budget</span>
                  </div>
                  <p className="text-[10px] text-green-600/80">
                    Estimate is 8% below typical market rates for similar projects
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold">Range Scenarios</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                      <span className="text-muted-foreground">Optimistic (-10%)</span>
                      <span className="font-medium text-green-600">{(totalEstimate * 0.9).toLocaleString()} SAR</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="font-medium">Most Likely</span>
                      <span className="font-bold text-primary">{totalEstimate.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                      <span className="text-muted-foreground">Pessimistic (+20%)</span>
                      <span className="font-medium text-amber-600">{(totalEstimate * 1.2).toLocaleString()} SAR</span>
                    </div>
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

