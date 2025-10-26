/**
 * Integration Tests: invokeAgent
 * Phase 3: Agent Workflow Integration
 * 
 * Tests end-to-end agent invocation with mocked Supabase
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  invokeAgent,
  startAgentSession,
  saveDeliverable,
  getSessionDeliverables,
} from '../../src/shared/services/agentService';
import type { AIAgent } from '../../src/shared/types/ai-agents';

// Mock Supabase
vi.mock('../../src/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id', email: 'engineer@test.com' } },
        error: null,
      })),
    },
    functions: {
      invoke: vi.fn((name: string, options: any) => {
        if (name === 'ai-chat') {
          return Promise.resolve({
            data: {
              response: '```json\n{"design_moment": 42.5, "required_As": 842}\n```',
              model: 'gpt-4o',
              usage: {
                prompt_tokens: 1200,
                completion_tokens: 600,
                total_tokens: 1800,
              },
              processing_time_ms: 3500,
            },
            error: null,
          });
        }
        return Promise.resolve({ data: null, error: { message: 'Unknown function' } });
      }),
    },
    rpc: vi.fn((name: string, params?: any) => {
      if (name === 'start_agent_session') {
        return Promise.resolve({ data: 'session-123', error: null });
      }
      if (name === 'submit_agent_feedback') {
        return Promise.resolve({ data: 'feedback-123', error: null });
      }
      return Promise.resolve({ data: null, error: null });
    }),
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [
                {
                  id: 'deliv-1',
                  title: 'Beam Design Calculation',
                  deliverable_type: 'structural_calc',
                  validation_status: 'pending',
                },
              ],
              error: null,
            })),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 'deliv-new-123' },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

describe('Agent Invocation Integration', () => {
  const mockAgent: AIAgent = {
    id: 'agent-structural-001',
    discipline: 'structural',
    display_name: 'Structural Engineering Assistant',
    description: 'Specialized in structural design',
    icon_name: 'Hammer',
    color_scheme: 'bg-gray-700',
    capabilities: ['beam_design', 'column_design'],
    workflows: ['data_intake', 'calculation', 'validation', 'deliverable_generation'],
    decision_checkpoints: [],
    system_prompt: 'You are a structural engineering expert...',
    prompt_templates: {},
    tool_stack: ['calculations', 'code_check'],
    training_requirements: {
      required_datasets: ['beam_designs', 'column_calcs'],
      sample_size: 1000,
      validation_method: 'peer_review',
      update_frequency: 'monthly',
    },
    qa_safeguards: [
      {
        id: 'qa-1',
        parameter: 'design_moment',
        check_type: 'range',
        min_value: 0,
        max_value: 1000,
        error_message: 'Moment out of range',
        severity: 'error',
      },
    ],
    validation_rules: [],
    integration_hooks: {
      project_dashboard: {
        enabled: true,
        update_frequency: 'realtime',
        metrics_tracked: ['progress'],
        alert_thresholds: {},
      },
      engineer_assignment: {
        enabled: false,
        matching_criteria: {
          required_skills: [],
          min_experience: 0,
          certifications: [],
        },
        notification_priority: 'medium',
      },
      document_generation: {
        enabled: true,
        supported_formats: ['pdf'],
        template_library: [],
        auto_generate: false,
      },
      notification_system: {
        enabled: true,
        channels: ['in_app'],
        event_triggers: [],
      },
    },
    output_templates: {},
    is_active: true,
    requires_certification: false,
    min_experience_years: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startAgentSession', () => {
    it('should start session successfully', async () => {
      const sessionId = await startAgentSession('agent-123', 'consultation');

      expect(sessionId).toBe('session-123');
    });

    it('should pass project context', async () => {
      const sessionId = await startAgentSession('agent-123', 'design_review', {
        projectId: 'proj-456',
        jobId: 'job-789',
      });

      expect(sessionId).toBe('session-123');
      
      const { supabase } = await import('../../src/shared/supabase/client');
      expect(supabase.rpc).toHaveBeenCalledWith('start_agent_session', {
        p_agent_id: 'agent-123',
        p_session_type: 'design_review',
        p_project_id: 'proj-456',
        p_job_id: 'job-789',
      });
    });
  });

  describe('invokeAgent', () => {
    it('should invoke agent and return structured response', async () => {
      const response = await invokeAgent(
        mockAgent,
        'session-123',
        {
          type: 'beam_design',
          inputs: {
            span: 6.5,
            dead_load: 8,
            live_load: 5,
          },
        }
      );

      expect(response.status).toMatch(/success|requires_review/);
      expect(response.agent_id).toBe(mockAgent.id);
      expect(response.session_id).toBe('session-123');
      expect(response.output).toBeDefined();
      expect(response.tokens_used).toBe(1800);
    });

    it('should run QA validations', async () => {
      const response = await invokeAgent(
        mockAgent,
        'session-123',
        {
          type: 'beam_design',
          inputs: { span: 6.5 },
        }
      );

      expect(response.validation_results).toBeDefined();
      expect(Array.isArray(response.validation_results)).toBe(true);
      expect(response.confidence_score).toBeGreaterThanOrEqual(0);
      expect(response.confidence_score).toBeLessThanOrEqual(100);
    });

    it('should call edge function with agent context', async () => {
      await invokeAgent(
        mockAgent,
        'session-123',
        {
          type: 'beam_design',
          inputs: {},
        }
      );

      const { supabase } = await import('../../src/shared/supabase/client');
      expect(supabase.functions.invoke).toHaveBeenCalledWith('ai-chat', {
        body: expect.objectContaining({
          agentContext: expect.objectContaining({
            agent_id: mockAgent.id,
            discipline: mockAgent.discipline,
            session_id: 'session-123',
            workflow_id: 'beam_design',
          }),
        }),
      });
    });

    it('should handle edge function errors gracefully', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: null,
        error: { message: 'OpenAI API error' },
      } as any);

      const response = await invokeAgent(
        mockAgent,
        'session-123',
        { type: 'test', inputs: {} }
      );

      expect(response.status).toBe('error');
      // AgentResponse doesn't have error_message, check status instead
      expect(response.status).toBe('error');
    });

    it('should calculate confidence score correctly', async () => {
      const response = await invokeAgent(
        mockAgent,
        'session-123',
        {
          type: 'beam_design',
          inputs: { span: 6.5 },
        }
      );

      expect(response.confidence_score).toBeGreaterThan(0);
      // With 1 safeguard that should pass (design_moment = 42.5 within 0-1000)
      expect(response.confidence_score).toBeGreaterThanOrEqual(75);
    });
  });

  describe('saveDeliverable', () => {
    it('should save deliverable successfully', async () => {
      const deliverableId = await saveDeliverable(
        'session-123',
        'agent-123',
        {
          type: 'structural_calc',
          title: 'Beam Design Report',
          content: { results: {}, calculations: {} },
        }
      );

      expect(deliverableId).toBe('deliv-new-123');
    });

    it('should handle unauthenticated user', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: null,
      } as any);

      await expect(
        saveDeliverable('session-123', 'agent-123', {
          type: 'test',
          title: 'Test',
          content: {},
        })
      ).rejects.toThrow('Not authenticated');
    });
  });

  describe('getSessionDeliverables', () => {
    it('should fetch session deliverables', async () => {
      const deliverables = await getSessionDeliverables('session-123');

      expect(Array.isArray(deliverables)).toBe(true);
      expect(deliverables.length).toBeGreaterThan(0);
      expect(deliverables[0]).toHaveProperty('title');
      expect(deliverables[0]).toHaveProperty('validation_status');
    });

    it('should handle errors gracefully', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Database error' },
            })),
          })),
        })),
      } as any);

      const deliverables = await getSessionDeliverables('session-123');

      expect(deliverables).toEqual([]);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should complete full agent workflow', async () => {
      // 1. Start session
      const sessionId = await startAgentSession('agent-123', 'consultation');
      expect(sessionId).toBe('session-123');

      // 2. Invoke agent
      const response = await invokeAgent(
        mockAgent,
        sessionId,
        {
          type: 'beam_design',
          inputs: { span: 6, load: 10 },
        }
      );

      expect(response.status).toMatch(/success|requires_review/);

      // 3. Save deliverable
      const deliverableId = await saveDeliverable(
        sessionId,
        mockAgent.id,
        {
          type: 'structural_calc',
          title: 'Beam Design',
          content: response.output,
        }
      );

      expect(deliverableId).toBeTruthy();

      // 4. Get deliverables
      const deliverables = await getSessionDeliverables(sessionId);
      expect(deliverables.length).toBeGreaterThan(0);
    });
  });
});


