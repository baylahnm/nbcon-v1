/**
 * Sidebar Tier Gating Integration Tests
 * 
 * Tests tier-aware sidebar rendering and interaction
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SidebarItem } from '@/components/navigation/SidebarItem';
import { SidebarSection } from '@/components/navigation/SidebarSection';
import { TierAwareAppSidebar } from '@/components/navigation/TierAwareAppSidebar';
import { CLIENT_MENU } from '@/config/menuConfig';
import type { MenuItem } from '@/config/menuConfig';
import { Bot } from 'lucide-react';

// Mock hooks
vi.mock('@/hooks/usePortalAccess', () => ({
  usePortalAccess: vi.fn(() => ({
    userPermissions: {
      subscriptionTier: 'free',
      canAccessAITools: false,
      canManageProjects: true,
    },
    isAuthenticated: true,
    isLoading: false,
  })),
}));

vi.mock('@/pages/2-auth/others/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    profile: { role: 'client', full_name: 'Test User', email: 'test@example.com' },
    signOut: vi.fn(),
  })),
}));

// Helper
function renderWithRouter(component: JSX.Element) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

// ============================================================================
// SIDEBAR ITEM TESTS
// ============================================================================

describe('SidebarItem Component', () => {
  const mockLockedClick = vi.fn();

  const testItem: MenuItem = {
    id: 'ai-assistant',
    label: 'AI Assistant',
    description: 'Chat with AI',
    icon: Bot,
    route: '/free/ai',
    roles: ['client'],
    requiredTier: 'basic',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render locked state for insufficient tier', () => {
    renderWithRouter(
      <SidebarItem item={testItem} currentTier="free" onLockedClick={mockLockedClick} />
    );

    expect(screen.getByTestId('sidebar-item-locked-ai-assistant')).toBeInTheDocument();
    expect(screen.getByText('basic')).toBeInTheDocument(); // Tier badge
  });

  it('should render unlocked state for sufficient tier', () => {
    renderWithRouter(
      <SidebarItem item={testItem} currentTier="basic" onLockedClick={mockLockedClick} />
    );

    expect(screen.getByTestId('sidebar-item-ai-assistant')).toBeInTheDocument();
    expect(screen.queryByText('basic')).not.toBeInTheDocument(); // No tier badge
  });

  it('should call onLockedClick when locked item clicked', () => {
    renderWithRouter(
      <SidebarItem item={testItem} currentTier="free" onLockedClick={mockLockedClick} />
    );

    const lockedItem = screen.getByTestId('sidebar-item-locked-ai-assistant');
    fireEvent.click(lockedItem);

    expect(mockLockedClick).toHaveBeenCalledWith(testItem);
  });

  it('should navigate when unlocked item clicked', () => {
    renderWithRouter(
      <SidebarItem item={testItem} currentTier="pro" onLockedClick={mockLockedClick} />
    );

    const link = screen.getByTestId('sidebar-item-ai-assistant');
    expect(link).toHaveAttribute('href', '/free/ai');
  });

  it('should show "New" badge when isNew is true', () => {
    const newItem = { ...testItem, isNew: true };
    renderWithRouter(
      <SidebarItem item={newItem} currentTier="pro" onLockedClick={mockLockedClick} />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should show coming soon state when comingSoon is true', () => {
    const comingSoonItem = { ...testItem, comingSoon: true };
    renderWithRouter(
      <SidebarItem item={comingSoonItem} currentTier="pro" onLockedClick={mockLockedClick} />
    );

    expect(screen.getByTestId('sidebar-item-coming-soon-ai-assistant')).toBeInTheDocument();
    expect(screen.getByText('Soon')).toBeInTheDocument();
  });
});

// ============================================================================
// SIDEBAR SECTION TESTS
// ============================================================================

describe('SidebarSection Component', () => {
  const mockLockedClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all items in section', () => {
    const section = CLIENT_MENU[0]; // Overview section
    renderWithRouter(
      <SidebarSection section={section} currentTier="free" onLockedClick={mockLockedClick} />
    );

    expect(screen.getByText(section.label)).toBeInTheDocument();
    section.items.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('should collapse/expand when header clicked', () => {
    const section = CLIENT_MENU[0];
    renderWithRouter(
      <SidebarSection section={section} currentTier="free" onLockedClick={mockLockedClick} />
    );

    const header = screen.getByTestId(`sidebar-section-header-${section.id}`);
    const items = screen.getByTestId(`sidebar-section-items-${section.id}`);

    // Initially expanded (default)
    expect(items).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(header);
    expect(screen.queryByTestId(`sidebar-section-items-${section.id}`)).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(header);
    expect(screen.getByTestId(`sidebar-section-items-${section.id}`)).toBeInTheDocument();
  });

  it('should render locked items with tier badges', () => {
    const aiSection = CLIENT_MENU.find(s => s.id === 'ai-tools')!;
    renderWithRouter(
      <SidebarSection section={aiSection} currentTier="free" onLockedClick={mockLockedClick} />
    );

    // AI Assistant requires basic tier
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('basic')).toBeInTheDocument();
  });
});

// ============================================================================
// TIER LOGIC TESTS
// ============================================================================

describe('Locked Item Counting', () => {
  it('should correctly count locked items per tier', () => {
    expect(countLockedItems('client', 'free')).toBeGreaterThan(5); // Many locked for free
    expect(countLockedItems('client', 'basic')).toBeGreaterThan(0); // Some locked for basic
    expect(countLockedItems('client', 'pro')).toBe(0); // None locked for pro (in client portal)
    expect(countLockedItems('client', 'enterprise')).toBe(0);
  });

  it('should handle different roles correctly', () => {
    const clientLocked = countLockedItems('client', 'free');
    const engineerLocked = countLockedItems('engineer', 'free');
    
    // Both should have locked items
    expect(clientLocked).toBeGreaterThan(0);
    expect(engineerLocked).toBeGreaterThan(0);
  });
});

