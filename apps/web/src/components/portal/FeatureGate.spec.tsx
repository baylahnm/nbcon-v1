/**
 * FeatureGate Component - Unit Tests
 * 
 * Phase D: Testing & Documentation
 * Tests for tier-based feature gating component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureGate, useFeatureLocked, useFeatureUnlocked } from './FeatureGate';
import { createMockUsePortalAccess } from '@/tests/setup/vitest.setup';

// Mock usePortalAccess hook
vi.mock('@/hooks/usePortalAccess', () => ({
  usePortalAccess: vi.fn(() => ({
    subscriptionTier: 'free' as const,
    isAdmin: false,
    canAccessTier: vi.fn((tier: string) => {
      const hierarchy = { free: 0, basic: 1, pro: 2, enterprise: 3 };
      const currentTier = 'free';
      return hierarchy[currentTier] >= hierarchy[tier];
    }),
    isAuthenticated: true,
    isLoading: false,
  })),
}));

describe('FeatureGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('access granted scenarios', () => {
    it('should render children when user tier meets requirement', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('pro', false)()
      );

      render(
        <FeatureGate requiredTier="pro">
          <div>Pro Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Pro Content')).toBeInTheDocument();
      expect(screen.queryByText(/Feature Locked/i)).not.toBeInTheDocument();
    });

    it('should render children when user tier exceeds requirement', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('enterprise', false)()
      );

      render(
        <FeatureGate requiredTier="basic">
          <div>Enterprise User Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Enterprise User Content')).toBeInTheDocument();
    });

    it('should render children for admin regardless of tier', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', true)()
      );

      render(
        <FeatureGate requiredTier="enterprise">
          <div>Admin Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  describe('access denied scenarios', () => {
    it('should show upgrade card when user tier is insufficient', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', false)()
      );

      render(
        <FeatureGate requiredTier="pro">
          <div>Pro Content</div>
        </FeatureGate>
      );

      expect(screen.getByText(/Feature Locked/i)).toBeInTheDocument();
      expect(screen.getByText(/Upgrade to Pro/i)).toBeInTheDocument();
      expect(screen.queryByText('Pro Content')).not.toBeInTheDocument();
    });

    it('should display current tier and required tier in upgrade card', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('basic', false)()
      );

      render(
        <FeatureGate requiredTier="enterprise">
          <div>Enterprise Content</div>
        </FeatureGate>
      );

      expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/Required Plan/i)).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', false)()
      );

      render(
        <FeatureGate 
          requiredTier="pro"
          fallback={<div>Custom Upgrade Message</div>}
        >
          <div>Pro Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Custom Upgrade Message')).toBeInTheDocument();
      expect(screen.queryByText(/Feature Locked/i)).not.toBeInTheDocument();
    });

    it('should show blur overlay when showBlurOverlay is true', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', false)()
      );

      const { container } = render(
        <FeatureGate requiredTier="pro" showBlurOverlay={true}>
          <div>Pro Content</div>
        </FeatureGate>
      );

      // Check for blur overlay structure
      const overlay = container.querySelector('.blur-sm');
      expect(overlay).toBeInTheDocument();
      expect(screen.getByText(/Feature Locked/i)).toBeInTheDocument();
    });
  });

  describe('featureId tracking', () => {
    it('should pass featureId to upgrade modal', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', false)()
      );

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      render(
        <FeatureGate requiredTier="pro" featureId="ai-tools">
          <div>Pro Content</div>
        </FeatureGate>
      );

      // Click upgrade button
      const upgradeButton = screen.getByText(/Upgrade to Pro/i);
      upgradeButton.click();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ai-tools')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('useFeatureLocked hook', () => {
    it('should return true when feature is locked', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', false)()
      );

      const { result } = renderHook(() => useFeatureLocked('pro'));
      expect(result.current).toBe(true);
    });

    it('should return false when feature is unlocked', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('pro', false)()
      );

      const { result } = renderHook(() => useFeatureLocked('basic'));
      expect(result.current).toBe(false);
    });
  });

  describe('useFeatureUnlocked hook', () => {
    it('should return false when feature is locked', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('free', false)()
      );

      const { result } = renderHook(() => useFeatureUnlocked('pro'));
      expect(result.current).toBe(false);
    });

    it('should return true when feature is unlocked', () => {
      const { usePortalAccess } = require('@/hooks/usePortalAccess');
      usePortalAccess.mockReturnValue(
        createMockUsePortalAccess('pro', false)()
      );

      const { result } = renderHook(() => useFeatureUnlocked('basic'));
      expect(result.current).toBe(true);
    });
  });

  describe('all tier combinations', () => {
    const tiers = ['free', 'basic', 'pro', 'enterprise'] as const;

    tiers.forEach((userTier) => {
      tiers.forEach((requiredTier) => {
        const shouldHaveAccess = 
          userTier === 'enterprise' || 
          (userTier === 'pro' && requiredTier !== 'enterprise') ||
          (userTier === 'basic' && ['free', 'basic'].includes(requiredTier)) ||
          (userTier === 'free' && requiredTier === 'free');

        it(`should ${shouldHaveAccess ? 'grant' : 'deny'} access for ${userTier} user accessing ${requiredTier} feature`, () => {
          const { usePortalAccess } = require('@/hooks/usePortalAccess');
          usePortalAccess.mockReturnValue(
            createMockUsePortalAccess(userTier, false)()
          );

          render(
            <FeatureGate requiredTier={requiredTier}>
              <div>Content</div>
            </FeatureGate>
          );

          if (shouldHaveAccess) {
            expect(screen.getByText('Content')).toBeInTheDocument();
          } else {
            expect(screen.getByText(/Feature Locked/i)).toBeInTheDocument();
          }
        });
      });
    });
  });
});

