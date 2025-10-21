import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Home, Bot, Plus, Users, ChevronDown, FileText, Calculator, Mail, Shield, Wrench, ClipboardList, Trash2, Rocket, Target, DollarSign, CheckCircle, AlertTriangle, MessageCircle, Package } from "lucide-react";
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Dialog, DialogContent } from '../../../../../1-HomePage/others/components/ui/dialog';
import { ScrollArea } from '../../../../../1-HomePage/others/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../../1-HomePage/others/components/ui/dropdown-menu';
import { ChatComposer } from '../../ai/components/ChatComposer';
import { useAuthStore } from "../../../stores/auth";
import { getUserDisplayName } from '../../../../../1-HomePage/others/lib/userUtils';

// Import client dashboard widgets
import { ClientOverviewStats } from './ClientOverviewStats';
import { ClientQuickActionsHub } from './ClientQuickActionsHub';
import { ClientActiveProjectsList } from './ClientActiveProjectsList';
import { ClientRecentActivityFeed } from './ClientRecentActivityFeed';
import { ChatPage } from '../../ai/ChatPage';
import { MessageBubble } from '../../ai/components/MessageBubble';
import { useAiStore } from '../../ai/store/useAiStore';

export function DashboardContent() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [showFullChat, setShowFullChat] = useState(false);
  const { settings, setComposerText, sendMessage, deleteThread, activeThreadId, messagesByThread } = useAiStore();
  // Subscribe to messages reactively - this will update when store changes
  const activeMessages = activeThreadId ? (messagesByThread[activeThreadId] || []) : [];
  
  // Get user display name
  const displayName = getUserDisplayName(profile);

  // Handle AI prompt selection
  const handlePromptSelect = async (prompt: string) => {
    setComposerText(prompt);
    // Optional: auto-submit the prompt
    // await sendMessage(prompt);
  };

  // Handle clear chat
  const handleClearChat = () => {
    if (activeThreadId) {
      deleteThread(activeThreadId);
    }
  };

  // Get role display
  const getRoleDisplay = () => {
    if (profile?.role === 'client') {
      return 'Project Manager';
    }
    return profile?.role || 'Professional';
  };

  // Handle stat card clicks
  const handleStatClick = (stat: string) => {
    switch (stat) {
      case 'projects':
        navigate('/free/projects');
        break;
      case 'engineers':
        navigate('/free/browse-engineers');
        break;
      case 'quotes':
        navigate('/free/quotes');
        break;
      case 'finance':
        navigate('/free/finance');
        break;
      default:
        break;
    }
  };

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <header className="pb-4 border-b border-border/40" role="banner">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 flex-shrink-0">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary-gradient text-white text-xl font-bold">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-[18px] font-bold tracking-tight">
                    Welcome back, {displayName}
                  </h1>
                  <p className="text-muted-foreground text-[14px]">
                    {getCurrentDate()} • {getRoleDisplay()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Section 1: Quick Actions (Moved to Top) */}
        <section role="region" aria-label="Quick Actions">
          <ClientQuickActionsHub userRole={profile?.role} />
        </section>

        {/* Section 2: Overview Stats */}
        <ClientOverviewStats />

        {/* AI Assistant (Prominent, Top) */}
        <section 
          role="region" 
          aria-label="AI Assistant"
          style={{
            border: '2px solid transparent',
            borderRadius: '0.75rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(135deg, hsl(var(--primary) / 0.18) 0%, transparent 60%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="relative overflow-hidden bg-primary-gradient p-4 rounded-xl ring-1 ring-primary/20 shadow-primary-gradient">
                    <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary-light))_0%,hsl(var(--primary)/0.3)_50%,hsl(var(--primary-dark))_100%)]"></span>
                    <Bot className="h-5 w-5 text-primary-foreground relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight">AI Assistant</h2>
                    <p className="text-sm text-muted-foreground">How can I help you today?</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button className="h-9 text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Start Project
                  </Button>
                  <Button variant="outline" className="h-9 text-xs">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Find Engineers
                  </Button>
                  <Button variant="ghost" className="h-9 text-xs" onClick={() => navigate('/free/ai')}>
                    Open Full Chat
                  </Button>
                  {activeMessages && activeMessages.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="h-9 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-border hover:border-red-500" 
                      onClick={handleClearChat}
                      title="Clear all chat messages"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Clear Chat
                    </Button>
                  )}
                </div>
        </div>
        
              {/* Messages Preview (scrollable) */}
              {activeMessages && activeMessages.length > 0 && (
                <div className="mt-3 rounded-lg border border-border/40 bg-background">
                  <ScrollArea className="relative flex-1 p-4 overflow-y-auto max-h-72">
                    <div className="space-y-4">
                      {activeMessages.slice(-6).map((message: any) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isRTL={settings?.rtl}
                          showHijri={settings?.hijri}
                          onCitationClick={() => {}}
                          onImageDownload={() => {}}
                          onRegenerate={() => {}}
                          onFeedback={() => {}}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Inline Chat Composer */}
              <div className="mt-4 border-t border-border/40">
                <ChatComposer />
              </div>

              {/* AI Prompt Templates - 8 Categories (40 Prompts) */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Project Initiation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Project Initiation AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Rocket className="h-3 w-3" />
                        <span>Project Initiation</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive project charter including vision, objectives, scope boundaries, success criteria, stakeholders, and initial constraints for a commercial construction project.")}>
                      Create project charter with objectives
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a feasibility study analyzing technical viability, financial projections, resource requirements, regulatory compliance, and risk assessment for a new construction project.")}>
                      Generate feasibility study
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Define a detailed project scope statement covering deliverables, acceptance criteria, exclusions, constraints, and assumptions for a construction project.")}>
                      Define project scope statement
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive stakeholder register mapping stakeholders, their interests, influence levels, communication needs, and engagement strategies.")}>
                      Create stakeholder register
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft a project kickoff meeting agenda including introductions, project overview, roles and responsibilities, communication plan, and next steps.")}>
                      Draft project kickoff agenda
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 2. Strategic Planning */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Strategic Planning AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3 w-3" />
                        <span>Strategic Planning</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a detailed Work Breakdown Structure (WBS) for a construction project, breaking down deliverables into manageable work packages with hierarchical organization.")}>
                      Generate Work Breakdown Structure (WBS)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive project schedule template with phases, milestones, task dependencies, duration estimates, and critical path analysis.")}>
                      Create project schedule template
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build a resource allocation plan mapping team members, equipment, materials, and budget across project phases with utilization rates and availability.")}>
                      Build resource allocation plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Design a visual project roadmap showing key phases, major milestones, deliverable dates, decision points, and dependencies over the project timeline.")}>
                      Design project roadmap
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a sprint planning template for agile project management including user stories, acceptance criteria, story points, velocity tracking, and retrospective format.")}>
                      Create sprint/phase planning template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 3. Budgeting & Finance */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Budgeting & Finance AI prompts">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3 w-3" />
                        <span>Budgeting & Finance</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Estimate comprehensive project costs including direct costs (labor, materials, equipment), indirect costs (overhead, admin), contingency reserves, and management reserves.")}>
                      Estimate comprehensive project costs
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a detailed Bill of Quantities (BOQ) template for residential construction, organized by CSI divisions with quantities, units, rates, and total costs.")}>
                      Generate Bill of Quantities (BOQ)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a budget baseline document with cost breakdown by phase, cost performance metrics (CPI, EV, AC), variance analysis, and forecasting templates.")}>
                      Create budget baseline and tracking
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build a 12-month cash flow forecast showing projected income, expenses, net cash position, cumulative cash flow, and funding requirement analysis.")}>
                      Build cash flow forecast
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Design a cost control dashboard template tracking planned vs actual costs, budget utilization, variance alerts, trend analysis, and forecast at completion.")}>
                      Design cost control dashboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 4. Execution & Coordination */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Execution & Coordination AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        <span>Execution & Coordination</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a daily standup meeting template covering yesterday's achievements, today's priorities, blockers and dependencies, resource needs, and coordination points.")}>
                      Create daily standup template
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a RACI matrix (Responsible, Accountable, Consulted, Informed) for a construction project mapping tasks to team members with clear accountability.")}>
                      Generate task assignment matrix (RACI)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build a comprehensive progress tracking template including task completion percentages, milestone status, deliverable reviews, and earned value metrics.")}>
                      Build progress tracking system
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Design a team coordination plan covering communication protocols, decision-making authority, escalation procedures, meeting schedules, and collaboration tools.")}>
                      Design team coordination plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a procurement schedule template listing materials/services needed, quantities, lead times, preferred vendors, approval requirements, and delivery tracking.")}>
                      Create procurement schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 5. Quality & Compliance */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Quality & Compliance AI prompts">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3" />
                        <span>Quality & Compliance</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive quality assurance plan including quality standards, inspection points, testing protocols, acceptance criteria, and non-conformance procedures.")}>
                      Create quality assurance plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a regulatory compliance checklist for Saudi Arabia covering building codes, safety regulations, environmental requirements, and permit documentation.")}>
                      Generate compliance checklist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build a systematic inspection schedule template mapping inspection types, frequencies, responsible parties, documentation requirements, and approval workflows.")}>
                      Build inspection schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Design a testing and commissioning protocol for MEP systems including test procedures, acceptance criteria, documentation forms, and sign-off requirements.")}>
                      Design testing protocol
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create an audit preparation guide listing required documentation, compliance evidence, key personnel, common audit questions, and readiness checklist.")}>
                      Create audit preparation guide
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 6. Risk & Safety Management */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Risk & Safety Management AI prompts">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Risk & Safety</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Conduct a comprehensive risk assessment for a construction project identifying technical, schedule, cost, and external risks with probability-impact scoring and heat map.")}>
                      Conduct risk assessment analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a detailed risk mitigation plan for top 10 project risks including prevention strategies, contingency plans, trigger conditions, and responsible owners.")}>
                      Create risk mitigation plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a site safety management plan covering hazard identification, PPE requirements, safety training, incident reporting, emergency procedures, and safety audits.")}>
                      Generate safety management plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build an issue tracking template capturing issue description, severity, impact, assigned owner, resolution steps, status updates, and closure verification.")}>
                      Build issue tracking system
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Design a change control process template including change request form, impact assessment, approval workflow, implementation plan, and communication procedure.")}>
                      Design change control process
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 7. Communication & Reporting */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Communication & Reporting AI prompts">
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-3 w-3" />
                        <span>Communication</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft an executive status report template with project health (RAG status), key achievements, upcoming milestones, budget status, risks, and decisions needed.")}>
                      Draft executive status report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a stakeholder-specific communication covering project progress, completed deliverables, schedule updates, budget status, and action items requiring their input.")}>
                      Create stakeholder update
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate comprehensive meeting minutes template including attendees, agenda items, discussion summaries, decisions made, action items with owners/deadlines, and next meeting.")}>
                      Generate meeting minutes
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Write a project newsletter template highlighting recent achievements, team spotlights, upcoming activities, lessons learned, and celebrating successes.")}>
                      Write project newsletter
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build a project dashboard layout design showing KPIs (schedule variance, cost variance, quality metrics), status indicators, trend charts, and alert sections.")}>
                      Build reporting dashboard layout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 8. Closure & Handover */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Closure & Handover AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Package className="h-3 w-3" />
                        <span>Closure & Handover</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive project closeout checklist covering deliverable acceptance, documentation completion, financial closure, contract termination, and team release.")}>
                      Create project closeout checklist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a handover documentation package including as-built drawings, operation manuals, maintenance schedules, warranty information, and training materials.")}>
                      Generate handover documentation
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Write a detailed lessons learned report analyzing what went well, what could improve, root causes of issues, best practices identified, and recommendations for future projects.")}>
                      Write lessons learned report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Build a project archive structure organizing contracts, correspondence, technical documents, financial records, approvals, and as-built information for easy retrieval.")}>
                      Build project archive structure
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Design a post-implementation review template evaluating project objectives achievement, stakeholder satisfaction, performance metrics, budget accuracy, and success factors.")}>
                      Design post-implementation review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Full AI Chat Dialog */}
        <Dialog open={showFullChat} onOpenChange={setShowFullChat}>
          <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 overflow-hidden">
            <ChatPage onBack={() => setShowFullChat(false)} />
          </DialogContent>
        </Dialog>


        {/* Section 3 & 4: Projects and Activity */}
        <div className="flex flex-col gap-4">
          {/* Active Projects */}
          <section role="region" aria-label="Active Projects">
          <ClientActiveProjectsList />
          </section>
          
          {/* Recent Activity */}
          <section role="region" aria-label="Recent Activity">
          <ClientRecentActivityFeed />
          </section>
        </div>

      </div>
    </main>
  );
}
