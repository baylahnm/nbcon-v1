import React from 'react';
import { CheckCircle, Clock, AlertTriangle, User, Calendar, Flag } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Widget } from '../types/widget';
import BaseWidget from './BaseWidget';

interface TaskListWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const TaskListWidget: React.FC<TaskListWidgetProps> = ({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  const maxItems = config.maxItems || 10;
  const showFilters = config.showFilters !== false;
  const showPriority = config.showPriority !== false;
  const showDueDate = config.showDueDate !== false;

  // Mock task data
  const tasks = [
    {
      id: 1,
      title: "Structural Assessment - Villa Complex",
      subtitle: "Conduct structural integrity assessment for 15-unit villa complex in Riyadh",
      status: "in-progress",
      priority: "high",
      category: "Structural",
      dueTime: "2:00 PM",
      dueDate: "Dec 18, 2024",
      assignee: { name: "Nasser Baylah", avatar: "AR" },
      progress: 65
    },
    {
      id: 2,
      title: "Bridge Load Analysis",
      subtitle: "Detailed load-bearing analysis for highway bridge maintenance project",
      status: "in-progress",
      priority: "high",
      category: "Civil",
      dueTime: "4:30 PM",
      dueDate: "Dec 20, 2024",
      assignee: { name: "Mohammed Al-Shehri", avatar: "MS" },
      progress: 40
    },
    {
      id: 3,
      title: "Site Inspection - Industrial Facility",
      subtitle: "Safety and compliance inspection for petrochemical plant expansion",
      status: "pending",
      priority: "medium",
      category: "Industrial",
      dueTime: "Tomorrow",
      dueDate: "Dec 19, 2024",
      assignee: { name: "Tariq Al-Harbi", avatar: "TH" },
      progress: 0
    },
    {
      id: 4,
      title: "Foundation Report Review",
      subtitle: "Review and approve foundation design calculations",
      status: "completed",
      priority: "low",
      category: "Structural",
      dueTime: "Completed",
      dueDate: "Dec 15, 2024",
      assignee: { name: "Sarah Al-Mansouri", avatar: "SM" },
      progress: 100
    },
    {
      id: 5,
      title: "MEP System Design",
      subtitle: "Design mechanical, electrical, and plumbing systems",
      status: "pending",
      priority: "medium",
      category: "MEP",
      dueTime: "Next Week",
      dueDate: "Dec 25, 2024",
      assignee: { name: "Ahmed Al-Zahrani", avatar: "AZ" },
      progress: 0
    }
  ];

  const displayedTasks = tasks.slice(0, maxItems);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-info" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-sidebar-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Flag className="w-3 h-3" />;
      case 'medium':
        return <Flag className="w-3 h-3" />;
      case 'low':
        return <Flag className="w-3 h-3" />;
      default:
        return <Flag className="w-3 h-3" />;
    }
  };

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <div className="h-full flex flex-col">
        {/* Filters */}
        {showFilters && (
          <div className="mb-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default" className="text-xs">All</Badge>
              <Badge variant="outline" className="text-xs">In Progress</Badge>
              <Badge variant="outline" className="text-xs">Pending</Badge>
              <Badge variant="outline" className="text-xs">Completed</Badge>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {displayedTasks.map((task) => (
            <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow">
              <div className="space-y-3">
                {/* Task Header */}
                <div className="flex items-start gap-3">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{task.subtitle}</p>
                  </div>
                  {showPriority && (
                    <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                {task.status === 'in-progress' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1" />
                  </div>
                )}

                {/* Task Details */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.assignee.name}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {showDueDate ? task.dueDate : task.dueTime}
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="outline" size="sm" className="w-full text-xs">
                  {task.status === 'completed' ? 'View Details' : 'Update Progress'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-sidebar-border">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            View All Tasks
          </Button>
        </div>
      </div>
    </BaseWidget>
  );
};

export default TaskListWidget;
