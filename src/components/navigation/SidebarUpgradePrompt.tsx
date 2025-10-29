/**
 * Sidebar Upgrade Prompt Component
 * 
 * Modal/dialog shown when user clicks a locked menu item.
 * Displays feature details and upgrade CTA.
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Zap, X, Check, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/pages/1-HomePage/others/components/ui/dialog';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { formatTierName } from '@/shared/services/subscriptionService';
import type { MenuItem } from '@/config/menuConfig';
import type { SubscriptionTier } from '@/config/portalTypes';

// ============================================================================
// TYPES
// ============================================================================

interface SidebarUpgradePromptProps {
  item: MenuItem | null;
  currentTier: SubscriptionTier;
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SidebarUpgradePrompt({
  item,
  currentTier,
  isOpen,
  onClose,
}: SidebarUpgradePromptProps) {
  const navigate = useNavigate();

  if (!item) return null;

  const handleUpgrade = () => {
    navigate('/subscription', {
      state: {
        feature: item.label,
        requiredTier: item.requiredTier,
        description: item.description,
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="sidebar-upgrade-prompt">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg flex items-center gap-2">
                {item.label}
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 capitalize">
                  <Crown className="h-3 w-3 mr-1" />
                  {formatTierName(item.requiredTier || 'pro')}+
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {item.description || `Unlock ${item.label} and premium features`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              You're currently on the{' '}
              <strong className="text-foreground capitalize">{formatTierName(currentTier)}</strong> plan.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">What's included:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item.label} - Full access</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>AI-powered features</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto gap-2"
            data-testid="upgrade-cta-button"
          >
            <Zap className="h-4 w-4" />
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

