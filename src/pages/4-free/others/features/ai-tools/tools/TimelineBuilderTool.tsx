import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Save, 
  Download, 
  ChevronLeft,
  Plus,
  Clock,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';

interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: number; // days
  progress: number; // 0-100
  isCriticalPath: boolean;
  dependencies?: string[];
}

export default function TimelineBuilderTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Project Initiation',
      startDate: '2025-11-01',
      endDate: '2025-11-14',
      duration: 14,
      progress: 100,
      isCriticalPath: true,
    },
    {
      id: '2',
      title: 'Planning Phase',
      startDate: '2025-11-15',
      endDate: '2025-12-12',
      duration: 28,
      progress: 65,
      isCriticalPath: true,
      dependencies: ['1']
    },
    {
      id: '3',
      title: 'Design & Engineering',
      startDate: '2025-12-13',
      endDate: '2026-01-23',
      duration: 42,
      progress: 15,
      isCriticalPath: true,
      dependencies: ['2']
    },
    {
      id: '4',
      title: 'Procurement',
      startDate: '2025-12-20',
      endDate: '2026-01-17',
      duration: 28,
      progress: 0,
      isCriticalPath: false,
      dependencies: ['2']
    },
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a project timeline and schedule for a construction project. Project ID: ${projectId || 'N/A'}. Create a Gantt chart with tasks including: start date, end date, duration, dependencies, and identify the critical path. Format for Saudi construction projects with realistic timelines and milestones.`;
      await sendMessage(prompt);
      setIsGenerating(false);
      // Note: In production, parse AI response and update tasks state
    } catch (error) {
      console.error('AI generation failed:', error);
      setIsGenerating(false);
    }
  };

  const criticalPathTasks = tasks.filter(t => t.isCriticalPath);
  const totalDuration = Math.max(...tasks.map(t => new Date(t.endDate).getTime())) - 
                       Math.min(...tasks.map(t => new Date(t.startDate).getTime()));
  const daysRemaining = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));

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
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Timeline Builder
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Visual Gantt chart with critical path analysis
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
                  AI Generate Timeline
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
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{tasks.length}</p>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
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
                  <p className="text-xl font-bold tracking-tight">{criticalPathTasks.length}</p>
                  <p className="text-xs text-muted-foreground">Critical Path</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{daysRemaining}</p>
                  <p className="text-xs text-muted-foreground">Days Duration</p>
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
                  <p className="text-xl font-bold tracking-tight">3</p>
                  <p className="text-xs text-muted-foreground">Milestones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gantt Chart Visualization */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold tracking-tight">Gantt Chart</CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold">{task.title}</h3>
                        {task.isCriticalPath && (
                          <Badge variant="outline" className="text-[9px] bg-primary/15 text-primary border-primary/25">
                            Critical Path
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{task.startDate}</span>
                        <span>→</span>
                        <span>{task.endDate}</span>
                        <span className="font-medium">({task.duration} days)</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{task.progress}%</p>
                      <p className="text-[10px] text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <Progress value={task.progress} className="h-2" />
                    <div className="flex justify-between text-[9px] text-muted-foreground">
                      <span>Start: {task.startDate}</span>
                      <span>End: {task.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}

