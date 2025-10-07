import type { Kpi } from "../store/useDashboardStore";

export function KpiStrip({ items, onClick }:{ items:Kpi[]; onClick?:(k:Kpi)=>void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(k=>(
        <button key={k.key} onClick={()=>onClick?.(k)}
          className="text-left rounded-xl border-0 bg-[var(--surface)] p-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
          <div className="text-sm opacity-70">{k.label}</div>
          <div className="mt-1 text-2xl font-bold">{k.value}</div>
          {typeof k.delta==="number" && (
            <div className="mt-1 text-xs opacity-70">{k.delta>0?"▲":k.delta<0?"▼":"–"} {Math.abs(k.delta)}%</div>
          )}
        </button>
      ))}
    </div>
  );
}
