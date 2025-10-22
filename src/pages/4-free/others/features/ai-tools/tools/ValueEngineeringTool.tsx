import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import {
  Zap,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Star,
  Loader2,
  Package,
  DollarSign,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface Alternative {
  id: string;
  title: string;
  currentCost: number;
  alternativeCost: number;
  savings: number;
  savingsPercent: number;
  qualityRating: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'approve' | 'consider' | 'reject';
  benefits: string[];
}

export default function ValueEngineeringTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample alternatives
  const [alternatives] = useState<Alternative[]>([
    {
      id: '1',
      title: 'Floor Slab: Grade 50 vs Grade 60 Concrete',
      currentCost: 1125000,
      alternativeCost: 950000,
      savings: 175000,
      savingsPercent: 15.6,
      qualityRating: 4,
      riskLevel: 'low',
      recommendation: 'approve',
      benefits: ['Suitable for non-structural elements', 'Meets code requirements', '3-day faster curing time'],
    },
    {
      id: '2',
      title: 'Facade: Precast Panels vs Cast-in-place',
      currentCost: 850000,
      alternativeCost: 750000,
      savings: 100000,
      savingsPercent: 11.8,
      qualityRating: 4,
      riskLevel: 'low',
      recommendation: 'approve',
      benefits: ['Faster installation (2 weeks saved)', 'Better quality control', 'Weather independent'],
    },
    {
      id: '3',
      title: 'Flooring: Ceramic vs Porcelain Tiles',
      currentCost: 280000,
      alternativeCost: 320000,
      savings: -40000,
      savingsPercent: -14.3,
      qualityRating: 5,
      riskLevel: 'medium',
      recommendation: 'consider',
      benefits: ['Higher durability', 'Lower maintenance', 'Premium appearance'],
    },
  ]);

  const handleAISuggest = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Suggest value engineering opportunities for a construction project. Project ID: ${projectId || 'N/A'}. Identify alternative materials, methods, or designs that reduce costs while maintaining quality. For each alternative, provide: current specification, alternative option, cost comparison, savings calculation, quality impact assessment (1-5 stars), risk level (low/medium/high), and recommendation (approve/consider/reject). Focus on Saudi construction materials and methods with realistic market prices.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has suggested value engineering alternatives. Review options below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate alternatives. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your value engineering analysis has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your value engineering report is being exported to PDF...");
  };

  const totalSavings = alternatives.reduce((sum, alt) => sum + alt.savings, 0);
  const approvedSavings = alternatives
    .filter(alt => alt.recommendation === 'approve')
    .reduce((sum, alt) => sum + alt.savings, 0);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'approve':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'consider':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'reject':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
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
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Value Engineering</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered cost optimization and alternatives
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
              Save Analysis
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

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Total Savings Found</div>
                  <div className="text-lg font-bold text-primary">{totalSavings.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR ({((totalSavings / 2255000) * 100).toFixed(1)}%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-xl ring-1 ring-green-500/20 shadow-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Approved Savings</div>
                  <div className="text-lg font-bold text-green-600">{approvedSavings.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR (pending)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Alternatives</div>
                  <div className="text-lg font-bold text-primary">{alternatives.length}</div>
                  <div className="text-[9px] text-muted-foreground">Options analyzed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Actions */}
          <div className="lg:col-span-1">
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
                  onClick={handleAISuggest}
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
                      AI Suggest Alternatives
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Manual Option
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Alternatives List */}
          <div className="lg:col-span-3">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Value Engineering Opportunities
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alternatives.length} alternatives • {totalSavings.toLocaleString()} SAR potential savings
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {alternatives.map((alt) => (
                  <Card key={alt.id} className="border-border/50">
                    <CardHeader className="p-4 border-b border-border/40">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold mb-2">{alt.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`text-[9px] ${getRecommendationColor(alt.recommendation)}`}>
                              {alt.recommendation === 'approve' ? '✓ Recommended' : alt.recommendation === 'consider' ? '⏸ Consider' : '✗ Not Recommended'}
                            </Badge>
                            <Badge className={`text-[9px] ${getRiskColor(alt.riskLevel)}`}>
                              Risk: {alt.riskLevel}
                            </Badge>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < alt.qualityRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {/* Cost Comparison */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-background rounded-lg border border-border text-center">
                          <div className="text-[9px] text-muted-foreground mb-1">Current Cost</div>
                          <div className="text-sm font-bold">{alt.currentCost.toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground">SAR</div>
                        </div>
                        <div className="p-3 bg-background rounded-lg border border-border text-center">
                          <div className="text-[9px] text-muted-foreground mb-1">Alternative Cost</div>
                          <div className="text-sm font-bold text-primary">{alt.alternativeCost.toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground">SAR</div>
                        </div>
                        <div className={`p-3 rounded-lg border text-center ${alt.savings >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                          <div className="text-[9px] text-muted-foreground mb-1">Savings</div>
                          <div className={`text-sm font-bold ${alt.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {alt.savings >= 0 ? '-' : '+'}{Math.abs(alt.savings).toLocaleString()}
                          </div>
                          <div className={`text-[9px] ${alt.savings >= 0 ? 'text-green-600/80' : 'text-red-600/80'}`}>
                            ({alt.savings >= 0 ? '-' : '+'}{Math.abs(alt.savingsPercent).toFixed(1)}%)
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold">Benefits & Impacts</div>
                        <div className="space-y-1">
                          {alt.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          Cost-Benefit
                        </Button>
                        {alt.recommendation === 'approve' && (
                          <Button size="sm" className="flex-1 h-8 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

