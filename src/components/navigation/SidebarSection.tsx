/**
 * Sidebar Section Component
 * 
 * Collapsible section grouping related menu items.
 * Handles expand/collapse state and renders all child items.
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { SidebarItem } from './SidebarItem';
import type { MenuSection, MenuItem } from '@/config/menuConfig';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TYPES
// ============================================================================

interface SidebarSectionProps {
  section: MenuSection;
  currentTier: SubscriptionTier;
  onLockedClick: (item: MenuItem) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SidebarSection({ section, currentTier, onLockedClick }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded ?? true);
  const isCollapsible = section.collapsible !== false;

  return (
    <div className="space-y-1" data-testid={`sidebar-section-${section.id}`}>
      {/* Section Header */}
      <div
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
          isCollapsible ? "cursor-pointer hover:bg-muted/30" : "cursor-default"
        )}
        data-testid={`sidebar-section-header-${section.id}`}
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {section.label}
        </span>
        {isCollapsible && (
          <ChevronDown
            className={cn(
              "h-3 w-3 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </div>

      {/* Section Items */}
      {isExpanded && (
        <div className="space-y-0.5" data-testid={`sidebar-section-items-${section.id}`}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              currentTier={currentTier}
              onLockedClick={onLockedClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

