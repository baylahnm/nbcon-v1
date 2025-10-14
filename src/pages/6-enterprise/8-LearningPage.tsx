import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/pages/1-HomePage/others/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/pages/1-HomePage/others/components/ui/table';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { Label } from '@/pages/1-HomePage/others/components/ui/label';
import { R, RH } from '../1-HomePage/others/lib/routes';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Target,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  BarChart3,
  Activity,
  Trophy,
  Timer
} from 'lucide-react';
import { cn } from '../1-HomePage/others/lib/utils';

interface EmployeePerformance {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  position: string;
  attendance: number;
  efficiency: number;
  tasksCompleted: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

interface ProjectPerformance {
  id: string;
  name: string;
  progress: number;
  target: number;
  status: 'on-track' | 'delayed' | 'ahead' | 'critical';
  daysLeft: number;
  budget: number;
  budgetUsed: number;
  team: number;
}

interface DepartmentHeatmap {
  department: string;
  projects: number;
  efficiency: number;
  satisfaction: number;
  deliveryRate: number;
}

export function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this-month');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('employers');
  
  // Sheet states for right-side panels
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<string | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

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
    const tab = url.searchParams.get('tab') || 'employers';
    const employee = url.searchParams.get('employee');
    const project = url.searchParams.get('project');
    const analytics = url.searchParams.get('analytics') === 'true';
    const filters = url.searchParams.get('filters') === 'true';
    const exportOptions = url.searchParams.get('export') === 'true';
    
    setActiveTab(tab);
    setShowEmployeeDetails(employee);
    setShowProjectDetails(project);
    setShowAnalytics(analytics);
    setShowFilters(filters);
    setShowExportOptions(exportOptions);
  }, []);

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateQuery({ tab: value });
  };

  // Employee actions
  const handleViewEmployee = (employeeId: string) => {
    setShowEmployeeDetails(employeeId);
    updateQuery({ employee: employeeId });
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(null);
    updateQuery({ employee: undefined });
  };

  // Project actions
  const handleViewProject = (projectId: string) => {
    setShowProjectDetails(projectId);
    updateQuery({ project: projectId });
  };

  const handleCloseProjectDetails = () => {
    setShowProjectDetails(null);
    updateQuery({ project: undefined });
  };

  // Export handlers
  const handleExportReport = () => {
    setShowExportOptions(true);
    updateQuery({ export: 'true' });
  };

  const handleCloseExportOptions = () => {
    setShowExportOptions(false);
    updateQuery({ export: undefined });
  };

  // Sample employee performance data
  const employeePerformance: EmployeePerformance[] = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      department: 'Engineering',
      position: 'Senior Engineer',
      attendance: 95,
      efficiency: 87,
      tasksCompleted: 24,
      rating: 4.8,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      department: 'Engineering',
      position: 'Project Manager',
      attendance: 92,
      efficiency: 91,
      tasksCompleted: 18,
      rating: 4.9,
      trend: 'up'
    },
    {
      id: '3',
      name: 'Mohammed Al-Otaibi',
      department: 'Engineering',
      position: 'Mechanical Engineer',
      attendance: 88,
      efficiency: 76,
      tasksCompleted: 20,
      rating: 4.3,
      trend: 'down'
    },
    {
      id: '4',
      name: 'Fatima Al-Zahra',
      department: 'Human Resources',
      position: 'HR Specialist',
      attendance: 97,
      efficiency: 85,
      tasksCompleted: 15,
      rating: 4.6,
      trend: 'stable'
    },
    {
      id: '5',
      name: 'Omar Al-Mansouri',
      department: 'Finance',
      position: 'Finance Manager',
      attendance: 93,
      efficiency: 89,
      tasksCompleted: 22,
      rating: 4.7,
      trend: 'up'
    }
  ];

  // Sample project performance data
  const projectPerformance: ProjectPerformance[] = [
    {
      id: '1',
      name: 'NEOM Smart City',
      progress: 78,
      target: 80,
      status: 'on-track',
      daysLeft: 45,
      budget: 2500000,
      budgetUsed: 1950000,
      team: 12
    },
    {
      id: '2',
      name: 'Aramco Refinery',
      progress: 65,
      target: 75,
      status: 'delayed',
      daysLeft: 30,
      budget: 1800000,
      budgetUsed: 1170000,
      team: 8
    },
    {
      id: '3',
      name: 'PIF Headquarters',
      progress: 92,
      target: 85,
      status: 'ahead',
      daysLeft: 60,
      budget: 3200000,
      budgetUsed: 2944000,
      team: 15
    },
    {
      id: '4',
      name: 'Red Sea Project',
      progress: 45,
      target: 70,
      status: 'critical',
      daysLeft: 15,
      budget: 4500000,
      budgetUsed: 2025000,
      team: 20
    },
    {
      id: '5',
      name: 'Qiddiya Complex',
      progress: 88,
      target: 82,
      status: 'ahead',
      daysLeft: 25,
      budget: 2800000,
      budgetUsed: 2464000,
      team: 10
    }
  ];

  // Department heatmap data
  const departmentHeatmap: DepartmentHeatmap[] = [
    { department: 'Engineering', projects: 8, efficiency: 85, satisfaction: 4.6, deliveryRate: 92 },
    { department: 'Finance', projects: 3, efficiency: 91, satisfaction: 4.8, deliveryRate: 95 },
    { department: 'Human Resources', projects: 4, efficiency: 78, satisfaction: 4.4, deliveryRate: 88 },
    { department: 'Operations', projects: 6, efficiency: 82, satisfaction: 4.5, deliveryRate: 90 },
    { department: 'Sales', projects: 5, efficiency: 79, satisfaction: 4.3, deliveryRate: 85 }
  ];

  // Chart data for trends
  const performanceTrend = [
    { month: 'Jan', efficiency: 82, attendance: 88, satisfaction: 4.2 },
    { month: 'Feb', efficiency: 85, attendance: 91, satisfaction: 4.4 },
    { month: 'Mar', efficiency: 87, attendance: 89, satisfaction: 4.5 },
    { month: 'Apr', efficiency: 86, attendance: 93, satisfaction: 4.6 },
    { month: 'May', efficiency: 89, attendance: 95, satisfaction: 4.7 },
    { month: 'Jun', efficiency: 91, attendance: 92, satisfaction: 4.8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'ahead':
        return 'bg-blue-100 text-blue-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-3 w-3 text-green-600" />;
      case 'down':
        return <ArrowDownRight className="h-3 w-3 text-red-600" />;
      default:
        return <div className="h-3 w-3" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-blue-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Top performers
  const topPerformers = employeePerformance
    .sort((a, b) => (b.efficiency + b.attendance) - (a.efficiency + a.attendance))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Performance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor employee and project performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +3.2% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +1.8% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.3 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Department Performance Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentHeatmap.map((dept, index) => (
              <motion.div
                key={dept.department}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg"
              >
                <div className="font-medium">{dept.department}</div>
                <div className="text-center">
                  <div className="text-sm font-medium">{dept.projects}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-sm font-medium", getEfficiencyColor(dept.efficiency))}>
                    {dept.efficiency}%
                  </div>
                  <div className="text-xs text-muted-foreground">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium flex items-center justify-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    {dept.satisfaction}
                  </div>
                  <div className="text-xs text-muted-foreground">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-sm font-medium", getEfficiencyColor(dept.deliveryRate))}>
                    {dept.deliveryRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">Delivery</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
              <TabsTrigger value="employers" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Users className="h-4 w-4" />
              Employers
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Target className="h-4 w-4" />
              Projects
            </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Employers Tab */}
        <TabsContent value="employers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="efficiency" stroke="#8884d8" name="Efficiency %" />
                        <Line type="monotone" dataKey="attendance" stroke="#82ca9d" name="Attendance %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead className="text-center">Attendance</TableHead>
                        <TableHead className="text-center">Efficiency</TableHead>
                        <TableHead className="text-center">Tasks</TableHead>
                        <TableHead className="text-center">Rating</TableHead>
                        <TableHead className="text-center">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeePerformance.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleViewEmployee(employee.id)}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-muted-foreground">{employee.position}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={cn("font-medium", getEfficiencyColor(employee.attendance))}>
                              {employee.attendance}%
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={cn("font-medium", getEfficiencyColor(employee.efficiency))}>
                              {employee.efficiency}%
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {employee.tasksCompleted}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              <span className="font-medium">{employee.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {getTrendIcon(employee.trend)}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Leaderboards */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPerformers.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewEmployee(employee.id)}
                    >
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{employee.rating}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Efficiency Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {employeePerformance
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .slice(0, 3)
                    .map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => handleViewEmployee(employee.id)}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{employee.name}</span>
                      </div>
                      <div className={cn("text-sm font-medium", getEfficiencyColor(employee.efficiency))}>
                        {employee.efficiency}%
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Attendance Champions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {employeePerformance
                    .sort((a, b) => b.attendance - a.attendance)
                    .slice(0, 3)
                    .map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => handleViewEmployee(employee.id)}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{employee.name}</span>
                      </div>
                      <div className={cn("text-sm font-medium", getEfficiencyColor(employee.attendance))}>
                        {employee.attendance}%
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress vs Target Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Progress vs Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectPerformance.map(p => ({
                      name: p.name.split(' ')[0],
                      progress: p.progress,
                      target: p.target,
                      delayed: p.status === 'delayed' || p.status === 'critical'
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value}%`,
                          name === 'progress' ? 'Progress' : 'Target'
                        ]}
                      />
                      <Bar dataKey="target" fill="#e2e8f0" name="target" />
                      <Bar dataKey="progress" fill="#3b82f6" name="progress" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'On Track', value: projectPerformance.filter(p => p.status === 'on-track').length },
                          { name: 'Ahead', value: projectPerformance.filter(p => p.status === 'ahead').length },
                          { name: 'Delayed', value: projectPerformance.filter(p => p.status === 'delayed').length },
                          { name: 'Critical', value: projectPerformance.filter(p => p.status === 'critical').length }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Project Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-center">Progress</TableHead>
                    <TableHead className="text-center">Target</TableHead>
                    <TableHead className="text-center">Days Left</TableHead>
                    <TableHead className="text-center">Budget Usage</TableHead>
                    <TableHead className="text-center">Team Size</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectPerformance.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewProject(project.id)}
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <div className={cn("font-medium", 
                            project.progress >= project.target ? "text-green-600" : 
                            project.progress >= project.target - 10 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {project.progress}%
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{project.target}%</TableCell>
                      <TableCell className="text-center">
                        <div className={cn("font-medium", 
                          project.daysLeft > 30 ? "text-green-600" : 
                          project.daysLeft > 15 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {project.daysLeft} days
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {Math.round((project.budgetUsed / project.budget) * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(project.budgetUsed)} / {formatCurrency(project.budget)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{project.team}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(getStatusColor(project.status))}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Right-side Sheets */}
      
      {/* Employee Details Sheet */}
      <Sheet open={!!showEmployeeDetails} onOpenChange={handleCloseEmployeeDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Employee Performance Details</SheetTitle>
            <SheetDescription>
              View detailed performance metrics, trends, and analytics for this employee.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showEmployeeDetails && (() => {
              const employee = employeePerformance.find(e => e.id === showEmployeeDetails);
              if (!employee) return null;
              
              return (
                <div className="space-y-6">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                      <p className="text-muted-foreground">{employee.position}</p>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-muted-foreground">Attendance</Label>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(employee.trend)}
                            <span className={cn("font-medium", getEfficiencyColor(employee.attendance))}>
                              {employee.attendance}%
                            </span>
                          </div>
                        </div>
                        <Progress value={employee.attendance} className="h-2" />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-muted-foreground">Efficiency</Label>
                          <span className={cn("font-medium", getEfficiencyColor(employee.efficiency))}>
                            {employee.efficiency}%
                          </span>
                        </div>
                        <Progress value={employee.efficiency} className="h-2" />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-muted-foreground">Tasks Completed</Label>
                          <span className="font-medium">{employee.tasksCompleted}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-muted-foreground">Rating</Label>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{employee.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Trends */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Performance Trends</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="efficiency" stroke="#8884d8" name="Efficiency %" />
                          <Line type="monotone" dataKey="attendance" stroke="#82ca9d" name="Attendance %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Project Details Sheet */}
      <Sheet open={!!showProjectDetails} onOpenChange={handleCloseProjectDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Project Performance Details</SheetTitle>
            <SheetDescription>
              View detailed project metrics, budget analysis, and team performance.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showProjectDetails && (() => {
              const project = projectPerformance.find(p => p.id === showProjectDetails);
              if (!project) return null;
              
              return (
                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={cn(getStatusColor(project.status))}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {project.daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Progress Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-muted-foreground">Current Progress</Label>
                          <span className={cn("font-medium", 
                            project.progress >= project.target ? "text-green-600" : 
                            project.progress >= project.target - 10 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-muted-foreground">Target</Label>
                          <span className="font-medium">{project.target}%</span>
                        </div>
                        <Progress value={project.target} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Budget Analysis */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Budget Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">Total Budget</Label>
                        <p className="font-medium text-lg">{formatCurrency(project.budget)}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">Used Budget</Label>
                        <p className="font-medium text-lg">{formatCurrency(project.budgetUsed)}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">Remaining</Label>
                        <p className="font-medium text-lg">{formatCurrency(project.budget - project.budgetUsed)}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">Usage %</Label>
                        <p className="font-medium text-lg">
                          {Math.round((project.budgetUsed / project.budget) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Team Information</h4>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">Team Size</Label>
                        <span className="font-medium">{project.team} members</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Target className="h-4 w-4 mr-2" />
                      View Timeline
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Export Options Sheet */}
      <Sheet open={showExportOptions} onOpenChange={handleCloseExportOptions}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Export Performance Report</SheetTitle>
            <SheetDescription>
              Choose export format and data range for your performance report.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Export Format</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    PDF Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Excel Spreadsheet
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Data Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    This Month
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    This Quarter
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Include Sections</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">Employee Performance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">Project Performance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">Department Analytics</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" onClick={handleCloseExportOptions}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
