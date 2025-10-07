import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useCalendarStore } from '../../stores/useCalendarStore';
import { 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle, 
  Timer,
  Eye,
  UserPlus,
  Trash2
} from 'lucide-react';
import { useTeamStore } from '../../../../2-auth/others/hooks/useTeamStore';
import { TaskModal } from './TaskModal';
import { ProjectRole, TaskStatus, TaskWithDetails } from '../../types/enterprise';
import { can, canModifyTask, getPriorityColor, getStatusColor, getRoleColor } from '../../utils/permissions';
import { toast } from 'sonner';
import { R } from '../../lib/routes';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function ProjectDrawer({ isOpen, onClose, projectId }: ProjectDrawerProps) {
  const { 
    getProjectById, 
    getTasksForProject, 
    currentUserId, 
    getUserRole,
    updateTask,
    addProjectMember,
    updateMemberRole,
    removeMember,
    users
  } = useTeamStore();
  
  const navigate = useNavigate();
  const getEventTypeColor = useCalendarStore(state => state.getEventTypeColor);
  const projectCalendarEvents = useCalendarStore(state => state.getEventsForProject(projectId));
  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return projectCalendarEvents
      .filter(event => event.endTime.getTime() >= now)
      .slice(0, 3);
  }, [projectCalendarEvents]);
  
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | undefined>();
  const [taskModalMode, setTaskModalMode] = useState<'create' | 'edit'>('create');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>('viewer');
  
  const project = getProjectById(projectId);
  const tasks = getTasksForProject(projectId);
  const userRole = getUserRole(projectId, currentUserId);
  
  if (!project) return null;
  
  const canManageProject = userRole && can(userRole, 'manage_project');
  const canManageMembers = userRole && can(userRole, 'manage_members');
  const canCreateTask = userRole && can(userRole, 'create_task');
  
  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setTaskModalMode('create');
    setIsTaskModalOpen(true);
  };
  
  const handleEditTask = (task: TaskWithDetails) => {
    setSelectedTask(task);
    setTaskModalMode('edit');
    setIsTaskModalOpen(true);
  };
  
  const handleQuickStatusUpdate = (taskId: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && canModifyTask(userRole!, currentUserId, task.createdBy, task.assignees.map(a => a.id))) {
      updateTask(taskId, { status });
      if (status === 'done') {
        updateTask(taskId, { progress: 100 });
        toast.success('🎉 Task completed!');
      }
    }
  };
  
  const handleAddMember = () => {
    if (!newMemberEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    // In a real app, you'd search for users by email
    // For now, we'll simulate adding a random user
    const availableUsers = users.filter(u => 
      !project.members.some(m => m.userId === u.id)
    );
    
    if (availableUsers.length > 0) {
      const randomUser = availableUsers[0];
      addProjectMember(projectId, randomUser.id, newMemberRole);
      setNewMemberEmail('');
      setNewMemberRole('viewer');
      toast.success(`Added ${randomUser.name} to the project`);
    } else {
      toast.error('No available users to add');
    }
  };
  
  const handleRemoveMember = (userId: string) => {
    const member = project.members.find(m => m.userId === userId);
    if (member && window.confirm(`Remove ${member.user.name} from the project?`)) {
      removeMember(projectId, userId);
      toast.success('Member removed from project');
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
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
  
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done')
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <div>
                <h2>{project.name}</h2>
                {project.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{project.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => window.location.assign(`/enterprise/team-projects/${project.id}`)}>
                  Open full page
                </Button>
                {canCreateTask && (
                  <Button onClick={handleCreateTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                )}
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Schedule
                  </div>
                  <p className="text-sm text-muted-foreground">Synced from the shared calendar</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`${R.enterprise.calendar}?project=${projectId}`)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-1">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.startTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          {' - '}
                          {event.allDay
                            ? 'All day'
                            : `${event.startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${event.endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs capitalize ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {event.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="tasks" className="mt-6">
            <div className="border-b border-sidebar-border mb-6">
              <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
                <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                  <TabsTrigger value="tasks" className="flex items-center gap-2 px-4 py-3 min-w-fit">Tasks</TabsTrigger>
                <TabsTrigger value="board" className="flex items-center gap-2 px-4 py-3 min-w-fit">Board</TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2 px-4 py-3 min-w-fit">Members</TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2 px-4 py-3 min-w-fit">Activity</TabsTrigger>
                </div>
              </TabsList>
            </div>
            
            {/* Tasks Tab */}
            <TabsContent value="tasks" className="mt-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assignees</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id} className="cursor-pointer hover:bg-accent/50">
                        <TableCell onClick={() => handleEditTask(task)}>
                          <div className="space-y-1">
                            <p className="font-medium line-clamp-1">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {task.assignees.slice(0, 3).map((assignee) => (
                              <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {task.assignees.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs">+{task.assignees.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={task.status}
                            onValueChange={(status: TaskStatus) => handleQuickStatusUpdate(task.id, status)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(task.status)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">To Do</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={task.progress} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground w-8">
                              {task.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            
            {/* Board Tab */}
            <TabsContent value="board" className="mt-6">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-4 gap-4 p-[16px]">
                  {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium capitalize flex items-center gap-2">
                          {getStatusIcon(status as TaskStatus)}
                          {status.replace('_', ' ')}
                        </h3>
                        <Badge variant="secondary">{statusTasks.length}</Badge>
                      </div>
                      <div className="space-y-2 min-h-[200px]">
                        <AnimatePresence>
                          {statusTasks.map((task) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card 
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleEditTask(task)}
                              >
                                <CardHeader className="p-3">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-sm line-clamp-2">
                                      {task.title}
                                    </h4>
                                    <div className="flex items-center justify-between">
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${getPriorityColor(task.priority)}`}
                                      >
                                        {task.priority}
                                      </Badge>
                                      {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Calendar className="h-3 w-3" />
                                          {formatDate(task.dueDate)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span>{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-1" />
                                    <div className="flex -space-x-1">
                                      {task.assignees.slice(0, 2).map((assignee) => (
                                        <Avatar key={assignee.id} className="h-5 w-5 border border-background">
                                          <AvatarImage src={assignee.avatar} />
                                          <AvatarFallback className="text-xs">
                                            {assignee.name.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                      ))}
                                      {task.assignees.length > 2 && (
                                        <div className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center">
                                          <span className="text-xs">+{task.assignees.length - 2}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Members Tab */}
            <TabsContent value="members" className="mt-6">
              <div className="space-y-6">
                {canManageMembers && (
                  <Card>
                    <CardHeader>
                      <h3 className="font-medium">Add Member</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <Label htmlFor="memberEmail">Email</Label>
                          <Input
                            id="memberEmail"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="user@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberRole">Role</Label>
                          <Select value={newMemberRole} onValueChange={(role: ProjectRole) => setNewMemberRole(role)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="engineer">Engineer</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleAddMember} className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Project Members ({project.members.length})
                  </h3>
                  
                  <div className="space-y-2">
                    {project.members.map((member) => (
                      <div 
                        key={member.userId}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.user.avatar} />
                            <AvatarFallback>
                              {member.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.user.name}</p>
                            <p className="text-sm text-muted-foreground">{member.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {canManageMembers && member.role !== 'owner' ? (
                            <Select
                              value={member.role}
                              onValueChange={(role: ProjectRole) => updateMemberRole(projectId, member.userId, role)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="engineer">Engineer</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="secondary" className={getRoleColor(member.role)}>
                              {member.role}
                            </Badge>
                          )}
                          
                          {canManageMembers && member.role !== 'owner' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  {tasks.slice(0, 10).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded border">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p>
                            <span className="font-medium">{task.creator.name}</span>
                            {' '}created task{' '}
                            <span className="font-medium">"{task.title}"</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(task.createdAt)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projectId={projectId}
        mode={taskModalMode}
      />
    </>
  );
}
