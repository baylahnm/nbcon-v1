import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { 
  CheckCircle2, 
  Circle, 
  Timer, 
  Eye, 
  Calendar, 
  Plus,
  Filter
} from 'lucide-react';
import { useTeamStore } from '../../../../2-auth/others/hooks/useTeamStore';
import { TaskModal } from './TaskModal';
import { TaskStatus, TaskWithDetails, ProjectWithDetails } from '../../../../6-enterprise/others/types/EnterpriseTypes';
import { can, canModifyTask, getPriorityColor, getStatusColor } from '../../utils/permissions';
import { toast } from 'sonner';

export function GlobalKanbanBoard() {
  const { 
    getProjectsWithDetails, 
    currentUserId, 
    getUserRole,
    updateTask
  } = useTeamStore();
  
  const [selectedTask, setSelectedTask] = useState<(TaskWithDetails & { project: ProjectWithDetails }) | undefined>();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  
  const projects = getProjectsWithDetails();
  const userProjects = projects.filter(p => 
    p.members.some(m => m.userId === currentUserId)
  );
  
  // Get all tasks from all projects or filtered project
  const allTasks = selectedProject === 'all' 
    ? userProjects.flatMap(p => p.tasks.map(t => ({ ...t, project: p })))
    : userProjects.find(p => p.id === selectedProject)?.tasks.map(t => ({ 
        ...t, 
        project: userProjects.find(p => p.id === selectedProject)! 
      })) || [];
  
  const tasksByStatus = {
    todo: allTasks.filter(t => t.status === 'todo'),
    in_progress: allTasks.filter(t => t.status === 'in_progress'),
    review: allTasks.filter(t => t.status === 'review'),
    done: allTasks.filter(t => t.status === 'done')
  };
  
  const handleEditTask = (task: TaskWithDetails & { project: ProjectWithDetails }) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleQuickStatusUpdate = (task: TaskWithDetails & { project: ProjectWithDetails }, status: TaskStatus) => {
    const userRole = getUserRole(task.project.id, currentUserId);
    if (userRole && canModifyTask(task, userRole)) {
      updateTask(task.id, { status });
      if (status === 'done') {
        updateTask(task.id, { progress: 100 });
        toast.success('🎉 Task completed!');
      }
    }
  };
  
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Timer className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusTitle = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return status;
    }
  };

  if (userProjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No projects available</p>
      </div>
    );
  }

  return (
    <>

      
      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(undefined);
          }}
          task={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description || '',
            priority: (selectedTask.priority || 'Medium') as 'High' | 'Medium' | 'Low',
            status: selectedTask.status === 'todo' ? 'Pending' : 
                    selectedTask.status === 'in_progress' ? 'In Progress' : 
                    selectedTask.status === 'done' ? 'Completed' : 'Pending',
            assignee: selectedTask.assignees?.[0]?.name || '',
            dueDate: selectedTask.dueDate || ''
          }}
          projectId={selectedTask.project.id}
        />
      )}
    </>
  );
}
