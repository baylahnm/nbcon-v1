/**
 * Tier Utility Functions - Unit Tests
 * 
 * Phase D: Testing & Documentation
 * Comprehensive tests for tier hierarchy and comparison logic
 */

import { describe, it, expect } from 'vitest';
import {
  tierMeetsRequirement,
  tierExceedsRequirement,
  getTierLevel,
  compareTiers,
  getTiersAtOrAbove,
} from '@/shared/utils/tierUtils';
import type { SubscriptionTier } from '@/shared/types/subscription';

describe('tierUtils', () => {
  describe('tierMeetsRequirement', () => {
    it('should return true when user tier equals required tier', () => {
      expect(tierMeetsRequirement('free', 'free')).toBe(true);
      expect(tierMeetsRequirement('basic', 'basic')).toBe(true);
      expect(tierMeetsRequirement('pro', 'pro')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'enterprise')).toBe(true);
    });

    it('should return true when user tier is higher than required tier', () => {
      expect(tierMeetsRequirement('basic', 'free')).toBe(true);
      expect(tierMeetsRequirement('pro', 'free')).toBe(true);
      expect(tierMeetsRequirement('pro', 'basic')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'free')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'basic')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'pro')).toBe(true);
    });

    it('should return false when user tier is lower than required tier', () => {
      expect(tierMeetsRequirement('free', 'basic')).toBe(false);
      expect(tierMeetsRequirement('free', 'pro')).toBe(false);
      expect(tierMeetsRequirement('free', 'enterprise')).toBe(false);
      expect(tierMeetsRequirement('basic', 'pro')).toBe(false);
      expect(tierMeetsRequirement('basic', 'enterprise')).toBe(false);
      expect(tierMeetsRequirement('pro', 'enterprise')).toBe(false);
    });

    it('should handle all tier combinations correctly', () => {
      const tiers: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise'];
      
      tiers.forEach((userTier, userIndex) => {
        tiers.forEach((requiredTier, reqIndex) => {
          const expected = userIndex >= reqIndex;
          expect(tierMeetsRequirement(userTier, requiredTier)).toBe(expected);
        });
      });
    });
  });

  describe('tierExceedsRequirement', () => {
    it('should return false when user tier equals required tier', () => {
      expect(tierExceedsRequirement('free', 'free')).toBe(false);
      expect(tierExceedsRequirement('basic', 'basic')).toBe(false);
      expect(tierExceedsRequirement('pro', 'pro')).toBe(false);
      expect(tierExceedsRequirement('enterprise', 'enterprise')).toBe(false);
    });

    it('should return true when user tier is strictly higher', () => {
      expect(tierExceedsRequirement('basic', 'free')).toBe(true);
      expect(tierExceedsRequirement('pro', 'free')).toBe(true);
      expect(tierExceedsRequirement('pro', 'basic')).toBe(true);
      expect(tierExceedsRequirement('enterprise', 'free')).toBe(true);
      expect(tierExceedsRequirement('enterprise', 'basic')).toBe(true);
      expect(tierExceedsRequirement('enterprise', 'pro')).toBe(true);
    });

    it('should return false when user tier is lower', () => {
      expect(tierExceedsRequirement('free', 'basic')).toBe(false);
      expect(tierExceedsRequirement('free', 'pro')).toBe(false);
      expect(tierExceedsRequirement('basic', 'pro')).toBe(false);
    });
  });

  describe('getTierLevel', () => {
    it('should return correct hierarchy level for each tier', () => {
      expect(getTierLevel('free')).toBe(0);
      expect(getTierLevel('basic')).toBe(1);
      expect(getTierLevel('pro')).toBe(2);
      expect(getTierLevel('enterprise')).toBe(3);
    });
  });

  describe('compareTiers', () => {
    it('should return 0 for equal tiers', () => {
      expect(compareTiers('free', 'free')).toBe(0);
      expect(compareTiers('pro', 'pro')).toBe(0);
    });

    it('should return positive when tierA > tierB', () => {
      expect(compareTiers('basic', 'free')).toBeGreaterThan(0);
      expect(compareTiers('pro', 'basic')).toBeGreaterThan(0);
      expect(compareTiers('enterprise', 'pro')).toBeGreaterThan(0);
    });

    it('should return negative when tierA < tierB', () => {
      expect(compareTiers('free', 'basic')).toBeLessThan(0);
      expect(compareTiers('basic', 'pro')).toBeLessThan(0);
      expect(compareTiers('pro', 'enterprise')).toBeLessThan(0);
    });

    it('should return correct difference values', () => {
      expect(compareTiers('basic', 'free')).toBe(1);
      expect(compareTiers('pro', 'free')).toBe(2);
      expect(compareTiers('enterprise', 'free')).toBe(3);
      expect(compareTiers('enterprise', 'basic')).toBe(2);
      expect(compareTiers('enterprise', 'pro')).toBe(1);
    });
  });

  describe('getTiersAtOrAbove', () => {
    it('should return all tiers when minTier is free', () => {
      const result = getTiersAtOrAbove('free');
      expect(result).toEqual(['free', 'basic', 'pro', 'enterprise']);
    });

    it('should return basic and above when minTier is basic', () => {
      const result = getTiersAtOrAbove('basic');
      expect(result).toEqual(['basic', 'pro', 'enterprise']);
    });

    it('should return pro and above when minTier is pro', () => {
      const result = getTiersAtOrAbove('pro');
      expect(result).toEqual(['pro', 'enterprise']);
    });

    it('should return only enterprise when minTier is enterprise', () => {
      const result = getTiersAtOrAbove('enterprise');
      expect(result).toEqual(['enterprise']);
    });

    it('should include the minTier in results', () => {
      ['free', 'basic', 'pro', 'enterprise'].forEach((tier) => {
        const result = getTiersAtOrAbove(tier as SubscriptionTier);
        expect(result).toContain(tier);
      });
    });
  });
});

