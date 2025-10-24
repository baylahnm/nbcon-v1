import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';

/**
 * Charter Section Model
 * Maps to project_charter_sections table
 */
export interface CharterSection {
  id: string;
  project_id: string;
  section_name: string;
  section_order: number;
  section_description: string | null;
  content: string | null;
  is_completed: boolean;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Default sections for new project charters
 */
const DEFAULT_SECTIONS = [
  { 
    name: 'Vision & Objectives', 
    order: 1, 
    description: 'Project vision, goals, and measurable objectives' 
  },
  { 
    name: 'Scope Overview', 
    order: 2, 
    description: 'What is included and excluded from the project' 
  },
  { 
    name: 'Success Criteria', 
    order: 3, 
    description: 'How success will be measured and evaluated' 
  },
  { 
    name: 'Key Stakeholders', 
    order: 4, 
    description: 'Stakeholder roles, responsibilities, and decision authority' 
  },
  { 
    name: 'Constraints & Assumptions', 
    order: 5, 
    description: 'Budget, schedule, resource, and regulatory constraints' 
  },
  { 
    name: 'Deliverables', 
    order: 6, 
    description: 'Major project deliverables and acceptance criteria' 
  }
];

/**
 * Charter Store
 * Manages charter sections for Project Charter Generator tool
 */
interface CharterStore {
  sections: CharterSection[];
  isLoading: boolean;
  error: string | null;
  currentProjectId: string | null;
  
  loadSections: (projectId: string) => Promise<void>;
  initializeDefaultSections: (projectId: string) => Promise<void>;
  updateSection: (sectionId: string, content: string) => Promise<void>;
  toggleComplete: (sectionId: string) => Promise<void>;
  clearSections: () => void;
  getCompletionPercentage: () => number;
}

export const useCharterStore = create<CharterStore>((set, get) => ({
  sections: [],
  isLoading: false,
  error: null,
  currentProjectId: null,

  /**
   * Load charter sections for a project
   * If no sections exist, initialize with default 6 sections
   */
  loadSections: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null, currentProjectId: projectId });
      
      const { data, error } = await supabase
        .from('project_charter_sections' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('section_order', { ascending: true });
      
      if (error) throw error;
      
      // If no sections exist, initialize with defaults
      if (!data || data.length === 0) {
        await get().initializeDefaultSections(projectId);
        return;
      }
      
      set({ sections: data as any as CharterSection[], isLoading: false });
    } catch (error) {
      console.error('Error loading charter sections:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load sections',
        isLoading: false 
      });
    }
  },

  /**
   * Initialize default 6 sections for new project charter
   */
  initializeDefaultSections: async (projectId: string) => {
    try {
      const sectionsToInsert = DEFAULT_SECTIONS.map(s => ({
        project_id: projectId,
        section_name: s.name,
        section_order: s.order,
        section_description: s.description,
        content: '',
        is_completed: false,
        ai_generated: false
      }));
      
      const { data, error } = await supabase
        .from('project_charter_sections' as any)
        .insert(sectionsToInsert)
        .select();
      
      if (error) throw error;
      
      set({ sections: data as any as CharterSection[], isLoading: false });
    } catch (error) {
      console.error('Error initializing sections:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize sections',
        isLoading: false 
      });
    }
  },

  /**
   * Update section content
   */
  updateSection: async (sectionId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('project_charter_sections' as any)
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        } as any)
        .eq('id', sectionId);
      
      if (error) throw error;
      
      // Optimistic update
      set((state) => ({
        sections: state.sections.map(s => 
          s.id === sectionId ? { ...s, content } : s
        )
      }));
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },

  /**
   * Toggle section completion status
   */
  toggleComplete: async (sectionId: string) => {
    try {
      const section = get().sections.find(s => s.id === sectionId);
      if (!section) return;
      
      const newStatus = !section.is_completed;
      
      const { error } = await supabase
        .from('project_charter_sections' as any)
        .update({ is_completed: newStatus } as any)
        .eq('id', sectionId);
      
      if (error) throw error;
      
      // Optimistic update
      set((state) => ({
        sections: state.sections.map(s => 
          s.id === sectionId ? { ...s, is_completed: newStatus } : s
        )
      }));
    } catch (error) {
      console.error('Error toggling complete:', error);
      throw error;
    }
  },

  /**
   * Clear sections (when project deselected)
   */
  clearSections: () => {
    set({ sections: [], currentProjectId: null, error: null });
  },

  /**
   * Calculate completion percentage
   */
  getCompletionPercentage: () => {
    const { sections } = get();
    if (sections.length === 0) return 0;
    
    const completedCount = sections.filter(s => s.is_completed).length;
    return Math.round((completedCount / sections.length) * 100);
  }
}));

