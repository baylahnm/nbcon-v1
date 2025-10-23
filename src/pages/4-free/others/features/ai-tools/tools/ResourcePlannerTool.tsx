import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Avatar, AvatarFallback } from '@/pages/1-HomePage/others/components/ui/avatar';
import { 
  Target, 
  Sparkles, 
  Save, 
  Download, 
  ChevronLeft,
  Plus,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';

interface Resource {
  id: string;
  name: string;
  role: string;
  skills: string[];
  utilization: number; // 0-100
  assignedTasks: number;
  availability: 'available' | 'partial' | 'unavailable';
}

export default function ResourcePlannerTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      role: 'Structural Engineer',
      skills: ['Structural Design', 'AutoCAD', 'SAP2000'],
      utilization: 85,
      assignedTasks: 6,
      availability: 'partial'
    },
    {
      id: '2',
      name: 'Noura Al-Saud',
      role: 'Project Manager',
      skills: ['PM', 'Scheduling', 'Risk Management'],
      utilization: 95,
      assignedTasks: 8,
      availability: 'unavailable'
    },
    {
      id: '3',
      name: 'Fatima Al-Zahra',
      role: 'Electrical Engineer',
      skills: ['Electrical Design', 'Power Systems'],
      utilization: 60,
      assignedTasks: 4,
      availability: 'available'
    },
    {
      id: '4',
      name: 'Khalid Al-Mansouri',
      role: 'Mechanical Engineer',
      skills: ['HVAC', 'MEP', 'Revit'],
      utilization: 40,
      assignedTasks: 3,
      availability: 'available'
    },
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Optimize resource allocation for a construction project. Project ID: ${projectId || 'N/A'}. Suggest team member assignments based on skills, workload, and task requirements. Include: resource names, roles, skills, current utilization (%), assigned tasks, and identify over-allocated resources. Focus on typical construction team roles (engineers, managers, technicians) in Saudi Arabia.`;
      await sendMessage(prompt);
      setIsGenerating(false);
      // Note: In production, parse AI response and update resources state
    } catch (error) {
      console.error('AI generation failed:', error);
      setIsGenerating(false);
    }
  };

  const availableResources = resources.filter(r => r.availability === 'available');
  const overAllocated = resources.filter(r => r.utilization > 80);
  const avgUtilization = Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-primary/15 text-primary border-primary/25';
      case 'partial': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'unavailable': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
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
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Resource Planner
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Optimize team allocation and workload distribution
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
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  AI Optimize Allocation
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
                  <p className="text-xl font-bold tracking-tight">{resources.length}</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
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
                  <p className="text-xl font-bold tracking-tight">{avgUtilization}%</p>
                  <p className="text-xs text-muted-foreground">Avg Utilization</p>
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
                  <p className="text-xl font-bold tracking-tight">{availableResources.length}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <AlertCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{overAllocated.length}</p>
                  <p className="text-xs text-muted-foreground">Over-Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Allocation Grid */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold tracking-tight">Team Resources</CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Resource
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {resource.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-sm font-bold">{resource.name}</h3>
                          <p className="text-xs text-muted-foreground">{resource.role}</p>
                        </div>
                        <Badge variant="outline" className={`text-[9px] ${getAvailabilityColor(resource.availability)}`}>
                          {resource.availability.charAt(0).toUpperCase() + resource.availability.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Workload Utilization</span>
                          <span className="font-bold text-primary">{resource.utilization}%</span>
                        </div>
                        <Progress 
                          value={resource.utilization} 
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{resource.assignedTasks} tasks assigned</span>
                          {resource.utilization > 80 && (
                            <span className="text-amber-600 font-medium">⚠ Over-allocated</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {resources.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20 shadow-md w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">No resources yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Use AI to optimize resource allocation
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

