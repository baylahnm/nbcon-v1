/**
 * Route Constants - Single Source of Truth
 * 
 * This file contains all route definitions to prevent routing inconsistencies.
 * Always use these constants instead of hardcoding routes.
 * 
 * Last Updated: October 22, 2025
 * Version: 1.0
 */

export const ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/auth',
    SIGNUP: '/auth/signup',
    VERIFY: '/auth/verify',
    ACCOUNT_TYPE: '/auth/account-type',
  },

  // Client Portal
  CLIENT: {
    DASHBOARD: '/free/dashboard',
    PROFILE: '/free/profile',
    BROWSE: '/free/browse',
    CALENDAR: '/free/calendar',
    POST_JOB: '/free/job/new',
    PROJECTS: '/free/myprojects',
    LEARNING: '/free/learning',
    AI_ASSISTANT: '/free/ai',
  },

  // AI Tools
  AI_TOOLS: {
    // Planning Tools
    PLANNING: '/free/ai-tools/planning',
    PLANNING_CHARTER: '/free/ai-tools/planning/charter',
    PLANNING_WBS: '/free/ai-tools/planning/wbs',
    PLANNING_STAKEHOLDERS: '/free/ai-tools/planning/stakeholders',
    PLANNING_RISKS: '/free/ai-tools/planning/risks',
    PLANNING_TIMELINE: '/free/ai-tools/planning/timeline',
    PLANNING_RESOURCES: '/free/ai-tools/planning/resources',

    // Budgeting Tools
    BUDGETING: '/free/ai-tools/budgeting',
    BUDGETING_BOQ: '/free/ai-tools/budgeting/boq',
    BUDGETING_ESTIMATOR: '/free/ai-tools/budgeting/estimator',
    BUDGETING_CASHFLOW: '/free/ai-tools/budgeting/cashflow',
    BUDGETING_TRACKER: '/free/ai-tools/budgeting/tracker',
    BUDGETING_VALUE: '/free/ai-tools/budgeting/value',
    BUDGETING_PAYMENTS: '/free/ai-tools/budgeting/payments',

    // Execution Tools
    EXECUTION: '/free/ai-tools/execution',
    EXECUTION_DAILY_LOG: '/free/ai-tools/execution/daily-log',
    EXECUTION_PROGRESS: '/free/ai-tools/execution/progress',
    EXECUTION_CHANGE_ORDERS: '/free/ai-tools/execution/change-orders',
    EXECUTION_MEETINGS: '/free/ai-tools/execution/meetings',
    EXECUTION_ISSUES: '/free/ai-tools/execution/issues',

    // Quality & Compliance Tools
    QUALITY: '/free/ai-tools/quality',
    QUALITY_CHECKLIST: '/free/ai-tools/quality/checklist',
    QUALITY_INSPECTION: '/free/ai-tools/quality/inspection',
    QUALITY_COMPLIANCE: '/free/ai-tools/quality/compliance',
    QUALITY_DEFECTS: '/free/ai-tools/quality/defects',
    QUALITY_METRICS: '/free/ai-tools/quality/metrics',

    // Communication & Reporting Tools
    COMMUNICATION: '/free/ai-tools/communication',
    COMMUNICATION_CLIENT_EMAIL: '/free/ai-tools/communication/client-email',
    COMMUNICATION_PROGRESS_REPORT: '/free/ai-tools/communication/progress-report',
    COMMUNICATION_MEETING_MINUTES: '/free/ai-tools/communication/meeting-minutes',
    COMMUNICATION_RFI_MANAGER: '/free/ai-tools/communication/rfi-manager',
    COMMUNICATION_PRESENTATION: '/free/ai-tools/communication/presentation-deck',
  },

  // Engineer Portal
  ENGINEER: {
    DASHBOARD: '/engineer/dashboard',
    JOBS: '/engineer/jobs',
    CALENDAR: '/engineer/calendar',
    CHECKIN: '/engineer/checkin',
    MESSAGES: '/engineer/messages',
    NETWORK: '/engineer/network',
    LEARNING: '/engineer/learning',
    FINANCE: '/engineer/finance',
    AI_ASSISTANT: '/engineer/ai',
    PROFILE: '/engineer/profile',
    RANKING: '/engineer/ranking',
    HELP: '/engineer/help',
    SETTINGS: '/engineer/settings',
    UPLOAD: '/engineer/job/upload',
  },

  // Enterprise Portal
  ENTERPRISE: {
    DASHBOARD: '/enterprise/dashboard',
    FINANCE: '/enterprise/finance',
    PROCUREMENT: '/enterprise/procurement',
  },

  // Admin Portal
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PROJECTS: '/admin/projects',
    MESSAGES: '/admin/messages',
    PAYMENTS: '/admin/payments',
    ANALYTICS: '/admin/analytics',
    RISK_CENTER: '/admin/risk-center',
    SETTINGS: '/admin/settings',
  },
} as const;

// Helper function to build routes with parameters
export const buildRoute = (route: string, params?: Record<string, string>): string => {
  if (!params) return route;
  
  const searchParams = new URLSearchParams(params);
  return `${route}?${searchParams.toString()}`;
};

// Helper function to get route with project parameter
export const getRouteWithProject = (route: string, projectId: string): string => {
  return buildRoute(route, { project: projectId });
};

// Get all routes as flat array
export const getAllRoutes = (): string[] => {
  const routes: string[] = [];
  
  const extractRoutes = (obj: any) => {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        routes.push(value);
      } else if (typeof value === 'object' && value !== null) {
        extractRoutes(value);
      }
    });
  };
  
  extractRoutes(ROUTES);
  return routes;
};

// Validation function to check route consistency
export const validateRoute = (route: string): boolean => {
  const allRoutes = getAllRoutes();
  return allRoutes.includes(route);
};

// Route checker for development
export const checkRouteConsistency = (routes: string[]): string[] => {
  const inconsistencies: string[] = [];
  
  routes.forEach(route => {
    if (!validateRoute(route)) {
      inconsistencies.push(`Route ${route} not found in ROUTES constants`);
    }
  });
  
  return inconsistencies;
};
