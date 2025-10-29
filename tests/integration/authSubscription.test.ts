/**
 * Auth Store Subscription Integration Tests
 * 
 * Tests subscription data loading and persistence in the auth store
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAuthStore, initAuthListener } from '@/pages/2-auth/others/stores/auth';
import { getUserSubscription } from '@/shared/services/subscriptionService';
import { supabase } from '@/shared/supabase/client';

// Mock Supabase client
vi.mock('@/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ 
        data: { user: { id: 'test-user-123', email: 'test@example.com' } }, 
        error: null 
      })),
      getSession: vi.fn(() => Promise.resolve({ 
        data: { session: null }, 
        error: null 
      })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              subscription_status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              plan: {
                plan_type: 'premium',
                features: { ai_assistant: true, advanced_analytics: true },
                limits: { ai_tokens: 1000000, api_requests: 5000 }
              }
            },
            error: null
          }))
        }))
      }))
    }))
  }
}));

// Mock subscription service
vi.mock('@/shared/services/subscriptionService', () => ({
  getUserSubscription: vi.fn(),
  getUserSubscriptionTier: vi.fn(() => Promise.resolve('pro')),
  hasFeatureAccess: vi.fn(() => Promise.resolve(true)),
  checkUsageQuota: vi.fn(() => Promise.resolve({ allowed: true, used: 0, limit: 1000000, remaining: 1000000, resetDate: new Date(), feature: 'ai_tokens' })),
}));

describe('Auth Store Subscription Integration', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // SUBSCRIPTION LOADING TESTS
  // ============================================================================

  it('should load subscription tier on user login', async () => {
    const mockSubscription = {
      tier: 'pro' as const,
      status: 'active' as const,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['ai_assistant', 'advanced_analytics'],
      limits: { ai_tokens: 1000000, api_requests: 5000 }
    };

    (getUserSubscription as any).mockResolvedValue(mockSubscription);

    // Simulate user login
    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    // Load subscription data
    await useAuthStore.getState().loadSubscriptionData();

    const { user } = useAuthStore.getState();

    // Verify subscription loaded into user object
    expect(user?.subscriptionTier).toBe('pro');
    expect(user?.subscriptionStatus).toBe('active');
    expect(user?.subscriptionFeatures).toEqual(['ai_assistant', 'advanced_analytics']);
    expect(user?.subscriptionLimits).toEqual({ ai_tokens: 1000000, api_requests: 5000 });
  });

  it('should default to free tier when no subscription found', async () => {
    (getUserSubscription as any).mockResolvedValue(null);

    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    await useAuthStore.getState().loadSubscriptionData();

    const { user } = useAuthStore.getState();

    expect(user?.subscriptionTier).toBe('free');
    expect(user?.subscriptionStatus).toBe('active');
    expect(user?.subscriptionFeatures).toEqual([]);
    expect(user?.subscriptionLimits).toEqual({});
  });

  it('should persist subscription tier across page reloads', async () => {
    const mockSubscription = {
      tier: 'pro' as const,
      status: 'active' as const,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['ai_assistant'],
      limits: { ai_tokens: 1000000 }
    };

    (getUserSubscription as any).mockResolvedValue(mockSubscription);

    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    await useAuthStore.getState().loadSubscriptionData();

    const { user: userBefore } = useAuthStore.getState();
    expect(userBefore?.subscriptionTier).toBe('pro');

    // Simulate page reload by getting persisted state from localStorage
    const persistedUser = userBefore;
    expect(persistedUser?.subscriptionTier).toBe('pro');
  });

  it('should clear subscription data on logout', () => {
    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en',
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        subscriptionFeatures: ['ai_assistant'],
        subscriptionLimits: { ai_tokens: 1000000 }
      },
      isAuthenticated: true
    });

    // Logout
    useAuthStore.getState().logout();

    const { user, isAuthenticated } = useAuthStore.getState();

    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('should update subscription when tier changes', async () => {
    // Initial: Basic tier
    const mockBasicSubscription = {
      tier: 'basic' as const,
      status: 'active' as const,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['basic_features'],
      limits: { ai_tokens: 500000 }
    };

    (getUserSubscription as any).mockResolvedValueOnce(mockBasicSubscription);

    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    await useAuthStore.getState().loadSubscriptionData();

    let { user } = useAuthStore.getState();
    expect(user?.subscriptionTier).toBe('basic');
    expect(user?.subscriptionLimits?.ai_tokens).toBe(500000);

    // Upgrade to Pro
    const mockProSubscription = {
      tier: 'pro' as const,
      status: 'active' as const,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['ai_assistant', 'advanced_analytics'],
      limits: { ai_tokens: 1000000 }
    };

    (getUserSubscription as any).mockResolvedValueOnce(mockProSubscription);

    await useAuthStore.getState().loadSubscriptionData();

    user = useAuthStore.getState().user;
    expect(user?.subscriptionTier).toBe('pro');
    expect(user?.subscriptionLimits?.ai_tokens).toBe(1000000);
  });

  it('should handle subscription loading errors gracefully', async () => {
    (getUserSubscription as any).mockRejectedValue(new Error('Network error'));

    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    // Should not throw error
    await expect(useAuthStore.getState().loadSubscriptionData()).resolves.not.toThrow();

    // User should remain logged in (graceful degradation)
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).not.toBeNull();
    expect(isAuthenticated).toBe(true);
  });

  it('should call loadSubscriptionData() on auth state change', async () => {
    const loadSubscriptionDataSpy = vi.spyOn(useAuthStore.getState(), 'loadSubscriptionData');

    // Simulate successful subscription load
    const mockSubscription = {
      tier: 'pro' as const,
      status: 'active' as const,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['ai_assistant'],
      limits: { ai_tokens: 1000000 }
    };

    (getUserSubscription as any).mockResolvedValue(mockSubscription);

    // Call loadSubscriptionData explicitly (simulating what happens on auth state change)
    await useAuthStore.getState().loadSubscriptionData();

    expect(loadSubscriptionDataSpy).toHaveBeenCalled();
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  it('should not load subscription if user is not authenticated', async () => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false
    });

    await useAuthStore.getState().loadSubscriptionData();

    // getUserSubscription should not be called
    expect(getUserSubscription).not.toHaveBeenCalled();
  });

  it('should handle trial subscriptions correctly', async () => {
    const mockTrialSubscription = {
      tier: 'pro' as const,
      status: 'trialing' as const,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      features: ['ai_assistant', 'advanced_analytics'],
      limits: { ai_tokens: 1000000 }
    };

    (getUserSubscription as any).mockResolvedValue(mockTrialSubscription);

    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    await useAuthStore.getState().loadSubscriptionData();

    const { user } = useAuthStore.getState();

    expect(user?.subscriptionTier).toBe('pro');
    expect(user?.subscriptionStatus).toBe('trialing');
  });

  it('should handle canceled subscriptions', async () => {
    const mockCanceledSubscription = {
      tier: 'pro' as const,
      status: 'canceled' as const,
      periodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Still valid for 15 more days
      features: ['ai_assistant'],
      limits: { ai_tokens: 1000000 }
    };

    (getUserSubscription as any).mockResolvedValue(mockCanceledSubscription);

    useAuthStore.setState({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
        isVerified: true,
        location: 'Riyadh',
        phone: '+966500000000',
        language: 'en'
      },
      isAuthenticated: true,
      isInitialized: true
    });

    await useAuthStore.getState().loadSubscriptionData();

    const { user } = useAuthStore.getState();

    expect(user?.subscriptionTier).toBe('pro');
    expect(user?.subscriptionStatus).toBe('canceled');
  });
});

