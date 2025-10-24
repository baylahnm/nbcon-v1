import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectParamSync } from '../hooks/useProjectParamSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import {
  Users,
  ChevronLeft,
  Loader2,
  Briefcase,
  ArrowLeft,
  Layers,
  Building2,
  Mail,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useStakeholderStore } from '../stores/useStakeholderStore';

export default function StakeholderMapperTool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sync URL ?project=<id> ↔ store (bidirectional)
  useProjectParamSync();
  
  // Get selected project from unified store
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // Get stakeholders from stakeholder store
  const { 
    stakeholders, 
    loadStakeholders, 
    isLoading,
    getByQuadrant
  } = useStakeholderStore();

  // Load stakeholders when project selected
  useEffect(() => {
    if (project?.id) {
      loadStakeholders(project.id);
    }
  }, [project?.id, loadStakeholders]);

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
                Please select or create a project to use the Stakeholder Mapper
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

  // Get stakeholders by quadrant
  const manageClosely = getByQuadrant('high', 'high');
  const keepSatisfied = getByQuadrant('high', 'low');
  const keepInformed = getByQuadrant('low', 'high');
  const monitor = getByQuadrant('low', 'low');

  // Calculate statistics
  const totalStakeholders = stakeholders.length;
  const withStrategy = stakeholders.filter(s => s.engagement_strategy).length;

  // Render stakeholder card
  const renderStakeholder = (stakeholder: typeof stakeholders[0]) => (
    <Card key={stakeholder.id} className="border-border/50 hover:shadow-sm transition-all">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">{stakeholder.name}</h4>
            {stakeholder.role && (
              <p className="text-xs text-muted-foreground truncate">{stakeholder.role}</p>
            )}
          </div>
        </div>
        
        {stakeholder.organization && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{stakeholder.organization}</span>
          </div>
        )}

        {stakeholder.engagement_strategy && (
          <div className="pt-2 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground mb-1">Strategy:</p>
            <p className="text-xs line-clamp-2">{stakeholder.engagement_strategy}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold tracking-tight">
                {project.name} - Stakeholders
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Map and manage project stakeholders
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
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{totalStakeholders}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg ring-1 ring-red-500/20">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{manageClosely.length}</p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg ring-1 ring-green-500/20">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{withStrategy}</p>
                  <p className="text-xs text-muted-foreground">With Strategy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg ring-1 ring-blue-500/20">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {new Set(stakeholders.map(s => s.organization).filter(Boolean)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">Organizations</p>
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
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && stakeholders.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">No Stakeholders Yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Identify and map your project stakeholders
                </p>
              </div>
            )}

            {/* 2x2 Matrix */}
            {!isLoading && stakeholders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Manage Closely (High Power, High Interest) */}
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardHeader className="p-3 border-b border-red-500/20">
                    <CardTitle className="text-sm font-bold text-red-600">
                      Manage Closely
                      <Badge className="ml-2 text-[9px] bg-red-500/10">
                        {manageClosely.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">High Power • High Interest</p>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {manageClosely.map(renderStakeholder)}
                    {manageClosely.length === 0 && (
                      <p className="text-xs text-center text-muted-foreground py-4">No stakeholders</p>
                    )}
                  </CardContent>
                </Card>

                {/* Keep Satisfied (High Power, Low Interest) */}
                <Card className="bg-amber-500/5 border-amber-500/20">
                  <CardHeader className="p-3 border-b border-amber-500/20">
                    <CardTitle className="text-sm font-bold text-amber-600">
                      Keep Satisfied
                      <Badge className="ml-2 text-[9px] bg-amber-500/10">
                        {keepSatisfied.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">High Power • Low Interest</p>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {keepSatisfied.map(renderStakeholder)}
                    {keepSatisfied.length === 0 && (
                      <p className="text-xs text-center text-muted-foreground py-4">No stakeholders</p>
                    )}
                  </CardContent>
                </Card>

                {/* Keep Informed (Low Power, High Interest) */}
                <Card className="bg-blue-500/5 border-blue-500/20">
                  <CardHeader className="p-3 border-b border-blue-500/20">
                    <CardTitle className="text-sm font-bold text-blue-600">
                      Keep Informed
                      <Badge className="ml-2 text-[9px] bg-blue-500/10">
                        {keepInformed.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Low Power • High Interest</p>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {keepInformed.map(renderStakeholder)}
                    {keepInformed.length === 0 && (
                      <p className="text-xs text-center text-muted-foreground py-4">No stakeholders</p>
                    )}
                  </CardContent>
                </Card>

                {/* Monitor (Low Power, Low Interest) */}
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardHeader className="p-3 border-b border-green-500/20">
                    <CardTitle className="text-sm font-bold text-green-600">
                      Monitor
                      <Badge className="ml-2 text-[9px] bg-green-500/10">
                        {monitor.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Low Power • Low Interest</p>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {monitor.map(renderStakeholder)}
                    {monitor.length === 0 && (
                      <p className="text-xs text-center text-muted-foreground py-4">No stakeholders</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Helper Text */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">💡 Stakeholder Matrix</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>Manage Closely:</strong> High engagement, regular updates, involve in decisions</li>
                  <li><strong>Keep Satisfied:</strong> Meet needs, inform of major changes</li>
                  <li><strong>Keep Informed:</strong> Regular communication, address concerns</li>
                  <li><strong>Monitor:</strong> Periodic updates, minimal effort</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
