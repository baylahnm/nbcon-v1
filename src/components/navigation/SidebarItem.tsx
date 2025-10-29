/**
 * Sidebar Item Component
 * 
 * Individual menu item with tier-aware rendering.
 * Shows locked state for items requiring higher subscription tier.
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, ExternalLink } from 'lucide-react';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/pages/1-HomePage/others/components/ui/tooltip';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { tierMeetsRequirement } from '@/shared/services/subscriptionService';
import type { MenuItem } from '@/config/menuConfig';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TYPES
// ============================================================================

interface SidebarItemProps {
  item: MenuItem;
  currentTier: SubscriptionTier;
  onLockedClick: (item: MenuItem) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SidebarItem({ item, currentTier, onLockedClick }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.route;
  const isLocked = item.requiredTier && !tierMeetsRequirement(currentTier, item.requiredTier);
  const isDisabled = item.comingSoon || isLocked;

  // ============================================================================
  // LOCKED STATE (Insufficient Tier)
  // ============================================================================

  if (isLocked) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={() => onLockedClick(item)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                "cursor-pointer opacity-60 hover:opacity-80 hover:bg-muted/50"
              )}
              data-locked="true"
              data-testid={`sidebar-item-locked-${item.id}`}
            >
              {/* Lock Icon */}
              <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              
              {/* Label */}
              <span className="text-sm text-muted-foreground truncate flex-1">
                {item.label}
              </span>
              
              {/* Tier Badge */}
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] capitalize flex-shrink-0">
                {item.requiredTier}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold text-xs">{item.label}</p>
              <p className="text-xs text-muted-foreground">
                Requires <span className="capitalize font-medium">{item.requiredTier}</span> tier or higher
              </p>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
              <p className="text-xs text-primary">Click to upgrade</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // ============================================================================
  // COMING SOON STATE
  // ============================================================================

  if (item.comingSoon) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-50 cursor-not-allowed"
              data-coming-soon="true"
              data-testid={`sidebar-item-coming-soon-${item.id}`}
            >
              <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate flex-1">{item.label}</span>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px] flex-shrink-0">
                Soon
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">Coming soon!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // ============================================================================
  // UNLOCKED STATE (Accessible)
  // ============================================================================

  const linkContent = (
    <>
      {/* Icon */}
      <item.icon className={cn(
        "h-4 w-4 flex-shrink-0 transition-colors",
        isActive ? "text-primary-foreground" : "text-muted-foreground"
      )} />
      
      {/* Label */}
      <span className={cn(
        "text-sm truncate flex-1 transition-all",
        isActive ? "font-semibold text-primary-foreground" : "font-medium text-foreground"
      )}>
        {item.label}
      </span>
      
      {/* Badges */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {item.badge && (
          <Badge className={cn(
            "text-[9px]",
            isActive 
              ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
              : "bg-primary/10 text-primary border-primary/20"
          )}>
            {item.badge}
          </Badge>
        )}
        {item.isNew && (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px]">
            New
          </Badge>
        )}
        {item.isBeta && (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]">
            Beta
          </Badge>
        )}
        {item.external && (
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </>
  );

  // External link
  if (item.external) {
    return (
      <a
        href={item.route}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
          "hover:bg-muted/50 text-foreground"
        )}
        data-testid={`sidebar-item-${item.id}`}
      >
        {linkContent}
      </a>
    );
  }

  // Internal link
  return (
    <Link
      to={item.route}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted/50 text-foreground"
      )}
      data-active={isActive}
      data-testid={`sidebar-item-${item.id}`}
    >
      {linkContent}
    </Link>
  );
}

