/**
 * Subscription Type Definitions
 * 
 * Centralized type system for subscription tiers and related types.
 * Import from this file to ensure consistency across the entire application.
 * 
 * @version 1.0.0
 * @created October 29, 2025
 */

// ============================================================================
// SUBSCRIPTION TIER
// ============================================================================

/**
 * Subscription tier levels
 * 
 * Hierarchy: free < basic < pro < enterprise
 */
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

/**
 * Subscription status types
 */
export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'incomplete' 
  | 'unpaid';

// ============================================================================
// TIER HIERARCHY
// ============================================================================

/**
 * Tier hierarchy levels for comparison
 */
export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
} as const;

/**
 * Tier display names
 */
export const TIER_NAMES: Record<SubscriptionTier, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Professional',
  enterprise: 'Enterprise',
} as const;

/**
 * Tier colors for UI (Tailwind classes)
 */
export const TIER_COLORS: Record<SubscriptionTier, string> = {
  free: 'text-muted-foreground',
  basic: 'text-blue-600',
  pro: 'text-purple-600',
  enterprise: 'text-amber-600',
} as const;

/**
 * Tier badge colors (Tailwind classes)
 */
export const TIER_BADGE_COLORS: Record<SubscriptionTier, string> = {
  free: 'bg-muted text-muted-foreground',
  basic: 'bg-blue-500/10 text-blue-600',
  pro: 'bg-purple-500/10 text-purple-600',
  enterprise: 'bg-amber-500/10 text-amber-600',
} as const;

// ============================================================================
// SUBSCRIPTION INTERFACES
// ============================================================================

/**
 * User subscription data
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  periodStart: Date;
  periodEnd: Date;
  trialEnd: Date | null;
  features: string[];
  limits: Record<string, number>;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
}

/**
 * Quota check result
 */
export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetDate: Date;
  feature: string;
}

/**
 * Project limit check result
 */
export interface ProjectLimitCheck {
  allowed: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
  tier: SubscriptionTier;
  upgradeRequired?: SubscriptionTier;
  message?: string;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if value is a valid SubscriptionTier
 */
export function isSubscriptionTier(value: unknown): value is SubscriptionTier {
  return (
    typeof value === 'string' &&
    ['free', 'basic', 'pro', 'enterprise'].includes(value)
  );
}

/**
 * Check if value is a valid SubscriptionStatus
 */
export function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return (
    typeof value === 'string' &&
    ['active', 'trialing', 'past_due', 'canceled', 'incomplete', 'unpaid'].includes(value)
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get tier hierarchy level
 */
export function getTierLevel(tier: SubscriptionTier): number {
  return TIER_HIERARCHY[tier];
}

/**
 * Get tier display name
 */
export function getTierName(tier: SubscriptionTier): string {
  return TIER_NAMES[tier];
}

/**
 * Get tier color class
 */
export function getTierColor(tier: SubscriptionTier): string {
  return TIER_COLORS[tier];
}

/**
 * Get tier badge color class
 */
export function getTierBadgeColor(tier: SubscriptionTier): string {
  return TIER_BADGE_COLORS[tier];
}

/**
 * All available tiers (ordered)
 */
export const ALL_TIERS: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise'] as const;

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  SubscriptionTier as Tier,
  SubscriptionStatus as Status,
  UserSubscription,
  QuotaCheckResult,
  ProjectLimitCheck,
};

export {
  TIER_HIERARCHY as HIERARCHY,
  TIER_NAMES as NAMES,
  TIER_COLORS as COLORS,
  TIER_BADGE_COLORS as BADGE_COLORS,
  ALL_TIERS as TIERS,
};

