/**
 * Unified Menu Configuration - Tier-Based
 * 
 * Single source of truth for all portal navigation based on subscription tiers
 * (Free → Basic → Pro → Enterprise). Replaces role-based menu logic.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/1 2- 🧭 Menu Navigation
 */

import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  PresentationChartBar,
  Calendar,
  Users,
  Briefcase,
  PlusCircle,
  DocumentText,
  Folder,
  ClipboardDocumentList,
  CpuChip,
  Sparkles,
  Bars3BottomLeft,
  CurrencyDollar,
  ArrowPath,
  CheckCircle,
  ChatBubbleLeftEllipsis,
  ArchiveBoxArrowDown,
  ChatBubbleOvalLeft,
  UserGroup,
  BookOpen,
  AcademicCap,
  Banknotes,
  Clock,
  CreditCard,
  UsersCog,
  BuildingOffice2,
  DocumentCheck,
  ChartPie,
  QuestionMarkCircle,
  Cog6Tooth,
} from 'lucide-react';
import type { SubscriptionTier } from '@/shared/types/subscription';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Tier-based menu item configuration
 */
export interface TierMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label */
  label: string;
  /** Optional description/tooltip */
  description?: string;
  /** Lucide React icon component */
  icon: LucideIcon;
  /** Route path (unified paths, not role-based) */
  route: string;
  /** Minimum subscription tier required ('free' | 'basic' | 'pro' | 'enterprise') */
  plan: SubscriptionTier;
  /** Optional feature ID for feature flag checks */
  featureId?: string;
  /** Optional badge text/count */
  badge?: string | number;
  /** Nested children items (for grouped navigation) */
  children?: TierMenuItem[];
}

/**
 * Menu section/group
 */
export interface TierMenuSection {
  /** Section identifier */
  id: string;
  /** Section label */
  label: string;
  /** Items in this section */
  items: TierMenuItem[];
  /** Whether section can be collapsed */
  collapsible?: boolean;
  /** Default expanded state */
  defaultExpanded?: boolean;
}

// ============================================================================
// MENU CONFIGURATION
// ============================================================================

/**
 * Complete menu configuration organized by sections
 */
export const menuConfig: TierMenuSection[] = [
  // ==========================================================================
  // CORE
  // ==========================================================================
  {
    id: 'core',
    label: 'Core',
    defaultExpanded: true,
    collapsible: false,
    items: [
      {
        id: 'overview',
        label: 'Overview',
        description: 'Platform introduction and getting started',
        icon: LayoutDashboard,
        route: '/overview',
        plan: 'free',
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Project overview, AI assistant, quick actions',
        icon: PresentationChartBar,
        route: '/dashboard',
        plan: 'free',
      },
      {
        id: 'calendar',
        label: 'Calendar',
        description: 'Multi-source event visualization',
        icon: Calendar,
        route: '/calendar',
        plan: 'free',
      },
    ],
  },

  // ==========================================================================
  // ENGINEERS / JOBS
  // ==========================================================================
  {
    id: 'talent',
    label: 'Talent & Jobs',
    defaultExpanded: true,
    items: [
      {
        id: 'browse-engineers',
        label: 'Browse Engineers',
        description: 'Find and hire verified Saudi engineers',
        icon: Users,
        route: '/engineers',
        plan: 'basic',
      },
      {
        id: 'browse-jobs',
        label: 'Browse Jobs',
        description: 'Intelligent job feed powered by project category',
        icon: Briefcase,
        route: '/jobs',
        plan: 'free',
      },
      {
        id: 'post-job',
        label: 'Post New Job',
        description: '4-step guided job post wizard with AI estimator',
        icon: PlusCircle,
        route: '/post-job',
        plan: 'basic',
      },
      {
        id: 'applications',
        label: 'Applications',
        description: 'Application pipeline management and shortlisting',
        icon: DocumentText,
        route: '/applications',
        plan: 'free',
      },
    ],
  },

  // ==========================================================================
  // PROJECTS
  // ==========================================================================
  {
    id: 'projects',
    label: 'Projects',
    defaultExpanded: true,
    items: [
      {
        id: 'projects',
        label: 'Projects',
        description: 'Unified project dashboard with progress and deliverables',
        icon: Folder,
        route: '/projects',
        plan: 'free',
      },
      {
        id: 'my-projects',
        label: 'My Projects',
        description: 'Personalized workspace listing owned projects',
        icon: ClipboardDocumentList,
        route: '/my-projects',
        plan: 'free',
      },
    ],
  },

  // ==========================================================================
  // AI TOOLS
  // ==========================================================================
  {
    id: 'ai-tools',
    label: 'AI Tools',
    defaultExpanded: true,
    items: [
      {
        id: 'ai-tools',
        label: 'AI Tools',
        description: 'Central entry for all AI-powered modules',
        icon: CpuChip,
        route: '/ai-tools',
        plan: 'pro',
      },
      {
        id: 'ai-assistant',
        label: 'AI Assistant',
        description: 'Contextual chatbot for workflows and document drafting',
        icon: Sparkles,
        route: '/ai-tools/assistant',
        plan: 'pro',
      },
      {
        id: 'project-planning',
        label: 'Project Planning',
        description: 'WBS builder, risk matrix, timeline automation',
        icon: Bars3BottomLeft,
        route: '/ai-tools/planning',
        plan: 'pro',
      },
      {
        id: 'cost-budgeting',
        label: 'Cost & Budgeting',
        description: 'Budget planner, estimator, and ROI simulator',
        icon: CurrencyDollar,
        route: '/ai-tools/budgeting',
        plan: 'pro',
      },
      {
        id: 'execution-coordination',
        label: 'Execution & Coordination',
        description: 'Auto-schedule generator and progress tracker',
        icon: ArrowPath,
        route: '/ai-tools/execution',
        plan: 'pro',
      },
      {
        id: 'quality-compliance',
        label: 'Quality & Compliance',
        description: 'Standard checker and report generator',
        icon: CheckCircle,
        route: '/ai-tools/quality',
        plan: 'pro',
      },
      {
        id: 'communication-reporting',
        label: 'Communication & Reporting',
        description: 'AI report compiler with templated outputs',
        icon: ChatBubbleLeftEllipsis,
        route: '/ai-tools/communication',
        plan: 'pro',
      },
      {
        id: 'closure-handover',
        label: 'Closure & Handover',
        description: 'Packaging deliverables and generating closure docs',
        icon: ArchiveBoxArrowDown,
        route: '/ai-tools/closure',
        plan: 'pro',
      },
    ],
  },

  // ==========================================================================
  // COMMUNICATION
  // ==========================================================================
  {
    id: 'communication',
    label: 'Communication',
    defaultExpanded: false,
    items: [
      {
        id: 'messages',
        label: 'Messages',
        description: 'Real-time communication with attachments and read receipts',
        icon: ChatBubbleOvalLeft,
        route: '/messages',
        plan: 'basic',
      },
      {
        id: 'network',
        label: 'Network',
        description: 'Directory of verified professionals and organizations',
        icon: UserGroup,
        route: '/network',
        plan: 'basic',
      },
    ],
  },

  // ==========================================================================
  // LEARNING & DEVELOPMENT
  // ==========================================================================
  {
    id: 'learning',
    label: 'Learning & Development',
    defaultExpanded: false,
    items: [
      {
        id: 'learning',
        label: 'Learning',
        description: 'Core education hub: tutorials, certifications, progress tracking',
        icon: BookOpen,
        route: '/learning',
        plan: 'free',
      },
      {
        id: 'development',
        label: 'Development',
        description: 'Professional development and skill building',
        icon: AcademicCap,
        route: '/development',
        plan: 'free',
      },
    ],
  },

  // ==========================================================================
  // BUSINESS & FINANCE
  // ==========================================================================
  {
    id: 'finance',
    label: 'Business & Finance',
    defaultExpanded: false,
    items: [
      {
        id: 'finance',
        label: 'Finance',
        description: 'Manage invoices, payments, and reconciliation logs',
        icon: Banknotes,
        route: '/finance',
        plan: 'pro',
      },
      {
        id: 'timesheets',
        label: 'Timesheets',
        description: 'Record work hours, approvals, and cost analysis',
        icon: Clock,
        route: '/timesheets',
        plan: 'pro',
      },
      {
        id: 'subscription',
        label: 'Subscription',
        description: 'Current plan, billing, and upgrade flow',
        icon: CreditCard,
        route: '/subscription',
        plan: 'free',
      },
    ],
  },

  // ==========================================================================
  // ENTERPRISE OPS
  // ==========================================================================
  {
    id: 'enterprise',
    label: 'Enterprise Ops',
    defaultExpanded: false,
    items: [
      {
        id: 'workforce-mgmt',
        label: 'Workforce Mgmt',
        description: 'Manage engineers, rates, and capacity planning',
        icon: UsersCog,
        route: '/enterprise/workforce',
        plan: 'enterprise',
      },
      {
        id: 'teams-mgmt',
        label: 'Teams Mgmt',
        description: 'Organizational hierarchy, access control, roles',
        icon: Users,
        route: '/enterprise/teams',
        plan: 'enterprise',
      },
      {
        id: 'contracts-compliance',
        label: 'Contracts & Compliance',
        description: 'Manage vendor SLAs, audit logs, and document trails',
        icon: DocumentCheck,
        route: '/enterprise/contracts',
        plan: 'enterprise',
      },
      {
        id: 'company-profile',
        label: 'Company Profile',
        description: 'Enterprise-level branding, data, and identity setup',
        icon: BuildingOffice2,
        route: '/enterprise/profile',
        plan: 'enterprise',
      },
      {
        id: 'business-intelligence',
        label: 'Business Intelligence',
        description: 'Cross-project analytics, performance insights, and forecasting',
        icon: ChartPie,
        route: '/enterprise/bi',
        plan: 'enterprise',
      },
    ],
  },

  // ==========================================================================
  // SETTINGS & SUPPORT
  // ==========================================================================
  {
    id: 'settings',
    label: 'Settings & Support',
    defaultExpanded: false,
    collapsible: false,
    items: [
      {
        id: 'help',
        label: 'Help',
        description: 'Knowledge base, tutorials, and AI helpdesk assistant',
        icon: QuestionMarkCircle,
        route: '/help',
        plan: 'free',
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Preferences, appearance, notifications, and 2FA configuration',
        icon: Cog6Tooth,
        route: '/settings',
        plan: 'free',
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get menu items filtered by subscription tier
 * 
 * Returns all menu items visible to the user based on their tier.
 * Uses tierMeetsRequirement to determine visibility.
 * 
 * @param tier - User's subscription tier
 * @returns Array of menu items the user can access
 * 
 * @example
 * ```tsx
 * const { subscriptionTier } = usePortalAccess();
 * const visibleMenu = getMenuForTier(subscriptionTier);
 * ```
 */
export function getMenuForTier(tier: SubscriptionTier): TierMenuItem[] {
  const allItems: TierMenuItem[] = [];
  
  // Flatten all sections and filter by tier
  for (const section of menuConfig) {
    for (const item of section.items) {
      // Check if user's tier meets requirement
      if (tierMeetsRequirement(tier, item.plan)) {
        // Include children if they also meet tier requirements
        const filteredChildren = item.children?.filter(child =>
          tierMeetsRequirement(tier, child.plan)
        );
        
        allItems.push({
          ...item,
          children: filteredChildren?.length ? filteredChildren : undefined,
        });
      }
    }
  }
  
  return allItems;
}

/**
 * Get menu sections filtered by subscription tier
 * 
 * Returns sections with items filtered based on tier visibility.
 * 
 * @param tier - User's subscription tier
 * @returns Array of menu sections with filtered items
 */
export function getMenuSectionsForTier(tier: SubscriptionTier): TierMenuSection[] {
  return menuConfig.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // Filter items that meet tier requirement
      const itemVisible = tierMeetsRequirement(tier, item.plan);
      
      // Filter children if they exist
      if (item.children) {
        const visibleChildren = item.children.filter(child =>
          tierMeetsRequirement(tier, child.plan)
        );
        
        // Include parent if it's visible OR has visible children
        return itemVisible || visibleChildren.length > 0
          ? { ...item, children: visibleChildren }
          : false;
      }
      
      return itemVisible;
    }) as TierMenuItem[],
  })).filter(section => section.items.length > 0); // Remove empty sections
}

/**
 * Find a menu item by route path
 * 
 * @param route - Route path to search for
 * @returns Menu item if found, undefined otherwise
 */
export function findMenuItemByRoute(route: string): TierMenuItem | undefined {
  for (const section of menuConfig) {
    for (const item of section.items) {
      if (item.route === route) {
        return item;
      }
      
      // Check children
      if (item.children) {
        const child = item.children.find(c => c.route === route);
        if (child) return child;
      }
    }
  }
  
  return undefined;
}

/**
 * Find a menu item by ID
 * 
 * @param id - Menu item ID
 * @returns Menu item if found, undefined otherwise
 */
export function findMenuItemById(id: string): TierMenuItem | undefined {
  for (const section of menuConfig) {
    for (const item of section.items) {
      if (item.id === id) {
        return item;
      }
      
      // Check children
      if (item.children) {
        const child = item.children.find(c => c.id === id);
        if (child) return child;
      }
    }
  }
  
  return undefined;
}

/**
 * Get all menu items (flattened) for a specific tier
 * 
 * @param tier - Subscription tier
 * @returns Flattened array of all accessible menu items
 */
export function getAllMenuItemsForTier(tier: SubscriptionTier): TierMenuItem[] {
  return getMenuForTier(tier);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { TierMenuItem, TierMenuSection };

