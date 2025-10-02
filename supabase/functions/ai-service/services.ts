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
  description: string;
};

type ServiceConfig = {
  title: string;
  prompt: string;
  tools: Tool[];
  output: {
    format: string;
    deliverables: string[];
  };
};

export const SERVICES: Record<ServiceMode, ServiceConfig> = {
  "site-inspection": {
    title: "Site Inspection",
    prompt:
      "You are an AI assistant for construction site inspections. Collect observations, safety issues, progress notes, and photographic evidence. Provide actionable recommendations and flag compliance concerns.",
    tools: [
      {
        id: "image-analysis",
        description: "Analyze uploaded site photos for hazards or quality issues.",
      },
      {
        id: "checklist-tracker",
        description: "Validate completion of inspection checklist items.",
      },
      {
        id: "report-generator",
        description: "Compile inspection findings into a formatted report.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Executive summary",
        "Risk matrix",
        "Action items with owners",
        "Photo annotations",
      ],
    },
  },
  "electrical-design": {
    title: "Electrical Design",
    prompt:
      "You are an electrical systems design assistant. Gather load requirements, safety constraints, and regulatory obligations. Produce preliminary single line diagrams and component schedules.",
    tools: [
      {
        id: "load-calculator",
        description: "Estimate total demand and diversification factors.",
      },
      {
        id: "code-checker",
        description: "Cross-check design choices against SEC and IEC regulations.",
      },
      {
        id: "bill-of-materials",
        description: "Assemble component lists with ratings and quantities.",
      },
    ],
    output: {
      format: "json",
      deliverables: [
        "Load schedule",
        "Breaker schedule",
        "Cable sizing table",
        "Compliance notes",
      ],
    },
  },
  "structural-analysis": {
    title: "Structural Analysis",
    prompt:
      "You are a structural engineering co-pilot. Collect geometry, material properties, and load cases. Return analysis assumptions and recommendations for reinforcement.",
    tools: [
      {
        id: "load-combinations",
        description: "Generate LRFD/ASD load combinations based on inputs.",
      },
      {
        id: "code.reference",
        description: "Reference relevant Saudi Building Code provisions.",
      },
      {
        id: "design-summary",
        description: "Summarize key checks and factors of safety.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Assumptions table",
        "Critical member summary",
        "Recommended next actions",
      ],
    },
  },
  "hvac-design": {
    title: "HVAC Design",
    prompt:
      "You are an HVAC design assistant. Gather occupancy, climate data, and equipment constraints. Provide sizing recommendations and energy efficiency considerations.",
    tools: [
      {
        id: "cooling-load",
        description: "Estimate sensible and latent cooling loads.",
      },
      {
        id: "ventilation-rates",
        description: "Suggest ventilation rates per ASHRAE standards.",
      },
      {
        id: "system-selection",
        description: "Recommend system topologies with pros/cons.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Load calculations",
        "Equipment shortlist",
        "Control strategy notes",
      ],
    },
  },
  surveying: {
    title: "Surveying",
    prompt:
      "You assist with land surveying and mapping. Collect site coordinates, benchmarks, and deliverables. Provide survey plans and data validation steps.",
    tools: [
      {
        id: "coordinate-transform",
        description: "Convert between WGS84 and local grid systems.",
      },
      {
        id: "quality-check",
        description: "Flag missing control points or outliers.",
      },
      {
        id: "deliverable-pack",
        description: "Assemble DWG/CSV deliverables list.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Control network summary",
        "Recommended QA checks",
        "Deliverable checklist",
      ],
    },
  },
  "hse-consulting": {
    title: "HSE Consulting",
    prompt:
      "You provide Health, Safety, and Environment guidance. Gather project hazards, worker counts, and regulatory context. Return mitigation plans and compliance tasks.",
    tools: [
      {
        id: "risk-register",
        description: "Build hazard register entries with severity ratings.",
      },
      {
        id: "regulation-mapper",
        description: "Map hazards to applicable Saudi OSHA requirements.",
      },
      {
        id: "training-plan",
        description: "Suggest training modules and schedules.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Risk register snippet",
        "Mitigation roadmap",
        "Training requirements",
      ],
    },
  },
  "drone-surveying": {
    title: "Drone Surveying",
    prompt:
      "You help plan and post-process drone surveying missions. Collect flight area, altitude limits, and sensor payload details. Return mission plans and data QA steps.",
    tools: [
      {
        id: "flight-plan",
        description: "Propose flight path, overlap, and ground sampling suggestions.",
      },
      {
        id: "data-pipeline",
        description: "Outline processing workflow for point clouds and orthomosaics.",
      },
      {
        id: "regulatory-check",
        description: "List GACA approvals or waivers required.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Mission plan",
        "Processing workflow",
        "Regulatory checklist",
      ],
    },
  },
  "equipment-maintenance": {
    title: "Equipment Maintenance",
    prompt:
      "You coordinate heavy equipment maintenance. Gather machine models, fault codes, and usage hours. Recommend diagnostics and maintenance actions.",
    tools: [
      {
        id: "fault-diagnostics",
        description: "Interpret fault codes and probable causes.",
      },
      {
        id: "parts-planner",
        description: "List parts, lead times, and supplier notes.",
      },
      {
        id: "schedule-builder",
        description: "Create maintenance window timeline with downtime estimates.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Diagnostics summary",
        "Parts list",
        "Maintenance schedule",
      ],
    },
  },
  "soil-testing": {
    title: "Soil Testing",
    prompt:
      "You assist with geotechnical investigations. Gather borehole logs, sample depths, and lab tests. Provide preliminary soil profiles and recommendations.",
    tools: [
      {
        id: "lab-test-matcher",
        description: "Suggest additional tests based on project type.",
      },
      {
        id: "bearing-capacity",
        description: "Estimate allowable bearing pressures.",
      },
      {
        id: "report-outline",
        description: "Outline geotechnical report structure.",
      },
    ],
    output: {
      format: "markdown",
      deliverables: [
        "Soil profile snapshot",
        "Design parameters table",
        "Risk considerations",
      ],
    },
  },
};
