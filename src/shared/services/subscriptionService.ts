/**
 * Subscription Service
 * Handles subscription tier resolution, feature gating, and quota enforcement
 * 
 * Updated for Phase B: Now reads subscription_tier directly from profiles table
 * for fast access, with subscriptions table as secondary source.
 * 
 * @version 2.0.0
 * @created January 28, 2025
 * @updated February 2, 2025 (Phase B)
 * @see docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
 */

import { supabase } from '../supabase/client';
import type { 
  SubscriptionTier, 
  SubscriptionStatus,
  UserSubscription as UserSubscriptionType,
  QuotaCheckResult as QuotaCheckType
} from '@/shared/types/subscription';
import { isSubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// RE-EXPORT TYPES FROM CENTRALIZED LOCATION
// ============================================================================

export type { 
  UserSubscription, 
  QuotaCheckResult,
  SubscriptionTier,
  SubscriptionStatus
} from '@/shared/types/subscription';

// ============================================================================
// TIER CACHE
// ============================================================================

/**
 * In-memory cache for subscription tiers
 * Key: userId, Value: { tier, timestamp }
 */
interface TierCacheEntry {
  tier: SubscriptionTier;
  timestamp: number;
}

const tierCache = new Map<string, TierCacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached tier or null if expired/missing
 */
function getCachedTier(userId: string): SubscriptionTier | null {
  const entry = tierCache.get(userId);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    tierCache.delete(userId);
    return null;
  }
  
  return entry.tier;
}

/**
 * Set tier in cache
 */
function setCachedTier(userId: string, tier: SubscriptionTier): void {
  tierCache.set(userId, {
    tier,
    timestamp: Date.now(),
  });
}

/**
 * Clear tier cache for a user (call after tier update)
 */
export function clearTierCache(userId?: string): void {
  if (userId) {
    tierCache.delete(userId);
  } else {
    tierCache.clear();
  }
}

// ============================================================================
// TIER MAPPING
// ============================================================================

/**
 * Map database plan_type to SubscriptionTier enum
 * Handles naming conflicts between role names and tier names
 */
const PLAN_TYPE_TO_TIER: Record<string, SubscriptionTier> = {
  'free': 'free',
  'basic': 'basic',
  'premium': 'pro',
  'enterprise': 'enterprise',
};

/**
 * Tier hierarchy for upgrade path logic
 */
const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  'free': 0,
  'basic': 1,
  'pro': 2,
  'enterprise': 3,
};

// ============================================================================
// SUBSCRIPTION TIER FETCHING (Phase B - Direct from profiles)
// ============================================================================

/**
 * Get user's subscription tier directly from profiles table (fast lookup)
 * 
 * Phase B: Reads from profiles.subscription_tier column for quick access.
 * Falls back to subscriptions table if profile tier is missing.
 * 
 * @param userId - Optional user ID (defaults to current authenticated user)
 * @returns User's subscription tier (defaults to 'free')
 */
export async function getUserSubscriptionTier(userId?: string): Promise<SubscriptionTier> {
  try {
    // Get current user if no userId provided
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      console.warn('[SubscriptionService] No user ID available - defaulting to free');
      return 'free';
    }

    // Check cache first
    const cachedTier = getCachedTier(targetUserId);
    if (cachedTier) {
      return cachedTier;
    }

    // Fetch from profiles table (new Phase B column)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, is_admin')
      .eq('user_id', targetUserId)
      .single();

    if (!profileError && profile?.subscription_tier) {
      const tier = profile.subscription_tier as string;
      
      // Validate tier value
      if (isSubscriptionTier(tier)) {
        setCachedTier(targetUserId, tier);
        return tier;
      } else {
        console.warn(`[SubscriptionService] Invalid tier value in profiles: ${tier}, defaulting to free`);
      }
    }

    // Fallback: Try subscriptions table (legacy/secondary source)
    console.log('[SubscriptionService] Profile tier not found, checking subscriptions table...');
    const subscription = await getUserSubscription(targetUserId);
    
    if (subscription?.tier) {
      // Cache the tier from subscription for future lookups
      setCachedTier(targetUserId, subscription.tier);
      return subscription.tier;
    }

    // Default to free tier
    const defaultTier: SubscriptionTier = 'free';
    setCachedTier(targetUserId, defaultTier);
    return defaultTier;
  } catch (error) {
    console.error('[SubscriptionService] Error fetching subscription tier:', error);
    return 'free';
  }
}

/**
 * Update user's subscription tier in profiles table
 * 
 * Phase B: Persists tier changes to profiles.subscription_tier column.
 * Also clears cache to ensure fresh data on next fetch.
 * 
 * @param tier - New subscription tier
 * @param userId - Optional user ID (defaults to current authenticated user)
 * @returns true if update succeeded, false otherwise
 */
export async function updateSubscriptionTier(
  tier: SubscriptionTier,
  userId?: string
): Promise<boolean> {
  try {
    // Get current user if no userId provided
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      console.warn('[SubscriptionService] No user ID available for tier update');
      return false;
    }

    // Validate tier
    if (!isSubscriptionTier(tier)) {
      console.error(`[SubscriptionService] Invalid tier value: ${tier}`);
      return false;
    }

    // Update profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('user_id', targetUserId);

    if (error) {
      console.error('[SubscriptionService] Failed to update subscription tier:', error);
      return false;
    }

    // Clear cache to force fresh fetch on next access
    clearTierCache(targetUserId);
    
    console.log(`[SubscriptionService] Successfully updated tier to ${tier} for user ${targetUserId}`);
    return true;
  } catch (error) {
    console.error('[SubscriptionService] Unexpected error updating tier:', error);
    return false;
  }
}

/**
 * Get user profile with subscription tier and admin status
 * 
 * Phase B: Fetches both subscription_tier and is_admin from profiles table
 * for use in usePortalAccess hook.
 * 
 * @param userId - Optional user ID (defaults to current authenticated user)
 * @returns Profile data with tier and admin flag
 */
export async function getUserProfileWithTier(userId?: string): Promise<{
  subscriptionTier: SubscriptionTier;
  isAdmin: boolean;
} | null> {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, is_admin')
      .eq('user_id', targetUserId)
      .single();

    if (error || !profile) {
      console.warn('[SubscriptionService] Profile not found, defaulting to free tier');
      return {
        subscriptionTier: 'free',
        isAdmin: false,
      };
    }

    const tier = (profile.subscription_tier as SubscriptionTier) || 'free';
    const isAdmin = profile.is_admin === true;

    // Cache tier
    if (isSubscriptionTier(tier)) {
      setCachedTier(targetUserId, tier);
    }

    return {
      subscriptionTier: isSubscriptionTier(tier) ? tier : 'free',
      isAdmin,
    };
  } catch (error) {
    console.error('[SubscriptionService] Error fetching profile with tier:', error);
    return {
      subscriptionTier: 'free',
      isAdmin: false,
    };
  }
}

// ============================================================================
// SUBSCRIPTION FETCHING (Detailed subscription data)
// ============================================================================

/**
 * Get user's active subscription with plan details
 * 
 * This fetches from the subscriptions table for detailed subscription info
 * (billing periods, Stripe IDs, features, limits). For tier-only lookups,
 * use getUserSubscriptionTier() which reads from profiles.subscription_tier.
 */
export async function getUserSubscription(userId?: string): Promise<UserSubscriptionType | null> {
  try {
    // Get current user if no userId provided
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      console.warn('[SubscriptionService] No user ID available');
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions' as any)
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', targetUserId)
      .eq('subscription_status', 'active')
      .single() as { data: any; error: any };

    if (error) {
      // User might not have a subscription yet (new user)
      if (error.code === 'PGRST116') {
        console.log('[SubscriptionService] No active subscription - defaulting to free');
        return null;
      }
      
      console.error('[SubscriptionService] Error fetching subscription:', error);
      return null;
    }

    if (!data || !data.plan) {
      return null;
    }

    // Map to UserSubscription interface
    const subscription: UserSubscriptionType = {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      tier: PLAN_TYPE_TO_TIER[data.plan.plan_type] || 'free',
      status: data.subscription_status,
      periodStart: new Date(data.current_period_start),
      periodEnd: new Date(data.current_period_end),
      trialEnd: data.trial_end ? new Date(data.trial_end) : null,
      features: Object.keys(data.plan.features || {}),
      limits: data.plan.limits || {},
      stripeSubscriptionId: data.stripe_subscription_id,
      stripeCustomerId: data.stripe_customer_id,
    };

    // Sync tier to profiles table if it differs (one-way sync from subscriptions → profiles)
    const currentTier = await getUserSubscriptionTier(targetUserId);
    if (subscription.tier !== currentTier) {
      console.log(`[SubscriptionService] Syncing tier ${subscription.tier} to profiles table`);
      await updateSubscriptionTier(subscription.tier, targetUserId);
    }

    return subscription;
  } catch (error) {
    console.error('[SubscriptionService] Unexpected error:', error);
    return null;
  }
}

// ============================================================================
// FEATURE ACCESS
// ============================================================================

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(
  feature: string,
  userId?: string
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    // Free tier - check if feature is in free plan
    return await isFreeFeature(feature);
  }

  // Check if feature is in user's plan features
  return subscription.features.includes(feature);
}

/**
 * Check if a feature is available in free tier
 */
async function isFreeFeature(feature: string): Promise<boolean> {
  const { data } = await supabase
    .from('subscription_plans' as any)
    .select('features')
    .eq('plan_type', 'free')
    .single() as { data: any };

  if (!data || !data.features) return false;

  return data.features[feature] === true;
}

/**
 * Check if user's tier meets requirement
 * 
 * Phase B: Updated to use centralized tierUtils for consistency.
 * This function is kept for backward compatibility but delegates to tierUtils.
 * 
 * @deprecated Use tierMeetsRequirement from '@/shared/utils/tierUtils' instead
 */
export function tierMeetsRequirement(
  userTier: SubscriptionTier,
  required: SubscriptionTier | SubscriptionTier[]
): boolean {
  const requiredTiers = Array.isArray(required) ? required : [required];
  
  // Check if user's tier is in the required list
  if (requiredTiers.includes(userTier)) {
    return true;
  }

  // Check if user's tier is higher than any required tier
  const userLevel = TIER_HIERARCHY[userTier];
  return requiredTiers.some(tier => userLevel >= TIER_HIERARCHY[tier]);
}

// ============================================================================
// QUOTA ENFORCEMENT
// ============================================================================

/**
 * Check usage quota for a feature
 */
export async function checkUsageQuota(
  feature: string,
  userId?: string
): Promise<QuotaCheckType> {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      return {
        allowed: false,
        used: 0,
        limit: 0,
        remaining: 0,
        resetDate: new Date(),
        feature,
      };
    }

    // Get subscription to check limits
    const subscription = await getUserSubscription(targetUserId);
    const limit = subscription?.limits[feature] || 0;

    // -1 means unlimited
    if (limit === -1) {
      return {
        allowed: true,
        used: 0,
        limit: -1,
        remaining: -1,
        resetDate: subscription?.periodEnd || new Date(),
        feature,
      };
    }

    // Get current usage from usage_tracking table
    const { data: usageData } = await supabase
      .from('usage_tracking' as any)
      .select('usage_count')
      .eq('user_id', targetUserId)
      .eq('feature_name', feature)
      .gte('period_end', new Date().toISOString())
      .single() as { data: any };

    const used = usageData?.usage_count || 0;
    const remaining = Math.max(0, limit - used);

    return {
      allowed: remaining > 0 || limit === -1,
      used,
      limit,
      remaining,
      resetDate: subscription?.periodEnd || new Date(),
      feature,
    };
  } catch (error) {
    console.error('[SubscriptionService] Quota check error:', error);
    
    // Fail open - allow on error
    return {
      allowed: true,
      used: 0,
      limit: 0,
      remaining: 0,
      resetDate: new Date(),
      feature,
    };
  }
}

/**
 * Get all feature limits for user's subscription
 */
export async function getFeatureLimits(userId?: string): Promise<Record<string, number>> {
  const subscription = await getUserSubscription(userId);
  return subscription?.limits || {};
}

/**
 * Increment usage counter for a feature
 */
export async function incrementUsage(
  feature: string,
  amount: number = 1,
  userId?: string
): Promise<void> {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) return;

    const subscription = await getUserSubscription(targetUserId);
    
    if (!subscription) {
      console.warn('[SubscriptionService] No subscription found, cannot track usage');
      return;
    }

    // Upsert usage tracking
    const { error } = await (supabase.rpc as any)('increment_feature_usage', {
      p_user_id: targetUserId,
      p_feature_name: feature,
      p_increment_by: amount,
      p_period_start: subscription.periodStart.toISOString(),
      p_period_end: subscription.periodEnd.toISOString(),
    });

    if (error) {
      console.error('[SubscriptionService] Failed to increment usage:', error);
    }
  } catch (error) {
    console.error('[SubscriptionService] Increment usage error:', error);
  }
}

// ============================================================================
// SUBSCRIPTION COMPARISON
// ============================================================================

/**
 * Compare two tiers
 */
export function compareTiers(tierA: SubscriptionTier, tierB: SubscriptionTier): number {
  return TIER_HIERARCHY[tierA] - TIER_HIERARCHY[tierB];
}

/**
 * Get upgrade path from current tier
 */
export function getUpgradePath(currentTier: SubscriptionTier): SubscriptionTier[] {
  const currentLevel = TIER_HIERARCHY[currentTier];
  
  return (Object.entries(TIER_HIERARCHY) as [SubscriptionTier, number][])
    .filter(([_, level]) => level > currentLevel)
    .sort((a, b) => a[1] - b[1])
    .map(([tier]) => tier);
}

/**
 * Check if upgrade is available
 */
export function canUpgrade(currentTier: SubscriptionTier): boolean {
  return getUpgradePath(currentTier).length > 0;
}

// ============================================================================
// SUBSCRIPTION HELPERS
// ============================================================================

/**
 * Format tier name for display
 */
export function formatTierName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'Free',
    basic: 'Basic',
    pro: 'Professional',
    enterprise: 'Enterprise',
  };
  
  return names[tier] || tier;
}

/**
 * Get tier color for UI
 */
export function getTierColor(tier: SubscriptionTier): string {
  const colors: Record<SubscriptionTier, string> = {
    free: 'text-muted-foreground',
    basic: 'text-blue-600',
    pro: 'text-purple-600',
    enterprise: 'text-amber-600',
  };
  
  return colors[tier] || 'text-foreground';
}

/**
 * Get tier badge variant
 */
export function getTierBadgeColor(tier: SubscriptionTier): string {
  const colors: Record<SubscriptionTier, string> = {
    free: 'bg-muted text-muted-foreground',
    basic: 'bg-blue-500/10 text-blue-600',
    pro: 'bg-purple-500/10 text-purple-600',
    enterprise: 'bg-amber-500/10 text-amber-600',
  };
  
  return colors[tier] || 'bg-muted text-muted-foreground';
}

