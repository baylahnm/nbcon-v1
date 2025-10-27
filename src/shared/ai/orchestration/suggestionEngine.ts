/**
 * Contextual Suggestion Engine
 * 
 * Rule-based + heuristic scoring system for recommending next AI tools
 * based on project phase, recent actions, and agent insights.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import {
  AI_TOOL_REGISTRY,
  getTool,
  getChainableTools,
  getToolsByPhase,
  getToolsByCategory,
  type AITool,
  type ProjectPhase,
  type ToolCategory,
} from './toolRegistry';
import type { UserRole } from '@/shared/types/auth';
import type { ToolSession } from './sessionStore';

/**
 * Scored suggestion
 */
export interface ToolSuggestion {
  tool: AITool;
  score: number; // 0-100
  reason: string;
  category: 'next-step' | 'recommended' | 'popular' | 'related';
  priority: 'high' | 'medium' | 'low';
}

/**
 * Suggestion context
 */
export interface SuggestionContext {
  currentToolId?: string;
  projectPhase?: ProjectPhase;
  userRole?: UserRole;
  recentToolIds?: string[];
  projectType?: string;
  session?: ToolSession;
  timeInPhase?: number; // days
}

/**
 * Heuristic scoring weights
 */
const SCORING_WEIGHTS = {
  CHAINABLE: 40, // Tool is chainable from current
  PHASE_MATCH: 30, // Tool matches project phase
  RECENT_USE: 20, // Tool recently used
  CATEGORY_POPULAR: 15, // Popular tool in category
  WORKFLOW_RECOMMENDED: 35, // Part of common workflow
  AGENT_RECOMMENDED: 25, // Agent suggests this tool
  USER_HISTORY: 10, // User has used before
};

/**
 * Generate contextual tool suggestions
 */
export function generateSuggestions(
  context: SuggestionContext,
  limit: number = 5
): ToolSuggestion[] {
  const suggestions: ToolSuggestion[] = [];
  
  // Rule 1: Chainable tools (next logical steps)
  if (context.currentToolId) {
    const chainable = getChainableTools(context.currentToolId);
    const currentTool = getTool(context.currentToolId);
    
    for (const tool of chainable) {
      let score = SCORING_WEIGHTS.CHAINABLE;
      
      // Boost if phase matches
      if (context.projectPhase && tool.permissions.minProjectPhase === context.projectPhase) {
        score += SCORING_WEIGHTS.PHASE_MATCH;
      }
      
      // Boost if user has used before
      if (context.recentToolIds?.includes(tool.id)) {
        score += SCORING_WEIGHTS.USER_HISTORY;
      }
      
      suggestions.push({
        tool,
        score,
        reason: `Natural next step after ${currentTool?.displayName}`,
        category: 'next-step',
        priority: score > 60 ? 'high' : 'medium',
      });
    }
  }
  
  // Rule 2: Phase-appropriate tools
  if (context.projectPhase && suggestions.length < limit) {
    const phaseTools = getToolsByPhase(context.projectPhase);
    
    for (const tool of phaseTools) {
      // Skip if already suggested
      if (suggestions.find((s) => s.tool.id === tool.id)) continue;
      
      let score = SCORING_WEIGHTS.PHASE_MATCH;
      
      // Boost if not used yet in this phase
      if (!context.recentToolIds?.includes(tool.id)) {
        score += 15;
      }
      
      // Boost if high complexity (comprehensive tools)
      if (tool.complexity === 'high') {
        score += 10;
      }
      
      suggestions.push({
        tool,
        score,
        reason: `Recommended for ${context.projectPhase} phase`,
        category: 'recommended',
        priority: score > 50 ? 'high' : 'medium',
      });
    }
  }
  
  // Rule 3: Workflow templates (common sequences)
  if (context.currentToolId && suggestions.length < limit) {
    const workflowSuggestions = getWorkflowSuggestions(
      context.currentToolId,
      context.projectPhase
    );
    
    for (const tool of workflowSuggestions) {
      if (suggestions.find((s) => s.tool.id === tool.id)) continue;
      
      suggestions.push({
        tool,
        score: SCORING_WEIGHTS.WORKFLOW_RECOMMENDED,
        reason: 'Part of common workflow sequence',
        category: 'recommended',
        priority: 'medium',
      });
    }
  }
  
  // Rule 4: Popular tools in category
  if (context.session && suggestions.length < limit) {
    const currentCategory = context.session.activeTool
      ? getTool(context.session.activeTool)?.category
      : undefined;
    
    if (currentCategory) {
      const categoryTools = getToolsByCategory(currentCategory);
      
      for (const tool of categoryTools) {
        if (suggestions.find((s) => s.tool.id === tool.id)) continue;
        
        suggestions.push({
          tool,
          score: SCORING_WEIGHTS.CATEGORY_POPULAR,
          reason: `Popular ${currentCategory} tool`,
          category: 'popular',
          priority: 'low',
        });
      }
    }
  }
  
  // Rule 5: Related agents (if on engineering task)
  if (context.currentToolId && suggestions.length < limit) {
    const currentTool = getTool(context.currentToolId);
    if (currentTool?.category === 'agent') {
      const relatedAgents = getRelatedAgents(context.currentToolId);
      
      for (const agent of relatedAgents) {
        if (suggestions.find((s) => s.tool.id === agent.id)) continue;
        
        suggestions.push({
          tool: agent,
          score: SCORING_WEIGHTS.AGENT_RECOMMENDED,
          reason: 'Related engineering discipline',
          category: 'related',
          priority: 'medium',
        });
      }
    }
  }
  
  // Sort by score descending
  suggestions.sort((a, b) => b.score - a.score);
  
  // Return top N
  return suggestions.slice(0, limit);
}

/**
 * Get workflow-based suggestions
 */
function getWorkflowSuggestions(currentToolId: string, phase?: ProjectPhase): AITool[] {
  // Common workflow sequences
  const workflows: Record<string, string[]> = {
    'project-charter': ['stakeholder-mapper', 'wbs-builder', 'risk-register'],
    'wbs-builder': ['timeline-builder', 'resource-planner', 'cost-estimator'],
    'timeline-builder': ['resource-planner', 'progress-tracker'],
    'cost-estimator': ['boq-generator', 'budget-tracker'],
    'boq-generator': ['budget-tracker', 'procurement-assistant'],
    'risk-register': ['hse-agent', 'quality-planner'],
    'civil-agent': ['structural-agent', 'geotechnical-agent'],
    'structural-agent': ['compliance-checker', 'boq-generator'],
    'electrical-agent': ['hvac-agent', 'compliance-checker'],
  };
  
  const nextToolIds = workflows[currentToolId] || [];
  return nextToolIds.map((id) => getTool(id)).filter((t): t is AITool => t !== undefined);
}

/**
 * Get related agents
 */
function getRelatedAgents(agentId: string): AITool[] {
  const relatedMap: Record<string, string[]> = {
    'civil-agent': ['structural-agent', 'geotechnical-agent', 'survey-agent'],
    'structural-agent': ['civil-agent', 'geotechnical-agent'],
    'electrical-agent': ['hvac-agent'],
    'hvac-agent': ['electrical-agent'],
    'survey-agent': ['civil-agent', 'drone-agent'],
    'drone-agent': ['survey-agent'],
    'geotechnical-agent': ['civil-agent', 'structural-agent'],
  };
  
  const relatedIds = relatedMap[agentId] || [];
  return relatedIds.map((id) => getTool(id)).filter((t): t is AITool => t !== undefined);
}

/**
 * Get suggestions for dashboard quick actions
 */
export function getDashboardSuggestions(
  userRole: UserRole,
  recentProjects?: Array<{ phase: ProjectPhase; type: string }>
): ToolSuggestion[] {
  const suggestions: ToolSuggestion[] = [];
  
  // Most common starting tools by role
  const roleStarterTools: Record<UserRole, string[]> = {
    client: ['project-charter', 'cost-estimator', 'wbs-builder', 'ai-assistant'],
    engineer: ['civil-agent', 'structural-agent', 'boq-generator', 'task-manager'],
    enterprise: ['cost-estimator', 'budget-tracker', 'resource-planner', 'progress-tracker'],
    admin: ['ai-assistant', 'performance-reviewer', 'quality-metrics'],
  };
  
  const starterIds = roleStarterTools[userRole] || [];
  
  for (const toolId of starterIds) {
    const tool = getTool(toolId);
    if (!tool) continue;
    
    let score = 50; // Base score for role starters
    
    // Boost if matches recent project phase
    if (recentProjects && recentProjects.length > 0) {
      const latestPhase = recentProjects[0].phase;
      if (tool.permissions.minProjectPhase === latestPhase) {
        score += 30;
      }
    }
    
    suggestions.push({
      tool,
      score,
      reason: `Popular for ${userRole}s`,
      category: 'recommended',
      priority: score > 70 ? 'high' : 'medium',
    });
  }
  
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 6);
}

/**
 * Get suggestions for chat sidebar
 */
export function getChatSidebarSuggestions(
  conversationHistory: Array<{ role: string; content: string }>,
  session?: ToolSession
): ToolSuggestion[] {
  const suggestions: ToolSuggestion[] = [];
  
  // Analyze recent messages for intent patterns
  const recentMessages = conversationHistory.slice(-5);
  const messageText = recentMessages.map((m) => m.content).join(' ');
  
  // Check for tool-specific keywords
  for (const [toolId, tool] of Object.entries(AI_TOOL_REGISTRY)) {
    let score = 0;
    
    // Check default prompts for keyword matches
    for (const prompt of tool.defaultPrompts) {
      const keywords = prompt.toLowerCase().split(/\s+/);
      for (const keyword of keywords) {
        if (messageText.toLowerCase().includes(keyword)) {
          score += 5;
        }
      }
    }
    
    if (score > 0) {
      // Boost if chainable with current session tool
      if (session?.activeTool && tool.chainableWith?.includes(session.activeTool)) {
        score += 20;
      }
      
      suggestions.push({
        tool,
        score,
        reason: 'Detected from conversation context',
        category: 'related',
        priority: score > 25 ? 'high' : 'low',
      });
    }
  }
  
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Export types
 */
export type { ToolSuggestion, SuggestionContext };

