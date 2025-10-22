// AI Tools Prompts - Organized by Category

export interface AIPrompt {
  id: string;
  title: string;
  description: string;
  fullPrompt: string;
  category: string;
  icon?: string;
}

// Page 1: Project Setup & Planning
export const planningPrompts = {
  initiation: [
    {
      id: 'init-1',
      title: 'Create project charter with objectives',
      description: 'Define vision, objectives, scope boundaries, success criteria, stakeholders, and initial constraints',
      fullPrompt: 'Create a comprehensive project charter including vision, objectives, scope boundaries, success criteria, stakeholders, and initial constraints for a commercial construction project.',
      category: 'Project Initiation'
    },
    {
      id: 'init-2',
      title: 'Generate feasibility study',
      description: 'Analyze technical viability, financial projections, resource requirements, and regulatory compliance',
      fullPrompt: 'Generate a feasibility study analyzing technical viability, financial projections, resource requirements, regulatory compliance, and risk assessment for a new construction project.',
      category: 'Project Initiation'
    },
    {
      id: 'init-3',
      title: 'Define project scope statement',
      description: 'Cover deliverables, acceptance criteria, exclusions, constraints, and assumptions',
      fullPrompt: 'Define a detailed project scope statement covering deliverables, acceptance criteria, exclusions, constraints, and assumptions for a construction project.',
      category: 'Project Initiation'
    },
    {
      id: 'init-4',
      title: 'Create stakeholder register',
      description: 'Map stakeholders, interests, influence levels, communication needs, and engagement strategies',
      fullPrompt: 'Create a comprehensive stakeholder register mapping stakeholders, their interests, influence levels, communication needs, and engagement strategies.',
      category: 'Project Initiation'
    },
    {
      id: 'init-5',
      title: 'Draft project kickoff agenda',
      description: 'Include introductions, overview, roles, responsibilities, communication plan, and next steps',
      fullPrompt: 'Draft a project kickoff meeting agenda including introductions, project overview, roles and responsibilities, communication plan, and next steps.',
      category: 'Project Initiation'
    }
  ],
  strategic: [
    {
      id: 'plan-1',
      title: 'Generate Work Breakdown Structure (WBS)',
      description: 'Break down deliverables into manageable work packages with hierarchical organization',
      fullPrompt: 'Generate a detailed Work Breakdown Structure (WBS) for a construction project, breaking down deliverables into manageable work packages with hierarchical organization.',
      category: 'Strategic Planning'
    },
    {
      id: 'plan-2',
      title: 'Create project schedule template',
      description: 'Include phases, milestones, task dependencies, duration estimates, and critical path',
      fullPrompt: 'Create a comprehensive project schedule template with phases, milestones, task dependencies, duration estimates, and critical path analysis.',
      category: 'Strategic Planning'
    },
    {
      id: 'plan-3',
      title: 'Build resource allocation plan',
      description: 'Map team members, equipment, materials across phases with utilization rates',
      fullPrompt: 'Build a resource allocation plan mapping team members, equipment, materials, and budget across project phases with utilization rates and availability.',
      category: 'Strategic Planning'
    },
    {
      id: 'plan-4',
      title: 'Design project roadmap',
      description: 'Show key phases, milestones, deliverable dates, decision points, and dependencies',
      fullPrompt: 'Design a visual project roadmap showing key phases, major milestones, deliverable dates, decision points, and dependencies over the project timeline.',
      category: 'Strategic Planning'
    },
    {
      id: 'plan-5',
      title: 'Create sprint/phase planning template',
      description: 'Include user stories, acceptance criteria, story points, and velocity tracking',
      fullPrompt: 'Create a sprint planning template for agile project management including user stories, acceptance criteria, story points, velocity tracking, and retrospective format.',
      category: 'Strategic Planning'
    }
  ]
};

// Page 2: Budget & Cost Management
export const budgetingPrompts = [
  {
    id: 'budget-1',
    title: 'Estimate comprehensive project costs',
    description: 'Direct costs, indirect costs, contingency reserves, and management reserves',
    fullPrompt: 'Estimate comprehensive project costs including direct costs (labor, materials, equipment), indirect costs (overhead, admin), contingency reserves, and management reserves.',
    category: 'Budgeting & Finance'
  },
  {
    id: 'budget-2',
    title: 'Generate Bill of Quantities (BOQ)',
    description: 'Organized by CSI divisions with quantities, units, rates, and total costs',
    fullPrompt: 'Generate a detailed Bill of Quantities (BOQ) template for residential construction, organized by CSI divisions with quantities, units, rates, and total costs.',
    category: 'Budgeting & Finance'
  },
  {
    id: 'budget-3',
    title: 'Create budget baseline and tracking',
    description: 'Cost breakdown by phase, performance metrics (CPI, EV, AC), variance analysis',
    fullPrompt: 'Create a budget baseline document with cost breakdown by phase, cost performance metrics (CPI, EV, AC), variance analysis, and forecasting templates.',
    category: 'Budgeting & Finance'
  },
  {
    id: 'budget-4',
    title: 'Build cash flow forecast',
    description: '12-month projection with income, expenses, net cash position, and funding analysis',
    fullPrompt: 'Build a 12-month cash flow forecast showing projected income, expenses, net cash position, cumulative cash flow, and funding requirement analysis.',
    category: 'Budgeting & Finance'
  },
  {
    id: 'budget-5',
    title: 'Design cost control dashboard',
    description: 'Track planned vs actual, utilization, variance alerts, trends, and forecast',
    fullPrompt: 'Design a cost control dashboard template tracking planned vs actual costs, budget utilization, variance alerts, trend analysis, and forecast at completion.',
    category: 'Budgeting & Finance'
  }
];

// Page 3: Execution & Monitoring
export const executionPrompts = {
  execution: [
    {
      id: 'exec-1',
      title: 'Create daily standup template',
      description: "Yesterday's achievements, today's priorities, blockers, dependencies, and resources",
      fullPrompt: "Create a daily standup meeting template covering yesterday's achievements, today's priorities, blockers and dependencies, resource needs, and coordination points.",
      category: 'Execution & Coordination'
    },
    {
      id: 'exec-2',
      title: 'Generate task assignment matrix (RACI)',
      description: 'Map tasks to team members with Responsible, Accountable, Consulted, Informed roles',
      fullPrompt: 'Generate a RACI matrix (Responsible, Accountable, Consulted, Informed) for a construction project mapping tasks to team members with clear accountability.',
      category: 'Execution & Coordination'
    },
    {
      id: 'exec-3',
      title: 'Build progress tracking system',
      description: 'Task completion percentages, milestone status, deliverable reviews, earned value',
      fullPrompt: 'Build a comprehensive progress tracking template including task completion percentages, milestone status, deliverable reviews, and earned value metrics.',
      category: 'Execution & Coordination'
    },
    {
      id: 'exec-4',
      title: 'Design team coordination plan',
      description: 'Communication protocols, decision authority, escalation, meetings, collaboration',
      fullPrompt: 'Design a team coordination plan covering communication protocols, decision-making authority, escalation procedures, meeting schedules, and collaboration tools.',
      category: 'Execution & Coordination'
    },
    {
      id: 'exec-5',
      title: 'Create procurement schedule',
      description: 'Materials/services needed, quantities, lead times, vendors, approvals, tracking',
      fullPrompt: 'Create a procurement schedule template listing materials/services needed, quantities, lead times, preferred vendors, approval requirements, and delivery tracking.',
      category: 'Execution & Coordination'
    }
  ],
  quality: [
    {
      id: 'qual-1',
      title: 'Create quality assurance plan',
      description: 'Quality standards, inspection points, testing protocols, acceptance criteria',
      fullPrompt: 'Create a comprehensive quality assurance plan including quality standards, inspection points, testing protocols, acceptance criteria, and non-conformance procedures.',
      category: 'Quality & Compliance'
    },
    {
      id: 'qual-2',
      title: 'Generate compliance checklist',
      description: 'Saudi building codes, safety regulations, environmental requirements, permits',
      fullPrompt: 'Generate a regulatory compliance checklist for Saudi Arabia covering building codes, safety regulations, environmental requirements, and permit documentation.',
      category: 'Quality & Compliance'
    },
    {
      id: 'qual-3',
      title: 'Build inspection schedule',
      description: 'Inspection types, frequencies, responsible parties, documentation, workflows',
      fullPrompt: 'Build a systematic inspection schedule template mapping inspection types, frequencies, responsible parties, documentation requirements, and approval workflows.',
      category: 'Quality & Compliance'
    },
    {
      id: 'qual-4',
      title: 'Design testing protocol',
      description: 'MEP systems test procedures, acceptance criteria, documentation, sign-offs',
      fullPrompt: 'Design a testing and commissioning protocol for MEP systems including test procedures, acceptance criteria, documentation forms, and sign-off requirements.',
      category: 'Quality & Compliance'
    },
    {
      id: 'qual-5',
      title: 'Create audit preparation guide',
      description: 'Required documentation, compliance evidence, key personnel, questions, checklist',
      fullPrompt: 'Create an audit preparation guide listing required documentation, compliance evidence, key personnel, common audit questions, and readiness checklist.',
      category: 'Quality & Compliance'
    }
  ],
  risk: [
    {
      id: 'risk-1',
      title: 'Conduct risk assessment analysis',
      description: 'Identify technical, schedule, cost, external risks with probability-impact scoring',
      fullPrompt: 'Conduct a comprehensive risk assessment for a construction project identifying technical, schedule, cost, and external risks with probability-impact scoring and heat map.',
      category: 'Risk & Safety'
    },
    {
      id: 'risk-2',
      title: 'Create risk mitigation plan',
      description: 'Prevention strategies, contingency plans, trigger conditions, responsible owners',
      fullPrompt: 'Create a detailed risk mitigation plan for top 10 project risks including prevention strategies, contingency plans, trigger conditions, and responsible owners.',
      category: 'Risk & Safety'
    },
    {
      id: 'risk-3',
      title: 'Generate safety management plan',
      description: 'Hazard ID, PPE requirements, training, incident reporting, emergency procedures',
      fullPrompt: 'Generate a site safety management plan covering hazard identification, PPE requirements, safety training, incident reporting, emergency procedures, and safety audits.',
      category: 'Risk & Safety'
    },
    {
      id: 'risk-4',
      title: 'Build issue tracking system',
      description: 'Issue description, severity, impact, owner, resolution steps, status updates',
      fullPrompt: 'Build an issue tracking template capturing issue description, severity, impact, assigned owner, resolution steps, status updates, and closure verification.',
      category: 'Risk & Safety'
    },
    {
      id: 'risk-5',
      title: 'Design change control process',
      description: 'Change request form, impact assessment, approval workflow, implementation plan',
      fullPrompt: 'Design a change control process template including change request form, impact assessment, approval workflow, implementation plan, and communication procedure.',
      category: 'Risk & Safety'
    }
  ]
};

// Page 4: Communication & Closure
export const communicationPrompts = {
  communication: [
    {
      id: 'comm-1',
      title: 'Draft executive status report',
      description: 'Project health (RAG status), achievements, milestones, budget, risks, decisions',
      fullPrompt: 'Draft an executive status report template with project health (RAG status), key achievements, upcoming milestones, budget status, risks, and decisions needed.',
      category: 'Communication & Reporting'
    },
    {
      id: 'comm-2',
      title: 'Create stakeholder update',
      description: 'Progress, completed deliverables, schedule updates, budget, action items',
      fullPrompt: 'Create a stakeholder-specific communication covering project progress, completed deliverables, schedule updates, budget status, and action items requiring their input.',
      category: 'Communication & Reporting'
    },
    {
      id: 'comm-3',
      title: 'Generate meeting minutes',
      description: 'Attendees, agenda items, discussions, decisions, action items with owners/deadlines',
      fullPrompt: 'Generate comprehensive meeting minutes template including attendees, agenda items, discussion summaries, decisions made, action items with owners/deadlines, and next meeting.',
      category: 'Communication & Reporting'
    },
    {
      id: 'comm-4',
      title: 'Write project newsletter',
      description: 'Recent achievements, team spotlights, upcoming activities, lessons learned',
      fullPrompt: 'Write a project newsletter template highlighting recent achievements, team spotlights, upcoming activities, lessons learned, and celebrating successes.',
      category: 'Communication & Reporting'
    },
    {
      id: 'comm-5',
      title: 'Build reporting dashboard layout',
      description: 'KPIs (schedule/cost variance, quality metrics), status indicators, trend charts',
      fullPrompt: 'Build a project dashboard layout design showing KPIs (schedule variance, cost variance, quality metrics), status indicators, trend charts, and alert sections.',
      category: 'Communication & Reporting'
    }
  ],
  closure: [
    {
      id: 'close-1',
      title: 'Create project closeout checklist',
      description: 'Deliverable acceptance, documentation completion, financial closure, team release',
      fullPrompt: 'Create a comprehensive project closeout checklist covering deliverable acceptance, documentation completion, financial closure, contract termination, and team release.',
      category: 'Closure & Handover'
    },
    {
      id: 'close-2',
      title: 'Generate handover documentation',
      description: 'As-built drawings, operation manuals, maintenance schedules, warranty information',
      fullPrompt: 'Generate a handover documentation package including as-built drawings, operation manuals, maintenance schedules, warranty information, and training materials.',
      category: 'Closure & Handover'
    },
    {
      id: 'close-3',
      title: 'Write lessons learned report',
      description: 'Analyze what went well, improvements, root causes, best practices, recommendations',
      fullPrompt: 'Write a detailed lessons learned report analyzing what went well, what could improve, root causes of issues, best practices identified, and recommendations for future projects.',
      category: 'Closure & Handover'
    },
    {
      id: 'close-4',
      title: 'Build project archive structure',
      description: 'Organize contracts, correspondence, technical docs, financial records, approvals',
      fullPrompt: 'Build a project archive structure organizing contracts, correspondence, technical documents, financial records, approvals, and as-built information for easy retrieval.',
      category: 'Closure & Handover'
    },
    {
      id: 'close-5',
      title: 'Design post-implementation review',
      description: 'Evaluate objectives achievement, satisfaction, performance metrics, budget accuracy',
      fullPrompt: 'Design a post-implementation review template evaluating project objectives achievement, stakeholder satisfaction, performance metrics, budget accuracy, and success factors.',
      category: 'Closure & Handover'
    }
  ]
};

