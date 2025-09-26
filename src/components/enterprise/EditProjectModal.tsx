import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  X, 
  Users, 
  Crown, 
  Settings,
  Trash2,
  UserMinus
} from 'lucide-react';
import { useTeamStore } from '@/hooks/useTeamStore';
import { ProjectRole } from '@/types/enterprise';
import { can, getRoleColor } from '@/utils/permissions';
import { toast } from 'sonner';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function EditProjectModal({ isOpen, onClose, projectId }: EditProjectModalProps) {
  const { 
    getProjectById, 
    updateProject, 
    deleteProject, 
    updateMemberRole, 
    removeMember,
    currentUserId 
  } = useTeamStore();
  
  const project = getProjectById(projectId);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with project data
  useEffect(() => {
    if (project) {
      setName(project.name);
      setSubtitle(project.subtitle || '');
      setDescription(project.description || '');
    }
  }, [project]);
  
  if (!project) return null;
  
  const currentUserRole = project.members.find(m => m.userId === currentUserId)?.role;
  const canEdit = can(currentUserRole, 'update', 'project');
  const canDelete = can(currentUserRole, 'delete', 'project');
  const canManageMembers = can(currentUserRole, 'manage', 'members');
  
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    setIsLoading(true);
    try {
      updateProject(projectId, {
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        description: description.trim() || undefined,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Project updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProject = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
      toast.success('Project deleted successfully');
      onClose();
    }
  };
  
  const handleRoleChange = (userId: string, newRole: ProjectRole) => {
    updateMemberRole(projectId, userId, newRole);
    toast.success('Member role updated');
  };
  
  const handleRemoveMember = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to remove ${userName} from this project?`)) {
      removeMember(projectId, userId);
      toast.success(`${userName} removed from project`);
    }
  };
  
  const getRoleIcon = (role: ProjectRole) => {
    if (role === 'owner') return <Crown className="h-3 w-3" />;
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed right-0 top-0 h-svh w-[50vw] max-w-none translate-x-0 translate-y-0 left-auto grid overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Edit Project
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 p-1">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <h3 className="font-medium">Project Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Brief project description"
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed project description"
                    rows={4}
                    disabled={!canEdit}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Team Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Members ({project.members.length})
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.members.map((member) => (
                    <motion.div
                      key={member.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{member.user.name}</p>
                            {member.userId === project.ownerId && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getRoleColor(member.role)} flex items-center gap-1`}
                        >
                          {getRoleIcon(member.role)}
                          {member.role}
                        </Badge>
                        
                        {canManageMembers && member.userId !== project.ownerId && member.userId !== currentUserId && (
                          <div className="flex items-center gap-1">
                            <Select
                              value={member.role}
                              onValueChange={(role: ProjectRole) => handleRoleChange(member.userId, role)}
                            >
                              <SelectTrigger className="w-20 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="engineer">Engineer</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.userId, member.user.name)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Project Stats */}
            <Card>
              <CardHeader>
                <h3 className="font-medium">Project Statistics</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-semibold text-blue-600">{project.tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-semibold text-green-600">
                      {project.tasks.filter(t => t.status === 'done').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-semibold text-yellow-600">
                      {project.tasks.filter(t => t.status === 'in_progress').length}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-semibold">{project.members.length}</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {canDelete && (
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Project
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {canEdit && (
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !name.trim()}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}