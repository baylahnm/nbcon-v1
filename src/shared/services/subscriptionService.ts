/**
 * Subscription Service
 * Handles subscription tier resolution, feature gating, and quota enforcement
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import { supabase } from '../supabase/client';
import type { SubscriptionTier } from '@/config/portalTypes';

// ============================================================================
// TYPES
// ============================================================================

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';
  periodStart: Date;
  periodEnd: Date;
  trialEnd: Date | null;
  features: string[];
  limits: Record<string, number>;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
}

export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetDate: Date;
  feature: string;
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
// SUBSCRIPTION FETCHING
// ============================================================================

/**
 * Get user's active subscription with plan details
 */
export async function getUserSubscription(userId?: string): Promise<UserSubscription | null> {
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
    return {
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
  } catch (error) {
    console.error('[SubscriptionService] Unexpected error:', error);
    return null;
  }
}

/**
 * Get user's subscription tier only (fast lookup)
 */
export async function getUserSubscriptionTier(userId?: string): Promise<SubscriptionTier> {
  const subscription = await getUserSubscription(userId);
  return subscription?.tier || 'free';
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
): Promise<QuotaCheckResult> {
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

