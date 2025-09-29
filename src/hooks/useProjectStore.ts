import { useState, useEffect, useCallback } from 'react';
import { ProjectData, ProjectFormState, ProjectTemplate, MarketplaceTemplate, FilterOptions } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

export const useProjectStore = () => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<ProjectData>({});
  const [currentSection, setCurrentSection] = useState<string>('basics');
  const [formState, setFormState] = useState<ProjectFormState>({
    currentTab: 0,
    isDirty: false,
    validationErrors: {},
    autoSaveEnabled: true,
  });

  // Auto-save functionality
  useEffect(() => {
    if (formState.isDirty && formState.autoSaveEnabled) {
      const timeoutId = setTimeout(() => {
        saveDraft();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [projectData, formState.isDirty, formState.autoSaveEnabled]);

  const updateProjectData = useCallback((section: keyof ProjectData, data: any) => {
    setProjectData(prev => ({
      ...prev,
      [section]: data,
    }));
    setFormState(prev => ({
      ...prev,
      isDirty: true,
    }));
  }, []);

  const setCurrentTab = useCallback((tab: number) => {
    setFormState(prev => ({
      ...prev,
      currentTab: tab,
    }));
  }, []);

  const validateSection = useCallback((section: keyof ProjectData): string[] => {
    const errors: string[] = [];
    const data = projectData[section];

    if (!data) return errors;

    switch (section) {
      case 'basics':
        if (!data.title) errors.push('Project title is required');
        if (!data.category) errors.push('Category is required');
        if (!data.location && !data.isRemote) errors.push('Location is required for non-remote projects');
        if (!data.budget?.min || !data.budget?.max) errors.push('Budget range is required');
        break;
      case 'scope':
        if (!data.description) errors.push('Project description is required');
        if (!data.deliverables?.length) errors.push('At least one deliverable is required');
        break;
      case 'requirements':
        if (!data.experience) errors.push('Experience level is required');
        if (!data.skills?.length) errors.push('At least one skill is required');
        break;
      case 'timeline':
        if (!data.startDate || !data.endDate) errors.push('Start and end dates are required');
        break;
    }

    return errors;
  }, [projectData]);

  const validateAllSections = useCallback((): boolean => {
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    const sections: (keyof ProjectData)[] = ['basics', 'scope', 'requirements', 'timeline', 'compliance'];
    
    sections.forEach(section => {
      const errors = validateSection(section);
      if (errors.length > 0) {
        allErrors[section] = errors;
        isValid = false;
      }
    });

    setFormState(prev => ({
      ...prev,
      validationErrors: allErrors,
    }));

    return isValid;
  }, [validateSection]);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem('project-draft', JSON.stringify(projectData));
      setFormState(prev => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date().toISOString(),
      }));
      
      toast({
        title: 'Draft Saved',
        description: 'Your project has been automatically saved.',
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [projectData, toast]);

  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem('project-draft');
      if (saved) {
        const data = JSON.parse(saved);
        setProjectData(data);
        toast({
          title: 'Draft Loaded',
          description: 'Your previous draft has been restored.',
        });
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, [toast]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('project-draft');
    setProjectData({});
    setFormState(prev => ({
      ...prev,
      isDirty: false,
      validationErrors: {},
    }));
  }, []);

  const submitProject = useCallback(async () => {
    if (!validateAllSections()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix all errors before submitting.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearDraft();
      
      toast({
        title: 'Project Submitted',
        description: 'Your project has been successfully posted.',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit project. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [validateAllSections, clearDraft, toast]);

  const loadFromTemplate = useCallback((template: ProjectTemplate) => {
    setProjectData(template.data);
    setFormState(prev => ({
      ...prev,
      isDirty: true,
    }));
    
    toast({
      title: 'Template Loaded',
      description: `Loaded template: ${template.name}`,
    });
  }, [toast]);

  const getProgress = useCallback(() => {
    const sections = ['basics', 'scope', 'requirements', 'timeline', 'compliance'];
    let completedSections = 0;

    sections.forEach(section => {
      const data = projectData[section as keyof ProjectData];
      if (data) {
        switch (section) {
          case 'basics':
            if (data.title && data.category) completedSections++;
            break;
          case 'scope':
            if (data.description && data.deliverables?.length) completedSections++;
            break;
          case 'requirements':
            if (data.experience && data.skills?.length) completedSections++;
            break;
          case 'timeline':
            if (data.startDate && data.endDate) completedSections++;
            break;
          case 'compliance':
            completedSections++; // Optional section
            break;
        }
      }
    });

    return Math.round((completedSections / sections.length) * 100);
  }, [projectData]);

  return {
    projectData,
    formState,
    currentSection,
    setCurrentSection,
    updateProjectData,
    setCurrentTab,
    validateSection,
    validateAllSections,
    saveDraft,
    loadDraft,
    clearDraft,
    submitProject,
    loadFromTemplate,
    getProgress,
  };
};
