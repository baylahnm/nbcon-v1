// Wire these to Supabase later; typed signatures ready.
import type { JobListItem, JobsFilters, SortKey } from "../store/useJobsStore";

export const jobsClient = {
  async list(args: {
    role: "client" | "engineer" | "enterprise";
    filters: JobsFilters;
    sort: SortKey;
    page: number;
    perPage: number;
    origin?: { lat:number; lng:number } | null;
  }): Promise<{ items: JobListItem[]; total: number; nextPage: boolean }> {
    // return supabase.rpc('list_jobs', { params: {...} }).then(({ data }) => data)
    return { items: [], total: 0, nextPage: false };
  },

  async bulk(kind: "archive"|"close"|"export"|"invite"|"withdraw", jobIds: string[], payload?: Record<string,unknown>) {
    // return supabase.rpc('bulk_job_action', { kind, job_ids: jobIds, payload })
    return { ok: true } as const;
  }
};

