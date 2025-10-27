/**
 * Unified Portal Registry
 * 
 * Single source of truth for all portal routes across Client, Engineer,
 * and Enterprise portals. Defines all 53 pages with metadata, permissions,
 * categories, and navigation structure.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import type {
  PortalRegistry,
  PortalDefinition,
  PageDefinition,
  NavigationGroup,
  UserRole,
  PortalCategory,
} from './portalTypes';

// ============================================================================
// CLIENT PORTAL (15 Pages)
// ============================================================================

const CLIENT_PAGES: PageDefinition[] = [
  {
    id: 'client-overview',
    title: 'Overview',
    description: 'Platform introduction and getting started guide',
    path: '/free/overview',
    icon: 'Home',
    component: 'src/pages/4-free/1-OverviewPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'overview',
    order: 1,
    showInSidebar: true,
  },
  {
    id: 'client-dashboard',
    title: 'Dashboard',
    description: 'Project overview, AI assistant, quick actions',
    path: '/free/dashboard',
    icon: 'LayoutDashboard',
    component: 'src/pages/4-free/2-DashboardPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'dashboard',
    order: 2,
    showInSidebar: true,
  },
  {
    id: 'client-browse-engineers',
    title: 'Browse Engineers',
    description: 'Find and hire verified Saudi engineers',
    path: '/free/browse-engineers',
    icon: 'Users',
    component: 'src/pages/4-free/3-BrowseEngineersPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'browse',
    order: 3,
    showInSidebar: true,
  },
  {
    id: 'client-post-job',
    title: 'Post a Job',
    description: '4-step job posting wizard',
    path: '/free/post-job',
    icon: 'Briefcase',
    component: 'src/pages/4-free/4-PostJobPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'projects',
    order: 4,
    showInSidebar: true,
    badge: { text: 'New', variant: 'default' },
  },
  {
    id: 'client-calendar',
    title: 'Calendar',
    description: 'Project milestones and meeting scheduling',
    path: '/free/calendar',
    icon: 'Calendar',
    component: 'src/pages/4-free/5-CalendarPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'calendar',
    order: 5,
    showInSidebar: true,
  },
  {
    id: 'client-messages',
    title: 'Messages',
    description: 'Communication with engineers and support',
    path: '/free/messages',
    icon: 'MessageSquare',
    component: 'src/pages/4-free/6-MessagesPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'communication',
    order: 6,
    showInSidebar: true,
  },
  {
    id: 'client-learning',
    title: 'Learning',
    description: 'Construction management courses and resources',
    path: '/free/learning',
    icon: 'GraduationCap',
    component: 'src/pages/4-free/7-LearningPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'development',
    order: 7,
    showInSidebar: true,
  },
  {
    id: 'client-ai-assistant',
    title: 'AI Assistant',
    description: 'Multi-mode AI chat with 30 construction prompts',
    path: '/free/ai',
    icon: 'Bot',
    component: 'src/pages/4-free/8-AIAssistantPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'ai-tools',
    order: 8,
    showInSidebar: true,
    badge: { text: 'AI', variant: 'default' },
  },
  {
    id: 'client-network',
    title: 'Network',
    description: 'Professional connections and collaboration',
    path: '/free/network',
    icon: 'Users2',
    component: 'src/pages/4-free/10-NetworkPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'communication',
    order: 10,
    showInSidebar: true,
  },
  {
    id: 'client-finance',
    title: 'Finance',
    description: 'Invoices, payments, billing management',
    path: '/free/finance',
    icon: 'DollarSign',
    component: 'src/pages/4-free/11-FinancePage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'business',
    order: 11,
    showInSidebar: true,
  },
  {
    id: 'client-my-projects',
    title: 'My Projects',
    description: 'Active and archived project management',
    path: '/free/my-projects',
    icon: 'FolderOpen',
    component: 'src/pages/4-free/12-MyProjectsPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'projects',
    order: 12,
    showInSidebar: true,
  },
  {
    id: 'client-subscription',
    title: 'Subscription',
    description: 'Manage subscription and billing',
    path: '/free/subscription',
    icon: 'CreditCard',
    component: 'src/pages/4-free/13-SubscriptionPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'business',
    order: 13,
    showInSidebar: true,
  },
  {
    id: 'client-help',
    title: 'Help & Support',
    description: 'FAQ, tutorials, and customer support',
    path: '/free/help',
    icon: 'HelpCircle',
    component: 'src/pages/4-free/14-HelpPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'support',
    order: 14,
    showInSidebar: true,
  },
  {
    id: 'client-settings',
    title: 'Settings',
    description: 'Account preferences and configuration',
    path: '/free/settings',
    icon: 'Settings',
    component: 'src/pages/4-free/9-SettingsPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'support',
    order: 15,
    showInSidebar: true,
  },
  // AI Tools Hub (with children)
  {
    id: 'client-ai-tools-planning',
    title: 'AI Tools - Planning',
    description: 'AI-powered project planning tools',
    path: '/free/ai-tools/planning',
    icon: 'Rocket',
    component: 'src/pages/4-free/15-AIToolsPlanningPage.tsx',
    permissions: { allowedRoles: ['client'] },
    category: 'ai-tools',
    order: 16,
    showInSidebar: true,
    badge: { text: 'AI', variant: 'default' },
    children: [
      {
        id: 'client-ai-tools-planning-charter',
        title: 'Project Charter',
        description: 'AI-powered project charter generation',
        path: '/free/ai-tools/planning/charter',
        icon: 'FileText',
        component: 'src/pages/4-free/others/features/ai-tools/pages/CharterToolPage.tsx',
        permissions: { allowedRoles: ['client'] },
        category: 'ai-tools',
        order: 1,
        showInSidebar: false,
        parentId: 'client-ai-tools-planning',
      },
      {
        id: 'client-ai-tools-planning-wbs',
        title: 'WBS Builder',
        description: 'Work breakdown structure with AI assistance',
        path: '/free/ai-tools/planning/wbs',
        icon: 'Network',
        component: 'src/pages/4-free/others/features/ai-tools/pages/WBSToolPage.tsx',
        permissions: { allowedRoles: ['client'] },
        category: 'ai-tools',
        order: 2,
        showInSidebar: false,
        parentId: 'client-ai-tools-planning',
      },
      {
        id: 'client-ai-tools-planning-stakeholders',
        title: 'Stakeholder Mapper',
        description: 'Power/interest matrix for stakeholder analysis',
        path: '/free/ai-tools/planning/stakeholders',
        icon: 'Users',
        component: 'src/pages/4-free/others/features/ai-tools/pages/StakeholdersToolPage.tsx',
        permissions: { allowedRoles: ['client'] },
        category: 'ai-tools',
        order: 3,
        showInSidebar: false,
        parentId: 'client-ai-tools-planning',
      },
      {
        id: 'client-ai-tools-planning-risks',
        title: 'Risk Register',
        description: '5×5 risk matrix with mitigation strategies',
        path: '/free/ai-tools/planning/risks',
        icon: 'AlertTriangle',
        component: 'src/pages/4-free/others/features/ai-tools/pages/RisksToolPage.tsx',
        permissions: { allowedRoles: ['client'] },
        category: 'ai-tools',
        order: 4,
        showInSidebar: false,
        parentId: 'client-ai-tools-planning',
      },
      {
        id: 'client-ai-tools-planning-timeline',
        title: 'Timeline Builder',
        description: 'Gantt chart with critical path analysis',
        path: '/free/ai-tools/planning/timeline',
        icon: 'Calendar',
        component: 'src/pages/4-free/others/features/ai-tools/pages/TimelineToolPage.tsx',
        permissions: { allowedRoles: ['client'] },
        category: 'ai-tools',
        order: 5,
        showInSidebar: false,
        parentId: 'client-ai-tools-planning',
      },
      {
        id: 'client-ai-tools-planning-resources',
        title: 'Resource Planner',
        description: 'Team allocation and workload optimization',
        path: '/free/ai-tools/planning/resources',
        icon: 'Users2',
        component: 'src/pages/4-free/others/features/ai-tools/pages/ResourcesToolPage.tsx',
        permissions: { allowedRoles: ['client'] },
        category: 'ai-tools',
        order: 6,
        showInSidebar: false,
        parentId: 'client-ai-tools-planning',
      },
    ],
  },
];

// ============================================================================
// ENGINEER PORTAL (14 Pages)
// ============================================================================

const ENGINEER_PAGES: PageDefinition[] = [
  {
    id: 'engineer-dashboard',
    title: 'Dashboard',
    description: 'Command center with AI assistant and quick actions',
    path: '/engineer/dashboard',
    icon: 'LayoutDashboard',
    component: 'src/pages/5-engineer/1-DashboardPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'dashboard',
    order: 1,
    showInSidebar: true,
  },
  {
    id: 'engineer-jobs',
    title: 'Jobs',
    description: 'AI-powered job matching and earnings calculator',
    path: '/engineer/jobs',
    icon: 'Briefcase',
    component: 'src/pages/5-engineer/2-JobsPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'browse',
    order: 2,
    showInSidebar: true,
  },
  {
    id: 'engineer-calendar',
    title: 'Calendar',
    description: 'Schedule management and availability tracking',
    path: '/engineer/calendar',
    icon: 'Calendar',
    component: 'src/pages/5-engineer/3-CalendarPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'calendar',
    order: 3,
    showInSidebar: true,
  },
  {
    id: 'engineer-messages',
    title: 'Messages',
    description: 'Professional communication hub',
    path: '/engineer/messages',
    icon: 'MessageSquare',
    component: 'src/pages/5-engineer/4-MessagesPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'communication',
    order: 4,
    showInSidebar: true,
  },
  {
    id: 'engineer-ai-assistant',
    title: 'AI Assistant',
    description: 'Multi-mode AI chat with specialized engineering prompts',
    path: '/engineer/ai',
    icon: 'Bot',
    component: 'src/pages/5-engineer/8-AIAssistantPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'ai-tools',
    order: 5,
    showInSidebar: true,
    badge: { text: 'AI', variant: 'default' },
  },
  {
    id: 'engineer-network',
    title: 'Network',
    description: 'Professional connections and collaboration',
    path: '/engineer/network',
    icon: 'Users2',
    component: 'src/pages/5-engineer/9-NetworkPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'communication',
    order: 6,
    showInSidebar: true,
  },
  {
    id: 'engineer-learning',
    title: 'Learning',
    description: 'Professional development and certifications',
    path: '/engineer/learning',
    icon: 'GraduationCap',
    component: 'src/pages/5-engineer/7-LearningPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'development',
    order: 7,
    showInSidebar: true,
    children: [
      {
        id: 'engineer-learning-course',
        title: 'Course Detail',
        description: 'Full-screen course player and curriculum',
        path: '/engineer/learning/course/:courseId',
        icon: 'PlayCircle',
        component: 'src/pages/5-engineer/7-LearningPage.tsx', // Dynamic route
        permissions: { allowedRoles: ['engineer'] },
        category: 'development',
        order: 1,
        showInSidebar: false,
        parentId: 'engineer-learning',
      },
    ],
  },
  {
    id: 'engineer-finance',
    title: 'Finance',
    description: 'Earnings, invoices, and payment tracking',
    path: '/engineer/finance',
    icon: 'DollarSign',
    component: 'src/pages/5-engineer/6-FinancePage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'business',
    order: 8,
    showInSidebar: true,
  },
  {
    id: 'engineer-check-in',
    title: 'Check-In',
    description: 'Geofencing, time tracking, and site analytics',
    path: '/engineer/check-in',
    icon: 'MapPin',
    component: 'src/pages/5-engineer/12-CheckInPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'projects',
    order: 9,
    showInSidebar: true,
  },
  {
    id: 'engineer-upload-deliverable',
    title: 'Upload Deliverable',
    description: 'Submit project deliverables with QA checklist',
    path: '/engineer/upload-deliverable',
    icon: 'Upload',
    component: 'src/pages/5-engineer/10-UploadDeliverablePage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'projects',
    order: 10,
    showInSidebar: true,
  },
  {
    id: 'engineer-ranking',
    title: 'Ranking',
    description: 'Annual prizes (SAR 2M+) and leaderboard',
    path: '/engineer/ranking',
    icon: 'Trophy',
    component: 'src/pages/5-engineer/13-RankingPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'development',
    order: 11,
    showInSidebar: true,
    badge: { text: 'SAR 2M+', variant: 'destructive' },
  },
  {
    id: 'engineer-profile',
    title: 'Profile',
    description: 'LinkedIn-style professional profile',
    path: '/engineer/profile',
    icon: 'User',
    component: 'src/pages/5-engineer/5-ProfilePage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'support',
    order: 12,
    showInSidebar: true,
  },
  {
    id: 'engineer-help',
    title: 'Help & Support',
    description: 'Documentation and customer support',
    path: '/engineer/help',
    icon: 'HelpCircle',
    component: 'src/pages/5-engineer/14-ReportsPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'support',
    order: 13,
    showInSidebar: true,
  },
  {
    id: 'engineer-settings',
    title: 'Settings',
    description: 'Account preferences and configuration',
    path: '/engineer/settings',
    icon: 'Settings',
    component: 'src/pages/5-engineer/11-SettingsPage.tsx',
    permissions: { allowedRoles: ['engineer'] },
    category: 'support',
    order: 14,
    showInSidebar: true,
  },
];

// ============================================================================
// ENTERPRISE PORTAL (18 Pages)
// ============================================================================

const ENTERPRISE_PAGES: PageDefinition[] = [
  {
    id: 'enterprise-dashboard',
    title: 'Dashboard',
    description: 'Executive KPIs and organizational metrics',
    path: '/enterprise/dashboard',
    icon: 'LayoutDashboard',
    component: 'src/pages/6-enterprise/1-DashboardPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'dashboard',
    order: 1,
    showInSidebar: true,
  },
  {
    id: 'enterprise-workforce',
    title: 'Workforce Management',
    description: 'Talent pool, assignments, and performance',
    path: '/enterprise/workforce',
    icon: 'Users',
    component: 'src/pages/6-enterprise/2-WorkforceManagementPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 2,
    showInSidebar: true,
  },
  {
    id: 'enterprise-browse-engineers',
    title: 'Browse Engineers',
    description: 'Advanced search and vetting',
    path: '/enterprise/browse-engineers',
    icon: 'Search',
    component: 'src/pages/6-enterprise/3-BrowseEngineersPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'browse',
    order: 3,
    showInSidebar: true,
  },
  {
    id: 'enterprise-calendar',
    title: 'Calendar',
    description: 'Enterprise-wide scheduling and capacity planning',
    path: '/enterprise/calendar',
    icon: 'Calendar',
    component: 'src/pages/6-enterprise/4-CalendarPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'calendar',
    order: 4,
    showInSidebar: true,
  },
  {
    id: 'enterprise-projects',
    title: 'Projects',
    description: 'Portfolio management and strategic alignment',
    path: '/enterprise/projects',
    icon: 'FolderKanban',
    component: 'src/pages/6-enterprise/5-ProjectsPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'projects',
    order: 5,
    showInSidebar: true,
  },
  {
    id: 'enterprise-post-jobs',
    title: 'Post Multiple Jobs',
    description: 'Bulk job posting with templates',
    path: '/enterprise/post-jobs',
    icon: 'Briefcase',
    component: 'src/pages/6-enterprise/6-PostMultipleJobsPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'projects',
    order: 6,
    showInSidebar: true,
  },
  {
    id: 'enterprise-ai-tools',
    title: 'AI Tools Hub',
    description: 'Comprehensive AI tool suite (7 hubs)',
    path: '/enterprise/ai-tools',
    icon: 'Sparkles',
    component: 'src/pages/6-enterprise/7-AIToolsPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'ai-tools',
    order: 7,
    showInSidebar: true,
    badge: { text: 'AI', variant: 'default' },
  },
  {
    id: 'enterprise-communication',
    title: 'Communication',
    description: 'Enterprise hub and department coordination',
    path: '/enterprise/communication',
    icon: 'MessageSquare',
    component: 'src/pages/6-enterprise/8-CommunicationPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'communication',
    order: 8,
    showInSidebar: true,
  },
  {
    id: 'enterprise-teams',
    title: 'Teams',
    description: 'Department structure and role assignments',
    path: '/enterprise/teams',
    icon: 'Users2',
    component: 'src/pages/6-enterprise/9-TeamsPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 9,
    showInSidebar: true,
  },
  {
    id: 'enterprise-learning',
    title: 'Learning & Development',
    description: 'Corporate training and certification management',
    path: '/enterprise/learning',
    icon: 'GraduationCap',
    component: 'src/pages/6-enterprise/10-LearningPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'development',
    order: 10,
    showInSidebar: true,
  },
  {
    id: 'enterprise-company-profile',
    title: 'Company Profile',
    description: 'Corporate capabilities and portfolio',
    path: '/enterprise/company-profile',
    icon: 'Building2',
    component: 'src/pages/6-enterprise/13-CompanyProfilePage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 11,
    showInSidebar: true,
  },
  {
    id: 'enterprise-business-intelligence',
    title: 'Business Intelligence',
    description: 'Advanced analytics and predictive modeling',
    path: '/enterprise/business-intelligence',
    icon: 'BarChart3',
    component: 'src/pages/6-enterprise/14-BusinessIntelligencePage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 12,
    showInSidebar: true,
    badge: { text: 'Pro', variant: 'default' },
  },
  {
    id: 'enterprise-finance',
    title: 'Finance',
    description: 'Enterprise accounting, AP/AR, payroll, cash flow',
    path: '/enterprise/finance',
    icon: 'DollarSign',
    component: 'src/pages/6-enterprise/15-FinancePage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 13,
    showInSidebar: true,
  },
  {
    id: 'enterprise-subscription',
    title: 'Subscription',
    description: 'Enterprise licensing and user seat management',
    path: '/enterprise/subscription',
    icon: 'CreditCard',
    component: 'src/pages/6-enterprise/16-SubscriptionPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 14,
    showInSidebar: true,
  },
  {
    id: 'enterprise-contracts',
    title: 'Contracts & Compliance',
    description: 'Legal documents and audit trail',
    path: '/enterprise/contracts',
    icon: 'FileCheck',
    component: 'src/pages/6-enterprise/17-ContractsPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'business',
    order: 15,
    showInSidebar: true,
  },
  {
    id: 'enterprise-support',
    title: 'Support',
    description: 'Dedicated account management and priority assistance',
    path: '/enterprise/support',
    icon: 'Headphones',
    component: 'src/pages/6-enterprise/18-SupportPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'support',
    order: 16,
    showInSidebar: true,
  },
  {
    id: 'enterprise-help',
    title: 'Help',
    description: 'Enterprise documentation and admin guides',
    path: '/enterprise/help',
    icon: 'HelpCircle',
    component: 'src/pages/6-enterprise/11-HelpPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'support',
    order: 17,
    showInSidebar: true,
  },
  {
    id: 'enterprise-settings',
    title: 'Settings',
    description: 'Organization-wide security and access controls',
    path: '/enterprise/settings',
    icon: 'Settings',
    component: 'src/pages/6-enterprise/12-SettingsPage.tsx',
    permissions: { allowedRoles: ['enterprise'] },
    category: 'support',
    order: 18,
    showInSidebar: true,
  },
];

// ============================================================================
// NAVIGATION GROUPS
// ============================================================================

const CLIENT_NAV_GROUPS: NavigationGroup[] = [
  {
    id: 'client-main',
    label: 'Main',
    icon: 'LayoutDashboard',
    pages: CLIENT_PAGES.filter((p) => ['overview', 'dashboard'].includes(p.category)),
    order: 1,
    collapsible: false,
  },
  {
    id: 'client-workspace',
    label: 'Workspace',
    icon: 'Briefcase',
    pages: CLIENT_PAGES.filter((p) => ['browse', 'projects'].includes(p.category)),
    order: 2,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'client-ai-tools',
    label: 'AI Tools',
    icon: 'Sparkles',
    pages: CLIENT_PAGES.filter((p) => p.category === 'ai-tools'),
    order: 3,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'client-collaboration',
    label: 'Collaboration',
    icon: 'Users',
    pages: CLIENT_PAGES.filter((p) => ['calendar', 'communication'].includes(p.category)),
    order: 4,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'client-learning',
    label: 'Learning',
    icon: 'GraduationCap',
    pages: CLIENT_PAGES.filter((p) => p.category === 'development'),
    order: 5,
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    id: 'client-business',
    label: 'Business',
    icon: 'Building2',
    pages: CLIENT_PAGES.filter((p) => p.category === 'business'),
    order: 6,
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    id: 'client-support',
    label: 'Support',
    icon: 'Settings',
    pages: CLIENT_PAGES.filter((p) => p.category === 'support'),
    order: 7,
    collapsible: true,
    defaultCollapsed: true,
  },
];

const ENGINEER_NAV_GROUPS: NavigationGroup[] = [
  {
    id: 'engineer-main',
    label: 'Main',
    icon: 'LayoutDashboard',
    pages: ENGINEER_PAGES.filter((p) => p.category === 'dashboard'),
    order: 1,
    collapsible: false,
  },
  {
    id: 'engineer-work',
    label: 'Work',
    icon: 'Briefcase',
    pages: ENGINEER_PAGES.filter((p) => ['browse', 'projects'].includes(p.category)),
    order: 2,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'engineer-ai-tools',
    label: 'AI Tools',
    icon: 'Bot',
    pages: ENGINEER_PAGES.filter((p) => p.category === 'ai-tools'),
    order: 3,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'engineer-collaboration',
    label: 'Collaboration',
    icon: 'Users',
    pages: ENGINEER_PAGES.filter((p) => ['calendar', 'communication'].includes(p.category)),
    order: 4,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'engineer-development',
    label: 'Development',
    icon: 'GraduationCap',
    pages: ENGINEER_PAGES.filter((p) => p.category === 'development'),
    order: 5,
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    id: 'engineer-finance',
    label: 'Finance',
    icon: 'DollarSign',
    pages: ENGINEER_PAGES.filter((p) => p.category === 'business'),
    order: 6,
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    id: 'engineer-settings',
    label: 'Settings',
    icon: 'Settings',
    pages: ENGINEER_PAGES.filter((p) => p.category === 'support'),
    order: 7,
    collapsible: true,
    defaultCollapsed: true,
  },
];

const ENTERPRISE_NAV_GROUPS: NavigationGroup[] = [
  {
    id: 'enterprise-main',
    label: 'Main',
    icon: 'LayoutDashboard',
    pages: ENTERPRISE_PAGES.filter((p) => p.category === 'dashboard'),
    order: 1,
    collapsible: false,
  },
  {
    id: 'enterprise-operations',
    label: 'Operations',
    icon: 'Briefcase',
    pages: ENTERPRISE_PAGES.filter((p) => ['browse', 'projects', 'calendar'].includes(p.category)),
    order: 2,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'enterprise-ai-tools',
    label: 'AI Tools',
    icon: 'Sparkles',
    pages: ENTERPRISE_PAGES.filter((p) => p.category === 'ai-tools'),
    order: 3,
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'enterprise-people',
    label: 'People & Teams',
    icon: 'Users2',
    pages: ENTERPRISE_PAGES.filter((p) => ['communication', 'development'].includes(p.category)),
    order: 4,
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    id: 'enterprise-business',
    label: 'Business',
    icon: 'Building2',
    pages: ENTERPRISE_PAGES.filter((p) => p.category === 'business'),
    order: 5,
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    id: 'enterprise-admin',
    label: 'Administration',
    icon: 'Settings',
    pages: ENTERPRISE_PAGES.filter((p) => p.category === 'support'),
    order: 6,
    collapsible: true,
    defaultCollapsed: true,
  },
];

// ============================================================================
// PORTAL DEFINITIONS
// ============================================================================

const CLIENT_PORTAL: PortalDefinition = {
  role: 'client',
  basePath: '/free',
  name: 'Client Portal',
  description: 'Find engineers, post jobs, manage projects',
  icon: 'Building2',
  pages: CLIENT_PAGES,
  navigationGroups: CLIENT_NAV_GROUPS,
  defaultPage: 'client-dashboard',
};

const ENGINEER_PORTAL: PortalDefinition = {
  role: 'engineer',
  basePath: '/engineer',
  name: 'Engineer Portal',
  description: 'Find jobs, manage deliverables, professional development',
  icon: 'Hammer',
  pages: ENGINEER_PAGES,
  navigationGroups: ENGINEER_NAV_GROUPS,
  defaultPage: 'engineer-dashboard',
};

const ENTERPRISE_PORTAL: PortalDefinition = {
  role: 'enterprise',
  basePath: '/enterprise',
  name: 'Enterprise Portal',
  description: 'Workforce management, analytics, business operations',
  icon: 'Building',
  pages: ENTERPRISE_PAGES,
  navigationGroups: ENTERPRISE_NAV_GROUPS,
  defaultPage: 'enterprise-dashboard',
};

const ADMIN_PORTAL: PortalDefinition = {
  role: 'admin',
  basePath: '/admin',
  name: 'Admin Portal',
  description: 'Platform administration and system management',
  icon: 'Shield',
  pages: [], // Admin pages to be defined separately
  navigationGroups: [],
  defaultPage: 'admin-dashboard',
};

// ============================================================================
// PORTAL REGISTRY
// ============================================================================

export const PORTAL_REGISTRY: PortalRegistry = {
  client: CLIENT_PORTAL,
  engineer: ENGINEER_PORTAL,
  enterprise: ENTERPRISE_PORTAL,
  admin: ADMIN_PORTAL,
};

// ============================================================================
// REGISTRY UTILITIES
// ============================================================================

/**
 * Get portal definition by role
 */
export function getPortalByRole(role: UserRole): PortalDefinition | undefined {
  return PORTAL_REGISTRY[role];
}

/**
 * Get all pages for a portal
 */
export function getPortalPages(role: UserRole): PageDefinition[] {
  return PORTAL_REGISTRY[role]?.pages || [];
}

/**
 * Get pages by role (includes nested children)
 */
export function getPagesByRole(role: UserRole): PageDefinition[] {
  const portal = PORTAL_REGISTRY[role];
  if (!portal) return [];
  
  const allPages: PageDefinition[] = [];
  
  function collectPages(pages: PageDefinition[]) {
    for (const page of pages) {
      allPages.push(page);
      if (page.children) {
        collectPages(page.children);
      }
    }
  }
  
  collectPages(portal.pages);
  return allPages;
}

/**
 * Get pages organized by category
 */
export function getCategorizedPages(
  role: UserRole
): Record<PortalCategory, PageDefinition[]> {
  const pages = getPagesByRole(role);
  const categorized: Partial<Record<PortalCategory, PageDefinition[]>> = {};
  
  for (const page of pages) {
    if (!categorized[page.category]) {
      categorized[page.category] = [];
    }
    categorized[page.category]!.push(page);
  }
  
  return categorized as Record<PortalCategory, PageDefinition[]>;
}

/**
 * Get page by ID
 */
export function getPageById(pageId: string, role?: UserRole): PageDefinition | undefined {
  if (role) {
    const pages = getPagesByRole(role);
    return pages.find((p) => p.id === pageId);
  }
  
  // Search all portals
  for (const portal of Object.values(PORTAL_REGISTRY)) {
    const pages = getAllPagesFromPortal(portal);
    const page = pages.find((p) => p.id === pageId);
    if (page) return page;
  }
  
  return undefined;
}

/**
 * Get page by path
 */
export function getPageByPath(path: string, role?: UserRole): PageDefinition | undefined {
  if (role) {
    const pages = getPagesByRole(role);
    return pages.find((p) => p.path === path);
  }
  
  // Search all portals
  for (const portal of Object.values(PORTAL_REGISTRY)) {
    const pages = getAllPagesFromPortal(portal);
    const page = pages.find((p) => p.path === path);
    if (page) return page;
  }
  
  return undefined;
}

/**
 * Helper to get all pages from portal (including children)
 */
function getAllPagesFromPortal(portal: PortalDefinition): PageDefinition[] {
  const allPages: PageDefinition[] = [];
  
  function collectPages(pages: PageDefinition[]) {
    for (const page of pages) {
      allPages.push(page);
      if (page.children) {
        collectPages(page.children);
      }
    }
  }
  
  collectPages(portal.pages);
  return allPages;
}

/**
 * Check if user has access to page
 */
export function hasPageAccess(
  page: PageDefinition,
  userRole: UserRole,
  userSubscription?: string,
  enabledFeatures?: string[]
): boolean {
  // Check role
  if (!page.permissions.allowedRoles.includes(userRole)) {
    return false;
  }
  
  // Check subscription (if required)
  if (page.permissions.requiredSubscription) {
    if (!userSubscription) return false;
    
    const required = Array.isArray(page.permissions.requiredSubscription)
      ? page.permissions.requiredSubscription
      : [page.permissions.requiredSubscription];
    
    if (!required.includes(userSubscription as never)) {
      return false;
    }
  }
  
  // Check feature flags (if required)
  if (page.permissions.requiredFeatureFlags && page.permissions.requiredFeatureFlags.length > 0) {
    if (!enabledFeatures) return false;
    
    const hasAllFlags = page.permissions.requiredFeatureFlags.every((flag) =>
      enabledFeatures.includes(flag)
    );
    
    if (!hasAllFlags) return false;
  }
  
  return true;
}

/**
 * Get navigation groups for portal
 */
export function getNavigationGroups(role: UserRole): NavigationGroup[] {
  const portal = PORTAL_REGISTRY[role];
  return portal?.navigationGroups || [];
}

/**
 * Get all page IDs
 */
export function getAllPageIds(role?: UserRole): string[] {
  if (role) {
    return getPagesByRole(role).map((p) => p.id);
  }
  
  // All portals
  const allIds: string[] = [];
  for (const portal of Object.values(PORTAL_REGISTRY)) {
    const pages = getAllPagesFromPortal(portal);
    allIds.push(...pages.map((p) => p.id));
  }
  
  return allIds;
}

/**
 * Get registry statistics
 */
export function getRegistryStats() {
  return {
    totalPortals: Object.keys(PORTAL_REGISTRY).length,
    totalPages: {
      client: getAllPagesFromPortal(PORTAL_REGISTRY.client).length,
      engineer: getAllPagesFromPortal(PORTAL_REGISTRY.engineer).length,
      enterprise: getAllPagesFromPortal(PORTAL_REGISTRY.enterprise).length,
      admin: getAllPagesFromPortal(PORTAL_REGISTRY.admin).length,
    },
    totalNavigationGroups: {
      client: CLIENT_NAV_GROUPS.length,
      engineer: ENGINEER_NAV_GROUPS.length,
      enterprise: ENTERPRISE_NAV_GROUPS.length,
    },
    categories: [
      'overview',
      'dashboard',
      'browse',
      'calendar',
      'projects',
      'ai-tools',
      'communication',
      'development',
      'business',
      'support',
    ],
  };
}

/**
 * Get default dashboard path for role
 */
export function getDefaultDashboardPath(role: UserRole): string {
  const portal = PORTAL_REGISTRY[role];
  if (!portal) return '/';
  
  const defaultPage = portal.pages.find((p) => p.id === portal.defaultPage);
  return defaultPage?.path || portal.basePath;
}

/**
 * Export everything
 */
export {
  CLIENT_PAGES,
  ENGINEER_PAGES,
  ENTERPRISE_PAGES,
  CLIENT_NAV_GROUPS,
  ENGINEER_NAV_GROUPS,
  ENTERPRISE_NAV_GROUPS,
  CLIENT_PORTAL,
  ENGINEER_PORTAL,
  ENTERPRISE_PORTAL,
  ADMIN_PORTAL,
};

