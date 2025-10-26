/**
 * Agent Service Layer
 * Phase 2: Specialized AI Engineering Agents
 * 
 * Provides business logic for interacting with specialized agents,
 * managing sessions, generating deliverables, and tracking telemetry.
 */

import { supabase } from '../supabase/client';
import type {
  AIAgent,
  AgentDiscipline,
  AgentSession,
  AgentDeliverable,
  AgentFeedback,
  AgentResponse,
  AgentConfig,
  ValidationResult,
  DecisionPoint,
} from '../types/ai-agents';

// =====================================================
// Agent Discovery & Selection
// =====================================================

/**
 * Get all available specialized agents
 */
export async function getAvailableAgents(): Promise<AIAgent[]> {
  const { data, error } = await supabase.rpc('get_available_agents');
  
  if (error) {
    console.error('[AgentService] Error fetching agents:', error);
    throw error;
  }
  
  return (data || []) as AIAgent[];
}

/**
 * Get specific agent by discipline
 */
export async function getAgentByDiscipline(
  discipline: AgentDiscipline
): Promise<AIAgent | null> {
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('discipline', discipline)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error(`[AgentService] Error fetching ${discipline} agent:`, error);
    return null;
  }
  
  return data as AIAgent;
}

/**
 * Get agent capabilities and tool stack
 */
export function getAgentCapabilities(agent: AIAgent): {
  capabilities: string[];
  tools: string[];
  workflows: string[];
} {
  return {
    capabilities: agent.capabilities,
    tools: agent.tool_stack,
    workflows: agent.workflows,
  };
}

// =====================================================
// Session Management
// =====================================================

/**
 * Start new agent session
 */
export async function startAgentSession(
  agentId: string,
  sessionType: string,
  context?: {
    projectId?: string;
    jobId?: string;
    initialData?: Record<string, any>;
  }
): Promise<string> {
  const { data, error } = await supabase.rpc('start_agent_session', {
    p_agent_id: agentId,
    p_session_type: sessionType,
    p_project_id: context?.projectId || null,
    p_job_id: context?.jobId || null,
  });
  
  if (error) {
    console.error('[AgentService] Error starting session:', error);
    throw error;
  }
  
  console.log('[AgentService] Started session:', data);
  return data as string;
}

/**
 * Get active session for user and agent
 */
export async function getActiveSession(
  agentId: string
): Promise<AgentSession | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('ai_agent_sessions')
    .select('*')
    .eq('agent_id', agentId)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('[AgentService] Error fetching session:', error);
  }
  
  return data as AgentSession | null;
}

/**
 * End agent session
 */
export async function endAgentSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('ai_agent_sessions')
    .update({
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq('id', sessionId);
  
  if (error) {
    console.error('[AgentService] Error ending session:', error);
    throw error;
  }
}

// =====================================================
// Agent Invocation & Workflow
// =====================================================

/**
 * Invoke agent with specific task
 */
export async function invokeAgent(
  agent: AIAgent,
  sessionId: string,
  task: {
    type: string;
    inputs: Record<string, any>;
    context?: Record<string, any>;
  },
  config?: AgentConfig
): Promise<AgentResponse> {
  try {
    // Build specialized prompt
    const prompt = buildAgentPrompt(agent, task, config);
    
    // Call AI with agent's system prompt
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        message: prompt,
        role: 'engineer', // Agent sessions are engineering-focused
        mode: 'research', // Use research mode for technical accuracy
        language: config?.user_preferences.language || 'en',
        agentContext: {
          agent_id: agent.id,
          discipline: agent.discipline,
          session_id: sessionId,
        },
      },
    });
    
    if (error) throw error;
    
    // Parse response and extract structured data
    const output = parseAgentResponse(data.response, task.type);
    
    // Run QA safeguards
    const validationResults = await validateOutput(output, agent.qa_safeguards);
    
    // Check if human review required
    const requiresReview = validationResults.some(v => v.severity === 'error' || !v.passed);
    
    // Log telemetry
    await logAgentTelemetry({
      agent_id: agent.id,
      session_id: sessionId,
      event_type: 'agent_invoked',
      duration_ms: data.processing_time_ms,
      token_count: data.usage?.total_tokens,
      cost_usd: estimateCost(data.usage),
      workflow_stage: task.type,
    });
    
    return {
      status: requiresReview ? 'requires_review' : 'success',
      agent_id: agent.id,
      session_id: sessionId,
      output,
      validation_results: validationResults,
      processing_time_ms: data.processing_time_ms || 0,
      confidence_score: calculateConfidenceScore(validationResults),
      tokens_used: data.usage?.total_tokens,
    };
  } catch (error) {
    console.error('[AgentService] Error invoking agent:', error);
    
    return {
      status: 'error',
      agent_id: agent.id,
      session_id: sessionId,
      output: null,
      processing_time_ms: 0,
      confidence_score: 0,
    };
  }
}

/**
 * Build agent-specific prompt
 */
function buildAgentPrompt(
  agent: AIAgent,
  task: { type: string; inputs: Record<string, any>; context?: Record<string, any> },
  config?: AgentConfig
): string {
  const basePrompt = agent.system_prompt;
  const template = agent.prompt_templates[task.type];
  
  if (!template) {
    // Generic task prompt
    return `${basePrompt}

Task: ${task.type}
Inputs: ${JSON.stringify(task.inputs, null, 2)}
${task.context ? `Context: ${JSON.stringify(task.context, null, 2)}` : ''}

Please analyze the inputs and provide detailed engineering recommendations with calculations and justifications.`;
  }
  
  // Use template with variable substitution
  let prompt = template.template;
  
  template.variables.forEach(variable => {
    const value = task.inputs[variable.name] || variable.default_value;
    prompt = prompt.replace(`{{${variable.name}}}`, String(value));
  });
  
  return `${basePrompt}\n\n${prompt}`;
}

/**
 * Parse agent response into structured data
 */
function parseAgentResponse(response: string, taskType: string): any {
  // Extract JSON if present
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.warn('[AgentService] Failed to parse JSON from response');
    }
  }
  
  // Return raw response if no structured data
  return {
    task_type: taskType,
    raw_response: response,
    parsed_at: new Date().toISOString(),
  };
}

/**
 * Validate agent output against QA safeguards
 */
async function validateOutput(
  output: any,
  safeguards: any[]
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  for (const safeguard of safeguards) {
    const value = output[safeguard.parameter];
    
    if (value === undefined) {
      results.push({
        rule_id: safeguard.id || safeguard.parameter,
        passed: false,
        message: `Missing required parameter: ${safeguard.parameter}`,
        severity: 'warning',
      });
      continue;
    }
    
    let passed = true;
    let message = '';
    
    if (safeguard.check_type === 'range') {
      if (safeguard.min_value !== undefined && value < safeguard.min_value) {
        passed = false;
        message = `${safeguard.parameter} (${value}) below minimum (${safeguard.min_value})`;
      }
      if (safeguard.max_value !== undefined && value > safeguard.max_value) {
        passed = false;
        message = `${safeguard.parameter} (${value}) exceeds maximum (${safeguard.max_value})`;
      }
    }
    
    results.push({
      rule_id: safeguard.id || safeguard.parameter,
      passed,
      message: passed ? `${safeguard.parameter} within acceptable range` : message,
      severity: passed ? 'info' : (safeguard.severity || 'warning'),
      suggested_fix: passed ? undefined : safeguard.error_message,
    });
  }
  
  return results;
}

/**
 * Calculate confidence score from validation results
 */
function calculateConfidenceScore(validationResults: ValidationResult[]): number {
  if (validationResults.length === 0) return 75; // Default moderate confidence
  
  const passed = validationResults.filter(v => v.passed).length;
  const total = validationResults.length;
  
  const criticalFailed = validationResults.filter(
    v => !v.passed && v.severity === 'error'
  ).length;
  
  if (criticalFailed > 0) return Math.min(50, (passed / total) * 100);
  
  return (passed / total) * 100;
}

/**
 * Estimate cost from token usage
 */
function estimateCost(usage?: { total_tokens: number }): number {
  if (!usage) return 0;
  
  // gpt-4o pricing: ~$0.03 per 1K tokens (average of input + output)
  return (usage.total_tokens / 1000) * 0.03;
}

// =====================================================
// Deliverable Management
// =====================================================

/**
 * Save agent deliverable
 */
export async function saveDeliverable(
  sessionId: string,
  agentId: string,
  deliverable: {
    type: string;
    title: string;
    content: any;
    file_url?: string;
  }
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('ai_agent_deliverables')
    .insert({
      session_id: sessionId,
      agent_id: agentId,
      user_id: user.id,
      deliverable_type: deliverable.type,
      title: deliverable.title,
      content: deliverable.content,
      file_url: deliverable.file_url,
      validation_status: 'pending',
    })
    .select()
    .single();
  
  if (error) {
    console.error('[AgentService] Error saving deliverable:', error);
    throw error;
  }
  
  return data.id;
}

/**
 * Get deliverables for session
 */
export async function getSessionDeliverables(
  sessionId: string
): Promise<AgentDeliverable[]> {
  const { data, error } = await supabase
    .from('ai_agent_deliverables')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[AgentService] Error fetching deliverables:', error);
    return [];
  }
  
  return data as AgentDeliverable[];
}

// =====================================================
// Feedback & Telemetry
// =====================================================

/**
 * Submit user feedback
 */
export async function submitFeedback(feedback: {
  sessionId: string;
  feedbackType: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  deliverableId?: string;
}): Promise<string> {
  const { data, error } = await supabase.rpc('submit_agent_feedback', {
    p_session_id: feedback.sessionId,
    p_feedback_type: feedback.feedbackType,
    p_rating: feedback.rating,
    p_comment: feedback.comment || null,
  });
  
  if (error) {
    console.error('[AgentService] Error submitting feedback:', error);
    throw error;
  }
  
  return data;
}

/**
 * Log agent telemetry
 */
export async function logAgentTelemetry(telemetry: {
  agent_id: string;
  session_id: string;
  event_type: string;
  duration_ms?: number;
  token_count?: number;
  cost_usd?: number;
  accuracy_score?: number;
  workflow_stage?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from('ai_agent_telemetry').insert({
    agent_id: telemetry.agent_id,
    user_id: user?.id || null,
    session_id: telemetry.session_id,
    event_type: telemetry.event_type,
    duration_ms: telemetry.duration_ms,
    token_count: telemetry.token_count,
    cost_usd: telemetry.cost_usd,
    accuracy_score: telemetry.accuracy_score,
    workflow_stage: telemetry.workflow_stage,
    metadata: telemetry.metadata || {},
  });
  
  if (error) {
    // Don't throw - telemetry is non-critical
    console.warn('[AgentService] Telemetry logging failed:', error);
  }
}

// =====================================================
// Integration Functions
// =====================================================

/**
 * Push agent update to project dashboard
 */
export async function pushToProjectDashboard(
  projectId: string,
  update: {
    agent_discipline: AgentDiscipline;
    metric: string;
    current_value: number;
    target_value?: number;
    trend?: 'improving' | 'stable' | 'degrading';
  }
): Promise<void> {
  // Implementation depends on project_updates table structure
  console.log('[AgentService] Dashboard update:', { projectId, update });
  
  // TODO: Implement when project_updates table is defined
}

/**
 * Notify engineer for review
 */
export async function notifyEngineerForReview(
  sessionId: string,
  engineerId: string,
  deliverableId: string,
  priority: 'low' | 'medium' | 'high' | 'urgent'
): Promise<void> {
  const { error } = await supabase.from('notifications').insert({
    user_id: engineerId,
    type: 'agent_review_request',
    priority,
    title: 'Agent Deliverable Ready for Review',
    message: `A specialized AI agent has completed work and requires your review.`,
    metadata: {
      session_id: sessionId,
      deliverable_id: deliverableId,
    },
  });
  
  if (error) {
    console.warn('[AgentService] Notification failed:', error);
  }
}

// =====================================================
// Helper Functions
// =====================================================

/**
 * Get agent icon component name
 */
export function getAgentIconName(discipline: AgentDiscipline): string {
  const iconMap: Record<AgentDiscipline, string> = {
    civil: 'Building2',
    electrical: 'Zap',
    structural: 'Hammer',
    hvac: 'Wind',
    surveying: 'MapPin',
    hse: 'Shield',
    drone_survey: 'Plane',
    maintenance: 'Wrench',
    geotechnical: 'Mountain',
  };
  
  return iconMap[discipline];
}

/**
 * Get agent color scheme
 */
export function getAgentColorScheme(discipline: AgentDiscipline): string {
  const colorMap: Record<AgentDiscipline, string> = {
    civil: 'bg-blue-600',
    electrical: 'bg-yellow-600',
    structural: 'bg-gray-700',
    hvac: 'bg-cyan-600',
    surveying: 'bg-green-600',
    hse: 'bg-red-600',
    drone_survey: 'bg-purple-600',
    maintenance: 'bg-orange-600',
    geotechnical: 'bg-amber-700',
  };
  
  return colorMap[discipline];
}

/**
 * Format agent display name with icon
 */
export function formatAgentDisplay(agent: AIAgent): {
  icon: string;
  name: string;
  color: string;
} {
  return {
    icon: agent.icon_name,
    name: agent.display_name,
    color: agent.color_scheme,
  };
}

// =====================================================
// Analytics Functions
// =====================================================

/**
 * Get agent performance metrics
 */
export async function getAgentPerformanceMetrics(
  agentId: string,
  period: { start: string; end: string }
): Promise<any> {
  // This would query the agent_performance_metrics view
  const { data, error } = await supabase
    .from('agent_performance_metrics')
    .select('*')
    .eq('agent_id', agentId);
  
  if (error) {
    console.error('[AgentService] Error fetching metrics:', error);
    return null;
  }
  
  return data;
}

/**
 * Get user's agent usage history
 */
export async function getUserAgentHistory(
  limit: number = 10
): Promise<AgentSession[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('ai_agent_sessions')
    .select('*, ai_agents(display_name, icon_name, discipline)')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('[AgentService] Error fetching history:', error);
    return [];
  }
  
  return data as AgentSession[];
}

