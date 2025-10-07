import type { JobsFilters, JobStatus } from "../store/useJobsStore";

export function FilterBar({
  filters, onChange, role, onApply
}:{
  filters: JobsFilters;
  role:"client"|"engineer"|"enterprise";
  onChange:<K extends keyof JobsFilters>(k:K, v:JobsFilters[K])=>void;
  onApply:()=>void;
}) {
  const set = <K extends keyof JobsFilters>(k:K) => (e:any) => onChange(k, e?.target?.value ?? e);
  return (
    <section role="search" aria-label="Filters"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="grid gap-3 md:grid-cols-6">
        <input
          value={filters.q}
          onChange={set("q")}
          placeholder="Search…"
          aria-label="Search jobs"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
        />
        <select
          aria-label="Status"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          onChange={(e)=>onChange("status", e.target.value ? [e.target.value as JobStatus] : [])}
        >
          <option value="">Status</option>
          {["draft","open","assigned","in_progress","in_review","delivered","closed","canceled"].map(s=>
            <option key={s} value={s}>{s.replaceAll("_"," ")}</option>
          )}
        </select>
        <input
          placeholder="Category"
          aria-label="Category"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          onChange={(e)=>onChange("category", e.target.value ? [e.target.value] : [])}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-70">Budget</label>
          <input type="number" className="w-20 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                 value={filters.budget[0]} onChange={(e)=>onChange("budget",[Number(e.target.value), filters.budget[1]])}/>
          <span>—</span>
          <input type="number" className="w-24 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1"
                 value={filters.budget[1]} onChange={(e)=>onChange("budget",[filters.budget[0], Number(e.target.value)])}/>
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={filters.escrowReadyOnly}
                 onChange={(e)=>onChange("escrowReadyOnly", e.target.checked)} />
          <span className="text-sm">Only escrow-ready</span>
        </label>
        {role==="enterprise" && (
          <input placeholder="Company" aria-label="Company"
                 className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
                 onChange={(e)=>onChange("companyId", e.target.value)}/>
        )}
      </div>
      <div className="mt-3">
        <button onClick={onApply}
          className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground">
          Apply
        </button>
      </div>
    </section>
  );
}

