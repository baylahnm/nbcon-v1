import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal,
  Paperclip,
  Tag
} from 'lucide-react';
import { Task } from './hooks/useKanbanStore';
import { useKanbanStore } from './hooks/useKanbanStore';

interface ProjectCardProps extends Task {
  onClick?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: Task['status']) => void;
}

export function ProjectCard({ 
  id,
  title,
  description,
  status,
  priority,
  category,
  assignees,
  dueDate,
  createdAt,
  updatedAt,
  projectId,
  estimatedHours,
  actualHours,
  tags,
  attachments,
  onClick,
  onEdit,
  onDelete,
  onMove
}: ProjectCardProps) {
  const { availableAssignees } = useKanbanStore();

  // Get assignee details
  const assigneeDetails = assignees.map(assigneeId => 
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
  const progress = estimatedHours && actualHours 
    ? Math.min((actualHours / estimatedHours) * 100, 100)
    : 0;

  // Check if overdue
  const isOverdue = status !== 'completed' && new Date(dueDate) < new Date();
  const isDueSoon = status !== 'completed' && new Date(dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SA', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 0) return `In ${diffInDays} days`;
    return `${Math.abs(diffInDays)} days ago`;
  };

  return (
    <Card 
      className={`group hover:shadow-md transition-all duration-200 border-sidebar-border ${
        onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
              {title}
            </h4>
            {projectId && (
              <p className="text-xs text-muted-foreground mb-2">
                Project: {projectId}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Category and Priority */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <Badge className={`text-xs ${getPriorityColor(priority)}`}>
            {priority}
          </Badge>
          <Badge className={`text-xs ${getStatusColor(status)}`}>
            {status.replace('-', ' ')}
          </Badge>
        </div>

        {/* Progress Bar */}
        {estimatedHours && actualHours && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {actualHours}h / {estimatedHours}h
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Assignees */}
        {assigneeDetails.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {assigneeDetails.slice(0, 3).map((assignee, index) => (
                <Avatar key={assignee?.id || index} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {assignee?.initials || '??'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assigneeDetails.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{assigneeDetails.length - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {assigneeDetails.length} assignee{assigneeDetails.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Tag className="w-3 h-3 text-muted-foreground" />
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="flex items-center gap-1">
            <Paperclip className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-sidebar-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {/* Due Date */}
            <div className={`flex items-center gap-1 ${
              isOverdue ? 'text-destructive' : 
              isDueSoon ? 'text-warning' : 
              'text-muted-foreground'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(dueDate)}</span>
            </div>

            {/* Time Indicator */}
            {estimatedHours && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{estimatedHours}h</span>
              </div>
            )}
          </div>

          {/* Status Icon */}
          <div className="flex items-center">
            {status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : isOverdue ? (
              <AlertCircle className="w-4 h-4 text-destructive" />
            ) : isDueSoon ? (
              <AlertCircle className="w-4 h-4 text-warning" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-muted" />
            )}
          </div>
        </div>

        {/* Updated Info */}
        <div className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(updatedAt)}
        </div>
      </CardContent>
    </Card>
  );
}
