import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Home, Bot, Plus, Users, ChevronDown, FileText, Calculator, Mail, Shield, Wrench, ClipboardList, Trash2 } from "lucide-react";
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
                    <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--primary)/0.3)_50%,hsl(var(--primary))_100%)]"></span>
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

              {/* AI Prompt Templates */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Project Planning */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Project Planning AI prompts">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        <span>Project Planning</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive project charter for a commercial building project in Saudi Arabia, including scope, objectives, stakeholders, and deliverables.")}>
                      Create project charter for commercial building
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a detailed construction schedule template for a typical commercial project, including phases, milestones, and dependencies.")}>
                      Generate construction schedule template
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft a feasibility study outline for a new construction project, covering technical, financial, and operational aspects.")}>
                      Draft feasibility study outline
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Suggest risk mitigation strategies for construction projects, focusing on common risks in Saudi Arabia's construction industry.")}>
                      Suggest risk mitigation strategies
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a detailed project milestone breakdown for a construction project, with key deliverables and timeline.")}>
                      Create project milestone breakdown
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Cost & Budgeting */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Cost & Budgeting AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Calculator className="h-3 w-3" />
                        <span>Cost & Budgeting</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Estimate the cost for a comprehensive site survey in Riyadh, including topographic survey, soil testing, and geotechnical investigation.")}>
                      Estimate cost for site survey in Riyadh
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a detailed Bill of Quantities (BOQ) template for a residential villa project, organized by work packages and CSI divisions.")}>
                      Generate BOQ template for villa project
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Calculate material costs for foundation work including concrete, rebar, formwork, and excavation for a typical commercial building.")}>
                      Calculate material costs for foundation work
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Analyze a budget variance report template showing planned vs actual costs, variances, and explanations for a construction project.")}>
                      Analyze budget variance report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a cash flow projection for the next 6 months of a construction project, including inflows, outflows, and net cash position.")}>
                      Create cash flow projection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Communication */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Communication AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        <span>Communication</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft a professional client progress update email for a construction project, including completed milestones, current status, upcoming activities, and any issues requiring attention.")}>
                      Draft client progress update email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Write a contractor coordination letter addressing schedule alignment, deliverables, site access, and safety requirements for a multi-contractor project.")}>
                      Write contractor coordination letter
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive weekly site report template including work progress, labor attendance, equipment status, materials received, safety incidents, and weather conditions.")}>
                      Create weekly site report template
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft a formal Request for Information (RFI) document for clarification on structural design details, including reference drawings and specific technical questions.")}>
                      Draft RFI (Request for Information)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a professional meeting minutes template for project coordination meetings, including attendees, discussion points, decisions made, and action items with owners and deadlines.")}>
                      Generate meeting minutes template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Compliance & Safety */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Compliance & Safety AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3" />
                        <span>Compliance & Safety</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive SCE (Saudi Council of Engineers) license verification checklist for engineers, including required documents, validation steps, and compliance requirements.")}>
                      SCE license verification checklist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a detailed safety inspection report template for construction sites, covering PPE compliance, scaffolding, excavation safety, electrical hazards, and housekeeping.")}>
                      Generate safety inspection report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a comprehensive HSE (Health, Safety, Environment) compliance checklist aligned with Saudi Arabian construction regulations and international standards.")}>
                      Create HSE compliance checklist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft a complete list of building permit requirements in Saudi Arabia, including municipality approvals, civil defense clearance, and required documentation.")}>
                      Draft building permit requirements
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate quality assurance procedures template for construction projects, covering inspections, testing protocols, non-conformance handling, and documentation requirements.")}>
                      Quality assurance procedures template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Technical & Design */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Technical & Design AI prompts">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-3 w-3" />
                        <span>Technical & Design</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Suggest appropriate material specifications for structural concrete work in Saudi Arabia, including grade requirements, aggregate properties, admixtures, and compliance with Saudi Building Code.")}>
                      Suggest material specs for structural work
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Review key MEP (Mechanical, Electrical, Plumbing) design considerations for commercial buildings, including load calculations, system selection, energy efficiency, and coordination with structural elements.")}>
                      Review MEP design considerations
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Calculate concrete mix design for C30 grade concrete suitable for structural applications, including cement, aggregates, water-cement ratio, and admixtures for local Saudi climate.")}>
                      Calculate concrete mix design
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Analyze soil test results and provide foundation recommendations, including bearing capacity, settlement analysis, and suitable foundation types for the given soil conditions.")}>
                      Analyze soil test results
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a structural load calculation summary for a typical commercial building, including dead loads, live loads, wind loads, and seismic considerations per Saudi Building Code.")}>
                      Generate load calculation summary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Documentation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between h-9 text-xs" aria-label="Documentation AI prompts">
                      <div className="flex items-center gap-1.5">
                        <ClipboardList className="h-3 w-3" />
                        <span>Documentation</span>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a professional change order request template including description of changes, justification, cost impact, schedule impact, and required approvals.")}>
                      Create change order request template
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Draft a comprehensive as-built drawings checklist for project handover, covering all disciplines (architectural, structural, MEP), revision tracking, and approval requirements.")}>
                      Draft as-built drawings checklist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Generate a detailed punch list template for project handover, organized by trade, priority level, responsible party, and completion timeline.")}>
                      Generate punch list for handover
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Write a comprehensive project closeout report including project summary, achievements, lessons learned, final costs, outstanding items, and warranty information.")}>
                      Write project closeout report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handlePromptSelect("Create a complete warranty documentation list for construction project handover, including equipment warranties, material warranties, contractor guarantees, and maintenance manuals.")}>
                      Create warranty documentation list
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
