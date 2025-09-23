import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Building
} from 'lucide-react';
import { Task, Assignee } from './hooks/useKanbanStore';
import { useKanbanStore } from './hooks/useKanbanStore';
import { useToast } from '@/components/ui/use-toast';

interface NewTaskDialogProps {
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  availableCategories: string[];
  availableAssignees: Assignee[];
  defaultStatus?: string;
  trigger?: React.ReactNode;
  title?: string;
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
  tags: string[];
}

export function NewTaskDialog({ 
  onTaskCreate, 
  availableCategories, 
  availableAssignees,
  defaultStatus,
  trigger,
  title = "Create New Task"
}: NewTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();
  const { getSortedColumns } = useKanbanStore();
  
  const columns = getSortedColumns();
  const firstColumn = columns[0];
  const initialStatus = defaultStatus || firstColumn?.id || 'to-do';

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: initialStatus,
    priority: 'Medium',
    category: availableCategories[0] || '',
    assignees: [],
    dueDate: '',
    projectId: '',
    estimatedHours: '',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        status: initialStatus,
        priority: 'Medium',
        category: availableCategories[0] || '',
        assignees: [],
        dueDate: '',
        projectId: '',
        estimatedHours: '',
        tags: []
      });
      setErrors({});
      setNewTag('');
    }
  }, [open, defaultStatus, availableCategories]);

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
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    if (formData.estimatedHours && (isNaN(Number(formData.estimatedHours)) || Number(formData.estimatedHours) <= 0)) {
      newErrors.estimatedHours = 'Estimated hours must be a positive number';
    }

    if (formData.assignees.length === 0) {
      newErrors.assignees = 'At least one assignee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        assignees: formData.assignees,
        dueDate: formData.dueDate,
        projectId: formData.projectId.trim() || undefined,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        actualHours: 0,
        tags: formData.tags,
        attachments: []
      };

      onTaskCreate(taskData);
      
      toast({
        title: "Task Created",
        description: `"${formData.title}" has been created successfully`,
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assignee selection
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

  // Get selected assignees
  const selectedAssignees = availableAssignees.filter(assignee => 
    formData.assignees.includes(assignee.id)
  );

  // Default trigger button
  const defaultTrigger = (
    <Button className="bg-primary hover:bg-primary/90 h-9">
      <Plus className="w-4 h-4 mr-2" />
      New Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the task requirements..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={errors.description ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Task['priority']) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className={errors.dueDate ? 'border-destructive' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.dueDate && (
                  <p className="text-sm text-destructive">{errors.dueDate}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Project Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <h3 className="font-medium">Project Information</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  placeholder="e.g., NEOM-001"
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  placeholder="e.g., 40"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  className={errors.estimatedHours ? 'border-destructive' : ''}
                  min="0"
                />
                {errors.estimatedHours && (
                  <p className="text-sm text-destructive">{errors.estimatedHours}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignees */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <h3 className="font-medium">Assignees *</h3>
            </div>
            
            {errors.assignees && (
              <p className="text-sm text-destructive">{errors.assignees}</p>
            )}

            {/* Selected Assignees */}
            {selectedAssignees.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Selected Engineers</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignees.map((assignee) => (
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
                  ))}
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

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <h3 className="font-medium">Tags</h3>
            </div>
            
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
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Task Preview */}
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="font-medium">Task Preview</h3>
            </div>
            
            <Card className="border-sidebar-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{formData.title || 'Task Title'}</h4>
                  <Badge className={formData.priority === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                                 formData.priority === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' : 
                                 'bg-success/10 text-success border-success/20'}>
                    {formData.priority}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {formData.description || 'Task description will appear here...'}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {formData.category || 'Category'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {columns.find(col => col.id === formData.status)?.title || formData.status}
                  </Badge>
                </div>
                
                {selectedAssignees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {selectedAssignees.slice(0, 3).map((assignee) => (
                        <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {selectedAssignees.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{selectedAssignees.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedAssignees.length} assignee{selectedAssignees.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('en-SA', { month: 'short', day: 'numeric' }) : 'No due date'}</span>
                  </div>
                  {formData.estimatedHours && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formData.estimatedHours}h</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
