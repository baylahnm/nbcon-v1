/**
 * Feature Flags Configuration
 * Phase 3: Specialized Agent System Rollout
 * 
 * Controls gradual rollout of new features with kill switches
 */

export interface FeatureFlags {
  // Phase 3: Specialized AI Agents
  enableSpecializedAgents: boolean;
  enableAgentWorkspace: boolean;
  enableTokenTracking: boolean;
  enableQuotaEnforcement: boolean;
  
  // Agent Capabilities (per discipline)
  enableCivilAgent: boolean;
  enableElectricalAgent: boolean;
  enableStructuralAgent: boolean;
  enableHVACAgent: boolean;
  enableSurveyAgent: boolean;
  enableHSEAgent: boolean;
  enableDroneAgent: boolean;
  enableMaintenanceAgent: boolean;
  enableGeotechnicalAgent: boolean;
  
  // Rollout percentage (0-100)
  agentRolloutPercentage: number;
}

/**
 * Default feature flags (production)
 */
const DEFAULT_FLAGS: FeatureFlags = {
  // Phase 3: Start with gradual rollout
  enableSpecializedAgents: true, // Enable agent selection UI
  enableAgentWorkspace: true, // Enable full workspace
  enableTokenTracking: true, // Track usage
  enableQuotaEnforcement: false, // Don't block yet (Week 2)
  
  // All agents enabled (can be individually disabled)
  enableCivilAgent: true,
  enableElectricalAgent: true,
  enableStructuralAgent: true,
  enableHVACAgent: true,
  enableSurveyAgent: true,
  enableHSEAgent: true,
  enableDroneAgent: true,
  enableMaintenanceAgent: true,
  enableGeotechnicalAgent: true,
  
  // Start with 100% rollout (can be reduced if issues)
  agentRolloutPercentage: 100,
};

/**
 * Get feature flags (can be overridden by environment/admin)
 */
export function getFeatureFlags(): FeatureFlags {
  // In production, fetch from admin_feature_flags table
  // For now, use defaults
  return DEFAULT_FLAGS;
}

/**
 * Check if specialized agents feature is enabled
 */
export function isSpecializedAgentsEnabled(): boolean {
  const flags = getFeatureFlags();
  return flags.enableSpecializedAgents && isInRollout(flags.agentRolloutPercentage);
}

/**
 * Check if agent workspace is enabled
 */
export function isAgentWorkspaceEnabled(): boolean {
  const flags = getFeatureFlags();
  return flags.enableAgentWorkspace;
}

/**
 * Check if token tracking is enabled
 */
export function isTokenTrackingEnabled(): boolean {
  const flags = getFeatureFlags();
  return flags.enableTokenTracking;
}

/**
 * Check if quota enforcement is enabled
 */
export function isQuotaEnforcementEnabled(): boolean {
  const flags = getFeatureFlags();
  return flags.enableQuotaEnforcement;
}

/**
 * Check if user is in rollout percentage
 */
function isInRollout(percentage: number): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;
  
  // Use user ID hash for consistent rollout
  const userId = getUserIdHash();
  return (userId % 100) < percentage;
}

/**
 * Get deterministic hash from user ID
 */
function getUserIdHash(): number {
  // Simple hash function for consistent rollout
  // In production, use actual user ID from auth
  const userIdString = localStorage.getItem('supabase.auth.token') || '';
  
  let hash = 0;
  for (let i = 0; i < userIdString.length; i++) {
    const char = userIdString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Override feature flags (for testing/admin)
 */
export function setFeatureFlag(flag: keyof FeatureFlags, value: boolean | number): void {
  // Store in localStorage for testing
  const flags = getFeatureFlags();
  flags[flag] = value as any;
  localStorage.setItem('nbcon_feature_flags', JSON.stringify(flags));
}

/**
 * Clear all flag overrides
 */
export function clearFeatureFlagOverrides(): void {
  localStorage.removeItem('nbcon_feature_flags');
}


