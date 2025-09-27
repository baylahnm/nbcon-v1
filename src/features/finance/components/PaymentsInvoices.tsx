import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search,
  Filter,
  Download,
  Eye,
  Send,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  MoreHorizontal
} from "lucide-react";
import type { Payment } from "../store/usePaymentsStore";
import { InvoiceBuilder } from "./InvoiceBuilder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePaymentsStore } from "../store/usePaymentsStore";

const formatCurrency = (amount: number, currency: string = 'SAR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const paymentStatusColors = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  disputed: "bg-destructive/10 text-destructive"
};

export function PaymentsInvoices() {
  const { payments, searchQuery, setSearchQuery } = usePaymentsStore();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isInvoiceBuilderOpen, setIsInvoiceBuilderOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Payment | null>(null);

  // Filter only invoice payments
  const invoicePayments = payments.filter(payment => payment.type === 'invoice');

  // Separate by status
  const pendingInvoices = invoicePayments.filter(invoice => invoice.status === 'pending');
  const completedInvoices = invoicePayments.filter(invoice => invoice.status === 'completed');
  const failedInvoices = invoicePayments.filter(invoice => invoice.status === 'failed');

  const getDaysUntilDue = (dueDate?: Date) => {
    if (!dueDate) return null;
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const InvoiceCard = ({ invoice }: { invoice: Payment }) => {
    const daysUntilDue = getDaysUntilDue(invoice.dueDate);
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
    const isDueSoon = daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue >= 0;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {invoice.client.company.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">{invoice.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{invoice.client.company}</span>
                  {invoice.invoiceNumber && (
                    <span>#{invoice.invoiceNumber}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-lg text-foreground mb-1">
                {formatCurrency(invoice.amount, invoice.currency)}
              </div>
              <Badge variant="secondary" className={paymentStatusColors[invoice.status]}>
                {invoice.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(invoice.createdDate)}</span>
              </div>
              {invoice.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(invoice.dueDate)}</span>
                  {isOverdue && (
                    <AlertCircle className="w-4 h-4 text-destructive ml-1" />
                  )}
                  {isDueSoon && (
                    <AlertCircle className="w-4 h-4 text-warning ml-1" />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {invoice.status === 'pending' && (
                <Button size="sm" variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setPreviewInvoice(invoice)}>
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.location.assign(`/engineer/payments/${invoice.id}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {daysUntilDue !== null && (
            <div className="mt-3">
              {isOverdue ? (
                <div className="text-sm text-destructive font-medium">
                  Overdue by {Math.abs(daysUntilDue)} days
                </div>
              ) : isDueSoon ? (
                <div className="text-sm text-warning font-medium">
                  Due in {daysUntilDue} days
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Due in {daysUntilDue} days
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(completedInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedInvoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <FileText className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(failedInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {failedInvoices.length} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsInvoiceBuilderOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Pending Invoices */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Pending Invoices ({pendingInvoices.length})
        </h3>
        <div className="space-y-4">
          {pendingInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
          {pendingInvoices.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending invoices</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Failed Invoices */}
      {failedInvoices.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Failed Payments ({failedInvoices.length})
          </h3>
          <div className="space-y-4">
            {failedInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Invoices */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Recent Payments ({completedInvoices.length})
        </h3>
        <div className="space-y-4">
          {completedInvoices.slice(0, 5).map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
          {completedInvoices.length > 5 && (
            <Card>
              <CardContent className="text-center py-4">
                <Button variant="outline">
                  Load More ({completedInvoices.length - 5} remaining)
                </Button>
              </CardContent>
            </Card>
          )}
          {completedInvoices.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed invoices</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isInvoiceBuilderOpen} onOpenChange={setIsInvoiceBuilderOpen}>
        <DialogContent className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] h-full overflow-hidden p-0">
          <DialogHeader className="px-4 pt-3">
            <DialogTitle className="text-base">Create Invoice</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-y-auto px-6 pb-6">
            <InvoiceBuilder onClose={() => setIsInvoiceBuilderOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      <Sheet open={!!previewInvoice} onOpenChange={() => setPreviewInvoice(null)}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Invoice Preview</SheetTitle>
          </SheetHeader>
          {previewInvoice && (
            <div className="space-y-4 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground mb-1">{previewInvoice.title}</h4>
                  <p className="text-sm text-muted-foreground">{previewInvoice.description}</p>
                </div>
                <Badge variant="secondary" className={paymentStatusColors[previewInvoice.status]}>
                  {previewInvoice.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Client</div>
                  <div className="font-medium">{previewInvoice.client.company}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium">{formatCurrency(previewInvoice.amount, previewInvoice.currency)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="font-medium">{formatDate(previewInvoice.createdDate)}</div>
                </div>
                {previewInvoice.dueDate && (
                  <div>
                    <div className="text-muted-foreground">Due</div>
                    <div className="font-medium">{formatDate(previewInvoice.dueDate)}</div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" onClick={() => window.location.assign(`/engineer/payments/${previewInvoice.id}`)}>Open full page</Button>
                <Button size="sm" variant="outline" onClick={() => setPreviewInvoice(null)}>Close</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
