import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { 
  Network, 
  Sparkles, 
  Save, 
  Download, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { FloatingAIButton } from '../components/FloatingAIButton';

interface WBSNode {
  id: string;
  title: string;
  level: number;
  children: WBSNode[];
  duration?: string;
  assignee?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
}

export default function WBSBuilderTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Sample WBS structure
  const [wbsTree, setWbsTree] = useState<WBSNode[]>([
    {
      id: '1',
      title: 'NEOM Infrastructure Phase 2',
      level: 0,
      children: [
        {
          id: '1.1',
          title: 'Project Initiation',
          level: 1,
          duration: '2 weeks',
          status: 'completed',
          children: [
            { id: '1.1.1', title: 'Project Charter', level: 2, duration: '3 days', status: 'completed', children: [] },
            { id: '1.1.2', title: 'Stakeholder Identification', level: 2, duration: '4 days', status: 'completed', children: [] },
          ]
        },
        {
          id: '1.2',
          title: 'Planning',
          level: 1,
          duration: '4 weeks',
          status: 'in-progress',
          children: [
            { id: '1.2.1', title: 'Scope Definition', level: 2, duration: '1 week', status: 'in-progress', children: [] },
            { id: '1.2.2', title: 'Schedule Development', level: 2, duration: '1 week', status: 'not-started', children: [] },
            { id: '1.2.3', title: 'Budget Planning', level: 2, duration: '1 week', status: 'not-started', children: [] },
          ]
        },
        {
          id: '1.3',
          title: 'Execution',
          level: 1,
          duration: '12 weeks',
          status: 'not-started',
          children: []
        }
      ]
    }
  ]);

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

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a complete Work Breakdown Structure (WBS) for a construction project. Project ID: ${projectId || 'N/A'}. Include major phases, work packages, and detailed tasks with estimated durations. Format as hierarchical structure suitable for Saudi construction projects.`;
      await sendMessage(prompt);
      setIsGenerating(false);
      // Note: In production, parse AI response and update wbsTree state
    } catch (error) {
      console.error('AI generation failed:', error);
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-primary/15 text-primary border-primary/25';
      case 'in-progress': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Count total nodes
  const countNodes = (nodes: WBSNode[]): number => {
    return nodes.reduce((count, node) => {
      return count + 1 + countNodes(node.children || []);
    }, 0);
  };

  const totalWorkPackages = countNodes(wbsTree);

  const renderNode = (node: WBSNode, index: number): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const indent = node.level * 24; // 24px per level

    return (
      <div key={node.id}>
        <div 
          className="group flex items-center gap-2 p-3 hover:bg-muted/30 transition-colors rounded-lg"
          style={{ paddingLeft: `${indent + 12}px` }}
        >
          {/* Drag Handle */}
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

          {/* Expand/Collapse */}
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="shrink-0"
            >
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                isExpanded ? '' : '-rotate-90'
              }`} />
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          {/* Level Indicator */}
          <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
            node.level === 0 ? 'bg-primary/10 text-primary ring-1 ring-primary/20' :
            node.level === 1 ? 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20' :
            'bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/20'
          }`}>
            {node.id}
          </div>

          {/* Title */}
          <Input 
            value={node.title}
            className="h-8 text-sm font-medium flex-1"
            placeholder="Work package name..."
            readOnly
          />

          {/* Duration */}
          {node.duration && (
            <Input 
              value={node.duration}
              className="h-8 text-xs w-24"
              placeholder="Duration..."
              readOnly
            />
          )}

          {/* Status */}
          {node.status && (
            <Badge className={`text-[9px] ${getStatusColor(node.status)}`}>
              {node.status === 'completed' && <CheckCircle2 className="h-2.5 w-2.5 mr-1" />}
              {node.status === 'in-progress' && <span className="h-2 w-2 bg-amber-500 rounded-full mr-1 animate-pulse"></span>}
              {node.status.replace('-', ' ')}
            </Badge>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child, childIndex) => renderNode(child, childIndex))}
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
                WBS Builder
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Visual Work Breakdown Structure with AI suggestions
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
              Export Excel
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
                  AI Generate WBS
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
                  <Network className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{totalWorkPackages}</p>
                  <p className="text-xs text-muted-foreground">Work Packages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">3</p>
                  <p className="text-xs text-muted-foreground">Levels Deep</p>
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
                  <p className="text-xl font-bold tracking-tight">2</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg ring-1 ring-amber-500/20">
                  <span className="h-4 w-4 text-amber-600 flex items-center justify-center font-bold text-xs">5</span>
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">14w</p>
                  <p className="text-xs text-muted-foreground">Total Duration</p>
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
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Expand All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-1">
              {wbsTree.map((node, index) => renderNode(node, index))}
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/40">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold mb-1">🎯 WBS Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Drag tasks to reorder or change hierarchy</li>
                    <li>Click + to add sub-tasks under any work package</li>
                    <li>Use AI to generate complete WBS from project description</li>
                    <li>Export to MS Project or Excel when complete</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Floating AI Button */}
      <FloatingAIButton />
    </div>
  );
}

