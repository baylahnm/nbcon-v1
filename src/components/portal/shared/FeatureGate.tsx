/**
 * FeatureGate Component
 * 
 * Wraps content that requires specific subscription tier or features.
 * Shows upgrade prompts when user doesn't have access.
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { tierMeetsRequirement, formatTierName, getUpgradePath } from '@/shared/services/subscriptionService';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TYPES
// ============================================================================

export interface FeatureGateProps {
  /**
   * Required subscription tier (or array of tiers)
   */
  requiredTier?: SubscriptionTier | SubscriptionTier[];
  
  /**
   * Required feature flag
   */
  requiredFeature?: string;
  
  /**
   * Content to show when user has access
   */
  children: React.ReactNode;
  
  /**
   * Custom fallback component when access denied
   */
  fallback?: React.ReactNode;
  
  /**
   * Feature name for display in upgrade prompt
   */
  featureName?: string;
  
  /**
   * Description for upgrade prompt
   */
  featureDescription?: string;
  
  /**
   * Callback when access is denied
   */
  onAccessDenied?: () => void;
  
  /**
   * Show inline prompt (compact) vs full card
   */
  inline?: boolean;
}

// ============================================================================
// UPGRADE PROMPT COMPONENTS
// ============================================================================

/**
 * Full card upgrade prompt
 */
function UpgradePromptCard({
  featureName,
  featureDescription,
  requiredTier,
  currentTier,
}: {
  featureName: string;
  featureDescription?: string;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
}) {
  const navigate = useNavigate();
  
  return (
    <Card className="border-dashed" data-testid="feature-gate-upgrade-prompt">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{featureName}</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Crown className="h-3 w-3 mr-1" />
                {formatTierName(requiredTier)}+
              </Badge>
            </div>
            <CardDescription className="mt-1">
              {featureDescription || `This feature requires ${formatTierName(requiredTier)} or higher.`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            You're currently on the <strong>{formatTierName(currentTier)}</strong> plan.
            Upgrade to unlock this feature and more.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/subscription')}
              className="gap-2"
              data-testid="feature-gate-upgrade-button"
            >
              <Zap className="h-4 w-4" />
              Upgrade to {formatTierName(requiredTier)}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/subscription#compare')}
              data-testid="feature-gate-compare-button"
            >
              Compare Plans
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline upgrade prompt (compact banner)
 */
function UpgradePromptInline({
  featureName,
  requiredTier,
}: {
  featureName: string;
  requiredTier: SubscriptionTier;
}) {
  const navigate = useNavigate();
  
  return (
    <div
      className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-muted/50"
      data-testid="feature-gate-upgrade-banner"
    >
      <div className="flex items-center gap-3">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{featureName}</p>
          <p className="text-xs text-muted-foreground">
            Requires {formatTierName(requiredTier)}+ plan
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => navigate('/subscription')}
        className="gap-1.5"
        data-testid="feature-gate-upgrade-button-inline"
      >
        <Crown className="h-3 w-3" />
        Upgrade
      </Button>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * FeatureGate - Wraps content behind subscription tier requirement
 * 
 * @example
 * ```tsx
 * <FeatureGate
 *   requiredTier="pro"
 *   featureName="AI Project Assistant"
 *   featureDescription="Get AI-powered insights for your projects"
 * >
 *   <AIToolsPanel />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  requiredTier,
  requiredFeature,
  children,
  fallback,
  featureName = 'This Feature',
  featureDescription,
  onAccessDenied,
  inline = false,
}: FeatureGateProps) {
  const { userPermissions, isAuthenticated } = usePortalAccess();
  
  const currentTier = userPermissions.subscriptionTier || 'free';
  
  // Check if user meets tier requirement
  const hasAccess = useMemo(() => {
    if (!isAuthenticated) return false;
    
    if (requiredTier) {
      return tierMeetsRequirement(currentTier, requiredTier);
    }
    
    // TODO: Add feature flag checking if requiredFeature is provided
    
    return true;
  }, [isAuthenticated, currentTier, requiredTier, requiredFeature]);
  
  // Log access denial
  useEffect(() => {
    if (!hasAccess && isAuthenticated) {
      console.log('[FeatureGate] Access denied:', {
        feature: featureName,
        required: requiredTier,
        current: currentTier,
      });
      
      onAccessDenied?.();
    }
  }, [hasAccess, isAuthenticated, featureName, requiredTier, currentTier, onAccessDenied]);
  
  // If user has access, show content
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Get the highest required tier if array
  const tierToDisplay = Array.isArray(requiredTier)
    ? requiredTier[requiredTier.length - 1]
    : requiredTier || 'pro';
  
  // Show upgrade prompt
  if (inline) {
    return (
      <UpgradePromptInline
        featureName={featureName}
        requiredTier={tierToDisplay}
      />
    );
  }
  
  return (
    <UpgradePromptCard
      featureName={featureName}
      featureDescription={featureDescription}
      requiredTier={tierToDisplay}
      currentTier={currentTier}
    />
  );
}

// ============================================================================
// HELPER HOOK
// ============================================================================

/**
 * Hook to check feature access programmatically
 */
export function useFeatureAccess(requiredTier?: SubscriptionTier | SubscriptionTier[]) {
  const { userPermissions, isAuthenticated } = usePortalAccess();
  
  const canAccess = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!requiredTier) return true;
    
    const currentTier = userPermissions.subscriptionTier || 'free';
    return tierMeetsRequirement(currentTier, requiredTier);
  }, [isAuthenticated, requiredTier, userPermissions]);
  
  return {
    canAccess,
    currentTier: userPermissions.subscriptionTier || 'free',
  };
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

/**
 * Skeleton for gated content while checking access
 */
export function FeatureGateSkeleton({ inline = false }: { inline?: boolean }) {
  if (inline) {
    return (
      <div className="h-16 w-full rounded-lg bg-muted/50 animate-pulse" />
    );
  }
  
  return (
    <Card className="border-dashed">
      <CardHeader className="space-y-3">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

