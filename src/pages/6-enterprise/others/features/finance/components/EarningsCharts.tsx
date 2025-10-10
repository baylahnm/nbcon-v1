import type { RangeKey, SeriesPoint } from "../store/useFinanceStore";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

export function EarningsCharts({
  range, series, onRange
}:{ range:RangeKey; series:SeriesPoint[]; onRange:(r:RangeKey)=>void }) {
  // Placeholder chart (token-only). Replace with real chart lib later.
  return (
    <section className="rounded-2xl border-0 bg-[var(--surface)] p-4 shadow-inner">
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Cashflow</h3>
        <div className="inline-flex overflow-hidden rounded-xl border-0 shadow-[inset_0_2px_6px_hsl(var(--foreground)/0.12),inset_0_0_0_2px_hsl(var(--foreground)/0.06)] earnings-range-group">
          {(["D","W","M"] as RangeKey[]).map(k=>{
            const active = range===k;
            const Icon = k==="D" ? Calendar : k==="W" ? CalendarRange : CalendarDays;
            return (
              <button key={k}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 font-medium transition-colors earnings-range-btn ${active ? "active bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={()=>onRange(k)}>
                <Icon className="h-4 w-4" /> {k}
              </button>
            );
          })}
        </div>
      </header>
      <div className="grid grid-cols-12 items-end gap-1" aria-label="chart">
        {series.map((p,i)=>(
          <div key={i} className="bg-primary" style={{ height: `${Math.max(4, Math.min(p.y/300, 120))}px` }} />
        ))}
      </div>
    </section>
  );
}


