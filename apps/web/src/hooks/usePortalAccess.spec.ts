/**
 * usePortalAccess Hook - Unit Tests
 * 
 * Phase D: Testing & Documentation
 * Tests for tier-based access control hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import type { SubscriptionTier } from '@/shared/types/subscription';

// Create a shared state object that can be mutated by tests
let mockState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
};

// Mock the auth store - factory function must not reference variables outside
vi.mock('@/pages/2-auth/others/stores/auth', () => {
  const mockUseAuthStore = vi.fn((selector: any) => {
    return selector(mockState);
  }) as any;

  // Add getState method for functions that use getState()
  mockUseAuthStore.getState = vi.fn(() => mockState);

  return {
    useAuthStore: mockUseAuthStore,
  };
});

// Mock tierUtils - use actual implementation
vi.mock('@/shared/utils/tierUtils', async () => {
  const actual = await vi.importActual('@/shared/utils/tierUtils');
  return actual;
});

describe('usePortalAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    mockState = {
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  describe('subscription tier detection', () => {
    it('should return free tier when user is null', () => {
      mockState.user = null;
      mockState.isAuthenticated = false;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.subscriptionTier).toBe('free');
    });

    it('should detect tier from subscription_tier field', () => {
      const tiers: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise'];
      
      tiers.forEach((tier) => {
        mockState.user = { subscription_tier: tier, id: 'test-id', email: 'test@example.com' } as any;
        mockState.isAuthenticated = true;
        mockState.isLoading = false;

        const { result } = renderHook(() => usePortalAccess());
        expect(result.current.subscriptionTier).toBe(tier);
      });
    });

    it('should detect tier from subscriptionTier (camelCase) field', () => {
      mockState.user = { subscriptionTier: 'pro', id: 'test-id', email: 'test@example.com' } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.subscriptionTier).toBe('pro');
    });

    it('should default to free for invalid tier values', () => {
      mockState.user = { subscription_tier: 'invalid', id: 'test-id', email: 'test@example.com' } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.subscriptionTier).toBe('free');
    });
  });

  describe('admin status detection', () => {
    it('should detect admin from is_admin field', () => {
      mockState.user = { is_admin: true, id: 'test-id', email: 'test@example.com' } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.isAdmin).toBe(true);
    });

    it('should detect admin from isAdmin (camelCase) field', () => {
      mockState.user = { isAdmin: true, id: 'test-id', email: 'test@example.com' } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.isAdmin).toBe(true);
    });

    it('should return false for non-admin users', () => {
      mockState.user = { is_admin: false, id: 'test-id', email: 'test@example.com' } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('userPermissions', () => {
    it('should grant all permissions to admin regardless of tier', () => {
      mockState.user = { 
        subscription_tier: 'free',
        is_admin: true,
        id: 'test-id',
        email: 'test@example.com'
      } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      const { userPermissions } = result.current;

      expect(userPermissions.canAccessAITools).toBe(true);
      expect(userPermissions.canManageProjects).toBe(true);
      expect(userPermissions.canAccessFinance).toBe(true);
      expect(userPermissions.canManageTeams).toBe(true);
      expect(userPermissions.maxProjects).toBe(-1);
      expect(userPermissions.aiTokenQuota).toBe(-1);
    });

    it('should set correct permissions for free tier', () => {
      mockState.user = { 
        subscription_tier: 'free',
        is_admin: false,
        id: 'test-id',
        email: 'test@example.com'
      } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      const { userPermissions } = result.current;

      expect(userPermissions.canAccessAITools).toBe(false);
      expect(userPermissions.canPostJobs).toBe(false);
      expect(userPermissions.canAccessFinance).toBe(false);
      expect(userPermissions.maxProjects).toBe(1);
      expect(userPermissions.aiTokenQuota).toBe(100000);
    });

    it('should set correct permissions for pro tier', () => {
      mockState.user = { 
        subscription_tier: 'pro',
        is_admin: false,
        id: 'test-id',
        email: 'test@example.com'
      } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      const { userPermissions } = result.current;

      expect(userPermissions.canAccessAITools).toBe(true);
      expect(userPermissions.canAccessFinance).toBe(true);
      expect(userPermissions.canManageTeams).toBe(false);
      expect(userPermissions.maxProjects).toBe(-1);
      expect(userPermissions.aiTokenQuota).toBe(-1);
    });
  });

  describe('canAccessTier', () => {
    it('should return true for admin regardless of required tier', () => {
      mockState.user = { 
        subscription_tier: 'free',
        is_admin: true,
        id: 'test-id',
        email: 'test@example.com'
      } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      
      expect(result.current.canAccessTier('free')).toBe(true);
      expect(result.current.canAccessTier('basic')).toBe(true);
      expect(result.current.canAccessTier('pro')).toBe(true);
      expect(result.current.canAccessTier('enterprise')).toBe(true);
    });

    it('should correctly check tier access for non-admin users', () => {
      mockState.user = { 
        subscription_tier: 'basic',
        is_admin: false,
        id: 'test-id',
        email: 'test@example.com'
      } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      
      expect(result.current.canAccessTier('free')).toBe(true);
      expect(result.current.canAccessTier('basic')).toBe(true);
      expect(result.current.canAccessTier('pro')).toBe(false);
      expect(result.current.canAccessTier('enterprise')).toBe(false);
    });
  });

  describe('auth state', () => {
    it('should return correct isAuthenticated status', () => {
      mockState.user = { id: 'test-id', email: 'test@example.com' } as any;
      mockState.isAuthenticated = true;
      mockState.isLoading = false;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return correct isLoading status', () => {
      mockState.user = null;
      mockState.isAuthenticated = false;
      mockState.isLoading = true;

      const { result } = renderHook(() => usePortalAccess());
      expect(result.current.isLoading).toBe(true);
    });
  });
});
