/**
 * AI Tool Registry
 * 
 * Centralized registry of all 43 AI tools and 9 specialized agents
 * with metadata, permissions, capabilities, and routing information.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import type { UserRole } from '@/shared/types/auth';

/**
 * Tool categories aligned with nbcon AI Tools structure
 */
export type ToolCategory =
  | 'assistant'
  | 'planning'
  | 'budgeting'
  | 'execution'
  | 'quality'
  | 'communication'
  | 'closure'
  | 'agent';

/**
 * Project lifecycle phases for contextual filtering
 */
export type ProjectPhase =
  | 'initiation'
  | 'planning'
  | 'design'
  | 'execution'
  | 'monitoring'
  | 'closure';

/**
 * Engineering disciplines for specialized agents
 */
export type EngineeringDiscipline =
  | 'civil'
  | 'electrical'
  | 'structural'
  | 'hvac'
  | 'survey'
  | 'hse'
  | 'drone'
  | 'maintenance'
  | 'geotechnical';

/**
 * Capability tags for filtering and discovery
 */
export type CapabilityTag =
  | 'calculation'
  | 'generation'
  | 'analysis'
  | 'validation'
  | 'compliance'
  | 'visualization'
  | 'reporting'
  | 'collaboration';

/**
 * Tool requirement types
 */
export interface ToolRequirements {
  project?: boolean; // Requires active project context
  files?: string[]; // File types required (e.g., ['dwg', 'pdf'])
  minData?: string[]; // Minimum data fields needed
  permissions?: string[]; // Special permissions needed
}

/**
 * Context switch configuration
 */
export interface ContextSwitchHook {
  preserveState: boolean; // Keep current state when switching
  carryInputs?: string[]; // Field names to transfer
  transformFn?: string; // Function name for data transformation
}

/**
 * Permission configuration
 */
export interface ToolPermissions {
  allowedRoles: UserRole[];
  requiredDisciplines?: EngineeringDiscipline[];
  minProjectPhase?: ProjectPhase;
  maxProjectPhase?: ProjectPhase;
  featureFlag?: string; // Feature flag name if gated
}

/**
 * AI Tool Registration Entry
 */
export interface AITool {
  id: string;
  displayName: string;
  description: string;
  category: ToolCategory;
  
  // Routing & Execution
  endpoint: string; // UI route or API endpoint
  handler?: string; // Service function name
  
  // Capabilities
  capabilities: CapabilityTag[];
  requirements: ToolRequirements;
  
  // AI Integration
  defaultPrompts: string[];
  systemPrompt?: string;
  
  // Workflow
  contextSwitch: ContextSwitchHook;
  chainableWith?: string[]; // Tool IDs that can follow
  
  // Access Control
  permissions: ToolPermissions;
  
  // Metadata
  icon: string; // Lucide icon name
  color?: string; // Optional theme color
  estimatedDuration?: number; // Minutes
  complexity?: 'low' | 'medium' | 'high';
}

/**
 * Complete AI Tool Registry
 * 
 * 43 tools total:
 * - 1 AI Assistant
 * - 6 Planning Tools
 * - 6 Budgeting Tools
 * - 6 Execution Tools
 * - 6 Quality Tools
 * - 6 Communication Tools
 * - 6 Closure Tools
 * - 9 Engineering Agents
 */
export const AI_TOOL_REGISTRY: Record<string, AITool> = {
  // ============================================================================
  // CATEGORY: AI ASSISTANT
  // ============================================================================
  
  'ai-assistant': {
    id: 'ai-assistant',
    displayName: 'AI Assistant',
    description: 'Multi-mode AI chat with 30 construction-specific prompts',
    category: 'assistant',
    endpoint: '/free/ai',
    capabilities: ['generation', 'analysis', 'collaboration'],
    requirements: {},
    defaultPrompts: [
      'Help me plan a construction project',
      'Estimate costs for site preparation',
      'Draft a client proposal',
      'Analyze project risks',
      'Generate meeting agenda',
    ],
    contextSwitch: { preserveState: true },
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise', 'admin'],
    },
    icon: 'Bot',
  },

  // ============================================================================
  // CATEGORY: PLANNING TOOLS (6 tools)
  // ============================================================================

  'project-charter': {
    id: 'project-charter',
    displayName: 'Project Charter Generator',
    description: 'AI-powered project charter with vision, scope, and stakeholders',
    category: 'planning',
    endpoint: '/free/ai-tools/planning/charter',
    handler: 'generateProjectCharter',
    capabilities: ['generation', 'collaboration'],
    requirements: {
      project: true,
      minData: ['projectName', 'projectType'],
    },
    defaultPrompts: [
      'Generate project charter for {projectName}',
      'Define project scope and objectives',
      'Identify key stakeholders',
      'List project constraints and assumptions',
    ],
    systemPrompt: 'You are a project management expert specializing in Saudi construction projects. Generate comprehensive project charters following PMI standards.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['projectName', 'projectType', 'budget', 'timeline'],
    },
    chainableWith: ['wbs-builder', 'stakeholder-mapper', 'risk-register'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'initiation',
      maxProjectPhase: 'planning',
    },
    icon: 'FileText',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  'wbs-builder': {
    id: 'wbs-builder',
    displayName: 'WBS Builder',
    description: 'Hierarchical work breakdown structure with task organization',
    category: 'planning',
    endpoint: '/free/ai-tools/planning/wbs',
    handler: 'generateWBS',
    capabilities: ['generation', 'visualization'],
    requirements: {
      project: true,
      minData: ['projectScope'],
    },
    defaultPrompts: [
      'Generate WBS for {projectName}',
      'Break down project into work packages',
      'Organize tasks hierarchically',
      'Estimate task durations',
    ],
    systemPrompt: 'You are a construction planning expert. Generate detailed Work Breakdown Structures following CSI MasterFormat divisions for Saudi projects.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['projectScope', 'deliverables', 'constraints'],
    },
    chainableWith: ['timeline-builder', 'resource-planner', 'cost-estimator'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'Network',
    estimatedDuration: 20,
    complexity: 'high',
  },

  'stakeholder-mapper': {
    id: 'stakeholder-mapper',
    displayName: 'Stakeholder Mapper',
    description: 'Power/Interest matrix for stakeholder engagement planning',
    category: 'planning',
    endpoint: '/free/ai-tools/planning/stakeholders',
    handler: 'mapStakeholders',
    capabilities: ['analysis', 'collaboration'],
    requirements: {
      project: true,
    },
    defaultPrompts: [
      'Identify project stakeholders for {projectName}',
      'Map stakeholder power and interest levels',
      'Suggest engagement strategies',
      'Plan stakeholder communications',
    ],
    systemPrompt: 'You are a stakeholder management expert. Identify and categorize stakeholders for Saudi construction projects.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['projectType', 'projectSize', 'location'],
    },
    chainableWith: ['project-charter', 'communication-planner'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'initiation',
    },
    icon: 'Users',
    estimatedDuration: 10,
    complexity: 'low',
  },

  'risk-register': {
    id: 'risk-register',
    displayName: 'Risk Register',
    description: '5×5 risk heat map with probability and impact assessment',
    category: 'planning',
    endpoint: '/free/ai-tools/planning/risks',
    handler: 'assessRisks',
    capabilities: ['analysis', 'validation'],
    requirements: {
      project: true,
    },
    defaultPrompts: [
      'Identify risks for {projectName}',
      'Assess risk probability and impact',
      'Suggest mitigation strategies',
      'Prioritize high-impact risks',
    ],
    systemPrompt: 'You are a risk management expert for construction projects in Saudi Arabia. Identify and assess risks following ISO 31000.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['projectType', 'projectScope', 'constraints'],
    },
    chainableWith: ['hse-agent', 'quality-planner', 'contingency-planner'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'AlertTriangle',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  'timeline-builder': {
    id: 'timeline-builder',
    displayName: 'Timeline Builder (Gantt)',
    description: 'Gantt chart with dependencies, critical path, and milestones',
    category: 'planning',
    endpoint: '/free/ai-tools/planning/timeline',
    handler: 'generateTimeline',
    capabilities: ['generation', 'visualization', 'calculation'],
    requirements: {
      project: true,
      minData: ['wbs', 'startDate'],
    },
    defaultPrompts: [
      'Generate project timeline for {projectName}',
      'Calculate critical path',
      'Identify key milestones',
      'Optimize schedule with resource leveling',
    ],
    systemPrompt: 'You are a scheduling expert for construction projects. Generate realistic timelines considering Saudi work weeks and holidays.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['wbs', 'resources', 'constraints', 'dependencies'],
    },
    chainableWith: ['resource-planner', 'progress-tracker', 'schedule-optimizer'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'Calendar',
    estimatedDuration: 25,
    complexity: 'high',
  },

  'resource-planner': {
    id: 'resource-planner',
    displayName: 'Resource Planner',
    description: 'Team allocation, workload utilization, and availability tracking',
    category: 'planning',
    endpoint: '/free/ai-tools/planning/resources',
    handler: 'planResources',
    capabilities: ['calculation', 'analysis', 'visualization'],
    requirements: {
      project: true,
      minData: ['timeline', 'teamSize'],
    },
    defaultPrompts: [
      'Optimize resource allocation for {projectName}',
      'Identify over-allocated resources',
      'Balance team workload',
      'Suggest additional resources needed',
    ],
    systemPrompt: 'You are a resource management expert. Optimize team allocation considering Saudi labor regulations and availability.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['timeline', 'teamMembers', 'skillRequirements'],
    },
    chainableWith: ['timeline-builder', 'cost-estimator', 'team-coordinator'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'Users2',
    estimatedDuration: 20,
    complexity: 'medium',
  },

  // ============================================================================
  // CATEGORY: BUDGETING TOOLS (6 tools)
  // ============================================================================

  'cost-estimator': {
    id: 'cost-estimator',
    displayName: 'Cost Estimator',
    description: 'Detailed cost estimation with Saudi market rates',
    category: 'budgeting',
    endpoint: '/free/ai-tools/budgeting/estimator',
    handler: 'estimateCosts',
    capabilities: ['calculation', 'analysis'],
    requirements: {
      project: true,
      minData: ['wbs', 'quantities'],
    },
    defaultPrompts: [
      'Estimate costs for {projectName}',
      'Calculate material quantities and costs',
      'Apply Saudi market rates',
      'Generate cost breakdown by CSI division',
    ],
    systemPrompt: 'You are a cost estimation expert for Saudi construction. Use current market rates and CSI MasterFormat divisions.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['wbs', 'quantities', 'specifications'],
    },
    chainableWith: ['boq-generator', 'budget-tracker', 'variance-analyzer'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'Calculator',
    estimatedDuration: 30,
    complexity: 'high',
  },

  'boq-generator': {
    id: 'boq-generator',
    displayName: 'BOQ Generator',
    description: 'Bill of Quantities with detailed item breakdown and pricing',
    category: 'budgeting',
    endpoint: '/free/ai-tools/budgeting/boq',
    handler: 'generateBOQ',
    capabilities: ['generation', 'calculation'],
    requirements: {
      project: true,
      minData: ['drawings', 'specifications'],
      files: ['dwg', 'pdf'],
    },
    defaultPrompts: [
      'Generate BOQ from drawings',
      'Extract quantities from plans',
      'Apply unit rates',
      'Create Excel BOQ export',
    ],
    systemPrompt: 'You are a quantity surveying expert. Generate accurate BOQs following Saudi standards and CSI format.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['drawings', 'specifications', 'rates'],
    },
    chainableWith: ['cost-estimator', 'budget-tracker', 'civil-agent'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      requiredDisciplines: ['civil', 'structural'],
      minProjectPhase: 'design',
    },
    icon: 'FileSpreadsheet',
    estimatedDuration: 45,
    complexity: 'high',
  },

  'budget-tracker': {
    id: 'budget-tracker',
    displayName: 'Budget Tracker',
    description: 'Real-time budget monitoring with variance analysis',
    category: 'budgeting',
    endpoint: '/free/ai-tools/budgeting/tracker',
    handler: 'trackBudget',
    capabilities: ['analysis', 'reporting', 'visualization'],
    requirements: {
      project: true,
      minData: ['baseline', 'actuals'],
    },
    defaultPrompts: [
      'Track budget performance',
      'Analyze cost variances',
      'Forecast final costs',
      'Generate budget report',
    ],
    systemPrompt: 'You are a project controls expert. Track budgets and forecast using Earned Value Management.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['baseline', 'actuals', 'forecasts'],
    },
    chainableWith: ['cost-estimator', 'variance-analyzer', 'financial-reporter'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'TrendingUp',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  'variance-analyzer': {
    id: 'variance-analyzer',
    displayName: 'Cost Variance Analyzer',
    description: 'Identify and explain budget deviations',
    category: 'budgeting',
    endpoint: '/free/ai-tools/budgeting/variance',
    handler: 'analyzeVariance',
    capabilities: ['analysis', 'reporting'],
    requirements: {
      project: true,
      minData: ['baseline', 'actuals'],
    },
    defaultPrompts: [
      'Analyze cost overruns',
      'Explain budget variances',
      'Identify cost drivers',
      'Recommend corrective actions',
    ],
    systemPrompt: 'You are a cost control expert. Analyze variances and provide actionable insights.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['baseline', 'actuals', 'changes'],
    },
    chainableWith: ['budget-tracker', 'change-order-manager'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'AlertCircle',
    estimatedDuration: 10,
    complexity: 'low',
  },

  'financial-forecaster': {
    id: 'financial-forecaster',
    displayName: 'Financial Forecaster',
    description: 'Project EVM and cash flow forecasting',
    category: 'budgeting',
    endpoint: '/free/ai-tools/budgeting/forecast',
    handler: 'forecastFinancials',
    capabilities: ['calculation', 'analysis', 'reporting'],
    requirements: {
      project: true,
      minData: ['baseline', 'actuals', 'trends'],
    },
    defaultPrompts: [
      'Forecast project completion costs',
      'Calculate EAC and ETC',
      'Predict cash flow',
      'Estimate contingency needs',
    ],
    systemPrompt: 'You are a project controls expert. Use Earned Value Management to forecast project financials.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['baseline', 'actuals', 'performance'],
    },
    chainableWith: ['budget-tracker', 'variance-analyzer'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'TrendingUp',
    estimatedDuration: 20,
    complexity: 'medium',
  },

  'roi-calculator': {
    id: 'roi-calculator',
    displayName: 'ROI Calculator',
    description: 'Return on investment and business case analysis',
    category: 'budgeting',
    endpoint: '/free/ai-tools/budgeting/roi',
    handler: 'calculateROI',
    capabilities: ['calculation', 'analysis'],
    requirements: {
      project: true,
      minData: ['costs', 'benefits'],
    },
    defaultPrompts: [
      'Calculate project ROI',
      'Analyze business case',
      'Compare investment alternatives',
      'Estimate payback period',
    ],
    systemPrompt: 'You are a financial analyst specializing in construction projects. Calculate ROI and NPV.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['costs', 'benefits', 'timeline'],
    },
    chainableWith: ['cost-estimator', 'financial-forecaster'],
    permissions: {
      allowedRoles: ['client', 'enterprise'],
      minProjectPhase: 'initiation',
    },
    icon: 'PiggyBank',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  // ============================================================================
  // CATEGORY: EXECUTION TOOLS (6 tools)
  // ============================================================================

  'task-manager': {
    id: 'task-manager',
    displayName: 'Task Manager',
    description: 'Daily task tracking and assignment',
    category: 'execution',
    endpoint: '/free/ai-tools/execution/tasks',
    handler: 'manageTasks',
    capabilities: ['collaboration', 'reporting'],
    requirements: {
      project: true,
      minData: ['wbs'],
    },
    defaultPrompts: [
      'List today\'s tasks',
      'Assign tasks to team members',
      'Track task completion',
      'Identify blockers',
    ],
    systemPrompt: 'You are a construction project coordinator. Manage daily tasks and team assignments.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['wbs', 'team', 'schedule'],
    },
    chainableWith: ['progress-tracker', 'team-coordinator', 'timeline-builder'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'CheckSquare',
    estimatedDuration: 10,
    complexity: 'low',
  },

  'progress-tracker': {
    id: 'progress-tracker',
    displayName: 'Progress Tracker',
    description: 'Real-time progress monitoring and reporting',
    category: 'execution',
    endpoint: '/free/ai-tools/execution/progress',
    handler: 'trackProgress',
    capabilities: ['analysis', 'reporting', 'visualization'],
    requirements: {
      project: true,
      minData: ['baseline', 'actuals'],
    },
    defaultPrompts: [
      'Calculate project progress',
      'Generate progress report',
      'Identify schedule delays',
      'Forecast completion date',
    ],
    systemPrompt: 'You are a project controls expert. Track progress using physical percent complete and S-curves.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['baseline', 'actuals', 'milestones'],
    },
    chainableWith: ['timeline-builder', 'variance-analyzer', 'status-reporter'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'Activity',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  'team-coordinator': {
    id: 'team-coordinator',
    displayName: 'Team Coordinator',
    description: 'Team coordination and resource optimization',
    category: 'execution',
    endpoint: '/free/ai-tools/execution/team',
    handler: 'coordinateTeam',
    capabilities: ['collaboration', 'analysis'],
    requirements: {
      project: true,
      minData: ['team', 'tasks'],
    },
    defaultPrompts: [
      'Coordinate team activities',
      'Resolve resource conflicts',
      'Optimize team performance',
      'Plan daily standups',
    ],
    systemPrompt: 'You are a construction team lead. Coordinate field teams following Saudi work practices.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['team', 'schedule', 'resources'],
    },
    chainableWith: ['task-manager', 'resource-planner', 'communication-planner'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'Users',
    estimatedDuration: 10,
    complexity: 'low',
  },

  'schedule-optimizer': {
    id: 'schedule-optimizer',
    displayName: 'Schedule Optimizer',
    description: 'AI-powered schedule optimization and recovery',
    category: 'execution',
    endpoint: '/free/ai-tools/execution/scheduler',
    handler: 'optimizeSchedule',
    capabilities: ['calculation', 'analysis'],
    requirements: {
      project: true,
      minData: ['timeline', 'constraints'],
    },
    defaultPrompts: [
      'Optimize project schedule',
      'Recover delayed tasks',
      'Fast-track critical path',
      'Suggest schedule compression',
    ],
    systemPrompt: 'You are a scheduling expert. Optimize CPM schedules using crashing and fast-tracking techniques.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['timeline', 'resources', 'constraints'],
    },
    chainableWith: ['timeline-builder', 'resource-planner', 'cost-estimator'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'Zap',
    estimatedDuration: 20,
    complexity: 'high',
  },

  'change-order-manager': {
    id: 'change-order-manager',
    displayName: 'Change Order Manager',
    description: 'Change request processing and impact analysis',
    category: 'execution',
    endpoint: '/free/ai-tools/execution/changes',
    handler: 'manageChanges',
    capabilities: ['analysis', 'calculation', 'reporting'],
    requirements: {
      project: true,
      minData: ['baseline'],
    },
    defaultPrompts: [
      'Analyze change order impact',
      'Calculate time and cost effects',
      'Generate change proposal',
      'Track change history',
    ],
    systemPrompt: 'You are a contract administration expert. Analyze change orders and calculate impacts per FIDIC.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['baseline', 'scope', 'contracts'],
    },
    chainableWith: ['cost-estimator', 'timeline-builder', 'contract-reviewer'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'FileEdit',
    estimatedDuration: 25,
    complexity: 'high',
  },

  'procurement-assistant': {
    id: 'procurement-assistant',
    displayName: 'Procurement Assistant',
    description: 'Material procurement planning and supplier coordination',
    category: 'execution',
    endpoint: '/free/ai-tools/execution/procurement',
    handler: 'assistProcurement',
    capabilities: ['analysis', 'collaboration'],
    requirements: {
      project: true,
      minData: ['materials', 'schedule'],
    },
    defaultPrompts: [
      'Plan material procurement',
      'Suggest procurement schedule',
      'Identify long-lead items',
      'Compare supplier options',
    ],
    systemPrompt: 'You are a procurement specialist for construction materials in Saudi Arabia.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['materials', 'schedule', 'budget'],
    },
    chainableWith: ['boq-generator', 'cost-estimator', 'schedule-optimizer'],
    permissions: {
      allowedRoles: ['client', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'ShoppingCart',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  // ============================================================================
  // CATEGORY: QUALITY TOOLS (6 tools)
  // ============================================================================

  'quality-planner': {
    id: 'quality-planner',
    displayName: 'Quality Assurance Planner',
    description: 'QA/QC planning and inspection scheduling',
    category: 'quality',
    endpoint: '/free/ai-tools/quality/planner',
    handler: 'planQuality',
    capabilities: ['generation', 'compliance'],
    requirements: {
      project: true,
      minData: ['scope', 'standards'],
    },
    defaultPrompts: [
      'Generate quality plan',
      'Schedule inspections',
      'Define acceptance criteria',
      'Plan testing protocols',
    ],
    systemPrompt: 'You are a QA/QC manager. Create quality plans following ISO 9001 and Saudi Building Code.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['scope', 'standards', 'specifications'],
    },
    chainableWith: ['inspection-scheduler', 'compliance-checker', 'hse-agent'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'Shield',
    estimatedDuration: 20,
    complexity: 'medium',
  },

  'inspection-scheduler': {
    id: 'inspection-scheduler',
    displayName: 'Inspection Scheduler',
    description: 'Inspection planning and hold point management',
    category: 'quality',
    endpoint: '/free/ai-tools/quality/inspections',
    handler: 'scheduleInspections',
    capabilities: ['generation', 'compliance'],
    requirements: {
      project: true,
      minData: ['activities', 'timeline'],
    },
    defaultPrompts: [
      'Schedule required inspections',
      'Identify hold points',
      'Plan witness tests',
      'Coordinate third-party inspections',
    ],
    systemPrompt: 'You are a quality control specialist. Schedule inspections per Saudi Building Code requirements.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['activities', 'timeline', 'standards'],
    },
    chainableWith: ['quality-planner', 'compliance-checker', 'timeline-builder'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'ClipboardCheck',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  'compliance-checker': {
    id: 'compliance-checker',
    displayName: 'Compliance Checker',
    description: 'SBC, SEC, and regulatory compliance verification',
    category: 'quality',
    endpoint: '/free/ai-tools/quality/compliance',
    handler: 'checkCompliance',
    capabilities: ['validation', 'compliance', 'reporting'],
    requirements: {
      project: true,
      minData: ['designs', 'calculations'],
    },
    defaultPrompts: [
      'Check SBC compliance',
      'Verify SEC requirements',
      'Review GACA regulations',
      'Generate compliance report',
    ],
    systemPrompt: 'You are a compliance expert for Saudi construction codes (SBC 301, SEC, GACA).',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['designs', 'calculations', 'standards'],
    },
    chainableWith: ['structural-agent', 'electrical-agent', 'hse-agent'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      requiredDisciplines: ['civil', 'electrical', 'structural', 'hse'],
      minProjectPhase: 'design',
    },
    icon: 'ShieldCheck',
    estimatedDuration: 30,
    complexity: 'high',
  },

  'defect-tracker': {
    id: 'defect-tracker',
    displayName: 'Defect Tracker',
    description: 'Defect logging, classification, and resolution tracking',
    category: 'quality',
    endpoint: '/free/ai-tools/quality/defects',
    handler: 'trackDefects',
    capabilities: ['analysis', 'reporting', 'collaboration'],
    requirements: {
      project: true,
    },
    defaultPrompts: [
      'Log construction defect',
      'Classify defect severity',
      'Track resolution status',
      'Generate defect report',
    ],
    systemPrompt: 'You are a quality control inspector. Classify and track defects per industry standards.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['defects', 'inspections'],
    },
    chainableWith: ['inspection-scheduler', 'quality-metrics'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'Bug',
    estimatedDuration: 10,
    complexity: 'low',
  },

  'quality-metrics': {
    id: 'quality-metrics',
    displayName: 'Quality Metrics Dashboard',
    description: 'Quality KPIs and performance analytics',
    category: 'quality',
    endpoint: '/free/ai-tools/quality/metrics',
    handler: 'analyzeQualityMetrics',
    capabilities: ['analysis', 'visualization', 'reporting'],
    requirements: {
      project: true,
      minData: ['inspections', 'defects'],
    },
    defaultPrompts: [
      'Calculate quality metrics',
      'Analyze defect trends',
      'Generate quality dashboard',
      'Compare to industry benchmarks',
    ],
    systemPrompt: 'You are a quality analyst. Calculate KPIs like defect density, first-pass yield, and inspection pass rates.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['inspections', 'defects', 'tests'],
    },
    chainableWith: ['defect-tracker', 'inspection-scheduler', 'quality-planner'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'BarChart3',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  'test-plan-generator': {
    id: 'test-plan-generator',
    displayName: 'Test Plan Generator',
    description: 'Material testing and commissioning plan generation',
    category: 'quality',
    endpoint: '/free/ai-tools/quality/testing',
    handler: 'generateTestPlan',
    capabilities: ['generation', 'compliance'],
    requirements: {
      project: true,
      minData: ['materials', 'specifications'],
    },
    defaultPrompts: [
      'Generate material test plan',
      'Plan concrete cube testing',
      'Schedule commissioning tests',
      'Define acceptance criteria',
    ],
    systemPrompt: 'You are a materials testing engineer. Generate test plans per Saudi standards and specifications.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['materials', 'specifications', 'standards'],
    },
    chainableWith: ['quality-planner', 'inspection-scheduler'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'FlaskConical',
    estimatedDuration: 20,
    complexity: 'medium',
  },

  // ============================================================================
  // CATEGORY: COMMUNICATION TOOLS (6 tools)
  // ============================================================================

  'status-reporter': {
    id: 'status-reporter',
    displayName: 'Status Report Generator',
    description: 'Weekly/monthly project status reports',
    category: 'communication',
    endpoint: '/free/ai-tools/communication/status',
    handler: 'generateStatusReport',
    capabilities: ['generation', 'reporting'],
    requirements: {
      project: true,
      minData: ['progress', 'issues'],
    },
    defaultPrompts: [
      'Generate weekly status report',
      'Summarize project progress',
      'Highlight key issues',
      'List upcoming milestones',
    ],
    systemPrompt: 'You are a project manager. Generate concise status reports for stakeholders.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['progress', 'issues', 'milestones'],
    },
    chainableWith: ['progress-tracker', 'stakeholder-mapper', 'presentation-builder'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'execution',
    },
    icon: 'FileText',
    estimatedDuration: 15,
    complexity: 'low',
  },

  'communication-planner': {
    id: 'communication-planner',
    displayName: 'Communication Planner',
    description: 'Stakeholder communication matrix and planning',
    category: 'communication',
    endpoint: '/free/ai-tools/communication/planner',
    handler: 'planCommunication',
    capabilities: ['generation', 'collaboration'],
    requirements: {
      project: true,
      minData: ['stakeholders'],
    },
    defaultPrompts: [
      'Create communication matrix',
      'Plan stakeholder meetings',
      'Generate email templates',
      'Schedule progress updates',
    ],
    systemPrompt: 'You are a communications specialist. Plan stakeholder communications per PMBOK guidelines.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['stakeholders', 'phases', 'deliverables'],
    },
    chainableWith: ['stakeholder-mapper', 'meeting-assistant', 'status-reporter'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'planning',
    },
    icon: 'MessageSquare',
    estimatedDuration: 15,
    complexity: 'low',
  },

  'meeting-assistant': {
    id: 'meeting-assistant',
    displayName: 'Meeting Assistant',
    description: 'Meeting agendas, minutes, and action items',
    category: 'communication',
    endpoint: '/free/ai-tools/communication/meetings',
    handler: 'assistMeetings',
    capabilities: ['generation', 'collaboration'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Generate meeting agenda',
      'Draft meeting minutes',
      'Extract action items',
      'Summarize key decisions',
    ],
    systemPrompt: 'You are a meeting facilitator. Generate agendas and minutes for construction project meetings.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['attendees', 'topics', 'previousMinutes'],
    },
    chainableWith: ['communication-planner', 'task-manager'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise', 'admin'],
    },
    icon: 'Calendar',
    estimatedDuration: 10,
    complexity: 'low',
  },

  'presentation-builder': {
    id: 'presentation-builder',
    displayName: 'Presentation Builder',
    description: 'Client presentation and pitch deck generation',
    category: 'communication',
    endpoint: '/free/ai-tools/communication/presentations',
    handler: 'buildPresentation',
    capabilities: ['generation', 'visualization'],
    requirements: {
      project: true,
      minData: ['content', 'audience'],
    },
    defaultPrompts: [
      'Create client presentation',
      'Generate pitch deck',
      'Build progress review slides',
      'Design executive summary',
    ],
    systemPrompt: 'You are a presentation designer. Create professional slides for construction stakeholders.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['content', 'data', 'visuals'],
    },
    chainableWith: ['status-reporter', 'progress-tracker', 'financial-forecaster'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
    },
    icon: 'Presentation',
    estimatedDuration: 30,
    complexity: 'medium',
  },

  'email-composer': {
    id: 'email-composer',
    displayName: 'Email Composer',
    description: 'Professional email templates and responses',
    category: 'communication',
    endpoint: '/free/ai-tools/communication/email',
    handler: 'composeEmail',
    capabilities: ['generation'],
    requirements: {},
    defaultPrompts: [
      'Draft client email',
      'Respond to RFI',
      'Write follow-up email',
      'Compose status update',
    ],
    systemPrompt: 'You are a professional communicator. Write clear, professional emails for construction projects.',
    contextSwitch: {
      preserveState: false,
    },
    chainableWith: ['communication-planner', 'stakeholder-mapper'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise', 'admin'],
    },
    icon: 'Mail',
    estimatedDuration: 5,
    complexity: 'low',
  },

  'rfi-manager': {
    id: 'rfi-manager',
    displayName: 'RFI Manager',
    description: 'Request for Information processing and tracking',
    category: 'communication',
    endpoint: '/free/ai-tools/communication/rfi',
    handler: 'manageRFI',
    capabilities: ['generation', 'collaboration', 'reporting'],
    requirements: {
      project: true,
    },
    defaultPrompts: [
      'Draft RFI response',
      'Track open RFIs',
      'Analyze RFI trends',
      'Generate RFI log',
    ],
    systemPrompt: 'You are a contract administrator. Manage RFIs efficiently and track responses.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['drawings', 'specifications', 'contracts'],
    },
    chainableWith: ['email-composer', 'change-order-manager'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'design',
    },
    icon: 'HelpCircle',
    estimatedDuration: 15,
    complexity: 'medium',
  },

  // ============================================================================
  // CATEGORY: CLOSURE TOOLS (6 tools)
  // ============================================================================

  'completion-checklist': {
    id: 'completion-checklist',
    displayName: 'Project Completion Checklist',
    description: 'Comprehensive project closeout checklist',
    category: 'closure',
    endpoint: '/free/ai-tools/closure/checklist',
    handler: 'generateCompletionChecklist',
    capabilities: ['generation', 'compliance'],
    requirements: {
      project: true,
    },
    defaultPrompts: [
      'Generate completion checklist',
      'List outstanding items',
      'Verify deliverables complete',
      'Check contractual obligations',
    ],
    systemPrompt: 'You are a project closeout specialist. Generate comprehensive completion checklists.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['deliverables', 'contracts', 'requirements'],
    },
    chainableWith: ['handover-packager', 'final-inspector', 'archive-manager'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'monitoring',
    },
    icon: 'CheckCircle2',
    estimatedDuration: 20,
    complexity: 'medium',
  },

  'lessons-learned': {
    id: 'lessons-learned',
    displayName: 'Lessons Learned Compiler',
    description: 'Project retrospective and knowledge capture',
    category: 'closure',
    endpoint: '/free/ai-tools/closure/lessons',
    handler: 'compileLessonsLearned',
    capabilities: ['analysis', 'generation', 'reporting'],
    requirements: {
      project: true,
      minData: ['history', 'issues'],
    },
    defaultPrompts: [
      'Compile lessons learned',
      'Analyze what went well',
      'Identify improvements',
      'Generate retrospective report',
    ],
    systemPrompt: 'You are a continuous improvement specialist. Extract valuable lessons from project history.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['history', 'issues', 'successes'],
    },
    chainableWith: ['completion-checklist', 'performance-reviewer'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'closure',
    },
    icon: 'BookOpen',
    estimatedDuration: 25,
    complexity: 'medium',
  },

  'handover-packager': {
    id: 'handover-packager',
    displayName: 'Handover Package Generator',
    description: 'Complete handover documentation compilation',
    category: 'closure',
    endpoint: '/free/ai-tools/closure/handover',
    handler: 'generateHandoverPackage',
    capabilities: ['generation', 'reporting'],
    requirements: {
      project: true,
      minData: ['deliverables', 'documents'],
      files: ['pdf', 'dwg', 'xlsx'],
    },
    defaultPrompts: [
      'Generate handover package',
      'Compile as-built drawings',
      'Create O&M manuals index',
      'List warranties and guarantees',
    ],
    systemPrompt: 'You are a project administrator. Compile complete handover packages with all required documentation.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['deliverables', 'documents', 'drawings'],
    },
    chainableWith: ['completion-checklist', 'archive-manager'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'closure',
    },
    icon: 'Package',
    estimatedDuration: 40,
    complexity: 'high',
  },

  'final-inspector': {
    id: 'final-inspector',
    displayName: 'Final Inspection Coordinator',
    description: 'Final inspection planning and punch list management',
    category: 'closure',
    endpoint: '/free/ai-tools/closure/inspection',
    handler: 'coordinateFinalInspection',
    capabilities: ['generation', 'compliance', 'collaboration'],
    requirements: {
      project: true,
      minData: ['deliverables'],
    },
    defaultPrompts: [
      'Plan final inspection',
      'Generate punch list',
      'Track punch list items',
      'Verify completion criteria',
    ],
    systemPrompt: 'You are a commissioning specialist. Coordinate final inspections and manage punch lists.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['deliverables', 'standards', 'defects'],
    },
    chainableWith: ['completion-checklist', 'defect-tracker'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      minProjectPhase: 'monitoring',
    },
    icon: 'ClipboardCheck',
    estimatedDuration: 20,
    complexity: 'medium',
  },

  'performance-reviewer': {
    id: 'performance-reviewer',
    displayName: 'Performance Review Generator',
    description: 'Project performance analysis and reporting',
    category: 'closure',
    endpoint: '/free/ai-tools/closure/performance',
    handler: 'reviewPerformance',
    capabilities: ['analysis', 'reporting', 'visualization'],
    requirements: {
      project: true,
      minData: ['baseline', 'actuals', 'metrics'],
    },
    defaultPrompts: [
      'Analyze project performance',
      'Compare planned vs actual',
      'Calculate SPI and CPI',
      'Generate performance report',
    ],
    systemPrompt: 'You are a project controls analyst. Analyze project performance using Earned Value metrics.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['baseline', 'actuals', 'metrics'],
    },
    chainableWith: ['lessons-learned', 'financial-forecaster', 'variance-analyzer'],
    permissions: {
      allowedRoles: ['client', 'engineer', 'enterprise'],
      minProjectPhase: 'closure',
    },
    icon: 'TrendingUp',
    estimatedDuration: 30,
    complexity: 'high',
  },

  'archive-manager': {
    id: 'archive-manager',
    displayName: 'Archive Manager',
    description: 'Project documentation archival and organization',
    category: 'closure',
    endpoint: '/free/ai-tools/closure/archive',
    handler: 'archiveProject',
    capabilities: ['generation', 'reporting'],
    requirements: {
      project: true,
      minData: ['documents'],
    },
    defaultPrompts: [
      'Organize project archive',
      'Generate document index',
      'Verify completeness',
      'Prepare for storage',
    ],
    systemPrompt: 'You are a document control specialist. Organize project archives following ISO 15489.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['documents', 'deliverables'],
    },
    chainableWith: ['handover-packager', 'completion-checklist'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise', 'admin'],
      minProjectPhase: 'closure',
    },
    icon: 'Archive',
    estimatedDuration: 30,
    complexity: 'medium',
  },

  // ============================================================================
  // CATEGORY: SPECIALIZED ENGINEERING AGENTS (9 agents)
  // ============================================================================

  'civil-agent': {
    id: 'civil-agent',
    displayName: 'Civil Engineering Agent',
    description: 'Structural analysis, foundation design, BOQ generation',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeCivilAgent',
    capabilities: ['calculation', 'generation', 'analysis', 'compliance'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Analyze structural loads',
      'Design foundation system',
      'Generate BOQ from drawings',
      'Check SBC 301 compliance',
    ],
    systemPrompt: 'You are a licensed Civil Engineer specialized in Saudi construction. Expert in structural analysis, foundation design, site planning, and SBC compliance.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['projectData', 'drawings', 'soilReport'],
    },
    chainableWith: ['structural-agent', 'boq-generator', 'compliance-checker'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['civil'],
      featureFlag: 'enableCivilAgent',
    },
    icon: 'Building2',
    color: 'hsl(142 65% 47%)',
    estimatedDuration: 45,
    complexity: 'high',
  },

  'electrical-agent': {
    id: 'electrical-agent',
    displayName: 'Electrical Engineering Agent',
    description: 'Power systems, lighting calculations, load analysis',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeElectricalAgent',
    capabilities: ['calculation', 'generation', 'compliance'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Calculate electrical loads',
      'Design lighting layout',
      'Size electrical panels',
      'Check SEC compliance',
    ],
    systemPrompt: 'You are a licensed Electrical Engineer specialized in Saudi construction. Expert in power systems, lighting design per SEC, and renewable integration.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['loadSchedule', 'drawings', 'specifications'],
    },
    chainableWith: ['hvac-agent', 'compliance-checker'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['electrical'],
      featureFlag: 'enableElectricalAgent',
    },
    icon: 'Zap',
    color: 'hsl(45 100% 51%)',
    estimatedDuration: 40,
    complexity: 'high',
  },

  'structural-agent': {
    id: 'structural-agent',
    displayName: 'Structural Engineering Agent',
    description: 'Concrete/steel design, seismic analysis, foundation engineering',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeStructuralAgent',
    capabilities: ['calculation', 'analysis', 'compliance', 'generation'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Design reinforced concrete beam',
      'Analyze seismic forces',
      'Calculate foundation bearing capacity',
      'Check deflection limits',
    ],
    systemPrompt: 'You are a licensed Structural Engineer specialized in Saudi construction. Expert in concrete/steel design, seismic analysis per SBC, and foundation engineering.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['loads', 'geometry', 'materials', 'soilData'],
    },
    chainableWith: ['civil-agent', 'geotechnical-agent', 'compliance-checker'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['structural'],
      featureFlag: 'enableStructuralAgent',
    },
    icon: 'Hammer',
    color: 'hsl(0 84% 60%)',
    estimatedDuration: 50,
    complexity: 'high',
  },

  'hvac-agent': {
    id: 'hvac-agent',
    displayName: 'HVAC Engineering Agent',
    description: 'Cooling/heating loads, duct sizing, energy modeling',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeHVACAgent',
    capabilities: ['calculation', 'analysis', 'compliance'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Calculate cooling loads for Saudi climate',
      'Design duct system',
      'Size HVAC equipment',
      'Optimize energy consumption',
    ],
    systemPrompt: 'You are a licensed HVAC Engineer specialized in Saudi climate. Expert in cooling loads (48°C design temp), ASHRAE compliance, and energy efficiency.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['buildingData', 'climate', 'occupancy'],
    },
    chainableWith: ['electrical-agent', 'energy-modeler'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['hvac'],
      featureFlag: 'enableHVACAgent',
    },
    icon: 'Wind',
    color: 'hsl(200 80% 50%)',
    estimatedDuration: 35,
    complexity: 'high',
  },

  'survey-agent': {
    id: 'survey-agent',
    displayName: 'Survey/Geomatics Agent',
    description: 'Topographic surveys, GPS transformations, volume calculations',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeSurveyAgent',
    capabilities: ['calculation', 'analysis', 'generation'],
    requirements: {
      project: false,
      files: ['csv', 'txt', 'gps'],
    },
    defaultPrompts: [
      'Process GPS survey data',
      'Transform WGS84 to Saudi Grid',
      'Calculate cut/fill volumes',
      'Generate contour map',
    ],
    systemPrompt: 'You are a licensed Land Surveyor. Expert in GPS transformations, coordinate systems, and volume calculations.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['surveyData', 'coordinates', 'datum'],
    },
    chainableWith: ['civil-agent', 'drone-agent'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['survey'],
      featureFlag: 'enableSurveyAgent',
    },
    icon: 'MapPin',
    color: 'hsl(280 65% 60%)',
    estimatedDuration: 30,
    complexity: 'medium',
  },

  'hse-agent': {
    id: 'hse-agent',
    displayName: 'HSE Compliance Agent',
    description: 'Safety planning, risk assessment, incident investigation',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeHSEAgent',
    capabilities: ['analysis', 'compliance', 'generation', 'reporting'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Conduct safety risk assessment',
      'Generate safety plan',
      'Investigate incident',
      'Plan safety audit',
    ],
    systemPrompt: 'You are an HSE Manager specialized in Saudi construction. Expert in risk assessment, safety planning, and incident investigation.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['hazards', 'activities', 'site'],
    },
    chainableWith: ['risk-register', 'quality-planner', 'compliance-checker'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      requiredDisciplines: ['hse'],
      featureFlag: 'enableHSEAgent',
    },
    icon: 'Shield',
    color: 'hsl(15 85% 50%)',
    estimatedDuration: 35,
    complexity: 'high',
  },

  'drone-agent': {
    id: 'drone-agent',
    displayName: 'Drone Survey Agent',
    description: 'Flight planning, photogrammetry, 3D modeling',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeDroneAgent',
    capabilities: ['generation', 'analysis', 'visualization'],
    requirements: {
      project: false,
      files: ['jpg', 'tiff', 'las'],
    },
    defaultPrompts: [
      'Plan GACA-compliant flight',
      'Generate orthophoto',
      'Create 3D model from images',
      'Calculate earthwork volumes',
    ],
    systemPrompt: 'You are a drone survey specialist. Expert in photogrammetry, GACA compliance, and volumetric analysis.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['siteData', 'flightParams', 'images'],
    },
    chainableWith: ['survey-agent', 'progress-tracker'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['drone'],
      featureFlag: 'enableDroneAgent',
    },
    icon: 'Plane',
    color: 'hsl(220 80% 55%)',
    estimatedDuration: 40,
    complexity: 'high',
  },

  'maintenance-agent': {
    id: 'maintenance-agent',
    displayName: 'Maintenance Engineering Agent',
    description: 'Preventive maintenance, fault diagnosis, reliability analysis',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeMaintenanceAgent',
    capabilities: ['analysis', 'generation', 'calculation'],
    requirements: {
      project: false,
    },
    defaultPrompts: [
      'Create PM schedule',
      'Diagnose equipment fault',
      'Calculate MTBF and MTTR',
      'Optimize spare parts inventory',
    ],
    systemPrompt: 'You are a Maintenance Engineer. Expert in preventive maintenance, fault diagnosis, and reliability analysis.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['equipment', 'history', 'manuals'],
    },
    chainableWith: ['asset-manager', 'work-order-manager'],
    permissions: {
      allowedRoles: ['engineer', 'enterprise'],
      requiredDisciplines: ['maintenance'],
      featureFlag: 'enableMaintenanceAgent',
    },
    icon: 'Wrench',
    color: 'hsl(30 90% 50%)',
    estimatedDuration: 30,
    complexity: 'medium',
  },

  'geotechnical-agent': {
    id: 'geotechnical-agent',
    displayName: 'Geotechnical Engineering Agent',
    description: 'Soil classification, bearing capacity, settlement analysis',
    category: 'agent',
    endpoint: '/free/ai',
    handler: 'invokeGeotechnicalAgent',
    capabilities: ['calculation', 'analysis', 'generation'],
    requirements: {
      project: false,
      files: ['pdf', 'xlsx'],
    },
    defaultPrompts: [
      'Classify soil per USCS',
      'Calculate bearing capacity',
      'Analyze settlement',
      'Recommend foundation type',
    ],
    systemPrompt: 'You are a licensed Geotechnical Engineer. Expert in soil mechanics, foundation design, and slope stability.',
    contextSwitch: {
      preserveState: true,
      carryInputs: ['soilData', 'loads', 'waterTable'],
    },
    chainableWith: ['structural-agent', 'civil-agent'],
    permissions: {
      allowedRoles: ['engineer'],
      requiredDisciplines: ['geotechnical'],
      featureFlag: 'enableGeotechnicalAgent',
    },
    icon: 'Mountain',
    color: 'hsl(35 75% 45%)',
    estimatedDuration: 40,
    complexity: 'high',
  },
};

/**
 * Registry Utilities
 */

/**
 * Get tool by ID
 */
export function getTool(toolId: string): AITool | undefined {
  return AI_TOOL_REGISTRY[toolId];
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolCategory): AITool[] {
  return Object.values(AI_TOOL_REGISTRY).filter((tool) => tool.category === category);
}

/**
 * Get tools by capability
 */
export function getToolsByCapability(capability: CapabilityTag): AITool[] {
  return Object.values(AI_TOOL_REGISTRY).filter((tool) =>
    tool.capabilities.includes(capability)
  );
}

/**
 * Get tools accessible by role
 */
export function getToolsByRole(role: UserRole): AITool[] {
  return Object.values(AI_TOOL_REGISTRY).filter((tool) =>
    tool.permissions.allowedRoles.includes(role)
  );
}

/**
 * Get tools for project phase
 */
export function getToolsByPhase(phase: ProjectPhase): AITool[] {
  return Object.values(AI_TOOL_REGISTRY).filter((tool) => {
    const { minProjectPhase, maxProjectPhase } = tool.permissions;
    if (!minProjectPhase && !maxProjectPhase) return true;
    
    const phaseOrder: ProjectPhase[] = ['initiation', 'planning', 'design', 'execution', 'monitoring', 'closure'];
    const currentIndex = phaseOrder.indexOf(phase);
    const minIndex = minProjectPhase ? phaseOrder.indexOf(minProjectPhase) : 0;
    const maxIndex = maxProjectPhase ? phaseOrder.indexOf(maxProjectPhase) : phaseOrder.length - 1;
    
    return currentIndex >= minIndex && currentIndex <= maxIndex;
  });
}

/**
 * Get chainable tools for a given tool
 */
export function getChainableTools(toolId: string): AITool[] {
  const tool = getTool(toolId);
  if (!tool || !tool.chainableWith) return [];
  
  return tool.chainableWith
    .map((id) => getTool(id))
    .filter((t): t is AITool => t !== undefined);
}

/**
 * Check if user has permission to access tool
 */
export function canAccessTool(
  tool: AITool,
  userRole: UserRole,
  userDisciplines?: EngineeringDiscipline[],
  projectPhase?: ProjectPhase
): boolean {
  // Check role
  if (!tool.permissions.allowedRoles.includes(userRole)) {
    return false;
  }

  // Check discipline (if required)
  if (tool.permissions.requiredDisciplines && userDisciplines) {
    const hasRequiredDiscipline = tool.permissions.requiredDisciplines.some((d) =>
      userDisciplines.includes(d)
    );
    if (!hasRequiredDiscipline) return false;
  }

  // Check project phase (if specified)
  if (projectPhase) {
    const phaseTools = getToolsByPhase(projectPhase);
    if (!phaseTools.find((t) => t.id === tool.id)) return false;
  }

  return true;
}

/**
 * Get all tool IDs
 */
export function getAllToolIds(): string[] {
  return Object.keys(AI_TOOL_REGISTRY);
}

/**
 * Get registry statistics
 */
export function getRegistryStats() {
  const tools = Object.values(AI_TOOL_REGISTRY);
  
  return {
    total: tools.length,
    byCategory: {
      assistant: tools.filter((t) => t.category === 'assistant').length,
      planning: tools.filter((t) => t.category === 'planning').length,
      budgeting: tools.filter((t) => t.category === 'budgeting').length,
      execution: tools.filter((t) => t.category === 'execution').length,
      quality: tools.filter((t) => t.category === 'quality').length,
      communication: tools.filter((t) => t.category === 'communication').length,
      closure: tools.filter((t) => t.category === 'closure').length,
      agent: tools.filter((t) => t.category === 'agent').length,
    },
    byComplexity: {
      low: tools.filter((t) => t.complexity === 'low').length,
      medium: tools.filter((t) => t.complexity === 'medium').length,
      high: tools.filter((t) => t.complexity === 'high').length,
    },
  };
}

/**
 * Export type for external use
 */
export type { AITool, ToolRequirements, ContextSwitchHook, ToolPermissions };

