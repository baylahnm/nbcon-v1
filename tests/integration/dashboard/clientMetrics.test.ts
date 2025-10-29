/**
 * Client Metrics API Integration Tests
 * 
 * Tests the fetchOverviewMetrics function with mocked Supabase responses
 * 
 * @created January 28, 2025
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { fetchOverviewMetrics, clearAllMetricsCache } from '@/lib/dashboard/clientMetrics';
import { supabase } from '@/shared/supabase/client';

// Mock Supabase client
vi.mock('@/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

type QueryResult<T> = {
  count: number | null;
  data: T[] | null;
  error: { message: string } | null;
};

type SupabaseQueryMock = {
  select: Mock;
  eq: Mock;
  in: Mock;
  gte: Mock;
  lte: Mock;
  order: Mock;
  limit: Mock;
  then: Mock<[callback: (response: QueryResult<unknown>) => unknown], unknown>;
};

type SupabaseClientMock = {
  auth: {
    getSession: Mock;
  };
  from: Mock<[table: string], SupabaseQueryMock>;
};

interface GanttProjectRecord {
  id: string;
  project_name?: string | null;
  project_type?: string | null;
  location?: string | null;
  total_budget?: number | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ProfileRecord {
  id: string;
  role?: string | null;
  created_at?: string | null;
}

interface EngineerProfileRecord {
  id: string;
  specializations?: string[] | null;
}

interface JobRecord {
  id: string;
  status?: string | null;
  client_id?: string | null;
  created_at?: string | null;
}

interface PaymentRecord {
  id: string;
  amount?: number | null;
  status?: string | null;
  created_at?: string | null;
}

interface ClientProjectRecord {
  id: string;
  project_name?: string | null;
  title?: string | null;
  total_tasks?: number | null;
  budget?: number | null;
  progress?: number | null;
  status?: string | null;
  description?: string | null;
  project_type?: string | null;
  location?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const supabaseMock = supabase as unknown as SupabaseClientMock;

const createQueryMock = <T>(response: QueryResult<T>): SupabaseQueryMock => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn((callback: (res: QueryResult<T>) => unknown) => callback(response)),
});

describe('Client Metrics API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAllMetricsCache();

    // Default auth session mock
    supabaseMock.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-123' },
          access_token: 'test-token',
        },
      },
      error: null,
    });
  });

  describe('fetchOverviewMetrics', () => {
    it('should fetch and aggregate metrics from multiple tables', async () => {
      // Mock gantt_projects query
      const mockProjects: GanttProjectRecord[] = [
        { id: '1', status: 'active', created_at: new Date().toISOString() },
        { id: '2', status: 'planning', created_at: new Date().toISOString() },
      ];

      // Mock profiles query for engineers
      const mockProfiles: ProfileRecord[] = [
        { id: '1', role: 'engineer', created_at: new Date().toISOString() },
        { id: '2', role: 'engineer', created_at: new Date().toISOString() },
      ];

      // Mock engineer_profiles
      const mockEngineerProfiles: EngineerProfileRecord[] = [
        { id: '1', specializations: ['structural', 'civil'] },
        { id: '2', specializations: ['electrical'] },
      ];

      // Mock jobs (for quotes)
      const mockJobs: JobRecord[] = [
        { id: '1', status: 'open', client_id: 'test-user-123', created_at: new Date().toISOString() },
      ];

      // Mock payments
      const mockPayments: PaymentRecord[] = [
        { id: '1', amount: 50000, status: 'succeeded', created_at: new Date().toISOString() },
      ];

      // Setup mocks
      supabaseMock.from.mockImplementation((table: string) => {
        if (table === 'gantt_projects') {
          return createQueryMock<GanttProjectRecord>({
            count: 2,
            data: mockProjects,
            error: null,
          });
        }
        if (table === 'profiles') {
          return createQueryMock<ProfileRecord>({
            count: 2,
            data: mockProfiles,
            error: null,
          });
        }
        if (table === 'engineer_profiles') {
          const query = createQueryMock<EngineerProfileRecord>({
            count: mockEngineerProfiles.length,
            data: mockEngineerProfiles,
            error: null,
          });
          query.select.mockResolvedValue({ data: mockEngineerProfiles, error: null });
          return query;
        }
        if (table === 'jobs') {
          return createQueryMock<JobRecord>({
            count: mockJobs.length,
            data: mockJobs,
            error: null,
          });
        }
        if (table === 'payments') {
          return createQueryMock<PaymentRecord>({
            count: mockPayments.length,
            data: mockPayments,
            error: null,
          });
        }
        return createQueryMock<unknown>({ count: 0, data: [], error: null });
      });

      // Execute
      const metrics = await fetchOverviewMetrics('test-user-123');

      // Verify structure
      expect(metrics).toHaveProperty('activeProjects');
      expect(metrics).toHaveProperty('totalEngineers');
      expect(metrics).toHaveProperty('pendingQuotes');
      expect(metrics).toHaveProperty('totalSpent');

      // Verify data
      expect(metrics.activeProjects.count).toBe(2);
      expect(metrics.totalEngineers.count).toBe(2);
      expect(metrics.pendingQuotes.count).toBe(1);
      expect(metrics.totalSpent.amount).toBe(50000);

      // Verify chart data
      expect(metrics.activeProjects.chartData).toHaveLength(6);
      expect(metrics.activeProjects.chartData[0]).toHaveProperty('month');
      expect(metrics.activeProjects.chartData[0]).toHaveProperty('value');
    });

    it('should cache metrics for 5 minutes', async () => {
      // Setup mocks
      supabaseMock.from.mockImplementation(() =>
        createQueryMock<unknown>({ count: 0, data: [], error: null }),
      );

      // First call
      await fetchOverviewMetrics('test-user-123');
      const firstCallCount = vi.mocked(supabaseMock.from).mock.calls.length;

      // Second call (should use cache)
      await fetchOverviewMetrics('test-user-123');
      const secondCallCount = vi.mocked(supabaseMock.from).mock.calls.length;

      // Should not have made additional database calls
      expect(secondCallCount).toBe(firstCallCount);
    });

    it('should handle authentication errors gracefully', async () => {
      // Mock no session
      supabaseMock.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      // Should throw authentication error
      await expect(fetchOverviewMetrics('test-user-123')).rejects.toThrow('Not authenticated');
    });

    it('should fallback to client_projects if gantt_projects fails', async () => {
      // Mock gantt_projects error
      supabaseMock.from.mockImplementation((table: string) => {
        if (table === 'gantt_projects') {
          return createQueryMock<GanttProjectRecord>({
            count: null,
            data: null,
            error: { message: 'Table not found' },
          });
        }
        if (table === 'client_projects') {
          return createQueryMock<ClientProjectRecord>({
            count: 3,
            data: [],
            error: null,
          });
        }
        // Mock other tables with empty data
        return createQueryMock<unknown>({ count: 0, data: [], error: null });
      });

      const metrics = await fetchOverviewMetrics('test-user-123');

      // Should have fallback data
      expect(metrics.activeProjects.count).toBe(3);
    });

    it('should calculate trends correctly', async () => {
      const currentMonth = new Date();
      const lastMonth = new Date(currentMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const mockProjects = [
        { id: '1', status: 'active', created_at: currentMonth.toISOString() },
        { id: '2', status: 'active', created_at: currentMonth.toISOString() },
        { id: '3', status: 'active', created_at: lastMonth.toISOString() },
      ];

      supabaseMock.from.mockImplementation((table: string) => {
        if (table === 'gantt_projects') {
          return createQueryMock<GanttProjectRecord>({
            count: 2,
            data: mockProjects,
            error: null,
          });
        }
        return createQueryMock<unknown>({ count: 0, data: [], error: null });
      });

      const metrics = await fetchOverviewMetrics('test-user-123');

      // Trend should show increase from 1 to 2 projects = +100%
      expect(metrics.activeProjects.trend).toBeGreaterThan(0);
    });
  });
});

