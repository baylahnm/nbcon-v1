import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { 
  Users, 
  Sparkles, 
  Save, 
  Download, 
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  power: 'high' | 'low';
  interest: 'high' | 'low';
  engagementStrategy: string;
}

export default function StakeholderMapperTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: '1',
      name: 'Project Sponsor',
      role: 'Executive Stakeholder',
      power: 'high',
      interest: 'high',
      engagementStrategy: 'Closely manage - regular updates, decision involvement'
    },
    {
      id: '2',
      name: 'Construction Manager',
      role: 'Key Stakeholder',
      power: 'high',
      interest: 'high',
      engagementStrategy: 'Closely manage - daily coordination, resource allocation'
    },
    {
      id: '3',
      name: 'Local Community',
      role: 'Affected Party',
      power: 'low',
      interest: 'high',
      engagementStrategy: 'Keep informed - monthly updates, address concerns'
    },
    {
      id: '4',
      name: 'Regulatory Authority',
      role: 'Compliance Stakeholder',
      power: 'high',
      interest: 'low',
      engagementStrategy: 'Keep satisfied - ensure compliance, minimal engagement'
    },
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Identify and analyze key stakeholders for a construction project. Project ID: ${projectId || 'N/A'}. For each stakeholder, provide: name, role, power level (high/low), interest level (high/low), and engagement strategy. Focus on Saudi construction projects with typical stakeholders like project sponsors, regulatory authorities, contractors, local community, etc.`;
      await sendMessage(prompt);
      setIsGenerating(false);
      // Note: In production, parse AI response and update stakeholders state
    } catch (error) {
      console.error('AI generation failed:', error);
      setIsGenerating(false);
    }
  };

  const getMatrixQuadrant = (power: string, interest: string) => {
    if (power === 'high' && interest === 'high') return 'Closely Manage';
    if (power === 'high' && interest === 'low') return 'Keep Satisfied';
    if (power === 'low' && interest === 'high') return 'Keep Informed';
    return 'Monitor';
  };

  const getStakeholdersByQuadrant = (power: string, interest: string) => {
    return stakeholders.filter(s => s.power === power && s.interest === interest);
  };

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
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Stakeholder Mapper
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Map stakeholders with power/interest matrix
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
                  AI Identify Stakeholders
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
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{stakeholders.length}</p>
                  <p className="text-xs text-muted-foreground">Stakeholders</p>
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
                  <p className="text-xl font-bold tracking-tight">{getStakeholdersByQuadrant('high', 'high').length}</p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">
                    {stakeholders.filter(s => s.engagementStrategy).length}
                  </p>
                  <p className="text-xs text-muted-foreground">With Strategy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">4</p>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Power/Interest Matrix */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight">Power/Interest Matrix</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              
              {/* High Power / High Interest */}
              <div className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold">Closely Manage</h3>
                    <p className="text-[10px] text-muted-foreground">High Power • High Interest</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-primary/15 text-primary border-primary/25">
                    {getStakeholdersByQuadrant('high', 'high').length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {getStakeholdersByQuadrant('high', 'high').map((stakeholder) => (
                    <div key={stakeholder.id} className="p-3 bg-muted/30 rounded-lg border border-border/40">
                      <p className="text-xs font-semibold">{stakeholder.name}</p>
                      <p className="text-[10px] text-muted-foreground">{stakeholder.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Power / Low Interest */}
              <div className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold">Keep Satisfied</h3>
                    <p className="text-[10px] text-muted-foreground">High Power • Low Interest</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                    {getStakeholdersByQuadrant('high', 'low').length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {getStakeholdersByQuadrant('high', 'low').map((stakeholder) => (
                    <div key={stakeholder.id} className="p-3 bg-muted/30 rounded-lg border border-border/40">
                      <p className="text-xs font-semibold">{stakeholder.name}</p>
                      <p className="text-[10px] text-muted-foreground">{stakeholder.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Power / High Interest */}
              <div className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold">Keep Informed</h3>
                    <p className="text-[10px] text-muted-foreground">Low Power • High Interest</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                    {getStakeholdersByQuadrant('low', 'high').length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {getStakeholdersByQuadrant('low', 'high').map((stakeholder) => (
                    <div key={stakeholder.id} className="p-3 bg-muted/30 rounded-lg border border-border/40">
                      <p className="text-xs font-semibold">{stakeholder.name}</p>
                      <p className="text-[10px] text-muted-foreground">{stakeholder.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Power / Low Interest */}
              <div className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold">Monitor</h3>
                    <p className="text-[10px] text-muted-foreground">Low Power • Low Interest</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                    {getStakeholdersByQuadrant('low', 'low').length}
                  </Badge>
                </div>
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground">No stakeholders in this quadrant</p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Stakeholder List */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold tracking-tight">All Stakeholders</CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Stakeholder
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md shrink-0">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold mb-1">{stakeholder.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{stakeholder.role}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-[9px] ${
                            stakeholder.power === 'high' 
                              ? 'bg-primary/15 text-primary border-primary/25' 
                              : 'bg-primary/10 text-primary border-primary/20'
                          }`}>
                            {stakeholder.power === 'high' ? 'High Power' : 'Low Power'}
                          </Badge>
                          <Badge variant="outline" className={`text-[9px] ${
                            stakeholder.interest === 'high' 
                              ? 'bg-primary/15 text-primary border-primary/25' 
                              : 'bg-primary/10 text-primary border-primary/20'
                          }`}>
                            {stakeholder.interest === 'high' ? 'High Interest' : 'Low Interest'}
                          </Badge>
                        </div>
                        
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                          <p className="text-[10px] text-muted-foreground mb-1">Engagement Strategy</p>
                          <p className="text-xs">{stakeholder.engagementStrategy}</p>
                        </div>
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
              ))}
            </div>
            
            {/* AI Generation Prompt */}
            {stakeholders.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20 shadow-md w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">No stakeholders yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Use AI to identify stakeholders or add manually
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

