export type Role = 'engineer' | 'client' | 'enterprise' | 'admin';
export type Plan = 'free' | 'client_monthly_45' | 'engineer_monthly_60' | 'enterprise_monthly_120' | 'admin_free';

export const PLAN_TO_ROLE: Record<Plan, Role> = {
  free: 'client',
  client_monthly_45: 'client',
  engineer_monthly_60: 'engineer', 
  enterprise_monthly_120: 'enterprise',
  admin_free: 'admin'
};

export const PLAN_FEATURES = {
  free: [
    'basic_job_posting',
    'profile_creation',
    'basic_messaging'
  ],
  client_monthly_45: [
    'unlimited_jobs',
    'quote_management', 
    'escrow',
    'zatca',
    'project_tracking',
    'rich_communication',
    'geo_verified_checkins',
    'bilingual_support',
    'performance_analytics',
    'support_24_7'
  ],
  engineer_monthly_60: [
    'smart_job_matching',
    'quote_management',
    'geofenced_checkins',
    'deliverables_hub',
    'instant_payouts',
    'tax_invoice_generation',
    'portfolio_reviews',
    'earnings_dashboard',
    'bilingual_communication',
    'support_24_7',
    'mobile_app_access'
  ],
  enterprise_monthly_120: [
    'advanced_rfp_management',
    'team_management',
    'portfolio_analytics',
    'enterprise_security',
    'custom_integrations',
    'priority_support',
    'consolidated_billing',
    'advanced_reporting',
    'vendor_management',
    'white_label_solutions',
    'api_access'
  ],
  admin_free: [
    'all_features',
    'user_management',
    'billing_oversight',
    'system_admin'
  ]
};

export const PLAN_PRICING = {
  free: { amount: 0, currency: 'SAR', interval: 'month' },
  client_monthly_45: { amount: 45, currency: 'SAR', interval: 'month' },
  engineer_monthly_60: { amount: 60, currency: 'SAR', interval: 'month' },
  enterprise_monthly_120: { amount: 120, currency: 'SAR', interval: 'month' },
  admin_free: { amount: 0, currency: 'SAR', interval: 'month' }
};

export const PLAN_DESCRIPTIONS = {
  free: 'Basic access with limited features',
  client_monthly_45: 'Perfect for owners, contractors, and SMBs needing verified engineers fast',
  engineer_monthly_60: 'Perfect for certified engineers and small firms building a steady pipeline',
  enterprise_monthly_120: 'Perfect for large developers, enterprises, and government entities',
  admin_free: 'System administration with full platform access'
};

export function getPlanFromRole(role: Role): Plan {
  const planEntry = Object.entries(PLAN_TO_ROLE).find(([, roleValue]) => roleValue === role);
  return planEntry ? (planEntry[0] as Plan) : 'free';
}

export function getRoleFromPlan(plan: Plan): Role {
  return PLAN_TO_ROLE[plan] || 'client';
}

export function canAccessFeature(plan: Plan, feature: string): boolean {
  return PLAN_FEATURES[plan]?.includes(feature) ?? false;
}
