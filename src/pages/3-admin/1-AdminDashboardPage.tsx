import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNamespace } from "../1-HomePage/others/lib/i18n/useNamespace";
import { Card, CardContent, CardHeader, CardTitle } from "../1-HomePage/others/components/ui/card";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Badge } from "../1-HomePage/others/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../1-HomePage/others/components/ui/avatar";
import { Input } from "../1-HomePage/others/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../1-HomePage/others/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../1-HomePage/others/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../1-HomePage/others/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "../1-HomePage/others/components/ui/sheet";
import { Skeleton } from "../1-HomePage/others/components/ui/skeleton";
import { useToast } from "../1-HomePage/others/components/ui/use-toast";
import { Bot, Search, Filter, Download, Eye, UserCheck, UserX, MoreHorizontal, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Users, FolderOpen, DollarSign } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data
const kpiData = {
  totalUsers: { value: 2847, delta: 15.2, trend: 'up' },
  activeProjects: { value: 1234, delta: 8.3, trend: 'up' },
  revenueMTD: { value: 5200000, delta: 22.1, trend: 'up' },
  overdueInvoices: { value: 12, delta: -5.2, trend: 'down' }
};

const revenueData = [
  { week: 'W1', revenue: 415000 },
  { week: 'W2', revenue: 380000 },
  { week: 'W3', revenue: 420000 },
  { week: 'W4', revenue: 450000 },
  { week: 'W5', revenue: 480000 },
  { week: 'W6', revenue: 520000 },
  { week: 'W7', revenue: 510000 },
  { week: 'W8', revenue: 540000 },
  { week: 'W9', revenue: 560000 },
  { week: 'W10', revenue: 580000 },
  { week: 'W11', revenue: 590000 },
  { week: 'W12', revenue: 620000 }
];

const userSessionsData = [
  { day: 'Mon', users: 1200, sessions: 3400 },
  { day: 'Tue', users: 1350, sessions: 3800 },
  { day: 'Wed', users: 1100, sessions: 3200 },
  { day: 'Thu', users: 1450, sessions: 4100 },
  { day: 'Fri', users: 1600, sessions: 4500 },
  { day: 'Sat', users: 800, sessions: 2200 },
  { day: 'Sun', users: 600, sessions: 1800 }
];

const recentUsers = [
  { id: 1, name: 'Ahmed Al-Rashid', role: 'Engineer', status: 'active', joined: '2024-01-15', avatar: 'A' },
  { id: 2, name: 'Sarah Johnson', role: 'Client', status: 'pending', joined: '2024-01-14', avatar: 'S' },
  { id: 3, name: 'Mohammed Hassan', role: 'Enterprise', status: 'active', joined: '2024-01-13', avatar: 'M' },
  { id: 4, name: 'Fatima Al-Zahra', role: 'Engineer', status: 'suspended', joined: '2024-01-12', avatar: 'F' },
  { id: 5, name: 'John Smith', role: 'Client', status: 'active', joined: '2024-01-11', avatar: 'J' }
];

const pendingApprovals = [
  { id: 1, type: 'Project Approval', title: 'Neom Infrastructure Design', user: 'Ahmed Al-Rashid', date: '2024-01-15' },
  { id: 2, type: 'Payment Release', title: 'Escrow Release - Project #1234', user: 'Sarah Johnson', amount: '45,000 SAR', date: '2024-01-14' },
  { id: 3, type: 'Verification', title: 'SCE Certificate Verification', user: 'Mohammed Hassan', date: '2024-01-13' },
  { id: 4, type: 'Project Approval', title: 'Riyadh Metro Extension', user: 'Fatima Al-Zahra', date: '2024-01-12' }
];

const financeData = {
  paid: { count: 1247, amount: 3246500 },
  pending: { count: 89, amount: 1284000 },
  failed: { count: 12, amount: 452000 }
};

const riskAlerts = [
  { id: 1, severity: 'high', message: 'Unusual payment pattern detected', count: 3 },
  { id: 2, severity: 'medium', message: 'Multiple failed login attempts', count: 12 },
  { id: 3, severity: 'low', message: 'New user verification pending', count: 45 }
];

const systemNotices = [
  { id: 1, type: 'maintenance', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for Sunday 2 AM', dismissible: true },
  { id: 2, type: 'update', title: 'Feature Update', message: 'New project templates available', dismissible: true }
];

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: number;
  trend?: 'up' | 'down';
  icon: React.ComponentType<any>;
  isLoading?: boolean;
}

function KPICard({ title, value, delta, trend, icon: Icon, isLoading }: KPICardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            {delta !== undefined && (
              <div className="flex items-center">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {delta > 0 ? '+' : ''}{delta}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last period</span>
              </div>
            )}
          </div>
          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const ready = useNamespace(['admin', 'common']);
  const { t } = useTranslation(['admin', 'common']);
  
  // Safe type guard for trend
  const asTrend = (value: string): 'up' | 'down' => value === 'down' ? 'down' : 'up';
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dismissedNotices, setDismissedNotices] = useState<number[]>([]);

  if (!ready) return null;

  const handleUserAction = (userId: number, action: 'view' | 'disable' | 'enable') => {
    toast({
      title: t('admin:dashboard.actions.actionCompleted'),
      description: t('admin:dashboard.actions.userActionSuccess', { action }),
    });
  };

  const handleApprovalAction = (approvalId: number, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? t('admin:dashboard.actions.approved') : t('admin:dashboard.actions.rejected'),
      description: t('admin:dashboard.actions.itemActionSuccess', { action }),
    });
  };

  const dismissNotice = (noticeId: number) => {
    setDismissedNotices(prev => [...prev, noticeId]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('admin:dashboard.statuses.active')}</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{t('admin:dashboard.statuses.pending')}</Badge>;
      case 'suspended':
        return <Badge variant="destructive">{t('admin:dashboard.statuses.suspended')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">{t('admin:dashboard.riskAlerts.high')}</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">{t('admin:dashboard.riskAlerts.medium')}</Badge>;
      case 'low':
        return <Badge variant="outline">{t('admin:dashboard.riskAlerts.low')}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const filteredUsers = recentUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || user.status === statusFilter)
  );

  const activeNotices = systemNotices.filter(notice => !dismissedNotices.includes(notice.id));

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin:dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('admin:dashboard.subtitle')}</p>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          {t('admin:dashboard.askAI')}
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t('admin:dashboard.kpis.totalUsers')}
          value={kpiData.totalUsers.value}
          delta={kpiData.totalUsers.delta}
          trend={asTrend(kpiData.totalUsers.trend)}
          icon={Users}
          isLoading={isLoading}
        />
        <KPICard
          title={t('admin:dashboard.kpis.activeProjects')}
          value={kpiData.activeProjects.value}
          delta={kpiData.activeProjects.delta}
          trend={asTrend(kpiData.activeProjects.trend)}
          icon={FolderOpen}
          isLoading={isLoading}
        />
        <KPICard
          title={t('admin:dashboard.kpis.revenueMTD')}
          value={`${(kpiData.revenueMTD.value / 1000000).toFixed(1)}M SAR`}
          delta={kpiData.revenueMTD.delta}
          trend={asTrend(kpiData.revenueMTD.trend)}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <KPICard
          title={t('admin:dashboard.kpis.overdueInvoices')}
          value={kpiData.overdueInvoices.value}
          delta={kpiData.overdueInvoices.delta}
          trend={asTrend(kpiData.overdueInvoices.trend)}
          icon={AlertTriangle}
          isLoading={isLoading}
        />
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin:dashboard.charts.revenueTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} SAR`, t('admin:dashboard.charts.revenueLegend')]} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin:dashboard.charts.userSessions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userSessionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" name={t('admin:dashboard.charts.newUsers')} />
                  <Bar dataKey="sessions" fill="#10b981" name={t('admin:dashboard.charts.activeSessions')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Today: {userSessionsData[0]?.users || 0} users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>7d: {userSessionsData.reduce((sum, day) => sum + day.users, 0)} users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queues/Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Users</SheetTitle>
                      <SheetDescription>
                        Filter users by role and status
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleUserAction(user.id, 'view')}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        {user.status === 'active' ? (
                          <Button variant="ghost" size="sm" onClick={() => handleUserAction(user.id, 'disable')}>
                            <UserX className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleUserAction(user.id, 'enable')}>
                            <UserCheck className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{approval.title}</p>
                    <p className="text-sm text-muted-foreground">{approval.type} • {approval.user}</p>
                    {approval.amount && (
                      <p className="text-sm font-medium text-green-600">{approval.amount}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleApprovalAction(approval.id, 'approve')}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleApprovalAction(approval.id, 'reject')}>
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finance Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{financeData.paid.count}</div>
              <div className="text-sm text-muted-foreground">Paid</div>
              <div className="text-lg font-medium">{(financeData.paid.amount / 1000000).toFixed(1)}M SAR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{financeData.pending.count}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-lg font-medium">{(financeData.pending.amount / 1000000).toFixed(1)}M SAR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{financeData.failed.count}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
              <div className="text-lg font-medium">{(financeData.failed.amount / 1000000).toFixed(1)}M SAR</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/admin/payments')}>
              Go to Payments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-red-100"></div>
                <div className="absolute inset-2 rounded-full bg-red-200"></div>
                <div className="absolute inset-4 rounded-full bg-red-300 flex items-center justify-center">
                  <span className="text-red-800 font-bold">High</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Overall Risk Level</p>
            </div>
            <div className="space-y-3">
              {riskAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.count} occurrences</p>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/risk')}>
              View Risk Center
            </Button>
          </CardContent>
        </Card>

        {/* System Notices */}
        <Card>
          <CardHeader>
            <CardTitle>System Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeNotices.map((notice) => (
                <div key={notice.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={notice.type === 'maintenance' ? 'destructive' : 'secondary'}>
                        {notice.type}
                      </Badge>
                      <p className="font-medium">{notice.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{notice.message}</p>
                  </div>
                  {notice.dismissible && (
                    <Button variant="ghost" size="sm" onClick={() => dismissNotice(notice.id)}>
                      <XCircle className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {activeNotices.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No active notices</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

