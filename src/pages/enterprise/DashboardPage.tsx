import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  BarChart3,
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  MapPin,
  Star,
  Target,
  Briefcase,
  Award,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MoreHorizontal,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Construction,
  Shield,
  Wrench,
  FileText,
  CreditCard,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState('month');

  // Sample data for Saudi engineering projects
  const quickStats = [
    {
      title: 'Active Projects',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: FolderOpen,
      description: 'Ongoing engineering projects',
      details: '8 NEOM, 6 Aramco, 4 PIF, 6 Others'
    },
    {
      title: 'Team Size',
      value: '342',
      change: '+12',
      changeType: 'positive',
      icon: Users,
      description: 'Total active employees',
      details: '156 Engineers, 98 Technicians, 88 Support'
    },
    {
      title: 'Budget Overview',
      value: 'SAR 145.2M',
      change: '-2.1%',
      changeType: 'negative',
      icon: DollarSign,
      description: 'Total project budgets',
      details: 'SAR 89.4M allocated, SAR 55.8M remaining'
    },
    {
      title: 'Completion Rate',
      value: '87.3%',
      change: '+5.2%',
      changeType: 'positive',
      icon: Target,
      description: 'Overall project completion',
      details: '21 completed, 3 in progress'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'NEOM Smart City Infrastructure',
      client: 'NEOM',
      status: 'In Progress',
      progress: 78,
      budget: 45000000,
      manager: 'Ahmed Al-Mansouri',
      deadline: '2024-12-15',
      priority: 'High',
      team: 45
    },
    {
      id: 2,
      name: 'Aramco Refinery Expansion',
      client: 'Saudi Aramco',
      status: 'In Progress',
      progress: 65,
      budget: 32000000,
      manager: 'Fatima Al-Zahra',
      deadline: '2024-11-30',
      priority: 'High',
      team: 38
    },
    {
      id: 3,
      name: 'PIF Green Energy Complex',
      client: 'PIF',
      status: 'Planning',
      progress: 25,
      budget: 28500000,
      manager: 'Omar Al-Rashid',
      deadline: '2025-03-20',
      priority: 'Medium',
      team: 32
    },
    {
      id: 4,
      name: 'Riyadh Metro Extension',
      client: 'Royal Commission',
      status: 'In Progress',
      progress: 92,
      budget: 18200000,
      manager: 'Nadia Al-Khatib',
      deadline: '2024-10-15',
      priority: 'High',
      team: 28
    }
  ];

  const recentActivities = [
    {
      type: 'project_milestone',
      title: 'NEOM Phase 2 milestone completed',
      description: 'Infrastructure foundation completed ahead of schedule',
      time: '2 hours ago',
      user: 'Ahmed Al-Mansouri',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'budget_alert',
      title: 'Budget threshold reached',
      description: 'Aramco Refinery project reached 80% budget utilization',
      time: '4 hours ago',
      user: 'Finance Team',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      type: 'team_update',
      title: 'New team members assigned',
      description: '5 senior engineers joined PIF Green Energy project',
      time: '6 hours ago',
      user: 'HR Department',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      type: 'compliance',
      title: 'Safety inspection completed',
      description: 'All sites passed monthly safety compliance review',
      time: '1 day ago',
      user: 'Safety Officer',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      type: 'procurement',
      title: 'Equipment delivery scheduled',
      description: 'Heavy machinery for NEOM project arriving next week',
      time: '1 day ago',
      user: 'Procurement Team',
      icon: Wrench,
      color: 'text-purple-600'
    }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 12500000, expenses: 8200000, projects: 18, completed: 15 },
    { month: 'Feb', revenue: 15200000, expenses: 9800000, projects: 20, completed: 17 },
    { month: 'Mar', revenue: 18700000, expenses: 11200000, projects: 22, completed: 19 },
    { month: 'Apr', revenue: 16800000, expenses: 10500000, projects: 21, completed: 18 },
    { month: 'May', revenue: 21300000, expenses: 12800000, projects: 24, completed: 21 },
    { month: 'Jun', revenue: 19600000, expenses: 11900000, projects: 23, completed: 20 },
    { month: 'Jul', revenue: 22400000, expenses: 13500000, projects: 25, completed: 22 },
    { month: 'Aug', revenue: 20100000, expenses: 12200000, projects: 24, completed: 21 },
    { month: 'Sep', revenue: 23800000, expenses: 14100000, projects: 26, completed: 23 }
  ];

  const budgetData = [
    { name: 'NEOM Projects', value: 45000000, color: '#0ea5e9' },
    { name: 'Aramco Contracts', value: 38000000, color: '#10b981' },
    { name: 'PIF Initiatives', value: 32000000, color: '#f59e0b' },
    { name: 'Government Projects', value: 20000000, color: '#ef4444' },
    { name: 'Private Sector', value: 10200000, color: '#8b5cf6' }
  ];

  const teamPerformance = [
    { department: 'Engineering', efficiency: 92, projects: 18, satisfaction: 4.6 },
    { department: 'Construction', efficiency: 87, projects: 15, satisfaction: 4.3 },
    { department: 'Design', efficiency: 89, projects: 12, satisfaction: 4.5 },
    { department: 'Project Management', efficiency: 95, projects: 24, satisfaction: 4.7 },
    { department: 'Quality Assurance', efficiency: 91, projects: 24, satisfaction: 4.4 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Enterprise Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive overview of your engineering operations
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-2xl font-semibold">{stat.value}</h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            stat.changeType === 'positive'
                              ? 'text-green-700 border-green-200 bg-green-50'
                              : 'text-red-700 border-red-200 bg-red-50'
                          )}
                        >
                          {stat.changeType === 'positive' ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.details}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue & Projects Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Performance</CardTitle>
                <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                  <div className="border-b border-sidebar-border">
                    <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
                      <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                        <TabsTrigger value="week" className="flex items-center gap-2 px-4 py-3 min-w-fit">Week</TabsTrigger>
                      <TabsTrigger value="month" className="flex items-center gap-2 px-4 py-3 min-w-fit">Month</TabsTrigger>
                      <TabsTrigger value="year" className="flex items-center gap-2 px-4 py-3 min-w-fit">Year</TabsTrigger>
                      </div>
                    </TabsList>
                  </div>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' || name === 'expenses' 
                          ? formatCurrency(value as number)
                          : value,
                        name === 'revenue' ? 'Revenue' : 
                        name === 'expenses' ? 'Expenses' : 
                        name === 'projects' ? 'Projects' : 'Completed'
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1" 
                      stroke="#0ea5e9" 
                      fill="#0ea5e9" 
                      fillOpacity={0.6}
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="2" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" fill="#0ea5e9" name="Efficiency %" />
                    <Bar dataKey="projects" fill="#10b981" name="Active Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Projects</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge className={cn(getStatusColor(project.status))}>
                          {project.status}
                        </Badge>
                        <Badge className={cn(getPriorityColor(project.priority))}>
                          {project.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {project.client}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {project.team} members
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {project.deadline}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(project.budget)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {project.manager.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activities and Budget */}
        <div className="space-y-6">
          {/* Budget Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${((entry.value / budgetData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%`}
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {budgetData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={cn("p-1.5 rounded-full bg-muted", activity.color)}>
                      <activity.icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Project
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Add Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Process Payment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}