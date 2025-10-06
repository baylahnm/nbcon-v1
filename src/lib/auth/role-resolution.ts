import { Role, Plan, PLAN_TO_ROLE, PLAN_FEATURES } from '@/lib/billing/plans';

export interface Subscription {
  id: string;
  plan: Plan;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  current_period_end: string;
  cancel_at_period_end: boolean;
}

const ROLE_HIERARCHY = { admin: 4, enterprise: 3, engineer: 2, client: 1 };

export function getEffectiveRole(base: Role, subscriptions: Subscription[] = []): Role {
  // Admin role always takes precedence
  if (base === 'admin') return 'admin';
  
  // Find active subscription
  const activeSubscription = subscriptions.find(
    s => s.status === 'active' || s.status === 'trialing'
  );
  
  // If no active subscription, return base role
  if (!activeSubscription) return base;
  
  // Return role from subscription plan
  return PLAN_TO_ROLE[activeSubscription.plan] || base;
}

export function canAccessFeature(userRole: Role, feature: string, subscriptions: Subscription[] = []): boolean {
  const effectiveRole = getEffectiveRole(userRole, subscriptions);
  
  // Admin has access to everything
  if (effectiveRole === 'admin') return true;
  
  // Get plan from effective role
  const plan = getPlanFromRole(effectiveRole);
  
  return PLAN_FEATURES[plan]?.includes(feature) ?? false;
}

export function getPlanFromRole(role: Role): Plan {
  const planEntry = Object.entries(PLAN_TO_ROLE).find(([, roleValue]) => roleValue === role);
  return planEntry ? (planEntry[0] as Plan) : 'free';
}

export function hasRolePermission(userRole: Role, targetRole: Role, subscriptions: Subscription[] = []): boolean {
  const effectiveRole = getEffectiveRole(userRole, subscriptions);
  
  // Admin can access everything
  if (effectiveRole === 'admin') return true;
  
  // Check role hierarchy
  const userLevel = ROLE_HIERARCHY[effectiveRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  
  // Users can only access roles at their level or below
  return userLevel >= targetLevel;
}

export function getLandingPage(role: Role, subscriptions: Subscription[] = []): string {
  const effectiveRole = getEffectiveRole(role, subscriptions);
  
  switch (effectiveRole) {
    case 'admin':
      return '/admin/dashboard';
    case 'enterprise':
      return '/enterprise/dashboard';
    case 'engineer':
      return '/engineer/dashboard';
    case 'client':
      return '/client/dashboard';
    default:
      return '/auth/account-type';
  }
}

export function getSignupFlow(type: 'client' | 'engineer' | 'enterprise' | 'admin'): string {
  switch (type) {
    case 'client':
      return '/signup/client';
    case 'engineer':
      return '/signup/engineer';
    case 'enterprise':
      return '/signup/enterprise';
    case 'admin':
      return '/signup/admin';
    default:
      return '/auth/account-type';
  }
}
