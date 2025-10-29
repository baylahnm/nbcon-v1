/**
 * Test User Fixtures for Subscription Tier Testing
 * 
 * Provides authenticated user credentials for all subscription tiers
 * 
 * @version 1.0.0
 * @created October 29, 2025
 */

import type { SubscriptionTier } from '../../src/shared/types/subscription';
import type { UserRole } from '../../src/shared/types/auth';

export interface TestUser {
  email: string;
  password: string;
  tier: SubscriptionTier;
  role: UserRole;
  expectedDashboard: string;
}

/**
 * Test users with subscription tier assignments
 * 
 * Prerequisites:
 * - Users must exist in Supabase Auth (auth.users)
 * - Profiles must exist with correct role
 * - Subscriptions must be assigned per tier
 * - Run database/scripts/create-test-users.sql to initialize
 */
export const TEST_USERS: Record<string, TestUser> = {
  free: {
    email: process.env.TEST_FREE_USER_EMAIL || 'free@nbcon.org',
    password: process.env.TEST_FREE_USER_PASSWORD || 'Test1234@',
    tier: 'free',
    role: 'client',
    expectedDashboard: '/free/dashboard',
  },
  
  basic: {
    email: process.env.TEST_BASIC_USER_EMAIL || 'basic@nbcon.org',
    password: process.env.TEST_BASIC_USER_PASSWORD || 'Test1234@',
    tier: 'basic',
    role: 'client',
    expectedDashboard: '/free/dashboard',
  },
  
  pro: {
    email: process.env.TEST_PRO_USER_EMAIL || 'info@nbcon.org',
    password: process.env.TEST_PRO_USER_PASSWORD || 'Qazwsx1234@',
    tier: 'pro',
    role: 'client',
    expectedDashboard: '/free/dashboard',
  },
  
  enterprise: {
    email: process.env.TEST_ENTERPRISE_EMAIL || 'mahdi.n.baylah@outlook.com',
    password: process.env.TEST_ENTERPRISE_PASSWORD || 'Qazwsx1234@',
    tier: 'enterprise',
    role: 'enterprise',
    expectedDashboard: '/enterprise/dashboard',
  },
};

/**
 * Get test user by tier
 */
export function getTestUser(tier: SubscriptionTier): TestUser {
  return TEST_USERS[tier];
}

/**
 * Get all test users
 */
export function getAllTestUsers(): TestUser[] {
  return Object.values(TEST_USERS);
}

/**
 * Tier hierarchy for comparison
 */
export const TIER_LEVELS = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
};

/**
 * Check if user tier meets requirement
 */
export function userMeetsTierRequirement(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier];
}

/**
 * Get expected visible page count per tier
 */
export const EXPECTED_PAGE_COUNTS = {
  free: 8,      // Core pages only
  basic: 17,    // Free + Basic pages
  pro: 28,      // Free + Basic + Pro pages
  enterprise: 47, // All pages
};

/**
 * Pages that should be visible per tier
 */
export const TIER_ACCESSIBLE_PAGES = {
  free: [
    '/free/overview',
    '/free/dashboard',
    '/free/calendar',
    '/free/projects',
    '/free/my-projects',
    '/free/learning',
    '/free/subscription',
    '/free/help',
    '/free/settings',
  ],
  
  basic: [
    // All free pages plus:
    '/free/browse-engineers',
    '/free/post-job',
    '/free/ai',
    '/free/messages',
    '/free/network',
    '/engineer/jobs',
    '/engineer/messages',
    '/engineer/ai',
    '/engineer/network',
  ],
  
  pro: [
    // All basic pages plus:
    '/free/finance',
    '/free/ai-tools/planning',
    '/engineer/finance',
    '/engineer/upload-deliverable',
  ],
  
  enterprise: [
    // All pro pages plus:
    '/enterprise/workforce',
    '/enterprise/teams',
    '/enterprise/contracts',
    '/enterprise/profile',
    '/enterprise/bi',
    // ... all 18 enterprise pages
  ],
};

/**
 * Pages that should show upgrade prompts per tier
 */
export const TIER_LOCKED_PAGES = {
  free: {
    basic: ['browse-engineers', 'post-job', 'ai', 'messages', 'network'],
    pro: ['finance', 'ai-tools'],
    enterprise: ['workforce', 'teams', 'contracts', 'profile', 'bi'],
  },
  
  basic: {
    pro: ['finance', 'ai-tools'],
    enterprise: ['workforce', 'teams', 'contracts', 'profile', 'bi'],
  },
  
  pro: {
    enterprise: ['workforce', 'teams', 'contracts', 'profile', 'bi'],
  },
};

export default TEST_USERS;

