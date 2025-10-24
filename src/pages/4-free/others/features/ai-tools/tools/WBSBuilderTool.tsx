import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectParamSync } from '../hooks/useProjectParamSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { 
  Network, 
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Briefcase,
  ArrowLeft,
  Layers,
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useGanttStore } from '../stores/useGanttStore';

interface WBSNode {
  id: string;
  title: string;
  level: number;
  duration?: number;
  status?: 'not-started' | 'in-progress' | 'completed';
  children: WBSNode[];
  parent_id: string | null;
}

export default function WBSBuilderTool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sync URL ?project=<id> ↔ store (bidirectional)
  useProjectParamSync();
  
  // Get selected project from unified store
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // Get tasks from Gantt store (WBS uses task hierarchy)
  const { tasks, loadProjectTasks } = useGanttStore();
  const isLoading = false; // TODO: Add loading state to Gantt store
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Load tasks when project selected
  useEffect(() => {
    if (project?.id) {
      loadProjectTasks(project.id);
    }
  }, [project?.id, loadProjectTasks]);

  // Empty state when no project selected
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/free/ai-tools/planning')}
            className="mb-4 h-8 text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Planning Hub
          </Button>
          
          <Card className="border-border/50 mt-8">
            <CardContent className="p-12 text-center">
              <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">No Project Selected</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please select or create a project to use the WBS Builder
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

  // Build hierarchical tree from flat task list
  const buildWBSTree = (): WBSNode[] => {
    const taskMap = new Map<string, WBSNode>();
    const roots: WBSNode[] = [];

    // Create node map
    tasks.forEach(task => {
      taskMap.set(task.id, {
        id: task.id,
        title: task.title,
        level: 0, // Will calculate
        duration: task.duration,
        status: task.progress === 100 ? 'completed' : task.progress > 0 ? 'in-progress' : 'not-started',
        children: [],
        parent_id: task.parent_id
      });
    });

    // Build tree structure
    taskMap.forEach(node => {
      if (node.parent_id && taskMap.has(node.parent_id)) {
        const parent = taskMap.get(node.parent_id)!;
        parent.children.push(node);
        node.level = parent.level + 1;
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const wbsTree = buildWBSTree();

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Calculate statistics
  const countNodes = (nodes: WBSNode[]): number => {
    return nodes.reduce((count, node) => {
      return count + 1 + countNodes(node.children);
    }, 0);
  };

  const getMaxLevel = (nodes: WBSNode[], currentMax = 0): number => {
    return nodes.reduce((max, node) => {
      const nodeMax = node.children.length > 0 
        ? getMaxLevel(node.children, node.level + 1)
        : node.level;
      return Math.max(max, nodeMax);
    }, currentMax);
  };

  const totalNodes = countNodes(wbsTree);
  const maxLevels = getMaxLevel(wbsTree) + 1;
  const completedNodes = tasks.filter(t => t.progress === 100).length;

  // Render WBS Node recursively
  const renderNode = (node: WBSNode, index: number) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const indentClass = `ml-${Math.min(node.level * 4, 16)}`;

    return (
      <div key={node.id} className="space-y-1">
        <div className={`flex items-center gap-2 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all ${indentClass}`}>
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="shrink-0 h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* WBS Code */}
          <Badge variant="outline" className="text-[10px] font-mono shrink-0 px-2">
            {node.id}
          </Badge>

          {/* Node Title */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{node.title}</p>
          </div>

          {/* Duration */}
          {node.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{node.duration} days</span>
            </div>
          )}

          {/* Status */}
          {node.status === 'completed' && (
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          )}
          {node.status === 'in-progress' && (
            <div className="h-4 w-4 rounded-full border-2 border-primary animate-pulse shrink-0"></div>
          )}
          {node.status === 'not-started' && (
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0"></div>
          )}
        </div>

        {/* Render Children */}
        {isExpanded && hasChildren && (
          <div className="space-y-1">
            {node.children.map((child, idx) => renderNode(child, idx))}
          </div>
        )}
      </div>
    );
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
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                {project.name} - WBS
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Work Breakdown Structure - Hierarchical task decomposition
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                  <Network className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{totalNodes}</p>
                  <p className="text-xs text-muted-foreground">Work Packages</p>
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
                  <p className="text-2xl font-bold tracking-tight">{maxLevels}</p>
                  <p className="text-xs text-muted-foreground">Levels Deep</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg ring-1 ring-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{completedNodes}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg ring-1 ring-amber-500/20">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {tasks.reduce((sum, t) => sum + (t.duration || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WBS Tree */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold tracking-tight">Work Breakdown Structure</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => {
                  if (expandedNodes.size > 0) {
                    setExpandedNodes(new Set());
                  } else {
                    const allIds = new Set<string>();
                    const collectIds = (nodes: WBSNode[]) => {
                      nodes.forEach(node => {
                        allIds.add(node.id);
                        collectIds(node.children);
                      });
                    };
                    collectIds(wbsTree);
                    setExpandedNodes(allIds);
                  }
                }}
              >
                {expandedNodes.size > 0 ? 'Collapse All' : 'Expand All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">No Tasks Yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Create tasks in the Gantt Tool to build your WBS structure
                </p>
                <Button onClick={() => navigate(`/free/ai-tools/planning/gantt?project=${project.id}`)}>
                  <Layers className="h-4 w-4 mr-2" />
                  Go to Gantt Tool
                </Button>
              </div>
            )}

            {/* WBS Tree */}
            {!isLoading && wbsTree.length > 0 && (
              <div className="space-y-1">
                {wbsTree.map((node, idx) => renderNode(node, idx))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Helper Text */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 shrink-0">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">💡 About WBS</p>
                <p className="text-xs text-muted-foreground">
                  WBS automatically builds from your Gantt tasks. Tasks with parent_id create the hierarchy. 
                  Add tasks in the Gantt Tool to expand your WBS structure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
