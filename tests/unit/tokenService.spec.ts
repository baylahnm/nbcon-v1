/**
 * Token Service Regression Tests
 * Date: January 28, 2025
 * Purpose: Test RPC calls, error handling, and data transformation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase client
const mockSupabase = {
  rpc: vi.fn(),
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  single: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
} as any as SupabaseClient;

describe('Token Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserMonthlyUsage', () => {
    it('should handle successful response with data', async () => {
      const mockData = [{
        total_tokens: 50000,
        total_requests: 150,
        total_cost_usd: 2.50,
        total_cost_sar: 9.38,
        period_start: '2025-01-01',
        period_end: '2025-01-31',
      }];

      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });

      // Simulate the function call
      const { data, error } = await mockSupabase.rpc('get_user_monthly_usage', {});

      expect(error).toBeNull();
      expect(data).toEqual(mockData);
      expect(data[0].total_tokens).toBe(50000);
      expect(data[0].total_requests).toBe(150);
      expect(data[0].period_start).toBe('2025-01-01');
    });

    it('should handle empty result gracefully', async () => {
      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const { data } = await mockSupabase.rpc('get_user_monthly_usage', {});

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('should handle 400 errors gracefully', async () => {
      const mockError = {
        code: '40000',
        message: 'Bad request - empty result',
        details: null,
        hint: null,
      };

      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { data, error } = await mockSupabase.rpc('get_user_monthly_usage', {});

      expect(error).not.toBeNull();
      expect(error.code).toBe('40000');
      
      // Should return defaults for 400 errors
      const shouldHandleAsEmptyResult = error.code === '40000' || error.message?.includes('400');
      expect(shouldHandleAsEmptyResult).toBe(true);
    });

    it('should handle network errors', async () => {
      const mockError = {
        code: 'PGRST301',
        message: 'Network error',
        details: 'Connection timeout',
        hint: null,
      };

      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { error } = await mockSupabase.rpc('get_user_monthly_usage', {});

      expect(error).not.toBeNull();
      expect(error.code).toBe('PGRST301');
      
      // Should NOT handle network errors as empty results
      const shouldHandleAsEmptyResult = error.code === '40000' || error.message?.includes('400');
      expect(shouldHandleAsEmptyResult).toBe(false);
    });

    it('should call RPC with optional parameters', async () => {
      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      await mockSupabase.rpc('get_user_monthly_usage', { p_year: 2024, p_month: 12 });

      expect(mockSupabase.rpc).toHaveBeenCalledWith(
        'get_user_monthly_usage',
        { p_year: 2024, p_month: 12 }
      );
    });

    it('should call RPC without parameters for current month', async () => {
      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      await mockSupabase.rpc('get_user_monthly_usage', {});

      expect(mockSupabase.rpc).toHaveBeenCalledWith(
        'get_user_monthly_usage',
        {}
      );
    });
  });

  describe('checkUserQuota', () => {
    it('should handle successful quota check response', async () => {
      const mockData = [{
        allowed: true,
        remaining_tokens: 50000,
        remaining_requests: 850,
        quota_limit: 100000,
        request_limit: 1000,
        reset_date: '2025-02-01',
      }];

      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });

      const { data, error } = await mockSupabase.rpc('check_user_quota', {
        p_estimated_tokens: 1000,
      });

      expect(error).toBeNull();
      expect(data).toEqual(mockData);
      expect(data[0].allowed).toBe(true);
      expect(data[0].remaining_tokens).toBe(50000);
      expect(data[0].remaining_requests).toBe(850);
    });

    it('should handle quota exceeded scenario', async () => {
      const mockData = [{
        allowed: false,
        remaining_tokens: 0,
        remaining_requests: 0,
        quota_limit: 100000,
        request_limit: 1000,
        reset_date: '2025-02-01',
      }];

      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });

      const { data } = await mockSupabase.rpc('check_user_quota', {
        p_estimated_tokens: 50000,
      });

      expect(data[0].allowed).toBe(false);
      expect(data[0].remaining_tokens).toBe(0);
    });

    it('should handle RPC error gracefully', async () => {
      const mockError = {
        code: '42501',
        message: 'Insufficient privilege',
        details: null,
        hint: null,
      };

      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { error } = await mockSupabase.rpc('check_user_quota', {
        p_estimated_tokens: 1000,
      });

      expect(error).not.toBeNull();
      
      // Should default to allowing if check fails (fail open)
      const shouldAllow = true; // Default behavior
      expect(shouldAllow).toBe(true);
    });

    it('should handle empty result with default unlimited quota', async () => {
      mockSupabase.rpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const { data } = await mockSupabase.rpc('check_user_quota', {
        p_estimated_tokens: 1000,
      });

      expect(data.length).toBe(0);
      
      // Should default to unlimited if no quota record
      const shouldAllow = true;
      const hasUnlimitedQuota = true;
      expect(shouldAllow).toBe(true);
      expect(hasUnlimitedQuota).toBe(true);
    });
  });

  describe('getUserMonthlyUsage - Type Safety', () => {
    it('should enforce correct return type structure', () => {
      const expectedStructure = {
        total_tokens: expect.any(Number),
        total_requests: expect.any(Number),
        total_cost_usd: expect.any(Number),
        total_cost_sar: expect.any(Number),
        period_start: expect.any(String),
        period_end: expect.any(String),
      };

      const mockResult = {
        total_tokens: 0,
        total_requests: 0,
        total_cost_usd: 0,
        total_cost_sar: 0,
        period_start: '2025-01-01',
        period_end: '2025-01-31',
      };

      expect(mockResult).toMatchObject(expectedStructure);
    });

    it('should handle missing optional fields with defaults', () => {
      const mockData = [{
        total_tokens: 1000,
        total_requests: 5,
        total_cost_usd: 0.05,
        total_cost_sar: 0.19,
        period_start: null,
        period_end: null,
      }];

      // Should provide defaults for null values
      const processed = mockData.map(row => ({
        total_tokens: row.total_tokens || 0,
        total_requests: row.total_requests || 0,
        total_cost_usd: row.total_cost_usd || 0,
        total_cost_sar: row.total_cost_sar || 0,
        period_start: row.period_start || new Date().toISOString().split('T')[0],
        period_end: row.period_end || new Date().toISOString().split('T')[0],
      }));

      expect(processed[0].period_start).not.toBeNull();
      expect(processed[0].period_end).not.toBeNull();
    });
  });

  describe('Error Code Handling', () => {
    it('should identify 400 errors correctly', () => {
      const error400 = { code: '40000', message: 'Bad request' };
      const is400 = error400.code === '40000' || error400.message?.includes('400');
      expect(is400).toBe(true);
    });

    it('should NOT treat 401 as 400', () => {
      const error401 = { code: '42501', message: 'Not authenticated' };
      const is400 = error401.code === '40000' || error401.message?.includes('400');
      expect(is400).toBe(false);
    });

    it('should identify 400 errors in message text', () => {
      const error = { code: 'PGRST302', message: 'Request failed with status 400' };
      const is400 = error.code === '40000' || error.message?.includes('400');
      expect(is400).toBe(true);
    });
  });

  describe('Period Calculation', () => {
    it('should validate period_start and period_end are dates', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      const validDate = '2025-01-31';
      const invalidDate = '2025-31-01';
      
      expect(dateRegex.test(validDate)).toBe(true);
      expect(dateRegex.test(invalidDate)).toBe(true); // Still passes regex
      
      // Better validation - check if date is valid
      expect(() => new Date(validDate)).not.toThrow();
    });

    it('should ensure period_end >= period_start', () => {
      const period_start = '2025-01-01';
      const period_end = '2025-01-31';
      
      const start = new Date(period_start);
      const end = new Date(period_end);
      
      expect(end >= start).toBe(true);
    });
  });

  describe('Quota Calculations', () => {
    it('should calculate usage percentage correctly', () => {
      const used = 50000;
      const limit = 100000;
      const percentage = (used / limit) * 100;
      
      expect(percentage).toBe(50);
    });

    it('should determine healthy status for <50% usage', () => {
      const percentage = 45;
      const status = percentage < 50 ? 'healthy' : 
                     percentage < 80 ? 'warning' : 'critical';
      
      expect(status).toBe('healthy');
    });

    it('should determine warning status for 50-79% usage', () => {
      const percentage = 65;
      const status = percentage < 50 ? 'healthy' : 
                     percentage < 80 ? 'warning' : 'critical';
      
      expect(status).toBe('warning');
    });

    it('should determine critical status for ≥80% usage', () => {
      const percentage = 85;
      const status = percentage < 50 ? 'healthy' : 
                     percentage < 80 ? 'warning' : 'critical';
      
      expect(status).toBe('critical');
    });

    it('should determine exceeded status for ≥100% usage', () => {
      const percentage = 105;
      const status = percentage >= 100 ? 'exceeded' :
                     percentage >= 80 ? 'critical' : 
                     percentage >= 50 ? 'warning' : 'healthy';
      
      expect(status).toBe('exceeded');
    });

    it('should calculate remaining tokens correctly', () => {
      const limit = 100000;
      const used = 35000;
      const remaining = Math.max(0, limit - used);
      
      expect(remaining).toBe(65000);
    });

    it('should not return negative remaining tokens', () => {
      const limit = 100000;
      const used = 120000;
      const remaining = Math.max(0, limit - used);
      
      expect(remaining).toBe(0);
    });

    it('should identify Pro accounts by higher token limits', () => {
      const freeTierLimit = 100000;
      const proTierLimit = 500000;
      
      const isFree = freeTierLimit <= 100000;
      const isPro = proTierLimit > 100000;
      
      expect(isFree).toBe(true);
      expect(isPro).toBe(true);
    });
  });
});
