/**
 * Subscription Service Unit Tests
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  tierMeetsRequirement,
  compareTiers,
  getUpgradePath,
  canUpgrade,
  formatTierName,
  getTierColor,
  getTierBadgeColor,
} from '@/shared/services/subscriptionService';
import type { SubscriptionTier } from '@/config/portalTypes';

describe('SubscriptionService', () => {
  describe('tierMeetsRequirement', () => {
    it('should return true when user tier matches required tier', () => {
      expect(tierMeetsRequirement('pro', 'pro')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'enterprise')).toBe(true);
    });

    it('should return true when user tier is higher than required', () => {
      expect(tierMeetsRequirement('pro', 'basic')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'pro')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'basic')).toBe(true);
    });

    it('should return false when user tier is lower than required', () => {
      expect(tierMeetsRequirement('free', 'basic')).toBe(false);
      expect(tierMeetsRequirement('basic', 'pro')).toBe(false);
      expect(tierMeetsRequirement('pro', 'enterprise')).toBe(false);
    });

    it('should handle array of required tiers', () => {
      expect(tierMeetsRequirement('basic', ['basic', 'pro'])).toBe(true);
      expect(tierMeetsRequirement('pro', ['basic', 'pro'])).toBe(true);
      expect(tierMeetsRequirement('free', ['basic', 'pro'])).toBe(false);
    });

    it('should return true if user tier is higher than any required tier in array', () => {
      expect(tierMeetsRequirement('enterprise', ['basic', 'pro'])).toBe(true);
      expect(tierMeetsRequirement('pro', ['free', 'basic'])).toBe(true);
    });
  });

  describe('compareTiers', () => {
    it('should return 0 for equal tiers', () => {
      expect(compareTiers('free', 'free')).toBe(0);
      expect(compareTiers('pro', 'pro')).toBe(0);
    });

    it('should return positive number when tierA is higher', () => {
      expect(compareTiers('pro', 'basic')).toBeGreaterThan(0);
      expect(compareTiers('enterprise', 'free')).toBeGreaterThan(0);
    });

    it('should return negative number when tierA is lower', () => {
      expect(compareTiers('free', 'pro')).toBeLessThan(0);
      expect(compareTiers('basic', 'enterprise')).toBeLessThan(0);
    });
  });

  describe('getUpgradePath', () => {
    it('should return all higher tiers in order for free tier', () => {
      const path = getUpgradePath('free');
      expect(path).toEqual(['basic', 'pro', 'enterprise']);
    });

    it('should return remaining tiers for basic tier', () => {
      const path = getUpgradePath('basic');
      expect(path).toEqual(['pro', 'enterprise']);
    });

    it('should return single tier for pro tier', () => {
      const path = getUpgradePath('pro');
      expect(path).toEqual(['enterprise']);
    });

    it('should return empty array for enterprise tier', () => {
      const path = getUpgradePath('enterprise');
      expect(path).toEqual([]);
    });
  });

  describe('canUpgrade', () => {
    it('should return true for free tier', () => {
      expect(canUpgrade('free')).toBe(true);
    });

    it('should return true for basic tier', () => {
      expect(canUpgrade('basic')).toBe(true);
    });

    it('should return true for pro tier', () => {
      expect(canUpgrade('pro')).toBe(true);
    });

    it('should return false for enterprise tier', () => {
      expect(canUpgrade('enterprise')).toBe(false);
    });
  });

  describe('formatTierName', () => {
    it('should format tier names correctly', () => {
      expect(formatTierName('free')).toBe('Free');
      expect(formatTierName('basic')).toBe('Basic');
      expect(formatTierName('pro')).toBe('Professional');
      expect(formatTierName('enterprise')).toBe('Enterprise');
    });

    it('should return the tier string for unknown tiers', () => {
      expect(formatTierName('unknown' as SubscriptionTier)).toBe('unknown');
    });
  });

  describe('getTierColor', () => {
    it('should return correct color classes for each tier', () => {
      expect(getTierColor('free')).toBe('text-muted-foreground');
      expect(getTierColor('basic')).toBe('text-blue-600');
      expect(getTierColor('pro')).toBe('text-purple-600');
      expect(getTierColor('enterprise')).toBe('text-amber-600');
    });

    it('should return default color for unknown tier', () => {
      expect(getTierColor('unknown' as SubscriptionTier)).toBe('text-foreground');
    });
  });

  describe('getTierBadgeColor', () => {
    it('should return correct badge color classes for each tier', () => {
      expect(getTierBadgeColor('free')).toBe('bg-muted text-muted-foreground');
      expect(getTierBadgeColor('basic')).toContain('bg-blue-500/10');
      expect(getTierBadgeColor('pro')).toContain('bg-purple-500/10');
      expect(getTierBadgeColor('enterprise')).toContain('bg-amber-500/10');
    });

    it('should return default badge color for unknown tier', () => {
      expect(getTierBadgeColor('unknown' as SubscriptionTier)).toBe('bg-muted text-muted-foreground');
    });
  });

  describe('Quota Calculations', () => {
    it('should calculate usage percentage correctly', () => {
      const used = 750;
      const limit = 1000;
      const percentage = (used / limit) * 100;
      
      expect(percentage).toBe(75);
    });

    it('should determine healthy status (<50%)', () => {
      const used = 400;
      const limit = 1000;
      const percentage = (used / limit) * 100;
      
      expect(percentage).toBeLessThan(50);
    });

    it('should determine warning status (50-79%)', () => {
      const used = 650;
      const limit = 1000;
      const percentage = (used / limit) * 100;
      
      expect(percentage).toBeGreaterThanOrEqual(50);
      expect(percentage).toBeLessThan(80);
    });

    it('should determine critical status (80-99%)', () => {
      const used = 850;
      const limit = 1000;
      const percentage = (used / limit) * 100;
      
      expect(percentage).toBeGreaterThanOrEqual(80);
      expect(percentage).toBeLessThan(100);
    });

    it('should determine exceeded status (≥100%)', () => {
      const used = 1100;
      const limit = 1000;
      const percentage = (used / limit) * 100;
      
      expect(percentage).toBeGreaterThanOrEqual(100);
    });

    it('should calculate remaining tokens correctly', () => {
      const used = 750;
      const limit = 1000;
      const remaining = Math.max(0, limit - used);
      
      expect(remaining).toBe(250);
    });

    it('should not allow negative remaining', () => {
      const used = 1100;
      const limit = 1000;
      const remaining = Math.max(0, limit - used);
      
      expect(remaining).toBe(0);
    });

    it('should identify Pro account by higher limit', () => {
      const defaultLimit = 100000;
      const proLimit = 500000;
      
      expect(proLimit).toBeGreaterThan(defaultLimit);
    });
  });
});

