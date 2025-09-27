import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ProjectWithDetails } from '@/types/enterprise';
import { useTeamStore } from '@/hooks/useTeamStore';
import { MoreHorizontal, Users, CheckCircle2, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { can } from '@/utils/permissions';

interface ProjectCardProps {
  project: ProjectWithDetails;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { setSelectedProject, setEditingProject, currentUserId, getUserRole, deleteProject } = useTeamStore();
  
  const userRole = getUserRole(project.id, currentUserId);
  const canManage = userRole && can(userRole, 'manage_project');
  
  const handleOpenProject = () => {
    setSelectedProject(project.id);
  };
  
  const handleDeleteProject = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteProject(project.id);
    }
  };
  
  const handleEditProject = () => {
    setEditingProject(project.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-medium line-clamp-1">{project.name}</h3>
              {project.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.subtitle}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={handleEditProject}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    {canManage && (
                      <DropdownMenuItem 
                        onClick={handleDeleteProject}
                        className="text-destructive focus:text-destructive"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleOpenProject}>
                  Open Project
                </DropdownMenuItem>
                {canManage && (
                  <DropdownMenuItem 
                    onClick={handleDeleteProject}
                    className="text-destructive"
                  >
                    Delete Project
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Members */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {project.members.slice(0, 4).map((member) => (
                <Avatar key={member.userId} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={member.user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {member.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{project.members.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.completionPercentage}%</span>
            </div>
            <Progress value={project.completionPercentage} className="h-2" />
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>{project.tasks.filter(t => t.status === 'done').length} completed</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {project.openTasksCount} open
            </Badge>
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={handleOpenProject}
            className="w-full mt-4"
            variant="outline"
          >
            Open Project
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NewProjectCard() {
  const { createProject } = useTeamStore();
  const [isCreating, setIsCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  
  const handleCreate = () => {
    if (name.trim()) {
      createProject(name.trim(), subtitle.trim() || undefined);
      setName('');
      setSubtitle('');
      setIsCreating(false);
    }
  };
  
  const handleCancel = () => {
    setName('');
    setSubtitle('');
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="h-full border-dashed">
          <CardHeader>
            <h3 className="font-medium">New Project</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Project description"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="h-full border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors"
        onClick={() => setIsCreating(true)}
      >
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
          <div className="space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-2xl">+</span>
            </div>
            <h3 className="font-medium">New Project</h3>
            <p className="text-sm text-muted-foreground">
              Create a new project to start collaborating
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}