/**
 * Vitest Test Setup for apps/web
 * 
 * Phase D: Testing & Documentation
 * Global configuration, mocks, and utilities for unit tests
 * 
 * @see docs/nbcon-new-plan/2 6 - 🧪 Phase D Testing & Documentation (Section 6)
 */

import { expect, afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// CLEANUP
// ============================================================================

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ============================================================================
// BROWSER API MOCKS
// ============================================================================

// Mock window.matchMedia (for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (for lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver (for responsive components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// ============================================================================
// AUTH STORE MOCK
// ============================================================================

/**
 * Mock auth store state
 */
export interface MockAuthState {
  user: {
    id: string;
    email: string;
    subscription_tier?: SubscriptionTier;
    subscriptionTier?: SubscriptionTier;
    is_admin?: boolean;
    isAdmin?: boolean;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Default mock auth state (free tier user)
 */
export const defaultMockAuthState: MockAuthState = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    subscription_tier: 'free',
    is_admin: false,
  },
  isAuthenticated: true,
  isLoading: false,
};

/**
 * Create mock auth state for different tiers
 */
export function createMockAuthState(tier: SubscriptionTier = 'free', isAdmin: boolean = false): MockAuthState {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      subscription_tier: tier,
      subscriptionTier: tier,
      is_admin: isAdmin,
      isAdmin: isAdmin,
    },
    isAuthenticated: true,
    isLoading: false,
  };
}

// ============================================================================
// usePortalAccess MOCK
// ============================================================================

/**
 * Mock implementation of usePortalAccess hook
 */
export function createMockUsePortalAccess(tier: SubscriptionTier = 'free', isAdmin: boolean = false) {
  return vi.fn(() => ({
    subscriptionTier: tier,
    isAdmin,
    userPermissions: {
      subscriptionTier: tier,
      isAdmin,
      canAccessAITools: isAdmin || tier === 'pro' || tier === 'enterprise',
      canManageProjects: true,
      canPostJobs: isAdmin || tier !== 'free',
      canAccessFinance: isAdmin || tier === 'pro' || tier === 'enterprise',
      canAccessAnalytics: isAdmin || tier !== 'free',
      canManageTeams: isAdmin || tier === 'enterprise',
      maxProjects: isAdmin || tier === 'enterprise' || tier === 'pro' ? -1 : tier === 'basic' ? 5 : 1,
      aiTokenQuota: isAdmin || tier === 'enterprise' || tier === 'pro' ? -1 : tier === 'basic' ? 500000 : 100000,
    },
    canAccessTier: vi.fn((requiredTier: SubscriptionTier) => {
      if (isAdmin) return true;
      const hierarchy = ['free', 'basic', 'pro', 'enterprise'];
      return hierarchy.indexOf(tier) >= hierarchy.indexOf(requiredTier);
    }),
    isAuthenticated: true,
    isLoading: false,
  }));
}

// ============================================================================
// STORE RESET UTILITIES
// ============================================================================

/**
 * Reset all Zustand stores before each test
 */
beforeEach(() => {
  // Clear any persisted store state
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // Reset auth store if accessible
  try {
    const { useAuthStore } = require('@/pages/2-auth/others/stores/auth');
    if (useAuthStore && typeof useAuthStore.getState === 'function') {
      // Reset to default state if store has reset method
      const store = useAuthStore.getState();
      if (store && typeof store.reset === 'function') {
        store.reset();
      }
    }
  } catch (e) {
    // Store may not be accessible in test environment
    // This is okay, tests can mock it directly
  }
});

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Wait for async updates to complete
 */
export async function waitForAsync() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Suppress console errors in tests (optional, can be enabled per test)
 */
export function suppressConsoleErrors() {
  const originalError = console.error;
  console.error = vi.fn();
  return () => {
    console.error = originalError;
  };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { SubscriptionTier };

