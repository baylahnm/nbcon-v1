import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Plus, Filter, Edit3, Trash2, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { KanbanFiltersDialog } from "./KanbanFilters";
import { NewTaskDialog } from "./NewTaskDialog";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { AddColumnDialog } from "./AddColumnDialog";
import { useKanbanStore, Task, KanbanColumn } from "./hooks/useKanbanStore";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { useToast } from "../ui/use-toast";

export function KanbanBoard() {
  const { 
    getTasksByStatus, 
    getSortedColumns,
    filters, 
    setFilters, 
    availableCategories, 
    availableAssignees, 
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    updateColumn,
    deleteColumn
  } = useKanbanStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [editColumnTitle, setEditColumnTitle] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [columnWidth, setColumnWidth] = useState(320);
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const tasksByStatus = getTasksByStatus();
  const columns = getSortedColumns();

  // Calculate responsive column width for multi-row layout
  useEffect(() => {
    const calculateColumnWidth = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth < 1024;
      
      // Determine columns per row based on screen size
      const columnsPerRow = isMobile ? 2 : isTablet ? 3 : 4;
      
      // Adjust available width based on device type
      const padding = isMobile ? 24 : isTablet ? 48 : 80;
      const availableWidth = screenWidth - padding;
      
      const gapSize = isMobile ? 16 : 24;
      const totalGapSize = gapSize * (columnsPerRow - 1);
      const usableWidth = availableWidth - totalGapSize;
      
      // Set minimum width based on device
      const minWidth = isMobile ? 200 : 250;
      const maxWidth = isMobile ? 300 : isTablet ? 350 : 400;
      
      const calculatedWidth = Math.max(minWidth, Math.floor(usableWidth / columnsPerRow));
      const finalWidth = Math.min(calculatedWidth, maxWidth);
      
      setColumnWidth(finalWidth);
    };

    calculateColumnWidth();
    
    // Recalculate on window resize
    const handleResize = () => {
      calculateColumnWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleColumnTaskCreate = (status: string) => {
    return (taskData: any) => {
      addTask({ ...taskData, status });
    };
  };

  const toggleColumnExpansion = (columnId: string) => {
    setExpandedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  // Column management handlers
  const handleEditColumn = (column: KanbanColumn) => {
    setEditingColumn(column);
    setEditColumnTitle(column.title);
    setEditDialogOpen(true);
  };

  const handleSaveColumnEdit = () => {
    if (!editingColumn || !editColumnTitle.trim()) return;

    // Check for duplicates
    const existingTitles = columns
      .filter(col => col.id !== editingColumn.id)
      .map(col => col.title.toLowerCase());
    
    if (existingTitles.includes(editColumnTitle.trim().toLowerCase())) {
      toast({
        title: "Validation Error",
        description: "A column with this name already exists",
        variant: "destructive"
      });
      return;
    }

    updateColumn(editingColumn.id, { title: editColumnTitle.trim() });
    toast({
      title: "Column Updated",
      description: `Column renamed to "${editColumnTitle.trim()}"`,
    });
    setEditDialogOpen(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    const columnTasks = tasksByStatus[columnId] || [];
    if (columnTasks.length > 0) {
      toast({
        title: "Cannot Delete Column",
        description: "Please move all tasks out of this column before deleting it",
        variant: "destructive"
      });
      return;
    }

    deleteColumn(columnId);
    toast({
      title: "Column Deleted",
      description: "Column has been removed successfully",
    });
  };

  // Task management handlers
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
    // Update selected task if it's the one being updated
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
    // Close dialog if the selected task is deleted
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
      setTaskDetailOpen(false);
    }
  };

  const handleTaskComplete = (taskId: string) => {
    completeTask(taskId);
    // Update selected task if it's the one being completed
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: 'completed' });
    }
  };

  return (
    <div className="w-full max-w-full">
      {/* Header removed as requested */}

      {/* Kanban Board */}
      <div 
        className="w-full max-w-full pb-4"
      >
        {/* Multi-row grid with responsive columns per row */}
        <div 
          className="grid gap-6 w-full"
          style={{ 
            gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
            gap: window.innerWidth < 768 ? '16px' : '24px'
          }}
        >
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.id] || [];
          const isExpanded = expandedColumns.has(column.id);
          const maxVisibleCards = 3;
          const hasMoreCards = columnTasks.length > maxVisibleCards;
          const visibleTasks = hasMoreCards && !isExpanded 
            ? columnTasks.slice(0, maxVisibleCards) 
            : columnTasks;
          const hiddenCount = columnTasks.length - maxVisibleCards;

          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{column.title}</h3>
                  <span className="text-sm text-muted-foreground">({columnTasks.length})</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0"
                    onClick={() => handleEditColumn(column)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteColumn(column.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <NewTaskDialog
                    onTaskCreate={handleColumnTaskCreate(column.id)}
                    availableCategories={availableCategories}
                    availableAssignees={availableAssignees}
                    defaultStatus={column.id}
                    trigger={
                      <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {visibleTasks.map((task) => (
                  <ProjectCard 
                    key={task.id} 
                    {...task} 
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-sidebar-border rounded-lg">
                    <p className="text-sm">No tasks in this column</p>
                  </div>
                )}
                
                {/* View More/Collapse Button */}
                {hasMoreCards && (
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => toggleColumnExpansion(column.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          View More ({hiddenCount} more)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        open={taskDetailOpen}
        onOpenChange={setTaskDetailOpen}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskComplete={handleTaskComplete}
        availableCategories={availableCategories}
        availableAssignees={availableAssignees}
      />

      {/* Edit Column Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Column Title</label>
              <Input
                value={editColumnTitle}
                onChange={(e) => setEditColumnTitle(e.target.value)}
                placeholder="Enter column title..."
                maxLength={50}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveColumnEdit}
              disabled={!editColumnTitle.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}