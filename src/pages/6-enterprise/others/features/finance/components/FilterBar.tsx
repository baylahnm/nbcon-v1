export function FilterBar({
  filters, onChange
}:{ filters:any; onChange:(k:string,v:any)=>void }) {
  return (
    <section role="search" aria-label="Finance filters"
      className="rounded-2xl border-0 bg-[var(--surface)] p-3 shadow-inner">
      <div className="grid gap-3 md:grid-cols-5">
        <input aria-label="From" type="date"
          className="rounded-lg border-0 bg-[var(--bg)] px-3 py-2 shadow-md"
          value={filters.dateFrom ?? ""} onChange={(e)=>onChange("dateFrom", e.target.value)} />
        <input aria-label="To" type="date"
          className="rounded-lg border-0 bg-[var(--bg)] px-3 py-2 shadow-md"
          value={filters.dateTo ?? ""} onChange={(e)=>onChange("dateTo", e.target.value)} />
        <input aria-label="Company" placeholder="Company"
          className="rounded-lg border-0 bg-[var(--bg)] px-3 py-2 shadow-md"
          onChange={(e)=>onChange("companyId", e.target.value)} />
        <select aria-label="Type"
          className="rounded-lg border-0 bg-[var(--bg)] px-3 py-2 shadow-md"
          onChange={(e)=>onChange("type", e.target.value || null)}>
          <option value="">Type</option>
          <option value="tax">Tax</option>
          <option value="proforma">Proforma</option>
          <option value="credit_note">Credit note</option>
        </select>
        <label className="inline-flex h-12 items-center justify-start rounded-none border-0 bg-transparent p-0 text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <input type="checkbox" checked={!!filters.hijri} onChange={(e)=>onChange("hijri", e.target.checked)} />
          <span className="text-sm">Hijri dates</span>
          </span>
        </label>
      </div>
    </section>
  );
}

