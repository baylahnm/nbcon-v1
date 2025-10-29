/**
 * Token Widget Tests
 * 
 * Unit tests for AI token usage widget rendering
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { TierAwareAppSidebar } from '../../src/components/navigation/TierAwareAppSidebar';

// Mock hooks
vi.mock('@/hooks/usePortalAccess', () => ({
  usePortalAccess: vi.fn(() => ({
    userPermissions: {
      subscriptionTier: 'pro',
      canAccessAITools: true,
      canManageProjects: true,
    },
    isAuthenticated: true,
    isLoading: false,
  })),
}));

vi.mock('@/pages/2-auth/others/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    profile: { role: 'client', full_name: 'Test User', email: 'test@example.com' },
    signOut: vi.fn(),
    user: { id: 'test-user-id' },
  })),
}));

// Mock usePortalCredits with different scenarios
const mockUsePortalCredits = vi.fn();

vi.mock('@/hooks/usePortalCredits', () => ({
  usePortalCredits: () => mockUsePortalCredits(),
}));

// Helper
function renderWithRouter(component: JSX.Element) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

// ============================================================================
// TOKEN WIDGET RENDERING TESTS
// ============================================================================

describe('AI Token Widget Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render token widget when tokensLimit > 0', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 12500,
      tokensLimit: 50000,
      tokensRemaining: 37500,
      usagePercentage: 25,
      status: 'healthy',
      statusColor: 'text-emerald-500',
      isLoading: false,
      error: null,
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      expect(screen.getByTestId('credits-widget')).toBeInTheDocument();
      expect(screen.getByText('AI Tokens')).toBeInTheDocument();
    });
  });

  it('should not render token widget when tokensLimit = 0', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 0,
      tokensLimit: 0,
      tokensRemaining: 0,
      usagePercentage: 0,
      status: 'healthy',
      statusColor: 'text-emerald-500',
      isLoading: false,
      error: null,
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      expect(screen.queryByTestId('credits-widget')).not.toBeInTheDocument();
      expect(screen.queryByText('AI Tokens')).not.toBeInTheDocument();
    });
  });

  it('should not render token widget when loading', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 0,
      tokensLimit: 0,
      tokensRemaining: 0,
      usagePercentage: 0,
      status: 'healthy',
      statusColor: 'text-emerald-500',
      isLoading: true,
      error: null,
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      expect(screen.queryByTestId('credits-widget')).not.toBeInTheDocument();
    });
  });

  it('should display correct usage percentage', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 40000,
      tokensLimit: 50000,
      tokensRemaining: 10000,
      usagePercentage: 80,
      status: 'warning',
      statusColor: 'text-amber-500',
      isLoading: false,
      error: null,
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      expect(screen.getByTestId('credits-percentage')).toBeInTheDocument();
      expect(screen.getByText('40,000 / 50,000 tokens')).toBeInTheDocument();
      expect(screen.getByText('80% used')).toBeInTheDocument();
    });
  });

  it('should show critical status when usage >= 90%', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 45000,
      tokensLimit: 50000,
      tokensRemaining: 5000,
      usagePercentage: 90,
      status: 'critical',
      statusColor: 'text-rose-500',
      isLoading: false,
      error: null,
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      const widget = screen.getByTestId('credits-widget');
      expect(widget).toHaveClass('text-rose-500');
    });
  });

  it('should show exceeded status when usage >= 100%', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 50000,
      tokensLimit: 50000,
      tokensRemaining: 0,
      usagePercentage: 100,
      status: 'exceeded',
      statusColor: 'text-rose-500',
      isLoading: false,
      error: null,
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      const widget = screen.getByTestId('credits-widget');
      expect(widget).toHaveClass('text-rose-500');
    });
  });

  it('should handle error state gracefully', async () => {
    mockUsePortalCredits.mockReturnValue({
      tokensUsed: 0,
      tokensLimit: 0,
      tokensRemaining: 0,
      usagePercentage: 0,
      status: 'healthy',
      statusColor: 'text-emerald-500',
      isLoading: false,
      error: 'Failed to load usage data',
    });

    renderWithRouter(<TierAwareAppSidebar />);

    await waitFor(() => {
      expect(screen.queryByTestId('credits-widget')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// MOCK DATA VALIDATION TESTS
// ============================================================================

describe('Mock Data Validation', () => {
  it('should validate mock quota data structure', () => {
    const mockData = {
      used: 12500,
      limit: 50000,
      remaining: 37500,
      percentage: 25,
      resetDate: '2025-11-28T00:00:00.000Z',
      status: 'healthy' as const,
    };

    expect(mockData.used).toBeGreaterThan(0);
    expect(mockData.limit).toBeGreaterThan(0);
    expect(mockData.remaining).toBeGreaterThan(0);
    expect(mockData.percentage).toBeGreaterThanOrEqual(0);
    expect(mockData.percentage).toBeLessThanOrEqual(100);
    expect(['healthy', 'warning', 'critical', 'exceeded']).toContain(mockData.status);
  });

  it('should validate mock monthly usage structure', () => {
    const mockUsage = {
      total_tokens: 12500,
      total_requests: 45,
      total_cost_usd: 0.15,
      total_cost_sar: 0.56,
      period_start: '2025-10-01',
      period_end: '2025-10-31',
    };

    expect(mockUsage.total_tokens).toBeGreaterThan(0);
    expect(mockUsage.total_requests).toBeGreaterThan(0);
    expect(mockUsage.total_cost_usd).toBeGreaterThan(0);
    expect(mockUsage.total_cost_sar).toBeGreaterThan(0);
    expect(mockUsage.period_start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(mockUsage.period_end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

