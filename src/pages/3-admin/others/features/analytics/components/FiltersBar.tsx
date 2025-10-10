import { GroupBy, RoleScope } from "../store/useAnalyticsStore";

export function FiltersBar({
  dateFrom, dateTo, onDateFrom, onDateTo,
  groupBy, onGroupBy,
  roleScope, onRoleScope,
  companyId, onCompany,
  categoryIds, onCategories,
  region, city, onRegion, onCity,
  status, onStatus,
  q, onQ,
  useHijri, onHijriToggle
}:{ 
  dateFrom?:string; dateTo?:string; onDateFrom:(v:string)=>void; onDateTo:(v:string)=>void;
  groupBy:GroupBy; onGroupBy:(v:GroupBy)=>void;
  roleScope:RoleScope; onRoleScope:(v:RoleScope)=>void;
  companyId?:string|null; onCompany:(v:string|null)=>void;
  categoryIds?:string[]; onCategories:(v:string[])=>void;
  region?:string|null; city?:string|null; onRegion:(v:string|null)=>void; onCity:(v:string|null)=>void;
  status?:string|null; onStatus:(v:string|null)=>void;
  q?:string|null; onQ:(v:string)=>void;
  useHijri:boolean; onHijriToggle:(v:boolean)=>void;
}) {
  return (
    <section role="search" className="grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 md:grid-cols-12">
      <input aria-label="Search…" placeholder="Search…" value={q ?? ""} onChange={e=>onQ(e.target.value)}
        className="md:col-span-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
      <div className="md:col-span-2 flex gap-2">
        <input aria-label="Date From" type="date" value={dateFrom ?? ""} onChange={e=>onDateFrom(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
        <input aria-label="Date To" type="date" value={dateTo ?? ""} onChange={e=>onDateTo(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
      </div>
      <select aria-label="Group by" value={groupBy} onChange={e=>onGroupBy(e.target.value as GroupBy)}
        className="md:col-span-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
        <option value="day">Day</option><option value="week">Week</option><option value="month">Month</option>
      </select>
      <select aria-label="Role" value={roleScope} onChange={e=>onRoleScope(e.target.value as RoleScope)}
        className="md:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
        <option value="client">Client</option>
        <option value="engineer">Engineer</option>
        <option value="enterprise">Enterprise</option>
        <option value="admin">Admin</option>
      </select>
      <input aria-label="Company" placeholder="Company…" value={companyId ?? ""} onChange={e=>onCompany(e.target.value || null)}
        className="md:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
      <label className="md:col-span-2 inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={useHijri} onChange={e=>onHijriToggle(e.target.checked)} />
        <span>Hijri dates</span>
      </label>
    </section>
  );
}


