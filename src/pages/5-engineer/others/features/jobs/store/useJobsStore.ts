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
      // Load real jobs from Supabase
      const { supabase } = await import('@/shared/supabase/client');
      
      // Build query based on filters
      let query = (supabase as any)
        .from('jobs')
        .select(`
          *,
          client:profiles!jobs_client_id_fkey(user_id, first_name, last_name)
        `, { count: 'exact' });

      // Apply status filter
      const { filters } = get();
      if (filters.status && filters.status.length > 0) {
        query = query.in('job_status', filters.status);
      }

      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      // Apply budget filter
      if (filters.budget && filters.budget.length === 2) {
        query = query.gte('budget_min', filters.budget[0])
                     .lte('budget_max', filters.budget[1]);
      }

      // Apply sorting
      const { sort } = get();
      if (sort === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'budget_high') {
        query = query.order('budget_max', { ascending: false });
      } else if (sort === 'budget_low') {
        query = query.order('budget_min', { ascending: true });
      }

      // Pagination
      const { page, perPage } = get();
      const start = (page - 1) * perPage;
      const end = start + perPage - 1;
      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform to JobListItem format
      const items: JobListItem[] = (data || []).map((job: any) => ({
        id: job.id,
        code: `JOB-${job.id.substring(0, 8).toUpperCase()}`,
        title: job.title,
        category: job.category || 'General',
        status: job.job_status as JobStatus,
        emergency: job.urgency === 'emergency',
        client_id: job.client_id,
        client_name: job.client ? `${job.client.first_name} ${job.client.last_name}` : 'Client',
        engineer_id: undefined,
        engineer_name: undefined,
        budget_min: Number(job.budget_min || 0),
        budget_max: Number(job.budget_max || 0),
        currency: job.currency || 'SAR',
        city: job.location_city || 'N/A',
        bids_count: 0, // TODO: Count from job_bids table
        unread_msgs: 0, // TODO: Join with messages
        milestones_done: 0,
        milestones_total: 0,
        escrow_state: 'held' as EscrowState,
        next_due: job.expires_at || '',
        updated_at: job.updated_at,
      }));

      const total = count || 0;
      const nextPage = total > end + 1;

      set({ list: items, total, nextPage, loading: false });
      console.log(`[Jobs] Loaded ${items.length} jobs (total: ${total})`);
    } catch (e:any) {
      console.error('[Jobs] Error loading jobs:', e);
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

