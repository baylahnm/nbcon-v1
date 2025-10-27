/**
 * Integration Tests: TokenCounter in Dashboard Header
 * 
 * Tests complete integration of token counter display in dashboard
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TokenCounter } from '../../src/shared/components/TokenCounter';

// Mock Supabase
vi.mock('../../src/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@nbcon.org',
            },
          },
          error: null,
        })
      ),
    },
    rpc: vi.fn((funcName: string) => {
      if (funcName === 'get_user_monthly_usage') {
        return Promise.resolve({
          data: [
            {
              total_interactions: 125,
              total_tokens: 45000,
              total_cost_usd: 3.25,
              total_cost_sar: 12.19,
              by_discipline: {
                civil: {
                  interactions: 50,
                  tokens: 20000,
                  cost_usd: 1.50,
                  cost_sar: 5.63,
                },
                electrical: {
                  interactions: 75,
                  tokens: 25000,
                  cost_usd: 1.75,
                  cost_sar: 6.56,
                },
              },
            },
          ],
          error: null,
        });
      }
      return Promise.resolve({ data: null, error: null });
    }),
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: {
                user_id: 'test-user-id',
                monthly_token_quota: 100000,
                monthly_cost_quota_usd: 5.0,
                current_month_tokens: 45000,
                current_month_cost_usd: 3.25,
                quota_reset_date: '2025-02-01',
                allow_overage: false,
              },
              error: null,
            })
          ),
        })),
      })),
    })),
  },
}));

describe('TokenCounter Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render in dashboard header and show token count', async () => {
    render(
      <BrowserRouter>
        <TokenCounter variant="badge" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('45.0K')).toBeInTheDocument();
    });
  });

  it('should format tokens correctly with K suffix', async () => {
    render(
      <BrowserRouter>
        <TokenCounter variant="badge" />
      </BrowserRouter>
    );

    await waitFor(() => {
      const tokenText = screen.getByText('45.0K');
      expect(tokenText).toHaveClass('font-mono');
      expect(tokenText).toHaveClass('tabular-nums');
    });
  });

  it('should show healthy status badge styling', async () => {
    render(
      <BrowserRouter>
        <TokenCounter variant="badge" />
      </BrowserRouter>
    );

    await waitFor(() => {
      const badge = screen.getByText('45.0K').closest('div');
      expect(badge).toHaveClass('bg-primary/10');
      expect(badge).toHaveClass('text-primary');
    });
  });

  it('should include tooltip with full token count', async () => {
    render(
      <BrowserRouter>
        <TokenCounter variant="badge" />
      </BrowserRouter>
    );

    await waitFor(() => {
      const badge = screen.getByText('45.0K').closest('div');
      expect(badge).toHaveAttribute('title', 'AI Tokens used this month: 45,000');
    });
  });

  it('should render Zap icon', async () => {
    const { container } = render(
      <BrowserRouter>
        <TokenCounter variant="badge" />
      </BrowserRouter>
    );

    await waitFor(() => {
      const icon = container.querySelector('.lucide-zap');
      expect(icon).toBeInTheDocument();
    });
  });

  it('should handle quota data fetch errors gracefully', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: null,
              error: { message: 'Table not found' },
            })
          ),
        })),
      })),
    } as any);

    const { container } = render(
      <BrowserRouter>
        <TokenCounter variant="badge" />
      </BrowserRouter>
    );

    // Should still render token count even if quota fetch fails
    await waitFor(() => {
      expect(screen.getByText('45.0K')).toBeInTheDocument();
    });
  });
});

