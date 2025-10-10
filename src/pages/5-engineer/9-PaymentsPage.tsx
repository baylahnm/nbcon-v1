import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Upload,
  Eye,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

interface Payment {
  id: string;
  type: 'earning' | 'expense' | 'withdrawal';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  project?: string;
  client?: string;
  method: 'bank_transfer' | 'credit_card' | 'paypal' | 'wallet';
}

interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedDate: string;
  completedDate?: string;
  method: string;
  bankAccount?: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    type: 'earning',
    amount: 5000,
    currency: 'SAR',
    description: 'Project completion payment - NEOM Infrastructure',
    date: '2024-01-20',
    status: 'completed',
    project: 'NEOM Infrastructure Design',
    client: 'NEOM Company',
    method: 'bank_transfer'
  },
  {
    id: '2',
    type: 'earning',
    amount: 3200,
    currency: 'SAR',
    description: 'Milestone payment - Structural Analysis',
    date: '2024-01-18',
    status: 'completed',
    project: 'Riyadh Metro Extension',
    client: 'Saudi Aramco',
    method: 'bank_transfer'
  },
  {
    id: '3',
    type: 'expense',
    amount: 150,
    currency: 'SAR',
    description: 'Software license renewal - AutoCAD',
    date: '2024-01-15',
    status: 'completed',
    method: 'credit_card'
  },
  {
    id: '4',
    type: 'earning',
    amount: 2800,
    currency: 'SAR',
    description: 'Consultation fee - Renewable Energy Project',
    date: '2024-01-12',
    status: 'pending',
    project: 'ACWA Power Solar Farm',
    client: 'ACWA Power',
    method: 'bank_transfer'
  }
];

const mockWithdrawals: Withdrawal[] = [
  {
    id: 'w1',
    amount: 10000,
    currency: 'SAR',
    status: 'completed',
    requestedDate: '2024-01-10',
    completedDate: '2024-01-12',
    method: 'Bank Transfer',
    bankAccount: '****1234'
  },
  {
    id: 'w2',
    amount: 5000,
    currency: 'SAR',
    status: 'processing',
    requestedDate: '2024-01-22',
    method: 'Bank Transfer',
    bankAccount: '****1234'
  }
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalEarnings = mockPayments
    .filter(p => p.type === 'earning' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = mockPayments
    .filter(p => p.type === 'expense' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = mockPayments
    .filter(p => p.type === 'earning' && p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalance = totalEarnings - totalExpenses;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'failed': return <AlertCircle className="h-3 w-3" />;
      case 'processing': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earning': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'expense': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'withdrawal': return <Upload className="h-4 w-4 text-blue-600" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer': return <Banknote className="h-4 w-4" />;
      case 'credit_card': return <CreditCard className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Payments & Earnings
          </h1>
          <p className="text-muted-foreground">Manage your earnings, expenses, and withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{totalEarnings.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{availableBalance.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Available Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{pendingPayments.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Pending Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">{totalExpenses.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Your latest payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(payment.type)}
                        <div>
                          <p className="text-sm font-medium">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          payment.type === 'earning' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.type === 'earning' ? '+' : '-'}{payment.amount.toLocaleString()} {payment.currency}
                        </p>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common payment operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-20 flex flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Request Withdrawal</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Export Statement</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Eye className="h-6 w-6" />
                    <span className="text-sm">View Tax Documents</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Payment Methods</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option>All Types</option>
                <option>Earnings</option>
                <option>Expenses</option>
                <option>Withdrawals</option>
              </select>
              <select className="px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Transactions List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockPayments.map((payment, index) => (
                  <div key={payment.id} className={`flex items-center justify-between p-4 ${index !== mockPayments.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(payment.type)}
                        {getMethodIcon(payment.method)}
                      </div>
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{payment.date}</span>
                          {payment.project && (
                            <>
                              <span>•</span>
                              <span>{payment.project}</span>
                            </>
                          )}
                          {payment.client && (
                            <>
                              <span>•</span>
                              <span>{payment.client}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-medium ${
                          payment.type === 'earning' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.type === 'earning' ? '+' : '-'}{payment.amount.toLocaleString()} {payment.currency}
                        </p>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Withdrawal History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Withdrawal History</CardTitle>
                <CardDescription>Track your withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{withdrawal.amount.toLocaleString()} {withdrawal.currency}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{withdrawal.method}</span>
                          {withdrawal.bankAccount && (
                            <>
                              <span>•</span>
                              <span>{withdrawal.bankAccount}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Requested: {withdrawal.requestedDate}
                          {withdrawal.completedDate && (
                            <> • Completed: {withdrawal.completedDate}</>
                          )}
                        </p>
                      </div>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {getStatusIcon(withdrawal.status)}
                        <span className="ml-1 capitalize">{withdrawal.status}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Request Withdrawal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Withdrawal</CardTitle>
                <CardDescription>Withdraw your available earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Available Balance</label>
                    <p className="text-2xl font-bold text-green-600">{availableBalance.toLocaleString()} SAR</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Withdrawal Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Withdrawal Method</label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option>Bank Transfer</option>
                      <option>PayPal</option>
                    </select>
                  </div>
                  <Button className="w-full">
                    Request Withdrawal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
                <CardDescription>Manage your payment and withdrawal methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Bank Account</p>
                        <p className="text-sm text-muted-foreground">****1234 - Al Rajhi Bank</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tax Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tax Settings</CardTitle>
                <CardDescription>Configure your tax preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tax ID</label>
                    <input
                      type="text"
                      placeholder="Enter your tax ID"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tax Rate (%)</label>
                    <input
                      type="number"
                      placeholder="15"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  <Button className="w-full">Save Tax Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
