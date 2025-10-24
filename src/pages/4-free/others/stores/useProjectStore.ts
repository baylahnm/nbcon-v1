import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/shared/supabase/client';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';

/**
 * Unified Project Model
 * Maps to gantt_projects table in Supabase
 */
export interface Project {
  id: string;
  name: string;
  description: string | null;
  project_type: 'construction' | 'renovation' | 'infrastructure' | 'residential' | 'commercial';
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  currency: string;
  location: string | null;
  created_by: string;
  is_template: boolean;
  template_name: string | null;
  created_at: string;
  updated_at: string;
  
  // Computed fields (not in database)
  progress?: number;
  team_size?: number;
  task_count?: number;
}

/**
 * Project creation input (fields required from user)
 */
export interface CreateProjectInput {
  name: string;
  description?: string;
  project_type: 'construction' | 'renovation' | 'infrastructure' | 'residential' | 'commercial';
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency?: string;
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  is_template?: boolean;
  template_name?: string;
}

/**
 * Unified Project Store
 * Single source of truth for all AI Planning Tools
 */
interface ProjectStore {
  // State
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions - CRUD Operations
  loadUserProjects: () => Promise<void>;
  selectProject: (projectId: string | null) => void;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  // Utility Functions
  getSelectedProject: () => Project | null;
  getProjectById: (id: string) => Project | null;
  clearError: () => void;
  refreshProjects: () => Promise<void>;
}

/**
 * Unified Project Store Implementation
 * 
 * This store manages all projects across AI Planning Tools:
 * - Loads projects from gantt_projects table
 * - Enforces Row-Level Security
 * - Provides CRUD operations
 * - Persists selected project across sessions
 */
export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial State
      projects: [],
      selectedProjectId: null,
      isLoading: false,
      error: null,

      /**
       * Load all projects for current user from database
       */
      loadUserProjects: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { user } = useAuthStore.getState();
          if (!user) {
            throw new Error('User not authenticated');
          }

          const { data, error } = await supabase
            .from('gantt_projects')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Calculate progress for each project (from tasks)
          const projectsWithProgress = await Promise.all(
            (data || []).map(async (project: any) => {
              try {
                const { data: tasks } = await supabase
                  .from('gantt_tasks')
                  .select('progress')
                  .eq('project_id', project.id);

                const avgProgress = tasks && tasks.length > 0
                  ? tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length
                  : 0;

                const taskCount = tasks?.length || 0;

                return {
                  ...project,
                  progress: Math.round(avgProgress),
                  task_count: taskCount
                } as Project;
              } catch (error) {
                console.error(`Error calculating progress for project ${project.id}:`, error);
                return {
                  ...project,
                  progress: 0,
                  task_count: 0
                } as Project;
              }
            })
          );

          set({ 
            projects: projectsWithProgress as Project[], 
            isLoading: false 
          });

        } catch (error) {
          console.error('Error loading projects:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load projects',
            isLoading: false 
          });
        }
      },

      /**
       * Select a project (stores in global state and persists)
       */
      selectProject: (projectId: string | null) => {
        set({ selectedProjectId: projectId });
      },

      /**
       * Create new project and save to database
       */
      createProject: async (input: CreateProjectInput) => {
        try {
          set({ isLoading: true, error: null });
          
          const { user } = useAuthStore.getState();
          if (!user) {
            throw new Error('User not authenticated');
          }

          // Prepare data for insert
          const projectData = {
            name: input.name,
            description: input.description || null,
            project_type: input.project_type,
            status: input.status || 'planning',
            start_date: input.start_date || null,
            end_date: input.end_date || null,
            budget: input.budget || null,
            currency: input.currency || 'SAR',
            location: input.location || null,
            created_by: user.id,
            is_template: input.is_template || false,
            template_name: input.template_name || null,
          };

          const { data, error } = await supabase
            .from('gantt_projects')
            .insert([projectData])
            .select()
            .single();

          if (error) throw error;

          const newProject = { ...data, progress: 0, task_count: 0 } as Project;

          // Add to local state and select it
          set((state) => ({
            projects: [newProject, ...state.projects],
            selectedProjectId: newProject.id,
            isLoading: false
          }));

          return newProject;

        } catch (error) {
          console.error('Error creating project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Update existing project
       */
      updateProject: async (projectId: string, updates: Partial<Project>) => {
        try {
          set({ isLoading: true, error: null });
          
          const { user } = useAuthStore.getState();
          if (!user) {
            throw new Error('User not authenticated');
          }

          // Verify ownership before update
          const project = get().projects.find(p => p.id === projectId);
          if (!project || project.created_by !== user.id) {
            throw new Error('Project not found or access denied');
          }

          const { error } = await supabase
            .from('gantt_projects')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', projectId)
            .eq('created_by', user.id); // RLS check

          if (error) throw error;

          // Update local state
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId ? { ...p, ...updates } : p
            ),
            isLoading: false
          }));

        } catch (error) {
          console.error('Error updating project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Delete project from database
       */
      deleteProject: async (projectId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { user } = useAuthStore.getState();
          if (!user) {
            throw new Error('User not authenticated');
          }

          // Verify ownership before delete
          const project = get().projects.find(p => p.id === projectId);
          if (!project || project.created_by !== user.id) {
            throw new Error('Project not found or access denied');
          }

          const { error } = await supabase
            .from('gantt_projects')
            .delete()
            .eq('id', projectId)
            .eq('created_by', user.id); // RLS check

          if (error) throw error;

          // Remove from local state
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
            selectedProjectId: state.selectedProjectId === projectId ? null : state.selectedProjectId,
            isLoading: false
          }));

        } catch (error) {
          console.error('Error deleting project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Get currently selected project
       */
      getSelectedProject: () => {
        const { projects, selectedProjectId } = get();
        if (!selectedProjectId) return null;
        return projects.find((p) => p.id === selectedProjectId) || null;
      },

      /**
       * Get project by ID
       */
      getProjectById: (id: string) => {
        const { projects } = get();
        return projects.find((p) => p.id === id) || null;
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Refresh projects (force reload from database)
       */
      refreshProjects: async () => {
        await get().loadUserProjects();
      }
    }),
    {
      name: 'nbcon-project-store',
      version: 1,
      // Only persist selectedProjectId (not full project list - reload from DB)
      partialize: (state) => ({
        selectedProjectId: state.selectedProjectId
      })
    }
  )
);

