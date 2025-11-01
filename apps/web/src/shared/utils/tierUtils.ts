/**
 * Tier Utility Functions
 * 
 * Helper functions for subscription tier comparisons and access checks.
 * Centralizes tier hierarchy logic for use across the application.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
 */

import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TIER HIERARCHY
// ============================================================================

/**
 * Tier hierarchy mapping for comparison logic
 * Higher number = higher tier (more privileges)
 */
const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  'free': 0,
  'basic': 1,
  'pro': 2,
  'enterprise': 3,
};

// ============================================================================
// TIER COMPARISON
// ============================================================================

/**
 * Check if user's tier meets the required tier
 * 
 * Returns true if:
 * - User tier is equal to required tier, OR
 * - User tier is higher than required tier in the hierarchy
 * 
 * @param userTier - User's current subscription tier
 * @param requiredTier - Minimum tier required for access
 * @returns true if user has sufficient tier access
 * 
 * @example
 * ```tsx
 * tierMeetsRequirement('pro', 'basic') // true (pro > basic)
 * tierMeetsRequirement('free', 'pro') // false (free < pro)
 * tierMeetsRequirement('enterprise', 'pro') // true (enterprise > pro)
 * ```
 */
export function tierMeetsRequirement(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  const userLevel = TIER_HIERARCHY[userTier];
  const requiredLevel = TIER_HIERARCHY[requiredTier];
  
  return userLevel >= requiredLevel;
}

/**
 * Check if user's tier is strictly higher than required tier
 * 
 * @param userTier - User's current subscription tier
 * @param requiredTier - Minimum tier required
 * @returns true if user tier is higher (not equal)
 */
export function tierExceedsRequirement(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return TIER_HIERARCHY[userTier] > TIER_HIERARCHY[requiredTier];
}

/**
 * Get tier hierarchy level
 * 
 * @param tier - Subscription tier
 * @returns Numeric level (0-3)
 */
export function getTierLevel(tier: SubscriptionTier): number {
  return TIER_HIERARCHY[tier];
}

/**
 * Compare two tiers
 * 
 * @param tierA - First tier
 * @param tierB - Second tier
 * @returns Positive if tierA > tierB, negative if tierA < tierB, 0 if equal
 */
export function compareTiers(tierA: SubscriptionTier, tierB: SubscriptionTier): number {
  return TIER_HIERARCHY[tierA] - TIER_HIERARCHY[tierB];
}

/**
 * Get all tiers that are at or above the given tier
 * 
 * @param minTier - Minimum tier
 * @returns Array of tiers that meet the requirement
 */
export function getTiersAtOrAbove(minTier: SubscriptionTier): SubscriptionTier[] {
  const minLevel = TIER_HIERARCHY[minTier];
  return (Object.entries(TIER_HIERARCHY) as [SubscriptionTier, number][])
    .filter(([_, level]) => level >= minLevel)
    .map(([tier]) => tier);
}

