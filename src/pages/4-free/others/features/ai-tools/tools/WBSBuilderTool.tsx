import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectParamSync } from '../hooks/useProjectParamSync';
import { Card, CardHeader, CardTitle, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { 
  Network, 
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Loader2,
  Briefcase,
  ArrowLeft,
  Layers,
  FileText,
  AlertTriangle,
  Clock,
  Users,
  Plus,
  Minus,
  RotateCcw,
  Share2,
  PlusCircle,
  Trash2,
  X,
  Save,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useGanttStore } from '../stores/useGanttStore';
import { WBSExportDialog } from '../components/WBSExportDialog';

interface WBSNode {
  id: string;
  title: string;
  level: number;
  duration?: number;
  description?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  children: WBSNode[];
  parent_id: string | null;
}

/**
 * WBS Builder Tool - Faithful Stitch Design Implementation
 * 
 * Layout Modes:
 * 1. AI Input Mode (Screen 1): Centered hero layout when no tasks
 * 2. Canvas Mode (Screen 2): 3-column layout with canvas + sidebars
 */
export default function WBSBuilderTool() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sync URL ?project=<id> ↔ store
  // This ensures navigating from Planning Hub with ?project=<id> auto-selects that project
  useProjectParamSync();
  
  // Get selected project - will be pre-populated from URL param via useProjectParamSync
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // Project is guaranteed to match URL param or Planning Hub selection
  // No additional selector needed - single source of truth via useProjectStore
  
  // Get tasks from Gantt store
  const { tasks, loadProjectTasks, generateGanttFromPrompt, updateTask } = useGanttStore();
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  // State
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<WBSNode | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [industry, setIndustry] = useState('');
  const [projectType, setProjectType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Load tasks with loading state
  useEffect(() => {
    const load = async () => {
      if (!project?.id) return;
      setIsLoadingTasks(true);
      try {
        await loadProjectTasks(project.id);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    load();
  }, [project?.id, loadProjectTasks]);

  // Empty state (no project) - standardized across planning suite
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <div className="p-4">
          {/* Back button - consistent with planning suite */}
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
                Please select or create a project to use the WBS Builder
              </p>
              <Button onClick={() => navigate('/free/ai-tools/planning')} className="h-9">
                <Layers className="h-4 w-4 mr-2" />
                Select Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }


  // Helper: Build WBS tree from flat tasks
  const buildWBSTree = (): WBSNode[] => {
    const taskMap = new Map<string, WBSNode>();
    const roots: WBSNode[] = [];

    tasks.forEach(task => {
      taskMap.set(task.id, {
        id: task.id,
        title: task.title,
        level: 0,
        duration: task.duration,
        description: task.description || '',
        status: task.progress === 100 ? 'completed' : task.progress > 0 ? 'in-progress' : 'not-started',
        children: [],
        parent_id: task.parent_id
      });
    });

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

  // Helper: Filter tree by search query
  const filterTreeBySearch = (nodes: WBSNode[], query: string): WBSNode[] => {
    if (!query.trim()) return nodes;
    
    const lowerQuery = query.toLowerCase();
    
    const filterNode = (node: WBSNode): WBSNode | null => {
      const titleMatches = node.title.toLowerCase().includes(lowerQuery);
      const filteredChildren = node.children
        .map(filterNode)
        .filter((n): n is WBSNode => n !== null);
      
      if (titleMatches || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      
      return null;
    };
    
    return nodes.map(filterNode).filter((n): n is WBSNode => n !== null);
  };

  const wbsTree = buildWBSTree();
  const displayTree = filterTreeBySearch(wbsTree, searchQuery);

  // AI Generation - calls real Gantt store method
  const handleAIGenerate = async () => {
    if (!aiInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your project to generate WBS",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Compose rich prompt with context
      const fullPrompt = `Project: ${project.name}
Industry: ${industry || 'General'}
Methodology: ${projectType || 'Standard'}

Description: ${aiInput}

Generate a comprehensive Work Breakdown Structure with:
- Major phases (Level 1) with clear deliverables
- Key work packages (Level 2) broken down by area
- Specific tasks (Level 3) with realistic durations in days
- Follow ${industry || 'construction'} industry standards
- Use ${projectType || 'waterfall'} project methodology

Create a hierarchical task structure suitable for project planning.`;

      await generateGanttFromPrompt(fullPrompt, project.id);

      toast({
        title: "WBS Generated Successfully",
        description: "Review the generated structure in Visualization view",
      });
      
      // Reload tasks and scroll to visualization
      await loadProjectTasks(project.id);
      
      // Scroll to visualization section
      setTimeout(() => {
        document.getElementById('visualization-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      
      // Clear form
      setAiInput('');
      setIndustry('');
      setProjectType('');
      
    } catch (error) {
      console.error('Error generating WBS:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate WBS. Please try again or check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoomLevel(100);

  // Export handlers - will implement with html2canvas + jspdf
  const handleExport = async (format: 'pdf' | 'png' | 'csv' | 'json') => {
    const element = document.getElementById('wbs-tree-canvas');
    
    try {
      switch (format) {
        case 'csv': {
          const rows = [['Level', 'ID', 'Title', 'Duration', 'Status', 'Parent ID']];
          const flatten = (nodes: WBSNode[], level = 0) => {
            nodes.forEach(node => {
              rows.push([
                level.toString(),
                node.id.substring(0, 8),
                node.title,
                node.duration?.toString() || '',
                node.status || '',
                node.parent_id?.substring(0, 8) || ''
              ]);
              flatten(node.children, level + 1);
            });
          };
          flatten(wbsTree);
          
          const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project.name}-WBS.csv`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast({ title: "CSV exported successfully" });
          break;
        }
        
        case 'json': {
          const json = JSON.stringify(wbsTree, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project.name}-WBS.json`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast({ title: "JSON exported successfully" });
          break;
        }
        
        case 'pdf':
        case 'png':
          // TODO: Requires html2canvas package
          toast({ 
            title: `${format.toUpperCase()} Export`,
            description: "Image export requires additional dependencies. Use CSV or JSON for now.",
          });
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Toggle node
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

  // Expand/Collapse all
  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: WBSNode[]) => {
      nodes.forEach(node => {
        allIds.add(node.id);
        collectIds(node.children);
      });
    };
    collectIds(wbsTree);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Get node color based on level (Stitch colors)
  const getNodeColor = (level: number) => {
    switch (level) {
      case 0: return '#0A3A67'; // Dark blue
      case 1: return '#1E62A1'; // Medium blue
      case 2: return '#4A90E2'; // Light blue
      default: return '#6B7280'; // Gray (slate-500)
    }
  };

  //
  // ═══════════════════════════════════════════════════════
  // STITCH SCREEN 1: AI INPUT MODE (when no tasks)
  // ═══════════════════════════════════════════════════════
  //
  if (tasks.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        {/* Top Bar - consistent with planning suite */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/free/ai-tools/planning')}
            className="h-9"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to Planning Hub
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{project.name}</span>
          </div>
        </header>

        {/* Main Content - centered hero layout, theme rhythm spacing */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-muted/20 to-background">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Hero Title - 56px max line-height, centered */}
            <div className="flex flex-col items-center text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-black leading-[3.5rem] tracking-tight mb-6">
                Describe Your Project to Get Started
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Provide our AI with the details, and we'll generate a comprehensive Work Breakdown Structure to kickstart your planning.
              </p>
            </div>

            {/* Form - tightened spacing, 8/16 rhythm */}
            <div className="flex flex-col items-center gap-8">
              {/* Project Description */}
              <div className="w-full max-w-3xl">
                <label className="flex w-full flex-col gap-2">
                  <span className="text-base font-medium">
                    Project Description
                  </span>
                  <Textarea
                    placeholder="e.g., Develop a mobile banking app with features for fund transfer, bill payment, and biometric login for iOS and Android..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    disabled={isGenerating}
                    className="min-h-48 rounded-xl border shadow-sm focus:shadow-md transition-shadow resize-y"
                  />
                </label>
              </div>

              {/* Industry + Project Type - consistent gutters */}
              <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-base font-medium">Industry</span>
                  <Input
                    placeholder="e.g., Technology"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={isGenerating}
                    className="h-12 rounded-xl border shadow-sm"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-base font-medium">Project Type</span>
                  <Input
                    placeholder="e.g., Mobile App Development"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    disabled={isGenerating}
                    className="h-12 rounded-xl border shadow-sm"
                  />
                </label>
              </div>

              {/* Generate Button - responsive width, mobile-first */}
              <div className="w-full max-w-3xl">
                <Button
                  onClick={handleAIGenerate}
                  disabled={!aiInput.trim() || isGenerating}
                  className="h-14 w-full rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Generating WBS...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
                      Generate WBS
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  //
  // ═══════════════════════════════════════════════════════
  // STITCH SCREEN 2: CANVAS MODE (3-column layout)
  // ═══════════════════════════════════════════════════════
  //
  return (
    <div className="flex h-screen w-full">
      
      {/* LEFT SIDEBAR - Stitch: controls + stats */}
      <aside className="flex h-full w-72 shrink-0 flex-col justify-between border-r border-border bg-background p-4">
        <div className="flex flex-col gap-6">
          {/* Logo/Title with Back Button */}
          <div className="flex items-center gap-3 px-2">
            {/* Back Button - icon only like other pages */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/free/ai-tools/planning')}
              className="h-9 w-9 shrink-0"
              aria-label="Back to Planning Hub"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-full shadow-md shrink-0">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-base font-bold">WBS Builder</h1>
              <p className="text-sm text-muted-foreground truncate">{project.name}</p>
            </div>
          </div>

          {/* Quick Navigation - Jump to sections */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Quick Navigation</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('prompt-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full justify-start h-9"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm">AI Generation</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('visualization-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full justify-start h-9"
            >
              <Network className="h-4 w-4 mr-2" />
              <span className="text-sm">WBS Tree</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('export-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full justify-start h-9"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="text-sm">Export Options</span>
            </Button>
          </div>

          <hr className="border-border" />

          {/* Search + Controls - Stitch layout */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                placeholder="Find a task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 bg-muted border-border"
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Expand/Collapse buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-9"
                onClick={handleExpandAll}
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-9"
                onClick={handleCollapseAll}
              >
                Collapse All
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Buttons - Add Task + Export */}
        <div className="flex flex-col gap-2">
          <Button
            className="h-9"
            onClick={() => navigate(`/free/ai-tools/planning/gantt?project=${project.id}`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
          <Button
            variant="outline"
            className="h-9"
            onClick={() => setShowExportDialog(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Export WBS
          </Button>
        </div>
      </aside>

      {/* CENTER CANVAS - All sections in one scrollable page */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="container mx-auto p-4 space-y-12 max-w-7xl">
        
        {/* SECTION 1: PROMPT - AI Input Form */}
        <section id="prompt-section" className="scroll-mt-8">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">AI Generation</h2>
                  <p className="text-xs text-muted-foreground">Describe your project to generate a WBS</p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Project Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Project Description</label>
                  <Textarea
                    placeholder="e.g., Develop a mobile banking app with features for fund transfer, bill payment, and biometric login for iOS and Android..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    disabled={isGenerating}
                    className="min-h-32 resize-y"
                  />
                </div>

                {/* Industry + Project Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Industry (Optional)</label>
                    <Input
                      placeholder="e.g., Technology"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Project Type (Optional)</label>
                    <Input
                      placeholder="e.g., Mobile App Development"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleAIGenerate}
                    disabled={!aiInput.trim() || isGenerating}
                    className="w-full h-9 shadow-md"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating WBS...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate WBS
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 2: VISUALIZATION - WBS Tree Canvas */}
        <section id="visualization-section" className="scroll-mt-8">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                  <Network className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">WBS Visualization</h2>
                  <p className="text-xs text-muted-foreground">{project.name}</p>
                </div>
              </div>
              <Button onClick={() => navigate(`/free/ai-tools/planning/gantt?project=${project.id}`)} size="sm" className="h-9">
                Open in Gantt
              </Button>
            </div>

            {/* WBS Canvas - Stitch: dotted background + zoom controls */}
            <div className="relative w-full h-[600px] rounded-xl overflow-hidden bg-background border border-border">
              {/* Dotted grid background - theme-aware for dark mode */}
              <div 
                className="absolute inset-0 h-full w-full" 
                style={{
                  backgroundImage: 'radial-gradient(hsl(var(--border)) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Zoom Controls - top right */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  className="h-9 w-9 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground min-w-12 text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  className="h-9 w-9 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomReset}
                  aria-label="Reset zoom"
                  className="h-9 w-9 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* WBS Tree - vertical indented layout with zoom */}
              <div 
                id="wbs-tree-canvas"
                className="relative p-10 h-full w-full overflow-auto transition-transform"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
              >
                {displayTree.map((rootNode) => (
                  <WBSTreeNode
                    key={rootNode.id}
                    node={rootNode}
                    level={0}
                    isExpanded={expandedNodes.has(rootNode.id)}
                    isSelected={selectedNode?.id === rootNode.id}
                    expandedNodes={expandedNodes}
                    selectedNode={selectedNode}
                    onToggle={toggleNode}
                    onSelect={(node) => {
                      setSelectedNode(node);
                    }}
                  />
                ))}

                {displayTree.length === 0 && searchQuery.trim() && (
                  <div className="text-center py-12">
                    <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Try a different search term or clear the filter
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery('')} className="h-9">
                      Clear Search
                    </Button>
                  </div>
                )}

                {wbsTree.length === 0 && !searchQuery.trim() && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Network className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-muted-foreground">
                        No WBS structure yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add tasks in Gantt Tool to build your WBS
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: EXPORT - Export Preview */}
        <section id="export-section" className="scroll-mt-8">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Export Options</h2>
                  <p className="text-xs text-muted-foreground">Download your WBS in multiple formats</p>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">WBS Preview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {wbsTree.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto bg-muted/20 rounded-lg p-4 space-y-2">
                    {wbsTree.map(node => (
                      <div key={node.id} className="space-y-1">
                        <div className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                          <span className="font-bold text-sm">{node.id.substring(0, 8)}</span>
                          <span className="flex-1">{node.title}</span>
                          {node.duration && (
                            <span className="text-xs text-muted-foreground">{node.duration}d</span>
                          )}
                        </div>
                        {node.children.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {node.children.map(child => (
                              <div key={child.id} className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                                <span className="font-bold text-xs">{child.id.substring(0, 8)}</span>
                                <span className="flex-1 text-sm">{child.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No WBS structure to export</p>
                    <p className="text-sm mt-1">Generate tasks first or add them in the Gantt view</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="h-9"
                onClick={() => handleExport('pdf')}
                disabled={wbsTree.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button 
                variant="outline"
                className="h-9"
                onClick={() => handleExport('png')}
                disabled={wbsTree.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PNG
              </Button>
              <Button 
                variant="outline"
                className="h-9"
                onClick={() => handleExport('csv')}
                disabled={wbsTree.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button 
                variant="outline"
                className="h-9"
                onClick={() => handleExport('json')}
                disabled={wbsTree.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </div>

            {/* Full Export Dialog */}
            <Button 
              className="w-full h-9"
              onClick={() => setShowExportDialog(true)}
              disabled={wbsTree.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Open Full Export Options
            </Button>
          </div>
        </section>

        </div>
      </main>

      {/* RIGHT SIDEBAR - Stitch: 420px fixed width with node details */}
      {selectedNode && (
        <aside className="flex h-full w-[420px] flex-col border-l border-border bg-background">
          <div className="flex-grow overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{selectedNode.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setSelectedNode(null)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Form Fields - Editable */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium pb-2">Task ID</label>
                <div className="text-sm p-2 rounded-md bg-muted font-mono">
                  {selectedNode.id.substring(0, 8)}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium pb-2">Task Name</label>
                <Input
                  value={selectedNode.title}
                  onChange={(e) => setSelectedNode({ ...selectedNode, title: e.target.value })}
                  className="bg-background"
                  placeholder="Enter task name"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium pb-2">Description</label>
                <Textarea
                  value={selectedNode.description || ''}
                  onChange={(e) => setSelectedNode({ ...selectedNode, description: e.target.value })}
                  className="bg-background min-h-28"
                  placeholder="Enter a brief description of this task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium pb-2">Duration (days)</label>
                  <Input
                    type="number"
                    value={selectedNode.duration || ''}
                    onChange={(e) => setSelectedNode({ ...selectedNode, duration: parseInt(e.target.value) || 0 })}
                    className="bg-background"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium pb-2">Status</label>
                  <Select
                    value={selectedNode.status || 'not-started'}
                    onValueChange={(value: 'not-started' | 'in-progress' | 'completed') => setSelectedNode({ ...selectedNode, status: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save/Cancel Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 h-9"
                  onClick={() => setSelectedNode(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-9"
                  onClick={async () => {
                    try {
                      await updateTask(selectedNode.id, {
                        title: selectedNode.title,
                        description: selectedNode.description,
                        duration: selectedNode.duration,
                        progress: selectedNode.status === 'completed' ? 100 : selectedNode.status === 'in-progress' ? 50 : 0
                      });
                      toast({ title: "Task updated successfully" });
                      setSelectedNode(null);
                      await loadProjectTasks(project.id);
                    } catch (error) {
                      toast({ title: "Update failed", description: "Please try again", variant: "destructive" });
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="px-6 py-4">
              <hr className="border-border" />
            </div>

            {/* AI Suggestions - Stitch: purple card with suggestions */}
            <div className="px-6 pb-6">
              <div className="rounded-xl bg-purple-50 dark:bg-purple-950/20 p-5 border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                    AI Assistant
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Suggestion 1 */}
                  <div className="bg-background dark:bg-gray-800/50 p-3 rounded-lg flex items-start gap-3 justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        MISSING TASK
                      </p>
                      <p className="text-sm mt-1">
                        Add sub-task: "Competitor Analysis"
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                        Add
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Suggestion 2 */}
                  <div className="bg-background dark:bg-gray-800/50 p-3 rounded-lg flex items-start gap-3 justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        EFFORT ESTIMATION
                      </p>
                      <p className="text-sm mt-1">
                        Suggested duration: 12 days based on similar tasks.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                        Apply
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Suggestion 3 */}
                  <div className="bg-background dark:bg-gray-800/50 p-3 rounded-lg flex items-start gap-3 justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        RISK IDENTIFICATION
                      </p>
                      <p className="text-sm mt-1">
                        Potential Risk: 'Scope creep due to unclear requirements'.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                        Add Risk
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Stitch: Cancel + Save */}
          <div className="flex-shrink-0 p-6 border-t border-border bg-background">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedNode(null)}
                className="h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({ title: "Changes saved" });
                  setSelectedNode(null);
                }}
                className="h-10 px-4"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Export Dialog */}
      <WBSExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        projectName={project.name}
        onExport={handleExport}
        onGenerateGantt={() => navigate(`/free/ai-tools/planning/gantt?project=${project.id}`)}
      />
    </div>
  );
}

/**
 * WBS Tree Node Component - Vertical indented tree with Stitch colors
 * Proven layout pattern, mobile-friendly, keeps Stitch color hierarchy
 */
interface WBSTreeNodeProps {
  node: WBSNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  expandedNodes: Set<string>;
  selectedNode: WBSNode | null;
  onToggle: (id: string) => void;
  onSelect: (node: WBSNode) => void;
}

const WBSTreeNode = React.memo(({ 
  node, 
  level, 
  isExpanded, 
  isSelected, 
  expandedNodes,
  selectedNode,
  onToggle, 
  onSelect 
}: WBSTreeNodeProps) => {
  const hasChildren = node.children.length > 0;
  
  // Exact Stitch colors by level - preserved from design
  const getNodeColor = (lvl: number) => {
    switch (lvl) {
      case 0: return { bg: '#0A3A67', text: 'text-white' }; // Dark blue
      case 1: return { bg: '#1E62A1', text: 'text-white' }; // Medium blue
      case 2: return { bg: '#4A90E2', text: 'text-white' }; // Light blue
      default: return { bg: '#6B7280', text: 'text-white' }; // Gray
    }
  };
  
  const colors = getNodeColor(level);
  const indentPx = level * 24; // 24px per level

  return (
    <div style={{ marginLeft: `${indentPx}px` }} className="mb-2">
      <div
        className={`flex items-center gap-3 p-3 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${colors.text} ${isSelected ? 'ring-2 ring-white/50' : ''}`}
        style={{ backgroundColor: colors.bg }}
        onClick={() => onSelect(node)}
        role="button"
        tabIndex={0}
        aria-label={`WBS node: ${node.title}, Level ${level + 1}`}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(node);
          }
        }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* ID */}
        <span className="font-bold text-sm opacity-90 shrink-0">
          {node.id.substring(0, 8)}
        </span>

        {/* Title */}
        <span className="font-medium flex-1 truncate">
          {node.title}
        </span>

        {/* Duration Badge */}
        {node.duration && (
          <span className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded shrink-0">
            {node.duration}d
          </span>
        )}

        {/* Status Indicator */}
        {node.status === 'completed' && (
          <CheckCircle2 className="h-4 w-4 opacity-90 shrink-0" />
        )}
      </div>

      {/* Render children recursively if expanded */}
      {isExpanded && hasChildren && (
        <div className="mt-1 space-y-1">
          {node.children.map(child => (
            <WBSTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={expandedNodes.has(child.id)}
              isSelected={selectedNode?.id === child.id}
              expandedNodes={expandedNodes}
              selectedNode={selectedNode}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
});
