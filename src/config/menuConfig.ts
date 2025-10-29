/**
 * Unified Menu Configuration
 * 
 * Single source of truth for all portal navigation across Client, Engineer,
 * Enterprise, and Admin portals. Supports role-based filtering, tier-based
 * gating, and feature flags.
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  MessageSquare,
  Network,
  GraduationCap,
  DollarSign,
  Bot,
  Settings,
  HelpCircle,
  FileText,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Upload,
  Star,
  Receipt,
  Trophy,
  Bell,
  BookOpen,
  Globe,
  Building2,
  UserCog,
  Database,
  Activity,
  Target,
  ClipboardList,
  Package,
  Rocket,
} from 'lucide-react';
import type { UserRole } from '@/shared/types/auth';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TYPES
// ============================================================================

export interface MenuItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  route: string;
  
  // Access Control
  roles: UserRole[];                    // Which roles can see this item
  requiredTier?: SubscriptionTier;      // Minimum tier (undefined = free)
  featureKey?: string;                  // Optional feature flag key
  
  // UI Metadata
  badge?: string | number;              // Badge text or count
  isNew?: boolean;                      // "New" indicator
  isBeta?: boolean;                     // "Beta" indicator
  external?: boolean;                   // Opens in new tab
  comingSoon?: boolean;                 // Disabled "Coming Soon" state
  
  // Children (nested menu items)
  children?: MenuItem[];
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
  collapsible?: boolean;                // Can collapse section (default: true)
  defaultExpanded?: boolean;            // Initial expanded state (default: true)
  roles?: UserRole[];                   // Section-level role filter
}

// ============================================================================
// CLIENT PORTAL MENU
// ============================================================================

export const CLIENT_MENU: MenuSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    defaultExpanded: true,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Your command center',
        icon: LayoutDashboard,
        route: '/free/dashboard',
        roles: ['client'],
      },
      {
        id: 'browse-engineers',
        label: 'Browse Engineers',
        description: 'Find qualified professionals',
        icon: Users,
        route: '/free/browse',
        roles: ['client'],
      },
      {
        id: 'calendar',
        label: 'Calendar',
        description: 'Schedule and manage events',
        icon: Calendar,
        route: '/free/calendar',
        roles: ['client'],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    defaultExpanded: true,
    items: [
      {
        id: 'post-job',
        label: 'Post New Job',
        description: 'Create a new project posting',
        icon: Briefcase,
        route: '/free/job/new',
        roles: ['client'],
      },
      {
        id: 'my-projects',
        label: 'Projects',
        description: 'View all your projects',
        icon: FileText,
        route: '/free/myprojects',
        roles: ['client'],
      },
    ],
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    defaultExpanded: true,
    items: [
      {
        id: 'ai-assistant',
        label: 'AI Assistant',
        description: 'Chat with AI for project insights',
        icon: Bot,
        route: '/free/ai',
        roles: ['client'],
        requiredTier: 'basic',
        featureKey: 'ai_assistant',
      },
      {
        id: 'ai-planning',
        label: 'Project Planning',
        description: '6 AI planning tools',
        icon: Rocket,
        route: '/free/ai-tools/planning',
        roles: ['client'],
        requiredTier: 'pro',
        featureKey: 'ai_planning_tools',
        isNew: true,
      },
      {
        id: 'ai-budgeting',
        label: 'Cost & Budgeting',
        description: 'AI-powered cost estimation',
        icon: DollarSign,
        route: '/free/ai-tools/budgeting',
        roles: ['client'],
        requiredTier: 'pro',
      },
      {
        id: 'ai-execution',
        label: 'Execution & Coordination',
        description: 'Project execution tools',
        icon: ClipboardList,
        route: '/free/ai-tools/execution',
        roles: ['client'],
        requiredTier: 'pro',
      },
      {
        id: 'ai-quality',
        label: 'Quality & Compliance',
        description: 'Quality control tools',
        icon: Shield,
        route: '/free/ai-tools/quality',
        roles: ['client'],
        requiredTier: 'pro',
      },
      {
        id: 'ai-communication',
        label: 'Communication & Reporting',
        description: 'Communication tools',
        icon: Bell,
        route: '/free/ai-tools/communication',
        roles: ['client'],
        requiredTier: 'pro',
      },
      {
        id: 'ai-closure',
        label: 'Closure & Handover',
        description: 'Project closure tools',
        icon: Target,
        route: '/free/ai-tools/closure',
        roles: ['client'],
        requiredTier: 'pro',
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    defaultExpanded: false,
    items: [
      {
        id: 'messages',
        label: 'Messages',
        description: 'Chat with engineers',
        icon: MessageSquare,
        route: '/free/messages',
        roles: ['client'],
      },
      {
        id: 'network',
        label: 'Network',
        description: 'Professional networking',
        icon: Network,
        route: '/free/network',
        roles: ['client'],
        requiredTier: 'basic',
        featureKey: 'professional_network',
      },
    ],
  },
  {
    id: 'development',
    label: 'Development',
    defaultExpanded: false,
    items: [
      {
        id: 'learning',
        label: 'Learning',
        description: 'Courses and certifications',
        icon: GraduationCap,
        route: '/free/learning',
        roles: ['client'],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    defaultExpanded: false,
    items: [
      {
        id: 'finance',
        label: 'Finance',
        description: 'Invoices, payments, reports',
        icon: DollarSign,
        route: '/free/finance',
        roles: ['client'],
        requiredTier: 'pro',
        featureKey: 'advanced_finance',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    defaultExpanded: false,
    collapsible: false,
    items: [
      {
        id: 'help',
        label: 'Help',
        description: 'Support articles',
        icon: HelpCircle,
        route: '/free/help',
        roles: ['client'],
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Account preferences',
        icon: Settings,
        route: '/free/settings',
        roles: ['client'],
      },
    ],
  },
];

// ============================================================================
// ENGINEER PORTAL MENU
// ============================================================================

export const ENGINEER_MENU: MenuSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    defaultExpanded: true,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Your command center',
        icon: LayoutDashboard,
        route: '/engineer/dashboard',
        roles: ['engineer'],
      },
      {
        id: 'jobs',
        label: 'Jobs',
        description: 'Find and apply for jobs',
        icon: Briefcase,
        route: '/engineer/jobs',
        roles: ['engineer'],
      },
      {
        id: 'calendar',
        label: 'Calendar',
        description: 'Schedule and events',
        icon: Calendar,
        route: '/engineer/calendar',
        roles: ['engineer'],
      },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    defaultExpanded: true,
    items: [
      {
        id: 'checkin',
        label: 'Check-In',
        description: 'Geofenced time tracking',
        icon: Clock,
        route: '/engineer/checkin',
        roles: ['engineer'],
      },
      {
        id: 'upload',
        label: 'Upload Deliverable',
        description: 'Submit work deliverables',
        icon: Upload,
        route: '/engineer/job/upload',
        roles: ['engineer'],
      },
    ],
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    defaultExpanded: true,
    items: [
      {
        id: 'ai-assistant',
        label: 'AI Assistant',
        description: 'AI-powered assistance',
        icon: Bot,
        route: '/engineer/ai',
        roles: ['engineer'],
        requiredTier: 'basic',
        featureKey: 'ai_assistant',
      },
    ],
  },
  {
    id: 'professional',
    label: 'Professional',
    defaultExpanded: false,
    items: [
      {
        id: 'profile',
        label: 'Profile',
        description: 'Your professional profile',
        icon: Users,
        route: '/engineer/profile',
        roles: ['engineer'],
      },
      {
        id: 'ranking',
        label: 'Ranking',
        description: 'Annual prizes & leaderboard',
        icon: Trophy,
        route: '/engineer/ranking',
        roles: ['engineer'],
        requiredTier: 'pro',
        featureKey: 'ranking_system',
      },
      {
        id: 'network',
        label: 'Network',
        description: 'Professional connections',
        icon: Network,
        route: '/engineer/network',
        roles: ['engineer'],
        requiredTier: 'basic',
      },
    ],
  },
  {
    id: 'development',
    label: 'Development',
    defaultExpanded: false,
    items: [
      {
        id: 'learning',
        label: 'Learning',
        description: 'Courses and skills',
        icon: GraduationCap,
        route: '/engineer/learning',
        roles: ['engineer'],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    defaultExpanded: false,
    items: [
      {
        id: 'messages',
        label: 'Messages',
        description: 'Client communications',
        icon: MessageSquare,
        route: '/engineer/messages',
        roles: ['engineer'],
      },
      {
        id: 'finance',
        label: 'Finance',
        description: 'Earnings and payments',
        icon: DollarSign,
        route: '/engineer/finance',
        roles: ['engineer'],
        requiredTier: 'pro',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    defaultExpanded: false,
    collapsible: false,
    items: [
      {
        id: 'help',
        label: 'Help',
        description: 'Support center',
        icon: HelpCircle,
        route: '/engineer/help',
        roles: ['engineer'],
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Account settings',
        icon: Settings,
        route: '/engineer/settings',
        roles: ['engineer'],
      },
    ],
  },
];

// ============================================================================
// ENTERPRISE PORTAL MENU
// ============================================================================

export const ENTERPRISE_MENU: MenuSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    defaultExpanded: true,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Enterprise analytics',
        icon: LayoutDashboard,
        route: '/enterprise/dashboard',
        roles: ['enterprise'],
      },
      {
        id: 'team',
        label: 'Team',
        description: 'Manage your team',
        icon: Users,
        route: '/enterprise/team',
        roles: ['enterprise'],
      },
      {
        id: 'calendar',
        label: 'Calendar',
        description: 'Company calendar',
        icon: Calendar,
        route: '/enterprise/calendar',
        roles: ['enterprise'],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    defaultExpanded: true,
    items: [
      {
        id: 'projects',
        label: 'Projects',
        description: 'All company projects',
        icon: Briefcase,
        route: '/enterprise/projects',
        roles: ['enterprise'],
      },
      {
        id: 'procurement',
        label: 'Procurement',
        description: 'Resource procurement',
        icon: Package,
        route: '/enterprise/procurement',
        roles: ['enterprise'],
      },
      {
        id: 'reports',
        label: 'Reports',
        description: 'Analytics and insights',
        icon: BarChart3,
        route: '/enterprise/reports',
        roles: ['enterprise'],
        requiredTier: 'enterprise',
      },
    ],
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    defaultExpanded: true,
    items: [
      {
        id: 'ai-assistant',
        label: 'AI Assistant',
        description: 'Enterprise AI assistance',
        icon: Bot,
        route: '/enterprise/ai',
        roles: ['enterprise'],
        requiredTier: 'pro',
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    defaultExpanded: false,
    items: [
      {
        id: 'finance',
        label: 'Finance',
        description: 'Financial management',
        icon: DollarSign,
        route: '/enterprise/finance',
        roles: ['enterprise'],
      },
      {
        id: 'learning',
        label: 'Learning',
        description: 'Team training',
        icon: GraduationCap,
        route: '/enterprise/learning',
        roles: ['enterprise'],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    defaultExpanded: false,
    collapsible: false,
    items: [
      {
        id: 'help',
        label: 'Help',
        description: 'Enterprise support',
        icon: HelpCircle,
        route: '/enterprise/help',
        roles: ['enterprise'],
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Company settings',
        icon: Settings,
        route: '/enterprise/settings',
        roles: ['enterprise'],
      },
    ],
  },
];

// ============================================================================
// ADMIN PORTAL MENU
// ============================================================================

export const ADMIN_MENU: MenuSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    defaultExpanded: true,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Admin command center',
        icon: LayoutDashboard,
        route: '/admin/dashboard',
        roles: ['admin'],
      },
      {
        id: 'users',
        label: 'Users',
        description: 'User management',
        icon: Users,
        route: '/admin/users',
        roles: ['admin'],
      },
      {
        id: 'analytics',
        label: 'Analytics',
        description: 'Platform analytics',
        icon: BarChart3,
        route: '/admin/analytics',
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    defaultExpanded: true,
    items: [
      {
        id: 'projects',
        label: 'Projects',
        description: 'All platform projects',
        icon: Briefcase,
        route: '/admin/projects',
        roles: ['admin'],
      },
      {
        id: 'payments',
        label: 'Payments',
        description: 'Payment oversight',
        icon: DollarSign,
        route: '/admin/payments',
        roles: ['admin'],
      },
      {
        id: 'risk-center',
        label: 'Risk Center',
        description: 'Risk management',
        icon: Shield,
        route: '/admin/risk-center',
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    defaultExpanded: false,
    collapsible: false,
    items: [
      {
        id: 'messages',
        label: 'Messages',
        description: 'Support tickets',
        icon: MessageSquare,
        route: '/admin/messages',
        roles: ['admin'],
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Platform settings',
        icon: Settings,
        route: '/admin/settings',
        roles: ['admin'],
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get menu configuration for a specific role
 */
export function getMenuForRole(role: UserRole): MenuSection[] {
  const menus: Record<UserRole, MenuSection[]> = {
    client: CLIENT_MENU,
    engineer: ENGINEER_MENU,
    enterprise: ENTERPRISE_MENU,
    admin: ADMIN_MENU,
  };
  
  return menus[role] || [];
}

/**
 * Get all menu items (flattened) for a role
 */
export function getAllMenuItems(role: UserRole): MenuItem[] {
  const sections = getMenuForRole(role);
  return sections.flatMap(section => section.items);
}

/**
 * Find menu item by route
 */
export function findMenuItemByRoute(role: UserRole, route: string): MenuItem | undefined {
  const items = getAllMenuItems(role);
  return items.find(item => item.route === route);
}

/**
 * Count locked items for a specific tier
 */
export function countLockedItems(role: UserRole, currentTier: SubscriptionTier): number {
  const items = getAllMenuItems(role);
  return items.filter(item => {
    if (!item.requiredTier) return false;
    const tierOrder: Record<SubscriptionTier, number> = {
      free: 0,
      basic: 1,
      pro: 2,
      enterprise: 3,
    };
    return tierOrder[currentTier] < tierOrder[item.requiredTier];
  }).length;
}

