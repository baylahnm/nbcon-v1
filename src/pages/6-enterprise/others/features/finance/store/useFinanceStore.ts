import { create } from "zustand";

export type Role = "client" | "engineer" | "enterprise";
export type RangeKey = "D" | "W" | "M";

export type ZatcaState = "draft" | "queued" | "cleared" | "failed";
export type InvoiceType = "proforma" | "tax" | "credit_note";

export type InvoiceRow = {
  id: string;
  code: string;
  date: string;         // ISO
  jobTitle: string;
  type: InvoiceType;
  total: number;        // includes VAT
  vat: number;          // 15% typically
  status: "unpaid" | "paid" | "partial" | "refunded" | "void";
  zatcaStatus?: ZatcaState | null;
  pdfUrl?: string | null;
  xmlUrl?: string | null;
};

export type EscrowItem = {
  jobId: string;
  milestoneId: string;
  jobCode: string;
  milestoneName: string;
  amount: number;
  state: "funded" | "held" | "in_review" | "released" | "refunded" | "disputed";
};

export type SeriesPoint = { x: string; y: number }; // date label + amount

export type Balances = {
  outstanding: number;
  paid: number;
  overdueCount: number;
  escrowHeld: number;
  pendingPayout: number;
  nextPayoutAt?: string | null;
};

export interface FinanceState {
  role: Role;
  range: RangeKey;
  filters: {
    dateFrom?: string;
    dateTo?: string;
    companyId?: string | null;
    type?: InvoiceType | null;
    status?: string | null;
    hijri?: boolean;
  };
  // data
  invoices: InvoiceRow[];
  escrows: EscrowItem[];
  earningsSeries: SeriesPoint[];
  balances: Balances;
  loading: boolean;
  error?: string;
  // actions
  loadOverview: (role: Role) => Promise<void>;
  loadInvoices: () => Promise<void>;
  loadEscrows: () => Promise<void>;
  payInvoice: (id: string) => Promise<void>;
  fund: (milestoneId: string) => Promise<void>;
  release: (milestoneId: string) => Promise<void>;
  requestPayout: (amount?: number) => Promise<void>;
  exportCSV: () => Promise<void>;
  exportPDF: () => Promise<void>;
  setRange: (r: RangeKey) => void;
  setFilter: <K extends keyof FinanceState["filters"]>(key: K, val: FinanceState["filters"][K]) => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  role: "client",
  range: "M",
  filters: { companyId: null, hijri: false },
  invoices: [],
  escrows: [],
  earningsSeries: [],
  balances: { outstanding: 0, paid: 0, overdueCount: 0, escrowHeld: 0, pendingPayout: 0, nextPayoutAt: null },
  loading: true,

  async loadOverview(role) {
    set({ loading: true, error: undefined, role });
    try {
      // TODO: wire to supabase.rpc('finance_overview', { params })
      // Mock snapshot:
      const balances: Balances = role === "client"
        ? { outstanding: 124500, paid: 87200, overdueCount: 3, escrowHeld: 52000, pendingPayout: 0, nextPayoutAt: null }
        : { outstanding: 0, paid: 0, overdueCount: 0, escrowHeld: 18000, pendingPayout: 2200, nextPayoutAt: "2025-02-02" };
      const series: SeriesPoint[] = Array.from({ length: 8 }).map((_, i) => ({
        x: `2025-01-${(i+1).toString().padStart(2,"0")}`,
        y: role === "client" ? 10000 + i*2500 : 3000 + i*1200
      }));
      set({ balances, earningsSeries: series, loading: false });
      console.log("analytics","finance_view",{ role, route: role==="engineer"?"/e/earnings":"/c/payments", range: get().range, ...get().filters });
    } catch (e:any) {
      set({ loading: false, error: e.message ?? "Failed to load overview" });
    }
  },

  async loadInvoices() {
    set({ loading: true, error: undefined });
    try {
      // TODO: wire to supabase.rpc('list_invoices', { params })
      const invoices: InvoiceRow[] = [
        { id:"inv1", code:"INV-001", date:"2025-01-06", jobTitle:"NB-1042 — Villa inspection", type:"tax", total:28750, vat:3750, status:"unpaid", zatcaStatus:"cleared", pdfUrl:"#", xmlUrl:"#"},
        { id:"inv2", code:"INV-002", date:"2025-01-12", jobTitle:"NB-1049 — HVAC redesign", type:"tax", total:11500, vat:1500, status:"paid", zatcaStatus:"cleared", pdfUrl:"#", xmlUrl:"#"}
      ];
      set({ invoices, loading: false });
    } catch (e:any) {
      set({ loading:false, error: e.message ?? "Failed to load invoices" });
    }
  },

  async loadEscrows() {
    set({ loading:true, error: undefined });
    try {
      // TODO: wire to supabase.rpc('list_escrows', { params })
      const escrows: EscrowItem[] = [
        { jobId:"j1", milestoneId:"m1", jobCode:"NB-1042", milestoneName:"Milestone 2", amount:25000, state:"held" },
        { jobId:"j2", milestoneId:"m7", jobCode:"NB-1055", milestoneName:"Phase 1 Review", amount:18000, state:"in_review" }
      ];
      set({ escrows, loading: false });
    } catch (e:any) {
      set({ loading:false, error: e.message ?? "Failed to load escrow" });
    }
  },

  async payInvoice(id) { console.log("invoice_pay_clicked",{ invoice_id:id }); /* await rpc */ },
  async fund(milestoneId) { console.log("escrow_fund",{ milestone_id:milestoneId }); /* await rpc */ },
  async release(milestoneId) { console.log("escrow_release",{ milestone_id:milestoneId }); /* await rpc */ },
  async requestPayout(amount) { console.log("payout_requested",{ amount }); /* await rpc */ },
  async exportCSV() { console.log("export_generated",{ kind:"csv" }); },
  async exportPDF() { console.log("export_generated",{ kind:"pdf" }); },

  setRange(r) { set({ range:r }); },
  setFilter(key, val) { set(s => ({ filters: { ...s.filters, [key]: val }})); },
}));

