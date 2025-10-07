import { create } from "zustand";
import { dashboardOverview, quoteAccept, escrowRelease, recommendEngineers } from "../api/dashboardClient";

export type Role = "engineer" | "client" | "enterprise" | "admin";
export type Trend = "up" | "down" | "flat";
export type Kpi = { key:string; label:string; value:string|number; delta?:number; trend?:Trend };
export type EscrowTotals = { planned:number; in_escrow:number; in_review:number; released:number; disputed:number };

export interface DashboardState {
  role: Role;
  loading: boolean;
  error?: string;
  kpis: Kpi[];
  widgets: {
    jobsNear?: {id:string; title:string; distanceKm?:number}[];
    awaitingQuotes?: {id:string; jobTitle:string; amount:number}[];
    nextMilestones?: {id:string; title:string; due:string; amount:number}[];
    escrow?: EscrowTotals;
    earnings?: { pending:number; available:number; nextPayout?:string };
    finance?: { invoicesDue:number; overdue:number; paidMtd:number };
    recommended?: {id:string; name:string; rating:number}[];
    portfolio?: {projects:{id:string; title:string; status:string}[], statusCounts:Record<string,number>};
    workforce?: {teams:{name:string; utilization:number}[]};
    compliance?: { sceStatus:string; zatcaStatus:string; kycStatus:string };
    activity?: {id:string; text:string; ts:string}[];
    status?: { state:"ok"|"degraded"|"incident"; message:string };
  };
  load: (role:Role, filters?:Record<string,unknown>) => Promise<void>;
  refresh: () => Promise<void>;
  acceptQuote: (quoteId:string) => Promise<void>;
  releaseEscrow: (milestoneId:string) => Promise<void>;
  inviteEngineer: (jobId:string, engineerIds:string[]) => Promise<void>;
  toggleMapList: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  role: "engineer",
  loading: true,
  kpis: [],
  widgets: {},
  async load(role, filters) {
    set({ loading:true, role, error:undefined });
    try {
      const res = await dashboardOverview({ role, ...filters });
      set({ loading:false, kpis: res.kpis, widgets: res.widgets });
    } catch (e:any) {
      set({ loading:false, error: e?.message ?? "Failed to load dashboard" });
    }
  },
  async refresh(){ return get().load(get().role); },
  async acceptQuote(quoteId) { await quoteAccept(quoteId); },
  async releaseEscrow(milestoneId) { await escrowRelease(milestoneId); },
  async inviteEngineer(jobId, engineerIds){ await recommendEngineers(jobId, engineerIds); },
  toggleMapList(){ /* local UI flag if you add map/list */ },
}));
