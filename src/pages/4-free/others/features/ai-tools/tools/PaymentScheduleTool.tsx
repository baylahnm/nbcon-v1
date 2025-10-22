import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  Wallet,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
  CreditCard,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface PaymentMilestone {
  id: string;
  milestone: string;
  phase: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'due' | 'upcoming' | 'retention';
}

export default function PaymentScheduleTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentTerms] = useState('30'); // Net 30 days
  const [retentionPercent] = useState(5);

  // Sample payment milestones
  const [milestones] = useState<PaymentMilestone[]>([
    { id: '1', milestone: 'Mobilization', phase: 'Initiation', percentage: 10, amount: 127000, dueDate: 'Jan 15, 2025', status: 'paid' },
    { id: '2', milestone: 'Foundation Complete', phase: 'Construction', percentage: 20, amount: 254000, dueDate: 'Feb 28, 2025', status: 'due' },
    { id: '3', milestone: 'Structural Framework', phase: 'Construction', percentage: 30, amount: 381000, dueDate: 'Apr 30, 2025', status: 'upcoming' },
    { id: '4', milestone: 'MEP & Finishes', phase: 'Construction', percentage: 25, amount: 318000, dueDate: 'Jun 15, 2025', status: 'upcoming' },
    { id: '5', milestone: 'Project Completion', phase: 'Closeout', percentage: 15, amount: 190000, dueDate: 'Aug 01, 2025', status: 'upcoming' },
    { id: '6', milestone: 'Retention Release', phase: 'Post-Completion', percentage: 5, amount: 64000, dueDate: 'Nov 01, 2025', status: 'retention' },
  ]);

  const totalContract = milestones.reduce((sum, m) => sum + m.amount, 0);
  const totalPaid = milestones.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0);
  const totalPending = milestones.filter(m => m.status === 'due' || m.status === 'upcoming').reduce((sum, m) => sum + m.amount, 0);
  const retentionAmount = milestones.filter(m => m.status === 'retention').reduce((sum, m) => sum + m.amount, 0);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Create a payment schedule for a construction project. Project ID: ${projectId || 'N/A'}. Define milestones with payment percentages, amounts, and due dates. Include retention (${retentionPercent}%), payment terms (net ${paymentTerms} days), and contractor payment tracking. Use standard Saudi construction payment practices with typical milestone structure: Mobilization (10%), Foundation (20%), Structural (30%), Finishes (25%), Completion (15%), Retention (${retentionPercent}%) released 90 days post-completion.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated payment schedule. Review milestones below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate schedule. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your payment schedule has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your payment schedule is being exported to PDF...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'due':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'retention':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const nextPayment = milestones.find(m => m.status === 'due');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/ai-tools/budgeting')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Payment Schedule</h1>
              <p className="text-xs text-muted-foreground">
                Milestone-based payment tracking and management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 text-xs"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Schedule
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Total Contract</div>
                  <div className="text-lg font-bold text-primary">{totalContract.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-xl ring-1 ring-green-500/20 shadow-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Paid</div>
                  <div className="text-lg font-bold text-green-600">{totalPaid.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-xl ring-1 ring-amber-500/20 shadow-md">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Pending</div>
                  <div className="text-lg font-bold text-amber-600">{totalPending.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-xl ring-1 ring-purple-500/20 shadow-md">
                  <Wallet className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Retention</div>
                  <div className="text-lg font-bold text-purple-600">{retentionAmount.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR ({retentionPercent}%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Settings & Next Payment */}
          <div className="lg:col-span-1 space-y-4">
            {/* Payment Terms */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Payment Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                    <span className="text-muted-foreground">Payment Terms</span>
                    <span className="font-medium">Net {paymentTerms} days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                    <span className="text-muted-foreground">Retention</span>
                    <span className="font-medium">{retentionPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Actions */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">AI Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  className="w-full h-8 text-xs shadow-md"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI Generate Schedule
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Milestone
                </Button>
              </CardContent>
            </Card>

            {/* Next Payment Due */}
            {nextPayment && (
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardHeader className="p-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2 rounded-xl ring-1 ring-amber-500/20 shadow-md">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight text-amber-600">
                      Next Payment Due
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="text-xs font-medium">{nextPayment.milestone}</div>
                  <div className="text-xl font-bold text-primary">{nextPayment.amount.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground">SAR</div>
                  <div className="flex items-center gap-2 text-xs text-amber-600 mt-2">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {nextPayment.dueDate}</span>
                  </div>
                  <div className="text-[10px] text-amber-600/80">⏰ In 12 days</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Payment Schedule Table */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Payment Milestones
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {milestones.length} milestones • {totalContract.toLocaleString()} SAR total
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xs font-bold">Milestone</div>
                  <div className="text-xs font-bold">Phase</div>
                  <div className="text-xs font-bold text-right">%</div>
                  <div className="text-xs font-bold text-right">Amount</div>
                  <div className="text-xs font-bold">Due Date</div>
                  <div className="text-xs font-bold text-center">Status</div>
                </div>

                {/* Milestone Rows */}
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="grid grid-cols-6 gap-2 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all"
                  >
                    <div className="text-xs font-medium">{milestone.milestone}</div>
                    <div className="text-xs text-muted-foreground">{milestone.phase}</div>
                    <div className="text-xs text-right font-bold">{milestone.percentage}%</div>
                    <div className="text-xs text-right font-bold text-primary">
                      {milestone.amount.toLocaleString()}
                    </div>
                    <div className="text-xs">{milestone.dueDate}</div>
                    <div className="flex items-center justify-center">
                      <Badge className={`text-[9px] ${getStatusColor(milestone.status)}`}>
                        {milestone.status === 'paid' ? '✓ Paid' : 
                         milestone.status === 'due' ? '⏰ Due' : 
                         milestone.status === 'retention' ? 'Hold' : 'Upcoming'}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Payment Progress */}
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Payment Progress</span>
                      <span className="font-medium">{((totalPaid / totalContract) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(totalPaid / totalContract) * 100} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="font-bold text-green-600">{totalPaid.toLocaleString()}</div>
                        <div className="text-[9px] text-muted-foreground">Paid</div>
                      </div>
                      <div>
                        <div className="font-bold text-amber-600">{totalPending.toLocaleString()}</div>
                        <div className="text-[9px] text-muted-foreground">Pending</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-600">{retentionAmount.toLocaleString()}</div>
                        <div className="text-[9px] text-muted-foreground">Retention</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Timeline Visualization */}
            <Card className="border-border/50 mt-4">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Payment Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-0 right-0 top-4 h-0.5 bg-border"></div>
                  
                  {/* Timeline markers */}
                  <div className="relative flex justify-between">
                    {milestones.slice(0, 5).map((milestone, index) => (
                      <div key={milestone.id} className="flex flex-col items-center">
                        <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                          milestone.status === 'paid' 
                            ? 'bg-green-500 border-green-500' 
                            : milestone.status === 'due'
                            ? 'bg-amber-500 border-amber-500'
                            : 'bg-background border-border'
                        }`}>
                          {milestone.status === 'paid' && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                          {milestone.status === 'due' && (
                            <Clock className="h-4 w-4 text-white" />
                          )}
                          {milestone.status === 'upcoming' && (
                            <span className="text-[10px] font-bold text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                        <div className="text-[9px] text-center mt-2 font-medium">{milestone.milestone.split(' ')[0]}</div>
                        <div className="text-[9px] text-muted-foreground text-center">{milestone.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

