/**
 * AI Tool Orchestrator
 * 
 * Central orchestration service for routing intents, executing workflows,
 * and managing agent handoffs across the AI tool ecosystem.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import {
  AI_TOOL_REGISTRY,
  getTool,
  getChainableTools,
  canAccessTool,
  type AITool,
  type ToolCategory,
} from '@/shared/ai/orchestration/toolRegistry';
import { supabase } from '@/shared/supabase/client';
import type { UserRole } from '@/shared/types/auth';
import {
  logToolInvocation,
  logHandoff as logTelemetryHandoff,
  logPermissionDenied,
  logWorkflowStep,
  withTelemetry,
  logTelemetryEvent,
} from '@/shared/observability/aiToolTelemetry';

/**
 * Intent classification result
 */
export interface IntentClassification {
  intent: string; // Primary intent (e.g., "generate_charter", "calculate_cost")
  confidence: number; // 0-1 confidence score
  toolId: string; // Matched tool ID
  extractedParams: Record<string, any>; // Extracted parameters
  alternativeTools?: string[]; // Other possible matches
}

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  toolId: string;
  action: string;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  tokensUsed?: number;
  costUSD?: number;
}

/**
 * Workflow pipeline
 */
export interface WorkflowPipeline {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Agent handoff request
 */
export interface AgentHandoff {
  fromToolId: string;
  toToolId: string;
  context: Record<string, any>;
  reason: string;
  timestamp: Date;
}

/**
 * Orchestration result
 */
export interface OrchestrationResult {
  success: boolean;
  toolId: string;
  output: any;
  nextSuggestions?: string[]; // Suggested next tools
  handoffAvailable?: AgentHandoff[];
  error?: string;
  metadata?: {
    tokensUsed?: number;
    duration?: number;
    confidence?: number;
  };
}

/**
 * Intent patterns for tool matching
 */
const INTENT_PATTERNS: Record<string, RegExp[]> = {
  // Planning
  'project-charter': [
    /create|generate|write.*charter/i,
    /project.*scope|objectives|vision/i,
  ],
  'wbs-builder': [
    /work.*breakdown|wbs/i,
    /organize.*tasks|task.*hierarchy/i,
  ],
  'stakeholder-mapper': [
    /stakeholder.*map|identify.*stakeholders/i,
    /power.*interest.*matrix/i,
  ],
  'risk-register': [
    /identify.*risks?|risk.*assessment/i,
    /risk.*matrix|probability.*impact/i,
  ],
  'timeline-builder': [
    /timeline|gantt|schedule/i,
    /critical.*path|milestones/i,
  ],
  'resource-planner': [
    /resource.*allocation|team.*planning/i,
    /workload|optimize.*resources/i,
  ],

  // Budgeting
  'cost-estimator': [
    /estimate.*cost|cost.*estimation/i,
    /how.*much|budget|pricing/i,
  ],
  'boq-generator': [
    /boq|bill.*of.*quantities/i,
    /quantity.*survey|material.*quantities/i,
  ],
  'budget-tracker': [
    /track.*budget|budget.*status/i,
    /cost.*performance|spending/i,
  ],

  // Execution
  'progress-tracker': [
    /progress|percent.*complete/i,
    /how.*far|completion.*status/i,
  ],
  'task-manager': [
    /assign.*task|todo|task.*list/i,
    /daily.*tasks|team.*assignments/i,
  ],

  // Agents
  'civil-agent': [
    /civil|foundation|structural.*analysis/i,
    /site.*grading|earthwork/i,
  ],
  'electrical-agent': [
    /electrical|power|lighting/i,
    /panel.*sizing|load.*calculation/i,
  ],
  'structural-agent': [
    /beam|column|slab.*design/i,
    /seismic|reinforcement/i,
  ],
  'hvac-agent': [
    /hvac|cooling|heating|duct/i,
    /air.*conditioning|ventilation/i,
  ],
};

/**
 * Parse user intent from message
 */
export function parseIntent(message: string, context?: Record<string, any>): IntentClassification | null {
  const messageLower = message.toLowerCase();
  
  // Find matching tools
  const matches: Array<{ toolId: string; score: number }> = [];
  
  for (const [toolId, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(messageLower)) {
        score += 1;
      }
    }
    
    if (score > 0) {
      // Boost score if context matches
      const tool = getTool(toolId);
      if (tool && context) {
        if (context.projectPhase && tool.permissions.minProjectPhase === context.projectPhase) {
          score += 0.5;
        }
        if (context.category && tool.category === context.category) {
          score += 0.3;
        }
      }
      
      matches.push({ toolId, score });
    }
  }
  
  if (matches.length === 0) return null;
  
  // Sort by score
  matches.sort((a, b) => b.score - a.score);
  
  const topMatch = matches[0];
  const tool = getTool(topMatch.toolId);
  
  if (!tool) return null;
  
  return {
    intent: `${tool.category}_${tool.id}`,
    confidence: Math.min(topMatch.score / 2, 1), // Normalize to 0-1
    toolId: topMatch.toolId,
    extractedParams: extractParameters(message, tool),
    alternativeTools: matches.slice(1, 4).map((m) => m.toolId),
  };
}

/**
 * Extract parameters from message based on tool requirements
 */
function extractParameters(message: string, tool: AITool): Record<string, any> {
  const params: Record<string, any> = {};
  
  // Extract project name
  const projectNameMatch = message.match(/for\s+([A-Z][A-Za-z\s]+?)(?:\s+project)?(?:\.|,|$)/);
  if (projectNameMatch) {
    params.projectName = projectNameMatch[1].trim();
  }
  
  // Extract numbers (costs, durations, etc.)
  const numberMatches = message.match(/\d+(?:,\d{3})*(?:\.\d+)?/g);
  if (numberMatches) {
    params.numbers = numberMatches.map((n) => parseFloat(n.replace(/,/g, '')));
  }
  
  // Extract dates
  const dateMatch = message.match(/\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/);
  if (dateMatch) {
    params.date = dateMatch[0];
  }
  
  return params;
}

/**
 * Route intent to appropriate tool
 */
export async function routeIntent(
  message: string,
  userRole: UserRole,
  userDisciplines?: string[],
  projectPhase?: string,
  sessionContext?: Record<string, any>
): Promise<OrchestrationResult> {
  try {
    // Parse intent
    const intent = parseIntent(message, { projectPhase, ...sessionContext });
    
    if (!intent) {
      return {
        success: false,
        toolId: 'ai-assistant',
        output: null,
        error: 'Could not determine intent. Using general AI assistant.',
      };
    }
    
    const tool = getTool(intent.toolId);
    if (!tool) {
      return {
        success: false,
        toolId: 'ai-assistant',
        output: null,
        error: 'Tool not found in registry.',
      };
    }
    
    // Check permissions
    const hasAccess = canAccessTool(
      tool,
      userRole,
      userDisciplines as any[],
      projectPhase as any
    );
    
    if (!hasAccess) {
      // Log permission denial for telemetry
      await logPermissionDenied(
        tool.id,
        userRole,
        'Role or discipline requirements not met',
        undefined
      );
      
      return {
        success: false,
        toolId: tool.id,
        output: null,
        error: `Access denied: ${tool.displayName} requires specific permissions.`,
      };
    }
    
    // Get next suggestions
    const nextTools = getChainableTools(intent.toolId);
    
    return {
      success: true,
      toolId: tool.id,
      output: {
        recommendation: tool.displayName,
        description: tool.description,
        endpoint: tool.endpoint,
        prompts: tool.defaultPrompts,
        parameters: intent.extractedParams,
      },
      nextSuggestions: nextTools.map((t) => t.id),
      metadata: {
        confidence: intent.confidence,
      },
    };
  } catch (error: any) {
    console.error('[Orchestrator] Error routing intent:', error);
    return {
      success: false,
      toolId: 'ai-assistant',
      output: null,
      error: error.message || 'Orchestration failed',
    };
  }
}

/**
 * Execute a workflow pipeline with telemetry
 */
export async function executeWorkflow(
  pipeline: WorkflowPipeline,
  sessionId: string,
  onStepComplete?: (step: WorkflowStep, index: number) => void
): Promise<WorkflowPipeline> {
  const updatedPipeline = { ...pipeline };
  
  try {
    // Log workflow start
    await logTelemetryEvent({
      eventType: 'workflow_started',
      toolId: pipeline.steps[0]?.toolId || 'unknown',
      sessionId,
      success: true,
      metadata: {
        workflowId: pipeline.id,
        workflowName: pipeline.name,
        stepCount: pipeline.steps.length,
      },
      timestamp: new Date(),
    });
    
    for (let i = updatedPipeline.currentStepIndex; i < updatedPipeline.steps.length; i++) {
      const step = updatedPipeline.steps[i];
      
      // Update step status
      step.status = 'running';
      step.startedAt = new Date();
      
      const tool = getTool(step.toolId);
      if (!tool) {
        step.status = 'failed';
        step.error = 'Tool not found';
        updatedPipeline.status = 'failed';
        break;
      }
      
      try {
        // Execute tool with telemetry wrapper
        const executeWithTelemetry = withTelemetry(
          () => executeToolAction(tool, step.action, step.inputs),
          tool.id,
          sessionId
        );
        
        const result = await executeWithTelemetry();
        
        step.outputs = result.output;
        step.status = 'completed';
        step.completedAt = new Date();
        step.tokensUsed = result.tokensUsed;
        step.costUSD = result.costUSD;
        
        // Log step completion
        await logWorkflowStep(step, sessionId, pipeline.id);
        
        // Callback
        if (onStepComplete) {
          onStepComplete(step, i);
        }
        
        // Transfer outputs to next step inputs (if context switch enabled)
        if (i < updatedPipeline.steps.length - 1 && tool.contextSwitch.preserveState) {
          const nextStep = updatedPipeline.steps[i + 1];
          const carryFields = tool.contextSwitch.carryInputs || [];
          
          for (const field of carryFields) {
            if (step.outputs && step.outputs[field]) {
              nextStep.inputs[field] = step.outputs[field];
            }
          }
          
          // Log context transfer
          await logTelemetryEvent({
            eventType: 'context_transferred',
            toolId: tool.id,
            sessionId,
            success: true,
            metadata: {
              fromTool: tool.id,
              toTool: nextStep.toolId,
              fields: carryFields,
            },
            timestamp: new Date(),
          });
        }
        
        updatedPipeline.currentStepIndex = i + 1;
      } catch (error: any) {
        step.status = 'failed';
        step.error = error.message;
        step.completedAt = new Date();
        
        // Log failure
        await logWorkflowStep(step, sessionId, pipeline.id);
        
        updatedPipeline.status = 'failed';
        break;
      }
    }
    
    // Mark pipeline complete if all steps done
    if (updatedPipeline.currentStepIndex >= updatedPipeline.steps.length) {
      updatedPipeline.status = 'completed';
      updatedPipeline.completedAt = new Date();
      
      // Log workflow completion
      await logTelemetryEvent({
        eventType: 'workflow_completed',
        toolId: pipeline.steps[0]?.toolId || 'unknown',
        sessionId,
        success: true,
        latency: updatedPipeline.completedAt.getTime() - pipeline.createdAt.getTime(),
        metadata: {
          workflowId: pipeline.id,
          stepsCompleted: updatedPipeline.currentStepIndex,
        },
        timestamp: updatedPipeline.completedAt,
      });
    } else if (updatedPipeline.status === 'failed') {
      // Log workflow failure
      await logTelemetryEvent({
        eventType: 'workflow_failed',
        toolId: pipeline.steps[0]?.toolId || 'unknown',
        sessionId,
        success: false,
        metadata: {
          workflowId: pipeline.id,
          failedAtStep: updatedPipeline.currentStepIndex,
        },
        timestamp: new Date(),
      });
    }
    
    return updatedPipeline;
  } catch (error: any) {
    console.error('[Orchestrator] Workflow execution failed:', error);
    updatedPipeline.status = 'failed';
    return updatedPipeline;
  }
}

/**
 * Execute individual tool action (stub for now)
 */
async function executeToolAction(
  tool: AITool,
  action: string,
  inputs: Record<string, any>
): Promise<{ output: any; tokensUsed?: number; costUSD?: number }> {
  // TODO: Implement actual tool execution via edge functions
  // For now, return mock success
  console.log(`[Orchestrator] Executing ${tool.id} action: ${action}`);
  
  return {
    output: {
      toolId: tool.id,
      action,
      result: 'Success (stub implementation)',
      timestamp: new Date().toISOString(),
    },
    tokensUsed: 1000,
    costUSD: 0.01,
  };
}

/**
 * Hand off from one agent/tool to another
 */
export async function handoffToAgent(
  fromToolId: string,
  toToolId: string,
  context: Record<string, any>,
  reason: string,
  userId: string
): Promise<OrchestrationResult> {
  try {
    const fromTool = getTool(fromToolId);
    const toTool = getTool(toToolId);
    
    if (!fromTool || !toTool) {
      return {
        success: false,
        toolId: fromToolId,
        output: null,
        error: 'Tool not found for handoff',
      };
    }
    
    // Verify chainability
    const chainableTools = getChainableTools(fromToolId);
    const isChainable = chainableTools.some((t) => t.id === toToolId);
    
    if (!isChainable) {
      console.warn(`[Orchestrator] Non-recommended handoff: ${fromToolId} → ${toToolId}`);
    }
    
    // Transfer context
    const transferredContext: Record<string, any> = {};
    const carryFields = fromTool.contextSwitch.carryInputs || [];
    
    for (const field of carryFields) {
      if (context[field] !== undefined) {
        transferredContext[field] = context[field];
      }
    }
    
    // Log handoff (telemetry)
    await logAgentHandoff({
      fromToolId,
      toToolId,
      context: transferredContext,
      reason,
      timestamp: new Date(),
    }, userId);
    
    return {
      success: true,
      toolId: toToolId,
      output: {
        transferred: Object.keys(transferredContext),
        targetTool: toTool.displayName,
        context: transferredContext,
      },
      nextSuggestions: toTool.chainableWith,
    };
  } catch (error: any) {
    console.error('[Orchestrator] Handoff failed:', error);
    return {
      success: false,
      toolId: fromToolId,
      output: null,
      error: error.message || 'Handoff failed',
    };
  }
}

/**
 * Log agent handoff for telemetry
 */
async function logAgentHandoff(handoff: AgentHandoff, userId: string): Promise<void> {
  try {
    // Use centralized telemetry logger
    await logTelemetryHandoff(
      handoff,
      `handoff-${Date.now()}`, // session ID
      true, // success
      0 // latency
    );
  } catch (error) {
    console.error('[Orchestrator] Handoff logging error:', error);
  }
}

/**
 * Build workflow pipeline from tool sequence
 */
export function buildPipeline(
  toolSequence: string[],
  initialInputs: Record<string, any>,
  name: string,
  description: string
): WorkflowPipeline {
  const steps: WorkflowStep[] = toolSequence.map((toolId, index) => ({
    toolId,
    action: 'execute',
    inputs: index === 0 ? initialInputs : {},
    status: 'pending',
  }));
  
  return {
    id: `pipeline-${Date.now()}`,
    name,
    description,
    steps,
    currentStepIndex: 0,
    status: 'running',
    createdAt: new Date(),
  };
}

/**
 * Get recommended tools based on context
 */
export function getRecommendedTools(
  currentToolId: string | null,
  projectPhase?: string,
  userRole?: UserRole,
  recentTools?: string[]
): AITool[] {
  const recommendations: AITool[] = [];
  
  // If on a tool, suggest chainable tools
  if (currentToolId) {
    const chainable = getChainableTools(currentToolId);
    recommendations.push(...chainable);
  }
  
  // Suggest tools for current phase
  if (projectPhase && recommendations.length < 5) {
    const phaseTools = Object.values(AI_TOOL_REGISTRY).filter((tool) => {
      const { minProjectPhase } = tool.permissions;
      return minProjectPhase === projectPhase;
    });
    
    recommendations.push(...phaseTools.slice(0, 5 - recommendations.length));
  }
  
  // Filter already recommended
  const uniqueRecommendations = recommendations.filter(
    (tool, index, self) => self.findIndex((t) => t.id === tool.id) === index
  );
  
  return uniqueRecommendations.slice(0, 5);
}

/**
 * Validate tool requirements before execution
 */
export function validateToolRequirements(
  toolId: string,
  inputs: Record<string, any>,
  sessionContext?: Record<string, any>
): { valid: boolean; missing?: string[]; errors?: string[] } {
  const tool = getTool(toolId);
  
  if (!tool) {
    return { valid: false, errors: ['Tool not found'] };
  }
  
  const missing: string[] = [];
  const errors: string[] = [];
  
  // Check project requirement
  if (tool.requirements.project && !sessionContext?.projectId) {
    missing.push('projectId');
  }
  
  // Check minimum data fields
  if (tool.requirements.minData) {
    for (const field of tool.requirements.minData) {
      if (!inputs[field] && !sessionContext?.[field]) {
        missing.push(field);
      }
    }
  }
  
  // Check file requirements
  if (tool.requirements.files && tool.requirements.files.length > 0) {
    if (!inputs.files || inputs.files.length === 0) {
      missing.push('files');
      errors.push(`Required file types: ${tool.requirements.files.join(', ')}`);
    }
  }
  
  return {
    valid: missing.length === 0 && errors.length === 0,
    missing: missing.length > 0 ? missing : undefined,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Create common workflow templates
 */
export const WORKFLOW_TEMPLATES = {
  'full-project-planning': {
    name: 'Complete Project Planning',
    description: 'End-to-end planning workflow',
    sequence: [
      'project-charter',
      'stakeholder-mapper',
      'wbs-builder',
      'risk-register',
      'timeline-builder',
      'resource-planner',
      'cost-estimator',
    ],
  },
  'technical-design': {
    name: 'Technical Design Workflow',
    description: 'Multi-discipline design coordination',
    sequence: [
      'civil-agent',
      'structural-agent',
      'electrical-agent',
      'hvac-agent',
      'compliance-checker',
    ],
  },
  'cost-control': {
    name: 'Cost Control Workflow',
    description: 'Budget planning and tracking',
    sequence: [
      'cost-estimator',
      'boq-generator',
      'budget-tracker',
      'variance-analyzer',
      'financial-forecaster',
    ],
  },
  'project-closeout': {
    name: 'Project Closeout Workflow',
    description: 'Complete project closure',
    sequence: [
      'final-inspector',
      'completion-checklist',
      'handover-packager',
      'performance-reviewer',
      'lessons-learned',
      'archive-manager',
    ],
  },
};

/**
 * Get workflow template by ID
 */
export function getWorkflowTemplate(templateId: keyof typeof WORKFLOW_TEMPLATES) {
  return WORKFLOW_TEMPLATES[templateId];
}

/**
 * Export types for external use
 */
export type {
  IntentClassification,
  WorkflowStep,
  WorkflowPipeline,
  AgentHandoff,
  OrchestrationResult,
};

