import { create } from "zustand";

export type Role = "client" | "engineer" | "enterprise";

export type JobStatus =
  | "draft" | "open" | "assigned" | "in_progress"
  | "in_review" | "delivered" | "closed" | "canceled";

export type EscrowState =
  | "funded" | "held" | "released" | "refunded" | "disputed" | null;

export type JobListItem = {
  id: string;
  code: string;
  title: string;
  category: string;
  status: JobStatus;
  emergency: boolean;
  client_id: string; client_name?: string;
  engineer_id?: string; engineer_name?: string;
  budget_min: number | null; budget_max: number | null; currency: "SAR";
  location?: { lat:number; lng:number } | null; city?: string | null;
  bids_count: number; unread_msgs: number;
  milestones_done: number; milestones_total: number;
  escrow_state: EscrowState;
  next_due?: string | null; updated_at: string;
};

export type JobsFilters = {
  q: string;
  status: JobStatus[] | [];
  category: string[] | [];
  dateFrom?: string;
  dateTo?: string;
  budget: [number, number];
  radiusKm?: number | null;
  companyId?: string | null;
  escrowReadyOnly: boolean;
};

export type SortKey =
  | "recent" | "due_asc" | "budget_desc" | "quotes_desc" | "unread_desc";
export type ViewKey = "list" | "board";

export interface JobsState {
  role: Role;
  filters: JobsFilters;
  sort: SortKey;
  view: ViewKey;
  page: number; perPage: number;
  selection: Set<string>;
  list: JobListItem[];
  total: number;
  nextPage: boolean;
  loading: boolean;
  error?: string;
  // actions
  load: (role: Role) => Promise<void>;
  next: () => Promise<void>;
  setFilter: <K extends keyof JobsFilters>(k: K, v: JobsFilters[K]) => void;
  reset: () => void;
  setView: (v: ViewKey) => void;
  setSort: (s: SortKey) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  bulkAction: (kind: "archive" | "close" | "export" | "invite" | "withdraw") => Promise<void>;
}

const defaults: JobsFilters = {
  q: "",
  status: ["open","assigned","in_progress"],
  category: [],
  budget: [0, 200000],
  radiusKm: null,
  companyId: null,
  escrowReadyOnly: false,
};

export const useJobsStore = create<JobsState>((set, get) => ({
  role: "client",
  filters: { ...defaults },
  sort: "recent",
  view: "list",
  page: 1, perPage: 20,
  selection: new Set<string>(),
  list: [],
  total: 0,
  nextPage: false,
  loading: true,

  async load(role) {
    set({ loading: true, role, error: undefined, page: 1, selection: new Set() });
    try {
      // TODO: replace with Supabase RPC list_jobs
      // const { items, total, nextPage } = await jobsClient.list({ role, ...get().filters, sort:get().sort, page:1, perPage:get().perPage })
      // MOCK for UI work:
      const items: JobListItem[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `j${i+1}`,
        code: `NB-${1040 + i}`,
        title: i % 2 ? "Structural inspection — villa" : "Architectural schematic update",
        category: i % 2 ? "Site Inspection" : "Architectural Design",
        status: (["open","assigned","in_progress","in_review"] as JobStatus[])[i%4],
        emergency: i % 5 === 0,
        client_id: "me", client_name: "Acme Dev",
        engineer_id: i % 3 ? `eng-${i}` : undefined, engineer_name: i % 3 ? "Eng. Basel" : undefined,
        budget_min: 3000, budget_max: 12000, currency: "SAR",
        city: "Riyadh",
        bids_count: 2 + (i%4),
        unread_msgs: i % 3,
        milestones_done: i % 3, milestones_total: 3,
        escrow_state: (["held","funded","released","disputed"] as EscrowState[])[i%4],
        next_due: "2025-10-12",
        updated_at: new Date().toISOString(),
      }));
      set({ list: items, total: 42, nextPage: true, loading: false });
      // analytics example:
      console.log("analytics", "jobs_list_view", { role, route: role==="engineer"?"/e/jobs":"/c/jobs" });
    } catch (e:any) {
      set({ loading: false, error: e.message ?? "Failed to load jobs" });
    }
  },

  async next() {
    if (!get().nextPage || get().loading) return;
    set({ loading: true });
    try {
      // const res = await jobsClient.list({...})
      set({ loading:false, page: get().page + 1 /* , list: [...get().list, ...res.items], nextPage: res.nextPage */ });
    } catch (e:any) {
      set({ loading:false, error: e.message ?? "Failed to load more" });
    }
  },

  setFilter(k, v) {
    set((s) => ({ filters: { ...s.filters, [k]: v } }));
    // debounce fetch outside or here; for skeleton we keep manual refresh from Toolbar.
  },

  reset() {
    set({ filters: { ...defaults }, sort: "recent", page: 1 });
  },

  setView(v) { set({ view: v }); console.log("analytics","jobs_view_mode_changed",{ view:v }); },
  setSort(s) { set({ sort: s }); console.log("analytics","jobs_sort_changed",{ sort:s }); },

  toggleSelect(id) {
    const sel = new Set(get().selection);
    if (sel.has(id)) sel.delete(id); else sel.add(id);
    set({ selection: sel });
  },
  clearSelection() { set({ selection: new Set() }); },

  async bulkAction(kind) {
    const ids = Array.from(get().selection);
    if (!ids.length) return;
    // await jobsClient.bulk(kind, ids)
    console.log("analytics","jobs_bulk_action",{ kind, count: ids.length });
    // optimistic example: archive → remove rows
    if (kind === "archive") {
      set({ list: get().list.filter(j => !ids.includes(j.id)), selection: new Set() });
    }
  },
}));

