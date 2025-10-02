import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CurrencyProvider } from '@/hooks/useCurrency';
import { useProjectStore } from '@/hooks/useProjectStore';
import { usePostProjectRouting } from '@/hooks/usePostProjectRouting';
import { useTeamStore } from '@/hooks/useTeamStore';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { R } from '@/lib/routes';
import { 
  Plus, 
  FileText, 
  Store, 
  Sparkles,
  Save,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  Settings,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import tab components
import PostNewProjectTab from './tabs/PostNewProjectTab';
import PostFromTemplateTab from './tabs/PostFromTemplateTab';
import TemplateMarketplaceTab from './tabs/TemplateMarketplaceTab';
import SidebarPreview from './components/SidebarPreview';

const mapUrgencyToPriority = (urgency?: 'low' | 'medium' | 'high'): 'Low' | 'Medium' | 'High' => {
  switch (urgency) {
    case 'high':
      return 'High';
    case 'low':
      return 'Low';
    default:
      return 'Medium';
  }
};

const PostProjectPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const {
    projectData,
    formState,
    currentSection,
    setCurrentSection,
    validateAllSections,
    saveDraft,
    clearDraft,
    getProgress,
  } = useProjectStore();

  const {
    currentTab,
    navigateToTab,
    handleSaveDraft,
    handleSubmitProject,
  } = usePostProjectRouting();

  const createProject = useTeamStore(state => state.createProject);
  const updateProject = useTeamStore(state => state.updateProject);
  const addCalendarEvent = useCalendarStore(state => state.addEvent);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (projectData.basics?.title) {
        saveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [projectData, saveDraft]);

  const handleTabChange = (value: string) => {
    navigateToTab(value as 'new' | 'template' | 'marketplace');
  };

  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (action === 'draft') {
      handleSaveDraft();
      return;
    }

    const isValid = validateAllSections();

    if (!isValid) {
      toast({
        title: 'Incomplete project',
        description: 'Complete all required sections before submitting your project.',
        variant: 'destructive',
      });
      return;
    }

    const basics = projectData.basics;
    const timeline = projectData.timeline;

    if (!basics || !timeline?.startDate || !timeline?.endDate) {
      toast({
        title: 'Timeline required',
        description: 'Please provide both start and end dates before submitting your project.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const projectLocation = basics.isRemote ? 'Remote' : basics.location || 'TBD';
      const baseTags = [
        'project',
        basics.category,
        basics.language,
        basics.urgency ? `${basics.urgency}-urgency` : null,
      ].filter(Boolean) as string[];
      const uniqueTags = Array.from(new Set(baseTags));

      const project = createProject({
        name: basics.title,
        subtitle: projectData.scope?.description?.slice(0, 140),
        startDate: timeline.startDate,
        endDate: timeline.endDate,
        location: projectLocation,
        category: basics.category,
        status: 'planning',
        budgetMin: basics.budget?.min,
        budgetMax: basics.budget?.max,
        currency: basics.budget?.currency,
        calendarEventIds: [],
      });

      const startTime = new Date(`${timeline.startDate}T00:00:00`);
      const endTime = new Date(`${timeline.endDate}T23:59:59`);
      if (endTime < startTime) {
        endTime.setTime(startTime.getTime());
        endTime.setHours(23, 59, 59, 999);
      }

      const createdEventIds: string[] = [];

      const primaryEvent = addCalendarEvent({
        title: basics.title,
        description: projectData.scope?.description || 'Enterprise project created via posting workflow.',
        startTime,
        endTime,
        allDay: true,
        type: 'job',
        status: 'open',
        location: projectLocation,
        client: basics.category || 'Enterprise Client',
        assignees: [],
        amount: basics.budget?.max ?? basics.budget?.min ?? 0,
        priority: mapUrgencyToPriority(basics.urgency),
        projectId: project.id,
        isRecurring: false,
        tags: uniqueTags,
      });
      createdEventIds.push(primaryEvent.id);

      const milestoneEvents = (projectData.scope?.milestones || [])
        .filter(milestone => milestone.dueDate)
        .map(milestone => {
          const milestoneStart = new Date(`${milestone.dueDate}T00:00:00`);
          const milestoneEnd = new Date(`${milestone.dueDate}T23:59:59`);
          return addCalendarEvent({
            title: `${basics.title}: ${milestone.name}`,
            description: milestone.description || 'Milestone due',
            startTime: milestoneStart,
            endTime: milestoneEnd,
            allDay: true,
            type: 'milestone',
            status: 'scheduled',
            location: projectLocation,
            client: 'Project Milestone',
            assignees: [],
            amount: 0,
            priority: 'Medium',
            projectId: project.id,
            isRecurring: false,
            tags: Array.from(new Set(['milestone', ...uniqueTags])),
          });
        });
      createdEventIds.push(...milestoneEvents.map(event => event.id));

      const deliverableEvents = (projectData.scope?.deliverables || [])
        .filter(deliverable => deliverable.dueDate)
        .map(deliverable => {
          const deliverableStart = new Date(`${deliverable.dueDate}T00:00:00`);
          const deliverableEnd = new Date(`${deliverable.dueDate}T23:59:59`);
          return addCalendarEvent({
            title: `${basics.title}: ${deliverable.title}`,
            description: deliverable.description || 'Deliverable due',
            startTime: deliverableStart,
            endTime: deliverableEnd,
            allDay: true,
            type: 'milestone',
            status: 'scheduled',
            location: projectLocation,
            client: 'Project Deliverable',
            assignees: [],
            amount: 0,
            priority: 'Medium',
            projectId: project.id,
            isRecurring: false,
            tags: Array.from(new Set(['deliverable', ...uniqueTags])),
          });
        });
      createdEventIds.push(...deliverableEvents.map(event => event.id));

      updateProject(project.id, {
        status: 'active',
        calendarEventIds: createdEventIds,
      });

      clearDraft();
      await handleSubmitProject();
    } catch (error) {
      console.error('Failed to submit project', error);
      toast({
        title: 'Submission failed',
        description: 'We could not submit your project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationStatus = () => {
    const hasErrors = Object.keys(formState.validationErrors).length > 0;
    const isComplete = projectData.basics && projectData.scope && projectData.requirements && projectData.timeline;
    
    if (hasErrors) {
      return { status: 'error', message: 'Please fix validation errors' };
    }
    if (!isComplete) {
      return { status: 'warning', message: 'Complete all required sections' };
    }
    return { status: 'success', message: 'Ready to submit' };
  };

  const validationStatus = getValidationStatus();
  const progress = getProgress();

  // Breadcrumb navigation
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Enterprise', href: R.enterprise.dashboard },
      { label: 'Project Posting', href: R.enterprise.postProject }
    ];

    if (currentTab === 'new' && currentSection) {
      const sectionLabels = {
        basics: 'Project Basics',
        scope: 'Scope & Deliverables',
        requirements: 'Engineer Requirements',
        timeline: 'Project Timeline',
        compliance: 'Compliance'
      };
      breadcrumbs.push({ label: sectionLabels[currentSection as keyof typeof sectionLabels] || currentSection });
    }

    return breadcrumbs;
  };

  return (
    <CurrencyProvider>
      <div className="flex h-screen bg-background">
        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          showSidebar ? "lg:mr-80" : ""
        )}>
          <div className="flex-1 space-y-4 p-6 md:p-8 pt-6 overflow-auto">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 pb-6 border-b border-sidebar-border"
            >
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="h-4 w-4" />}
                    <span className={index === getBreadcrumbs().length - 1 ? "text-foreground font-medium" : ""}>
                      {crumb.label}
                    </span>
                  </React.Fragment>
                ))}
              </nav>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Enterprise Project Posting
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Create comprehensive project postings and discover professional templates
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="hidden lg:flex"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showSidebar ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {currentTab === 'new' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Project Progress</span>
                    <span className="font-medium">{progress}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmit('publish')}
                  disabled={isSubmitting || validationStatus.status !== 'success'}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Project
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(R.enterprise.dashboard)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
              </div>

              {/* Validation Status */}
              <div className="flex items-center gap-2">
                {validationStatus.status === 'error' && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{validationStatus.message}</span>
                  </div>
                )}
                {validationStatus.status === 'warning' && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{validationStatus.message}</span>
                  </div>
                )}
                {validationStatus.status === 'success' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{validationStatus.message}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Post New Project
                  </TabsTrigger>
                  <TabsTrigger value="template" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Post from Template
                  </TabsTrigger>
                  <TabsTrigger value="marketplace" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Template Marketplace
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="new" className="space-y-6">
                  <PostNewProjectTab />
                </TabsContent>

                <TabsContent value="template" className="space-y-6">
                  <PostFromTemplateTab />
                </TabsContent>

                <TabsContent value="marketplace" className="space-y-6">
                  <TemplateMarketplaceTab />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>

        {/* Sidebar Preview (Desktop) */}
        {showSidebar && (
          <SidebarPreview 
            projectData={projectData}
            onClose={() => setShowSidebar(false)}
          />
        )}
      </div>
    </CurrencyProvider>
  );
};

export default PostProjectPage;