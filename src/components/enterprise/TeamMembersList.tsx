import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  Building, 
  Award, 
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useTeamStore } from '@/hooks/useTeamStore';
import { User, ProjectRole } from '@/types/enterprise';
import { getRoleColor } from '@/utils/permissions';
import { toast } from 'sonner';

export function TeamMembersList() {
  const { users, getProjectsWithDetails, addProjectMember, currentUserId } = useTeamStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'free' | 'busy'>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<ProjectRole>('viewer');
  const [isAddToProjectOpen, setIsAddToProjectOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  
  const projects = getProjectsWithDetails();
  const userProjects = projects.filter(p => 
    p.members.some(m => m.userId === currentUserId)
  );
  
  // Get unique specialties for filter
  const specialties = Array.from(new Set(users.map(user => user.specialty)));
  
  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = availabilityFilter === 'all' || user.availabilityStatus === availabilityFilter;
    const matchesSpecialty = specialtyFilter === 'all' || user.specialty === specialtyFilter;
    
    return matchesSearch && matchesAvailability && matchesSpecialty;
  });
  
  const handleAddToProject = (member: User) => {
    setSelectedMember(member);
    setIsAddToProjectOpen(true);
  };
  
  const handleConfirmAddToProject = () => {
    if (selectedMember && selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      const isAlreadyMember = project?.members.some(m => m.userId === selectedMember.id);
      
      if (isAlreadyMember) {
        toast.error(`${selectedMember.name} is already a member of this project`);
      } else {
        addProjectMember(selectedProject, selectedMember.id, selectedRole);
        toast.success(`Added ${selectedMember.name} to ${project?.name}`);
        setIsAddToProjectOpen(false);
        setSelectedMember(null);
        setSelectedProject('');
        setSelectedRole('viewer');
      }
    }
  };
  
  const getAvailabilityIcon = (status: 'busy' | 'free') => {
    return status === 'free' 
      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
      : <XCircle className="h-4 w-4 text-red-500" />;
  };
  
  const getAvailabilityColor = (status: 'busy' | 'free') => {
    return status === 'free' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your team and add members to projects
          </p>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filter & Search</h3>
              <Badge variant="secondary">
                {filteredUsers.length} of {users.length} members
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Availability Filter */}
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={availabilityFilter} onValueChange={(value: 'all' | 'free' | 'busy') => setAvailabilityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="free">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Specialty Filter */}
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Clear Filters */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setAvailabilityFilter('all');
                    setSpecialtyFilter('all');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <h3 className="font-medium">Team Directory</h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((member) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="group hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div 
                              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                                member.isOnline ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              title={member.isOnline ? 'Online' : 'Offline'}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{member.specialty}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{member.yearsOfExperience} years</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{member.company}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{member.phoneNumber}</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${getAvailabilityColor(member.availabilityStatus)} flex items-center gap-1 w-fit`}
                        >
                          {getAvailabilityIcon(member.availabilityStatus)}
                          {member.availabilityStatus === 'free' ? 'Available' : 'Busy'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToProject(member)}
                          disabled={userProjects.length === 0}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              
              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No team members found matching your criteria</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Add to Project Dialog */}
      <Dialog open={isAddToProjectOpen} onOpenChange={setIsAddToProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member to Project</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback>
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMember.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.specialty}</p>
                </div>
              </div>
              
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">Select Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {userProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Assign Role</Label>
                <Select value={selectedRole} onValueChange={(role: ProjectRole) => setSelectedRole(role)}>
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
              
              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddToProjectOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmAddToProject}
                  disabled={!selectedProject}
                >
                  Add to Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}