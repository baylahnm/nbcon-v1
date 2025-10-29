import { useState, useRef, useEffect, useId } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/pages/1-HomePage/others/components/ui/sheet';
import { InvoiceBuilder } from '@/pages/6-enterprise/others/features/finance/components/InvoiceBuilder';
import QuotationPage from '@/pages/6-enterprise/others/features/finance/components/quotations/QuotationPage';
import { useOutsideClick } from '@/pages/1-HomePage/others/hooks/use-outside-click';
import { useFinanceStore } from './others/features/finance/stores/useFinanceStore';
import { FeatureGate } from '@/components/portal/shared/FeatureGate';
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
  Plus,
  X,
  User,
  MapPin,
  Building2,
  Loader2
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
  details?: {
    transactionId?: string;
    paidBy?: string;
    milestone?: string;
    notes?: string;
  };
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
  details?: {
    description?: string;
    lineItems?: { name: string; quantity: number; rate: number }[];
    paymentTerms?: string;
    notes?: string;
  };
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

// Mock data removed - now using real database via useFinanceStore
// Quotations and Milestones: Keep as sample data for now (features not fully implemented)
// These will be replaced when quotations/milestones features are built

const mockQuotations: Quotation[] = [
  {
    id: 'qt1',
    project: 'Sample: Waterfront Development',
    engineer: 'Sample Engineer',
    amount: 45000,
    currency: 'SAR',
    validUntil: '2024-12-31',
    status: 'pending',
    quoteNumber: 'QT-SAMPLE-001',
    createdAt: '2024-01-20',
    description: 'Sample quotation - Your real quotations will appear here'
  }
];

const mockMilestones: Milestone[] = [
  {
    id: 'ms1',
    project: 'Sample: Infrastructure Project',
    name: 'Sample Milestone',
    amount: 50000,
    currency: 'SAR',
    dueDate: '2024-12-31',
    status: 'pending',
    progress: 0,
    description: 'Sample milestone - Your real milestones will appear here',
    engineer: 'Sample Engineer'
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
      <Card className="cursor-pointer bg-transparent border border-border/50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-primary-gradient h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50 group-hover:scale-110 transition-transform">
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
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Connect to real database
  const { 
    payments: dbPayments, 
    invoices: dbInvoices,
    isLoading: financeLoading,
    error: financeError,
    loadAll 
  } = useFinanceStore();

  // Load financial data on mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'payments', 'invoices', 'quotations', 'milestones'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [showQuotationBuilder, setShowQuotationBuilder] = useState(false);
  const [expandedPayment, setExpandedPayment] = useState<Payment | null>(null);
  const [expandedInvoice, setExpandedInvoice] = useState<Invoice | null>(null);
  const [expandedQuotation, setExpandedQuotation] = useState<Quotation | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<Milestone | null>(null);

  // Transform database payments to match UI interface
  const payments: Payment[] = dbPayments.map(p => ({
    id: p.id,
    type: 'payment' as const,
    amount: Number(p.amount),
    currency: p.currency || 'SAR',
    description: p.description || 'Payment',
    date: new Date(p.created_at).toISOString().split('T')[0],
    status: p.payment_status === 'succeeded' ? 'completed' as const : 
            p.payment_status === 'processing' ? 'pending' as const : 'failed' as const,
    method: (p.payment_method || 'bank_transfer') as 'bank_transfer' | 'credit_card' | 'paypal' | 'wallet',
    details: p.metadata as any
  }));

  // Transform database invoices to match UI interface
  const invoices: Invoice[] = dbInvoices.map(inv => ({
    id: inv.id,
    project: 'Project', // TODO: Join with jobs/projects table
    engineer: 'Engineer', // TODO: Join with profiles table
    amount: Number(inv.amount),
    currency: inv.currency || 'SAR',
    dueDate: inv.due_date || '',
    status: inv.invoice_status === 'paid' ? 'paid' as const :
            inv.invoice_status === 'open' ? 'pending' as const : 'overdue' as const,
    invoiceNumber: inv.invoice_number,
    createdAt: new Date(inv.created_at).toISOString().split('T')[0]
  }));
  
  const expandedRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Handle expandable card interactions
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedPayment(null);
        setExpandedInvoice(null);
        setExpandedQuotation(null);
        setExpandedMilestone(null);
      }
    }

    if (expandedPayment || expandedInvoice || expandedQuotation || expandedMilestone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedPayment, expandedInvoice, expandedQuotation, expandedMilestone]);

  useOutsideClick(expandedRef, () => {
    setExpandedPayment(null);
    setExpandedInvoice(null);
    setExpandedQuotation(null);
    setExpandedMilestone(null);
  });

  // Calculate financial stats from real data
  const totalSpent = payments
    .filter(p => p.type === 'payment' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFees = payments
    .filter(p => p.type === 'fee' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
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
        return <DollarSign className="h-4 w-4 text-primary" />;
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
    <>
      {/* Expanded Payment Modal */}
      <AnimatePresence>
        {expandedPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <div className="fixed inset-0 grid place-items-center z-[60] p-4">
              <motion.div
                layoutId={`payment-card-${expandedPayment.id}-${id}`}
                ref={expandedRef}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border-2 border-border/50 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                  onClick={() => setExpandedPayment(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>

                <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-primary shadow-sm shadow-primary/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary-foreground/20 p-3 rounded-xl">
                      <DollarSign className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <motion.h2
                        layoutId={`payment-title-${expandedPayment.id}-${id}`}
                        className="text-base font-bold tracking-tight mb-2 text-primary-foreground"
                      >
                        {expandedPayment.description}
                      </motion.h2>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                          {getStatusIcon(expandedPayment.status)}
                          <span className="ml-1 capitalize">{expandedPayment.status}</span>
                        </Badge>
                        <span className="text-sm font-bold text-primary-foreground">{expandedPayment.amount.toLocaleString()} {expandedPayment.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Date</span>
                      </div>
                      <p className="text-sm font-medium">{expandedPayment.date}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <CreditCard className="h-3 w-3" />
                        <span>Method</span>
                      </div>
                      <p className="text-sm font-medium capitalize">{expandedPayment.method.replace('_', ' ')}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Receipt className="h-3 w-3" />
                        <span>Invoice</span>
                      </div>
                      <p className="text-sm font-medium">{expandedPayment.invoice}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>Engineer</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{expandedPayment.engineer}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {expandedPayment.project && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Project</h3>
                      <p className="text-sm font-medium">{expandedPayment.project}</p>
                    </div>
                  )}
                  {expandedPayment.details?.milestone && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Milestone</h3>
                      <p className="text-sm font-medium">{expandedPayment.details.milestone}</p>
                    </div>
                  )}
                  {expandedPayment.details?.transactionId && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Transaction ID</h3>
                      <p className="text-sm font-mono text-muted-foreground">{expandedPayment.details.transactionId}</p>
                    </div>
                  )}
                  {expandedPayment.details?.notes && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Notes</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{expandedPayment.details.notes}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border/40 bg-muted/30 flex gap-2">
                  <Button variant="outline" className="flex-1 h-9 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1 h-9 text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View Invoice
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Expanded Invoice Modal */}
      <AnimatePresence>
        {expandedInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <div className="fixed inset-0 grid place-items-center z-[60] p-4">
              <motion.div
                layoutId={`invoice-card-${expandedInvoice.id}-${id}`}
                ref={expandedRef}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border-2 border-border/50 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                  onClick={() => setExpandedInvoice(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>

                <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-primary shadow-sm shadow-primary/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary-foreground/20 p-3 rounded-xl">
                      <Receipt className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <motion.h2
                        layoutId={`invoice-title-${expandedInvoice.id}-${id}`}
                        className="text-base font-bold tracking-tight mb-2 text-primary-foreground"
                      >
                        {expandedInvoice.project}
                      </motion.h2>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                          <span className="capitalize">{expandedInvoice.status}</span>
                        </Badge>
                        <span className="text-sm font-bold text-primary-foreground">{expandedInvoice.amount.toLocaleString()} {expandedInvoice.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <FileText className="h-3 w-3" />
                        <span>Invoice #</span>
                      </div>
                      <p className="text-sm font-medium">{expandedInvoice.invoiceNumber}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due Date</span>
                      </div>
                      <p className="text-sm font-medium">{expandedInvoice.dueDate}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>Engineer</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{expandedInvoice.engineer}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    expandedInvoice.status === 'overdue' 
                      ? 'bg-red-500/5 border-red-500/30'
                      : 'bg-warning/5 border-warning/30'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                      <Clock className="h-3 w-3" />
                      <span className={expandedInvoice.status === 'overdue' ? 'text-red-600' : 'text-warning'}>
                        {expandedInvoice.status === 'overdue' ? 'PAYMENT OVERDUE' : 'PAYMENT PENDING'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {expandedInvoice.status === 'overdue' 
                        ? 'This invoice is past its due date. Please process payment as soon as possible to avoid late fees.'
                        : 'Payment is due by the specified date. Please ensure timely payment to maintain project schedule.'}
                    </p>
                  </div>

                  {expandedInvoice.details?.description && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Description</h3>
                      <p className="text-sm leading-relaxed">{expandedInvoice.details.description}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border/40 bg-muted/30 flex gap-2">
                  <Button className="flex-1 h-9 text-xs shadow-lg">
                    <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                    Pay Now
                  </Button>
                  <Button variant="outline" className="flex-1 h-9 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download PDF
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Expanded Quotation Modal */}
      <AnimatePresence>
        {expandedQuotation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <div className="fixed inset-0 grid place-items-center z-[60] p-4">
              <motion.div
                layoutId={`quotation-card-${expandedQuotation.id}-${id}`}
                ref={expandedRef}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border-2 border-border/50 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                  onClick={() => setExpandedQuotation(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>

                <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-primary shadow-sm shadow-primary/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary-foreground/20 p-3 rounded-xl">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <motion.h2
                        layoutId={`quotation-title-${expandedQuotation.id}-${id}`}
                        className="text-base font-bold tracking-tight mb-2 text-primary-foreground"
                      >
                        {expandedQuotation.quoteNumber}
                      </motion.h2>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                          <span className="capitalize">{expandedQuotation.status}</span>
                        </Badge>
                        <span className="text-sm font-bold text-primary-foreground">{expandedQuotation.amount.toLocaleString()} {expandedQuotation.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Building2 className="h-3 w-3" />
                        <span>Project</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{expandedQuotation.project}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>Engineer</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{expandedQuotation.engineer}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        <span>Valid Until</span>
                      </div>
                      <p className="text-sm font-medium">{expandedQuotation.validUntil}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    expandedQuotation.status === 'expired' 
                      ? 'bg-gray-500/5 border-gray-500/30'
                      : expandedQuotation.status === 'pending'
                      ? 'bg-primary/5 border-primary/30'
                      : expandedQuotation.status === 'accepted'
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-red-500/5 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                      {expandedQuotation.status === 'pending' && <Clock className="h-3 w-3" />}
                      {expandedQuotation.status === 'accepted' && <CheckCircle2 className="h-3 w-3" />}
                      {expandedQuotation.status === 'expired' && <AlertCircle className="h-3 w-3" />}
                      {expandedQuotation.status === 'rejected' && <XCircle className="h-3 w-3" />}
                      <span className={
                        expandedQuotation.status === 'accepted' ? 'text-green-600' :
                        expandedQuotation.status === 'pending' ? 'text-primary' :
                        expandedQuotation.status === 'expired' ? 'text-gray-600' :
                        'text-red-600'
                      }>
                        {expandedQuotation.status === 'pending' && 'AWAITING RESPONSE'}
                        {expandedQuotation.status === 'accepted' && 'QUOTATION ACCEPTED'}
                        {expandedQuotation.status === 'expired' && 'QUOTATION EXPIRED'}
                        {expandedQuotation.status === 'rejected' && 'QUOTATION REJECTED'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {expandedQuotation.status === 'pending' && 'This quotation is awaiting your review and decision. Please accept or reject before the validity period expires.'}
                      {expandedQuotation.status === 'accepted' && 'This quotation has been accepted. You can proceed with the project based on the agreed terms.'}
                      {expandedQuotation.status === 'expired' && 'This quotation has expired. Please request a new quotation from the engineer if you wish to proceed.'}
                      {expandedQuotation.status === 'rejected' && 'This quotation was rejected. You can request revisions or explore other options.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Description</h3>
                    <p className="text-sm leading-relaxed">{expandedQuotation.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/20 rounded-lg p-3 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Created</div>
                      <div className="text-sm font-medium">{expandedQuotation.createdAt}</div>
                    </div>
                    <div className="bg-muted/20 rounded-lg p-3 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Quote Amount</div>
                      <div className="text-sm font-bold text-primary">{expandedQuotation.amount.toLocaleString()} {expandedQuotation.currency}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border/40 bg-muted/30 flex gap-2">
                  {expandedQuotation.status === 'pending' && (
                    <>
                      <Button className="flex-1 h-9 text-xs shadow-lg bg-green-500 hover:bg-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Accept Quote
                      </Button>
                      <Button variant="outline" className="flex-1 h-9 text-xs">
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        Reject
                      </Button>
                    </>
                  )}
                  {expandedQuotation.status !== 'pending' && (
                    <>
                      <Button variant="outline" className="flex-1 h-9 text-xs">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1 h-9 text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        View Details
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Expanded Milestone Modal */}
      <AnimatePresence>
        {expandedMilestone && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <div className="fixed inset-0 grid place-items-center z-[60] p-4">
              <motion.div
                layoutId={`milestone-card-${expandedMilestone.id}-${id}`}
                ref={expandedRef}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border-2 border-border/50 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                  onClick={() => setExpandedMilestone(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>

                <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-primary shadow-sm shadow-primary/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary-foreground/20 p-3 rounded-xl">
                      <Target className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <motion.h2
                        layoutId={`milestone-title-${expandedMilestone.id}-${id}`}
                        className="text-base font-bold tracking-tight mb-2 text-primary-foreground"
                      >
                        {expandedMilestone.name}
                      </motion.h2>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                          <span className="capitalize">{expandedMilestone.status.replace('_', ' ')}</span>
                        </Badge>
                        <span className="text-sm font-bold text-primary-foreground">{expandedMilestone.amount.toLocaleString()} {expandedMilestone.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Building2 className="h-3 w-3" />
                        <span>Project</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{expandedMilestone.project}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        <span>Engineer</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{expandedMilestone.engineer}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due Date</span>
                      </div>
                      <p className="text-sm font-medium">{expandedMilestone.dueDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Progress Section */}
                  <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Milestone Progress</h3>
                      <span className="text-2xl font-bold text-primary">{expandedMilestone.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div 
                        className="bg-primary-gradient h-3 rounded-full transition-all duration-500"
                        style={{ width: `${expandedMilestone.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {expandedMilestone.status === 'completed' && 'This milestone has been completed successfully.'}
                      {expandedMilestone.status === 'approved' && 'This milestone is approved and payment can be released.'}
                      {expandedMilestone.status === 'in_progress' && 'Work is currently in progress on this milestone.'}
                      {expandedMilestone.status === 'pending' && 'This milestone is pending and has not started yet.'}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Description</h3>
                    <p className="text-sm leading-relaxed">{expandedMilestone.description}</p>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</h3>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 text-sm ${expandedMilestone.status === 'completed' || expandedMilestone.status === 'approved' || expandedMilestone.status === 'in_progress' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-2 w-2 rounded-full ${expandedMilestone.status === 'completed' || expandedMilestone.status === 'approved' || expandedMilestone.status === 'in_progress' ? 'bg-success' : 'bg-muted'}`} />
                        <span>Started</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${expandedMilestone.status === 'in_progress' || expandedMilestone.status === 'completed' || expandedMilestone.status === 'approved' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-2 w-2 rounded-full ${expandedMilestone.status === 'in_progress' || expandedMilestone.status === 'completed' || expandedMilestone.status === 'approved' ? 'bg-warning' : 'bg-muted'}`} />
                        <span>In Progress</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${expandedMilestone.status === 'completed' || expandedMilestone.status === 'approved' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-2 w-2 rounded-full ${expandedMilestone.status === 'completed' || expandedMilestone.status === 'approved' ? 'bg-success' : 'bg-muted'}`} />
                        <span>Completed</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${expandedMilestone.status === 'approved' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <div className={`h-2 w-2 rounded-full ${expandedMilestone.status === 'approved' ? 'bg-primary' : 'bg-muted'}`} />
                        <span>Approved for Payment</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border/40 bg-muted/30 flex gap-2">
                  {expandedMilestone.status === 'completed' && (
                    <Button className="flex-1 h-9 text-xs shadow-lg">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Approve & Release Payment
                    </Button>
                  )}
                  {expandedMilestone.status === 'approved' && (
                    <Button className="flex-1 h-9 text-xs shadow-lg">
                      <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                      Release Payment
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 h-9 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1 h-9 text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <FeatureGate
        requiredTier="pro"
        featureName="Finance Management"
        featureDescription="Access invoices, payments, financial reports, and advanced budgeting tools"
      >
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <div className="w-full max-w-full p-4 space-y-4 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-sm shadow-primary/50 flex-shrink-0">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold tracking-tight">Finance Center</h1>
              <p className="text-[14px] text-muted-foreground">Manage payments, invoices, and project budgets</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0 space-y-4">
          {/* Tabs Navigation */}
          <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
            <TabsTrigger value="overview" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Overview</TabsTrigger>
            <TabsTrigger value="payments" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Payments</TabsTrigger>
            <TabsTrigger value="invoices" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Invoices</TabsTrigger>
            <TabsTrigger value="quotations" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Quotations</TabsTrigger>
            <TabsTrigger value="milestones" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Milestones</TabsTrigger>
          </TabsList>

          {/* Loading State */}
          {financeLoading && (
            <Card className="border-border/50 mt-4">
              <CardContent className="py-16 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading financial data...</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State - No Data */}
          {!financeLoading && payments.length === 0 && invoices.length === 0 && (
            <Card className="border-border/50 mt-4">
              <CardContent className="py-16 text-center space-y-4">
                <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">No Financial Activity Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your payments and invoices will appear here once you start working on projects
                  </p>
                </div>
                <Button onClick={() => window.location.href = '/free/browse'} className="h-8 text-xs">
                  <Building2 className="h-3.5 w-3.5 mr-1.5" />
                  Browse Engineers
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Overview Tab - Separate Card */}
          <TabsContent value="overview" className="m-0">
            {!financeLoading && (payments.length > 0 || invoices.length > 0) && (
              <Card className="border-border/50">
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
                        {payments.slice(0, 3).map((payment) => (
                        <motion.div
                          key={payment.id}
                          layoutId={`payment-card-${payment.id}-${id}`}
                          onClick={() => setExpandedPayment(payment)}
                          className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded-lg hover:bg-primary/5 hover:border hover:border-primary/20 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-background p-2 rounded-lg flex-shrink-0">
                              {getTypeIcon(payment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <motion.p 
                                layoutId={`payment-title-${payment.id}-${id}`}
                                className="font-medium text-sm line-clamp-1"
                              >
                                {payment.description}
                              </motion.p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={getStatusColor(payment.status) + ' text-xs h-5'}>
                                  {getStatusIcon(payment.status)}
                                  <span className="ml-1 capitalize">{payment.status}</span>
                                </Badge>
                                <span className="text-xs text-muted-foreground">{payment.date}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1">Click for details</p>
                            </div>
                          </div>
                          <p className="font-bold text-sm text-primary flex-shrink-0">
                            {payment.amount.toLocaleString()} {payment.currency}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Invoices */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base">Pending Invoices</h3>
                      <Badge className="bg-amber-500/10 text-amber-600 border-0 text-xs">
                        {invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {invoices.filter(i => i.status === 'pending' || i.status === 'overdue').map((invoice) => (
                        <motion.div
                          key={invoice.id}
                          layoutId={`invoice-card-${invoice.id}-${id}`}
                          onClick={() => setExpandedInvoice(invoice)}
                          className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded-lg hover:bg-amber-500/5 hover:border hover:border-amber-500/20 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-background p-2 rounded-lg flex-shrink-0">
                              <Receipt className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <motion.p 
                                layoutId={`invoice-title-${invoice.id}-${id}`}
                                className="font-medium text-sm line-clamp-1"
                              >
                                {invoice.project}
                              </motion.p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">{invoice.invoiceNumber}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">Due: {invoice.dueDate}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1">Click for details</p>
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
                        </motion.div>
                      ))}
                      {invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                          <p className="text-sm text-muted-foreground">All invoices paid!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Payments Tab - Separate Card */}
          <TabsContent value="payments" className="m-0">
            {!financeLoading && (
              <Card className="border-border/50">
              <CardContent className="p-4 space-y-4 bg-background">
                {/* Search & Make Payment Button */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payments by project, engineer, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>
                  <Button 
                    className="h-9 text-xs flex-shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Make Payment
                  </Button>
                </div>

                {/* Payments List */}
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      layoutId={`payment-tab-card-${payment.id}-${id}`}
                      onClick={() => setExpandedPayment(payment)}
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer hover:border-primary/30">
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
                                <p className="text-[10px] text-muted-foreground mt-2">Click to view full payment details</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <p className="font-bold text-lg text-primary">
                                {payment.amount.toLocaleString()} {payment.currency}
                              </p>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle view action
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle download action
                                  }}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Invoices Tab - Separate Card */}
          <TabsContent value="invoices" className="m-0">
            {!financeLoading && (
              <Card className="border-border/50">
              <CardContent className="p-4 space-y-4 bg-background">
                {/* Search & Create Invoice Button */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices by project, number, or client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowInvoiceBuilder(true)} 
                    className="h-9 text-xs flex-shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Invoice
                  </Button>
                </div>

                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <motion.div
                      key={invoice.id}
                      layoutId={`invoice-tab-card-${invoice.id}-${id}`}
                      onClick={() => setExpandedInvoice(invoice)}
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer hover:border-amber-500/30">
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
                                <p className="text-[10px] text-muted-foreground mt-2">Click to view full invoice details</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <p className="font-bold text-lg text-primary">
                                {invoice.amount.toLocaleString()} {invoice.currency}
                              </p>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle view action
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle download action
                                  }}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                                {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                  <Button 
                                    size="sm" 
                                    className="h-7 text-xs px-2 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle pay now action
                                    }}
                                  >
                                    Pay Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Quotations Tab - Separate Card */}
          <TabsContent value="quotations" className="m-0">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-4 bg-background">
                {/* Search & Create Quotation Button */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search quotations by project, number, or client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowQuotationBuilder(true)} 
                    className="h-9 text-xs flex-shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Quotation
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockQuotations.map((quote) => (
                    <motion.div
                      key={quote.id}
                      layoutId={`quotation-card-${quote.id}-${id}`}
                      onClick={() => setExpandedQuotation(quote)}
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer hover:border-purple-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="bg-muted/50 p-3 rounded-lg flex-shrink-0">
                                <Receipt className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <motion.h3 
                                    layoutId={`quotation-title-${quote.id}-${id}`}
                                    className="font-bold text-base"
                                  >
                                    {quote.quoteNumber}
                                  </motion.h3>
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
                                <p className="text-[10px] text-muted-foreground mt-2">Click to view full quotation details</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <p className="font-bold text-lg text-primary">
                                {quote.amount.toLocaleString()} {quote.currency}
                              </p>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle view action
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                {quote.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="h-7 text-xs px-2 ml-1 bg-green-500 hover:bg-green-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle accept action
                                      }}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-7 text-xs px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle reject action
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab - Separate Card */}
          <TabsContent value="milestones" className="m-0">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-4 bg-background">
                {/* Search & Create Milestone Button */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search milestones by project, title, or status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>
                  <Button 
                    className="h-9 text-xs flex-shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Milestone
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockMilestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      layoutId={`milestone-card-${milestone.id}-${id}`}
                      onClick={() => setExpandedMilestone(milestone)}
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer hover:border-info/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="bg-muted/50 p-3 rounded-lg flex-shrink-0">
                                <Target className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <motion.h3 
                                    layoutId={`milestone-title-${milestone.id}-${id}`}
                                    className="font-bold text-base line-clamp-1"
                                  >
                                    {milestone.name}
                                  </motion.h3>
                                  <Badge className={`${
                                    milestone.status === 'completed' ? 'bg-green-500/10 text-green-600 border-0' :
                                    milestone.status === 'approved' ? 'bg-primary/10 text-primary border-0' :
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
                                <p className="text-[10px] text-muted-foreground mt-2">Click to view milestone details and progress</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <p className="font-bold text-lg text-primary">
                                {milestone.amount.toLocaleString()} {milestone.currency}
                              </p>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle view action
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                {milestone.status === 'completed' && (
                                  <Button 
                                    size="sm" 
                                    className="h-7 text-xs px-2 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle approve payment action
                                    }}
                                  >
                                    Approve Payment
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
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
              <QuotationPage />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
      </FeatureGate>
    </>
  );
}
