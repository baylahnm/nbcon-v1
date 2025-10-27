/**
 * Portal Analytics Service
 * 
 * Comprehensive telemetry and analytics tracking for portal navigation,
 * page views, user patterns, and feature usage across unified portal system.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { supabase } from '@/shared/supabase/client';
import type { UserRole } from '@/shared/types/auth';

/**
 * Portal analytics event types
 */
export type PortalEventType = 
  | 'portal_page_view'
  | 'portal_navigation'
  | 'portal_switch'
  | 'quick_action_used';

/**
 * Analytics event payload
 */
export interface PortalAnalyticsPayload {
  event_type: PortalEventType;
  portal: UserRole;
  page_id?: string;
  page_title?: string;
  page_path?: string;
  from_page?: string;
  to_page?: string;
  from_portal?: UserRole;
  to_portal?: UserRole;
  action_id?: string;
  action_category?: string;
  duration_seconds?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Page view summary
 */
export interface PageViewSummary {
  pageId: string;
  pageTitle: string;
  viewCount: number;
  totalDuration: number;
  avgDuration: number;
  lastViewed: Date;
}

/**
 * Navigation pattern
 */
export interface NavigationPattern {
  fromPage: string;
  toPage: string;
  frequency: number;
  avgDuration: number;
}

/**
 * Portal analytics summary
 */
export interface PortalAnalytics {
  totalPageViews: number;
  uniquePagesViewed: number;
  totalNavigations: number;
  portalSwitches: number;
  quickActionsUsed: number;
  topPages: PageViewSummary[];
  commonPatterns: NavigationPattern[];
  avgSessionDuration: number;
}

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Track page view event
 * 
 * @param portal - User's portal (role)
 * @param pageId - Page identifier
 * @param pageTitle - Page title
 * @param pagePath - Page route path
 * @param duration - Time spent on page (seconds)
 * @param metadata - Additional context
 * 
 * @example
 * ```tsx
 * await trackPageView('engineer', 'engineer-dashboard', 'Dashboard', '/engineer/dashboard', 45);
 * ```
 */
export async function trackPageView(
  portal: UserRole,
  pageId: string,
  pageTitle: string,
  pagePath: string,
  duration?: number,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('[PortalAnalytics] No authenticated user, skipping page view tracking');
      return;
    }
    
    const payload: PortalAnalyticsPayload = {
      event_type: 'portal_page_view',
      portal,
      page_id: pageId,
      page_title: pageTitle,
      page_path: pagePath,
      duration_seconds: duration,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    };
    
    await supabase.from('ai_events').insert({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: payload,
    });
  } catch (error) {
    console.error('[PortalAnalytics] Failed to track page view:', error);
  }
}

/**
 * Track navigation event (page to page)
 * 
 * @param portal - User's portal
 * @param fromPageId - Source page ID
 * @param toPageId - Destination page ID
 * @param metadata - Additional context
 */
export async function trackNavigation(
  portal: UserRole,
  fromPageId: string,
  toPageId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const payload: PortalAnalyticsPayload = {
      event_type: 'portal_navigation',
      portal,
      from_page: fromPageId,
      to_page: toPageId,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };
    
    await supabase.from('ai_events').insert({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: payload,
    });
  } catch (error) {
    console.error('[PortalAnalytics] Failed to track navigation:', error);
  }
}

/**
 * Track quick action usage
 * 
 * @param portal - User's portal
 * @param actionId - Quick action identifier
 * @param actionCategory - Action category
 * @param metadata - Additional context
 */
export async function trackQuickAction(
  portal: UserRole,
  actionId: string,
  actionCategory: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const payload: PortalAnalyticsPayload = {
      event_type: 'quick_action_used',
      portal,
      action_id: actionId,
      action_category: actionCategory,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };
    
    await supabase.from('ai_events').insert({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: payload,
    });
  } catch (error) {
    console.error('[PortalAnalytics] Failed to track quick action:', error);
  }
}

/**
 * Track portal switch event
 * 
 * @param fromPortal - Previous portal
 * @param toPortal - New portal
 * @param metadata - Additional context
 */
export async function trackPortalSwitch(
  fromPortal: UserRole,
  toPortal: UserRole,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const payload: PortalAnalyticsPayload = {
      event_type: 'portal_switch',
      from_portal: fromPortal,
      to_portal: toPortal,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };
    
    await supabase.from('ai_events').insert({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: payload,
    });
  } catch (error) {
    console.error('[PortalAnalytics] Failed to track portal switch:', error);
  }
}

// ============================================================================
// ANALYTICS RETRIEVAL
// ============================================================================

/**
 * Get portal analytics for a user
 * 
 * @param role - Portal role to analyze
 * @param dateRange - Optional date range { start, end }
 * @returns Portal analytics summary
 */
export async function getPortalAnalytics(
  role?: UserRole,
  dateRange?: { start: Date; end: Date }
): Promise<PortalAnalytics> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return getEmptyAnalytics();
    }
    
    // Build query
    let query = supabase
      .from('ai_events')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_type', 'tool_used');
    
    // Filter by date range
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error || !data) {
      console.error('[PortalAnalytics] Failed to fetch analytics:', error);
      return getEmptyAnalytics();
    }
    
    // Filter for portal events
    const portalEvents = data.filter((event) => {
      const eventData = event.event_data as PortalAnalyticsPayload;
      return eventData.event_type && eventData.event_type.startsWith('portal_');
    });
    
    // Filter by role if specified
    const filteredEvents = role
      ? portalEvents.filter((event) => {
          const eventData = event.event_data as PortalAnalyticsPayload;
          return eventData.portal === role;
        })
      : portalEvents;
    
    // Calculate metrics
    const pageViews = filteredEvents.filter((e) => {
      const eventData = e.event_data as PortalAnalyticsPayload;
      return eventData.event_type === 'portal_page_view';
    });
    
    const navigations = filteredEvents.filter((e) => {
      const eventData = e.event_data as PortalAnalyticsPayload;
      return eventData.event_type === 'portal_navigation';
    });
    
    const switches = filteredEvents.filter((e) => {
      const eventData = e.event_data as PortalAnalyticsPayload;
      return eventData.event_type === 'portal_switch';
    });
    
    const quickActions = filteredEvents.filter((e) => {
      const eventData = e.event_data as PortalAnalyticsPayload;
      return eventData.event_type === 'quick_action_used';
    });
    
    // Top pages
    const pageViewMap = new Map<string, { count: number; totalDuration: number; title: string; lastViewed: Date }>();
    
    for (const event of pageViews) {
      const eventData = event.event_data as PortalAnalyticsPayload;
      const pageId = eventData.page_id || 'unknown';
      const duration = eventData.duration_seconds || 0;
      
      if (!pageViewMap.has(pageId)) {
        pageViewMap.set(pageId, {
          count: 0,
          totalDuration: 0,
          title: eventData.page_title || pageId,
          lastViewed: new Date(event.created_at),
        });
      }
      
      const entry = pageViewMap.get(pageId)!;
      entry.count += 1;
      entry.totalDuration += duration;
      
      const eventDate = new Date(event.created_at);
      if (eventDate > entry.lastViewed) {
        entry.lastViewed = eventDate;
      }
    }
    
    const topPages: PageViewSummary[] = Array.from(pageViewMap.entries())
      .map(([pageId, data]) => ({
        pageId,
        pageTitle: data.title,
        viewCount: data.count,
        totalDuration: data.totalDuration,
        avgDuration: data.count > 0 ? data.totalDuration / data.count : 0,
        lastViewed: data.lastViewed,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);
    
    // Common navigation patterns
    const patternMap = new Map<string, { count: number; totalDuration: number }>();
    
    for (const event of navigations) {
      const eventData = event.event_data as PortalAnalyticsPayload;
      const key = `${eventData.from_page}→${eventData.to_page}`;
      
      if (!patternMap.has(key)) {
        patternMap.set(key, { count: 0, totalDuration: 0 });
      }
      
      const entry = patternMap.get(key)!;
      entry.count += 1;
    }
    
    const commonPatterns: NavigationPattern[] = Array.from(patternMap.entries())
      .map(([pattern, data]) => {
        const [from, to] = pattern.split('→');
        return {
          fromPage: from,
          toPage: to,
          frequency: data.count,
          avgDuration: data.count > 0 ? data.totalDuration / data.count : 0,
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
    
    // Average session duration
    const totalDuration = pageViews.reduce((sum, event) => {
      const eventData = event.event_data as PortalAnalyticsPayload;
      return sum + (eventData.duration_seconds || 0);
    }, 0);
    
    const avgSessionDuration = pageViews.length > 0 ? totalDuration / pageViews.length : 0;
    
    // Unique pages
    const uniquePages = new Set(
      pageViews.map((event) => {
        const eventData = event.event_data as PortalAnalyticsPayload;
        return eventData.page_id;
      }).filter((id): id is string => id !== undefined)
    );
    
    return {
      totalPageViews: pageViews.length,
      uniquePagesViewed: uniquePages.size,
      totalNavigations: navigations.length,
      portalSwitches: switches.length,
      quickActionsUsed: quickActions.length,
      topPages,
      commonPatterns,
      avgSessionDuration,
    };
  } catch (error) {
    console.error('[PortalAnalytics] Error fetching analytics:', error);
    return getEmptyAnalytics();
  }
}

/**
 * Get user navigation pattern analysis
 * 
 * @param userId - User ID (optional, defaults to current user)
 * @param days - Number of days to analyze
 * @returns Navigation pattern insights
 */
export async function getUserNavigationPattern(
  userId?: string,
  days: number = 30
): Promise<{
  mostVisitedPages: PageViewSummary[];
  preferredEntryPoint: string | null;
  avgPagesPerSession: number;
  peakActivityHour: number | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) {
      return {
        mostVisitedPages: [],
        preferredEntryPoint: null,
        avgPagesPerSession: 0,
        peakActivityHour: null,
      };
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('ai_events')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('event_type', 'tool_used')
      .gte('created_at', startDate.toISOString());
    
    if (error || !data) {
      console.error('[PortalAnalytics] Failed to fetch user pattern:', error);
      return {
        mostVisitedPages: [],
        preferredEntryPoint: null,
        avgPagesPerSession: 0,
        peakActivityHour: null,
      };
    }
    
    // Filter for page views
    const pageViews = data.filter((event) => {
      const eventData = event.event_data as PortalAnalyticsPayload;
      return eventData.event_type === 'portal_page_view';
    });
    
    // Most visited pages
    const pageMap = new Map<string, { count: number; totalDuration: number; title: string }>();
    
    for (const event of pageViews) {
      const eventData = event.event_data as PortalAnalyticsPayload;
      const pageId = eventData.page_id || 'unknown';
      
      if (!pageMap.has(pageId)) {
        pageMap.set(pageId, {
          count: 0,
          totalDuration: 0,
          title: eventData.page_title || pageId,
        });
      }
      
      const entry = pageMap.get(pageId)!;
      entry.count += 1;
      entry.totalDuration += eventData.duration_seconds || 0;
    }
    
    const mostVisited: PageViewSummary[] = Array.from(pageMap.entries())
      .map(([pageId, data]) => ({
        pageId,
        pageTitle: data.title,
        viewCount: data.count,
        totalDuration: data.totalDuration,
        avgDuration: data.count > 0 ? data.totalDuration / data.count : 0,
        lastViewed: new Date(), // Would need to track from events
      }))
      .sort((a, b) => b.viewCount - a.viewCount);
    
    // Preferred entry point (most common first page)
    // Simplified: just get most viewed page
    const preferredEntryPoint = mostVisited[0]?.pageId || null;
    
    // Average pages per session (simplified: total page views / estimated sessions)
    const estimatedSessions = Math.max(1, pageViews.length / 5); // Assume 5 pages per session
    const avgPagesPerSession = pageViews.length / estimatedSessions;
    
    // Peak activity hour
    const hourCounts = new Map<number, number>();
    
    for (const event of pageViews) {
      const hour = new Date(event.created_at).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    }
    
    let peakHour: number | null = null;
    let maxCount = 0;
    
    for (const [hour, count] of hourCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        peakHour = hour;
      }
    }
    
    return {
      mostVisitedPages: mostVisited.slice(0, 5),
      preferredEntryPoint,
      avgPagesPerSession,
      peakActivityHour: peakHour,
    };
  } catch (error) {
    console.error('[PortalAnalytics] Error getting user pattern:', error);
    return {
      mostVisitedPages: [],
      preferredEntryPoint: null,
      avgPagesPerSession: 0,
      peakActivityHour: null,
    };
  }
}

/**
 * Get empty analytics object
 */
function getEmptyAnalytics(): PortalAnalytics {
  return {
    totalPageViews: 0,
    uniquePagesViewed: 0,
    totalNavigations: 0,
    portalSwitches: 0,
    quickActionsUsed: 0,
    topPages: [],
    commonPatterns: [],
    avgSessionDuration: 0,
  };
}

// ============================================================================
// BATCH TRACKING
// ============================================================================

/**
 * Track multiple events in batch
 * 
 * @param events - Array of analytics payloads
 */
export async function trackEventsBatch(
  events: PortalAnalyticsPayload[]
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const rows = events.map((payload) => ({
      user_id: user.id,
      event_type: 'tool_used',
      event_data: payload,
    }));
    
    await supabase.from('ai_events').insert(rows);
  } catch (error) {
    console.error('[PortalAnalytics] Failed to track events batch:', error);
  }
}

/**
 * Export types and functions
 */
export type {
  PortalEventType,
  PortalAnalyticsPayload,
  PageViewSummary,
  NavigationPattern,
  PortalAnalytics,
};

