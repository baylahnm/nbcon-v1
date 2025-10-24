import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Avatar, AvatarFallback } from '@/pages/1-HomePage/others/components/ui/avatar';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, differenceInDays, parseISO, isToday } from 'date-fns';
import type { GanttTask } from '../stores/useGanttStore';

interface GanttChartVisualizationProps {
  tasks: GanttTask[];
  onTaskClick?: (taskId: string) => void;
  onTaskUpdate?: (taskId: string, updates: any) => void;
}

export function GanttChartVisualization({ tasks, onTaskClick, onTaskUpdate }: GanttChartVisualizationProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [timelineStart, setTimelineStart] = useState<Date>(new Date());
  const [timelineEnd, setTimelineEnd] = useState<Date>(addMonths(new Date(), 2));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate timeline range from tasks
  useEffect(() => {
    if (tasks.length > 0) {
      const dates = tasks.flatMap(task => [
        task.start_date ? parseISO(task.start_date) : null,
        task.end_date ? parseISO(task.end_date) : null
      ]).filter((date): date is Date => date !== null && !isNaN(date.getTime()));

      if (dates.length > 0) {
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        
        // Add padding
        setTimelineStart(startOfMonth(minDate));
        setTimelineEnd(endOfMonth(addMonths(maxDate, 1)));
      } else {
        // Default to current month + next 2 months if no valid dates
        setTimelineStart(startOfMonth(new Date()));
        setTimelineEnd(endOfMonth(addMonths(new Date(), 2)));
      }
    }
  }, [tasks]);

  // Build hierarchical structure
  const buildTaskHierarchy = () => {
    // Filter out tasks without dates for visualization
    const validTasks = tasks.filter(task => task.start_date && task.end_date);
    const rootTasks = validTasks.filter(task => !task.parent_id);
    
    const getChildren = (parentId: string): GanttTask[] => {
      return validTasks.filter(task => task.parent_id === parentId);
    };

    return rootTasks.map(task => ({
      task,
      children: getChildren(task.id)
    }));
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Generate timeline columns (dates)
  const timelineDays = eachDayOfInterval({ start: timelineStart, end: timelineEnd });
  const totalDays = timelineDays.length;
  const dayWidth = 40; // pixels per day
  
  // Group days by month for header
  const monthGroups = timelineDays.reduce((acc, day) => {
    const monthKey = format(day, 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, Date[]>);

  // Calculate bar position and width
  const getBarStyle = (task: GanttTask) => {
    if (!task.start_date || !task.end_date) return null;

    try {
      const startDate = parseISO(task.start_date);
      const endDate = parseISO(task.end_date);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
      
      const startOffset = differenceInDays(startDate, timelineStart);
      const duration = differenceInDays(endDate, startDate) + 1;
      
      if (startOffset < 0 || startOffset > totalDays) return null;
      if (duration < 1) return null;

      return {
        left: `${startOffset * dayWidth}px`,
        width: `${Math.max(duration * dayWidth, dayWidth)}px` // Minimum 1 day width
      };
    } catch (error) {
      console.error('Error calculating bar style for task:', task.id, error);
      return null;
    }
  };

  // Get task color based on priority/status (theme-aware)
  const getTaskColor = (task: GanttTask) => {
    if (task.is_critical_path) return 'bg-destructive';
    
    switch (task.priority) {
      case 'critical': return 'bg-destructive';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-primary';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  // Get readable color variants for better UX
  const getColorVariants = (task: GanttTask) => {
    if (task.is_critical_path) return {
      bg: 'bg-destructive',
      bgLight: 'bg-destructive/30',
      text: 'text-destructive-foreground'
    };
    
    switch (task.priority) {
      case 'critical': return { bg: 'bg-destructive', bgLight: 'bg-destructive/30', text: 'text-destructive-foreground' };
      case 'high': return { bg: 'bg-warning', bgLight: 'bg-warning/30', text: 'text-warning-foreground' };
      case 'medium': return { bg: 'bg-primary', bgLight: 'bg-primary/30', text: 'text-primary-foreground' };
      case 'low': return { bg: 'bg-success', bgLight: 'bg-success/30', text: 'text-success-foreground' };
      default: return { bg: 'bg-muted', bgLight: 'bg-muted/30', text: 'text-muted-foreground' };
    }
  };

  const hierarchy = buildTaskHierarchy();

  // Render task row
  const renderTaskRow = (task: GanttTask, level: number = 0, children: GanttTask[] = []) => {
    const hasChildren = children.length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const barStyle = getBarStyle(task);

    return (
      <React.Fragment key={task.id}>
        {/* Task row */}
        <div className="flex border-b border-border/30 hover:bg-muted/30 transition-colors">
          {/* Left panel: Task list */}
          <div className="w-80 flex-shrink-0 border-r border-border/30 p-2 flex items-center gap-2" style={{ paddingLeft: `${level * 20 + 8}px` }}>
            {hasChildren && (
              <button
                onClick={() => toggleExpand(task.id)}
                className="hover:bg-muted rounded p-0.5 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium truncate">{task.title}</span>
                {task.is_milestone && (
                  <div className="w-2 h-2 bg-primary rotate-45 flex-shrink-0" title="Milestone" />
                )}
              </div>
            </div>
            
            <span className="text-[10px] text-muted-foreground flex-shrink-0">{task.progress}%</span>
          </div>

          {/* Right panel: Timeline */}
          <div className="flex-1 relative h-12">
            {barStyle && (() => {
              const colors = getColorVariants(task);
              return (
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-8 rounded-md flex items-center px-2 cursor-pointer hover:shadow-md transition-all shadow-sm group"
                  style={{
                    ...barStyle,
                  }}
                  onClick={() => onTaskClick?.(task.id)}
                >
                  {/* Progress fill */}
                  <div
                    className={`absolute inset-0 ${colors.bg} rounded-md`}
                    style={{ width: `${task.progress}%` }}
                  />
                  
                  {/* Task bar background */}
                  <div className={`absolute inset-0 ${colors.bgLight} rounded-md border ${colors.bg.replace('bg-', 'border-')}`} />
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-between w-full z-10 px-1">
                    <span className={`text-[10px] font-semibold drop-shadow ${colors.text}`}>
                      {task.progress}%
                    </span>
                    {/* Avatars for assigned resources */}
                    <div className="flex -space-x-1.5">
                      <Avatar className="h-5 w-5 border-2 border-card shadow-sm">
                        <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                          {task.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Avatar className="h-5 w-5 border-2 border-card shadow-sm">
                        <AvatarFallback className="text-[8px] bg-secondary text-secondary-foreground">
                          +1
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && children.map(child => 
          renderTaskRow(child, level + 1, [])
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card">
      {/* Header with months and dates */}
      <div className="flex border-b border-border/40 bg-muted/30">
        {/* Left panel header */}
        <div className="w-80 flex-shrink-0 border-r border-border/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Task Name</span>
            <span className="text-xs font-semibold">Progress</span>
          </div>
        </div>

        {/* Timeline header */}
        <div className="flex-1 overflow-x-auto" ref={scrollContainerRef}>
          <div style={{ width: `${totalDays * dayWidth}px` }}>
            {/* Month row */}
            <div className="flex border-b border-border/20">
              {Object.entries(monthGroups).map(([monthKey, days]) => (
                <div
                  key={monthKey}
                  className="border-r border-border/20 p-2 text-center bg-muted/20"
                  style={{ width: `${days.length * dayWidth}px` }}
                >
                  <span className="text-xs font-semibold">
                    {format(days[0], 'MMMM yyyy')}
                  </span>
                </div>
              ))}
            </div>

            {/* Date row */}
            <div className="flex border-b border-border/20">
              {timelineDays.map((day, index) => (
                <div
                  key={index}
                  className={`border-r border-border/20 p-1 text-center ${
                    isToday(day) ? 'bg-primary/10' : ''
                  }`}
                  style={{ width: `${dayWidth}px` }}
                >
                  <span className="text-[10px] font-medium">
                    {format(day, 'd')}
                  </span>
                </div>
              ))}
            </div>

            {/* Weekday row */}
            <div className="flex">
              {timelineDays.map((day, index) => (
                <div
                  key={index}
                  className="border-r border-border/20 p-1 text-center bg-muted/10"
                  style={{ width: `${dayWidth}px` }}
                >
                  <span className="text-[9px] text-muted-foreground">
                    {format(day, 'EEEEE')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task rows with timeline */}
      <div className="relative">
        {/* Current date indicator line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
          style={{
            left: `${80 * 4 + differenceInDays(new Date(), timelineStart) * dayWidth}px`,
          }}
        />

        <div className="flex flex-col gap-0">
          {hierarchy.map(({ task, children }) => renderTaskRow(task, 0, children))}
          
          {tasks.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <p className="text-sm">No tasks to display</p>
              <p className="text-xs mt-1">Add tasks to see them on the timeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

