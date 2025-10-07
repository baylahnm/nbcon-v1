import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { R } from '@/lib/routes';
import { ProjectTemplate, MarketplaceTemplate } from '../../types/project';

export interface PostProjectRouteParams {
  tab?: 'new' | 'template' | 'marketplace';
  section?: 'basics' | 'scope' | 'requirements' | 'timeline' | 'compliance';
  templateId?: string;
  action?: 'preview' | 'use' | 'purchase';
  filters?: string;
  viewMode?: 'grid' | 'list';
}

export const usePostProjectRouting = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Tab Navigation
  const navigateToTab = (tab: 'new' | 'template' | 'marketplace') => {
    setSearchParams({ tab });
  };

  // Section Navigation (for PostNewProjectTab)
  const navigateToSection = (section: 'basics' | 'scope' | 'requirements' | 'timeline' | 'compliance') => {
    setSearchParams(prev => ({ ...Object.fromEntries(prev), section }));
  };

  // Template Actions
  const handleUseTemplate = (template: ProjectTemplate | MarketplaceTemplate) => {
    // Load template data into project store
    // Navigate to new project tab with template pre-filled
    navigateToTab('new');
    toast({
      title: "Template Loaded",
      description: `${template.name} has been loaded into your project form.`,
    });
  };

  const handlePreviewTemplate = (template: ProjectTemplate | MarketplaceTemplate) => {
    setSearchParams(prev => ({ 
      ...Object.fromEntries(prev), 
      templateId: template.id,
      action: 'preview'
    }));
  };

  const handlePurchaseTemplate = (template: MarketplaceTemplate) => {
    if (template.isFree) {
      handleUseTemplate(template);
    } else {
      // Navigate to purchase flow
      setSearchParams(prev => ({ 
        ...Object.fromEntries(prev), 
        templateId: template.id,
        action: 'purchase'
      }));
    }
  };

  // Filter Management
  const setFilters = (filters: Record<string, string>) => {
    setSearchParams(prev => ({ 
      ...Object.fromEntries(prev), 
      ...filters 
    }));
  };

  const clearFilters = () => {
    const currentTab = searchParams.get('tab') || 'new';
    setSearchParams({ tab: currentTab });
  };

  // View Mode Management
  const setViewMode = (mode: 'grid' | 'list') => {
    setSearchParams(prev => ({ 
      ...Object.fromEntries(prev), 
      viewMode: mode 
    }));
  };

  // Project Actions
  const handleSaveDraft = () => {
    // Save current project data
    toast({
      title: "Draft Saved",
      description: "Your project has been saved as a draft.",
    });
  };

  const handleSubmitProject = () => {
    // Validate and submit project
    navigate(R.enterprise.teamProjects);
    toast({
      title: "Project Submitted",
      description: "Your project has been successfully submitted.",
    });
  };

  // Template Creation
  const handleCreateFromCurrent = () => {
    // Create template from current project data
    navigateToTab('template');
    toast({
      title: "Template Created",
      description: "Template created from your current project.",
    });
  };

  const handleCreateNewTemplate = () => {
    // Navigate to template creation form
    navigateToTab('template');
    setSearchParams(prev => ({ 
      ...Object.fromEntries(prev), 
      action: 'create'
    }));
  };

  // Quick Actions
  const handleQuickFilter = (aliasId: string) => {
    setSearchParams(prev => ({ 
      ...Object.fromEntries(prev), 
      alias: aliasId 
    }));
  };

  // Modal Management
  const closeModal = () => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('templateId');
      newParams.delete('action');
      return newParams;
    });
  };

  return {
    // Navigation
    navigateToTab,
    navigateToSection,
    
    // Template Actions
    handleUseTemplate,
    handlePreviewTemplate,
    handlePurchaseTemplate,
    
    // Filter Management
    setFilters,
    clearFilters,
    handleQuickFilter,
    
    // View Management
    setViewMode,
    
    // Project Actions
    handleSaveDraft,
    handleSubmitProject,
    
    // Template Creation
    handleCreateFromCurrent,
    handleCreateNewTemplate,
    
    // Modal Management
    closeModal,
    
    // Current State
    currentTab: searchParams.get('tab') as 'new' | 'template' | 'marketplace' || 'new',
    currentSection: searchParams.get('section') as 'basics' | 'scope' | 'requirements' | 'timeline' | 'compliance' || 'basics',
    selectedTemplateId: searchParams.get('templateId'),
    currentAction: searchParams.get('action') as 'preview' | 'use' | 'purchase',
    currentViewMode: searchParams.get('viewMode') as 'grid' | 'list' || 'grid',
  };
};
