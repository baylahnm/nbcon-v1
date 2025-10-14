import { R } from '../lib/routes';

export interface PostProjectRouteConfig {
  path: string;
  component: string;
  permissions: string[];
  actions: {
    [key: string]: {
      handler: string;
      requiresAuth: boolean;
      redirectOnSuccess?: string;
      showToast?: boolean;
    };
  };
}

export const POST_PROJECT_ROUTES: Record<string, PostProjectRouteConfig> = {
  main: {
    path: R.enterprise.postProject,
    component: 'PostProjectPage',
    permissions: ['enterprise'],
    actions: {
      'save-draft': {
        handler: 'handleSaveDraft',
        requiresAuth: true,
        showToast: true,
      },
      'submit-project': {
        handler: 'handleSubmitProject',
        requiresAuth: true,
        redirectOnSuccess: R.enterprise.teamProjects,
        showToast: true,
      },
    },
  },
  'post-new': {
    path: `${R.enterprise.postProject}?tab=new`,
    component: 'PostNewProjectTab',
    permissions: ['enterprise'],
    actions: {
      'navigate-section': {
        handler: 'navigateToSection',
        requiresAuth: true,
      },
      'add-deliverable': {
        handler: 'addDeliverable',
        requiresAuth: true,
      },
      'remove-deliverable': {
        handler: 'removeDeliverable',
        requiresAuth: true,
      },
      'add-skill': {
        handler: 'addSkill',
        requiresAuth: true,
      },
      'remove-skill': {
        handler: 'removeSkill',
        requiresAuth: true,
      },
      'add-certification': {
        handler: 'addCertification',
        requiresAuth: true,
      },
      'remove-certification': {
        handler: 'removeCertification',
        requiresAuth: true,
      },
      'add-technical-requirement': {
        handler: 'addTechnicalRequirement',
        requiresAuth: true,
      },
      'remove-technical-requirement': {
        handler: 'removeTechnicalRequirement',
        requiresAuth: true,
      },
      'add-compliance-requirement': {
        handler: 'addComplianceRequirement',
        requiresAuth: true,
      },
      'remove-compliance-requirement': {
        handler: 'removeComplianceRequirement',
        requiresAuth: true,
      },
      'toggle-remote': {
        handler: 'toggleRemote',
        requiresAuth: true,
      },
      'toggle-flexible-duration': {
        handler: 'toggleFlexibleDuration',
        requiresAuth: true,
      },
      'toggle-portfolio': {
        handler: 'togglePortfolio',
        requiresAuth: true,
      },
      'toggle-interviews': {
        handler: 'toggleInterviews',
        requiresAuth: true,
      },
      'toggle-flexible-start': {
        handler: 'toggleFlexibleStart',
        requiresAuth: true,
      },
      'toggle-flexible-end': {
        handler: 'toggleFlexibleEnd',
        requiresAuth: true,
      },
    },
  },
  'post-template': {
    path: `${R.enterprise.postProject}?tab=template`,
    component: 'PostFromTemplateTab',
    permissions: ['enterprise'],
    actions: {
      'use-template': {
        handler: 'handleUseTemplate',
        requiresAuth: true,
        redirectOnSuccess: `${R.enterprise.postProject}?tab=new`,
        showToast: true,
      },
      'preview-template': {
        handler: 'handlePreviewTemplate',
        requiresAuth: true,
      },
      'create-from-current': {
        handler: 'handleCreateFromCurrent',
        requiresAuth: true,
        showToast: true,
      },
      'create-new-template': {
        handler: 'handleCreateNewTemplate',
        requiresAuth: true,
      },
      'quick-filter': {
        handler: 'handleQuickFilter',
        requiresAuth: true,
      },
      'clear-filters': {
        handler: 'clearFilters',
        requiresAuth: true,
      },
      'set-view-mode': {
        handler: 'setViewMode',
        requiresAuth: true,
      },
    },
  },
  'template-marketplace': {
    path: `${R.enterprise.postProject}?tab=marketplace`,
    component: 'TemplateMarketplaceTab',
    permissions: ['enterprise'],
    actions: {
      'use-template': {
        handler: 'handleUseTemplate',
        requiresAuth: true,
        redirectOnSuccess: `${R.enterprise.postProject}?tab=new`,
        showToast: true,
      },
      'preview-template': {
        handler: 'handlePreviewTemplate',
        requiresAuth: true,
      },
      'purchase-template': {
        handler: 'handlePurchaseTemplate',
        requiresAuth: true,
        showToast: true,
      },
      'clear-filters': {
        handler: 'clearFilters',
        requiresAuth: true,
      },
      'set-view-mode': {
        handler: 'setViewMode',
        requiresAuth: true,
      },
      'set-currency': {
        handler: 'setCurrentCurrency',
        requiresAuth: true,
      },
      'set-sort': {
        handler: 'setSortBy',
        requiresAuth: true,
      },
      'close-modal': {
        handler: 'closeModal',
        requiresAuth: true,
      },
    },
  },
};

export const getRouteConfig = (path: string): PostProjectRouteConfig | null => {
  return POST_PROJECT_ROUTES[path] || null;
};

export const getActionConfig = (path: string, action: string) => {
  const route = getRouteConfig(path);
  return route?.actions[action] || null;
};

export const validateAction = (path: string, action: string, userPermissions: string[]): boolean => {
  const routeConfig = getRouteConfig(path);
  const actionConfig = getActionConfig(path, action);
  if (!actionConfig || !routeConfig) return false;
  
  if (actionConfig.requiresAuth && !userPermissions.length) return false;
  
  return routeConfig.permissions?.every(permission => 
    userPermissions.includes(permission)
  ) ?? true;
};
