/**
 * Tier-Aware App Sidebar
 * 
 * Unified sidebar navigation with subscription tier awareness.
 * Uses menuConfig.ts for menu structure and filters items by role/tier.
 * 
 * To enable: Set ENABLE_TIER_AWARE_SIDEBAR=true in AppLayout
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  ChevronDown,
  ChevronRight,
  Gift,
  HelpCircle,
  LogOut,
  Palette,
  Plus,
  Settings,
  UserPlus,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/pages/1-HomePage/others/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/pages/1-HomePage/others/components/ui/avatar';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/pages/1-HomePage/others/components/ui/dropdown-menu';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { usePortalAccess } from '@/hooks/usePortalAccess';
import { usePortalCredits } from '@/hooks/usePortalCredits';
import { getMenuForRole } from '@/config/menuConfig';
import { SidebarSection } from './SidebarSection';
import { SidebarUpgradePrompt } from './SidebarUpgradePrompt';
import NbLogo from '@/pages/1-HomePage/others/components/ui/nb-logo';
import type { MenuItem } from '@/config/menuConfig';

// ============================================================================
// COMPONENT
// ============================================================================

export function TierAwareAppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { profile, signOut, user } = useAuthStore();
  const { userPermissions } = usePortalAccess();
  const credits = usePortalCredits();
  const [upgradePromptItem, setUpgradePromptItem] = useState<MenuItem | null>(null);

  const collapsed = state === 'collapsed';
  const currentRole = profile?.role || 'client';
  const currentTier = userPermissions.subscriptionTier || 'free';
  const tierLabel = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);
  const userEmail = profile?.email || user?.email || 'info@nbcon.org';

  const workspaceName =
    profile?.organization ||
    profile?.company ||
    profile?.full_name ||
    'Workspace';

  const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

  const usagePercentage = Math.min(Math.round(credits.usagePercentage), 100);
  const progressClass = credits.status === 'healthy'
    ? 'bg-emerald-500'
    : credits.status === 'warning'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  // Get menu for current role
  const menuSections = getMenuForRole(currentRole);

  // Handle locked item click
  const handleLockedClick = (item: MenuItem) => {
    setUpgradePromptItem(item);
  };

  // Handle logout
  const handleSignOut = async () => {
    try {
      await signOut();
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = '/auth';
    }
  };

  // Get user initials
  const getInitials = () => {
    if (!profile?.full_name) return 'U';
    const names = profile.full_name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        {/* ============================================
            HEADER SECTION
            ============================================ */}
        <SidebarHeader>
          {/* Logo + Portal Name */}
          <div className={cn(
            "border-b border-sidebar-border",
            collapsed ? "px-4 py-1" : "px-4 py-3"
          )}>
            <div className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "gap-3"
            )}>
              <div className="flex-shrink-0">
                <NbLogo />
              </div>
              <div className={cn(
                "transition-opacity duration-200",
                collapsed && "opacity-0 w-0 overflow-hidden"
              )}>
                <h2 className="text-lg font-bold text-sidebar-foreground">nbcon</h2>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {currentRole} Portal
                </p>
              </div>
            </div>
          </div>

          {/* Tier Badge (if not free and not collapsed) */}
          {!collapsed && currentTier !== 'free' && (
            <div className="px-4 pt-3 pb-2">
              <Badge className="w-full justify-center bg-primary/10 text-primary border-primary/20 capitalize">
                <Crown className="h-3 w-3 mr-1" />
                {currentTier} Tier
              </Badge>
            </div>
          )}
        </SidebarHeader>

        {/* ============================================
            MAIN CONTENT (Menu Sections)
            ============================================ */}
        <SidebarContent className="px-2">
          <div className="space-y-4 py-2">
            {menuSections.map((section, index) => (
              <div key={section.id}>
                <SidebarSection
                  section={section}
                  currentTier={currentTier}
                  onLockedClick={handleLockedClick}
                />
                {/* Divider between sections */}
                {index < menuSections.length - 1 && (
                  <div className="border-b border-sidebar-border/50 my-2" />
                )}
              </div>
            ))}
          </div>
        </SidebarContent>

        {/* ============================================
            FOOTER SECTION
            ============================================ */}
        <SidebarFooter className="p-2 border-t border-sidebar-border space-y-2">
          {/* Upgrade CTA (Free Users Only, Not Collapsed) */}
          {!collapsed && currentTier === 'free' && (
            <Card className="border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-3 text-center space-y-2">
                <Crown className="h-6 w-6 text-primary mx-auto" />
                <p className="text-xs font-medium text-foreground">Unlock Premium Features</p>
                <p className="text-[10px] text-muted-foreground">
                  Get AI tools, analytics, and more
                </p>
                <Button
                  size="sm"
                  className="w-full h-7 text-xs gap-2"
                  onClick={() => navigate('/subscription')}
                >
                  <Crown className="h-3 w-3" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User Profile Dropdown */}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={cn(
                      "w-full",
                      collapsed ? "justify-center px-2" : "gap-3"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "text-left transition-opacity duration-200 flex-1",
                      collapsed && "opacity-0 w-0 overflow-hidden"
                    )}>
                      <p className="text-sm font-semibold text-sidebar-foreground">
                        {profile?.full_name || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-sidebar-foreground/70 capitalize">
                        {currentRole}
                      </p>
                    </div>
                    {!collapsed && (
                      <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  align={collapsed ? 'center' : 'start'}
                  className="z-[1000] w-[280px] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl"
                >
                  {/* Profile */}
                  <div className="my-2 flex items-center gap-2 px-1.5">
                    <Avatar className="h-9 w-9 rounded-xl">
                      <AvatarFallback className="rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-[2px] leading-none">
                      <p className="text-sm font-semibold text-foreground">
                        {profile?.full_name || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>

                  {/* Plan CTA */}
                  <div className="px-1.5 pb-1.5">
                    <div className="flex w-full items-center justify-between rounded-lg bg-muted px-3 py-2 text-foreground">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Crown className="h-4 w-4" />
                        {currentTier === 'free' ? 'Turn Pro' : 'Manage Plan'}
                      </span>
                      <Button
                        size="sm"
                        className="h-7 rounded-md px-3 text-xs"
                        onClick={() => navigate('/subscription')}
                      >
                        {currentTier === 'free' ? 'Upgrade' : 'Open'}
                      </Button>
                    </div>
                  </div>

                  {/* Usage Widget */}
                  {/* Credits Widget */}
                  {!credits.isLoading && credits.tokensLimit > 0 && (
                    <div
                      className="flex flex-col gap-2 px-1.5 pb-1.5"
                      data-testid="credits-widget"
                    >
                      <div className="rounded-lg bg-muted/70 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            AI Tokens
                          </p>
                          <div
                            className={cn(
                              'flex items-center gap-1 text-xs font-medium',
                              credits.statusColor
                            )}
                            data-testid="credits-status-badge"
                          >
                            <span>{credits.statusBadge}</span>
                            <span>{numberFormatter.format(credits.tokensRemaining)} left</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span data-testid="credits-percentage">
                            {numberFormatter.format(credits.tokensUsed)} /{' '}
                            {numberFormatter.format(credits.tokensLimit)} tokens
                          </span>
                          <span>{usagePercentage}% used</span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full transition-all', progressClass)}
                            style={{ width: `${usagePercentage}%` }}
                            data-testid="credits-progress-bar"
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span data-testid="credits-cost">
                            {currencyFormatter.format(credits.costUSD)} USD
                          </span>
                          {credits.resetDate && (
                            <span data-testid="credits-reset-date">
                              Resets {new Date(credits.resetDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {credits.canUpgrade && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 h-7 w-full gap-2 text-xs"
                            onClick={() => navigate('/subscription')}
                            data-testid="credits-upgrade-button"
                          >
                            <Crown className="h-3 w-3" />
                            Upgrade for more tokens
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {credits.isLoading && (
                    <div className="flex flex-col gap-2 px-1.5 pb-1.5">
                      <div className="rounded-lg bg-muted/70 p-3 animate-pulse space-y-2">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-2 rounded bg-muted" />
                        <div className="h-2 rounded bg-muted" />
                        <div className="h-7 rounded bg-muted" />
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-1 px-1.5 pb-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 justify-center gap-2 rounded-md text-sm"
                      onClick={() => navigate(`/${currentRole}/settings`)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 justify-center gap-2 rounded-md text-sm"
                      onClick={() => navigate(`/${currentRole}/team`)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Invite</span>
                    </Button>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Workspaces */}
                  <div className="px-1.5 pb-1.5">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Workspaces (1)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className="group flex cursor-pointer items-center gap-2 rounded-lg bg-accent/20 px-2 py-2 text-left text-sm transition hover:bg-accent/30"
                      >
                        <Avatar className="h-7 w-7 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate text-foreground">
                          {workspaceName}
                        </span>
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-muted px-2 py-[1px] text-[10px] font-medium uppercase text-muted-foreground"
                        >
                          {tierLabel}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition hover:bg-accent/50 hover:text-foreground"
                        onClick={() => navigate('/subscription')}
                      >
                        <Plus className="h-4 w-4" />
                        Create new workspace
                      </button>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Menu Items */}
                  <DropdownMenuItem
                    onClick={() => navigate('/subscription')}
                    className="rounded-lg px-2 py-2 text-sm"
                  >
                    <Gift className="h-4 w-4" />
                    <span>Get free credits</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/${currentRole}/help`)}
                    className="rounded-lg px-2 py-2 text-sm"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/${currentRole}/settings?tab=appearance`)}
                    className="rounded-lg px-2 py-2 text-sm"
                  >
                    <Palette className="h-4 w-4" />
                    <span>Appearance</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-lg px-2 py-2 text-sm text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Upgrade Prompt Modal */}
      <SidebarUpgradePrompt
        item={upgradePromptItem}
        currentTier={currentTier}
        isOpen={!!upgradePromptItem}
        onClose={() => setUpgradePromptItem(null)}
      />
    </>
  );
}

