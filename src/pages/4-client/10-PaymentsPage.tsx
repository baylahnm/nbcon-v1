import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
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
  Search,
  Receipt,
  FileText
} from 'lucide-react';

interface Payment {
  id: string;
  type: 'payment' | 'refund' | 'fee';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  project?: string;
  engineer?: string;
  method: 'bank_transfer' | 'credit_card' | 'paypal' | 'wallet';
  invoice?: string;
}

interface Invoice {
  id: string;
  project: string;
  engineer: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  invoiceNumber: string;
  createdAt: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    type: 'payment',
    amount: 15000,
    currency: 'SAR',
    description: 'Payment for structural analysis - NEOM Infrastructure',
    date: '2024-01-20',
    status: 'completed',
    project: 'NEOM Infrastructure Design',
    engineer: 'Ahmed Al-Rashid',
    method: 'bank_transfer',
    invoice: 'INV-2024-001'
  },
  {
    id: '2',
    type: 'payment',
    amount: 8500,
    currency: 'SAR',
    description: 'Milestone payment - Project planning phase',
    date: '2024-01-18',
    status: 'completed',
    project: 'Riyadh Metro Extension',
    engineer: 'Sarah Johnson',
    method: 'credit_card',
    invoice: 'INV-2024-002'
  },
  {
    id: '3',
    type: 'fee',
    amount: 1500,
    currency: 'SAR',
    description: 'Platform service fee',
    date: '2024-01-18',
    status: 'completed',
    method: 'credit_card'
  },
  {
    id: '4',
    type: 'payment',
    amount: 12000,
    currency: 'SAR',
    description: 'Consultation fee - Renewable Energy Project',
    date: '2024-01-12',
    status: 'pending',
    project: 'ACWA Power Solar Farm',
    engineer: 'Mohammed Al-Zahrani',
    method: 'bank_transfer',
    invoice: 'INV-2024-003'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    project: 'NEOM Infrastructure Design',
    engineer: 'Ahmed Al-Rashid',
    amount: 15000,
    currency: 'SAR',
    dueDate: '2024-02-20',
    status: 'paid',
    invoiceNumber: 'INV-2024-001',
    createdAt: '2024-01-15'
  },
  {
    id: 'inv2',
    project: 'Riyadh Metro Extension',
    engineer: 'Sarah Johnson',
    amount: 8500,
    currency: 'SAR',
    dueDate: '2024-02-18',
    status: 'paid',
    invoiceNumber: 'INV-2024-002',
    createdAt: '2024-01-13'
  },
  {
    id: 'inv3',
    project: 'ACWA Power Solar Farm',
    engineer: 'Mohammed Al-Zahrani',
    amount: 12000,
    currency: 'SAR',
    dueDate: '2024-02-12',
    status: 'pending',
    invoiceNumber: 'INV-2024-003',
    createdAt: '2024-01-07'
  }
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalSpent = mockPayments
    .filter(p => p.type === 'payment' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFees = mockPayments
    .filter(p => p.type === 'fee' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = mockPayments
    .filter(p => p.type === 'payment' && p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalBudget = totalSpent + pendingPayments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'failed': return <AlertCircle className="h-3 w-3" />;
      case 'paid': return <CheckCircle2 className="h-3 w-3" />;
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'refund': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'fee': return <DollarSign className="h-4 w-4 text-blue-600" />;
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
            Payments & Invoices
          </h1>
          <p className="text-muted-foreground">Manage your project payments and invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Receipt className="h-4 w-4 mr-2" />
            Request Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">{totalSpent.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
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
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{totalFees.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Platform Fees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{mockInvoices.length}</p>
                <p className="text-xs text-muted-foreground">Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Payments</CardTitle>
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
                          payment.type === 'payment' ? 'text-red-600' : payment.type === 'refund' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {payment.type === 'payment' ? '-' : payment.type === 'refund' ? '+' : ''}{payment.amount.toLocaleString()} {payment.currency}
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
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Make Payment</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Receipt className="h-6 w-6" />
                    <span className="text-sm">View Invoices</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Export Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Eye className="h-6 w-6" />
                    <span className="text-sm">Payment History</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search payments..."
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option>All Types</option>
                <option>Payments</option>
                <option>Refunds</option>
                <option>Fees</option>
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

          {/* Payments List */}
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
                          {payment.engineer && (
                            <>
                              <span>•</span>
                              <span>{payment.engineer}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-medium ${
                          payment.type === 'payment' ? 'text-red-600' : payment.type === 'refund' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {payment.type === 'payment' ? '-' : payment.type === 'refund' ? '+' : ''}{payment.amount.toLocaleString()} {payment.currency}
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

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Receipt className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{invoice.project}</h3>
                          <p className="text-sm text-muted-foreground">{invoice.engineer}</p>
                          <p className="text-xs text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount.toLocaleString()} {invoice.currency}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {invoice.dueDate}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </Badge>
                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {invoice.status === 'pending' && (
                          <Button size="sm">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
                <CardDescription>Manage your payment and billing methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Visa ****1234</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
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

            {/* Billing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Settings</CardTitle>
                <CardDescription>Configure your billing preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Billing Address</label>
                    <textarea
                      rows={3}
                      placeholder="Enter your billing address..."
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tax ID</label>
                    <input
                      type="text"
                      placeholder="Enter your tax ID"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

