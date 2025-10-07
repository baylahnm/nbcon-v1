import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Avatar, AvatarFallback } from "../../../../../1-HomePage/others/components/ui/avatar";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  MessageSquare,
  Lock,
  Unlock
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

const paymentStatusColors = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  disputed: "bg-destructive/10 text-destructive"
};

export function PaymentsEscrow() {
  const { payments } = usePaymentsStore();

  // Filter only escrow payments
  const escrowPayments = payments.filter(payment => payment.type === 'escrow');

  // Separate by status
  const activeEscrow = escrowPayments.filter(escrow => 
    escrow.status === 'processing' || escrow.status === 'pending'
  );
  const completedEscrow = escrowPayments.filter(escrow => escrow.status === 'completed');

  const getDaysUntilRelease = (releaseDate?: Date) => {
    if (!releaseDate) return null;
    const today = new Date();
    const diffTime = releaseDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEscrowProgress = (createdDate: Date, releaseDate?: Date) => {
    if (!releaseDate) return 0;
    const totalDays = Math.ceil((releaseDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  };

  const EscrowCard = ({ escrow }: { escrow: any }) => {
    const daysUntilRelease = getDaysUntilRelease(escrow.escrowReleaseDate);
    const progress = getEscrowProgress(escrow.createdDate, escrow.escrowReleaseDate);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-info" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">{escrow.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{escrow.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{escrow.client.company}</span>
                  <span>•</span>
                  <span>{escrow.engineer?.name}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-lg text-foreground mb-1">
                {formatCurrency(escrow.amount, escrow.currency)}
              </div>
              <Badge variant="secondary" className={paymentStatusColors[escrow.status]}>
                {escrow.status}
              </Badge>
            </div>
          </div>

          {/* Escrow Progress */}
          {escrow.escrowReleaseDate && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Escrow Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(escrow.createdDate)}</span>
              </div>
              {escrow.escrowReleaseDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Release: {formatDate(escrow.escrowReleaseDate)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Dispute
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>
            </div>
          </div>

          {daysUntilRelease !== null && (
            <div className="mt-3">
              {daysUntilRelease <= 0 ? (
                <div className="text-sm text-success font-medium">
                  Ready for release
                </div>
              ) : daysUntilRelease <= 7 ? (
                <div className="text-sm text-warning font-medium">
                  Releases in {daysUntilRelease} days
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Releases in {daysUntilRelease} days
                </div>
              )}
            </div>
          )}

          {/* Fees Breakdown */}
          {escrow.fees && (
            <div className="mt-4 pt-4 border-t border-sidebar-border">
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Project Amount:</span>
                  <span>{formatCurrency(escrow.amount)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Platform Fee ({((escrow.fees.platform / escrow.amount) * 100).toFixed(1)}%):</span>
                  <span>-{formatCurrency(escrow.fees.platform)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Processing Fee:</span>
                  <span>-{formatCurrency(escrow.fees.processing)}</span>
                </div>
                <div className="flex justify-between font-medium text-foreground pt-2 border-t border-sidebar-border">
                  <span>You'll Receive:</span>
                  <span>{formatCurrency(escrow.amount - escrow.fees.total)}</span>
                </div>
              </div>
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
            <CardTitle className="text-sm font-medium">Active Escrow</CardTitle>
            <Shield className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(activeEscrow.reduce((sum, escrow) => sum + escrow.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeEscrow.length} active escrows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Released This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(completedEscrow.reduce((sum, escrow) => sum + escrow.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedEscrow.length} released
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protection Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">
              Successful releases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How Escrow Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-info" />
            How NBCon Escrow Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-info" />
              </div>
              <h4 className="font-medium mb-2">1. Funds Secured</h4>
              <p className="text-sm text-muted-foreground">
                Client deposits project payment into secure escrow account
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <h4 className="font-medium mb-2">2. Work Completed</h4>
              <p className="text-sm text-muted-foreground">
                Engineer completes project deliverables and milestones
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-medium mb-2">3. Funds Released</h4>
              <p className="text-sm text-muted-foreground">
                Payment automatically released to engineer upon approval
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Escrow */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Active Escrow ({activeEscrow.length})
        </h3>
        <div className="space-y-4">
          {activeEscrow.map((escrow) => (
            <EscrowCard key={escrow.id} escrow={escrow} />
          ))}
          {activeEscrow.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active escrow payments</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Escrow payments will appear here when clients secure funds for your projects
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Completed Escrow */}
      {completedEscrow.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Recent Releases ({completedEscrow.length})
          </h3>
          <div className="space-y-4">
            {completedEscrow.slice(0, 5).map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))}
            {completedEscrow.length > 5 && (
              <Card>
                <CardContent className="text-center py-4">
                  <Button variant="outline">
                    Load More ({completedEscrow.length - 5} remaining)
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
