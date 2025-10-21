import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../1-HomePage/others/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../1-HomePage/others/components/ui/select';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Label } from '../1-HomePage/others/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../1-HomePage/others/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { ScrollArea } from '../1-HomePage/others/components/ui/scroll-area';
import { useTeamStore } from '../2-auth/others/hooks/useTeamStore';
import { ProjectCard, NewProjectCard } from '../1-HomePage/others/components/enterprise/ProjectCard';
import { ProjectDrawer } from '../1-HomePage/others/components/enterprise/ProjectDrawer';
import { EditProjectModal } from '../1-HomePage/others/components/enterprise/EditProjectModal';
import { GlobalKanbanBoard } from '../1-HomePage/others/components/enterprise/GlobalKanbanBoard';
import { TeamMembersList } from '../1-HomePage/others/components/enterprise/TeamMembersList';
import { R, RH } from '../1-HomePage/others/lib/routes';
import { useToast } from '../1-HomePage/others/components/ui/use-toast';
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
  
  const { toast } = useToast();
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
    try {
      // Generate CSV data for time sheet
      const csvData = projects.flatMap(project => 
        project.members.map(member => ({
          'Project': project.name,
          'Team Member': member.user.name,
          'Specialty': member.user.specialty,
          'Role': member.role,
          'Hours': (member.user.yearsOfExperience * 8) % 40 + 24,
          'Overtime': (member.user.yearsOfExperience * 2) % 10,
          'Allocation': `${50 + (member.user.yearsOfExperience % 40)}%`,
          'Status': 'Approved'
        }))
      );

      // Convert to CSV
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `timesheet-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: 'Export Successful', description: 'Time sheet data exported to CSV file.' });
    } catch (error) {
      toast({ title: 'Export Failed', description: 'Failed to export time sheet data.', variant: 'destructive' });
    }
  };

  const handleExportReports = () => {
    try {
      // Generate report data
      const reportData = {
        'Total Projects': projects.length,
        'Active Projects': projects.filter(p => p.completionPercentage < 100).length,
        'Completed Projects': projects.filter(p => p.completionPercentage === 100).length,
        'Total Team Members': projects.reduce((acc, p) => acc + p.members.length, 0),
        'Average Completion': Math.round(projects.reduce((acc, p) => acc + p.completionPercentage, 0) / projects.length) || 0,
        'Total Open Tasks': projects.reduce((acc, p) => acc + p.openTasksCount, 0),
        'Export Date': new Date().toISOString().split('T')[0]
      };

      // Convert to JSON for now (could be PDF/Excel in production)
      const jsonContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `project-reports-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: 'Export Successful', description: 'Project reports exported successfully.' });
    } catch (error) {
      toast({ title: 'Export Failed', description: 'Failed to export project reports.', variant: 'destructive' });
    }
  };

  const handleExportDocuments = () => {
    try {
      // Generate document list
      const documentData = projects.flatMap(project => 
        project.members.slice(0, 2).map((member, index) => ({
          'Document Name': `Document_${project.name.replace(/\s+/g, '_')}_${index + 1}.pdf`,
          'Project': project.name,
          'File Type': 'PDF',
          'Size': `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`,
          'Uploaded By': member.user.name,
          'Upload Date': new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          'Visibility': 'Team'
        }))
      );

      // Convert to CSV
      const headers = Object.keys(documentData[0] || {});
      const csvContent = [
        headers.join(','),
        ...documentData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `documents-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: 'Export Successful', description: 'Document list exported to CSV file.' });
    } catch (error) {
      toast({ title: 'Export Failed', description: 'Failed to export document list.', variant: 'destructive' });
    }
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
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-bold tracking-tight">Team & Projects</h1>
            <p className="text-xs text-muted-foreground">
            Manage team members, project assignments, and track progress across all initiatives
          </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="relative z-10 flex w-fit rounded-lg bg-card border border-border p-1 h-auto">
          <TabsTrigger 
            value="management" 
            className="relative z-10 w-fit h-9 rounded-md sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-xs flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
          >
            {activeTab === 'management' && (
              <motion.span
                layoutId="activeTab"
                className="absolute top-0 left-0 h-9 w-full rounded-md border-4 shadow-sm shadow-primary/50 border-primary bg-primary-gradient"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team & Role Management
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="timesheet" 
            className="relative z-10 w-fit h-8 flex-shrink-0 rounded-md sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-xs flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
          >
            {activeTab === 'timesheet' && (
              <motion.span
                layoutId="activeTab"
                className="absolute top-0 left-0 h-9 w-full rounded-md border-4 shadow-sm shadow-primary/50 border-primary bg-primary-gradient"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Team Time Sheet
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="relative z-10 w-fit h-8 flex-shrink-0 rounded-md sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-xs flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
          >
            {activeTab === 'reports' && (
              <motion.span
                layoutId="activeTab"
                className="absolute top-0 left-0 h-9 w-full rounded-md border-4 shadow-sm shadow-primary/50 border-primary bg-primary-gradient"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Projects Reports
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="relative z-10 w-fit h-8 flex-shrink-0 rounded-md sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-xs flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
          >
            {activeTab === 'documents' && (
              <motion.span
                layoutId="activeTab"
                className="absolute top-0 left-0 h-9 w-full rounded-md border-4 shadow-sm shadow-primary/50 border-primary bg-primary-gradient"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document & File Management
            </span>
          </TabsTrigger>
          </TabsList>

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
              <div onClick={handleCreateProject}>
                <NewProjectCard />
              </div>
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
              <Button variant="outline" className="h-9" onClick={() => setShowTimeSheetFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" className="h-9" onClick={handleExportTimeSheet}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="h-9" onClick={() => window.open('/enterprise/timesheet', '_blank')}>
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
                  <SelectTrigger className="h-9">
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
                <Input placeholder="Search member by name" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label>Date range</Label>
                <Select defaultValue="last-30">
                  <SelectTrigger className="h-9">
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
                <Button variant="outline" className="w-full h-8">Reset</Button>
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
          <Card className="border-0 bg-background">
            <CardHeader className="p-0">
              <CardTitle className="text-base">Team Hours</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <div className="rounded-lg overflow-hidden border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground">Member</TableHead>
                        <TableHead className="text-primary-foreground">Project</TableHead>
                        <TableHead className="text-right text-primary-foreground">Hours</TableHead>
                        <TableHead className="text-right text-primary-foreground">Overtime</TableHead>
                        <TableHead className="text-right text-primary-foreground">Allocation</TableHead>
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
                </div>
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
              <Button variant="outline" className="h-9" onClick={() => setShowReportsFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" className="h-9" onClick={handleExportReports}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="h-9" onClick={() => window.open('/enterprise/analytics', '_blank')}>
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
                  <SelectTrigger className="h-9">
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
                  <SelectTrigger className="h-9">
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
                  <SelectTrigger className="h-9">
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
                <Button variant="outline" className="w-full h-8">Reset</Button>
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
          <Card className="border-0 bg-background">
            <CardHeader className="p-0">
              <CardTitle className="text-base">Project Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="rounded-lg overflow-hidden border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground">Project</TableHead>
                        <TableHead className="text-primary-foreground">Team Size</TableHead>
                        <TableHead className="text-primary-foreground">Progress</TableHead>
                        <TableHead className="text-primary-foreground">Tasks</TableHead>
                        <TableHead className="text-primary-foreground">Status</TableHead>
                        <TableHead className="text-primary-foreground">Last Updated</TableHead>
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
                </div>
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
                  <Button className="h-9" onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar';
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || []);
                      if (files.length > 0) {
                        toast({ 
                          title: 'Files Selected', 
                          description: `${files.length} file(s) selected for upload. Upload functionality will be implemented.` 
                        });
                        // TODO: Implement actual file upload logic
                      }
                    };
                    input.click();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" className="h-9" onClick={() => setShowDocumentsFilters(true)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" className="h-9" onClick={handleExportDocuments}>
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
                  <SelectTrigger className="h-9">
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
                  <SelectTrigger className="h-9">
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
                <Input placeholder="Search files..." className="h-9" />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full h-8">Reset</Button>
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
          <Card className="border-0 bg-background">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Project Files</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="h-9"
                    onClick={() => {
                      toast({ 
                        title: 'Sorting by Date', 
                        description: 'Files sorted by modification date (newest first)' 
                      });
                      // TODO: Implement date sorting logic
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Sort by Date
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-9"
                    onClick={() => {
                      toast({ 
                        title: 'Sorting by Type', 
                        description: 'Files sorted by file type (PDF, DOC, etc.)' 
                      });
                      // TODO: Implement type sorting logic
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Sort by Type
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="rounded-lg overflow-hidden border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground">Name</TableHead>
                        <TableHead className="text-primary-foreground">Project</TableHead>
                        <TableHead className="text-primary-foreground">Type</TableHead>
                        <TableHead className="text-primary-foreground">Size</TableHead>
                        <TableHead className="text-primary-foreground">Modified</TableHead>
                        <TableHead className="text-primary-foreground">Shared By</TableHead>
                        <TableHead className="w-[100px] text-primary-foreground">Actions</TableHead>
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
                            <div className="h-8 w-8 rounded bg-destructive/10 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-destructive" />
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
                            <Button 
                              variant="ghost" 
                              className="h-9 w-9 p-0"
                              onClick={() => {
                                toast({ 
                                  title: 'Download Started', 
                                  description: `Downloading ${file.name}...` 
                                });
                                // TODO: Implement actual download logic
                              }}
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="h-9 w-9 p-0"
                              onClick={() => {
                                toast({ 
                                  title: 'Share Options', 
                                  description: `Sharing options for ${file.name}` 
                                });
                                // TODO: Implement share functionality
                              }}
                              title="Share file"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="h-9 w-9 p-0"
                              onClick={() => {
                                toast({ 
                                  title: 'Preview', 
                                  description: `Opening preview for ${file.name}` 
                                });
                                // TODO: Implement file preview
                              }}
                              title="Preview file"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-8"
                    onClick={() => {
                      toast({ 
                        title: 'Project Templates', 
                        description: 'Opening project templates library...' 
                      });
                      // TODO: Implement project templates
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Project Templates
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-8"
                    onClick={() => {
                      toast({ 
                        title: 'Shared Files', 
                        description: 'Loading files shared with you...' 
                      });
                      // TODO: Implement shared files filter
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Shared with Me
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-8"
                    onClick={() => {
                      toast({ 
                        title: 'Recent Files', 
                        description: 'Loading recently modified files...' 
                      });
                      // TODO: Implement recent files filter
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Recently Modified
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-8"
                    onClick={() => {
                      toast({ 
                        title: 'Important Files', 
                        description: 'Loading important files...' 
                      });
                      // TODO: Implement important files filter
                    }}
                  >
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
              <Button className="h-9" onClick={() => setEditingProject('new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
              <Button variant="outline" className="h-9" onClick={handleCloseCreateProject}>
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
          <div className="mt-6 space-y-6">
            {/* Project Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Project</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
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

            {/* Team Member Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Team Member</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All team members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All team members</SelectItem>
                  {projects.flatMap(p => p.members).map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.user.name} - {member.user.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Date Range</Label>
              <Select defaultValue="last-30">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last-7">Last 7 days</SelectItem>
                  <SelectItem value="last-30">Last 30 days</SelectItem>
                  <SelectItem value="last-90">Last 90 days</SelectItem>
                  <SelectItem value="ytd">Year to date</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Status</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hours Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Hours Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Min hours" type="number" className="h-9" />
                <Input placeholder="Max hours" type="number" className="h-9" />
              </div>
            </div>

            {/* Overtime Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Overtime</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entries</SelectItem>
                  <SelectItem value="overtime">Overtime only</SelectItem>
                  <SelectItem value="regular">Regular hours only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1 h-8">Apply Filters</Button>
              <Button variant="outline" className="flex-1 h-8">Reset</Button>
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
          <div className="mt-6 space-y-6">
            {/* Project Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Project</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
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

            {/* Report Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Report Type</Label>
              <Select defaultValue="overview">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="resource">Resource Utilization</SelectItem>
                  <SelectItem value="quality">Quality Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Period Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Time Period</Label>
              <Select defaultValue="last-30">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7">Last 7 days</SelectItem>
                  <SelectItem value="last-30">Last 30 days</SelectItem>
                  <SelectItem value="last-90">Last 90 days</SelectItem>
                  <SelectItem value="ytd">Year to date</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Project Status</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Team</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All teams</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="project-management">Project Management</SelectItem>
                  <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
                  <SelectItem value="procurement">Procurement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Metrics Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Include Metrics</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="progress" defaultChecked />
                  <Label htmlFor="progress" className="text-sm">Progress Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="budget" defaultChecked />
                  <Label htmlFor="budget" className="text-sm">Budget Analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="timeline" defaultChecked />
                  <Label htmlFor="timeline" className="text-sm">Timeline Analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="quality" />
                  <Label htmlFor="quality" className="text-sm">Quality Metrics</Label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1 h-8">Apply Filters</Button>
              <Button variant="outline" className="flex-1 h-8">Reset</Button>
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
          <div className="mt-6 space-y-6">
            {/* Project Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Project</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
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

            {/* File Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">File Type</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Word Documents</SelectItem>
                  <SelectItem value="xls">Excel Spreadsheets</SelectItem>
                  <SelectItem value="ppt">PowerPoint Presentations</SelectItem>
                  <SelectItem value="img">Images</SelectItem>
                  <SelectItem value="cad">CAD Files</SelectItem>
                  <SelectItem value="zip">Archives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team Member Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Uploaded By</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All team members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All team members</SelectItem>
                  {projects.flatMap(p => p.members).map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.user.name} - {member.user.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Date Range</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-7">Last 7 days</SelectItem>
                  <SelectItem value="last-30">Last 30 days</SelectItem>
                  <SelectItem value="last-90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Size Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">File Size</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sizes</SelectItem>
                  <SelectItem value="small">Small (&lt; 1 MB)</SelectItem>
                  <SelectItem value="medium">Medium (1-10 MB)</SelectItem>
                  <SelectItem value="large">Large (10-100 MB)</SelectItem>
                  <SelectItem value="xlarge">Extra Large (&gt; 100 MB)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visibility Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Visibility</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All files</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="team">Team only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Search</Label>
              <Input placeholder="Search by filename or content..." className="h-9" />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1 h-8">Apply Filters</Button>
              <Button variant="outline" className="flex-1 h-8">Reset</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
