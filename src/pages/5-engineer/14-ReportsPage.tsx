"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../1-HomePage/others/components/ui/card";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../1-HomePage/others/components/ui/select";
import { Badge } from "../1-HomePage/others/components/ui/badge";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Line, 
  LineChart, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { 
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Users,
  Briefcase
} from "lucide-react";

const formatCurrency = (amount: number, currency: string = 'SAR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Enhanced monthly data for Saudi engineering projects
const monthlyData = [
  { month: 'Jan', income: 45000, expenses: 4500, net: 40500, projects: 3 },
  { month: 'Feb', income: 52000, expenses: 5200, net: 46800, projects: 4 },
  { month: 'Mar', income: 38000, expenses: 3800, net: 34200, projects: 2 },
  { month: 'Apr', income: 67000, expenses: 6700, net: 60300, projects: 5 },
  { month: 'May', income: 58000, expenses: 5800, net: 52200, projects: 4 },
  { month: 'Jun', income: 72000, expenses: 7200, net: 64800, projects: 6 },
  { month: 'Jul', income: 89000, expenses: 8900, net: 80100, projects: 7 },
  { month: 'Aug', income: 94000, expenses: 9400, net: 84600, projects: 8 },
  { month: 'Sep', income: 76000, expenses: 7600, net: 68400, projects: 6 },
  { month: 'Oct', income: 85000, expenses: 8500, net: 76500, projects: 7 },
  { month: 'Nov', income: 91000, expenses: 9100, net: 81900, projects: 8 },
  { month: 'Dec', income: 78000, expenses: 7800, net: 70200, projects: 6 }
];

// Payment type distribution
const paymentTypeData = [
  { name: 'Milestones', value: 45, amount: 345000, color: '#10b981' },
  { name: 'Invoices', value: 25, amount: 192000, color: '#3b82f6' },
  { name: 'Escrow', value: 20, amount: 154000, color: '#8b5cf6' },
  { name: 'Payouts', value: 10, amount: 77000, color: '#f59e0b' }
];

// Project type distribution
const projectTypeData = [
  { name: 'Structural', value: 35, amount: 268000, color: '#ef4444' },
  { name: 'Electrical', value: 25, amount: 192000, color: '#10b981' },
  { name: 'Mechanical', value: 20, amount: 154000, color: '#3b82f6' },
  { name: 'Civil', value: 15, amount: 115000, color: '#f59e0b' },
  { name: 'Other', value: 5, amount: 38000, color: '#6b7280' }
];

// Performance metrics
const performanceData = [
  { metric: 'On-Time Delivery', value: 94, target: 95, color: '#10b981' },
  { metric: 'Client Satisfaction', value: 4.8, target: 5.0, color: '#3b82f6' },
  { metric: 'Project Success Rate', value: 89, target: 90, color: '#8b5cf6' },
  { metric: 'Budget Adherence', value: 92, target: 95, color: '#f59e0b' }
];

// Recent transactions for detailed report
const recentTransactions = [
  { id: 'TXN-001', date: '2024-01-15', type: 'Milestone Payment', amount: 25000, status: 'completed', project: 'Riyadh Tower Phase 2', client: 'Saudi Aramco' },
  { id: 'TXN-002', date: '2024-01-14', type: 'Invoice Payment', amount: 15000, status: 'completed', project: 'Jeddah Mall Renovation', client: 'Majid Al Futtaim' },
  { id: 'TXN-003', date: '2024-01-13', type: 'Escrow Release', amount: 35000, status: 'completed', project: 'Dammam Industrial Complex', client: 'SABIC' },
  { id: 'TXN-004', date: '2024-01-12', type: 'Payout', amount: 45000, status: 'pending', project: 'Multiple Projects', client: 'Various' },
  { id: 'TXN-005', date: '2024-01-11', type: 'Refund', amount: 5000, status: 'completed', project: 'Cancelled Project', client: 'NEOM' }
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedReport, setSelectedReport] = useState('financial');

  const handleExportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report for ${selectedPeriod}`);
    // In real implementation, this would trigger a download
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/40 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Reports
            </h1>
            <p className="text-xs text-muted-foreground">
              Financial analytics and insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card 
          className="relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">{formatCurrency(768000)}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">+12.5% from last year</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <TrendingDown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">{formatCurrency(76800)}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <p className="text-xs text-red-600">+3.2% from last year</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">{formatCurrency(691200)}</p>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <p className="text-xs text-blue-600">+15.8% from last year</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">67</p>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                  <p className="text-xs text-purple-600">+8 from last month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Monthly Income/Expenses Chart */}
        <Card 
          className="relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardHeader className="p-4 pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Monthly Financial Overview</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Income vs expenses analysis</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Type Distribution */}
        <Card 
          className="relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardHeader className="p-4 pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <PieChartIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Payment Type Distribution</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Payment methods breakdown</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card 
        className="relative overflow-hidden transition-all duration-300 mb-6"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Performance Metrics</div>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">Key performance indicators</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold mb-2" style={{ color: metric.color }}>
                  {metric.metric === 'Client Satisfaction' ? metric.value : `${metric.value}%`}
                </div>
                <div className="text-sm font-medium mb-1">{metric.metric}</div>
                <div className="text-xs text-muted-foreground">Target: {metric.metric === 'Client Satisfaction' ? metric.target : `${metric.target}%`}</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${(metric.value / metric.target) * 100}%`, 
                      backgroundColor: metric.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Type Distribution */}
      <Card 
        className="relative overflow-hidden transition-all duration-300 mb-6"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Project Type Distribution</div>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">Project categories breakdown</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {projectTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card 
        className="relative overflow-hidden transition-all duration-300"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Recent Transactions</div>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">Latest financial activities</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.type}</p>
                    <p className="text-xs text-muted-foreground">{transaction.project}</p>
                    <p className="text-xs text-muted-foreground">{transaction.client}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(transaction.amount)}</p>
                  <Badge 
                    variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}