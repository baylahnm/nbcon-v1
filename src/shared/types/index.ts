/**
 * Shared Types - Barrel Export
 * 
 * Central export point for all shared type definitions
 * 
 * @version 1.0.0
 * @created October 29, 2025
 */

// Auth types
export type { UserRole, AuthenticatedUser } from './auth';
export { ROLE_BASE_PATHS } from './auth';

// Subscription types
export type {
  SubscriptionTier,
  SubscriptionStatus,
  UserSubscription,
  QuotaCheckResult,
  ProjectLimitCheck,
  Tier,
  Status,
} from './subscription';

export {
  TIER_HIERARCHY,
  TIER_NAMES,
  TIER_COLORS,
  TIER_BADGE_COLORS,
  ALL_TIERS,
  HIERARCHY,
  NAMES,
  COLORS,
  BADGE_COLORS,
  TIERS,
  isSubscriptionTier,
  isSubscriptionStatus,
  getTierLevel,
  getTierName,
  getTierColor,
  getTierBadgeColor,
} from './subscription';

