import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  DollarSign,
  Download,
  Filter,
  Search,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MoreHorizontal,
  FileText,
  CreditCard,
  Building,
  Banknote,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Printer,
  Send,
  Copy,
  Star,
  AlertTriangle,
  MapPin,
  Calendar as CalIcon,
  User,
  FileCheck,
  X,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  vendor: string;
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'processing' | 'overdue' | 'cancelled' | 'refunded';
  date: string;
  project?: string;
  category: string;
  paymentMethod: string;
  reference: string;
  invoiceNumber?: string;
  location?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  project: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'sent';
  issueDate: string;
  dueDate: string;
  items: number;
  description: string;
  paymentTerms: string;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  vendor: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  project: string;
  paymentMethod: string;
  status: 'verified' | 'pending' | 'rejected';
}

export function FinancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [activeTab, setActiveTab] = useState('transactions');

  // Sample transactions data with Saudi engineering context
  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'income',
      vendor: 'NEOM Company',
      description: 'Smart City Infrastructure Design - Phase 1 Payment',
      amount: 450000,
      currency: 'SAR',
      status: 'completed',
      date: '2024-09-25',
      project: 'NEOM Smart City',
      category: 'Engineering Services',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-NEOM-2024-001',
      invoiceNumber: 'INV-2024-001',
      location: 'NEOM, Saudi Arabia'
    },
    {
      id: 'TXN-002',
      type: 'expense',
      vendor: 'Al-Rajhi Engineering Supplies',
      description: 'Steel reinforcement bars for foundation',
      amount: 125000,
      currency: 'SAR',
      status: 'completed',
      date: '2024-09-24',
      project: 'Aramco Refinery',
      category: 'Materials',
      paymentMethod: 'Corporate Card',
      reference: 'REF-ALRAJHI-2024-045',
      location: 'Riyadh, Saudi Arabia'
    },
    {
      id: 'TXN-003',
      type: 'income',
      vendor: 'Saudi Aramco',
      description: 'Refinery Safety Audit - Milestone 2',
      amount: 320000,
      currency: 'SAR',
      status: 'pending',
      date: '2024-09-23',
      project: 'Aramco Safety Audit',
      category: 'Consulting',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-ARAMCO-2024-012',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 'TXN-004',
      type: 'expense',
      vendor: 'Gulf Safety Equipment',
      description: 'Personal protective equipment for site workers',
      amount: 45000,
      currency: 'SAR',
      status: 'processing',
      date: '2024-09-22',
      project: 'PIF Green Energy',
      category: 'Safety Equipment',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-GULF-2024-078',
      location: 'Khobar, Saudi Arabia'
    },
    {
      id: 'TXN-005',
      type: 'income',
      vendor: 'Public Investment Fund',
      description: 'Green Energy Complex - Final Payment',
      amount: 780000,
      currency: 'SAR',
      status: 'completed',
      date: '2024-09-20',
      project: 'PIF Green Energy',
      category: 'Project Completion',
      paymentMethod: 'Wire Transfer',
      reference: 'REF-PIF-2024-005',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 'TXN-006',
      type: 'expense',
      vendor: 'SABIC Materials',
      description: 'Chemical-resistant coating materials',
      amount: 89000,
      currency: 'SAR',
      status: 'overdue',
      date: '2024-09-15',
      project: 'SABIC Plant',
      category: 'Specialized Materials',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-SABIC-2024-023',
      location: 'Jubail, Saudi Arabia'
    },
    {
      id: 'TXN-007',
      type: 'income',
      vendor: 'Red Sea Global',
      description: 'Marine Infrastructure Consulting',
      amount: 560000,
      currency: 'SAR',
      status: 'processing',
      date: '2024-09-18',
      project: 'Red Sea Project',
      category: 'Marine Engineering',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-RSG-2024-008',
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 'TXN-008',
      type: 'expense',
      vendor: 'Advanced Tech Systems',
      description: 'IoT sensors and monitoring equipment',
      amount: 67000,
      currency: 'SAR',
      status: 'cancelled',
      date: '2024-09-12',
      project: 'NEOM Smart City',
      category: 'Technology',
      paymentMethod: 'Corporate Card',
      reference: 'REF-ATS-2024-034',
      location: 'Jeddah, Saudi Arabia'
    }
  ];

  // Sample invoices data
  const invoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      invoiceNumber: 'INV-2024-001',
      client: 'NEOM Company',
      project: 'NEOM Smart City Infrastructure',
      amount: 450000,
      currency: 'SAR',
      status: 'paid',
      issueDate: '2024-09-15',
      dueDate: '2024-09-25',
      items: 5,
      description: 'Smart city infrastructure design and consultation services',
      paymentTerms: 'Net 10'
    },
    {
      id: 'INV-2024-002',
      invoiceNumber: 'INV-2024-002',
      client: 'Saudi Aramco',
      project: 'Refinery Safety Audit',
      amount: 320000,
      currency: 'SAR',
      status: 'sent',
      issueDate: '2024-09-20',
      dueDate: '2024-10-05',
      items: 3,
      description: 'Comprehensive safety audit and compliance review',
      paymentTerms: 'Net 15'
    },
    {
      id: 'INV-2024-003',
      invoiceNumber: 'INV-2024-003',
      client: 'Public Investment Fund',
      project: 'Green Energy Complex',
      amount: 780000,
      currency: 'SAR',
      status: 'paid',
      issueDate: '2024-09-10',
      dueDate: '2024-09-20',
      items: 8,
      description: 'Green energy facility engineering and project management',
      paymentTerms: 'Net 10'
    },
    {
      id: 'INV-2024-004',
      invoiceNumber: 'INV-2024-004',
      client: 'Red Sea Global',
      project: 'Marine Infrastructure',
      amount: 560000,
      currency: 'SAR',
      status: 'pending',
      issueDate: '2024-09-18',
      dueDate: '2024-10-03',
      items: 6,
      description: 'Marine engineering consultation and environmental assessment',
      paymentTerms: 'Net 15'
    },
    {
      id: 'INV-2024-005',
      invoiceNumber: 'INV-2024-005',
      client: 'Qiddiya Investment Company',
      project: 'Entertainment Complex',
      amount: 125000,
      currency: 'SAR',
      status: 'overdue',
      issueDate: '2024-08-15',
      dueDate: '2024-08-30',
      items: 4,
      description: 'Structural engineering for entertainment facilities',
      paymentTerms: 'Net 15'
    },
    {
      id: 'INV-2024-006',
      invoiceNumber: 'INV-2024-006',
      client: 'Saudi Electric Company',
      project: 'Grid Modernization',
      amount: 245000,
      currency: 'SAR',
      status: 'draft',
      issueDate: '2024-09-26',
      dueDate: '2024-10-11',
      items: 7,
      description: 'Electrical grid upgrade design and implementation planning',
      paymentTerms: 'Net 15'
    }
  ];

  // Sample receipts data
  const receipts: Receipt[] = [
    {
      id: 'RCP-2024-001',
      receiptNumber: 'RCP-2024-001',
      vendor: 'Al-Rajhi Engineering Supplies',
      description: 'Steel reinforcement materials',
      amount: 125000,
      currency: 'SAR',
      date: '2024-09-24',
      category: 'Materials',
      project: 'Aramco Refinery',
      paymentMethod: 'Corporate Card',
      status: 'verified'
    },
    {
      id: 'RCP-2024-002',
      receiptNumber: 'RCP-2024-002',
      vendor: 'Gulf Safety Equipment',
      description: 'Safety equipment and PPE',
      amount: 45000,
      currency: 'SAR',
      date: '2024-09-22',
      category: 'Safety',
      project: 'PIF Green Energy',
      paymentMethod: 'Bank Transfer',
      status: 'verified'
    },
    {
      id: 'RCP-2024-003',
      receiptNumber: 'RCP-2024-003',
      vendor: 'SABIC Materials',
      description: 'Chemical-resistant coatings',
      amount: 89000,
      currency: 'SAR',
      date: '2024-09-15',
      category: 'Specialized Materials',
      project: 'SABIC Plant',
      paymentMethod: 'Bank Transfer',
      status: 'pending'
    },
    {
      id: 'RCP-2024-004',
      receiptNumber: 'RCP-2024-004',
      vendor: 'Saudi Equipment Rental',
      description: 'Heavy machinery rental',
      amount: 78000,
      currency: 'SAR',
      date: '2024-09-18',
      category: 'Equipment Rental',
      project: 'Red Sea Project',
      paymentMethod: 'Corporate Card',
      status: 'verified'
    },
    {
      id: 'RCP-2024-005',
      receiptNumber: 'RCP-2024-005',
      vendor: 'Advanced Tech Systems',
      description: 'IoT monitoring systems',
      amount: 67000,
      currency: 'SAR',
      date: '2024-09-12',
      category: 'Technology',
      project: 'NEOM Smart City',
      paymentMethod: 'Corporate Card',
      status: 'rejected'
    },
    {
      id: 'RCP-2024-006',
      receiptNumber: 'RCP-2024-006',
      vendor: 'Eastern Province Logistics',
      description: 'Transportation and logistics services',
      amount: 34000,
      currency: 'SAR',
      date: '2024-09-20',
      category: 'Logistics',
      project: 'Multiple Projects',
      paymentMethod: 'Bank Transfer',
      status: 'verified'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'draft':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'verified':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
      case 'sent':
        return <Clock className="h-3 w-3" />;
      case 'processing':
        return <RefreshCw className="h-3 w-3" />;
      case 'overdue':
        return <AlertCircle className="h-3 w-3" />;
      case 'cancelled':
      case 'rejected':
        return <X className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesProject = selectedProject === 'all' || transaction.project === selectedProject;
    
    return matchesSearch && matchesStatus && matchesType && matchesProject;
  });

  const handleExport = (format: 'excel' | 'pdf', type: 'transactions' | 'invoices' | 'receipts') => {
    toast.success(`Exporting ${type} to ${format.toUpperCase()}...`);
    // Simulate export process
    setTimeout(() => {
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`);
    }, 2000);
  };

  const calculateTotals = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingIncome = transactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIncome, totalExpenses, pendingIncome, pendingExpenses };
  };

  const { totalIncome, totalExpenses, pendingIncome, pendingExpenses } = calculateTotals();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Finance & Payments</h1>
              <p className="text-sm text-muted-foreground">
                Manage your financial transactions, invoices, and receipts
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('excel', 'transactions')}>
                Export Transactions (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf', 'transactions')}>
                Export Transactions (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel', 'invoices')}>
                Export Invoices (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf', 'invoices')}>
                Export Invoices (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel', 'receipts')}>
                Export Receipts (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf', 'receipts')}>
                Export Receipts (PDF)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed payments
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed payments
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Income</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-yellow-600">
                {formatCurrency(pendingIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-blue-600">
                {formatCurrency(totalIncome - totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current period
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <TabsTrigger value="transactions" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Banknote className="h-4 w-4" />
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <FileText className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Receipt className="h-4 w-4" />
              Receipts
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Transaction History Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="NEOM Smart City">NEOM Smart City</SelectItem>
                  <SelectItem value="Aramco Refinery">Aramco Refinery</SelectItem>
                  <SelectItem value="PIF Green Energy">PIF Green Energy</SelectItem>
                  <SelectItem value="Red Sea Project">Red Sea Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={() => handleExport('excel', 'transactions')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Transaction History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          )}>
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-48">{transaction.vendor}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-48">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.reference}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          transaction.type === 'income' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                        )}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "font-medium",
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <p className="text-xs text-muted-foreground">{transaction.paymentMethod}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1", getStatusColor(transaction.status))}>
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{transaction.project}</span>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Reference
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Invoices & Billing</h3>
            <Button 
              variant="outline" 
              onClick={() => handleExport('pdf', 'invoices')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-base">{invoice.invoiceNumber}</CardTitle>
                          <p className="text-sm text-muted-foreground">{invoice.client}</p>
                        </div>
                      </div>
                      <Badge className={cn(getStatusColor(invoice.status))}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1">{invoice.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-lg">{formatCurrency(invoice.amount)}</p>
                      <p className="text-sm text-muted-foreground">{invoice.project}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue Date:</span>
                        <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Items:</span>
                        <span>{invoice.items}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Terms:</span>
                        <span>{invoice.paymentTerms}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {invoice.description}
                    </p>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Download className="h-3 w-3" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Receipts & Documentation</h3>
            <Button 
              variant="outline" 
              onClick={() => handleExport('excel', 'receipts')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receipts.map((receipt, index) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-base">{receipt.receiptNumber}</CardTitle>
                          <p className="text-sm text-muted-foreground">{receipt.vendor}</p>
                        </div>
                      </div>
                      <Badge className={cn(getStatusColor(receipt.status))}>
                        {getStatusIcon(receipt.status)}
                        <span className="ml-1">{receipt.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-lg">{formatCurrency(receipt.amount)}</p>
                      <p className="text-sm text-muted-foreground">{receipt.project}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(receipt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{receipt.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment:</span>
                        <span>{receipt.paymentMethod}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {receipt.description}
                    </p>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Printer className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}