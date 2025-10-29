/**
 * Project Limit Service - Unit Tests
 * 
 * Tests tier-based project creation limits and quota enforcement
 * 
 * @version 1.0.0
 * @created October 29, 2025
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PROJECT_LIMITS,
  canCreateProject,
  getUserProjectCount,
  getProjectLimitUpgradeMessage,
  hasUnlimitedProjects,
  getProjectUpgradeTier,
  formatProjectLimitStatus,
} from '@/shared/services/projectLimitService';
import type { SubscriptionTier } from '@/config/portalTypes';

// Mock Supabase
vi.mock('@/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } },
        error: null,
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          in: vi.fn(() => ({
            // Return mock count
            count: 0,
            error: null,
          })),
        })),
      })),
    })),
  },
}));

describe('Project Limit Service', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // PROJECT_LIMITS Constants
  // ============================================================================

  describe('PROJECT_LIMITS', () => {
    it('should define correct limits for each tier', () => {
      expect(PROJECT_LIMITS.free).toBe(1);
      expect(PROJECT_LIMITS.basic).toBe(5);
      expect(PROJECT_LIMITS.pro).toBe(Infinity);
      expect(PROJECT_LIMITS.enterprise).toBe(Infinity);
    });

    it('should have all four tiers defined', () => {
      const tiers = Object.keys(PROJECT_LIMITS);
      expect(tiers).toContain('free');
      expect(tiers).toContain('basic');
      expect(tiers).toContain('pro');
      expect(tiers).toContain('enterprise');
      expect(tiers.length).toBe(4);
    });
  });

  // ============================================================================
  // canCreateProject
  // ============================================================================

  describe('canCreateProject', () => {
    it('should allow Free user to create first project', async () => {
      const result = await canCreateProject('test-user', 'free');
      
      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('free');
      expect(result.limit).toBe(1);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should block Free user from creating second project', async () => {
      // Mock: User already has 1 project
      const mockSupabase = await import('@/shared/supabase/client');
      vi.spyOn(mockSupabase.supabase, 'from').mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({
              count: 1,
              error: null,
            })),
          })),
        })),
      } as any);

      const result = await canCreateProject('test-user', 'free');
      
      expect(result.allowed).toBe(false);
      expect(result.currentCount).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.remaining).toBe(0);
      expect(result.upgradeRequired).toBe('basic');
    });

    it('should allow Basic user up to 5 projects', async () => {
      const result = await canCreateProject('test-user', 'basic');
      
      expect(result.tier).toBe('basic');
      expect(result.limit).toBe(5);
    });

    it('should block Basic user from creating 6th project', async () => {
      const mockSupabase = await import('@/shared/supabase/client');
      vi.spyOn(mockSupabase.supabase, 'from').mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({
              count: 5,
              error: null,
            })),
          })),
        })),
      } as any);

      const result = await canCreateProject('test-user', 'basic');
      
      expect(result.allowed).toBe(false);
      expect(result.currentCount).toBe(5);
      expect(result.limit).toBe(5);
      expect(result.upgradeRequired).toBe('pro');
    });

    it('should allow Pro user unlimited projects', async () => {
      const result = await canCreateProject('test-user', 'pro');
      
      expect(result.allowed).toBe(true);
      expect(result.tier).toBe('pro');
      expect(result.limit).toBe(Infinity);
      expect(result.remaining).toBe(Infinity);
      expect(result.upgradeRequired).toBeUndefined();
    });

    it('should allow Enterprise user unlimited projects', async () => {
      const result = await canCreateProject('test-user', 'enterprise');
      
      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(Infinity);
    });

    it('should return correct upgrade tier for Free user', async () => {
      const mockSupabase = await import('@/shared/supabase/client');
      vi.spyOn(mockSupabase.supabase, 'from').mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({
              count: 1,
              error: null,
            })),
          })),
        })),
      } as any);

      const result = await canCreateProject('test-user', 'free');
      
      expect(result.upgradeRequired).toBe('basic');
    });

    it('should return correct upgrade tier for Basic user', async () => {
      const mockSupabase = await import('@/shared/supabase/client');
      vi.spyOn(mockSupabase.supabase, 'from').mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({
              count: 5,
              error: null,
            })),
          })),
        })),
      } as any);

      const result = await canCreateProject('test-user', 'basic');
      
      expect(result.upgradeRequired).toBe('pro');
    });
  });

  // ============================================================================
  // Helper Functions
  // ============================================================================

  describe('hasUnlimitedProjects', () => {
    it('should return false for Free', () => {
      expect(hasUnlimitedProjects('free')).toBe(false);
    });

    it('should return false for Basic', () => {
      expect(hasUnlimitedProjects('basic')).toBe(false);
    });

    it('should return true for Pro', () => {
      expect(hasUnlimitedProjects('pro')).toBe(true);
    });

    it('should return true for Enterprise', () => {
      expect(hasUnlimitedProjects('enterprise')).toBe(true);
    });
  });

  describe('getProjectUpgradeTier', () => {
    it('should return Basic for Free tier', () => {
      expect(getProjectUpgradeTier('free')).toBe('basic');
    });

    it('should return Pro for Basic tier', () => {
      expect(getProjectUpgradeTier('basic')).toBe('pro');
    });

    it('should return null for Pro tier', () => {
      expect(getProjectUpgradeTier('pro')).toBeNull();
    });

    it('should return null for Enterprise tier', () => {
      expect(getProjectUpgradeTier('enterprise')).toBeNull();
    });
  });

  describe('getProjectLimitUpgradeMessage', () => {
    it('should return correct message for each tier', () => {
      const freeMsg = getProjectLimitUpgradeMessage('free');
      expect(freeMsg).toContain('Basic');
      expect(freeMsg).toContain('5 projects');

      const basicMsg = getProjectLimitUpgradeMessage('basic');
      expect(basicMsg).toContain('Pro');
      expect(basicMsg).toContain('unlimited');

      const proMsg = getProjectLimitUpgradeMessage('pro');
      expect(proMsg).toContain('unlimited');

      const enterpriseMsg = getProjectLimitUpgradeMessage('enterprise');
      expect(enterpriseMsg).toContain('unlimited');
    });
  });

  describe('formatProjectLimitStatus', () => {
    it('should format unlimited status correctly', () => {
      const check = {
        allowed: true,
        currentCount: 10,
        limit: Infinity,
        remaining: Infinity,
        tier: 'pro' as SubscriptionTier,
      };

      const status = formatProjectLimitStatus(check);
      
      expect(status.statusText).toContain('Unlimited');
      expect(status.statusColor).toBe('text-green-600');
      expect(status.showUpgrade).toBe(false);
    });

    it('should format at-limit status with upgrade prompt', () => {
      const check = {
        allowed: false,
        currentCount: 1,
        limit: 1,
        remaining: 0,
        tier: 'free' as SubscriptionTier,
      };

      const status = formatProjectLimitStatus(check);
      
      expect(status.statusText).toContain('1/1');
      expect(status.statusText).toContain('Limit reached');
      expect(status.statusColor).toBe('text-red-600');
      expect(status.showUpgrade).toBe(true);
    });

    it('should show warning when approaching limit', () => {
      const check = {
        allowed: true,
        currentCount: 4,
        limit: 5,
        remaining: 1,
        tier: 'basic' as SubscriptionTier,
      };

      const status = formatProjectLimitStatus(check);
      
      expect(status.statusText).toContain('4/5');
      expect(status.statusText).toContain('1 remaining');
      expect(status.statusColor).toBe('text-yellow-600');
      expect(status.showUpgrade).toBe(true);
    });

    it('should show normal status when well under limit', () => {
      const check = {
        allowed: true,
        currentCount: 2,
        limit: 5,
        remaining: 3,
        tier: 'basic' as SubscriptionTier,
      };

      const status = formatProjectLimitStatus(check);
      
      expect(status.statusText).toContain('2/5');
      expect(status.statusText).toContain('3 remaining');
      expect(status.statusColor).toBe('text-muted-foreground');
      expect(status.showUpgrade).toBe(false);
    });
  });
});

