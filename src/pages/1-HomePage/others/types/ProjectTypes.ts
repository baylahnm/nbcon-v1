export interface ProjectBasics {
  title: string;
  category: string;
  location: string;
  isRemote: boolean;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: {
    weeks: number;
    flexible: boolean;
  };
  language: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  isRequired: boolean;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  valuePercentage: number;
  dueDate?: string;
}

export interface ProjectScope {
  description: string;
  deliverables: Deliverable[];
  milestones: Milestone[];
  technicalRequirements: string[];
}

export interface ProjectRequirements {
  experience: string;
  skills: string[];
  certifications: string[];
  portfolio: boolean;
  interviews: boolean;
}

export interface ProjectTimeline {
  startDate: string;
  endDate: string;
  flexibleStart: boolean;
  flexibleEnd: boolean;
  workingHours: {
    timezone: string;
    hoursPerWeek: number;
    preferredSchedule: string;
  };
}

export interface ProjectCompliance {
  sceRequired: boolean;
  hseRequired: boolean;
  insuranceNeeded: boolean;
  securityClearance: boolean;
  additionalRequirements: string[];
}

export interface ProjectData {
  basics?: ProjectBasics;
  scope?: ProjectScope;
  requirements?: ProjectRequirements;
  timeline?: ProjectTimeline;
  compliance?: ProjectCompliance;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  industry: string;
  rating: number;
  downloads: number;
  lastUsed?: string;
  data: ProjectData;
  author?: {
    name: string;
    avatar: string;
    rating: number;
  };
  price?: number;
  currency?: string;
  isFree?: boolean;
}

export interface MarketplaceTemplate extends ProjectTemplate {
  price: number;
  currency: string;
  isFree: boolean;
  author: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    totalSales: number;
  };
  tags: string[];
  description: string;
  previewImages: string[];
  features: string[];
}

export interface FilterOptions {
  search: string;
  category: string;
  complexity: string;
  industry: string;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  tags: string[];
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export interface ServerAlias {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
}

export interface ProjectAlias {
  id: string;
  name: string;
  category: string;
  description: string;
  lastUsed: string;
  useCount: number;
}

export interface ProjectFormState {
  currentTab: number;
  isDirty: boolean;
  lastSaved?: string;
  validationErrors: Record<string, string[]>;
  autoSaveEnabled: boolean;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  path: string;
}
