import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Avatar, AvatarFallback } from "../../../../../1-HomePage/others/components/ui/avatar";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  MessageSquare,
  ArrowRight,
  Play
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

const milestoneStatusColors = {
  pending: "bg-warning/10 text-warning",
  in_progress: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  disputed: "bg-destructive/10 text-destructive"
};

export function PaymentsMilestone() {
  const { payments } = usePaymentsStore();
  
  // Filter only milestone payments
  const milestonePayments = payments.filter(payment => payment.type === 'milestone');

  // Separate by status
  const pendingMilestones = milestonePayments.filter(milestone => milestone.status === 'pending');
  const inProgressMilestones = milestonePayments.filter(milestone => milestone.status === 'processing');
  const completedMilestones = milestonePayments.filter(milestone => milestone.status === 'completed');

  const getProjectProgress = (milestone: any) => {
    // Mock progress calculation based on project phase
    const phaseProgress = {
      'Phase 1 - Foundation': 25,
      'Design Phase': 60,
      'Safety Assessment': 80,
      'Landscape Design': 45,
      'Infrastructure Design': 30,
      'Marine Infrastructure': 70,
      'Design & Planning': 90,
      'System Upgrade': 55
    };
    return phaseProgress[milestone.project.phase] || 50;
  };

  const getDaysUntilDue = (dueDate?: Date) => {
    if (!dueDate) return null;
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const MilestoneCard = ({ milestone }: { milestone: any }) => {
    const progress = getProjectProgress(milestone);
    const daysUntilDue = getDaysUntilDue(milestone.dueDate);
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
    const isDueSoon = daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue >= 0;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-success" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-1">{milestone.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{milestone.client.company}</span>
                  <span>•</span>
                  <span>{milestone.project.phase}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-lg text-foreground mb-1">
                {formatCurrency(milestone.amount, milestone.currency)}
              </div>
              <Badge variant="secondary" className={milestoneStatusColors[milestone.status]}>
                {milestone.status}
              </Badge>
            </div>
          </div>

          {/* Project Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Project Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sidebar-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(milestone.createdDate)}</span>
              </div>
              {milestone.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Due: {formatDate(milestone.dueDate)}</span>
                  {isOverdue && (
                    <AlertTriangle className="w-4 h-4 text-destructive ml-1" />
                  )}
                  {isDueSoon && (
                    <AlertTriangle className="w-4 h-4 text-warning ml-1" />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {milestone.status === 'pending' && (
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  Start Work
                </Button>
              )}
              <Button size="sm" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Details
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

          {/* Fees Breakdown */}
          {milestone.fees && (
            <div className="mt-4 pt-4 border-t border-sidebar-border">
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Milestone Amount:</span>
                  <span>{formatCurrency(milestone.amount)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Platform Fee ({((milestone.fees.platform / milestone.amount) * 100).toFixed(1)}%):</span>
                  <span>-{formatCurrency(milestone.fees.platform)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Processing Fee:</span>
                  <span>-{formatCurrency(milestone.fees.processing)}</span>
                </div>
                <div className="flex justify-between font-medium text-foreground pt-2 border-t border-sidebar-border">
                  <span>You'll Receive:</span>
                  <span>{formatCurrency(milestone.amount - milestone.fees.total)}</span>
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
            <CardTitle className="text-sm font-medium">Pending Milestones</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pendingMilestones.reduce((sum, milestone) => sum + milestone.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingMilestones.length} milestones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Target className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(inProgressMilestones.reduce((sum, milestone) => sum + milestone.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {inProgressMilestones.length} active
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
              {formatCurrency(completedMilestones.reduce((sum, milestone) => sum + milestone.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedMilestones.length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How Milestones Work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            How NBCon Milestones Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-info" />
              </div>
              <h4 className="font-medium mb-2">1. Milestone Defined</h4>
              <p className="text-sm text-muted-foreground">
                Client and engineer agree on project phases and payment milestones
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-warning" />
              </div>
              <h4 className="font-medium mb-2">2. Work Completed</h4>
              <p className="text-sm text-muted-foreground">
                Engineer completes milestone deliverables and submits for review
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-medium mb-2">3. Payment Released</h4>
              <p className="text-sm text-muted-foreground">
                Client approves milestone and payment is automatically released
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Milestones */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Pending Milestones ({pendingMilestones.length})
        </h3>
        <div className="space-y-4">
          {pendingMilestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
          {pendingMilestones.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending milestones</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Milestones will appear here when clients create new projects
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* In Progress Milestones */}
      {inProgressMilestones.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            In Progress ({inProgressMilestones.length})
          </h3>
          <div className="space-y-4">
            {inProgressMilestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Milestones */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Recent Completions ({completedMilestones.length})
        </h3>
        <div className="space-y-4">
          {completedMilestones.slice(0, 5).map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
          {completedMilestones.length > 5 && (
            <Card>
              <CardContent className="text-center py-4">
                <Button variant="outline">
                  Load More ({completedMilestones.length - 5} remaining)
                </Button>
              </CardContent>
            </Card>
          )}
          {completedMilestones.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed milestones</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
