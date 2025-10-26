/**
 * Unit Tests: Token Service
 * Phase 3: Token Tracking & Monetization
 * 
 * Tests token logging, cost calculation, and quota management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  logTokenUsage,
  calculateCost,
  checkUserQuota,
  getUserMonthlyUsage,
  getQuotaStatus,
  formatCost,
  estimateRequestCost,
  getCostByDiscipline,
} from '../../src/shared/services/tokenService';

// Mock Supabase
vi.mock('../../src/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              monthly_token_quota: 100000,
              current_month_tokens: 45000,
              quota_reset_date: '2025-02-01',
              allow_overage: false,
            },
            error: null,
          })),
          gte: vi.fn(() => ({
            lte: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      })),
    })),
    rpc: vi.fn((name: string, params?: any) => {
      if (name === 'check_user_quota') {
        return Promise.resolve({ data: true, error: null });
      }
      if (name === 'get_user_monthly_usage') {
        return Promise.resolve({
          data: [{
            total_interactions: 120,
            total_tokens: 45000,
            total_cost_usd: 1.35,
            total_cost_sar: 5.0625,
            by_discipline: {
              civil: { interactions: 50, tokens: 20000, cost_usd: 0.60 },
              structural: { interactions: 40, tokens: 15000, cost_usd: 0.45 },
              electrical: { interactions: 30, tokens: 10000, cost_usd: 0.30 },
            },
            by_workflow: {
              boq_generation: { interactions: 30, tokens: 12000, avg_cost: 0.012 },
              beam_design: { interactions: 25, tokens: 10000, avg_cost: 0.010 },
            },
          }],
          error: null,
        });
      }
      return Promise.resolve({ data: null, error: null });
    }),
  },
}));

describe('Token Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateCost', () => {
    it('should calculate cost correctly for gpt-4o-mini', () => {
      const cost = calculateCost(1000, 500, 'gpt-4o-mini');
      
      // Input: 1000 tokens × $0.15/1M = $0.00015
      // Output: 500 tokens × $0.60/1M = $0.00030
      // Total: $0.00045
      expect(cost).toBeCloseTo(0.00045, 5);
    });

    it('should calculate cost correctly for gpt-4o', () => {
      const cost = calculateCost(1000, 500, 'gpt-4o');
      
      // Input: 1000 tokens × $2.50/1M = $0.0025
      // Output: 500 tokens × $10.00/1M = $0.0050
      // Total: $0.0075
      expect(cost).toBeCloseTo(0.0075, 4);
    });

    it('should handle zero tokens', () => {
      const cost = calculateCost(0, 0, 'gpt-4o-mini');
      expect(cost).toBe(0);
    });

    it('should handle large token counts', () => {
      const cost = calculateCost(100000, 50000, 'gpt-4o');
      // Should not throw, should calculate correctly
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeCloseTo(0.75, 2);
    });
  });

  describe('formatCost', () => {
    it('should format USD correctly', () => {
      expect(formatCost(0.00045, 'USD')).toBe('$0.0005 USD');
    });

    it('should format SAR correctly', () => {
      expect(formatCost(1.00, 'SAR')).toBe('3.75 SAR');
    });

    it('should default to USD', () => {
      expect(formatCost(0.5)).toBe('$0.5000 USD');
    });
  });

  describe('estimateRequestCost', () => {
    it('should estimate cost for typical message', () => {
      const message = 'Calculate the moment for a 6m beam with 10 kN/m load';
      const estimate = estimateRequestCost(message.length, 'gpt-4o-mini', true);

      expect(estimate.estimated_prompt_tokens).toBeGreaterThan(0);
      expect(estimate.estimated_completion_tokens).toBeGreaterThan(0);
      expect(estimate.estimated_cost_usd).toBeGreaterThan(0);
      expect(estimate.estimated_cost_sar).toBeGreaterThan(0);
    });

    it('should estimate higher cost with context', () => {
      const message = 'Follow up question';
      const withContext = estimateRequestCost(message.length, 'gpt-4o-mini', true);
      const withoutContext = estimateRequestCost(message.length, 'gpt-4o-mini', false);

      expect(withContext.estimated_total_tokens).toBeGreaterThan(withoutContext.estimated_total_tokens);
    });

    it('should estimate higher cost for gpt-4o vs gpt-4o-mini', () => {
      const message = 'Test message';
      const gpt4o = estimateRequestCost(message.length, 'gpt-4o');
      const gpt4oMini = estimateRequestCost(message.length, 'gpt-4o-mini');

      expect(gpt4o.estimated_cost_usd).toBeGreaterThan(gpt4oMini.estimated_cost_usd);
    });
  });

  describe('logTokenUsage', () => {
    it('should log token usage successfully', async () => {
      const params = {
        agent_id: 'agent-123',
        session_id: 'session-456',
        discipline: 'civil',
        workflow_id: 'boq_generation',
        tokens_prompt: 1000,
        tokens_completion: 500,
        model_used: 'gpt-4o-mini' as const,
      };

      await expect(logTokenUsage(params)).resolves.not.toThrow();
    });

    it('should handle missing user gracefully', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: null,
      } as any);

      const params = {
        agent_id: 'agent-123',
        session_id: 'session-456',
        discipline: 'civil',
        workflow_id: 'test',
        tokens_prompt: 1000,
        tokens_completion: 500,
        model_used: 'gpt-4o-mini' as const,
      };

      // Should not throw even without user
      await expect(logTokenUsage(params)).resolves.not.toThrow();
    });
  });

  describe('checkUserQuota', () => {
    it('should return allowed when under quota', async () => {
      const result = await checkUserQuota(1000);

      expect(result.allowed).toBe(true);
      expect(result.remaining_tokens).toBeGreaterThan(0);
    });

    it('should handle quota check errors gracefully', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: null,
        error: { message: 'RPC error' },
      } as any);

      const result = await checkUserQuota(1000);

      // Should default to allowing (fail open)
      expect(result.allowed).toBe(true);
    });
  });

  describe('getUserMonthlyUsage', () => {
    it('should return monthly usage data', async () => {
      const usage = await getUserMonthlyUsage();

      expect(usage).not.toBeNull();
      expect(usage?.total_interactions).toBe(120);
      expect(usage?.total_tokens).toBe(45000);
      expect(usage?.total_cost_usd).toBe(1.35);
      expect(usage?.by_discipline).toHaveProperty('civil');
    });

    it('should handle empty data gracefully', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: [],
        error: null,
      } as any);

      const usage = await getUserMonthlyUsage();

      expect(usage).not.toBeNull();
      expect(usage?.total_interactions).toBe(0);
      expect(usage?.total_tokens).toBe(0);
    });
  });

  describe('getQuotaStatus', () => {
    it('should return quota status with correct percentage', async () => {
      const status = await getQuotaStatus();

      expect(status).not.toBeNull();
      expect(status?.used).toBe(45000);
      expect(status?.limit).toBe(100000);
      expect(status?.remaining).toBe(55000);
      expect(status?.percentage).toBe(45);
      expect(status?.status).toBe('healthy');
    });

    it('should detect warning status at 75%+', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                monthly_token_quota: 100000,
                current_month_tokens: 80000,
                quota_reset_date: '2025-02-01',
                allow_overage: false,
              },
              error: null,
            })),
          })),
        })),
      } as any);

      const status = await getQuotaStatus();

      expect(status?.status).toBe('warning');
      expect(status?.percentage).toBe(80);
    });

    it('should detect critical status at 90%+', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                monthly_token_quota: 100000,
                current_month_tokens: 95000,
                quota_reset_date: '2025-02-01',
                allow_overage: false,
              },
              error: null,
            })),
          })),
        })),
      } as any);

      const status = await getQuotaStatus();

      expect(status?.status).toBe('critical');
    });

    it('should detect exceeded status at 100%+', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                monthly_token_quota: 100000,
                current_month_tokens: 105000,
                quota_reset_date: '2025-02-01',
                allow_overage: true,
              },
              error: null,
            })),
          })),
        })),
      } as any);

      const status = await getQuotaStatus();

      expect(status?.status).toBe('exceeded');
      expect(status?.remaining).toBe(0);
    });
  });

  describe('getCostByDiscipline', () => {
    it('should aggregate costs by discipline', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({
              lte: vi.fn(() => Promise.resolve({
                data: [
                  { discipline: 'civil', tokens_total: 1000, cost_usd: '0.30' },
                  { discipline: 'civil', tokens_total: 1500, cost_usd: '0.45' },
                  { discipline: 'structural', tokens_total: 2000, cost_usd: '0.60' },
                ],
                error: null,
              })),
            })),
          })),
        })),
      } as any);

      const breakdown = await getCostByDiscipline();

      expect(breakdown.civil).toBeDefined();
      expect(breakdown.civil.tokens).toBe(2500);
      expect(breakdown.civil.cost_usd).toBeCloseTo(0.75, 2);
      expect(breakdown.civil.interactions).toBe(2);

      expect(breakdown.structural).toBeDefined();
      expect(breakdown.structural.tokens).toBe(2000);
      expect(breakdown.structural.interactions).toBe(1);
    });

    it('should handle empty data', async () => {
      const { supabase } = await import('../../src/shared/supabase/client');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({
              lte: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        })),
      } as any);

      const breakdown = await getCostByDiscipline();

      expect(breakdown).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined inputs gracefully', () => {
      expect(() => calculateCost(0, 0, 'gpt-4o-mini')).not.toThrow();
      expect(formatCost(0)).toBe('$0.0000 USD');
    });

    it('should handle very large numbers', () => {
      const cost = calculateCost(1000000, 500000, 'gpt-4o');
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(10000);
    });

    it('should handle boundary conditions', () => {
      const minCost = calculateCost(1, 1, 'gpt-4o-mini');
      expect(minCost).toBeGreaterThan(0);
      expect(minCost).toBeLessThan(0.001);
    });
  });
});


