import React, { useState, useEffect } from 'react';
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
  Calculator,
  ClipboardList,
  TrendingUp,
  BarChart3,
  Zap,
  Wallet,
  FileDown,
  Plus,
  ArrowLeft,
  Briefcase,
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Target,
  Calendar,
} from 'lucide-react';

// Import shared components
import { ROUTES } from '@/shared/constants/routes';

// Sample projects (same as planning page)
const sampleProjects = [
  { id: '1', name: 'Al-Khobar Commercial Center', progress: 68, budget: 850000 },
  { id: '2', name: 'Riyadh Metro Extension Phase 3', progress: 25, budget: 2100000 },
  { id: '3', name: 'NEOM Infrastructure Phase 2', progress: 42, budget: 3500000 },
];

// 6 Cost & Budgeting Tools
const budgetingTools = [
  {
    id: 'boq',
    title: 'BOQ Generator',
    subtitle: 'Bill of Quantities with AI',
    description: 'Generate comprehensive BOQ with material quantities, unit prices, and totals for tender submission',
    icon: ClipboardList,
    route: '/free/ai-tools/budgeting/boq',
    features: 'Categories, Items, Calculations',
    colorClass: 'bg-primary/10',
  },
  {
    id: 'estimator',
    title: 'Cost Estimator',
    subtitle: 'Project cost breakdown',
    description: 'Phase-by-phase cost estimation with AI analysis, historical comparisons, and confidence scoring',
    icon: Calculator,
    route: '/free/ai-tools/budgeting/estimator',
    features: 'Phases, Categories, Forecasting',
    colorClass: 'bg-primary/15',
  },
  {
    id: 'cashflow',
    title: 'Cash Flow Planner',
    subtitle: 'Financial timeline',
    description: 'Monthly cash flow projections with inflow/outflow analysis, funding gap alerts, and milestone tracking',
    icon: TrendingUp,
    route: '/free/ai-tools/budgeting/cashflow',
    features: 'Timeline, Projections, Alerts',
    colorClass: 'bg-primary/12',
  },
  {
    id: 'tracker',
    title: 'Budget Tracker',
    subtitle: 'Real-time monitoring',
    description: 'Track actual vs planned spending with variance analysis, alerts, and AI-powered forecasting',
    icon: BarChart3,
    route: '/free/ai-tools/budgeting/tracker',
    features: 'Variance, Alerts, Forecasts',
    colorClass: 'bg-primary/6',
  },
  {
    id: 'value',
    title: 'Value Engineering',
    subtitle: 'Cost optimization',
    description: 'AI-suggested material alternatives with cost-benefit analysis and savings opportunities identification',
    icon: Zap,
    route: '/free/ai-tools/budgeting/value',
    features: 'Alternatives, Savings, Trade-offs',
    colorClass: 'bg-primary/20',
  },
  {
    id: 'payments',
    title: 'Payment Schedule',
    subtitle: 'Milestone payments',
    description: 'Create payment schedules with milestones, retention tracking, and contractor payment management',
    icon: Wallet,
    route: '/free/ai-tools/budgeting/payments',
    features: 'Milestones, Retention, Terms',
    colorClass: 'bg-primary/8',
  },
];

// Recent activities
const recentActivities = [
  { id: 1, action: 'BOQ updated', tool: 'BOQ Generator', time: '2 hours ago', icon: ClipboardList },
  { id: 2, action: 'Cost estimate exported', tool: 'Cost Estimator', time: '5 hours ago', icon: Calculator },
  { id: 3, action: 'Cash flow adjusted', tool: 'Cash Flow Planner', time: '1 day ago', icon: TrendingUp },
];

// Recent outputs
const recentOutputs = [
  { 
    id: 1, 
    title: 'BOQ for NEOM Phase 2', 
    tool: 'BOQ Generator', 
    date: 'Oct 20, 2025', 
    icon: ClipboardList,
    size: '1.2 MB'
  },
  { 
    id: 2, 
    title: 'Q1 2025 Cash Flow Projection', 
    tool: 'Cash Flow Planner', 
    date: 'Oct 18, 2025', 
    icon: TrendingUp,
    size: '245 KB'
  },
  { 
    id: 3, 
    title: 'Budget Variance Report - Sept', 
    tool: 'Budget Tracker', 
    date: 'Oct 15, 2025', 
    icon: BarChart3,
    size: '180 KB'
  },
];

export default function CostBudgetingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<string>('1');

  useEffect(() => {
    // Get project from URL or default to first project
    const projectId = searchParams.get('project') || sampleProjects[0].id;
    setSelectedProject(projectId);
  }, [searchParams]);

  const handleToolClick = (route: string) => {
    if (selectedProject) {
      navigate(`${route}?project=${selectedProject}`);
    } else {
      navigate(route);
    }
  };

  const selectedProjectData = sampleProjects.find(p => p.id === selectedProject);
  const completedTools = 3; // Sample: 3 out of 6 tools used
  const progressPercentage = (completedTools / budgetingTools.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Cost & Budgeting Tools</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered cost estimation and budget management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
              Export All
            </Button>
            <Button className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Budget
            </Button>
          </div>
        </div>

        {/* Top Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Active Project */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Select Active Project</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="border border-border h-10">
                  <SelectValue placeholder="Choose a project to work on..." />
                </SelectTrigger>
                <SelectContent>
                  {sampleProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedProjectData && (
                <div className="p-4 bg-background rounded-lg border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{selectedProjectData.name}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px]">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{selectedProjectData.progress}%</span>
                    </div>
                    <Progress value={selectedProjectData.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-bold text-primary">
                      {selectedProjectData.budget.toLocaleString()} SAR
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budgeting Progress */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Budgeting Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tools Completed</span>
                  <span className="font-medium">{completedTools} / {budgetingTools.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-primary">{completedTools}</div>
                  <div className="text-[9px] text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-amber-600">2</div>
                  <div className="text-[9px] text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-2 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold text-muted-foreground">1</div>
                  <div className="text-[9px] text-muted-foreground">Not Started</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Cost & Budgeting Tools */}
        <div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetingTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="border-border/50 hover:shadow-md transition-all">
                  <CardHeader className="p-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl ring-1 shadow-md bg-primary/10 text-primary border-primary/20">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-bold tracking-tight">
                          {tool.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tool.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2.5">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      <span>{tool.features}</span>
                    </div>
                    <Button
                      onClick={() => handleToolClick(tool.route)}
                      className="w-full h-8 text-xs shadow-md"
                      disabled={!selectedProject}
                    >
                      Launch Tool →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Activities */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Activities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all"
                  >
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{activity.action}</p>
                      <p className="text-[10px] text-muted-foreground">{activity.tool}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Outputs */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Outputs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {recentOutputs.map((output) => {
                const IconComponent = output.icon;
                return (
                  <div
                    key={output.id}
                    className="p-3 bg-background rounded-lg border border-border hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium mb-0.5">{output.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{output.tool}</span>
                          <span>•</span>
                          <span>{output.date}</span>
                          <span>•</span>
                          <span>{output.size}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <FileDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* How AI-Powered Budgeting Works */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">
                How AI-Powered Budgeting Works
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Select Tool</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose from 6 specialized budgeting tools based on your needs
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-sm font-bold mb-2">AI Generate</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Let AI create BOQs, estimates, and budgets from project data
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-all">
                <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Review & Export</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Refine results and export to Excel, PDF, or accounting software
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.BUDGETING_BOQ)}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                BOQ
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.BUDGETING_ESTIMATOR)}
              >
                <Calculator className="h-3.5 w-3.5 mr-1.5" />
                Cost
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.BUDGETING_CASHFLOW)}
              >
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Cash Flow
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleToolClick(ROUTES.AI_TOOLS.BUDGETING_TRACKER)}
              >
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                Tracker
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

