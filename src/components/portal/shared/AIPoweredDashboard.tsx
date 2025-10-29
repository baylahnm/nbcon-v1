/**
 * AI-Powered Dashboard Component
 * 
 * Unified dashboard with AI chat, conversations, projects, and stats
 * Shared across all portal tiers (Client, Engineer, Enterprise)
 * 
 * Now supports advanced modular components for enhanced UX:
 * - StatusCards: Live Supabase data with expandable modals
 * - ProjectsCarousel: Horizontal scroll with XScroll navigation
 * - ProjectDetailsPanel: Rich sidebar with milestones
 * - ConversationPanel: Search + All/Starred tabs
 * - AIChatPanel: Scrollable quick actions carousel
 * 
 * @version 3.0.0
 * @created January 28, 2025
 * @updated January 28, 2025 - Advanced modular components integrated
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Clock, 
  DollarSign,
  Plus,
  Search,
  X,
  ChevronRight,
  Bot,
  Mic,
  Paperclip,
  Send,
  Star,
  TrendingUp,
  TrendingDown,
  Sparkles,
  FileText,
  Receipt,
  ClipboardList,
  MessageCircle,
  Calendar,
  ChartNoAxesColumnIncreasing
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { PromptBox } from '@/pages/1-HomePage/others/components/ui/chatgpt-prompt-input';
import XScroll from '@/pages/1-HomePage/others/components/ui/x-scroll';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAiStore } from '@/shared/stores/useAiStore';

// Advanced modular components
import { StatusCards } from '@/components/dashboard/advanced/StatusCards';
import { ProjectsCarousel, type ProjectConfig } from '@/components/dashboard/advanced/ProjectsCarousel';
import { ProjectDetailsPanel as AdvancedProjectDetailsPanel } from '@/components/dashboard/advanced/ProjectDetailsPanel';
import { ConversationPanel } from '@/components/dashboard/advanced/ConversationPanel';
import { AIChatPanel } from '@/components/dashboard/advanced/AIChatPanel';

// ============================================================================
// TYPES
// ============================================================================

export interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend: {
    value: number;
    isPositive: boolean;
  };
  trendData?: number[]; // Last 6 months data for sparkline
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export interface Project {
  id: string;
  title: string;
  tasks: number;
  budget: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  description?: string;
  type?: string;
  location?: string;
  created?: string;
  lastUpdated?: string;
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
  isStarred?: boolean;
}

export interface AIPoweredDashboardProps {
  role: 'client' | 'engineer' | 'enterprise';
  userName: string;
  stats?: DashboardStat[]; // Optional for advanced mode
  quickActions: QuickAction[];
  projects: Project[];
  conversations: Conversation[];
  aiWelcomeMessage?: string;
  // Advanced features (optional)
  useAdvancedComponents?: boolean; // Enable live data, expandable modals, carousels
  isLoadingProjects?: boolean;
  isLoadingConversations?: boolean;
  onSendMessage?: (message: string) => void;
  onNewConversation?: () => void;
  onConversationSelect?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onToggleStar?: (id: string) => void;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <stat.icon className="h-4 w-4 text-primary" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            stat.trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {stat.trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {stat.trend.value}%
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
        </div>
        {/* Mini trend sparkline */}
        {stat.trendData && (
          <div className="mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center gap-1">
              <div className="flex-1 flex items-end gap-0.5 h-6">
                {stat.trendData.map((val, idx) => (
                  <div 
                    key={idx}
                    className="flex-1 bg-primary/20 rounded-sm transition-all hover:bg-primary/40"
                    style={{ height: `${(val / Math.max(...stat.trendData!)) * 100}%` }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">Last 6 months trend</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PROJECT CARD COMPONENT
// ============================================================================

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const statusColors = {
    'planning': 'bg-blue-500',
    'in-progress': 'bg-green-500',
    'review': 'bg-yellow-500',
    'completed': 'bg-gray-500'
  };

  return (
    <div 
      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-card"
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-sm flex-1">{project.title}</h4>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span>{project.tasks} Tasks</span>
        <span>•</span>
        <span>{project.budget} SAR</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress {project.progress}%</span>
          <div className="flex items-center gap-1">
            <div className={cn("h-2 w-2 rounded-full", statusColors[project.status])} />
            <span className="capitalize">{project.status}</span>
          </div>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>
    </div>
  );
}

// ============================================================================
// PROJECT DETAILS PANEL
// ============================================================================

function ProjectDetailsPanel({ 
  project, 
  onClose,
  onOpenPlanningTools,
  onAskAI,
  onGenerateReport
}: { 
  project: Project; 
  onClose: () => void;
  onOpenPlanningTools: () => void;
  onAskAI: () => void;
  onGenerateReport: () => void;
}) {
  const statusColors = {
    'planning': 'bg-blue-500',
    'in-progress': 'bg-green-500',
    'review': 'bg-yellow-500',
    'completed': 'bg-gray-500'
  };

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-base">Project Details</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Project Title & Status */}
          <div>
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", statusColors[project.status])} />
              <span className="text-sm capitalize">{project.status}</span>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Progress</p>
                <p className="text-xl font-bold">{project.progress}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                <p className="text-xl font-bold">{project.tasks}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-xl font-bold">{project.budget.replace(' SAR', '')}M</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          {(project.type || project.location || project.created) && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Project Info</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {project.type && (
                  <>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{project.type}</span>
                  </>
                )}
                {project.location && (
                  <>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{project.location}</span>
                  </>
                )}
                {project.created && (
                  <>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{project.created}</span>
                  </>
                )}
                {project.lastUpdated && (
                  <>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{project.lastUpdated}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <Button 
              className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onOpenPlanningTools}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Open in Planning Tools
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={onAskAI}
            >
              <Bot className="h-4 w-4 mr-2" />
              Ask AI About Project
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={onGenerateReport}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export function AIPoweredDashboard({
  role,
  userName,
  stats = [],
  quickActions,
  projects,
  conversations,
  aiWelcomeMessage = "Hello! How can I help you today? You can ask me to start a new project, check the status of an existing one, or find qualified engineers. What would you like to do?",
  useAdvancedComponents = false,
  isLoadingProjects = false,
  isLoadingConversations = false,
  onSendMessage,
  onNewConversation,
  onConversationSelect,
  onDeleteConversation,
  onToggleStar,
}: AIPoweredDashboardProps) {
  const navigate = useNavigate();
  const { sendMessage } = useAiStore();
  const [selectedProject, setSelectedProject] = useState<ProjectConfig | null>(null);
  const [isProjectDetailsPanelOpen, setIsProjectDetailsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredCount = conversations.filter(c => c.isStarred).length;

  // Map simple Project type to ProjectConfig for advanced components
  const enhancedProjects: ProjectConfig[] = projects.map(p => {
    // Map status values: 'review' -> 'pending-review'
    let mappedStatus: ProjectConfig['status'] = p.status === 'review' ? 'pending-review' : p.status as ProjectConfig['status'];
    // Ensure status is valid
    if (!['planning', 'in-progress', 'pending-review', 'on-hold', 'completed'].includes(mappedStatus)) {
      mappedStatus = 'in-progress';
    }
    
    return {
      ...p,
      status: mappedStatus,
      description: p.description || 'No description available',
      type: p.type || 'General',
      location: p.location || 'Not specified',
      created: p.created || new Date().toLocaleDateString(),
      lastUpdated: p.lastUpdated || new Date().toLocaleDateString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      milestones: (p as any).milestones || [
        { name: 'Project kickoff', completed: true, date: p.created || '' },
        { name: 'Design phase', completed: false, date: p.lastUpdated || '' },
        { name: 'Approval', completed: false, date: '' }
      ]
    };
  });

  // Handle project selection for advanced mode
  const handleProjectClick = (project: ProjectConfig) => {
    setSelectedProject(project);
    setIsProjectDetailsPanelOpen(true);
  };

  // Handle project selection for simple mode (converts Project to ProjectConfig)
  const handleSimpleProjectClick = (project: Project) => {
    const enhanced: ProjectConfig = {
      ...project,
      status: project.status === 'review' ? 'pending-review' : project.status as ProjectConfig['status'],
      description: project.description || 'No description available',
      type: project.type || 'General',
      location: project.location || 'Not specified',
      created: project.created || new Date().toLocaleDateString(),
      lastUpdated: project.lastUpdated || new Date().toLocaleDateString(),
      milestones: [
        { name: 'Project kickoff', completed: true, date: project.created || '' },
        { name: 'Design phase', completed: false, date: project.lastUpdated || '' },
        { name: 'Approval', completed: false, date: '' }
      ]
    };
    setSelectedProject(enhanced);
  };

  const handleCloseProjectDetails = () => {
    setIsProjectDetailsPanelOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      {/* Hero Section - AI Assistant with Gradient */}
      <section className="mb-[20px] flex w-full flex-col items-center justify-center py-12 md:py-20 px-4 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-background pointer-events-none" />
        
        <div className="relative z-10 mb-4 flex flex-col items-center px-4 text-center md:mb-6 max-w-4xl w-full">
          {/* Announcement Badge - Animated Gradient Border */}
          <button className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background z-10 mb-6">
            <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--primary)/0.3)_50%,hsl(var(--primary))_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground backdrop-blur-3xl gap-2">
              <Bot className="h-4 w-4" />
              Welcome back, {userName}
            </span>
          </button>
          
          {/* Main Heading */}
          <h1 className="mb-2 flex items-center gap-1 text-3xl font-medium leading-none text-foreground sm:text-3xl md:mb-2.5 md:text-5xl">
            <span className="pt-0.5 tracking-tight md:pt-0">Build something amazing</span>
          </h1>
          
          <p className="mb-6 max-w-[25ch] text-center text-lg leading-tight text-foreground/65 md:max-w-full md:text-xl">
            Your copilot for managing engineering projects
          </p>
          
          {/* Large Chat Input - Full ChatComposer with Agents */}
          <PromptBox
            className="w-full max-w-3xl mx-auto"
            placeholder="Ask AI to create a project, find engineers, or generate reports..."
            onChange={(e) => setAiMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (aiMessage.trim()) {
                  onSendMessage?.(aiMessage);
                  setAiMessage('');
                }
              }
            }}
          />
          
          {/* Quick Actions Bar - Horizontally Scrollable */}
          <div className="mt-4 w-full">
            <ScrollArea>
              <div className="dashboard-quick-actions-scroll">
                <div className="flex space-x-2 p-1 pb-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("I want to start a new project. Please guide me through the project intake process including: project objectives, scope definition, required expertise, timeline, budget constraints, and deliverables. Help me create a comprehensive project charter.", [])}
                      aria-label="Start new project with AI assistance"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Start new project</span>
                      </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Help me draft a job listing for an engineering position. I need assistance with: job title and description, required skills and qualifications, responsibilities and deliverables, experience level, compensation range, and project details. Create a professional and compelling job post.", [])}
                      aria-label="Post job listing with AI assistance"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Post job listing</span>
                      </Button>
                      <Button 
                      type="button"
                      variant="outline"
                        size="sm" 
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("I need to find qualified engineers for my project. Please help me create a talent sourcing brief including: required technical skills, domain expertise, experience level, availability requirements, budget considerations, and evaluation criteria. Suggest search strategies and screening questions.", [])}
                      aria-label="Find engineers with AI assistance"
                      >
                      <Users className="h-4 w-4" />
                      <span>Find engineers</span>
                      </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Help me prepare an invoice for my project. I need assistance with: invoice formatting, line item breakdown, service descriptions, hours/deliverables tracking, tax calculations, payment terms, and professional presentation. Guide me through creating a complete and accurate invoice.", [])}
                      aria-label="Create invoice with AI assistance"
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Create invoice</span>
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Conduct a comprehensive budget audit for my projects. Analyze: current spending vs allocated budget, cost breakdown by category, burn rate analysis, variance explanations, upcoming expenses forecast, cost-saving opportunities, and budget reallocation recommendations. Provide actionable insights.", [])}
                      aria-label="Check budget with AI assistance"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Check budget</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Generate a comprehensive progress summary for my current projects. Include: completed milestones and deliverables, tasks in progress with status updates, upcoming deadlines and dependencies, blockers or risks identified, team performance metrics, budget utilization, timeline adherence, and recommendations for next steps. Provide an executive-ready summary.", [])}
                      aria-label="Summarize progress with AI assistance"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Summarize progress</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Help me draft a professional message for project communication. I need assistance with: recipient context, message purpose and tone, key points to convey, action items or requests, timeline and urgency, professional formatting, and subject line suggestions. Create a clear and effective communication draft.", [])}
                      aria-label="Draft message with AI assistance"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Draft message</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Help me schedule a meeting for my project. Assist with: meeting purpose and agenda, participant list and roles, optimal timing considerations, duration estimate, required preparation or materials, discussion topics prioritization, and follow-up action items. Create a structured meeting scheduling request.", [])}
                      aria-label="Schedule meeting with AI assistance"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Schedule meeting</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Perform a deep analytics review of my project portfolio. Analyze: project performance metrics and KPIs, resource utilization trends, budget efficiency analysis, timeline adherence patterns, team productivity insights, success factors and risk indicators, comparative benchmarks, and strategic recommendations. Provide data-driven insights with actionable recommendations.", [])}
                      aria-label="View analytics with AI assistance"
                    >
                      <ChartNoAxesColumnIncreasing className="h-4 w-4" />
                      <span>View analytics</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 rounded-full border border-border hover:bg-accent shadow-sm gap-2 px-4 h-9 whitespace-nowrap"
                      onClick={() => sendMessage("Generate a comprehensive project report. Include: executive summary with key achievements, detailed progress against objectives, resource utilization and team performance, budget analysis and financial health, risk assessment and mitigation strategies, timeline status and critical path, quality metrics and deliverables review, stakeholder updates, and next steps with recommendations. Create a professional presentation-ready report.", [])}
                      aria-label="Generate report with AI assistance"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Generate report</span>
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
        </div>
      </section>

      {/* Conversations History - Horizontal Carousel */}
      {conversations.length > 0 && (
        <div className="w-full px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-medium">Conversations History</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/${role}/ai`)}
              className="h-auto p-0 text-xs sm:text-sm hover:bg-accent rounded-md px-4 py-2"
                  >
              <span className="hidden sm:inline">View all</span>
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </div>
          <div className="learning-page-scroll">
            <XScroll>
              <div className="flex space-x-4 p-1 pb-4">
                {conversations.map((conv) => (
                  <div key={conv.id} className="flex-shrink-0">
                    <div
                      className="group relative flex flex-col min-w-[200px] sm:min-w-[240px] max-w-[200px] sm:max-w-[240px] cursor-pointer"
                      onClick={() => (onConversationSelect || ((id) => navigate(`/${role}/ai/thread/${id}`)))(conv.id)}
                    >
                      <div className="relative mb-3 flex flex-col">
                        <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border hover:border-primary/50 transition-all">
                          <div className="flex flex-col items-center justify-center h-full p-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <Bot className="h-6 w-6 text-primary" />
              </div>
                            <p className="text-xs text-muted-foreground text-center line-clamp-2">{conv.title}</p>
                  </div>
                </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex w-full min-w-0 items-center justify-between">
                          <div className="flex min-w-0 flex-col">
                            <p className="text-sm font-medium truncate">{conv.title}</p>
                            <p className="text-xs text-muted-foreground">{conv.date}</p>
                          </div>
                          {conv.isStarred && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </XScroll>
          </div>
        </div>
      )}

      {/* Recent Projects - Lovable Style */}
      {projects.length > 0 && (
        <div className="w-full px-4 sm:px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-medium">Recent Projects</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 hover:bg-accent rounded-md px-4 py-2"
                onClick={() => navigate(role === 'engineer' ? `/${role}/jobs` : `/${role}/myprojects`)}
              >
                <span className="hidden sm:inline">View all</span>
                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </div>
            
            {/* Project Search & Filters */}
            <div className="grid w-full max-w-screen-md grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="relative col-span-2 sm:col-span-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                  placeholder="Search projects..."
                  className="pl-9 text-sm h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 justify-between gap-2 bg-background"
              >
                <span>Last edited</span>
                <ChevronRight className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 justify-between gap-2 bg-background"
              >
                <span>All creators</span>
                <ChevronRight className="h-4 w-4 rotate-90" />
              </Button>
            </div>
            
            {/* Project Cards Grid */}
            <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
              {(useAdvancedComponents ? enhancedProjects : projects).slice(0, 4).map((project) => (
                <div 
                  key={project.id}
                  className="group relative flex flex-col cursor-pointer"
                  onClick={() => {
                    if (useAdvancedComponents) {
                      handleProjectClick(project as ProjectConfig);
                    } else {
                      handleSimpleProjectClick(project as Project);
                    }
                  }}
                >
                  {/* Project Screenshot Placeholder */}
                  <div className="relative mb-3 flex flex-col">
                    <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border hover:border-primary/50 transition-all">
                      <div className="flex flex-col items-center justify-center h-full p-6">
                        <Briefcase className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground text-center line-clamp-2">{project.title}</p>
                      </div>
                      {/* Progress Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="w-full bg-muted/30 rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all" 
                            style={{ width: `${project.progress}%` }}
                          />
                </div>
              </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-4 w-4 text-primary" />
        </div>
                    <div className="flex w-full min-w-0 items-center justify-between">
                      <div className="flex min-w-0 flex-col">
                        <div className="flex items-center gap-2 truncate">
                          <p className="overflow-hidden truncate whitespace-nowrap text-sm font-medium">
                            {project.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <p>{project.tasks} Tasks • {project.budget}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Projects - With Category Filters */}
      {projects.length > 0 && (
        <div className="w-full px-4 sm:px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-medium">All Projects</h2>
                <Button
                  variant="ghost"
                  size="sm"
                className="h-8 hover:bg-accent rounded-md px-4 py-2"
                  onClick={() => navigate(role === 'engineer' ? `/${role}/jobs` : `/${role}/myprojects`)}
                >
                <span className="hidden sm:inline">View all</span>
                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>
            
            {/* Category Filter Tabs */}
            <div className="grid grid-cols-2 flex-wrap items-center gap-1 max-lg:max-w-screen-sm lg:flex lg:gap-2">
                <Button
                variant="secondary"
                  size="sm"
                className="h-9 shadow-sm"
              >
                All Projects
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
              >
                Planning
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
              >
                In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
              >
                Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
              >
                Completed
                </Button>
              </div>
            
            {/* All Projects Grid */}
            <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
              {(useAdvancedComponents ? enhancedProjects : projects).map((project) => (
                <div 
                  key={project.id}
                  className="group relative flex flex-col cursor-pointer"
                  onClick={() => {
                    if (useAdvancedComponents) {
                      handleProjectClick(project as ProjectConfig);
                    } else {
                      handleSimpleProjectClick(project as Project);
                    }
                  }}
                >
                  {/* Project Screenshot */}
                  <div className="relative mb-3 flex flex-col">
                    <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border hover:border-primary/50 transition-all">
                      <div className="relative h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-transparent">
                        <Briefcase className="h-16 w-16 text-muted-foreground/40 mb-3" />
                        <p className="text-sm font-medium text-center line-clamp-2 px-2">{project.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{project.progress}% complete</p>
              </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 hidden cursor-pointer items-center justify-center bg-black/30 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 md:flex">
                        <Button size="sm" variant="secondary" className="pointer-events-none">
                          Preview
                        </Button>
            </div>
                      {/* Status Badge Overlay */}
                      {project.status === 'completed' && (
                        <div className="absolute bottom-0 left-0 p-2">
                          <Badge variant="secondary" className="text-xs opacity-75">
                            Completed
                          </Badge>
                        </div>
                      )}
                    </div>
      </div>
                  
                  {/* Project Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex w-full min-w-0 items-center justify-between">
                      <div className="flex min-w-0 flex-col">
                        <p className="text-sm font-medium truncate">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.tasks} Tasks • {project.budget}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project Details Panel - Advanced Slide-in Sidebar */}
      {useAdvancedComponents && (
        <AdvancedProjectDetailsPanel
          project={selectedProject}
          isOpen={isProjectDetailsPanelOpen}
          onClose={handleCloseProjectDetails}
        />
      )}

      {/* Project Details Panel - Simple Inline (Legacy) */}
      {!useAdvancedComponents && selectedProject && (
        <div className="overflow-hidden">
          <ProjectDetailsPanelLegacy 
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onOpenPlanningTools={() => navigate(`/${role}/ai-tools/planning?project=${selectedProject.id}`)}
            onAskAI={() => navigate(`/${role}/ai?context=project&id=${selectedProject.id}`)}
            onGenerateReport={() => navigate(`/${role}/reports?project=${selectedProject.id}`)}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LEGACY PROJECT DETAILS PANEL (for backward compatibility)
// ============================================================================

function ProjectDetailsPanelLegacy({ 
  project, 
  onClose,
  onOpenPlanningTools,
  onAskAI,
  onGenerateReport
}: { 
  project: ProjectConfig; 
  onClose: () => void;
  onOpenPlanningTools: () => void;
  onAskAI: () => void;
  onGenerateReport: () => void;
}) {
  const statusColors = {
    'planning': 'bg-blue-500',
    'in-progress': 'bg-green-500',
    'pending-review': 'bg-yellow-500',
    'on-hold': 'bg-orange-500',
    'completed': 'bg-gray-500'
  };

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-base">Project Details</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Project Title & Status */}
          <div>
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", statusColors[project.status])} />
              <span className="text-sm capitalize">{project.status}</span>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Progress</p>
                <p className="text-xl font-bold">{project.progress}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                <p className="text-xl font-bold">{project.tasks}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-xl font-bold">{project.budget.replace(' SAR', '')}M</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          {(project.type || project.location || project.created) && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Project Info</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {project.type && (
                  <>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{project.type}</span>
                  </>
                )}
                {project.location && (
                  <>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{project.location}</span>
                  </>
                )}
                {project.created && (
                  <>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{project.created}</span>
                  </>
                )}
                {project.lastUpdated && (
                  <>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{project.lastUpdated}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <Button 
              className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onOpenPlanningTools}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Open in Planning Tools
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={onAskAI}
            >
              <Bot className="h-4 w-4 mr-2" />
              Ask AI Assistant
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={onGenerateReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AIPoweredDashboard;
