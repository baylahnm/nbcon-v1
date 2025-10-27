/**
 * AI Tool Session Store
 * 
 * Cross-tool session management with Zustand + Supabase persistence.
 * Maintains workflow state, tool history, and context across navigation.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/shared/supabase/client';
import type { WorkflowPipeline, WorkflowStep } from '@/pages/4-free/others/features/ai/services/orchestrator';

/**
 * Tool interaction record
 */
export interface ToolInteraction {
  id: string;
  toolId: string;
  action: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  tokensUsed: number;
  costUSD: number;
  duration: number; // milliseconds
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Active tool session
 */
export interface ToolSession {
  id: string;
  conversationId: string | null;
  projectId: string | null;
  
  // Current state
  currentPhase: string | null; // Project phase
  activeTool: string | null; // Current tool ID
  previousTool: string | null; // Last used tool
  
  // History
  interactions: ToolInteraction[];
  toolChain: string[]; // Sequence of tools used
  
  // Context
  sharedContext: Record<string, unknown>; // Data shared across tools
  pendingInputs: Record<string, unknown>; // Inputs waiting for next tool
  
  // Workflow
  activeWorkflow: WorkflowPipeline | null;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session store state
 */
interface SessionStoreState {
  // Active session
  activeSession: ToolSession | null;
  
  // Session management
  startSession: (
    conversationId: string | null,
    projectId: string | null,
    initialPhase?: string
  ) => string;
  
  endSession: () => void;
  
  resumeSession: (sessionId: string) => Promise<void>;
  
  // Interaction tracking
  appendInteraction: (interaction: Omit<ToolInteraction, 'id' | 'timestamp'>) => void;
  
  // Context management
  updateSharedContext: (updates: Record<string, unknown>) => void;
  
  transferContext: (
    fromToolId: string,
    toToolId: string,
    fieldsToTransfer: string[]
  ) => void;
  
  setPendingInputs: (inputs: Record<string, unknown>) => void;
  
  // Workflow management
  setActiveWorkflow: (workflow: WorkflowPipeline | null) => void;
  
  updateWorkflowStep: (stepIndex: number, updates: Partial<WorkflowStep>) => void;
  
  // Tool tracking
  setActiveTool: (toolId: string) => void;
  
  // Persistence
  persistToSupabase: () => Promise<void>;
  
  loadFromSupabase: (sessionId: string) => Promise<boolean>;
}

/**
 * Session store with Zustand + Supabase persistence
 */
export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set, get) => ({
      activeSession: null,

      /**
       * Start new tool session
       */
      startSession: (conversationId, projectId, initialPhase = 'planning') => {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        const newSession: ToolSession = {
          id: sessionId,
          conversationId,
          projectId,
          currentPhase: initialPhase,
          activeTool: null,
          previousTool: null,
          interactions: [],
          toolChain: [],
          sharedContext: {},
          pendingInputs: {},
          activeWorkflow: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({ activeSession: newSession });
        
        // Persist to Supabase (async, non-blocking)
        get().persistToSupabase();
        
        return sessionId;
      },

      /**
       * End current session
       */
      endSession: () => {
        const session = get().activeSession;
        if (session) {
          // Final persist before clearing
          get().persistToSupabase();
        }
        set({ activeSession: null });
      },

      /**
       * Resume session from Supabase
       */
      resumeSession: async (sessionId: string) => {
        const loaded = await get().loadFromSupabase(sessionId);
        if (!loaded) {
          console.warn(`[SessionStore] Could not resume session: ${sessionId}`);
        }
      },

      /**
       * Append tool interaction to history
       */
      appendInteraction: (interaction) => {
        const session = get().activeSession;
        if (!session) {
          console.warn('[SessionStore] No active session to append interaction');
          return;
        }
        
        const fullInteraction: ToolInteraction = {
          ...interaction,
          id: `interaction-${Date.now()}`,
          timestamp: new Date(),
        };
        
        set({
          activeSession: {
            ...session,
            interactions: [...session.interactions, fullInteraction],
            toolChain: session.toolChain.includes(interaction.toolId)
              ? session.toolChain
              : [...session.toolChain, interaction.toolId],
            previousTool: session.activeTool,
            activeTool: interaction.toolId,
            updatedAt: new Date(),
          },
        });
        
        // Auto-persist after each interaction
        get().persistToSupabase();
      },

      /**
       * Update shared context
       */
      updateSharedContext: (updates) => {
        const session = get().activeSession;
        if (!session) return;
        
        set({
          activeSession: {
            ...session,
            sharedContext: {
              ...session.sharedContext,
              ...updates,
            },
            updatedAt: new Date(),
          },
        });
      },

      /**
       * Transfer context between tools
       */
      transferContext: (fromToolId, toToolId, fieldsToTransfer) => {
        const session = get().activeSession;
        if (!session) return;
        
        const lastInteraction = session.interactions
          .filter((i) => i.toolId === fromToolId)
          .pop();
        
        if (!lastInteraction || !lastInteraction.outputs) return;
        
        const transferred: Record<string, any> = {};
        for (const field of fieldsToTransfer) {
          if (lastInteraction.outputs[field] !== undefined) {
            transferred[field] = lastInteraction.outputs[field];
          }
        }
        
        set({
          activeSession: {
            ...session,
            pendingInputs: {
              ...session.pendingInputs,
              ...transferred,
            },
            updatedAt: new Date(),
          },
        });
      },

      /**
       * Set pending inputs for next tool
       */
      setPendingInputs: (inputs) => {
        const session = get().activeSession;
        if (!session) return;
        
        set({
          activeSession: {
            ...session,
            pendingInputs: inputs,
            updatedAt: new Date(),
          },
        });
      },

      /**
       * Set active workflow
       */
      setActiveWorkflow: (workflow) => {
        const session = get().activeSession;
        if (!session) return;
        
        set({
          activeSession: {
            ...session,
            activeWorkflow: workflow,
            updatedAt: new Date(),
          },
        });
      },

      /**
       * Update workflow step
       */
      updateWorkflowStep: (stepIndex, updates) => {
        const session = get().activeSession;
        if (!session || !session.activeWorkflow) return;
        
        const updatedSteps = [...session.activeWorkflow.steps];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          ...updates,
        };
        
        set({
          activeSession: {
            ...session,
            activeWorkflow: {
              ...session.activeWorkflow,
              steps: updatedSteps,
            },
            updatedAt: new Date(),
          },
        });
      },

      /**
       * Set active tool
       */
      setActiveTool: (toolId) => {
        const session = get().activeSession;
        if (!session) return;
        
        set({
          activeSession: {
            ...session,
            previousTool: session.activeTool,
            activeTool: toolId,
            updatedAt: new Date(),
          },
        });
      },

      /**
       * Persist session to Supabase
       */
      persistToSupabase: async () => {
        const session = get().activeSession;
        if (!session) return;
        
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          // Upsert session to ai_tool_sessions table
          const { error } = await supabase
            .from('ai_tool_sessions')
            .upsert({
              id: session.id,
              user_id: user.id,
              conversation_id: session.conversationId,
              project_id: session.projectId,
              current_phase: session.currentPhase,
              active_tool: session.activeTool,
              previous_tool: session.previousTool,
              tool_chain: session.toolChain,
              shared_context: session.sharedContext,
              pending_inputs: session.pendingInputs,
              active_workflow: session.activeWorkflow,
              interactions_count: session.interactions.length,
              created_at: session.createdAt.toISOString(),
              updated_at: session.updatedAt.toISOString(),
            });
          
          if (error) {
            console.error('[SessionStore] Failed to persist session:', error);
          }
          
          // Persist interactions separately (if not already saved)
          const interactionPromises = session.interactions.map(async (interaction) => {
            const { error: intError } = await supabase
              .from('ai_tool_interactions')
              .upsert({
                id: interaction.id,
                session_id: session.id,
                tool_id: interaction.toolId,
                action: interaction.action,
                inputs: interaction.inputs,
                outputs: interaction.outputs,
                tokens_used: interaction.tokensUsed,
                cost_usd: interaction.costUSD,
                duration_ms: interaction.duration,
                success: interaction.success,
                error_message: interaction.error,
                created_at: interaction.timestamp.toISOString(),
              });
            
            if (intError) {
              console.error('[SessionStore] Failed to persist interaction:', intError);
            }
          });
          
          await Promise.all(interactionPromises);
        } catch (error) {
          console.error('[SessionStore] Persistence error:', error);
        }
      },

      /**
       * Load session from Supabase
       */
      loadFromSupabase: async (sessionId: string): Promise<boolean> => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          
          // Load session
          const { data: sessionData, error: sessionError } = await supabase
            .from('ai_tool_sessions')
            .select('*')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single();
          
          if (sessionError || !sessionData) {
            console.error('[SessionStore] Session not found:', sessionError);
            return false;
          }
          
          // Load interactions
          const { data: interactionsData, error: interactionsError } = await supabase
            .from('ai_tool_interactions')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });
          
          if (interactionsError) {
            console.error('[SessionStore] Failed to load interactions:', interactionsError);
          }
          
          // Reconstruct session
          const loadedSession: ToolSession = {
            id: sessionData.id,
            conversationId: sessionData.conversation_id,
            projectId: sessionData.project_id,
            currentPhase: sessionData.current_phase,
            activeTool: sessionData.active_tool,
            previousTool: sessionData.previous_tool,
            interactions: (interactionsData || []).map((i: Record<string, unknown>) => ({
              id: i.id,
              toolId: i.tool_id,
              action: i.action,
              inputs: i.inputs,
              outputs: i.outputs,
              tokensUsed: i.tokens_used,
              costUSD: i.cost_usd,
              duration: i.duration_ms,
              timestamp: new Date(i.created_at),
              success: i.success,
              error: i.error_message,
            })),
            toolChain: sessionData.tool_chain || [],
            sharedContext: sessionData.shared_context || {},
            pendingInputs: sessionData.pending_inputs || {},
            activeWorkflow: sessionData.active_workflow,
            createdAt: new Date(sessionData.created_at),
            updatedAt: new Date(sessionData.updated_at),
          };
          
          set({ activeSession: loadedSession });
          return true;
        } catch (error) {
          console.error('[SessionStore] Load error:', error);
          return false;
        }
      },
    }),
    {
      name: 'ai-tool-session-storage',
      version: 1,
      // Only persist session ID for quick resume
      partialize: (state) => ({
        activeSessionId: state.activeSession?.id,
      }),
    }
  )
);

/**
 * Hook to get current session summary
 */
export function useSessionSummary() {
  const session = useSessionStore((state) => state.activeSession);
  
  if (!session) {
    return {
      hasSession: false,
      toolCount: 0,
      totalCost: 0,
      duration: 0,
    };
  }
  
  const totalCost = session.interactions.reduce((sum, i) => sum + i.costUSD, 0);
  const duration = session.interactions.reduce((sum, i) => sum + i.duration, 0);
  
  return {
    hasSession: true,
    sessionId: session.id,
    toolCount: session.toolChain.length,
    interactionCount: session.interactions.length,
    totalCost,
    duration,
    currentTool: session.activeTool,
    currentPhase: session.currentPhase,
  };
}

/**
 * Export types
 */
export type { ToolInteraction, ToolSession };

