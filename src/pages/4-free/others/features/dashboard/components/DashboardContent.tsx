import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Plus, Rocket, Target, DollarSign, AlertTriangle, Calendar, Users, FileText, ClipboardList, Trash2, Briefcase, Clock, MapPin, X, ChevronRight, ChevronLeft, Loader2, TrendingUp, MessageCircle, Receipt, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { ScrollArea } from '../../../../../1-HomePage/others/components/ui/scroll-area';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import XScroll from '../../../../../1-HomePage/others/components/ui/x-scroll';
import { ChatComposer } from '../../ai/components/ChatComposer';
import { useAuthStore } from "../../../stores/auth";
import { getUserDisplayName } from '../../../../../1-HomePage/others/lib/userUtils';
import { useProjectStore, type Project } from '../../../stores/useProjectStore';
import { ClientOverviewStats } from './ClientOverviewStats';
import { MessageBubble } from '../../ai/components/MessageBubble';
import { useAiStore } from '../../ai/store/useAiStore';

/**
 * Quick action prompts for AI chat (Stitch-style)
 * Each button triggers a predefined AI workflow
 * Based on UX research - top 10 most-used features
 */
const QUICK_ACTIONS = [
  { icon: Plus, label: 'Start new project', prompt: 'Help me start a new construction project with a complete charter and initial plan' },
  { icon: Briefcase, label: 'Post job listing', prompt: 'Help me create a job posting for a senior civil engineer in Riyadh with 10+ years experience' },
  { icon: Users, label: 'Find engineers', prompt: 'Find me qualified structural engineers in Riyadh with SCE certification and LEED experience' },
  { icon: Receipt, label: 'Create invoice', prompt: 'Generate an invoice for milestone completion of 10,000 SAR for my current project' },
  { icon: DollarSign, label: 'Check budget', prompt: 'Show me the current budget status and spending breakdown for my active projects' },
  { icon: ClipboardList, label: 'Summarize progress', prompt: 'Summarize the current status and progress of all my active projects with key metrics' },
  { icon: MessageCircle, label: 'Draft message', prompt: 'Draft a professional project update message for my client about current progress and next steps' },
  { icon: Calendar, label: 'Schedule meeting', prompt: 'Help me schedule a site visit meeting for next week with suggested agenda items' },
  { icon: BarChart, label: 'View analytics', prompt: 'Show me analytics and insights for my projects including timeline, budget, and resource utilization' },
  { icon: FileText, label: 'Generate report', prompt: 'Generate a comprehensive project status report for stakeholders with all key metrics and milestones' },
] as const;

/**
 * Action labels (constants for consistency)
 */
const ACTIONS = {
  close: 'Close',
  viewAll: 'View All',
  openPlanning: 'Open in Planning Tools',
  askAI: 'Ask AI About Project',
  generateReport: 'Generate Report',
} as const;

export function DashboardContent() {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  
  // AI Store
  const { settings, setComposerText, sendMessage, deleteThread, activeThreadId, messagesByThread } = useAiStore();
  const activeMessages = activeThreadId ? (messagesByThread[activeThreadId] || []) : [];
  
  // Project Store
  const { projects, isLoading: projectsLoading, loadUserProjects } = useProjectStore();
  
  // Ref for auto-scrolling to newest message (Stitch-style)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref and state for Quick Actions scroll arrows
  const quickActionsScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Load projects on mount
  useEffect(() => {
    loadUserProjects();
  }, [loadUserProjects]);
  
  // Auto-scroll to newest message when messages update
  useEffect(() => {
    if (activeMessages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [activeMessages]);
  
  // Function to update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    const container = quickActionsScrollRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);
  
  // Handle scroll event for Quick Actions
  useEffect(() => {
    const container = quickActionsScrollRef.current;
    if (!container) return;
    
    // Initial check
    updateArrowVisibility();
    
    // Add scroll event listener
    container.addEventListener('scroll', updateArrowVisibility);
    
    // Add resize event listener to handle window size changes
    const handleResize = () => {
      setTimeout(updateArrowVisibility, 100);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      container.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateArrowVisibility]);
  
  // Scroll to next/previous actions
  const scrollQuickActions = (direction: 'left' | 'right') => {
    const container = quickActionsScrollRef.current;
    if (!container) return;
    
    const buttonWidth = 150; // Approximate width of each button + gap
    const scrollAmount = direction === 'left' ? -buttonWidth : buttonWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };
  
  // Get user display name
  const displayName = getUserDisplayName(profile);

  /**
   * Handle quick action button click
   * Pre-fills and auto-sends predefined prompts
   */
  const handleQuickAction = async (prompt: string) => {
    setComposerText(prompt);
    await sendMessage(prompt);
  };

  /**
   * Handle project card click
   * Opens detail panel (desktop sidebar / mobile overlay)
   */
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  /**
   * Handle clear chat
   */
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
    <div className="flex min-h-screen overflow-hidden">
      {/* Main Content Area (Flex-driven ChatGPT-style layout) */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Top Header - Fixed Height */}
        <header className="h-14 sm:h-16 flex-shrink-0 border-b border-border/40 flex items-center justify-between px-3 sm:px-4 bg-background" role="banner">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary-gradient text-white font-bold text-sm">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                  <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">AI Assistant</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Your copilot for managing projects</p>
                  </div>
                </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3" onClick={() => navigate('/free/ai')}>
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="hidden sm:inline">Full Chat</span>
              <span className="sm:hidden">Chat</span>
                  </Button>
                  {activeMessages && activeMessages.length > 0 && (
                    <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive/90" 
                      onClick={handleClearChat}
                aria-label="Clear chat"
                    >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                </div>
        </header>

        {/* Overview Stats - Compact */}
        <div className="flex-shrink-0 p-2 sm:p-4 bg-background border-b border-border/40">
          <ClientOverviewStats />
        </div>

        {/* Chat Area - Flex Container */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* AI Chat Conversation Area - Fills available space */}
          <div 
            className={`flex-1 overflow-y-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-4 min-h-0 bg-background border-t border-border ${activeMessages && activeMessages.length > 0 ? '' : 'flex items-center justify-center'}`} 
            id="conversation-history"
          >
            <div className={`w-full pb-4 ${activeMessages && activeMessages.length > 0 ? 'space-y-4' : 'max-w-2xl mx-auto'}`}>
              {activeMessages && activeMessages.length > 0 ? (
                <>
                  {activeMessages.map((message: any) => (
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
                  {/* Auto-scroll anchor */}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                /* Empty state - vertically & horizontally centered */
                <div className="text-center py-8 sm:py-12 px-4 sm:px-8 space-y-3 sm:space-y-4 rounded-lg bg-background/50 min-h-[280px] sm:min-h-[360px] md:min-h-[420px] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">Hello! How can I help you today?</p>
                    <p className="text-xs sm:text-sm text-muted-foreground px-4">
                      You can ask me to start a new project, check the status of an existing one, or find qualified engineers. 
                      What would you like to do?
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Composer Footer - Naturally positioned at bottom */}
          <div className="flex-shrink-0 bg-background/98 backdrop-blur-xl border-t border-border/60 shadow-2xl">
            <div className="w-full p-3 sm:p-4">
              {/* Quick Action Pills (Horizontal Scroll with XScroll and Arrow Navigation) */}
              <div className="mb-3 sm:mb-4 relative dashboard-quick-actions-scroll">
                {/* Left fade/blur effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-background/98 to-transparent z-10 pointer-events-none" />
                
                {/* Right fade/blur effect */}
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-background/98 to-transparent z-10 pointer-events-none" />
                
                {/* Left Arrow */}
                {showLeftArrow && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background/98 backdrop-blur-md shadow-lg border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                    onClick={() => scrollQuickActions('left')}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </Button>
                )}
                
                {/* Right Arrow */}
                {showRightArrow && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-background/98 backdrop-blur-md shadow-lg border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                    onClick={() => scrollQuickActions('right')}
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </Button>
                )}
                
                <XScroll>
                  <div 
                    ref={quickActionsScrollRef}
                    className="flex space-x-3 sm:space-x-4 p-1 pb-3 sm:pb-4"
                    style={{
                      scrollSnapType: 'x mandatory',
                      scrollBehavior: 'smooth',
                    }}
                  >
                    {QUICK_ACTIONS.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <div key={index} className="flex-shrink-0 snap-start">
                          <button
                            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 bg-background border border-border rounded-full hover:bg-accent transition-colors text-foreground whitespace-nowrap shadow-sm"
                            onClick={() => handleQuickAction(action.prompt)}
                          >
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {action.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </XScroll>
              </div>

              {/* Chat Input */}
              <div>
                <ChatComposer isCompact />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects Section - Sibling below chat container */}
        <div className="flex-shrink-0 border-t border-border p-3 sm:p-4 bg-background max-h-[30vh] sm:max-h-[35vh] overflow-y-auto">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">Recent Projects</h3>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading projects...</span>
                      </div>
            ) : projects.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg flex items-center justify-center p-8 text-center text-muted-foreground">
                <div>
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">No recent projects found</p>
                  <p className="text-xs mb-4">Start a new project to see it here</p>
                  <Button size="sm" className="h-8 text-xs" onClick={() => navigate('/free/ai-tools/planning')}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Project
                    </Button>
                      </div>
                      </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {projects.slice(0, 6).map((project) => (
                  <div
                    key={project.id}
                    className="bg-card rounded-lg p-3 sm:p-4 flex flex-col shadow-sm border border-border cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
                    onClick={() => handleProjectClick(project)}
                  >
                    <p className="text-xs sm:text-sm font-semibold text-card-foreground line-clamp-1">{project.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                      {project.task_count || 0} Tasks • {project.budget ? `${(project.budget / 1000).toFixed(0)}K ${project.currency}` : 'Budget TBD'}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 mb-1.5 sm:mb-2">
                      <div 
                        className="bg-success h-1.5 rounded-full transition-all" 
                        style={{ width: `${project.progress || 0}%` }}
                      />
                      </div>
                    <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                      </div>
                    
                    {/* Status Badge */}
                    <Badge 
                      variant="outline" 
                      className="inline-flex items-center text-[9px] sm:text-xs bg-primary/10 text-primary border-primary/20 px-1.5 sm:px-2 py-0.5 rounded-full mt-auto self-start"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-1 sm:mr-1.5 bg-primary rounded-full" />
                      {project.status}
                    </Badge>
                      </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Right: Project Detail Panel (Stitch-style) */}
      {showProjectDetail && selectedProject && (
        <aside 
          className="w-full md:w-96 flex-shrink-0 bg-background border-l border-border flex flex-col absolute md:relative inset-y-0 right-0 transform md:translate-x-0 transition-transform duration-300 ease-in-out z-40"
          aria-label="Project Details Panel"
        >
          {/* Panel Header */}
          <div className="h-16 flex-shrink-0 border-b border-border flex items-center justify-between p-4">
            <h3 className="text-base font-bold tracking-tight text-foreground">Project Details</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent rounded-full"
              onClick={() => setShowProjectDetail(false)}
              aria-label={ACTIONS.close}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Project Name & Status */}
              <div>
                <h2 className="text-base font-bold tracking-tight text-foreground mb-2">{selectedProject.name}</h2>
                <Badge 
                  variant="outline"
                  className="inline-flex items-center text-xs font-medium bg-info/10 text-info px-2.5 py-1 rounded-full border-0"
                >
                  <div className="w-2 h-2 mr-1.5 bg-info rounded-full" />
                  {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                </Badge>
              </div>

              {/* Description */}
              {selectedProject.description && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Description</h4>
                  <p className="text-sm text-foreground">{selectedProject.description}</p>
                </div>
              )}

              {/* Key Metrics (Stitch 3-column grid) */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Key Metrics</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-primary/70">Progress</p>
                    <p className="text-xl font-bold text-primary">{selectedProject.progress || 0}%</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-primary/70">Tasks</p>
                    <p className="text-xl font-bold text-primary">{selectedProject.task_count || 0}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-primary/70">Budget</p>
                    <p className="text-lg font-bold text-primary">
                      {selectedProject.budget ? `${(selectedProject.budget / 1000000).toFixed(1)}M` : 'TBD'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Project Info</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-foreground">
                      {selectedProject.project_type.charAt(0).toUpperCase() + selectedProject.project_type.slice(1)}
                    </span>
                  </li>
                  {selectedProject.location && (
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-foreground">{selectedProject.location}</span>
                    </li>
                  )}
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium text-foreground">
                      {new Date(selectedProject.created_at).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium text-foreground">
                      {new Date(selectedProject.updated_at).toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Panel Footer with Quick Actions */}
          <div className="p-4 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                onClick={() => navigate(`/free/ai-tools/planning?project=${selectedProject.id}`)}
              >
                <Rocket className="h-4 w-4" />
                {ACTIONS.openPlanning}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
                onClick={() => handleQuickAction(`Show me detailed status for project: ${selectedProject.name}`)}
              >
                <Bot className="h-4 w-4" />
                {ACTIONS.askAI}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
                onClick={() => handleQuickAction(`Generate progress report for ${selectedProject.name}`)}
              >
                <FileText className="h-4 w-4" />
                {ACTIONS.generateReport}
              </Button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
