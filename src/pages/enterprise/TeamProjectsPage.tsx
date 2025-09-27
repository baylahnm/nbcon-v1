import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTeamStore } from '@/hooks/useTeamStore';
import { ProjectCard, NewProjectCard } from '@/components/enterprise/ProjectCard';
import { ProjectDrawer } from '@/components/enterprise/ProjectDrawer';
import { EditProjectModal } from '@/components/enterprise/EditProjectModal';
import { GlobalKanbanBoard } from '@/components/enterprise/GlobalKanbanBoard';
import { TeamMembersList } from '@/components/enterprise/TeamMembersList';
import { R, RH } from '@/lib/routes';
import { 
  Clock, 
  Users, 
  BarChart3, 
  FileText,
  Calendar,
  Target,
  DollarSign,
  Plus,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';

export function TeamProjectsPage() {
  const { 
    getProjectsWithDetails, 
    selectedProject, 
    setSelectedProject,
    editingProject,
    setEditingProject
  } = useTeamStore();
  
  const projects = getProjectsWithDetails();

  // URL sync for tabs and modals
  const [activeTab, setActiveTab] = useState('management');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTimeSheetFilters, setShowTimeSheetFilters] = useState(false);
  const [showReportsFilters, setShowReportsFilters] = useState(false);
  const [showDocumentsFilters, setShowDocumentsFilters] = useState(false);

  // URL parameter management
  const updateQuery = (params: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  };

  // Initialize from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const tab = url.searchParams.get('tab') || 'management';
    const create = url.searchParams.get('create') === 'true';
    const filters = url.searchParams.get('filters') === 'true';
    
    setActiveTab(tab);
    setShowCreateProject(create);
    setShowFilters(filters);
  }, []);

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateQuery({ tab: value });
  };

  // Create project handler
  const handleCreateProject = () => {
    setShowCreateProject(true);
    updateQuery({ create: 'true' });
  };

  // Close create project handler
  const handleCloseCreateProject = () => {
    setShowCreateProject(false);
    updateQuery({ create: undefined });
  };

  // Export handlers
  const handleExportTimeSheet = () => {
    // Implement time sheet export
    console.log('Exporting time sheet...');
  };

  const handleExportReports = () => {
    // Implement reports export
    console.log('Exporting reports...');
  };

  const handleExportDocuments = () => {
    // Implement documents export
    console.log('Exporting documents...');
  };

  const TabPlaceholder = ({ 
    title, 
    icon: Icon, 
    description, 
    actions 
  }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    description: string; 
    actions?: React.ReactNode;
  }) => (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actions}
      </div>

      {/* Content area */}
    <div className="flex-1 flex items-center justify-center min-h-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {description}
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team & Projects
          </h1>
          <p className="text-muted-foreground">
            Manage team members, project assignments, and track progress across all initiatives
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
              <TabsTrigger value="management" className="flex items-center gap-2 px-4 py-3 min-w-fit">Team & Role Management</TabsTrigger>
              <TabsTrigger value="timesheet" className="flex items-center gap-2 px-4 py-3 min-w-fit">Team Time Sheet</TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2 px-4 py-3 min-w-fit">Projects Reports</TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2 px-4 py-3 min-w-fit">Document & File Management</TabsTrigger>
            </div>
          </TabsList>
        </div>

        <TabsContent value="management" className="space-y-6">
          {/* Team Members Section */}
          <TeamMembersList />
          
          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-8 border-t border-border"
          >
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold">Projects</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage your team projects
              </p>
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <NewProjectCard onClick={handleCreateProject} />
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: (index + 1) * 0.1 
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-12"
              >
                <div className="space-y-3">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <span className="text-3xl">📋</span>
                  </div>
                  <h4 className="font-medium">No Projects Yet</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Get started by creating your first project. You can add team members, 
                    assign tasks, and track progress all in one place.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Kanban Board Section */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8 border-t border-border"
            >
              <GlobalKanbanBoard />
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="timesheet" className="space-y-6">
          {/* Header + Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Team Time Sheet</h2>
              <p className="text-muted-foreground">Track team member working hours, overtime, and time allocation across projects. Advanced time tracking and reporting tools coming soon.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTimeSheetFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportTimeSheet}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => window.open(RH.enterprise.timeSheet(), '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Page
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Quick Filters</h3>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team member</Label>
                <Input placeholder="Search member by name" />
              </div>
              <div className="space-y-2">
                <Label>Date range</Label>
                <Select defaultValue="last-30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7">Last 7 days</SelectItem>
                    <SelectItem value="last-30">Last 30 days</SelectItem>
                    <SelectItem value="last-90">Last 90 days</SelectItem>
                    <SelectItem value="ytd">Year to date</SelectItem>
                    <SelectItem value="custom">Custom...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full">Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">312h</div>
                <p className="text-xs text-muted-foreground">Across all members in range</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overtime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28h</div>
                <p className="text-xs text-muted-foreground">&gt; 8h per day counted</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">Billable / total capacity</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Hours Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[480px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Overtime</TableHead>
                      <TableHead className="text-right">Allocation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.flatMap((p) => (
                      p.members.map((m) => (
                        <TableRow key={`${p.id}-${m.userId}`} className="hover:bg-accent/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={m.user.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground">{m.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="space-y-0.5">
                                <div className="font-medium leading-tight">{m.user.name}</div>
                                <div className="text-xs text-muted-foreground">{m.user.specialty}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{p.name}</Badge>
                              <span className="text-xs text-muted-foreground capitalize">{m.role}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{(m.user.yearsOfExperience * 8) % 40 + 24}h</TableCell>
                          <TableCell className="text-right">{(m.user.yearsOfExperience * 2) % 10}h</TableCell>
                          <TableCell className="text-right">{50 + (m.user.yearsOfExperience % 40)}%</TableCell>
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Header + Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Projects Reports</h2>
              <p className="text-muted-foreground">Comprehensive project analytics, progress reports, and performance metrics. Advanced reporting dashboard coming soon.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowReportsFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportReports}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => window.open(RH.enterprise.analytics(), '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Page
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Report Filters</h3>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Period</Label>
                <Select defaultValue="last-30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7">Last 7 days</SelectItem>
                    <SelectItem value="last-30">Last 30 days</SelectItem>
                    <SelectItem value="last-90">Last 90 days</SelectItem>
                    <SelectItem value="ytd">Year to date</SelectItem>
                    <SelectItem value="custom">Custom...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select defaultValue="overview">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full">Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.members.length, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Avg. Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(projects.reduce((acc, p) => acc + p.completionPercentage, 0) / projects.length) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">Average across projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Open Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((acc, p) => acc + p.openTasksCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Pending completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-accent/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{project.name}</div>
                            <div className="text-xs text-muted-foreground">{project.subtitle}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{project.members.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${project.completionPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{project.completionPercentage}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{project.tasks.length} total</div>
                            <div className="text-xs text-muted-foreground">
                              {project.openTasksCount} open, {project.tasks.length - project.openTasksCount} done
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={project.completionPercentage === 100 ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {project.completionPercentage === 100 ? "Completed" : "In Progress"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Team Performance by Project */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.flatMap(p => p.members).slice(0, 5).map((member, index) => (
                    <div key={`${member.projectId}-${member.userId}`} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{member.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{member.user.name}</div>
                        <div className="text-xs text-muted-foreground">{member.user.specialty}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">85%</div>
                        <div className="text-xs text-muted-foreground">efficiency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{project.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Header + Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Document & File Management</h2>
              <p className="text-muted-foreground">Centralized document storage, file sharing, and collaborative document management system coming soon.</p>
            </div>
          </div>

          {/* Quick Actions & Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Quick Actions & Filters</h3>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDocumentsFilters(true)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportDocuments}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All projects</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Word</SelectItem>
                    <SelectItem value="xls">Excel</SelectItem>
                    <SelectItem value="ppt">PowerPoint</SelectItem>
                    <SelectItem value="img">Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Search</Label>
                <Input placeholder="Search files..." />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full">Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* Storage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Total Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">Documents stored</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Storage Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <p className="text-xs text-muted-foreground">of 10 GB used</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Shared Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">With team members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Uploads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* File Browser */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Project Files</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Sort by Date
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Sort by Type
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Modified</TableHead>
                      <TableHead>Shared By</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.flatMap(project => 
                      project.members.slice(0, 2).map((member, index) => ({
                        id: `${project.id}-${member.userId}-${index}`,
                        name: `Document_${project.name.replace(/\s+/g, '_')}_${index + 1}.pdf`,
                        project: project.name,
                        type: 'PDF',
                        size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`,
                        modified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                        sharedBy: member.user.name,
                        member
                      }))
                    ).map((file) => (
                      <TableRow key={file.id} className="hover:bg-accent/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-red-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium">{file.name}</div>
                              <div className="text-xs text-muted-foreground">Document</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{file.project}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{file.size}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{file.modified}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={file.member.user.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground">{file.member.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{file.sharedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Activity & Quick Access */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 4).map((project, index) => (
                    <div key={project.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {project.members[0]?.user.name} uploaded a file
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.name} • {new Date(Date.now() - index * 2 * 60 * 60 * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Project Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Shared with Me
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Recently Modified
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Important Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Drawer */}
      {selectedProject && (
        <ProjectDrawer
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          projectId={selectedProject}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          projectId={editingProject}
        />
      )}

      {/* Create Project Sheet */}
      <Sheet open={showCreateProject} onOpenChange={handleCloseCreateProject}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Create New Project</SheetTitle>
            <SheetDescription>
              Set up a new project with team members, timeline, and objectives.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Project creation form will be implemented here. For now, you can use the existing project creation flow.
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setEditingProject('new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
              <Button variant="outline" onClick={handleCloseCreateProject}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Time Sheet Filters Sheet */}
      <Sheet open={showTimeSheetFilters} onOpenChange={setShowTimeSheetFilters}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Time Sheet Filters</SheetTitle>
            <SheetDescription>
              Filter time entries by team member, project, date range, and status.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Advanced time sheet filtering options coming soon.
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Reports Filters Sheet */}
      <Sheet open={showReportsFilters} onOpenChange={setShowReportsFilters}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Reports Filters</SheetTitle>
            <SheetDescription>
              Filter project reports by team, project status, date range, and metrics.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Advanced reporting filters coming soon.
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Documents Filters Sheet */}
      <Sheet open={showDocumentsFilters} onOpenChange={setShowDocumentsFilters}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Document Filters</SheetTitle>
            <SheetDescription>
              Filter documents by type, project, team member, and date range.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Document management filters coming soon.
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}