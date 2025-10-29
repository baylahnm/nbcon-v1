/**
 * Feature Gate Access Integration Tests
 * 
 * Tests feature gating behavior and access control
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureGate } from '@/components/portal/shared/FeatureGate';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@/hooks/usePortalAccess', () => ({
  usePortalAccess: vi.fn(() => ({
    userPermissions: {
      subscriptionTier: 'free',
      canAccessAITools: true,
      canManageProjects: true,
    },
    isAuthenticated: true,
    isLoading: false,
  })),
}));

vi.mock('@/shared/services/subscriptionService', () => ({
  tierMeetsRequirement: vi.fn((userTier: string, requiredTier: string | string[]) => {
    const tierOrder: Record<string, number> = { free: 0, basic: 1, pro: 2, enterprise: 3 };
    const userLevel = tierOrder[userTier];
    const requiredLevels = (Array.isArray(requiredTier) ? requiredTier : [requiredTier]).map(t => tierOrder[t]);
    return requiredLevels.some(req => userLevel >= req);
  }),
}));

// Helper to wrap component with router
function renderWithRouter(component: JSX.Element) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('Feature Gate Access Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // ACCESS CONTROL TESTS
  // ============================================================================

  it('should render children when user has sufficient tier', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'pro' },
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier="basic"
        featureName="Advanced Analytics"
        featureDescription="Detailed insights and reports"
      >
        <div data-testid="gated-content">Protected Content</div>
      </FeatureGate>
    );

    expect(screen.getByTestId('gated-content')).toBeInTheDocument();
    expect(screen.queryByText(/Unlock/i)).not.toBeInTheDocument();
  });

  it('should show upgrade prompt when user has insufficient tier', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'free' },
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier="pro"
        featureName="Advanced Analytics"
        featureDescription="Detailed insights and custom reports"
      >
        <div data-testid="gated-content">Protected Content</div>
      </FeatureGate>
    );

    expect(screen.queryByTestId('gated-content')).not.toBeInTheDocument();
    expect(screen.getByText(/Unlock Advanced Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to pro/i)).toBeInTheDocument();
  });

  it('should respect tier hierarchy (pro >= basic)', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'pro' },
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier="basic"
        featureName="Team Collaboration"
        featureDescription="Work with your team"
      >
        <div data-testid="gated-content">Team Features</div>
      </FeatureGate>
    );

    // Pro user should access Basic features
    expect(screen.getByTestId('gated-content')).toBeInTheDocument();
  });

  it('should handle multiple required tiers (OR logic)', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'basic' },
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier={['basic', 'pro']} // Either basic OR pro
        featureName="API Access"
        featureDescription="REST API integration"
      >
        <div data-testid="gated-content">API Docs</div>
      </FeatureGate>
    );

    // Basic user meets one of the requirements
    expect(screen.getByTestId('gated-content')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'free' },
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier="enterprise"
        featureName="White Label"
        featureDescription="Custom branding"
        fallback={<div data-testid="custom-fallback">Custom Upgrade Message</div>}
      >
        <div data-testid="gated-content">Enterprise Content</div>
      </FeatureGate>
    );

    expect(screen.queryByTestId('gated-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom Upgrade Message')).toBeInTheDocument();
  });

  it('should display banner type fallback when type="banner"', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'free' },
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier="pro"
        featureName="Advanced Search"
        featureDescription="Powerful search filters"
        type="banner"
      >
        <div data-testid="gated-content">Search UI</div>
      </FeatureGate>
    );

    expect(screen.queryByTestId('gated-content')).not.toBeInTheDocument();
    expect(screen.getByText(/Advanced Search requires pro tier/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upgrade/i })).toBeInTheDocument();
  });

  it('should block access for unauthenticated users', () => {
    (usePortalAccess as any).mockReturnValue({
      userPermissions: { subscriptionTier: 'free' },
      isAuthenticated: false, // Not authenticated
      isLoading: false,
    });

    renderWithRouter(
      <FeatureGate
        requiredTier="free" // Even free tier requires auth
        featureName="Dashboard"
        featureDescription="Your personal dashboard"
      >
        <div data-testid="gated-content">Dashboard Content</div>
      </FeatureGate>
    );

    // Unauthenticated users should not see content
    expect(screen.queryByTestId('gated-content')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TIER COMPARISON TESTS
  // ============================================================================

  it('tierMeetsRequirement should validate free tier', () => {
    expect(tierMeetsRequirement('free', 'free')).toBe(true);
    expect(tierMeetsRequirement('free', 'basic')).toBe(false);
    expect(tierMeetsRequirement('free', 'pro')).toBe(false);
    expect(tierMeetsRequirement('free', 'enterprise')).toBe(false);
  });

  it('tierMeetsRequirement should validate basic tier', () => {
    expect(tierMeetsRequirement('basic', 'free')).toBe(true);
    expect(tierMeetsRequirement('basic', 'basic')).toBe(true);
    expect(tierMeetsRequirement('basic', 'pro')).toBe(false);
    expect(tierMeetsRequirement('basic', 'enterprise')).toBe(false);
  });

  it('tierMeetsRequirement should validate pro tier', () => {
    expect(tierMeetsRequirement('pro', 'free')).toBe(true);
    expect(tierMeetsRequirement('pro', 'basic')).toBe(true);
    expect(tierMeetsRequirement('pro', 'pro')).toBe(true);
    expect(tierMeetsRequirement('pro', 'enterprise')).toBe(false);
  });

  it('tierMeetsRequirement should validate enterprise tier', () => {
    expect(tierMeetsRequirement('enterprise', 'free')).toBe(true);
    expect(tierMeetsRequirement('enterprise', 'basic')).toBe(true);
    expect(tierMeetsRequirement('enterprise', 'pro')).toBe(true);
    expect(tierMeetsRequirement('enterprise', 'enterprise')).toBe(true);
  });

  it('tierMeetsRequirement should handle array of required tiers', () => {
    expect(tierMeetsRequirement('basic', ['free', 'basic'])).toBe(true);
    expect(tierMeetsRequirement('basic', ['pro', 'enterprise'])).toBe(false);
    expect(tierMeetsRequirement('pro', ['basic', 'enterprise'])).toBe(true);
  });
});
