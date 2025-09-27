import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceBuilder } from '@/features/finance/components/InvoiceBuilder';
import { R, RH } from '@/lib/routes';
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
  Trash2,
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
  
  // Sheet states for right-side panels
  const [showTransactionDetails, setShowTransactionDetails] = useState<string | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<string | null>(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState<string | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all';
    const type = url.searchParams.get('type') || 'all';
    const project = url.searchParams.get('project') || 'all';
    const tab = url.searchParams.get('tab') || 'transactions';
    const transaction = url.searchParams.get('transaction');
    const invoice = url.searchParams.get('invoice');
    const receipt = url.searchParams.get('receipt');
    const newInvoice = url.searchParams.get('newInvoice') === 'true';
    const exportOptions = url.searchParams.get('export') === 'true';
    const filters = url.searchParams.get('filters') === 'true';
    
    setSearchQuery(search);
    setSelectedStatus(status);
    setSelectedType(type);
    setSelectedProject(project);
    setActiveTab(tab);
    setShowTransactionDetails(transaction);
    setShowInvoiceDetails(invoice);
    setShowReceiptDetails(receipt);
    setShowNewInvoice(newInvoice);
    setShowExportOptions(exportOptions);
    setShowFilters(filters);
  }, []);

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateQuery({ tab: value });
  };

  // Filter change handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateQuery({ search: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    updateQuery({ status: value });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    updateQuery({ type: value });
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    updateQuery({ project: value });
  };

  // Transaction actions
  const handleViewTransaction = (transactionId: string) => {
    setShowTransactionDetails(transactionId);
    updateQuery({ transaction: transactionId });
  };

  const handleCloseTransactionDetails = () => {
    setShowTransactionDetails(null);
    updateQuery({ transaction: undefined });
  };

  // Invoice actions
  const handleViewInvoice = (invoiceId: string) => {
    setShowInvoiceDetails(invoiceId);
    updateQuery({ invoice: invoiceId });
  };

  const handleCloseInvoiceDetails = () => {
    setShowInvoiceDetails(null);
    updateQuery({ invoice: undefined });
  };

  // Receipt actions
  const handleViewReceipt = (receiptId: string) => {
    setShowReceiptDetails(receiptId);
    updateQuery({ receipt: receiptId });
  };

  const handleCloseReceiptDetails = () => {
    setShowReceiptDetails(null);
    updateQuery({ receipt: undefined });
  };

  // New invoice actions
  const handleNewInvoice = () => {
    setShowNewInvoice(true);
    updateQuery({ newInvoice: 'true' });
  };

  const handleCloseNewInvoice = () => {
    setShowNewInvoice(false);
    updateQuery({ newInvoice: undefined });
  };

  // Export actions
  const handleExportOptions = () => {
    setShowExportOptions(true);
    updateQuery({ export: 'true' });
  };

  const handleCloseExportOptions = () => {
    setShowExportOptions(false);
    updateQuery({ export: undefined });
  };

  // Filter actions
  const handleOpenFilters = () => {
    setShowFilters(true);
    updateQuery({ filters: 'true' });
  };

  const handleCloseFilters = () => {
    setShowFilters(false);
    updateQuery({ filters: undefined });
  };

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
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Finance & Payments
          </h1>
          <p className="text-muted-foreground">
            Manage your financial transactions, invoices, and receipts
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2" onClick={handleNewInvoice}>
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
          <Button className="gap-2" onClick={handleExportOptions}>
            <Download className="h-4 w-4" />
            Export
          </Button>
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
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
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
            </div>
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={handleStatusChange}>
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

              <Select value={selectedProject} onValueChange={handleProjectChange}>
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

              <Button variant="outline" size="sm" onClick={handleOpenFilters}>
                <Filter className="h-4 w-4" />
              </Button>
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
                            <DropdownMenuItem onClick={() => handleViewTransaction(transaction.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.reference)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Reference
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Downloading receipt for:', transaction.id)}>
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
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={handleNewInvoice}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf', 'invoices')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleViewInvoice(invoice.id)}
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => console.log('Downloading PDF for invoice:', invoice.id)}
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => console.log('Sending invoice:', invoice.id)}
                      >
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleViewReceipt(receipt.id)}
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => console.log('Downloading receipt:', receipt.id)}
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => console.log('Printing receipt:', receipt.id)}
                      >
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

      {/* Right-side Sheets */}
      
      {/* Transaction Details Sheet */}
      <Sheet open={!!showTransactionDetails} onOpenChange={handleCloseTransactionDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription>
              Complete transaction information and related documents.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showTransactionDetails && (() => {
              const transaction = transactions.find(t => t.id === showTransactionDetails);
              if (!transaction) return null;
              
              return (
                <div className="space-y-6">
                  {/* Transaction Header */}
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    )}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold">{transaction.vendor}</h3>
                        <Badge className={cn(getStatusColor(transaction.status))}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.reference}</p>
                    </div>
                  </div>

                  {/* Transaction Amount */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Transaction Amount</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className={cn(
                        "text-3xl font-bold",
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.paymentMethod} • {transaction.currency}
                      </p>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Transaction Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Transaction ID</Label>
                        <p className="font-medium">{transaction.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Date</Label>
                        <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Project</Label>
                        <p className="font-medium">{transaction.project}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Category</Label>
                        <p className="font-medium">{transaction.category}</p>
                      </div>
                      {transaction.invoiceNumber && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Invoice Number</Label>
                          <p className="font-medium">{transaction.invoiceNumber}</p>
                        </div>
                      )}
                      {transaction.location && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Location</Label>
                          <p className="font-medium">{transaction.location}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Reference
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Invoice Details Sheet */}
      <Sheet open={!!showInvoiceDetails} onOpenChange={handleCloseInvoiceDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Invoice Details</SheetTitle>
            <SheetDescription>
              Complete invoice information and payment status.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showInvoiceDetails && (() => {
              const invoice = invoices.find(i => i.id === showInvoiceDetails);
              if (!invoice) return null;
              
              return (
                <div className="space-y-6">
                  {/* Invoice Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={cn(getStatusColor(invoice.status))}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground">{invoice.project}</p>
                    </div>
                  </div>

                  {/* Invoice Amount */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Invoice Amount</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(invoice.amount)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {invoice.currency} • {invoice.items} items
                      </p>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Invoice Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Issue Date</Label>
                        <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Due Date</Label>
                        <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Payment Terms</Label>
                        <p className="font-medium">{invoice.paymentTerms}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Items Count</Label>
                        <p className="font-medium">{invoice.items}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">{invoice.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Invoice
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Receipt Details Sheet */}
      <Sheet open={!!showReceiptDetails} onOpenChange={handleCloseReceiptDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Receipt Details</SheetTitle>
            <SheetDescription>
              Complete receipt information and verification status.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showReceiptDetails && (() => {
              const receipt = receipts.find(r => r.id === showReceiptDetails);
              if (!receipt) return null;
              
              return (
                <div className="space-y-6">
                  {/* Receipt Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold">{receipt.receiptNumber}</h3>
                        <Badge className={cn(getStatusColor(receipt.status))}>
                          {getStatusIcon(receipt.status)}
                          <span className="ml-1">{receipt.status}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{receipt.vendor}</p>
                      <p className="text-sm text-muted-foreground">{receipt.project}</p>
                    </div>
                  </div>

                  {/* Receipt Amount */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Receipt Amount</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(receipt.amount)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {receipt.currency} • {receipt.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Receipt Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Receipt Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Date</Label>
                        <p className="font-medium">{new Date(receipt.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Category</Label>
                        <p className="font-medium">{receipt.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Payment Method</Label>
                        <p className="font-medium">{receipt.paymentMethod}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Project</Label>
                        <p className="font-medium">{receipt.project}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">{receipt.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Printer className="h-4 w-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* New Invoice Sheet - 100% Clone of InvoiceBuilder */}
      <Sheet open={showNewInvoice} onOpenChange={handleCloseNewInvoice}>
        <SheetContent className="w-[95vw] sm:max-w-none p-0">
          <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card">
            <InvoiceBuilder onClose={handleCloseNewInvoice} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Export Options Sheet */}
      <Sheet open={showExportOptions} onOpenChange={handleCloseExportOptions}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Export Financial Data</SheetTitle>
            <SheetDescription>
              Export your financial data in various formats.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Export Type</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Transactions
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Invoices
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    Receipts
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    All Data
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Export Format</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Excel Spreadsheet
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Report
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input type="date" placeholder="From date" />
                  <Input type="date" placeholder="To date" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Generate Export
              </Button>
              <Button variant="outline" onClick={handleCloseExportOptions}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Advanced Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={handleCloseFilters}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>
              Apply detailed filters to find specific transactions.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Amount Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input placeholder="Min amount" type="number" />
                  <Input placeholder="Max amount" type="number" />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input type="date" placeholder="From date" />
                  <Input type="date" placeholder="To date" />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Payment Method</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Corporate Card">Corporate Card</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="engineering" className="rounded" />
                    <Label htmlFor="engineering" className="text-sm">Engineering Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="materials" className="rounded" />
                    <Label htmlFor="materials" className="text-sm">Materials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="consulting" className="rounded" />
                    <Label htmlFor="consulting" className="text-sm">Consulting</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline">
                Clear All
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}