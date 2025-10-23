import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { 
  AlertTriangle, 
  Sparkles, 
  Save, 
  Download, 
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';

interface Risk {
  id: string;
  title: string;
  category: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  mitigation: string;
  owner?: string;
}

export default function RiskRegisterTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: '1',
      title: 'Weather delays during construction',
      category: 'Schedule',
      probability: 4,
      impact: 3,
      mitigation: 'Build weather buffer into schedule, prepare indoor work alternatives',
      owner: 'Project Manager'
    },
    {
      id: '2',
      title: 'Material cost escalation',
      category: 'Cost',
      probability: 3,
      impact: 4,
      mitigation: 'Lock in prices with suppliers, establish contingency budget',
      owner: 'Procurement Manager'
    },
    {
      id: '3',
      title: 'Permit approval delays',
      category: 'Regulatory',
      probability: 3,
      impact: 3,
      mitigation: 'Early engagement with authorities, submit complete documentation',
      owner: 'Compliance Officer'
    },
    {
      id: '4',
      title: 'Labor shortage',
      category: 'Resource',
      probability: 2,
      impact: 4,
      mitigation: 'Pre-qualify contractors, maintain backup resource pool',
      owner: 'HR Manager'
    },
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Identify potential risks for a construction project. Project ID: ${projectId || 'N/A'}. For each risk, provide: title, category (Schedule/Cost/Quality/Safety/Regulatory/Resource), probability (1-5), impact (1-5), and mitigation strategy. Focus on typical construction project risks in Saudi Arabia including weather, permits, labor, materials, etc.`;
      await sendMessage(prompt);
      setIsGenerating(false);
      // Note: In production, parse AI response and update risks state
    } catch (error) {
      console.error('AI generation failed:', error);
      setIsGenerating(false);
    }
  };

  const getRiskScore = (probability: number, impact: number) => probability * impact;
  
  const getRiskLevel = (score: number) => {
    if (score >= 15) return { label: 'Critical', opacity: '/15' };
    if (score >= 9) return { label: 'High', opacity: '/12' };
    if (score >= 5) return { label: 'Medium', opacity: '/10' };
    return { label: 'Low', opacity: '/8' };
  };

  const highRisks = risks.filter(r => getRiskScore(r.probability, r.impact) >= 15);
  const mediumRisks = risks.filter(r => {
    const score = getRiskScore(r.probability, r.impact);
    return score >= 5 && score < 15;
  });
  const lowRisks = risks.filter(r => getRiskScore(r.probability, r.impact) < 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/ai-tools/planning')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Risk Register
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Identify and track project risks with heat map
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
            <Button size="sm" className="h-8 text-xs shadow-md" onClick={handleAIGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  AI Identify Risks
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{risks.length}</p>
                  <p className="text-xs text-muted-foreground">Total Risks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{highRisks.length}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{mediumRisks.length}</p>
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{lowRisks.length}</p>
                  <p className="text-xs text-muted-foreground">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Heat Map */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight">Risk Heat Map</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-1">
                <div className="text-xs text-muted-foreground text-center p-2"></div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="text-xs text-muted-foreground text-center p-2 font-medium">
                    {i}
                  </div>
                ))}
              </div>
              
              {[5, 4, 3, 2, 1].map(probability => (
                <div key={probability} className="grid grid-cols-6 gap-1">
                  <div className="text-xs text-muted-foreground text-center p-2 font-medium flex items-center justify-center">
                    {probability}
                  </div>
                  {[1, 2, 3, 4, 5].map(impact => {
                    const score = probability * impact;
                    const level = getRiskLevel(score);
                    const cellRisks = risks.filter(r => r.probability === probability && r.impact === impact);
                    
                    return (
                      <div 
                        key={impact}
                        className={`p-3 rounded-lg border border-border text-center hover:shadow-md transition-all cursor-pointer bg-primary${level.opacity}`}
                      >
                        <div className="text-xs font-bold text-primary">{score}</div>
                        {cellRisks.length > 0 && (
                          <div className="text-[9px] text-muted-foreground mt-1">{cellRisks.length} risk{cellRisks.length > 1 ? 's' : ''}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">← Low Impact</span>
                <span className="font-medium">Probability (↑) × Impact (→)</span>
                <span className="text-muted-foreground">High Impact →</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk List */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold tracking-tight">Risk Register</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-[120px] border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Risk
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {risks.map((risk) => {
                const score = getRiskScore(risk.probability, risk.impact);
                const level = getRiskLevel(score);
                
                return (
                  <div key={risk.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md shrink-0">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-bold">{risk.title}</h3>
                            <Badge variant="outline" className={`text-[9px] bg-primary${level.opacity} text-primary border-primary/20`}>
                              {level.label} Risk
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                              {risk.category}
                            </Badge>
                            <Badge variant="outline" className="text-[9px]">
                              P: {risk.probability} × I: {risk.impact} = Score: {score}
                            </Badge>
                          </div>
                          
                          <div className="p-3 bg-muted/30 rounded-lg border border-border/40 mb-2">
                            <p className="text-[10px] text-muted-foreground mb-1">Mitigation Strategy</p>
                            <p className="text-xs">{risk.mitigation}</p>
                          </div>
                          
                          {risk.owner && (
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-muted-foreground">Owner:</p>
                              <p className="text-xs font-medium">{risk.owner}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Empty State */}
            {risks.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20 shadow-md w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">No risks identified yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Use AI to identify potential project risks
                </p>
                <Button className="h-8 text-xs shadow-md" onClick={handleAIGenerate}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate with AI
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}

