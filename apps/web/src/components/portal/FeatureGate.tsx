/**
 * Feature Gate Component
 * 
 * Conditionally renders content based on user's subscription tier.
 * Shows upgrade prompts for locked features. Automatically unlocks for admins.
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3)
 */

import React, { ReactNode, useMemo } from 'react';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { tierMeetsRequirement } from '@/shared/utils/tierUtils';
import type { SubscriptionTier } from '@/shared/types/subscription';

interface FeatureGateProps {
  /** Minimum subscription tier required to access this feature */
  requiredTier: SubscriptionTier;
  /** Content to render when access is granted */
  children: ReactNode;
  /** Optional feature ID for tracking/analytics */
  featureId?: string;
  /** Custom fallback content to show when access is denied (replaces default upgrade card) */
  fallback?: ReactNode;
  /** Whether to show a blur overlay over gated content when access is denied */
  showBlurOverlay?: boolean;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Placeholder function for upgrade modal trigger
 * 
 * TODO: Replace with actual upgrade modal hook/function
 * @param requiredTier - The tier required to access the locked feature
 * @param featureId - Optional feature identifier for tracking
 */
function openUpgradeModal(requiredTier?: SubscriptionTier, featureId?: string): void {
  // Placeholder: In production, this should:
  // 1. Open an upgrade modal dialog
  // 2. Show tier comparison highlighting the required tier
  // 3. Redirect to Stripe checkout for the required tier
  console.log(`[Upgrade Modal] Feature: ${featureId || 'unknown'}, Required Tier: ${requiredTier || 'unknown'}`);
  
  // Example implementation pattern:
  // const { openUpgradeModal } = useUpgradeModal();
  // openUpgradeModal({ requiredTier, featureId });
}

/**
 * Get tier display name with capitalization
 */
function getTierDisplayName(tier: SubscriptionTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

/**
 * Get tier color variant for badges
 */
function getTierVariant(tier: SubscriptionTier): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (tier) {
    case 'free':
      return 'outline';
    case 'basic':
      return 'secondary';
    case 'pro':
      return 'default';
    case 'enterprise':
      return 'destructive';
    default:
      return 'secondary';
  }
}

/**
 * Default upgrade card component
 */
function UpgradeCard({
  requiredTier,
  currentTier,
  featureId,
  className,
}: {
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  featureId?: string;
  className?: string;
}) {
  const handleUpgradeClick = () => {
    openUpgradeModal(requiredTier, featureId);
  };

  return (
    <Card className={cn('border-dashed border-2', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">Feature Locked</CardTitle>
        <CardDescription>
          This feature requires a <strong>{getTierDisplayName(requiredTier)}</strong> plan or higher.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
            <Badge variant={getTierVariant(currentTier)} className="capitalize">
              {currentTier}
            </Badge>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Required Plan</p>
            <Badge variant={getTierVariant(requiredTier)} className="capitalize">
              {requiredTier}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleUpgradeClick} className="w-full sm:w-auto" size="lg">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to {getTierDisplayName(requiredTier)}
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * FeatureGate Component
 * 
 * Conditionally renders children based on subscription tier access.
 * Shows upgrade card or custom fallback when access is denied.
 * 
 * @example
 * ```tsx
 * <FeatureGate requiredTier="pro" featureId="ai-tools">
 *   <AIToolsContent />
 * </FeatureGate>
 * ```
 * 
 * @example With custom fallback
 * ```tsx
 * <FeatureGate 
 *   requiredTier="enterprise" 
 *   fallback={<CustomUpgradePrompt />}
 * >
 *   <EnterpriseFeature />
 * </FeatureGate>
 * ```
 * 
 * @example With blur overlay
 * ```tsx
 * <FeatureGate 
 *   requiredTier="pro" 
 *   showBlurOverlay={true}
 * >
 *   <GatedContent />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  requiredTier,
  children,
  featureId,
  fallback,
  showBlurOverlay = false,
  className,
}: FeatureGateProps) {
  const { subscriptionTier, isAdmin, canAccessTier } = usePortalAccess();
  
  const currentTier = subscriptionTier || 'free';
  
  // Check if user has access
  const hasAccess = useMemo(() => {
    return canAccessTier(requiredTier);
  }, [canAccessTier, requiredTier]);
  
  // If access granted, render children
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // If fallback provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // If showBlurOverlay is true, show children with overlay
  if (showBlurOverlay) {
    return (
      <div className={cn('relative', className)}>
        {/* Gated content with blur */}
        <div className="pointer-events-none blur-sm opacity-50">
          {children}
        </div>
        
        {/* Overlay with upgrade card */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-4">
            <UpgradeCard
              requiredTier={requiredTier}
              currentTier={currentTier}
              featureId={featureId}
            />
          </div>
        </div>
      </div>
    );
  }
  
  // Default: show upgrade card
  return (
    <div className={className}>
      <UpgradeCard
        requiredTier={requiredTier}
        currentTier={currentTier}
        featureId={featureId}
      />
    </div>
  );
}

/**
 * Hook to check if a feature is locked
 * 
 * Returns true if the feature is locked (user doesn't have access),
 * false if the feature is unlocked.
 * 
 * @param requiredTier - Minimum tier required to access the feature
 * @param featureId - Optional feature identifier for tracking
 * @returns boolean - true if locked, false if unlocked
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isLocked = useFeatureLocked('pro', 'ai-assistant');
 *   
 *   if (isLocked) {
 *     return <UpgradePrompt />;
 *   }
 *   
 *   return <FeatureContent />;
 * }
 * ```
 */
export function useFeatureLocked(
  requiredTier: SubscriptionTier,
  featureId?: string
): boolean {
  const { canAccessTier } = usePortalAccess();
  
  return useMemo(() => {
    return !canAccessTier(requiredTier);
  }, [canAccessTier, requiredTier]);
}

/**
 * Hook to check if a feature is unlocked
 * 
 * Returns true if the feature is unlocked (user has access),
 * false if the feature is locked.
 * 
 * @param requiredTier - Minimum tier required to access the feature
 * @param featureId - Optional feature identifier for tracking
 * @returns boolean - true if unlocked, false if locked
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const hasAccess = useFeatureUnlocked('pro');
 *   
 *   return (
 *     <div>
 *       {hasAccess && <ProFeature />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeatureUnlocked(
  requiredTier: SubscriptionTier,
  featureId?: string
): boolean {
  const isLocked = useFeatureLocked(requiredTier, featureId);
  return !isLocked;
}

// Export default for convenience
export default FeatureGate;

