export function FilterBar({
  filters, onChange
}:{ filters:any; onChange:(k:string,v:any)=>void }) {
  return (
    <section role="search" aria-label="Finance filters"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="grid gap-3 md:grid-cols-5">
        <input aria-label="From" type="date"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          value={filters.dateFrom ?? ""} onChange={(e)=>onChange("dateFrom", e.target.value)} />
        <input aria-label="To" type="date"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          value={filters.dateTo ?? ""} onChange={(e)=>onChange("dateTo", e.target.value)} />
        <input aria-label="Company" placeholder="Company"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          onChange={(e)=>onChange("companyId", e.target.value)} />
        <select aria-label="Type"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          onChange={(e)=>onChange("type", e.target.value || null)}>
          <option value="">Type</option>
          <option value="tax">Tax</option>
          <option value="proforma">Proforma</option>
          <option value="credit_note">Credit note</option>
        </select>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!filters.hijri} onChange={(e)=>onChange("hijri", e.target.checked)} />
          <span className="text-sm">Hijri dates</span>
        </label>
      </div>
    </section>
  );
}

