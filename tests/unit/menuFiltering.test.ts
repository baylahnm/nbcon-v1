/**
 * Menu Filtering Logic Tests
 * 
 * Unit tests for menuConfig filtering and tier validation
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import { describe, it, expect } from 'vitest';
import {
  getMenuForRole,
  getAllMenuItems,
  findMenuItemByRoute,
  countLockedItems,
  CLIENT_MENU,
  ENGINEER_MENU,
  ENTERPRISE_MENU,
} from '@/config/menuConfig';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';

// ============================================================================
// MENU RETRIEVAL TESTS
// ============================================================================

describe('Menu Configuration', () => {
  describe('getMenuForRole', () => {
    it('should return client menu for client role', () => {
      const menu = getMenuForRole('client');
      expect(menu).toBe(CLIENT_MENU);
      expect(menu.length).toBeGreaterThan(0);
    });

    it('should return engineer menu for engineer role', () => {
      const menu = getMenuForRole('engineer');
      expect(menu).toBe(ENGINEER_MENU);
      expect(menu.length).toBeGreaterThan(0);
    });

    it('should return enterprise menu for enterprise role', () => {
      const menu = getMenuForRole('enterprise');
      expect(menu).toBe(ENTERPRISE_MENU);
      expect(menu.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown role', () => {
      const menu = getMenuForRole('unknown' as any);
      expect(menu).toEqual([]);
    });
  });

  describe('getAllMenuItems', () => {
    it('should flatten all menu items for a role', () => {
      const items = getAllMenuItems('client');
      expect(items.length).toBeGreaterThan(0);
      expect(items.every(item => item.roles.includes('client'))).toBe(true);
    });

    it('should include items from all sections', () => {
      const items = getAllMenuItems('client');
      const sections = getMenuForRole('client');
      const expectedCount = sections.reduce((sum, s) => sum + s.items.length, 0);
      expect(items.length).toBe(expectedCount);
    });
  });

  describe('findMenuItemByRoute', () => {
    it('should find item by exact route match', () => {
      const item = findMenuItemByRoute('client', '/free/dashboard');
      expect(item).toBeDefined();
      expect(item?.id).toBe('dashboard');
    });

    it('should return undefined for non-existent route', () => {
      const item = findMenuItemByRoute('client', '/non-existent-route');
      expect(item).toBeUndefined();
    });
  });
});

// ============================================================================
// TIER FILTERING TESTS
// ============================================================================

describe('Tier-Based Filtering', () => {
  describe('countLockedItems', () => {
    it('should count locked items for free tier', () => {
      const lockedCount = countLockedItems('client', 'free');
      expect(lockedCount).toBeGreaterThan(0); // AI tools require basic/pro
    });

    it('should have fewer locked items for pro tier', () => {
      const freeCount = countLockedItems('client', 'free');
      const proCount = countLockedItems('client', 'pro');
      expect(proCount).toBeLessThan(freeCount);
    });

    it('should have zero locked items for enterprise tier', () => {
      const lockedCount = countLockedItems('client', 'enterprise');
      expect(lockedCount).toBe(0); // Enterprise has access to everything
    });

    it('should count items with requiredTier only', () => {
      const items = getAllMenuItems('client');
      const itemsWithTier = items.filter(i => i.requiredTier);
      const lockedForFree = countLockedItems('client', 'free');
      
      expect(lockedForFree).toBeLessThanOrEqual(itemsWithTier.length);
    });
  });

  describe('tierMeetsRequirement', () => {
    it('should allow free tier to access free items', () => {
      expect(tierMeetsRequirement('free', undefined)).toBe(true);
    });

    it('should block free tier from basic items', () => {
      expect(tierMeetsRequirement('free', 'basic')).toBe(false);
    });

    it('should allow basic tier to access basic items', () => {
      expect(tierMeetsRequirement('basic', 'basic')).toBe(true);
    });

    it('should allow pro tier to access basic and pro items', () => {
      expect(tierMeetsRequirement('pro', 'basic')).toBe(true);
      expect(tierMeetsRequirement('pro', 'pro')).toBe(true);
    });

    it('should block pro tier from enterprise items', () => {
      expect(tierMeetsRequirement('pro', 'enterprise')).toBe(false);
    });

    it('should allow enterprise tier to access all items', () => {
      expect(tierMeetsRequirement('enterprise', 'basic')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'pro')).toBe(true);
      expect(tierMeetsRequirement('enterprise', 'enterprise')).toBe(true);
    });
  });
});

// ============================================================================
// MENU STRUCTURE VALIDATION
// ============================================================================

describe('Menu Structure Validation', () => {
  it('should have unique item IDs within each role', () => {
    const roles: Array<'client' | 'engineer' | 'enterprise'> = ['client', 'engineer', 'enterprise'];
    
    roles.forEach(role => {
      const items = getAllMenuItems(role);
      const ids = items.map(i => i.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  it('should have valid routes for all items', () => {
    const items = getAllMenuItems('client');
    items.forEach(item => {
      expect(item.route).toMatch(/^\//); // Starts with /
      expect(item.route).toBeTruthy();
    });
  });

  it('should have icons for all items', () => {
    const items = getAllMenuItems('client');
    items.forEach(item => {
      expect(item.icon).toBeDefined();
      expect(typeof item.icon).toBe('function'); // Lucide icons are functions
    });
  });

  it('should have labels for all items', () => {
    const items = getAllMenuItems('client');
    items.forEach(item => {
      expect(item.label).toBeTruthy();
      expect(item.label.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// ROLE-BASED ACCESS TESTS
// ============================================================================

describe('Role-Based Access', () => {
  it('should only include items for specified roles', () => {
    const clientItems = getAllMenuItems('client');
    expect(clientItems.every(item => item.roles.includes('client'))).toBe(true);
  });

  it('should not mix items from different roles', () => {
    const clientItems = getAllMenuItems('client');
    const engineerItems = getAllMenuItems('engineer');
    
    const clientRoutes = new Set(clientItems.map(i => i.route));
    const engineerRoutes = new Set(engineerItems.map(i => i.route));
    
    // Should have minimal overlap (maybe settings/help)
    const overlap = [...clientRoutes].filter(r => engineerRoutes.has(r));
    expect(overlap.length).toBeLessThan(clientItems.length / 2);
  });
});

