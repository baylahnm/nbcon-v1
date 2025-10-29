/**
 * StatusCards Component Integration Tests
 * 
 * Tests the StatusCards component rendering and interactions
 * 
 * @created January 28, 2025
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StatusCards } from '@/components/dashboard/advanced/StatusCards';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import * as clientMetrics from '@/lib/dashboard/clientMetrics';

// Mock modules
vi.mock('@/pages/2-auth/others/stores/auth');
vi.mock('@/lib/dashboard/clientMetrics');

const mockedUseAuthStore = vi.mocked(useAuthStore);
const mockedFetchOverviewMetrics = vi.mocked(clientMetrics.fetchOverviewMetrics);

const mockMetrics = {
  activeProjects: {
    count: 5,
    trend: 12,
    chartData: [
      { month: 'Jan', value: 3 },
      { month: 'Feb', value: 4 },
      { month: 'Mar', value: 4 },
      { month: 'Apr', value: 5 },
      { month: 'May', value: 5 },
      { month: 'Jun', value: 5 },
    ],
    breakdown: {
      inProgress: 3,
      planning: 2,
      avgDuration: 8,
      successRate: 94,
    },
  },
  totalEngineers: {
    count: 24,
    trend: 8,
    chartData: [
      { month: 'Jan', value: 18 },
      { month: 'Feb', value: 19 },
      { month: 'Mar', value: 20 },
      { month: 'Apr', value: 22 },
      { month: 'May', value: 23 },
      { month: 'Jun', value: 24 },
    ],
    breakdown: {
      structural: 8,
      civil: 6,
      mechanical: 5,
      electrical: 5,
      avgRating: 4.8,
      avgHourlyRate: 125,
    },
  },
  pendingQuotes: {
    count: 8,
    trend: -5,
    chartData: [
      { month: 'Jan', value: 10 },
      { month: 'Feb', value: 9 },
      { month: 'Mar', value: 9 },
      { month: 'Apr', value: 8 },
      { month: 'May', value: 8 },
      { month: 'Jun', value: 8 },
    ],
    breakdown: {
      awaitingReview: 5,
      underNegotiation: 3,
      avgResponseDays: 2.3,
      avgQuoteAmount: 45000,
    },
  },
  totalSpent: {
    amount: 1245000,
    trend: 15,
    chartData: [
      { month: 'Jan', value: 150000 },
      { month: 'Feb', value: 180000 },
      { month: 'Mar', value: 200000 },
      { month: 'Apr', value: 250000 },
      { month: 'May', value: 220000 },
      { month: 'Jun', value: 245000 },
    ],
    breakdown: {
      q1: 530,
      q2: 715,
      q3: 0,
      q4Projected: 850,
    },
  },
};

describe('StatusCards Component', () => {
  beforeEach(() => {
    // Mock useAuthStore
    mockedUseAuthStore.mockReturnValue({
      user: { id: 'test-user-123', name: 'Test User', role: 'client' },
      isAuthenticated: true,
    });

    // Mock fetchOverviewMetrics
    mockedFetchOverviewMetrics.mockResolvedValue(mockMetrics);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    // Should show loading skeletons
    const loadingCards = screen.getAllByRole('article');
    expect(loadingCards.length).toBeGreaterThan(0);
  });

  it('should render 4 stat cards after loading', async () => {
    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    // Wait for metrics to load
    await waitFor(() => {
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
    });

    // Verify all 4 cards rendered
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Total Engineers')).toBeInTheDocument();
    expect(screen.getByText('Pending Quotes')).toBeInTheDocument();
    expect(screen.getByText('Total Spent (YTD)')).toBeInTheDocument();
  });

  it('should display correct metric values', async () => {
    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Active projects count
    });

    expect(screen.getByText('24')).toBeInTheDocument(); // Total engineers
    expect(screen.getByText('8')).toBeInTheDocument(); // Pending quotes
    expect(screen.getByText(/1,245,000/)).toBeInTheDocument(); // Total spent
  });

  it('should display trend indicators', async () => {
    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('+12%')).toBeInTheDocument(); // Active projects trend
    });

    expect(screen.getByText('+8%')).toBeInTheDocument(); // Engineers trend
    expect(screen.getByText('-5%')).toBeInTheDocument(); // Quotes trend (negative)
    expect(screen.getByText('+15%')).toBeInTheDocument(); // Spending trend
  });

  it('should open expanded modal on card click', async () => {
    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
    });

    // Click on a stat card
    const projectsCard = screen.getByText('Active Projects').closest('div[class*="cursor-pointer"]');
    if (projectsCard) {
      fireEvent.click(projectsCard);

      // Wait for modal to appear
      await waitFor(() => {
        // Should show expanded content
        expect(screen.getByText('6-Month Performance')).toBeInTheDocument();
        expect(screen.getByText('Detailed Breakdown')).toBeInTheDocument();
      });

      // Should show breakdown data
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Planning')).toBeInTheDocument();
    }
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockedFetchOverviewMetrics.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load metrics')).toBeInTheDocument();
    });
  });

  it('should handle no user gracefully', async () => {
    // Mock no user
    mockedUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <StatusCards />
      </BrowserRouter>
    );

    // Wait for no data state
    await waitFor(() => {
      expect(screen.getByText('No metrics available')).toBeInTheDocument();
    });
  });
});

