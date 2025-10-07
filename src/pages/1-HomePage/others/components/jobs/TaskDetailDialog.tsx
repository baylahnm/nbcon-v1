import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  AlertCircle,
  FileText,
  Building,
  User,
  Hash,
  Paperclip
} from 'lucide-react';
import { Task, Assignee, useKanbanStore } from './hooks/useKanbanStore';
import { useToast } from '@/components/ui/use-toast';

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
  availableCategories: string[];
  availableAssignees: Assignee[];
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: Task['priority'];
  category: string;
  assignees: string[];
  dueDate: string;
  projectId: string;
  estimatedHours: string;
  actualHours: string;
  tags: string[];
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  availableCategories,
  availableAssignees
}: TaskDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();
  const { getSortedColumns } = useKanbanStore();
  
  const columns = getSortedColumns();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'to-do',
    priority: 'Medium',
    category: '',
    assignees: [],
    dueDate: '',
    projectId: '',
    estimatedHours: '',
    actualHours: '',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        assignees: task.assignees,
        dueDate: task.dueDate,
        projectId: task.projectId || '',
        estimatedHours: task.estimatedHours?.toString() || '',
        actualHours: task.actualHours?.toString() || '',
        tags: task.tags || []
      });
    }
    setIsEditing(false);
    setErrors({});
    setNewTag('');
  }, [task]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.estimatedHours && (isNaN(Number(formData.estimatedHours)) || Number(formData.estimatedHours) <= 0)) {
      newErrors.estimatedHours = 'Estimated hours must be a positive number';
    }

    if (formData.actualHours && (isNaN(Number(formData.actualHours)) || Number(formData.actualHours) < 0)) {
      newErrors.actualHours = 'Actual hours must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!task || !validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const updates: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        assignees: formData.assignees,
        dueDate: formData.dueDate,
        projectId: formData.projectId.trim() || undefined,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        actualHours: formData.actualHours ? Number(formData.actualHours) : 0,
        tags: formData.tags
      };

      onTaskUpdate(task.id, updates);
      
      toast({
        title: "Task Updated",
        description: `"${formData.title}" has been updated successfully`,
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        assignees: task.assignees,
        dueDate: task.dueDate,
        projectId: task.projectId || '',
        estimatedHours: task.estimatedHours?.toString() || '',
        actualHours: task.actualHours?.toString() || '',
        tags: task.tags || []
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  // Handle complete
  const handleComplete = () => {
    if (task) {
      onTaskComplete(task.id);
      toast({
        title: "Task Completed",
        description: `"${task.title}" has been marked as completed`,
      });
      onOpenChange(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (task) {
      onTaskDelete(task.id);
      toast({
        title: "Task Deleted",
        description: `"${task.title}" has been deleted`,
      });
      setShowDeleteDialog(false);
      onOpenChange(false);
    }
  };

  // Handle assignee toggle
  const handleAssigneeToggle = (assigneeId: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(assigneeId)
        ? prev.assignees.filter(id => id !== assigneeId)
        : [...prev.assignees, assigneeId]
    }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!task) return null;

  // Get assignee details
  const assigneeDetails = task.assignees.map(assigneeId => 
    availableAssignees.find(a => a.id === assigneeId)
  ).filter(Boolean);

  // Priority styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-sidebar-border';
    }
  };

  // Status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'in-review':
        return 'bg-info/10 text-info border-info/20';
      case 'on-progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'to-do':
        return 'bg-muted text-muted-foreground border-sidebar-border';
      default:
        return 'bg-muted text-muted-foreground border-sidebar-border';
    }
  };

  // Calculate progress
  const progress = task.estimatedHours && task.actualHours 
    ? Math.min((task.actualHours / task.estimatedHours) * 100, 100)
    : 0;

  // Check if overdue
  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();
  const isDueSoon = task.status !== 'completed' && new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:left-auto h-full w-screen sm:w-[50vw] max-w-none translate-x-0 translate-y-0 grid overflow-y-auto rounded-none sm:rounded-lg p-4 sm:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-0 data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95 duration-200">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {isEditing ? 'Edit Task' : 'Task Details'}
              </DialogTitle>
              <div className="flex items-center gap-2 mx-6">
                {!isEditing && (
                  <>
                    {task.status !== 'completed' && (
                      <Button
                        onClick={handleComplete}
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        size="sm"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{task.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            Delete Task
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </>
                )}
                {isEditing && (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90"
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Task Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                          <p className="text-sm text-destructive">{errors.title}</p>
                        )}
                      </div>
                    ) : (
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </Label>
                  {isEditing ? (
                    <>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={errors.description ? 'border-destructive' : ''}
                        rows={4}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive">{errors.description}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">{task.description}</p>
                  )}
                </div>

                {/* Project Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Project ID
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.projectId}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                        placeholder="e.g., NEOM-001"
                      />
                    ) : (
                      <p className="text-muted-foreground">{task.projectId || 'No project ID'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </Label>
                    {isEditing ? (
                      <>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-destructive">{errors.category}</p>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline">{task.category}</Badge>
                    )}
                  </div>
                </div>

                {/* Dates and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className={errors.dueDate ? 'border-destructive' : ''}
                        />
                        {errors.dueDate && (
                          <p className="text-sm text-destructive">{errors.dueDate}</p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className={`${isOverdue ? 'text-destructive' : isDueSoon ? 'text-warning' : 'text-muted-foreground'}`}>
                          {formatDate(task.dueDate)}
                        </p>
                        {isOverdue && <AlertCircle className="w-4 h-4 text-destructive" />}
                        {isDueSoon && !isOverdue && <AlertCircle className="w-4 h-4 text-warning" />}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Tracking
                    </Label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="estimatedHours" className="text-xs text-muted-foreground">Estimated</Label>
                          <Input
                            id="estimatedHours"
                            type="number"
                            value={formData.estimatedHours}
                            onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                            className={errors.estimatedHours ? 'border-destructive' : ''}
                            placeholder="0"
                          />
                          {errors.estimatedHours && (
                            <p className="text-xs text-destructive">{errors.estimatedHours}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="actualHours" className="text-xs text-muted-foreground">Actual</Label>
                          <Input
                            id="actualHours"
                            type="number"
                            value={formData.actualHours}
                            onChange={(e) => setFormData(prev => ({ ...prev, actualHours: e.target.value }))}
                            className={errors.actualHours ? 'border-destructive' : ''}
                            placeholder="0"
                          />
                          {errors.actualHours && (
                            <p className="text-xs text-destructive">{errors.actualHours}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="text-sm">
                          <span className="font-medium">{task.actualHours || 0}h</span>
                          {task.estimatedHours && (
                            <span className="text-muted-foreground"> / {task.estimatedHours}h</span>
                          )}
                        </span>
                        {task.estimatedHours && (
                          <div className="flex-1 max-w-20">
                            <div className="text-xs text-muted-foreground mb-1">
                              {Math.round(progress)}%
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assigned Engineers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Selected Assignees */}
                    {formData.assignees.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Selected Engineers</Label>
                        <div className="flex flex-wrap gap-2">
                          {formData.assignees.map((assigneeId) => {
                            const assignee = availableAssignees.find(a => a.id === assigneeId);
                            return assignee ? (
                              <Badge key={assignee.id} variant="secondary" className="flex items-center gap-2">
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {assignee.initials}
                                  </AvatarFallback>
                                </Avatar>
                                {assignee.name}
                                <button
                                  type="button"
                                  onClick={() => handleAssigneeToggle(assignee.id)}
                                  className="ml-1 hover:bg-destructive/10 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Available Assignees */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Available Engineers</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {availableAssignees.map((assignee) => (
                          <div key={assignee.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`assignee-${assignee.id}`}
                              checked={formData.assignees.includes(assignee.id)}
                              onCheckedChange={() => handleAssigneeToggle(assignee.id)}
                            />
                            <Label 
                              htmlFor={`assignee-${assignee.id}`}
                              className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                            >
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {assignee.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{assignee.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{assignee.role}</div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assigneeDetails.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {assigneeDetails.map((assignee) => (
                          <div key={assignee?.id} className="flex items-center gap-3 p-3 border border-sidebar-border rounded-lg">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {assignee?.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{assignee?.name}</p>
                              <p className="text-xs text-muted-foreground">{assignee?.role}</p>
                              <p className="text-xs text-muted-foreground">{assignee?.department}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No engineers assigned</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Current Tags */}
                    {formData.tags.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Current Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:bg-destructive/10 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Tag */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {task.tags && task.tags.length > 0 ? (
                      task.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No tags</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {task.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border border-sidebar-border rounded-lg">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
