/**
 * Portal Access Control Hook (Tier-Based)
 * 
 * Unified access control hook based on subscription tiers (Free → Basic → Pro → Enterprise).
 * Replaces role-based logic with tier-driven permissions and feature gating.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
 */

import { useMemo, useCallback } from 'react';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { tierMeetsRequirement } from '@/shared/utils/tierUtils';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TYPES
// ============================================================================

/**
 * User permissions based on subscription tier
 */
export interface UserPermissions {
  /** Current subscription tier */
  subscriptionTier: SubscriptionTier;
  /** Whether user has admin privileges */
  isAdmin: boolean;
  /** Feature access flags */
  canAccessAITools: boolean;
  canManageProjects: boolean;
  canPostJobs: boolean;
  canAccessFinance: boolean;
  canAccessAnalytics: boolean;
  canManageTeams: boolean;
  /** Project limits based on tier */
  maxProjects: number;
  /** AI token quota based on tier */
  aiTokenQuota: number;
}

/**
 * Portal access hook return type
 */
export interface UsePortalAccessReturn {
  /** Current subscription tier */
  subscriptionTier: SubscriptionTier;
  /** Whether user is admin */
  isAdmin: boolean;
  /** User permissions object */
  userPermissions: UserPermissions;
  /** Check if user can access a specific tier */
  canAccessTier: (requiredTier: SubscriptionTier) => boolean;
  /** Auth state */
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================================================
// TIER-BASED PERMISSIONS
// ============================================================================

/**
 * Get tier-based feature permissions
 */
function getTierPermissions(tier: SubscriptionTier, isAdmin: boolean): Omit<UserPermissions, 'subscriptionTier' | 'isAdmin'> {
  // Admin gets all permissions
  if (isAdmin) {
    return {
      canAccessAITools: true,
      canManageProjects: true,
      canPostJobs: true,
      canAccessFinance: true,
      canAccessAnalytics: true,
      canManageTeams: true,
      maxProjects: -1, // Unlimited
      aiTokenQuota: -1, // Unlimited
    };
  }

  // Tier-based permissions
  switch (tier) {
    case 'enterprise':
      return {
        canAccessAITools: true,
        canManageProjects: true,
        canPostJobs: true,
        canAccessFinance: true,
        canAccessAnalytics: true,
        canManageTeams: true,
        maxProjects: -1, // Unlimited
        aiTokenQuota: -1, // Unlimited + private AI
      };
    case 'pro':
      return {
        canAccessAITools: true,
        canManageProjects: true,
        canPostJobs: true,
        canAccessFinance: true,
        canAccessAnalytics: true,
        canManageTeams: false,
        maxProjects: -1, // Unlimited
        aiTokenQuota: -1, // Unlimited
      };
    case 'basic':
      return {
        canAccessAITools: true, // Limited AI tools
        canManageProjects: true,
        canPostJobs: true,
        canAccessFinance: false,
        canAccessAnalytics: false,
        canManageTeams: false,
        maxProjects: 5,
        aiTokenQuota: 500000, // 500k tokens
      };
    case 'free':
    default:
      return {
        canAccessAITools: false, // Basic AI assistant only
        canManageProjects: true,
        canPostJobs: false,
        canAccessFinance: false,
        canAccessAnalytics: false,
        canManageTeams: false,
        maxProjects: 1,
        aiTokenQuota: 100000, // 100k tokens
      };
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Portal access control hook
 * 
 * Provides tier-based access control and permissions.
 * No longer uses role-based logic; everything is subscription-tier driven.
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { subscriptionTier, isAdmin, canAccessTier, userPermissions } = usePortalAccess();
 *   
 *   if (!canAccessTier('pro')) {
 *     return <UpgradePrompt />;
 *   }
 *   
 *   return <ProFeatureContent />;
 * }
 * ```
 */
export function usePortalAccess(): UsePortalAccessReturn {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  // Get subscription tier from user profile
  const subscriptionTier = useMemo(() => {
    if (!user) return 'free' as SubscriptionTier;
    
    // Check user.subscription_tier first (new field)
    if ('subscription_tier' in user && user.subscription_tier) {
      const tier = user.subscription_tier as string;
      if (['free', 'basic', 'pro', 'enterprise'].includes(tier)) {
        return tier as SubscriptionTier;
      }
    }
    
    // Fallback to subscriptionTier (camelCase)
    if ('subscriptionTier' in user && user.subscriptionTier) {
      const tier = user.subscriptionTier as string;
      if (['free', 'basic', 'pro', 'enterprise'].includes(tier)) {
        return tier as SubscriptionTier;
      }
    }
    
    // Default to free
    return 'free' as SubscriptionTier;
  }, [user]);
  
  // Get admin status
  const isAdmin = useMemo(() => {
    if (!user) return false;
    return (user.is_admin === true) || (user.isAdmin === true);
  }, [user]);
  
  // Calculate tier-based permissions
  const userPermissions = useMemo((): UserPermissions => {
    const tierPerms = getTierPermissions(subscriptionTier, isAdmin);
    
    return {
      subscriptionTier,
      isAdmin,
      ...tierPerms,
    };
  }, [subscriptionTier, isAdmin]);
  
  /**
   * Check if user can access a specific tier
   * 
   * @param requiredTier - Minimum tier required
   * @returns true if user's tier meets requirement or user is admin
   */
  const canAccessTier = useCallback((requiredTier: SubscriptionTier): boolean => {
    // Admins bypass all tier restrictions
    if (isAdmin) return true;
    
    // Check tier hierarchy
    return tierMeetsRequirement(subscriptionTier, requiredTier);
  }, [subscriptionTier, isAdmin]);
  
  return {
    subscriptionTier,
    isAdmin,
    userPermissions,
    canAccessTier,
    isAuthenticated,
    isLoading,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current user's subscription tier from auth store
 * 
 * @returns Subscription tier or 'free' if not available
 */
export function getCurrentUserTier(): SubscriptionTier {
  const user = useAuthStore.getState().user;
  if (!user) return 'free';
  
  if ('subscription_tier' in user && user.subscription_tier) {
    const tier = user.subscription_tier as string;
    if (['free', 'basic', 'pro', 'enterprise'].includes(tier)) {
      return tier as SubscriptionTier;
    }
  }
  
  if ('subscriptionTier' in user && user.subscriptionTier) {
    const tier = user.subscriptionTier as string;
    if (['free', 'basic', 'pro', 'enterprise'].includes(tier)) {
      return tier as SubscriptionTier;
    }
  }
  
  return 'free';
}

/**
 * Get current user's admin status
 * 
 * @returns true if user is admin
 */
export function getCurrentUserIsAdmin(): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;
  return (user.is_admin === true) || (user.isAdmin === true);
}

