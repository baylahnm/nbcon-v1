import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';

/**
 * Stakeholder Model
 * Maps to project_stakeholders table
 */
export interface Stakeholder {
  id: string;
  project_id: string;
  name: string;
  role: string | null;
  organization: string | null;
  power_level: 'high' | 'low';
  interest_level: 'high' | 'low';
  engagement_strategy: string | null;
  contact_info: string | null;
  influence_score: number | null;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Stakeholder Store
 * Manages stakeholders for Stakeholder Mapper tool
 */
interface StakeholderStore {
  stakeholders: Stakeholder[];
  isLoading: boolean;
  error: string | null;
  currentProjectId: string | null;
  
  loadStakeholders: (projectId: string) => Promise<void>;
  createStakeholder: (projectId: string, stakeholder: Partial<Stakeholder>) => Promise<void>;
  updateStakeholder: (stakeholderId: string, updates: Partial<Stakeholder>) => Promise<void>;
  deleteStakeholder: (stakeholderId: string) => Promise<void>;
  clearStakeholders: () => void;
  getByQuadrant: (power: 'high' | 'low', interest: 'high' | 'low') => Stakeholder[];
}

export const useStakeholderStore = create<StakeholderStore>((set, get) => ({
  stakeholders: [],
  isLoading: false,
  error: null,
  currentProjectId: null,

  /**
   * Load stakeholders for a project
   */
  loadStakeholders: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null, currentProjectId: projectId });
      
      const { data, error } = await supabase
        .from('project_stakeholders' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('power_level', { ascending: false })
        .order('interest_level', { ascending: false });
      
      if (error) throw error;
      
      set({ stakeholders: data as any as Stakeholder[], isLoading: false });
    } catch (error) {
      console.error('Error loading stakeholders:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load stakeholders',
        isLoading: false 
      });
    }
  },

  /**
   * Create new stakeholder
   */
  createStakeholder: async (projectId: string, stakeholder: Partial<Stakeholder>) => {
    try {
      const { data, error } = await supabase
        .from('project_stakeholders' as any)
        .insert([{ 
          ...stakeholder, 
          project_id: projectId,
          ai_generated: stakeholder.ai_generated || false
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to local state
      set((state) => ({
        stakeholders: [...state.stakeholders, data as any as Stakeholder]
      }));
    } catch (error) {
      console.error('Error creating stakeholder:', error);
      throw error;
    }
  },

  /**
   * Update stakeholder
   */
  updateStakeholder: async (stakeholderId: string, updates: Partial<Stakeholder>) => {
    try {
      const { error } = await supabase
        .from('project_stakeholders' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', stakeholderId);
      
      if (error) throw error;
      
      // Optimistic update
      set((state) => ({
        stakeholders: state.stakeholders.map(s => 
          s.id === stakeholderId ? { ...s, ...updates } : s
        )
      }));
    } catch (error) {
      console.error('Error updating stakeholder:', error);
      throw error;
    }
  },

  /**
   * Delete stakeholder
   */
  deleteStakeholder: async (stakeholderId: string) => {
    try {
      const { error } = await supabase
        .from('project_stakeholders' as any)
        .delete()
        .eq('id', stakeholderId);
      
      if (error) throw error;
      
      // Remove from local state
      set((state) => ({
        stakeholders: state.stakeholders.filter(s => s.id !== stakeholderId)
      }));
    } catch (error) {
      console.error('Error deleting stakeholder:', error);
      throw error;
    }
  },

  /**
   * Clear stakeholders (when project deselected)
   */
  clearStakeholders: () => {
    set({ stakeholders: [], currentProjectId: null, error: null });
  },

  /**
   * Get stakeholders by power/interest quadrant
   */
  getByQuadrant: (power: 'high' | 'low', interest: 'high' | 'low') => {
    const { stakeholders } = get();
    return stakeholders.filter(
      s => s.power_level === power && s.interest_level === interest
    );
  }
}));

