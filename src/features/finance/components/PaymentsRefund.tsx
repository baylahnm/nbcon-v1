import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowDownCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  MessageSquare,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
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

const refundStatusColors = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  disputed: "bg-destructive/10 text-destructive"
};

const refundReasons = [
  "Project cancelled",
  "Work not as specified",
  "Delayed delivery",
  "Quality issues",
  "Client request",
  "Other"
];

export function PaymentsRefund() {
  const { payments, processRefund } = usePaymentsStore();
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  
  // Filter only refund payments
  const refundPayments = payments.filter(payment => payment.type === 'refund');

  // Mock refundable payments (completed payments that can be refunded)
  const refundablePayments = payments.filter(payment => 
    payment.status === 'completed' && payment.type !== 'refund'
  );

  const pendingRefunds = refundPayments.filter(refund => refund.status === 'pending' || refund.status === 'processing');
  const completedRefunds = refundPayments.filter(refund => refund.status === 'completed');

  const handleRefundRequest = async () => {
    const amount = parseFloat(refundAmount);
    if (amount > 0 && selectedPayment) {
      await processRefund(selectedPayment, amount);
      setRefundAmount("");
      setRefundReason("");
      setRefundDescription("");
      setSelectedPayment("");
    }
  };

  const RefundCard = ({ refund }: { refund: any }) => {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6 text-warning" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">Refund Request</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {refund.description || 'Refund for payment'}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Refund #{refund.id.slice(-6)}</span>
                  <span>•</span>
                  <span>{formatDate(refund.createdDate)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-lg text-foreground mb-1">
                {formatCurrency(refund.amount, refund.currency)}
              </div>
              <Badge variant="secondary" className={refundStatusColors[refund.status]}>
                {refund.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Requested: {formatDate(refund.createdDate)}</span>
              </div>
              {refund.status === 'completed' && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Processed</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>
              {refund.status === 'completed' && (
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              )}
            </div>
          </div>
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
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pendingRefunds.reduce((sum, refund) => sum + refund.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingRefunds.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(completedRefunds.reduce((sum, refund) => sum + refund.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedRefunds.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">
              Of total payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Request Refund */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-warning" />
            Request Refund
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Select Payment</Label>
              <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a payment to refund" />
                </SelectTrigger>
                <SelectContent>
                  {refundablePayments.map((payment) => (
                    <SelectItem key={payment.id} value={payment.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{payment.title}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Refund Amount (SAR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">SAR</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Refund Reason</Label>
            <Select value={refundReason} onValueChange={setRefundReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {refundReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details about the refund request..."
              value={refundDescription}
              onChange={(e) => setRefundDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <p>Processing time: 3-5 business days</p>
              <p>Refunds are processed to the original payment method</p>
            </div>
            <Button 
              onClick={handleRefundRequest}
              disabled={!refundAmount || !refundReason || !selectedPayment}
              className="bg-warning hover:bg-warning/90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Request Refund
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Refund Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-info" />
            Refund Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Eligible Refunds</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Work not delivered as specified in the project requirements</li>
                <li>Significant delays beyond agreed timeline (more than 7 days)</li>
                <li>Quality issues that don't meet professional standards</li>
                <li>Project cancellation before work begins</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Processing Time</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Refund requests are reviewed within 24 hours</li>
                <li>Approved refunds are processed within 3-5 business days</li>
                <li>Refunds are returned to the original payment method</li>
                <li>Platform fees are non-refundable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Refunds */}
      {pendingRefunds.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Pending Refunds ({pendingRefunds.length})
          </h3>
          <div className="space-y-4">
            {pendingRefunds.map((refund) => (
              <RefundCard key={refund.id} refund={refund} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Refunds */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Recent Refunds ({completedRefunds.length})
        </h3>
        <div className="space-y-4">
          {completedRefunds.slice(0, 5).map((refund) => (
            <RefundCard key={refund.id} refund={refund} />
          ))}
          {completedRefunds.length > 5 && (
            <Card>
              <CardContent className="text-center py-4">
                <Button variant="outline">
                  Load More ({completedRefunds.length - 5} remaining)
                </Button>
              </CardContent>
            </Card>
          )}
          {completedRefunds.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <ArrowDownCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No refund history</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your processed refunds will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
