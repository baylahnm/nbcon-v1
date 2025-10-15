import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/pages/1-HomePage/others/components/ui/sheet';
import { InvoiceBuilder } from '@/pages/6-enterprise/others/features/finance/components/InvoiceBuilder';
import QuotationPage from '@/pages/6-enterprise/others/features/finance/components/quotations/QuotationPage';
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
  Eye,
  Calendar,
  Search,
  Receipt,
  FileText,
  Wallet,
  Target,
  XCircle,
  Plus
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

interface Quotation {
  id: string;
  project: string;
  engineer: string;
  amount: number;
  currency: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  quoteNumber: string;
  createdAt: string;
  description: string;
}

interface Milestone {
  id: string;
  project: string;
  name: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  progress: number;
  description: string;
  engineer: string;
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
    invoice: 'INV-2024-004'
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
  },
  {
    id: 'inv4',
    project: 'Red Sea Resort Complex',
    engineer: 'Fatima Al-Sabah',
    amount: 25000,
    currency: 'SAR',
    dueDate: '2024-01-28',
    status: 'overdue',
    invoiceNumber: 'INV-2024-004',
    createdAt: '2024-01-02'
  }
];

const mockQuotations: Quotation[] = [
  {
    id: 'qt1',
    project: 'Jeddah Waterfront Development',
    engineer: 'Hassan Al-Qahtani',
    amount: 45000,
    currency: 'SAR',
    validUntil: '2024-02-28',
    status: 'pending',
    quoteNumber: 'QT-2024-001',
    createdAt: '2024-01-20',
    description: 'Structural engineering design and analysis for waterfront project'
  },
  {
    id: 'qt2',
    project: 'Dammam Port Expansion',
    engineer: 'Layla Al-Mutairi',
    amount: 32000,
    currency: 'SAR',
    validUntil: '2024-02-15',
    status: 'accepted',
    quoteNumber: 'QT-2024-002',
    createdAt: '2024-01-15',
    description: 'Marine engineering consultation and design review'
  },
  {
    id: 'qt3',
    project: 'Tabuk Solar Farm',
    engineer: 'Omar Al-Rashid',
    amount: 28000,
    currency: 'SAR',
    validUntil: '2024-01-25',
    status: 'expired',
    quoteNumber: 'QT-2024-003',
    createdAt: '2024-01-08',
    description: 'Renewable energy system design and optimization'
  }
];

const mockMilestones: Milestone[] = [
  {
    id: 'ms1',
    project: 'NEOM Infrastructure Design',
    name: 'Phase 1: Site Survey & Analysis',
    amount: 50000,
    currency: 'SAR',
    dueDate: '2024-02-01',
    status: 'completed',
    progress: 100,
    description: 'Complete site survey and preliminary analysis',
    engineer: 'Ahmed Al-Rashid'
  },
  {
    id: 'ms2',
    project: 'NEOM Infrastructure Design',
    name: 'Phase 2: Structural Design',
    amount: 75000,
    currency: 'SAR',
    dueDate: '2024-03-15',
    status: 'in_progress',
    progress: 65,
    description: 'Detailed structural engineering design',
    engineer: 'Ahmed Al-Rashid'
  },
  {
    id: 'ms3',
    project: 'Riyadh Metro Extension',
    name: 'Phase 1: Environmental Impact Study',
    amount: 35000,
    currency: 'SAR',
    dueDate: '2024-02-10',
    status: 'pending',
    progress: 0,
    description: 'Environmental assessment and impact analysis',
    engineer: 'Sarah Johnson'
  },
  {
    id: 'ms4',
    project: 'ACWA Power Solar Farm',
    name: 'Phase 1: Design Consultation',
    amount: 40000,
    currency: 'SAR',
    dueDate: '2024-02-20',
    status: 'approved',
    progress: 100,
    description: 'Initial design consultation and feasibility study',
    engineer: 'Mohammed Al-Zahrani'
  }
];

// StatCard component with animated gradient border
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  trendDown?: boolean;
}

function StatCard({ icon: Icon, label, value, trend, trendDown }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Add mouse tracking for animated gradient
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
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
      <Card className="cursor-pointer bg-transparent border-0">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-xs mt-1.5 font-medium ${trendDown ? 'text-red-600' : 'text-green-600'}`}>
                  {trendDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  <span>{trend}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [showQuotationBuilder, setShowQuotationBuilder] = useState(false);

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
      case 'completed':
      case 'paid':
        return 'bg-green-500/10 text-green-600 border-0';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-0';
      case 'failed':
      case 'overdue':
        return 'bg-red-500/10 text-red-600 border-0';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'failed':
      case 'overdue':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'refund':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'fee':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Banknote className="h-4 w-4" />;
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'wallet':
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="w-full max-w-full p-4 space-y-4 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight">Finance Center</h1>
              <p className="text-xs text-muted-foreground">Manage payments, invoices, and project budgets</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowInvoiceBuilder(true)} 
            className="h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Invoice
          </Button>
          <Button 
            onClick={() => setShowQuotationBuilder(true)} 
            className="h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Quotation
          </Button>
        </div>
        </div>

        {/* Stats Cards - Dashboard Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={`${totalSpent.toLocaleString()} SAR`}
            trend="+12%"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={`${pendingPayments.toLocaleString()} SAR`}
            trend="-5%"
            trendDown
          />
          <StatCard
            icon={Receipt}
            label="Service Fees"
            value={`${totalFees.toLocaleString()} SAR`}
          />
          <StatCard
            icon={Wallet}
            label="Total Budget"
            value={`${totalBudget.toLocaleString()} SAR`}
            trend="+8%"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <Card className="border-border/50">
            <div className="p-4 pb-3 border-b border-border/40">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
                <TabsTrigger value="invoices" className="text-xs">Invoices</TabsTrigger>
                <TabsTrigger value="quotations" className="text-xs">Quotations</TabsTrigger>
                <TabsTrigger value="milestones" className="text-xs">Milestones</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0">
              <CardContent className="p-4 space-y-4 bg-background rounded-b-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Payments */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base">Recent Payments</h3>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {mockPayments.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-background p-2 rounded-lg flex-shrink-0">
                              {getTypeIcon(payment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{payment.description}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={getStatusColor(payment.status) + ' text-xs h-5'}>
                                  {getStatusIcon(payment.status)}
                                  <span className="ml-1 capitalize">{payment.status}</span>
                                </Badge>
                                <span className="text-xs text-muted-foreground">{payment.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="font-bold text-sm text-primary flex-shrink-0">
                            {payment.amount.toLocaleString()} {payment.currency}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Invoices */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base">Pending Invoices</h3>
                      <Badge className="bg-amber-500/10 text-amber-600 border-0 text-xs">
                        {mockInvoices.filter(i => i.status === 'pending' || i.status === 'overdue').length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {mockInvoices.filter(i => i.status === 'pending' || i.status === 'overdue').map((invoice) => (
                        <div key={invoice.id} className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-background p-2 rounded-lg flex-shrink-0">
                              <Receipt className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{invoice.project}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">{invoice.invoiceNumber}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">Due: {invoice.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="font-bold text-sm text-primary">
                              {invoice.amount.toLocaleString()} {invoice.currency}
                            </p>
                            {invoice.status === 'overdue' && (
                              <Badge className="bg-red-500/10 text-red-600 border-0 text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {mockInvoices.filter(i => i.status === 'pending' || i.status === 'overdue').length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                          <p className="text-sm text-muted-foreground">All invoices paid!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="m-0">
              <CardContent className="p-4 space-y-4 bg-background rounded-b-lg">
                {/* Search */}
                <div className="relative min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments by project, engineer, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 text-sm"
                  />
                </div>

                {/* Payments List */}
                <div className="space-y-3">
                  {mockPayments.map((payment) => (
                    <Card key={payment.id} className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="bg-muted/50 p-3 rounded-lg flex-shrink-0">
                              {getTypeIcon(payment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-base line-clamp-1">{payment.description}</h3>
                                <Badge className={getStatusColor(payment.status) + ' text-xs h-5'}>
                                  {getStatusIcon(payment.status)}
                                  <span className="ml-1 capitalize">{payment.status}</span>
                                </Badge>
                              </div>
                              {payment.project && (
                                <p className="text-sm text-foreground/80 mb-1">{payment.project}</p>
                              )}
                              {payment.engineer && (
                                <p className="text-xs text-muted-foreground mb-2">Engineer: {payment.engineer}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{payment.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getMethodIcon(payment.method)}
                                  <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                                </div>
                                {payment.invoice && (
                                  <div className="flex items-center gap-1">
                                    <Receipt className="h-3 w-3" />
                                    <span>{payment.invoice}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="font-bold text-lg text-primary">
                              {payment.amount.toLocaleString()} {payment.currency}
                            </p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="m-0">
              <CardContent className="p-4 space-y-4 bg-background rounded-b-lg">
                {/* Create Invoice Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setShowInvoiceBuilder(true)} 
                    className="h-8 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Invoice
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockInvoices.map((invoice) => (
                    <Card key={invoice.id} className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="bg-muted/50 p-3 rounded-lg flex-shrink-0">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-base">{invoice.invoiceNumber}</h3>
                                <Badge className={getStatusColor(invoice.status) + ' text-xs h-5'}>
                                  {getStatusIcon(invoice.status)}
                                  <span className="ml-1 capitalize">{invoice.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground/80 mb-1">{invoice.project}</p>
                              <p className="text-xs text-muted-foreground mb-2">Engineer: {invoice.engineer}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Created: {invoice.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Due: {invoice.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="font-bold text-lg text-primary">
                              {invoice.amount.toLocaleString()} {invoice.currency}
                            </p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                <Button size="sm" className="h-7 text-xs px-2 ml-1">
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </TabsContent>

            {/* Quotations Tab */}
            <TabsContent value="quotations" className="m-0">
              <CardContent className="p-4 space-y-4 bg-background rounded-b-lg">
                {/* Create Quotation Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setShowQuotationBuilder(true)} 
                    className="h-8 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Quotation
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockQuotations.map((quote) => (
                    <Card key={quote.id} className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="bg-muted/50 p-3 rounded-lg flex-shrink-0">
                              <Receipt className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-base">{quote.quoteNumber}</h3>
                                <Badge className={`${
                                  quote.status === 'accepted' ? 'bg-green-500/10 text-green-600 border-0' :
                                  quote.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-0' :
                                  quote.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-0' :
                                  'bg-gray-500/10 text-gray-600 border-0'
                                } text-xs h-5`}>
                                  {quote.status === 'accepted' && <CheckCircle2 className="h-3 w-3" />}
                                  {quote.status === 'pending' && <Clock className="h-3 w-3" />}
                                  {quote.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                  {quote.status === 'expired' && <AlertCircle className="h-3 w-3" />}
                                  <span className="ml-1 capitalize">{quote.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground/80 mb-1">{quote.project}</p>
                              <p className="text-xs text-muted-foreground mb-2">Engineer: {quote.engineer}</p>
                              <p className="text-xs text-muted-foreground mb-2">{quote.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Created: {quote.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Valid Until: {quote.validUntil}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="font-bold text-lg text-primary">
                              {quote.amount.toLocaleString()} {quote.currency}
                            </p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              {quote.status === 'pending' && (
                                <>
                                  <Button size="sm" className="h-7 text-xs px-2 ml-1 bg-green-500 hover:bg-green-600">
                                    Accept
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="m-0">
              <CardContent className="p-4 space-y-4 bg-background rounded-b-lg">
                <div className="space-y-3">
                  {mockMilestones.map((milestone) => (
                    <Card key={milestone.id} className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="bg-muted/50 p-3 rounded-lg flex-shrink-0">
                              <Target className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-base line-clamp-1">{milestone.name}</h3>
                                <Badge className={`${
                                  milestone.status === 'completed' ? 'bg-green-500/10 text-green-600 border-0' :
                                  milestone.status === 'approved' ? 'bg-blue-500/10 text-blue-600 border-0' :
                                  milestone.status === 'in_progress' ? 'bg-amber-500/10 text-amber-600 border-0' :
                                  'bg-gray-500/10 text-gray-600 border-0'
                                } text-xs h-5`}>
                                  {milestone.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                                  {milestone.status === 'in_progress' && <Clock className="h-3 w-3" />}
                                  {milestone.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                                  {milestone.status === 'pending' && <Clock className="h-3 w-3" />}
                                  <span className="ml-1 capitalize">{milestone.status.replace('_', ' ')}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground/80 mb-1">{milestone.project}</p>
                              <p className="text-xs text-muted-foreground mb-2">{milestone.description}</p>
                              <p className="text-xs text-muted-foreground mb-3">Engineer: {milestone.engineer}</p>
                              
                              {/* Progress Bar */}
                              {milestone.status === 'in_progress' && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{milestone.progress}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{ width: `${milestone.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Due: {milestone.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="font-bold text-lg text-primary">
                              {milestone.amount.toLocaleString()} {milestone.currency}
                            </p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              {milestone.status === 'completed' && (
                                <Button size="sm" className="h-7 text-xs px-2 ml-1">
                                  Approve Payment
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>

        {/* Invoice Builder Sheet */}
        <Sheet open={showInvoiceBuilder} onOpenChange={setShowInvoiceBuilder}>
          <SheetContent className="w-[95vw] sm:max-w-none p-0">
            <SheetHeader className="px-6 pt-6">
              <SheetTitle className="text-base">Create New Invoice</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card">
              <InvoiceBuilder onClose={() => setShowInvoiceBuilder(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Quotation Builder Sheet */}
        <Sheet open={showQuotationBuilder} onOpenChange={setShowQuotationBuilder}>
          <SheetContent className="w-[95vw] sm:max-w-none p-0">
            <SheetHeader className="px-6 pt-6">
              <SheetTitle className="text-base">Create New Quotation</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card">
              <QuotationPage onClose={() => setShowQuotationBuilder(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
