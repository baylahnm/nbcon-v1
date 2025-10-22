import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  Calendar,
  User,
  Loader2,
  Brain,
  TrendingUp,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface ChangeOrder {
  id: string;
  number: string;
  title: string;
  description: string;
  type: 'scope' | 'design' | 'material' | 'schedule' | 'other';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'implemented';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  originalCost: number;
  changeCost: number;
  totalCost: number;
  impact: {
    cost: number;
    schedule: number;
    quality: string;
    risk: 'low' | 'medium' | 'high';
  };
  attachments: string[];
  comments: string;
}

export default function ChangeOrderManagerTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  // Sample change orders
  const [changeOrders] = useState<ChangeOrder[]>([
    {
      id: '1',
      number: 'CO-2025-001',
      title: 'Additional Electrical Outlets',
      description: 'Client requested 15 additional electrical outlets in conference rooms',
      type: 'scope',
      status: 'approved',
      priority: 'medium',
      requestedBy: 'Ahmed Al-Rashid',
      requestedDate: '2025-01-10',
      approvedBy: 'Project Manager',
      approvedDate: '2025-01-12',
      originalCost: 50000,
      changeCost: 2500,
      totalCost: 52500,
      impact: {
        cost: 2500,
        schedule: 2,
        quality: 'No impact',
        risk: 'low'
      },
      attachments: ['electrical-plan.pdf', 'cost-estimate.xlsx'],
      comments: 'Approved with minor modifications to outlet placement'
    },
    {
      id: '2',
      number: 'CO-2025-002',
      title: 'Premium Flooring Material',
      description: 'Upgrade from standard tiles to premium marble flooring',
      type: 'material',
      status: 'under-review',
      priority: 'high',
      requestedBy: 'Sarah Johnson',
      requestedDate: '2025-01-15',
      originalCost: 30000,
      changeCost: 15000,
      totalCost: 45000,
      impact: {
        cost: 15000,
        schedule: 5,
        quality: 'Enhanced aesthetics',
        risk: 'medium'
      },
      attachments: ['marble-samples.pdf', 'supplier-quote.pdf'],
      comments: 'Under review by client for budget approval'
    },
    {
      id: '3',
      number: 'CO-2025-003',
      title: 'Schedule Extension',
      description: 'Extend project completion by 2 weeks due to weather delays',
      type: 'schedule',
      status: 'submitted',
      priority: 'critical',
      requestedBy: 'Site Supervisor',
      requestedDate: '2025-01-18',
      originalCost: 0,
      changeCost: 0,
      totalCost: 0,
      impact: {
        cost: 0,
        schedule: 14,
        quality: 'No impact',
        risk: 'low'
      },
      attachments: ['weather-report.pdf'],
      comments: 'Weather-related delay, no additional costs'
    }
  ]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive change order analysis for a construction project. Project ID: ${projectId || 'N/A'}. Analyze current change orders, identify patterns, cost impacts, schedule effects, and provide recommendations for change order management. Include risk assessment and mitigation strategies for Saudi construction projects.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has analyzed change orders and provided insights. Review recommendations below.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate change order analysis. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIPredictChanges = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Predict potential change orders for a construction project. Project ID: ${projectId || 'N/A'}. Based on project type, location, and historical data, identify likely change scenarios including scope creep, material substitutions, design modifications, and schedule adjustments. Provide early warning indicators and preventive measures for Saudi construction projects.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has predicted potential changes and provided early warning indicators.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI prediction failed:', error);
      toast.error("Could not predict changes. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAIOptimizeApproval = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Optimize change order approval workflow for a construction project. Project ID: ${projectId || 'N/A'}. Analyze current approval bottlenecks, suggest streamlined processes, identify required stakeholders, and recommend approval thresholds. Include digital workflow automation and Saudi construction contract compliance requirements.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has optimized the approval workflow and provided process improvements.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI optimization failed:', error);
      toast.error("Could not optimize approval workflow. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Your change order data has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your change order report is being exported to PDF...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'submitted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'under-review':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'approved':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'implemented':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-3.5 w-3.5" />;
      case 'submitted':
        return <Clock className="h-3.5 w-3.5" />;
      case 'under-review':
        return <AlertCircle className="h-3.5 w-3.5" />;
      case 'approved':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'rejected':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'implemented':
        return <FileCheck className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  };

  const formatSAR = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalChangeCost = changeOrders.reduce((sum, co) => sum + co.changeCost, 0);
  const approvedCount = changeOrders.filter(co => co.status === 'approved').length;
  const pendingCount = changeOrders.filter(co => co.status === 'submitted' || co.status === 'under-review').length;
  const rejectedCount = changeOrders.filter(co => co.status === 'rejected').length;

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
              onClick={() => navigate('/free/ai-tools/execution')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Change Order Manager</h1>
              <p className="text-xs text-muted-foreground">
                Track and manage project changes with AI insights
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
              Save Changes
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{changeOrders.length}</div>
              <div className="text-xs text-muted-foreground">Total Change Orders</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{formatSAR(totalChangeCost)}</div>
              <div className="text-xs text-muted-foreground">Total Change Cost</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - AI Actions & Insights */}
          <div className="lg:col-span-1 space-y-4">
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
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI Analyze Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIPredictChanges}
                  disabled={isGenerating}
                >
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  Predict Changes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={handleAIOptimizeApproval}
                  disabled={isGenerating}
                >
                  <FileCheck className="h-3.5 w-3.5 mr-1.5" />
                  Optimize Workflow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Generate Template
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">Cost Impact</span>
                  </div>
                  <p className="text-[10px] text-amber-600/80 leading-relaxed">
                    Change orders have increased project cost by 5.2%. Monitor scope creep.
                  </p>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Pattern Analysis</span>
                  </div>
                  <p className="text-[10px] text-blue-600/80 leading-relaxed">
                    Most changes are scope-related. Consider better initial planning.
                  </p>
                </div>

                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Approval Rate</span>
                  </div>
                  <p className="text-[10px] text-green-600/80 leading-relaxed">
                    67% approval rate indicates good change management process.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Cost Impact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Change Cost</div>
                  <div className="text-xl font-bold text-primary">{formatSAR(totalChangeCost)}</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Average per CO</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatSAR(changeOrders.length > 0 ? totalChangeCost / changeOrders.length : 0)}
                  </div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground mb-1">Schedule Impact</div>
                  <div className="text-xl font-bold text-amber-600">+21 days</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Change Orders List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        Change Orders
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {changeOrders.length} change orders • {approvedCount} approved • {pendingCount} pending
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowNewForm(!showNewForm)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    New Change Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {changeOrders.map((changeOrder) => (
                  <div key={changeOrder.id} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-bold">{changeOrder.title}</h3>
                          <Badge className={`text-[9px] ${getStatusColor(changeOrder.status)}`}>
                            {getStatusIcon(changeOrder.status)}
                            <span className="ml-1">
                              {changeOrder.status === 'draft' ? 'Draft' :
                               changeOrder.status === 'submitted' ? 'Submitted' :
                               changeOrder.status === 'under-review' ? 'Under Review' :
                               changeOrder.status === 'approved' ? 'Approved' :
                               changeOrder.status === 'rejected' ? 'Rejected' : 'Implemented'}
                            </span>
                          </Badge>
                          <Badge className={`text-[9px] ${getPriorityColor(changeOrder.priority)}`}>
                            {changeOrder.priority === 'low' ? 'Low' :
                             changeOrder.priority === 'medium' ? 'Medium' :
                             changeOrder.priority === 'high' ? 'High' : 'Critical'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{changeOrder.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>#{changeOrder.number}</span>
                          <span>•</span>
                          <span>By: {changeOrder.requestedBy}</span>
                          <span>•</span>
                          <span>{changeOrder.requestedDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{formatSAR(changeOrder.changeCost)}</div>
                        <div className="text-[9px] text-muted-foreground">Change Cost</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Original Cost</div>
                        <div className="text-sm font-medium">{formatSAR(changeOrder.originalCost)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Change Cost</div>
                        <div className="text-sm font-bold text-primary">{formatSAR(changeOrder.changeCost)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Schedule Impact</div>
                        <div className="text-sm font-medium">+{changeOrder.impact.schedule} days</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Risk Level</div>
                        <div className={`text-sm font-medium ${
                          changeOrder.impact.risk === 'low' ? 'text-green-600' :
                          changeOrder.impact.risk === 'medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {changeOrder.impact.risk === 'low' ? 'Low' :
                           changeOrder.impact.risk === 'medium' ? 'Medium' : 'High'}
                        </div>
                      </div>
                    </div>

                    {changeOrder.comments && (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                        <strong>Comments:</strong> {changeOrder.comments}
                      </div>
                    )}

                    {changeOrder.attachments.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Attachments:</span>
                        {changeOrder.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-[9px]">
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
