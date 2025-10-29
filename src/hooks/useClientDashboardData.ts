/**
 * Client Dashboard Data Hook
 * 
 * Centralized data fetching for client dashboard
 * Fetches metrics, projects, and conversations from Supabase
 * 
 * @module hooks/useClientDashboardData
 * @version 1.0.0
 * @created January 28, 2025
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { useAiStore } from '@/shared/stores/useAiStore';
import { fetchOverviewMetrics, type OverviewMetrics } from '@/lib/dashboard/clientMetrics';
import { supabase } from '@/shared/supabase/client';

/**
 * Project from database
 */
export interface DashboardProject {
  id: string;
  title: string;
  tasks: number;
  budget: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'pending-review' | 'on-hold';
  description?: string;
  type?: string;
  location?: string;
  created?: string;
  lastUpdated?: string;
  milestones?: Array<{
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
    date: string;
  }>;
}

/**
 * Conversation from AI store
 */
export interface DashboardConversation {
  id: string;
  title: string;
  date: string;
  isStarred: boolean;
}

/**
 * Hook return type
 */
export interface ClientDashboardData {
  // Metrics
  metrics: OverviewMetrics | null;
  metricsLoading: boolean;
  metricsError: string | null;
  
  // Projects
  projects: DashboardProject[];
  projectsLoading: boolean;
  projectsError: string | null;
  
  // Conversations
  conversations: DashboardConversation[];
  conversationsLoading: boolean;
  
  // Refetch
  refetchMetrics: () => Promise<void>;
  refetchProjects: () => Promise<void>;
}

/**
 * Fetch client dashboard data
 * 
 * @returns Dashboard data with loading/error states
 */
export function useClientDashboardData(): ClientDashboardData {
  const { user } = useAuthStore();
  const { threads, isHydrated: conversationsHydrated, hydrateFromSupabase } = useAiStore();
  
  // Metrics state
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  
  // Projects state
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  /**
   * Fetch overview metrics
   */
  const fetchMetrics = async () => {
    if (!user?.id) {
      setMetricsLoading(false);
      return;
    }

    try {
      setMetricsLoading(true);
      setMetricsError(null);
      const data = await fetchOverviewMetrics(user.id);
      setMetrics(data);
    } catch (err) {
      console.error('[useClientDashboardData] Failed to fetch metrics:', err);
      setMetricsError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setMetricsLoading(false);
    }
  };

  /**
   * Fetch recent projects
   */
  const fetchProjects = async () => {
    if (!user?.id) {
      setProjectsLoading(false);
      return;
    }

    try {
      setProjectsLoading(true);
      setProjectsError(null);

      // Try gantt_projects first, fallback to client_projects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: ganttProjects, error: ganttError } = await (supabase as any)
        .from('gantt_projects')
        .select(`
          id,
          project_name,
          project_type,
          location,
          start_date,
          end_date,
          total_budget,
          description,
          created_at,
          updated_at
        `)
        .eq('created_by', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (!ganttError && ganttProjects && ganttProjects.length > 0) {
        // Map gantt_projects to DashboardProject format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedProjects: DashboardProject[] = ganttProjects.map((p: any) => ({
          id: p.id,
          title: p.project_name || 'Untitled Project',
          tasks: 0, // TODO: Count from gantt_tasks
          budget: p.total_budget ? `${(p.total_budget / 1000).toFixed(0)}K` : '0',
          progress: 0, // TODO: Calculate from task completion
          status: 'in-progress' as const,
          description: p.description || '',
          type: p.project_type || 'General',
          location: p.location || 'Saudi Arabia',
          created: p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '',
        }));
        setProjects(mappedProjects);
      } else {
        // Fallback to client_projects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: clientProjects, error: clientError } = await (supabase as any)
          .from('client_projects')
          .select('*')
          .eq('client_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        if (!clientError && clientProjects) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedProjects: DashboardProject[] = clientProjects.map((p: any) => ({
            id: p.id,
            title: p.project_name || p.title || 'Untitled Project',
            tasks: p.total_tasks || 0,
            budget: p.budget ? `${(p.budget / 1000).toFixed(0)}K` : '0',
            progress: p.progress || 0,
            status: p.status || 'planning',
            description: p.description || '',
            type: p.project_type || 'General',
            location: p.location || 'Saudi Arabia',
            created: p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
            lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '',
          }));
          setProjects(mappedProjects);
        } else {
          // No projects found
          setProjects([]);
        }
      }
    } catch (err) {
      console.error('[useClientDashboardData] Failed to fetch projects:', err);
      setProjectsError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch metrics on mount
  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Hydrate conversations on mount
  useEffect(() => {
    if (!conversationsHydrated && user?.id) {
      hydrateFromSupabase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationsHydrated, user?.id]);

  // Map threads to conversations
  const conversations: DashboardConversation[] = threads
    .filter(t => !t.isArchived)
    .slice(0, 10) // Latest 10
    .map(t => ({
      id: t.id,
      title: t.title || 'New Conversation',
      date: new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isStarred: t.isStarred || false,
    }));

  // Map DashboardProject to Project (normalize status values)
  const mappedProjects = projects.map(p => ({
    ...p,
    status: (p.status === 'pending-review' ? 'review' : 
             p.status === 'on-hold' ? 'planning' : 
             p.status) as 'planning' | 'in-progress' | 'review' | 'completed'
  }));

  return {
    // Metrics
    metrics,
    metricsLoading,
    metricsError,
    
    // Projects (mapped to Project type)
    projects: mappedProjects,
    projectsLoading,
    projectsError,
    
    // Conversations
    conversations,
    conversationsLoading: !conversationsHydrated,
    
    // Refetch
    refetchMetrics: fetchMetrics,
    refetchProjects: fetchProjects,
  };
}

