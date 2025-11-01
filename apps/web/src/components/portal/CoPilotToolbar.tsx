/**
 * CoPilot Toolbar Component
 * 
 * Floating assistant launcher that provides quick access to AI tools, chat, 
 * knowledge base, and agents. Adapts to desktop (fixed button) and mobile (bottom sheet).
 * 
 * @version 2.0.0
 * @created January 2025
 * @see docs/nbcon-new-plan/2 3- 🧠 Phase A UI Unification (Section 3)
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Bot,
  MessageSquare,
  Zap,
  BookOpen,
  Users,
  ChevronUp,
  X,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/pages/1-HomePage/others/components/ui/sheet';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import { FeatureGate } from './FeatureGate';
import type { SubscriptionTier } from '@/shared/types/subscription';

// ============================================================================
// TYPES
// ============================================================================

/**
 * CoPilot action configuration
 */
export interface CoPilotAction {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Optional description */
  description?: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Minimum tier required (default: free) */
  requiredTier?: SubscriptionTier;
  /** Optional feature ID for tracking */
  featureId?: string;
  /** Click handler */
  onClick: () => void;
  /** Optional unread count for badge */
  unreadCount?: number;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Optional badge variant */
  badgeVariant?: 'default' | 'destructive' | 'secondary' | 'outline';
}

/**
 * Placeholder modal callback functions
 */
export interface CoPilotToolbarCallbacks {
  /** Open AI chat modal */
  openChatModal?: () => void;
  /** Open quick actions modal */
  openQuickActionsModal?: () => void;
  /** Open knowledge base modal */
  openKnowledgeBaseModal?: () => void;
  /** Open agents modal */
  openAgentsModal?: () => void;
}

/**
 * Hook return type for unread indicator state
 */
export interface UseUnreadIndicatorReturn {
  /** Total unread count across all actions */
  totalUnread: number;
  /** Unread count for specific action ID */
  getUnreadCount: (actionId: string) => number;
  /** Whether any action has unread items */
  hasUnread: boolean;
}

/**
 * Placeholder hook for unread indicators
 * 
 * TODO: Replace with real implementation that connects to:
 * - Chat notifications (Supabase Realtime)
 * - Agent activity updates
 * - Knowledge base alerts
 * 
 * @returns Unread indicator state
 */
export function useUnreadIndicator(): UseUnreadIndicatorReturn {
  // Placeholder state - replace with real data source
  const [unreadCounts] = useState<Record<string, number>>({
    'ai-chat': 3,
    'agents': 1,
    'knowledge-base': 0,
    'quick-actions': 0,
  });

  const totalUnread = useMemo(() => {
    const values = Object.values(unreadCounts) as number[];
    return values.reduce((sum: number, count: number) => sum + count, 0);
  }, [unreadCounts]);
  
  const getUnreadCount = useCallback((actionId: string): number => {
    return unreadCounts[actionId] || 0;
  }, [unreadCounts]);

  const hasUnread = totalUnread > 0;

  return {
    totalUnread,
    getUnreadCount,
    hasUnread,
  };
}

// ============================================================================
// DEFAULT ACTIONS
// ============================================================================

/**
 * Default CoPilot actions
 */
export const defaultCoPilotActions: CoPilotAction[] = [
  {
    id: 'ai-chat',
    label: 'AI Chat',
    description: 'Chat with your AI assistant',
    icon: MessageSquare,
    requiredTier: 'free',
    featureId: 'ai-chat',
    onClick: () => console.log('[CoPilotToolbar] Open AI Chat'),
  },
  {
    id: 'quick-actions',
    label: 'Quick Actions',
    description: 'AI-powered shortcuts',
    icon: Zap,
    requiredTier: 'pro',
    featureId: 'quick-actions',
    onClick: () => console.log('[CoPilotToolbar] Open Quick Actions'),
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    description: 'Browse documentation and guides',
    icon: BookOpen,
    requiredTier: 'basic',
    featureId: 'knowledge-base',
    onClick: () => console.log('[CoPilotToolbar] Open Knowledge Base'),
  },
  {
    id: 'agents',
    label: 'AI Agents',
    description: 'Specialized domain agents',
    icon: Users,
    requiredTier: 'enterprise',
    featureId: 'ai-agents',
    onClick: () => console.log('[CoPilotToolbar] Open Agents'),
  },
];

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface CoPilotToolbarProps {
  /** Custom actions (defaults to defaultCoPilotActions) */
  actions?: CoPilotAction[];
  /** Optional callbacks for modal triggers */
  callbacks?: CoPilotToolbarCallbacks;
  /** Optional className */
  className?: string;
  /** Whether to show on mobile */
  showOnMobile?: boolean;
  /** Whether to show on desktop */
  showOnDesktop?: boolean;
}

// ============================================================================
// ACTION ITEM COMPONENT
// ============================================================================

interface ActionItemProps {
  action: CoPilotAction;
  unreadCount: number;
  onActionClick: (action: CoPilotAction) => void;
  variant?: 'button' | 'list-item';
}

function ActionItem({ action, unreadCount, onActionClick, variant = 'list-item' }: ActionItemProps) {
  const ActionIcon = action.icon;
  
  const baseContent = (
    <div className="flex items-center gap-3 flex-1">
      <div className="relative flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ActionIcon className="h-5 w-5 text-primary" />
        </div>
        {unreadCount > 0 && (
          <Badge
            variant={action.badgeVariant || 'destructive'}
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{action.label}</p>
        </div>
        {action.description && (
          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
        )}
      </div>
    </div>
  );

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        className="h-auto p-4 justify-start hover:bg-accent transition-colors"
        onClick={() => onActionClick(action)}
        disabled={action.disabled}
        aria-label={`${action.label}${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        {baseContent}
      </Button>
    );
  }

  return (
    <button
      className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => onActionClick(action)}
      disabled={action.disabled}
      aria-label={`${action.label}${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      {baseContent}
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CoPilotToolbar Component
 * 
 * Floating assistant launcher with tier-aware actions.
 * Desktop: Fixed bottom-right button that expands on hover/click.
 * Mobile: Full-width bottom sheet.
 * 
 * @example
 * ```tsx
 * <CoPilotToolbar
 *   callbacks={{
 *     openChatModal: () => setShowChat(true),
 *     openQuickActionsModal: () => setShowQuickActions(true),
 *   }}
 * />
 * ```
 */
export default function CoPilotToolbar({
  actions = defaultCoPilotActions,
  callbacks,
  className,
  showOnMobile = true,
  showOnDesktop = true,
}: CoPilotToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const unreadIndicator = useUnreadIndicator();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle action click with callbacks
  const handleActionClick = useCallback((action: CoPilotAction) => {
    // Map to callbacks if provided
    if (callbacks) {
      switch (action.id) {
        case 'ai-chat':
          callbacks.openChatModal?.();
          break;
        case 'quick-actions':
          callbacks.openQuickActionsModal?.();
          break;
        case 'knowledge-base':
          callbacks.openKnowledgeBaseModal?.();
          break;
        case 'agents':
          callbacks.openAgentsModal?.();
          break;
      }
    }
    
    // Always call action's onClick
    action.onClick();
    
    // Close sheet on mobile after action
    if (isMobile) {
      setIsOpen(false);
    }
  }, [callbacks]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
      
      // Ctrl/Cmd + K to open (common pattern)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus trap for sheet (mobile)
  useEffect(() => {
    if (isOpen && sheetContentRef.current) {
      const focusableElements = sheetContentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      sheetContentRef.current.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        sheetContentRef.current?.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  // Filter actions by visibility (tier will be handled by FeatureGate)
  const visibleActions = actions;

  // Desktop: Floating Button with Hover Expansion
  if (showOnDesktop) {
    return (
      <>
        {/* Desktop Floating Button */}
        <div className={cn('hidden md:block fixed bottom-6 right-6 z-50', className)}>
          <div className="relative">
            {/* Expanded Actions Panel (Desktop - Hover) */}
            {isHovered && !isOpen && (
              <div
                className="absolute bottom-full right-0 mb-3 w-64 rounded-lg border bg-background shadow-xl p-2 space-y-1 transition-all duration-200"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="menu"
                aria-label="CoPilot actions menu"
              >
                {visibleActions.map((action) => {
                  const unreadCount = unreadIndicator.getUnreadCount(action.id);
                  const content = (
                    <ActionItem
                      action={action}
                      unreadCount={unreadCount}
                      onActionClick={handleActionClick}
                      variant="list-item"
                    />
                  );

                  // Wrap in FeatureGate if tier required
                  if (action.requiredTier && action.requiredTier !== 'free') {
                    return (
                      <div key={action.id}>
                        <FeatureGate
                          requiredTier={action.requiredTier}
                          featureId={action.featureId}
                          fallback={
                            <div className="opacity-50 cursor-not-allowed">
                              <ActionItem
                                action={action}
                                unreadCount={unreadCount}
                                onActionClick={() => {}}
                                variant="list-item"
                              />
                            </div>
                          }
                        >
                          {content}
                        </FeatureGate>
                      </div>
                    );
                  }

                  return <div key={action.id}>{content}</div>;
                })}
              </div>
            )}

            {/* Main Floating Button */}
            <button
              ref={buttonRef}
              className="relative h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-2xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => {
                setIsOpen(true);
                setIsHovered(false);
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Open CoPilot assistant"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              aria-controls="copilot-menu"
            >
              <Bot className="h-6 w-6" />
              
              {/* Unread Indicator */}
              {unreadIndicator.hasUnread && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                >
                  {unreadIndicator.totalUnread > 99 ? '99+' : unreadIndicator.totalUnread}
                </Badge>
              )}
              
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                  CoPilot Assistant
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Sheet / Mobile Bottom Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            ref={sheetContentRef}
            side={isMobile ? 'bottom' : 'right'}
            className={cn(
              isMobile ? 'h-[80vh]' : 'w-[400px]'
            )}
            id="copilot-menu"
          >
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    CoPilot Assistant
                  </SheetTitle>
                  {unreadIndicator.hasUnread && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadIndicator.totalUnread} unread
                    </Badge>
                  )}
                </div>
              </SheetHeader>
              
            <div className="mt-6 space-y-2 overflow-y-auto" role="menu" aria-label="CoPilot actions">
              {visibleActions.map((action) => {
                const unreadCount = unreadIndicator.getUnreadCount(action.id);
                const content = (
                  <ActionItem
                    action={action}
                    unreadCount={unreadCount}
                    onActionClick={handleActionClick}
                    variant="list-item"
                  />
                );

                // Wrap in FeatureGate if tier required
                if (action.requiredTier && action.requiredTier !== 'free') {
                  return (
                    <div key={action.id}>
                      <FeatureGate
                        requiredTier={action.requiredTier}
                        featureId={action.featureId}
                        fallback={
                          <div className="opacity-50 cursor-not-allowed">
                            <ActionItem
                              action={action}
                              unreadCount={unreadCount}
                              onActionClick={() => {}}
                              variant="list-item"
                            />
                          </div>
                        }
                      >
                        {content}
                      </FeatureGate>
                    </div>
                  );
                }

                return <div key={action.id}>{content}</div>;
              })}
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Mobile-only mode
  if (showOnMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          ref={sheetContentRef}
          side="bottom"
          className="h-[80vh]"
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                CoPilot Assistant
              </SheetTitle>
              {unreadIndicator.hasUnread && (
                <Badge variant="destructive" className="ml-2">
                  {unreadIndicator.totalUnread} unread
                </Badge>
              )}
            </div>
          </SheetHeader>
          
          <div className="mt-6 space-y-2 overflow-y-auto" role="menu" aria-label="CoPilot actions">
            {visibleActions.map((action) => {
              const unreadCount = unreadIndicator.getUnreadCount(action.id);
              const content = (
                <ActionItem
                  action={action}
                  unreadCount={unreadCount}
                  onActionClick={handleActionClick}
                  variant="list-item"
                />
              );

              // Wrap in FeatureGate if tier required
              if (action.requiredTier && action.requiredTier !== 'free') {
                return (
                  <div key={action.id}>
                    <FeatureGate
                      requiredTier={action.requiredTier}
                      featureId={action.featureId}
                      fallback={
                        <div className="opacity-50 cursor-not-allowed">
                          <ActionItem
                            action={action}
                            unreadCount={unreadCount}
                            onActionClick={() => {}}
                            variant="list-item"
                          />
                        </div>
                      }
                    >
                      {content}
                    </FeatureGate>
                  </div>
                );
              }

              return <div key={action.id}>{content}</div>;
            })}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return null;
}

// Named export
export { CoPilotToolbar };

