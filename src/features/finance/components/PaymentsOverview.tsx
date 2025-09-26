import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
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

const paymentTypeColors = {
  invoice: "bg-info/10 text-info border-info/20",
  milestone: "bg-success/10 text-success border-success/20",
  escrow: "bg-primary/10 text-primary border-primary/20",
  payout: "bg-info/10 text-info border-info/20",
  refund: "bg-warning/10 text-warning border-warning/20"
};

const paymentStatusColors = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  disputed: "bg-destructive/10 text-destructive",
  overdue: "bg-destructive/10 text-destructive",
  held: "bg-purple/10 text-purple"
};

export function PaymentsOverview() {
  const { payments, paymentStats, loading } = usePaymentsStore();

  // Recent payments (last 10)
  const recentPayments = payments
    .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
    .slice(0, 10);

  // Calculate growth percentage
  const growthPercentage = paymentStats.lastMonth.amount > 0 
    ? ((paymentStats.thisMonth.amount - paymentStats.lastMonth.amount) / paymentStats.lastMonth.amount) * 100
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentStats.total.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentStats.total.count} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentStats.pending.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentStats.pending.count} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentStats.completed.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentStats.completed.count} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
            <AlertCircle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentStats.escrow.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentStats.escrow.count} escrow payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payments Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Payments</CardTitle>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-sidebar-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={payment.client.avatar} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {payment.client.company.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{payment.title}</h4>
                          <Badge className={paymentTypeColors[payment.type]}>
                            {payment.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.client.company} • {formatDate(payment.createdDate)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      <Badge variant="secondary" className={paymentStatusColors[payment.status]}>
                        {payment.status}
                      </Badge>
                    </div>

                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {recentPayments.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No payments found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                <DollarSign className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Statement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Dispute Payment
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-info" />
                  </div>
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-muted-foreground">Primary</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <div className="font-medium">STC Pay</div>
                    <div className="text-sm text-muted-foreground">Secondary</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="font-medium">{formatCurrency(paymentStats.thisMonth.amount)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Growth</span>
                  <div className="flex items-center gap-1">
                    {growthPercentage >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`font-medium ${growthPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {Math.abs(growthPercentage).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platform Fees</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <span className="font-medium">{formatCurrency(paymentStats.thisMonth.amount * 0.05)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
