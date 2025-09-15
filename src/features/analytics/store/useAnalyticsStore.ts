import { create } from "zustand";

export type GroupBy = "day" | "week" | "month";
export type RoleScope = "client" | "engineer" | "enterprise" | "admin";

export type Kpi = { key:string; title:string; value:string|number; delta?:number; helpText?:string };
export type SeriesPoint = Record<string, number | string>; // { t:'2025-01-01', quotes:10, accepted:6 }
export type TableRow = Record<string, string | number>;

export interface AnalyticsOverview {
  kpis: Kpi[];
  charts: Record<string, SeriesPoint[]>;
  tables: Record<string, TableRow[]>;
}

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  groupBy: GroupBy;
  useHijri: boolean;
  roleScope: RoleScope;
  companyId?: string | null;
  categoryIds?: string[]; // service categories
  region?: string | null;
  city?: string | null;
  status?: string | null;
  q?: string | null;
}

export interface AnalyticsState {
  filters: AnalyticsFilters;
  overview: AnalyticsOverview;
  loading: boolean;
  error?: string;

  setFilter: <K extends keyof AnalyticsFilters>(k:K, v: AnalyticsFilters[K]) => void;
  loadOverview: () => Promise<void>;
  exportCSV: (kind: "overview" | "finance" | "operations") => Promise<void>;
  exportPDF: (kind: "overview" | "finance" | "operations") => Promise<void>;
  saveReport: (meta: { name: string; layout: unknown }) => Promise<string>;
  shareSnapshot: (opts: { reportId: string; ttlMinutes: number }) => Promise<string>;
}

const initialOverview: AnalyticsOverview = { kpis: [], charts: {}, tables: {} };

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  filters: {
    groupBy: "week",
    useHijri: false,
    roleScope: "client",
    companyId: null,
    categoryIds: [],
    region: null,
    city: null,
    status: null,
    q: null
  },
  overview: initialOverview,
  loading: true,

  setFilter(k, v) {
    set(s => ({ filters: { ...s.filters, [k]: v } }));
  },

  async loadOverview() {
    set({ loading: true, error: undefined });
    try {
      // TODO: swap mock with supabase.rpc('rpc_analytics_overview', { params: get().filters })
      const { roleScope } = get().filters;
      const mock: AnalyticsOverview = {
        kpis: roleScope === "engineer"
          ? [
              { key:"earnings", title:"Earnings", value:"SAR 24,300", delta:+8 },
              { key:"pendingEscrow", title:"Pending Escrow", value:"SAR 11,000" },
              { key:"util", title:"Utilization", value:"78%" },
              { key:"rating", title:"Avg Rating", value:"4.7" }
            ]
          : roleScope === "admin"
          ? [
              { key:"gmv", title:"GMV", value:"SAR 3.2M", delta:+12 },
              { key:"takeRate", title:"Take Rate", value:"11.8%" },
              { key:"activeUsers", title:"Active Users", value:"8,420" },
              { key:"riskFlags", title:"Fraud Flags", value:4 }
            ]
          : [
              { key:"pipeline", title:"Pipeline", value:"SAR 920k", delta:+6 },
              { key:"conversion", title:"Quote Acceptance", value:"58%" },
              { key:"onTime", title:"On-time Delivery", value:"96%" },
              { key:"nps", title:"NPS", value:"+72" }
            ],
        charts: {
          quotes_vs_accepts: [
            { t:"2025-01-01", quotes:18, accepted:10 },
            { t:"2025-01-08", quotes:22, accepted:14 }
          ],
          spend_by_category: [
            { category:"Structural", sar: 120000 },
            { category:"MEP", sar: 90000 }
          ],
          cashflow: [
            { t:"2025-01", invoices: 210000, payments: 172000 }
          ],
          escrow_states: [
            { state:"in_escrow", value: 120000 },
            { state:"in_review", value: 30000 },
            { state:"released", value: 420000 },
            { state:"disputed", value: 0 }
          ],
          geo_heatmap: [
            { city:"Riyadh", metric: 62 },
            { city:"Jeddah", metric: 35 }
          ]
        },
        tables: {
          top_projects: [
            { code:"NB-1042", title:"Solar retrofit – Riyadh", spend:"SAR 180,000", ontime:"Yes" },
            { code:"NB-1038", title:"HVAC upgrade – Jeddah", spend:"SAR 120,000", ontime:"Yes" }
          ]
        }
      };
      set({ overview: mock, loading: false });
      console.log("analytics","analytics_view",{ route:"/analytics", filters:get().filters });
    } catch (e:any) {
      set({ loading: false, error: e?.message ?? "Failed to load analytics" });
    }
  },

  async exportCSV(kind) {
    // TODO: supabase.rpc('rpc_analytics_download', { kind:'csv', payload:get().filters })
    console.log("analytics","analytics_export",{ kind:'csv' });
  },

  async exportPDF(kind) {
    // TODO: supabase.rpc('rpc_analytics_download', { kind:'pdf', payload:get().filters })
    console.log("analytics","analytics_export",{ kind:'pdf' });
  },

  async saveReport(meta) {
    // TODO: supabase.rpc('rpc_report_save',{ name:meta.name, layout_json:meta.layout, filters_json:get().filters })
    const id = "rep_"+Math.random().toString(36).slice(2);
    console.log("analytics","report_saved",{ report_id:id });
    return id;
  },

  async shareSnapshot({ reportId, ttlMinutes }) {
    // TODO: supabase.rpc('rpc_share_snapshot', { report_id:reportId, ttl_minutes:ttlMinutes })
    const url = `/analytics/share/${reportId}?ttl=${ttlMinutes}`;
    console.log("analytics","report_shared",{ report_id:reportId, url_ttl:ttlMinutes });
    return url;
  }
}));

