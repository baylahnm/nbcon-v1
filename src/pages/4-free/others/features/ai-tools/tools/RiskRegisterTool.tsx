import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectParamSync } from '../hooks/useProjectParamSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import {
  Shield,
  ChevronLeft,
  Loader2,
  Briefcase,
  ArrowLeft,
  Layers,
  AlertTriangle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useRiskStore } from '../stores/useRiskStore';

export default function RiskRegisterTool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sync URL ?project=<id> ↔ store (bidirectional)
  useProjectParamSync();
  
  // Get selected project from unified store
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // Get risks from risk store
  const { 
    risks, 
    loadRisks, 
    isLoading,
    getHighRisks 
  } = useRiskStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load risks when project selected
  useEffect(() => {
    if (project?.id) {
      loadRisks(project.id);
    }
  }, [project?.id, loadRisks]);

  // Empty state when no project selected
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/free/ai-tools/planning')}
            className="mb-4 h-9"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to Planning Hub
          </Button>
          
          <Card className="border-border/50 mt-8">
            <CardContent className="p-12 text-center">
              <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">No Project Selected</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please select or create a project to use the Risk Register
              </p>
              <Button onClick={() => navigate('/free/ai-tools/planning')}>
                <Layers className="h-4 w-4 mr-2" />
                Select Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter risks by category
  const filteredRisks = selectedCategory === 'all' 
    ? risks 
    : risks.filter(r => r.category === selectedCategory);

  // Calculate statistics
  const highRisks = getHighRisks();
  const avgRiskScore = risks.length > 0 
    ? Math.round(risks.reduce((sum, r) => sum + r.risk_score, 0) / risks.length) 
    : 0;

  // Category colors
  const categoryColors: Record<string, string> = {
    schedule: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    cost: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    quality: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    safety: 'bg-red-500/10 text-red-600 border-red-500/20',
    regulatory: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    resource: 'bg-green-500/10 text-green-600 border-green-500/20',
    technical: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    external: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  };

  // Risk level by score
  const getRiskLevel = (score: number) => {
    if (score >= 20) return { label: 'Critical', color: 'bg-red-500/10 text-red-600' };
    if (score >= 15) return { label: 'High', color: 'bg-orange-500/10 text-orange-600' };
    if (score >= 10) return { label: 'Medium', color: 'bg-amber-500/10 text-amber-600' };
    return { label: 'Low', color: 'bg-green-500/10 text-green-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 shrink-0"
              onClick={() => navigate('/free/ai-tools/planning')}
              aria-label="Back to Planning Hub"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold tracking-tight">
                {project.name} - Risk Register
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Identify, assess, and mitigate project risks
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{risks.length}</p>
                  <p className="text-xs text-muted-foreground">Total Risks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{highRisks.length}</p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg ring-1 ring-green-500/20">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {risks.filter(r => r.mitigation_strategy).length}
                  </p>
                  <p className="text-xs text-muted-foreground">With Mitigation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg ring-1 ring-blue-500/20">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{avgRiskScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Filter:</span>
          {['all', 'schedule', 'cost', 'quality', 'safety', 'regulatory', 'resource', 'technical', 'external'].map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="h-7 text-xs capitalize"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Risk List */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight">Risk Register</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredRisks.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">
                  {selectedCategory === 'all' ? 'No Risks Identified' : `No ${selectedCategory} Risks`}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Start identifying and assessing potential project risks
                </p>
              </div>
            )}

            {/* Risk Cards */}
            {!isLoading && filteredRisks.map((risk) => {
              const riskLevel = getRiskLevel(risk.risk_score);
              
              return (
                <Card key={risk.id} className="border-border/50 hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold">{risk.title}</h3>
                          <Badge variant="outline" className={`text-[9px] ${categoryColors[risk.category]}`}>
                            {risk.category}
                          </Badge>
                        </div>
                        {risk.description && (
                          <p className="text-xs text-muted-foreground">{risk.description}</p>
                        )}
                      </div>
                      <Badge className={`text-[10px] shrink-0 ${riskLevel.color}`}>
                        {riskLevel.label} ({risk.risk_score})
                      </Badge>
                    </div>

                    {/* Risk Matrix */}
                    <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Probability:</span>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className={`h-2 w-full rounded ${
                                i <= risk.probability ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact:</span>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className={`h-2 w-full rounded ${
                                i <= risk.impact ? 'bg-red-500' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mitigation */}
                    {risk.mitigation_strategy && (
                      <div className="pt-3 border-t border-border/40">
                        <p className="text-xs font-medium mb-1">Mitigation Strategy:</p>
                        <p className="text-xs text-muted-foreground">{risk.mitigation_strategy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Helper Text */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 shrink-0">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">💡 Risk Matrix Guide</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Critical (20-25): Immediate action required</li>
                  <li>High (15-19): Requires management attention</li>
                  <li>Medium (10-14): Monitor and prepare response</li>
                  <li>Low (1-9): Accept or track</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
