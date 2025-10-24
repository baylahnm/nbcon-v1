import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';

/**
 * Risk Model
 * Maps to project_risks table
 */
export interface Risk {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  category: 'schedule' | 'cost' | 'quality' | 'safety' | 'regulatory' | 'resource' | 'technical' | 'external';
  probability: number; // 1-5
  impact: number; // 1-5
  risk_score: number; // probability × impact (computed)
  mitigation_strategy: string | null;
  contingency_plan: string | null;
  status: 'identified' | 'assessed' | 'mitigated' | 'monitored' | 'closed';
  owner: string | null;
  response_strategy: 'avoid' | 'mitigate' | 'transfer' | 'accept' | null;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Risk Store
 * Manages risks for Risk Register tool
 */
interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  error: string | null;
  currentProjectId: string | null;
  
  loadRisks: (projectId: string) => Promise<void>;
  createRisk: (projectId: string, risk: Partial<Risk>) => Promise<void>;
  updateRisk: (riskId: string, updates: Partial<Risk>) => Promise<void>;
  deleteRisk: (riskId: string) => Promise<void>;
  clearRisks: () => void;
  getRisksByCategory: (category: string) => Risk[];
  getHighRisks: () => Risk[]; // risk_score >= 15
}

export const useRiskStore = create<RiskStore>((set, get) => ({
  risks: [],
  isLoading: false,
  error: null,
  currentProjectId: null,

  /**
   * Load risks for a project
   */
  loadRisks: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null, currentProjectId: projectId });
      
      const { data, error } = await supabase
        .from('project_risks' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('risk_score', { ascending: false });
      
      if (error) throw error;
      
      set({ risks: data as any as Risk[], isLoading: false });
    } catch (error) {
      console.error('Error loading risks:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load risks',
        isLoading: false 
      });
    }
  },

  /**
   * Create new risk
   */
  createRisk: async (projectId: string, risk: Partial<Risk>) => {
    try {
      const { data, error } = await supabase
        .from('project_risks' as any)
        .insert([{ 
          ...risk, 
          project_id: projectId,
          ai_generated: risk.ai_generated || false
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to local state
      set((state) => ({
        risks: [data as any as Risk, ...state.risks].sort((a, b) => b.risk_score - a.risk_score)
      }));
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  },

  /**
   * Update risk
   */
  updateRisk: async (riskId: string, updates: Partial<Risk>) => {
    try {
      const { error } = await supabase
        .from('project_risks' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', riskId);
      
      if (error) throw error;
      
      // Optimistic update
      set((state) => ({
        risks: state.risks.map(r => 
          r.id === riskId ? { ...r, ...updates } : r
        ).sort((a, b) => b.risk_score - a.risk_score)
      }));
    } catch (error) {
      console.error('Error updating risk:', error);
      throw error;
    }
  },

  /**
   * Delete risk
   */
  deleteRisk: async (riskId: string) => {
    try {
      const { error } = await supabase
        .from('project_risks' as any)
        .delete()
        .eq('id', riskId);
      
      if (error) throw error;
      
      // Remove from local state
      set((state) => ({
        risks: state.risks.filter(r => r.id !== riskId)
      }));
    } catch (error) {
      console.error('Error deleting risk:', error);
      throw error;
    }
  },

  /**
   * Clear risks (when project deselected)
   */
  clearRisks: () => {
    set({ risks: [], currentProjectId: null, error: null });
  },

  /**
   * Get risks by category
   */
  getRisksByCategory: (category: string) => {
    const { risks } = get();
    return risks.filter(r => r.category === category);
  },

  /**
   * Get high-priority risks (score >= 15)
   */
  getHighRisks: () => {
    const { risks } = get();
    return risks.filter(r => r.risk_score >= 15);
  }
}));

