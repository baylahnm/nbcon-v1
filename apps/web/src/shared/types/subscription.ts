/**
 * Subscription Tier Types and Utilities
 * 
 * Phase B: Access & Data Model
 * Defines subscription tier hierarchy and validation
 * 
 * @see docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
 */

/**
 * Subscription tier types (Free → Basic → Pro → Enterprise)
 */
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

/**
 * Tier hierarchy levels (for comparison)
 */
export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
};

/**
 * Human-readable tier names
 */
export const TIER_NAMES: Record<SubscriptionTier, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

/**
 * Tier display colors (CSS classes or hex codes)
 */
export const TIER_COLORS: Record<SubscriptionTier, string> = {
  free: 'gray',
  basic: 'blue',
  pro: 'purple',
  enterprise: 'gold',
};

/**
 * Tier badge colors
 */
export const TIER_BADGE_COLORS: Record<SubscriptionTier, string> = {
  free: 'bg-gray-100 text-gray-800',
  basic: 'bg-blue-100 text-blue-800',
  pro: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-yellow-100 text-yellow-800',
};

/**
 * All valid subscription tiers
 */
export const ALL_TIERS: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise'] as const;

/**
 * Check if a value is a valid subscription tier
 */
export function isSubscriptionTier(value: unknown): value is SubscriptionTier {
  return typeof value === 'string' && ALL_TIERS.includes(value as SubscriptionTier);
}

