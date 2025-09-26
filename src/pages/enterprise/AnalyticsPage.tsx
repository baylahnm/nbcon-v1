import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3,
  Download,
  Filter,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  PieChart as PieChartIcon,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetData {
  project: string;
  planned: number;
  actual: number;
  variance: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
}

interface KPIMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

export function AnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last-30-days');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Sample budget data
  const budgetData: BudgetData[] = [
    {
      project: 'NEOM Smart City',
      planned: 2500000,
      actual: 2200000,
      variance: -300000,
      status: 'under-budget'
    },
    {
      project: 'Aramco Refinery',
      planned: 1800000,
      actual: 1950000,
      variance: 150000,
      status: 'over-budget'
    },
    {
      project: 'PIF Headquarters',
      planned: 3200000,
      actual: 3100000,
      variance: -100000,
      status: 'under-budget'
    },
    {
      project: 'Red Sea Project',
      planned: 4500000,
      actual: 4200000,
      variance: -300000,
      status: 'under-budget'
    },
    {
      project: 'Qiddiya Complex',
      planned: 2800000,
      actual: 2850000,
      variance: 50000,
      status: 'on-track'
    }
  ];

  // Chart data for budget comparison
  const chartData = budgetData.map(item => ({
    name: item.project.split(' ')[0], // Shortened name for chart
    planned: item.planned,
    actual: item.actual,
    variance: item.variance
  }));

  // Cost breakdown data
  const costBreakdownData = [
    { name: 'Engineering', value: 4200000, percentage: 35 },
    { name: 'Materials', value: 3600000, percentage: 30 },
    { name: 'Labor', value: 2400000, percentage: 20 },
    { name: 'Equipment', value: 1200000, percentage: 10 },
    { name: 'Other', value: 600000, percentage: 5 }
  ];

  // Timeline data
  const timelineData = [
    { month: 'Jan', budget: 2200000, spent: 1800000 },
    { month: 'Feb', budget: 2400000, spent: 2100000 },
    { month: 'Mar', budget: 2600000, spent: 2300000 },
    { month: 'Apr', budget: 2800000, spent: 2500000 },
    { month: 'May', budget: 3000000, spent: 2700000 },
    { month: 'Jun', budget: 3200000, spent: 2900000 }
  ];

  // KPI metrics
  const kpiMetrics: KPIMetric[] = [
    {
      title: 'Average Project Duration',
      value: '18.5 months',
      change: '+2.1 months',
      changeType: 'increase',
      icon: <Clock className="h-4 w-4" />
    },
    {
      title: 'Cost per Project',
      value: 'SAR 2.8M',
      change: '-12.5%',
      changeType: 'decrease',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: 'Budget Accuracy',
      value: '94.2%',
      change: '+3.1%',
      changeType: 'increase',
      icon: <Target className="h-4 w-4" />
    },
    {
      title: 'Project Success Rate',
      value: '87.5%',
      change: '+5.2%',
      changeType: 'increase',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'over-budget':
        return 'bg-red-100 text-red-800';
      case 'under-budget':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // In a real app, this would trigger the actual export
    console.log(`Exporting analytics to ${format.toUpperCase()}`);
    alert(`Analytics report will be exported to ${format.toUpperCase()} format`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
              <p className="text-sm text-muted-foreground">
                Track performance, analyze budgets, and monitor business metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="neom">NEOM Smart City</SelectItem>
              <SelectItem value="aramco">Aramco Refinery</SelectItem>
              <SelectItem value="pif">PIF Headquarters</SelectItem>
              <SelectItem value="red-sea">Red Sea Project</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-xs ${
                  metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changeType === 'increase' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Charts Area */}
        <div className="col-span-8 space-y-6">
          {/* Budget vs Actual Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Budget vs Actual Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === 'planned' ? 'Planned' : name === 'actual' ? 'Actual' : 'Variance'
                      ]}
                      labelFormatter={(label) => `Project: ${label}`}
                    />
                    <Bar dataKey="planned" fill="#8884d8" name="planned" />
                    <Bar dataKey="actual" fill="#82ca9d" name="actual" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Spending Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="budget" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="spent" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-right">Planned Budget</TableHead>
                    <TableHead className="text-right">Actual Spent</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((project, index) => (
                    <motion.tr
                      key={project.project}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell className="font-medium">{project.project}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.planned)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(project.actual)}</TableCell>
                      <TableCell className={`text-right ${
                        project.variance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {project.variance > 0 ? '+' : ''}{formatCurrency(project.variance)}
                      </TableCell>
                      <TableCell>
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
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Cost Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Cost Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Budget Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Over Budget</p>
                  <p className="text-xs text-red-700">Aramco Refinery project exceeded budget by SAR 150,000</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Budget Warning</p>
                  <p className="text-xs text-yellow-700">Qiddiya Complex approaching 90% of allocated budget</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Projects</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Budget</span>
                <span className="font-medium">{formatCurrency(14800000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="font-medium">{formatCurrency(14300000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget Efficiency</span>
                <span className="font-medium text-green-600">96.6%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}