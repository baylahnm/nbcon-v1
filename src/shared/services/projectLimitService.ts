/**
 * Project Limit Enforcement Service
 * 
 * Enforces tier-based project creation limits and provides upgrade prompts
 * 
 * @version 1.0.0
 * @created October 29, 2025
 */

import { supabase } from '../supabase/client';
import type { SubscriptionTier, ProjectLimitCheck } from '@/shared/types/subscription';

// ============================================================================
// PROJECT LIMIT CONSTANTS
// ============================================================================

export const PROJECT_LIMITS: Record<SubscriptionTier, number> = {
  free: 1,
  basic: 5,
  pro: Infinity,
  enterprise: Infinity,
};

// ============================================================================
// RE-EXPORT TYPES
// ============================================================================

export type { ProjectLimitCheck } from '@/shared/types/subscription';

// ============================================================================
// PROJECT COUNTING
// ============================================================================

/**
 * Get count of active projects for a user
 */
export async function getUserProjectCount(userId?: string): Promise<number> {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      console.warn('[ProjectLimit] No user ID available');
      return 0;
    }

    // Count active projects from jobs table where user is the client
    const { count, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', targetUserId)
      .in('status', ['active', 'in_progress', 'pending']);

    if (error) {
      console.error('[ProjectLimit] Error counting projects:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('[ProjectLimit] Unexpected error:', error);
    return 0;
  }
}

// ============================================================================
// LIMIT VALIDATION
// ============================================================================

/**
 * Check if user can create a new project
 */
export async function canCreateProject(
  userId?: string,
  tier?: SubscriptionTier
): Promise<ProjectLimitCheck> {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      return {
        allowed: false,
        currentCount: 0,
        limit: 0,
        remaining: 0,
        tier: 'free',
        message: 'User not authenticated',
      };
    }

    // Get user's tier (if not provided)
    const userTier = tier || 'free'; // Should be fetched from auth store in real usage
    
    // Get current project count
    const currentCount = await getUserProjectCount(targetUserId);
    
    // Get limit for tier
    const limit = PROJECT_LIMITS[userTier];
    
    // Check if unlimited
    if (limit === Infinity) {
      return {
        allowed: true,
        currentCount,
        limit,
        remaining: Infinity,
        tier: userTier,
      };
    }
    
    // Check if under limit
    const remaining = Math.max(0, limit - currentCount);
    const allowed = currentCount < limit;
    
    // Determine upgrade tier if limit reached
    let upgradeRequired: SubscriptionTier | undefined;
    if (!allowed) {
      if (userTier === 'free') upgradeRequired = 'basic';
      else if (userTier === 'basic') upgradeRequired = 'pro';
    }
    
    return {
      allowed,
      currentCount,
      limit,
      remaining,
      tier: userTier,
      upgradeRequired,
      message: allowed 
        ? `You can create ${remaining} more project(s)`
        : `You've reached your ${limit} project limit. Upgrade to ${upgradeRequired} for more.`,
    };
  } catch (error) {
    console.error('[ProjectLimit] Validation error:', error);
    
    // Fail open - allow on error
    return {
      allowed: true,
      currentCount: 0,
      limit: 1,
      remaining: 1,
      tier: 'free',
      message: 'Error checking limits, allowing creation',
    };
  }
}

/**
 * Get upgrade message for project limits
 */
export function getProjectLimitUpgradeMessage(tier: SubscriptionTier): string {
  const messages: Record<SubscriptionTier, string> = {
    free: 'Upgrade to Basic to manage up to 5 projects simultaneously',
    basic: 'Upgrade to Pro for unlimited projects and advanced features',
    pro: 'You have unlimited projects',
    enterprise: 'You have unlimited projects with enterprise features',
  };
  
  return messages[tier];
}

/**
 * Check if tier has unlimited projects
 */
export function hasUnlimitedProjects(tier: SubscriptionTier): boolean {
  return tier === 'pro' || tier === 'enterprise';
}

/**
 * Get next tier for project upgrade
 */
export function getProjectUpgradeTier(currentTier: SubscriptionTier): SubscriptionTier | null {
  if (currentTier === 'free') return 'basic';
  if (currentTier === 'basic') return 'pro';
  return null; // Pro and Enterprise already have unlimited
}

// ============================================================================
// PROJECT LIMIT HOOKS (for React components)
// ============================================================================

/**
 * Format project limit status for UI
 */
export function formatProjectLimitStatus(check: ProjectLimitCheck): {
  statusText: string;
  statusColor: string;
  showUpgrade: boolean;
} {
  const { allowed, currentCount, limit, tier } = check;
  
  if (limit === Infinity) {
    return {
      statusText: `${currentCount} active projects (Unlimited)`,
      statusColor: 'text-green-600',
      showUpgrade: false,
    };
  }
  
  const remaining = limit - currentCount;
  
  if (!allowed) {
    return {
      statusText: `${currentCount}/${limit} projects (Limit reached)`,
      statusColor: 'text-red-600',
      showUpgrade: true,
    };
  }
  
  if (remaining <= 1) {
    return {
      statusText: `${currentCount}/${limit} projects (${remaining} remaining)`,
      statusColor: 'text-yellow-600',
      showUpgrade: true,
    };
  }
  
  return {
    statusText: `${currentCount}/${limit} projects (${remaining} remaining)`,
    statusColor: 'text-muted-foreground',
    showUpgrade: false,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  PROJECT_LIMITS,
  getUserProjectCount,
  canCreateProject,
  getProjectLimitUpgradeMessage,
  hasUnlimitedProjects,
  getProjectUpgradeTier,
  formatProjectLimitStatus,
};

