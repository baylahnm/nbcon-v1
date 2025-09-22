import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  CreditCard,
  Building2,
  Smartphone,
  Download,
  Eye,
  Plus
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

const payoutStatusColors = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground"
};

export function PaymentsPayout() {
  const { payments, requestPayout } = usePaymentsStore();
  const [payoutAmount, setPayoutAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer");
  
  // Filter only payout payments
  const payoutPayments = payments.filter(payment => payment.type === 'payout');

  // Mock available balance
  const availableBalance = 45000; // SAR
  const pendingPayouts = payoutPayments.filter(payout => payout.status === 'pending' || payout.status === 'processing');
  const completedPayouts = payoutPayments.filter(payout => payout.status === 'completed');

  const handlePayoutRequest = async () => {
    const amount = parseFloat(payoutAmount);
    if (amount > 0 && amount <= availableBalance) {
      await requestPayout(amount);
      setPayoutAmount("");
    }
  };

  const PayoutCard = ({ payout }: { payout: any }) => {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6 text-primary" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">Payout Request</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {payout.method === 'bank_transfer' ? 'Bank Transfer' : 
                   payout.method === 'stc_pay' ? 'STC Pay' : 'Digital Wallet'}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Request #{payout.id.slice(-6)}</span>
                  <span>•</span>
                  <span>{formatDate(payout.createdDate)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-lg text-foreground mb-1">
                {formatCurrency(payout.amount, payout.currency)}
              </div>
              <Badge variant="secondary" className={payoutStatusColors[payout.status]}>
                {payout.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Requested: {formatDate(payout.createdDate)}</span>
              </div>
              {payout.status === 'completed' && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Completed</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>
              {payout.status === 'completed' && (
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
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
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(availableBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pendingPayouts.reduce((sum, payout) => sum + payout.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayouts.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(completedPayouts.reduce((sum, payout) => sum + payout.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedPayouts.length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Request Payout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-primary" />
            Request Payout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payout Amount (SAR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">SAR</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="pl-12"
                  max={availableBalance}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Available: {formatCurrency(availableBalance)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="stc_pay">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      STC Pay
                    </div>
                  </SelectItem>
                  <SelectItem value="digital_wallet">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Digital Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sidebar-border">
            <div className="text-sm text-muted-foreground">
              <p>Processing time: 1-3 business days</p>
              <p>Minimum payout: SAR 100</p>
            </div>
            <Button 
              onClick={handlePayoutRequest}
              disabled={!payoutAmount || parseFloat(payoutAmount) < 100 || parseFloat(payoutAmount) > availableBalance}
              className="bg-primary hover:bg-primary/90"
            >
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-info" />
              </div>
              <div>
                <div className="font-medium">Al Rajhi Bank</div>
                <div className="text-sm text-muted-foreground">Account ending in 4567</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Primary
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="font-medium">STC Pay</div>
                <div className="text-sm text-muted-foreground">+966 55 123 4567</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Secondary
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payouts */}
      {pendingPayouts.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Pending Payouts ({pendingPayouts.length})
          </h3>
          <div className="space-y-4">
            {pendingPayouts.map((payout) => (
              <PayoutCard key={payout.id} payout={payout} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Payouts */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Recent Payouts ({completedPayouts.length})
        </h3>
        <div className="space-y-4">
          {completedPayouts.slice(0, 5).map((payout) => (
            <PayoutCard key={payout.id} payout={payout} />
          ))}
          {completedPayouts.length > 5 && (
            <Card>
              <CardContent className="text-center py-4">
                <Button variant="outline">
                  Load More ({completedPayouts.length - 5} remaining)
                </Button>
              </CardContent>
            </Card>
          )}
          {completedPayouts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <ArrowUpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payout history</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your completed payouts will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
