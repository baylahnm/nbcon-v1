/**
 * Unit Tests: TokenCounter Component
 * Phase 3: Token Display in UI
 * 
 * Tests token counter rendering, formatting, and quota status display
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TokenCounter } from '../../src/shared/components/TokenCounter';
import * as tokenService from '../../src/shared/services/tokenService';

// Mock token service
vi.mock('../../src/shared/services/tokenService', () => ({
  getUserMonthlyUsage: vi.fn(),
  getQuotaStatus: vi.fn(),
}));

describe('TokenCounter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Badge Variant (Header Display)', () => {
    it('should not render when loading', () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockImplementation(
        () => new Promise(() => {}) // Never resolves (loading state)
      );

      const { container } = render(<TokenCounter variant="badge" />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when token count is zero', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 0,
        total_tokens: 0,
        total_cost_usd: 0,
        total_cost_sar: 0,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 0,
        limit: 100000,
        remaining: 100000,
        percentage: 0,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      const { container } = render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it('should render token count under 1000', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 15,
        total_tokens: 450,
        total_cost_usd: 0.45,
        total_cost_sar: 1.69,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 450,
        limit: 100000,
        remaining: 99550,
        percentage: 0.45,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        expect(screen.getByText('450')).toBeInTheDocument();
      });
    });

    it('should render token count in K format for >= 1000', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 125,
        total_tokens: 15420,
        total_cost_usd: 12.50,
        total_cost_sar: 46.88,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 15420,
        limit: 100000,
        remaining: 84580,
        percentage: 15.42,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        expect(screen.getByText('15.4K')).toBeInTheDocument();
      });
    });

    it('should show healthy status (primary color) when under 80% quota', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 50,
        total_tokens: 50000,
        total_cost_usd: 2.50,
        total_cost_sar: 9.38,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 50000,
        limit: 100000,
        percentage: 50,
        remaining: 50000,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        const badge = screen.getByText('50.0K').closest('div');
        expect(badge).toHaveClass('bg-primary/10');
        expect(badge).toHaveClass('text-primary');
      });
    });

    it('should show warning status (blue) when 80-90% quota', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 200,
        total_tokens: 85000,
        total_cost_usd: 4.25,
        total_cost_sar: 15.94,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 85000,
        limit: 100000,
        remaining: 15000,
        percentage: 85,
        resetDate: '2025-02-01',
        status: 'warning',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        const badge = screen.getByText('85.0K').closest('div');
        expect(badge).toHaveClass('bg-blue-500/10');
        expect(badge).toHaveClass('text-blue-600');
      });
    });

    it('should show critical status (amber) when 90-100% quota', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 300,
        total_tokens: 95000,
        total_cost_usd: 4.75,
        total_cost_sar: 17.81,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 95000,
        limit: 100000,
        remaining: 5000,
        percentage: 95,
        resetDate: '2025-02-01',
        status: 'critical',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        const badge = screen.getByText('95.0K').closest('div');
        expect(badge).toHaveClass('bg-amber-500/10');
        expect(badge).toHaveClass('text-amber-600');
      });
    });

    it('should show exceeded status (red) when over 100% quota', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 400,
        total_tokens: 125000,
        total_cost_usd: 6.25,
        total_cost_sar: 23.44,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 125000,
        limit: 100000,
        remaining: -25000,
        percentage: 125,
        resetDate: '2025-02-01',
        status: 'exceeded',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        const badge = screen.getByText('125.0K').closest('div');
        expect(badge).toHaveClass('bg-red-500/10');
        expect(badge).toHaveClass('text-red-600');
      });
    });

    it('should have tooltip with full token count', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 50,
        total_tokens: 15420,
        total_cost_usd: 2.50,
        total_cost_sar: 9.38,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 15420,
        limit: 100000,
        remaining: 84580,
        percentage: 15.42,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        const badge = screen.getByText('15.4K').closest('div');
        expect(badge).toHaveAttribute('title', 'AI Tokens used this month: 15,420');
      });
    });
  });

  describe('Full Variant (Dropdown/Profile Display)', () => {
    it('should render full stats with icon and label', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 50,
        total_tokens: 25000,
        total_cost_usd: 2.50,
        total_cost_sar: 9.38,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 25000,
        limit: 100000,
        remaining: 75000,
        percentage: 25,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      render(<TokenCounter variant="full" />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Tokens (Month)')).toBeInTheDocument();
        expect(screen.getByText('25,000')).toBeInTheDocument();
      });
    });

    it('should show quota status badge when not healthy', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 200,
        total_tokens: 95000,
        total_cost_usd: 4.75,
        total_cost_sar: 17.81,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 95000,
        limit: 100000,
        remaining: 5000,
        percentage: 95,
        resetDate: '2025-02-01',
        status: 'critical',
      });

      render(<TokenCounter variant="full" />);
      
      await waitFor(() => {
        expect(screen.getByText('Near Limit')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle getUserMonthlyUsage error gracefully', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockRejectedValue(new Error('RPC failed'));
      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 0,
        limit: 100000,
        remaining: 100000,
        percentage: 0,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      const { container } = render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        expect(container.firstChild).toBeNull(); // Should not render on error
      });
    });

    it('should handle null usage data gracefully', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue(null);
      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue(null);

      const { container } = render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Auto-refresh', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should refresh data every 30 seconds', async () => {
      vi.mocked(tokenService.getUserMonthlyUsage).mockResolvedValue({
        total_interactions: 5,
        total_tokens: 1000,
        total_cost_usd: 0.10,
        total_cost_sar: 0.38,
        by_discipline: {},
        by_workflow: {},
      });

      vi.mocked(tokenService.getQuotaStatus).mockResolvedValue({
        used: 1000,
        limit: 100000,
        remaining: 99000,
        percentage: 1,
        resetDate: '2025-02-01',
        status: 'healthy',
      });

      render(<TokenCounter variant="badge" />);
      
      await waitFor(() => {
        expect(screen.getByText('1.0K')).toBeInTheDocument();
      });

      // Initial load
      expect(tokenService.getUserMonthlyUsage).toHaveBeenCalledTimes(1);

      // Advance 30 seconds
      vi.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(tokenService.getUserMonthlyUsage).toHaveBeenCalledTimes(2);
      });

      // Advance another 30 seconds
      vi.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(tokenService.getUserMonthlyUsage).toHaveBeenCalledTimes(3);
      });
    });
  });
});

