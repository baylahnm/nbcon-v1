/**
 * TypeScript Types for Specialized AI Engineering Agents
 * Phase 2: Agent System
 * 
 * Defines types for 9 engineering discipline agents with workflow orchestration
 */

// =====================================================
// Core Agent Types
// =====================================================

export type AgentDiscipline =
  | 'civil'
  | 'electrical'
  | 'structural'
  | 'hvac'
  | 'surveying'
  | 'hse'
  | 'drone_survey'
  | 'maintenance'
  | 'geotechnical';

export interface AIAgent {
  id: string;
  discipline: AgentDiscipline;
  display_name: string;
  description: string;
  icon_name: string;
  color_scheme: string;
  
  // Capabilities
  capabilities: string[];
  workflows: string[];
  decision_checkpoints: DecisionCheckpoint[];
  
  // Prompts
  system_prompt: string;
  prompt_templates: Record<string, PromptTemplate>;
  tool_stack: string[];
  
  // Training & QA
  training_requirements: TrainingRequirements;
  qa_safeguards: QASafeguard[];
  validation_rules: ValidationRule[];
  
  // Integration
  integration_hooks: IntegrationHooks;
  output_templates: Record<string, OutputTemplate>;
  
  // Metadata
  is_active: boolean;
  requires_certification: boolean;
  min_experience_years: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Workflow & Decision Types
// =====================================================

export interface DecisionCheckpoint {
  id: string;
  stage: string;
  decision_type: 'auto_proceed' | 'engineer_review' | 'multi_party_approval';
  criteria: {
    parameter: string;
    condition: string; // "value > threshold", "within_range", etc.
    threshold?: number;
  }[];
  fallback_action: 'pause' | 'default_conservative' | 'escalate';
}

export interface Workflow {
  id: string;
  name: string;
  stages: WorkflowStage[];
  estimated_duration_minutes: number;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  agent_actions: string[];
  human_inputs: string[];
  decision_checkpoint?: DecisionCheckpoint;
  outputs: string[];
  next_stage?: string;
}

// =====================================================
// Prompt & Template Types
// =====================================================

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: PromptVariable[];
  example_output: string;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file' | 'json';
  description: string;
  required: boolean;
  default_value?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowed_values?: any[];
  };
}

// =====================================================
// QA & Validation Types
// =====================================================

export interface QASafeguard {
  id: string;
  parameter: string;
  check_type: 'range' | 'comparison' | 'calculation' | 'compliance';
  min_value?: number;
  max_value?: number;
  comparison_operator?: '>' | '<' | '==' | '>=' | '<=';
  reference_value?: number | string;
  error_message: string;
  severity: 'warning' | 'error' | 'critical';
}

export interface ValidationRule {
  id: string;
  rule_name: string;
  description: string;
  validation_function: string; // Name of validation function
  applies_to: string[]; // List of deliverable types
  is_blocking: boolean; // If true, prevent delivery without passing
}

export interface ValidationResult {
  rule_id: string;
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
  suggested_fix?: string;
}

// =====================================================
// Training & Dataset Types
// =====================================================

export interface TrainingRequirements {
  required_datasets: string[];
  sample_size: number;
  validation_method: 'peer_review' | 'field_verification' | 'code_compliance';
  update_frequency: 'monthly' | 'quarterly' | 'annually';
  data_sources?: string[];
}

export interface TrainingDataset {
  id: string;
  name: string;
  discipline: AgentDiscipline;
  dataset_type: 'calculations' | 'designs' | 'reports' | 'case_studies';
  samples: TrainingSample[];
  metadata: {
    total_samples: number;
    last_updated: string;
    quality_score: number;
    peer_reviewed: boolean;
  };
}

export interface TrainingSample {
  id: string;
  input: any; // Project parameters
  output: any; // Expected deliverable
  verification: {
    verified_by: string;
    verification_date: string;
    accuracy_rating: number;
    notes?: string;
  };
}

// =====================================================
// Session & Deliverable Types
// =====================================================

export interface AgentSession {
  id: string;
  user_id: string;
  agent_id: string;
  conversation_id?: string;
  project_id?: string;
  job_id?: string;
  
  // Session state
  session_type: string;
  workflow_stage?: string;
  decision_points: DecisionPoint[];
  deliverables: DeliverableReference[];
  
  // Timestamps
  started_at: string;
  ended_at?: string;
  is_active: boolean;
  session_data: Record<string, any>;
}

export interface DecisionPoint {
  id: string;
  stage: string;
  decision_required: string;
  options: DecisionOption[];
  selected_option?: string;
  decided_by?: string; // user_id or 'agent'
  decided_at?: string;
  rationale?: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  implications: {
    cost_impact?: number;
    time_impact?: number;
    risk_level?: 'low' | 'medium' | 'high';
  };
  recommended: boolean;
}

export interface AgentDeliverable {
  id: string;
  session_id: string;
  agent_id: string;
  user_id: string;
  
  // Deliverable details
  deliverable_type: string;
  title: string;
  content: any; // Structured data (calculations, designs, reports)
  file_url?: string;
  
  // Validation
  validation_status: 'pending' | 'validated' | 'rejected';
  validation_notes?: string;
  validated_by?: string;
  validated_at?: string;
  
  // Metadata
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DeliverableReference {
  deliverable_id: string;
  title: string;
  type: string;
  status: string;
}

// =====================================================
// Integration Hook Types
// =====================================================

export interface IntegrationHooks {
  project_dashboard: ProjectDashboardHook;
  engineer_assignment: EngineerAssignmentHook;
  document_generation: DocumentGenerationHook;
  notification_system: NotificationHook;
}

export interface ProjectDashboardHook {
  enabled: boolean;
  update_frequency: 'realtime' | 'hourly' | 'daily';
  metrics_tracked: string[];
  alert_thresholds: Record<string, number>;
}

export interface EngineerAssignmentHook {
  enabled: boolean;
  matching_criteria: {
    required_skills: string[];
    min_experience: number;
    certifications: string[];
  };
  notification_priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface DocumentGenerationHook {
  enabled: boolean;
  supported_formats: ('pdf' | 'dwg' | 'xlsx' | 'docx')[];
  template_library: string[];
  auto_generate: boolean;
}

export interface NotificationHook {
  enabled: boolean;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  event_triggers: string[];
}

export interface OutputTemplate {
  id: string;
  name: string;
  format: 'pdf' | 'dwg' | 'xlsx' | 'docx' | 'json';
  template_path: string;
  required_data_fields: string[];
}

// =====================================================
// Feedback & Telemetry Types
// =====================================================

export interface AgentFeedback {
  id: string;
  session_id: string;
  agent_id: string;
  user_id: string;
  
  feedback_type: 'accuracy' | 'safety' | 'usability' | 'performance';
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  
  deliverable_id?: string;
  specific_issue?: string;
  suggested_improvement?: string;
  
  metadata: Record<string, any>;
  created_at: string;
}

export interface AgentTelemetry {
  id: string;
  agent_id: string;
  user_id?: string;
  session_id?: string;
  
  // Metrics
  event_type: string;
  duration_ms?: number;
  token_count?: number;
  cost_usd?: number;
  
  // Quality scores
  accuracy_score?: number; // 0-100
  safety_score?: number; // 0-100
  user_satisfaction?: number; // 0-100
  
  // Context
  workflow_stage?: string;
  deliverable_type?: string;
  metadata: Record<string, any>;
  
  created_at: string;
}

// =====================================================
// API Response Types
// =====================================================

export interface AgentResponse {
  status: 'success' | 'error' | 'requires_review';
  agent_id: string;
  session_id: string;
  
  // Response data
  output: any;
  deliverables?: AgentDeliverable[];
  validation_results?: ValidationResult[];
  
  // Decision points
  decision_required?: DecisionPoint;
  recommendations?: string[];
  
  // Metadata
  processing_time_ms: number;
  confidence_score: number; // 0-100
  tokens_used?: number;
}

export interface AgentError {
  status: 'error';
  error_code: string;
  error_message: string;
  suggestions?: string[];
  support_contact?: string;
}

// =====================================================
// Configuration Types
// =====================================================

export interface AgentConfig {
  agent_id: string;
  user_preferences: {
    auto_approve_low_risk: boolean;
    notification_threshold: 'all' | 'important' | 'critical';
    preferred_units: 'metric' | 'imperial';
    language: 'en' | 'ar';
  };
  project_context?: {
    project_id: string;
    project_type: string;
    location: string;
    constraints: string[];
  };
}

// =====================================================
// Analytics Types
// =====================================================

export interface AgentPerformanceMetrics {
  discipline: AgentDiscipline;
  display_name: string;
  
  // Usage metrics
  total_sessions: number;
  unique_users: number;
  avg_sessions_per_user: number;
  
  // Quality metrics
  avg_rating: number;
  avg_accuracy: number;
  avg_safety_score: number;
  
  // Performance metrics
  avg_duration_ms: number;
  total_tokens: number;
  total_cost_usd: number;
  
  // Deliverables
  total_deliverables: number;
  validation_pass_rate: number;
  
  // Trends
  usage_trend: 'increasing' | 'stable' | 'decreasing';
  satisfaction_trend: 'improving' | 'stable' | 'declining';
}

export interface AgentUsageReport {
  period: { start: string; end: string };
  agents: AgentPerformanceMetrics[];
  top_performing: AgentDiscipline;
  needs_improvement: AgentDiscipline[];
  cost_summary: {
    total_usd: number;
    cost_per_session: number;
    cost_per_deliverable: number;
  };
  recommendations: string[];
}

