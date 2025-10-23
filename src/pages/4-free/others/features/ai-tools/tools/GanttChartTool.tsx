import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/pages/1-HomePage/others/components/ui/dialog';
import { Alert, AlertDescription } from '@/pages/1-HomePage/others/components/ui/alert';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckSquare, 
  FileText, 
  Download, 
  Upload,
  BarChart3,
  Clock,
  Target,
  Settings,
  Sparkles,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Move,
  GripVertical,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { useGanttStore } from '../stores/useGanttStore';
import { ROUTES } from '@/shared/constants/routes';

export default function GanttChartTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project') || '1';
  
  const {
    projects,
    tasks,
    dependencies,
    resources,
    changeOrders,
    punchList,
    selectedProject,
    selectedTask,
    isGenerating,
    viewMode,
    zoomLevel,
    setSelectedProject,
    setSelectedTask,
    setViewMode,
    setZoomLevel,
    createProject,
    createTask,
    updateTask,
    deleteTask,
    addDependency,
    createResource,
    createChangeOrder,
    createPunchListItem,
    generateGanttFromPrompt,
    getTasksForProject,
    getResourcesForProject,
    getCriticalPathTasks,
    calculateProjectProgress
  } = useGanttStore();

  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [showChangeOrderDialog, setShowChangeOrderDialog] = useState(false);
  const [showPunchListDialog, setShowPunchListDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Set selected project on mount
  useEffect(() => {
    if (projectId && projectId !== selectedProject) {
      setSelectedProject(projectId);
    }
  }, [projectId, selectedProject, setSelectedProject]);

  const currentProject = projects.find(p => p.id === selectedProject);
  const projectTasks = getTasksForProject(selectedProject || '');
  const projectResources = getResourcesForProject(selectedProject || '');
  const criticalPathTasks = getCriticalPathTasks(selectedProject || '');
  const projectProgress = calculateProjectProgress(selectedProject || '');

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    await generateGanttFromPrompt(aiPrompt, selectedProject);
    setAiPrompt('');
    setShowAIGenerator(false);
  };

  const handleCreateTask = async (taskData: any) => {
    if (!selectedProject) return;
    
    await createTask({
      project_id: selectedProject,
      ...taskData
    });
    setShowTaskDialog(false);
    setEditingTask(null);
  };

  const handleCreateResource = async (resourceData: any) => {
    if (!selectedProject) return;
    
    await createResource(selectedProject, resourceData);
    setShowResourceDialog(false);
  };

  const handleCreateChangeOrder = async (changeOrderData: any) => {
    if (!selectedProject) return;
    
    await createChangeOrder(selectedProject, changeOrderData);
    setShowChangeOrderDialog(false);
  };

  const handleCreatePunchListItem = async (itemData: any) => {
    if (!selectedProject) return;
    
    await createPunchListItem(selectedProject, itemData);
    setShowPunchListDialog(false);
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'delayed': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 p-4 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate(ROUTES.AI_TOOLS.PLANNING)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
          <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Gantt Chart Builder</h1>
            <p className="text-xs text-muted-foreground">
              {currentProject?.name || 'Project Timeline Management'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setShowAIGenerator(true)}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI Generate
          </Button>
          <Button className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{projectTasks.length}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
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
                <div className="text-2xl font-bold text-primary">{Math.round(projectProgress)}%</div>
                <div className="text-xs text-muted-foreground">Progress</div>
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
                <div className="text-2xl font-bold text-primary">{projectResources.length}</div>
                <div className="text-xs text-muted-foreground">Resources</div>
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
                <div className="text-2xl font-bold text-primary">{criticalPathTasks.length}</div>
                <div className="text-xs text-muted-foreground">Critical Path</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="gantt" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="gantt" className="text-xs">Gantt View</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
          <TabsTrigger value="changes" className="text-xs">Change Orders</TabsTrigger>
          <TabsTrigger value="punchlist" className="text-xs">Punch List</TabsTrigger>
        </TabsList>

        {/* Gantt View */}
        <TabsContent value="gantt" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Project Timeline</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={zoomLevel} onValueChange={(value: any) => setZoomLevel(value)}>
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {projectTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all group"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', task.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedTaskId = e.dataTransfer.getData('text/plain');
                      if (draggedTaskId !== task.id) {
                        // Handle task reordering logic here
                        console.log(`Moving task ${draggedTaskId} to position of ${task.id}`);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move group-hover:text-primary transition-colors" />
                      <div className="w-4 h-4 border border-border rounded flex items-center justify-center">
                        {task.is_milestone && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium truncate">{task.title}</h4>
                        <Badge className={`text-[9px] ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        {task.is_critical_path && (
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[9px]">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{task.start_date} - {task.end_date}</span>
                        <span>{task.duration} days</span>
                        <span>{task.progress}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setEditingTask(task);
                          setShowTaskDialog(true);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {projectTasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">No tasks yet</h3>
                    <p className="text-xs text-muted-foreground mb-6">
                      Create your first task or use AI to generate a complete timeline
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => setShowTaskDialog(true)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Task
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setShowAIGenerator(true)}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        AI Generate
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <CheckSquare className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Task Management</CardTitle>
                </div>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowTaskDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {projectTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium">{task.title}</h4>
                          <Badge className={`text-[9px] ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          {task.is_milestone && (
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
                              Milestone
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Start: {task.start_date}</span>
                          <span>End: {task.end_date}</span>
                          <span>Duration: {task.duration} days</span>
                          <span>Progress: {task.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setEditingTask(task);
                            setShowTaskDialog(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Crew Management</CardTitle>
                </div>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowResourceDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {projectResources.map((resource) => (
                  <div key={resource.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{resource.name}</h4>
                        <p className="text-xs text-muted-foreground">{resource.role}</p>
                        {resource.skills.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {resource.skills.map((skill, index) => (
                              <Badge key={index} className="bg-primary/10 text-primary border-primary/20 text-[9px]">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Orders Tab */}
        <TabsContent value="changes" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Change Orders</CardTitle>
                </div>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowChangeOrderDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Change Order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {changeOrders.filter(co => co.project_id === selectedProject).map((changeOrder) => (
                  <div key={changeOrder.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium">{changeOrder.title}</h4>
                          <Badge className={`text-[9px] ${getTaskStatusColor(changeOrder.status)}`}>
                            {changeOrder.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{changeOrder.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>CO #{changeOrder.change_number}</span>
                          <span>Cost Impact: {changeOrder.cost_impact ? `SAR ${changeOrder.cost_impact.toLocaleString()}` : 'TBD'}</span>
                          <span>Schedule Impact: {changeOrder.schedule_impact_days || 0} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Punch List Tab */}
        <TabsContent value="punchlist" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <CheckSquare className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Punch List</CardTitle>
                </div>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowPunchListDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {punchList.filter(item => item.project_id === selectedProject).map((item) => (
                  <div key={item.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium">{item.item_description}</h4>
                          <Badge className={`text-[9px] ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </Badge>
                          <Badge className={`text-[9px] ${getTaskStatusColor(item.status)}`}>
                            {item.status}
                          </Badge>
                        </div>
                        {item.location && (
                          <p className="text-xs text-muted-foreground mb-2">Location: {item.location}</p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Generator Dialog */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Gantt Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Describe your project</label>
              <Textarea
                placeholder="Build a 3-story office building starting in March with foundation, framing, electrical, and finishing phases..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-24"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAIGeneration}
                disabled={!aiPrompt.trim() || isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Generate Timeline
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Task Title</label>
              <Input
                placeholder="Enter task title"
                defaultValue={editingTask?.title || ''}
                id="task-title"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Enter task description"
                defaultValue={editingTask?.description || ''}
                id="task-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <Input
                  type="date"
                  defaultValue={editingTask?.start_date || ''}
                  id="task-start-date"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <Input
                  type="date"
                  defaultValue={editingTask?.end_date || ''}
                  id="task-end-date"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select defaultValue={editingTask?.priority || 'medium'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Task Type</label>
                <Select defaultValue={editingTask?.task_type || 'task'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="phase">Phase</SelectItem>
                    <SelectItem value="deliverable">Deliverable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  const formData = {
                    title: (document.getElementById('task-title') as HTMLInputElement)?.value,
                    description: (document.getElementById('task-description') as HTMLTextAreaElement)?.value,
                    start_date: (document.getElementById('task-start-date') as HTMLInputElement)?.value,
                    end_date: (document.getElementById('task-end-date') as HTMLInputElement)?.value,
                  };
                  handleCreateTask(formData);
                }}
                className="flex-1"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input placeholder="Enter resource name" id="resource-name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Input placeholder="e.g., Foreman, Electrician, Plumber" id="resource-role" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Skills</label>
              <Input placeholder="Enter skills separated by commas" id="resource-skills" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  const formData = {
                    name: (document.getElementById('resource-name') as HTMLInputElement)?.value,
                    role: (document.getElementById('resource-role') as HTMLInputElement)?.value,
                    skills: (document.getElementById('resource-skills') as HTMLInputElement)?.value.split(',').map(s => s.trim()),
                  };
                  handleCreateResource(formData);
                }}
                className="flex-1"
              >
                Add Resource
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Order Dialog */}
      <Dialog open={showChangeOrderDialog} onOpenChange={setShowChangeOrderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Change Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input placeholder="Enter change order title" id="co-title" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea placeholder="Describe the scope changes" id="co-description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Cost Impact</label>
                <Input type="number" placeholder="0" id="co-cost" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Schedule Impact (days)</label>
                <Input type="number" placeholder="0" id="co-schedule" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  const formData = {
                    title: (document.getElementById('co-title') as HTMLInputElement)?.value,
                    description: (document.getElementById('co-description') as HTMLTextAreaElement)?.value,
                    cost_impact: parseFloat((document.getElementById('co-cost') as HTMLInputElement)?.value || '0'),
                    schedule_impact_days: parseInt((document.getElementById('co-schedule') as HTMLInputElement)?.value || '0'),
                  };
                  handleCreateChangeOrder(formData);
                }}
                className="flex-1"
              >
                Create Change Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Punch List Dialog */}
      <Dialog open={showPunchListDialog} onOpenChange={setShowPunchListDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Punch List Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Item Description</label>
              <Textarea placeholder="Describe the item to be completed" id="punch-description" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input placeholder="e.g., Floor 2, Room 201" id="punch-location" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  const formData = {
                    item_description: (document.getElementById('punch-description') as HTMLTextAreaElement)?.value,
                    location: (document.getElementById('punch-location') as HTMLInputElement)?.value,
                  };
                  handleCreatePunchListItem(formData);
                }}
                className="flex-1"
              >
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}