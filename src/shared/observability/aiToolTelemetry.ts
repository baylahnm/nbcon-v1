/**
 * AI Tool Telemetry & Observability
 * 
 * Comprehensive telemetry instrumentation for AI tool orchestration,
 * workflow chains, agent handoffs, and performance monitoring.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { supabase } from '@/shared/supabase/client';
import type { WorkflowStep, AgentHandoff } from '@/pages/4-free/others/features/ai/services/orchestrator';

/**
 * Telemetry event types
 */
export type TelemetryEventType =
  | 'tool_invoked'
  | 'workflow_started'
  | 'workflow_step_completed'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'agent_handoff'
  | 'permission_denied'
  | 'context_transferred'
  | 'suggestion_accepted'
  | 'suggestion_dismissed';

/**
 * Telemetry event
 */
export interface TelemetryEvent {
  eventType: TelemetryEventType;
  toolId: string;
  sessionId?: string;
  conversationId?: string;
  projectId?: string;
  
  // Performance metrics
  latency?: number; // milliseconds
  tokensUsed?: number;
  costUSD?: number;
  
  // Outcome
  success: boolean;
  errorMessage?: string;
  
  // Context
  metadata?: Record<string, unknown>;
  
  // Timestamp
  timestamp: Date;
}

/**
 * Log telemetry event to Supabase
 */
export async function logTelemetryEvent(event: TelemetryEvent): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('[Telemetry] No authenticated user, skipping event log');
      return;
    }
    
    const { error } = await supabase.from('ai_agent_telemetry').insert({
      user_id: user.id,
      event_type: event.eventType,
      tool_id: event.toolId,
      session_id: event.sessionId,
      conversation_id: event.conversationId,
      project_id: event.projectId,
      latency_ms: event.latency,
      tokens_used: event.tokensUsed,
      cost_usd: event.costUSD,
      success: event.success,
      error_message: event.errorMessage,
      metadata: event.metadata || {},
      created_at: event.timestamp.toISOString(),
    });
    
    if (error) {
      console.error('[Telemetry] Failed to log event:', error);
    }
  } catch (error) {
    console.error('[Telemetry] Event logging error:', error);
  }
}

/**
 * Log tool invocation
 */
export async function logToolInvocation(
  toolId: string,
  sessionId: string,
  latency: number,
  success: boolean,
  options?: {
    conversationId?: string;
    projectId?: string;
    tokensUsed?: number;
    costUSD?: number;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  await logTelemetryEvent({
    eventType: 'tool_invoked',
    toolId,
    sessionId,
    conversationId: options?.conversationId,
    projectId: options?.projectId,
    latency,
    tokensUsed: options?.tokensUsed,
    costUSD: options?.costUSD,
    success,
    errorMessage: options?.errorMessage,
    metadata: options?.metadata,
    timestamp: new Date(),
  });
}

/**
 * Log workflow step completion
 */
export async function logWorkflowStep(
  step: WorkflowStep,
  sessionId: string,
  workflowId: string,
  projectId?: string
): Promise<void> {
  const latency = step.completedAt && step.startedAt
    ? step.completedAt.getTime() - step.startedAt.getTime()
    : undefined;
  
  await logTelemetryEvent({
    eventType: step.status === 'completed' ? 'workflow_step_completed' : 'workflow_failed',
    toolId: step.toolId,
    sessionId,
    projectId,
    latency,
    tokensUsed: step.tokensUsed,
    costUSD: step.costUSD,
    success: step.status === 'completed',
    errorMessage: step.error,
    metadata: {
      workflowId,
      action: step.action,
      inputs: Object.keys(step.inputs),
      outputs: step.outputs ? Object.keys(step.outputs) : [],
    },
    timestamp: new Date(),
  });
}

/**
 * Log agent handoff
 */
export async function logHandoff(
  handoff: AgentHandoff,
  sessionId: string,
  success: boolean,
  latency?: number
): Promise<void> {
  await logTelemetryEvent({
    eventType: 'agent_handoff',
    toolId: handoff.fromToolId,
    sessionId,
    latency,
    success,
    metadata: {
      fromTool: handoff.fromToolId,
      toTool: handoff.toToolId,
      reason: handoff.reason,
      contextFields: Object.keys(handoff.context),
    },
    timestamp: handoff.timestamp,
  });
}

/**
 * Log permission denial
 */
export async function logPermissionDenied(
  toolId: string,
  userRole: string,
  reason: string,
  sessionId?: string
): Promise<void> {
  await logTelemetryEvent({
    eventType: 'permission_denied',
    toolId,
    sessionId,
    success: false,
    metadata: {
      userRole,
      reason,
    },
    timestamp: new Date(),
  });
}

/**
 * Log suggestion acceptance/dismissal
 */
export async function logSuggestion(
  toolId: string,
  accepted: boolean,
  suggestionReason: string,
  sessionId?: string
): Promise<void> {
  await logTelemetryEvent({
    eventType: accepted ? 'suggestion_accepted' : 'suggestion_dismissed',
    toolId,
    sessionId,
    success: true,
    metadata: {
      reason: suggestionReason,
    },
    timestamp: new Date(),
  });
}

/**
 * Get telemetry summary for session
 */
export async function getSessionTelemetry(
  sessionId: string
): Promise<{
  totalEvents: number;
  toolInvocations: number;
  successRate: number;
  totalLatency: number;
  totalTokens: number;
  totalCost: number;
  eventsByType: Record<TelemetryEventType, number>;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return getEmptyTelemetry();
    }
    
    const { data, error } = await supabase
      .from('ai_agent_telemetry')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_id', sessionId);
    
    if (error || !data) {
      console.error('[Telemetry] Failed to fetch session data:', error);
      return getEmptyTelemetry();
    }
    
    const events = data as any[];
    
    const summary = {
      totalEvents: events.length,
      toolInvocations: events.filter((e) => e.event_type === 'tool_invoked').length,
      successRate: events.length > 0
        ? events.filter((e) => e.success).length / events.length
        : 0,
      totalLatency: events.reduce((sum, e) => sum + (e.latency_ms || 0), 0),
      totalTokens: events.reduce((sum, e) => sum + (e.tokens_used || 0), 0),
      totalCost: events.reduce((sum, e) => sum + (e.cost_usd || 0), 0),
      eventsByType: {} as Record<TelemetryEventType, number>,
    };
    
    // Count events by type
    for (const event of events) {
      const type = event.event_type as TelemetryEventType;
      summary.eventsByType[type] = (summary.eventsByType[type] || 0) + 1;
    }
    
    return summary;
  } catch (error) {
    console.error('[Telemetry] Error fetching session summary:', error);
    return getEmptyTelemetry();
  }
}

/**
 * Empty telemetry result
 */
function getEmptyTelemetry() {
  return {
    totalEvents: 0,
    toolInvocations: 0,
    successRate: 0,
    totalLatency: 0,
    totalTokens: 0,
    totalCost: 0,
    eventsByType: {} as Record<TelemetryEventType, number>,
  };
}

/**
 * Telemetry middleware for orchestrator
 */
export function withTelemetry<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  toolId: string,
  sessionId?: string
): T {
  return (async (...args: unknown[]) => {
    const startTime = Date.now();
    let success = false;
    let error: string | undefined;
    
    try {
      const result = await fn(...args);
      success = true;
      return result;
    } catch (err: unknown) {
      success = false;
      error = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      const latency = Date.now() - startTime;
      
      await logToolInvocation(toolId, sessionId || 'unknown', latency, success, {
        errorMessage: error,
        metadata: {
          functionName: fn.name,
          args: args.length,
        },
      });
    }
  }) as T;
}

/**
 * Export types
 */
export type { TelemetryEvent, TelemetryEventType };

