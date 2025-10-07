export type ServiceMode =
  | "site-inspection"
  | "electrical-design"
  | "structural-analysis"
  | "hvac-design"
  | "surveying"
  | "hse-consulting"
  | "drone-surveying"
  | "equipment-maintenance"
  | "soil-testing";

type Tool = {
  id: string;
  label: string;
  description: string;
};

type WorkflowStage = {
  id: string;
  title: string;
  checklist: string[];
};

export type ServiceModeConfig = {
  title: string;
  summary: string;
  systemPrompt: string;
  composerHint: string;
  defaultThreadTitle: string;
  tools: Tool[];
  workflow: WorkflowStage[];
};

export const SERVICE_MODE_CONFIG: Record<ServiceMode, ServiceModeConfig> = {
  "site-inspection": {
    title: "Site Inspection",
    summary:
      "Guide field engineers through capturing hazards, progress notes, and photographic evidence during construction site walks.",
    systemPrompt:
      "You are an AI co-pilot for construction site inspections in Saudi Arabia. Collect structured observations, safety findings, and progress updates. Highlight regulatory or compliance concerns and recommend next actions.",
    composerHint:
      "Describe the site areas inspected, observations, risks, and required follow-up actions.",
    defaultThreadTitle: "Site Inspection Assistant",
    tools: [
      {
        id: "image-analysis",
        label: "Image Analysis",
        description: "Review uploaded photos for hazards and annotate findings.",
      },
      {
        id: "checklist",
        label: "Checklist",
        description: "Track completion of inspection checklist items.",
      },
      {
        id: "report",
        label: "Report Builder",
        description: "Generate formatted inspection summary reports.",
      },
    ],
    workflow: [
      {
        id: "capture",
        title: "Capture Findings",
        checklist: [
          "Describe inspected zones and activities",
          "Note progress vs schedule",
          "List safety or quality observations",
        ],
      },
      {
        id: "assess",
        title: "Assess Risk",
        checklist: [
          "Rate severity and likelihood",
          "Propose immediate controls",
          "Escalate critical issues",
        ],
      },
      {
        id: "report",
        title: "Report",
        checklist: [
          "Summarize key findings",
          "Attach annotated photos",
          "Assign follow-up actions",
        ],
      },
    ],
  },
  "electrical-design": {
    title: "Electrical Design",
    summary:
      "Assist with load calculations, protection coordination, and compliance for electrical distribution projects.",
    systemPrompt:
      "You support electrical engineers preparing distribution and lighting designs. Capture load data, protection requirements, and code constraints. Suggest equipment sizing and compliance notes per Saudi Electric Company and IEC standards.",
    composerHint:
      "Provide project scope, load details, voltage levels, and any specific constraints.",
    defaultThreadTitle: "Electrical Design Assistant",
    tools: [
      {
        id: "load-schedule",
        label: "Load Schedule",
        description: "Compute diversified demand and feeder sizes.",
      },
      {
        id: "code-check",
        label: "Code Check",
        description: "Cross-reference Saudi and IEC requirements.",
      },
      {
        id: "bom",
        label: "BOM",
        description: "Draft preliminary bill of materials.",
      },
    ],
    workflow: [
      {
        id: "collect",
        title: "Collect Requirements",
        checklist: [
          "Clarify facility type and usage",
          "List connected loads",
          "Capture redundancy requirements",
        ],
      },
      {
        id: "design",
        title: "Design",
        checklist: [
          "Build load schedules",
          "Select protection devices",
          "Document voltage drop checks",
        ],
      },
      {
        id: "deliver",
        title: "Deliver",
        checklist: [
          "Summarize assumptions",
          "Highlight compliance notes",
          "Outline next detailed design steps",
        ],
      },
    ],
  },
  "structural-analysis": {
    title: "Structural Analysis",
    summary:
      "Support structural engineers with load combinations, design checks, and reinforcement guidance.",
    systemPrompt:
      "You collaborate on structural analysis for buildings and infrastructure. Collect geometry, materials, and loading. Reference Saudi Building Code and provide reinforcement or redesign recommendations.",
    composerHint:
      "Share structure type, spans, materials, and governing load cases.",
    defaultThreadTitle: "Structural Analysis Assistant",
    tools: [
      {
        id: "load-combos",
        label: "Load Combos",
        description: "Generate applicable LRFD and ASD combinations.",
      },
      {
        id: "code-reference",
        label: "Code Reference",
        description: "Quote relevant Saudi Building Code clauses.",
      },
      {
        id: "design-summary",
        label: "Design Summary",
        description: "Outline critical member checks and recommended reinforcements.",
      },
    ],
    workflow: [
      {
        id: "inputs",
        title: "Gather Inputs",
        checklist: [
          "Define structural system",
          "Capture material strengths",
          "List all load cases",
        ],
      },
      {
        id: "analysis",
        title: "Run Analysis",
        checklist: [
          "Review load combinations",
          "Identify overstressed members",
          "Check serviceability limits",
        ],
      },
      {
        id: "recommend",
        title: "Recommend",
        checklist: [
          "Suggest reinforcement options",
          "List follow-up calculations",
          "Highlight compliance notes",
        ],
      },
    ],
  },
  "hvac-design": {
    title: "HVAC Design",
    summary:
      "Help HVAC engineers size systems and document efficiency strategies for Saudi climates.",
    systemPrompt:
      "You assist HVAC designers working on commercial and residential projects in Saudi Arabia. Gather occupancy profiles, climate data, and zoning requirements. Recommend equipment sizing, control strategies, and sustainability measures.",
    composerHint:
      "Describe building type, climate zone, occupancy, and equipment preferences.",
    defaultThreadTitle: "HVAC Design Assistant",
    tools: [
      {
        id: "load-estimator",
        label: "Load Estimator",
        description: "Estimate sensible and latent cooling loads.",
      },
      {
        id: "ventilation",
        label: "Ventilation",
        description: "Set outdoor air rates per ASHRAE guidance.",
      },
      {
        id: "system-selection",
        label: "System Selection",
        description: "Compare system types with pros and cons.",
      },
    ],
    workflow: [
      {
        id: "assess",
        title: "Assess",
        checklist: [
          "Identify thermal zones",
          "Collect envelope data",
          "Define comfort criteria",
        ],
      },
      {
        id: "size",
        title: "Size",
        checklist: [
          "Calculate design loads",
          "Recommend equipment",
          "Plan control strategies",
        ],
      },
      {
        id: "advise",
        title: "Advise",
        checklist: [
          "Suggest efficiency upgrades",
          "Flag code requirements",
          "Outline commissioning tasks",
        ],
      },
    ],
  },
  surveying: {
    title: "Surveying",
    summary:
      "Coordinate land surveying missions, data validation, and deliverable packaging.",
    systemPrompt:
      "You guide land survey teams capturing topographic and boundary data. Gather control points, equipment, and deliverable formats. Recommend QA steps and deliverable packaging.",
    composerHint:
      "Explain the site location, required accuracy, and deliverables (e.g. DWG, CSV).",
    defaultThreadTitle: "Surveying Assistant",
    tools: [
      {
        id: "geodetics",
        label: "Geodetics",
        description: "Convert coordinates between reference systems.",
      },
      {
        id: "qa",
        label: "QA",
        description: "Flag missing control points or outliers.",
      },
      {
        id: "packager",
        label: "Packager",
        description: "Build deliverable checklist and metadata.",
      },
    ],
    workflow: [
      {
        id: "plan",
        title: "Plan",
        checklist: [
          "Define survey scope",
          "List control benchmarks",
          "Confirm equipment availability",
        ],
      },
      {
        id: "collect",
        title: "Collect",
        checklist: [
          "Capture field observations",
          "Record weather conditions",
          "Log any access constraints",
        ],
      },
      {
        id: "deliver",
        title: "Deliver",
        checklist: [
          "Validate data",
          "Package files",
          "Prepare client summary",
        ],
      },
    ],
  },
  "hse-consulting": {
    title: "HSE Consulting",
    summary:
      "Develop health, safety, and environmental plans tailored to project hazards.",
    systemPrompt:
      "You advise on Health, Safety, and Environment compliance. Collect site hazards, workforce profile, and regulatory context. Produce mitigation plans, training needs, and monitoring actions.",
    composerHint:
      "Outline project scope, activities, worker count, and known hazards.",
    defaultThreadTitle: "HSE Consulting Assistant",
    tools: [
      {
        id: "risk-register",
        label: "Risk Register",
        description: "Build risk entries with severity and controls.",
      },
      {
        id: "regulations",
        label: "Regulations",
        description: "Map risks to Saudi OSHA requirements.",
      },
      {
        id: "training",
        label: "Training",
        description: "Recommend training modules and schedules.",
      },
    ],
    workflow: [
      {
        id: "profile",
        title: "Profile",
        checklist: [
          "Identify activities and phases",
          "List equipment and chemicals",
          "Capture existing controls",
        ],
      },
      {
        id: "plan",
        title: "Plan",
        checklist: [
          "Draft mitigation actions",
          "Define monitoring metrics",
          "Recommend PPE",
        ],
      },
      {
        id: "deploy",
        title: "Deploy",
        checklist: [
          "Schedule training",
          "Assign owners",
          "Plan audits",
        ],
      },
    ],
  },
  "drone-surveying": {
    title: "Drone Surveying",
    summary:
      "Plan drone missions, manage regulatory approvals, and streamline post-processing.",
    systemPrompt:
      "You support drone surveying operations. Gather airspace restrictions, flight envelopes, and payload needs. Provide mission plans, regulatory requirements, and data processing workflows.",
    composerHint:
      "Share survey area, required resolution, and any known flight restrictions.",
    defaultThreadTitle: "Drone Surveying Assistant",
    tools: [
      {
        id: "mission",
        label: "Mission Planner",
        description: "Define flight path, altitude, and overlap.",
      },
      {
        id: "processing",
        label: "Processing",
        description: "Outline photogrammetry or LiDAR workflows.",
      },
      {
        id: "compliance",
        label: "Compliance",
        description: "List GACA approvals and documentation.",
      },
    ],
    workflow: [
      {
        id: "prepare",
        title: "Prepare",
        checklist: [
          "Confirm permits",
          "Check weather window",
          "Verify battery logistics",
        ],
      },
      {
        id: "execute",
        title: "Execute",
        checklist: [
          "Plan flight lines",
          "Define ground control",
          "Monitor telemetry",
        ],
      },
      {
        id: "process",
        title: "Process",
        checklist: [
          "Upload raw data",
          "Generate orthomosaic",
          "QC point cloud",
        ],
      },
    ],
  },
  "equipment-maintenance": {
    title: "Equipment Maintenance",
    summary:
      "Coordinate diagnostics, spare parts, and downtime planning for heavy equipment.",
    systemPrompt:
      "You are an assistant for heavy equipment maintenance. Gather asset details, fault codes, and operating hours. Diagnose likely causes, propose maintenance plans, and coordinate parts procurement.",
    composerHint:
      "Describe the equipment model, symptoms, recent work, and urgency.",
    defaultThreadTitle: "Equipment Maintenance Assistant",
    tools: [
      {
        id: "diagnostics",
        label: "Diagnostics",
        description: "Interpret fault codes and probable causes.",
      },
      {
        id: "parts",
        label: "Parts Planner",
        description: "List replacement parts, lead times, and suppliers.",
      },
      {
        id: "schedule",
        label: "Schedule",
        description: "Build maintenance windows with downtime estimates.",
      },
    ],
    workflow: [
      {
        id: "assess",
        title: "Assess",
        checklist: [
          "Capture machine details",
          "Gather fault evidence",
          "Log operating conditions",
        ],
      },
      {
        id: "plan",
        title: "Plan",
        checklist: [
          "Prioritize corrective actions",
          "Estimate downtime",
          "Allocate resources",
        ],
      },
      {
        id: "follow",
        title: "Follow Up",
        checklist: [
          "Confirm task completion",
          "Update maintenance history",
          "Schedule inspections",
        ],
      },
    ],
  },
  "soil-testing": {
    title: "Soil Testing",
    summary:
      "Support geotechnical investigations from sampling plans to report drafts.",
    systemPrompt:
      "You assist geotechnical engineers. Collect borehole data, lab tests, and project requirements. Produce soil profiles, bearing capacity guidance, and reporting outlines.",
    composerHint:
      "Share project type, borehole logs, and any critical soil observations.",
    defaultThreadTitle: "Soil Testing Assistant",
    tools: [
      {
        id: "lab-workflow",
        label: "Lab Workflow",
        description: "Recommend additional tests and sequencing.",
      },
      {
        id: "capacity",
        label: "Capacity",
        description: "Estimate bearing pressures and settlements.",
      },
      {
        id: "report",
        label: "Report",
        description: "Outline geotechnical report contents.",
      },
    ],
    workflow: [
      {
        id: "plan",
        title: "Plan",
        checklist: [
          "Define investigation scope",
          "Select sampling methods",
          "Schedule lab work",
        ],
      },
      {
        id: "analyze",
        title: "Analyze",
        checklist: [
          "Review lab results",
          "Compare soil strata",
          "Identify anomalies",
        ],
      },
      {
        id: "recommend",
        title: "Recommend",
        checklist: [
          "Propose foundation guidance",
          "Flag risks",
          "List follow-up testing",
        ],
      },
    ],
  },
};

export const SERVICE_MODES: ServiceMode[] = Object.keys(SERVICE_MODE_CONFIG) as ServiceMode[];
