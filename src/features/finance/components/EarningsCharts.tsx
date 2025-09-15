import type { RangeKey, SeriesPoint } from "../store/useFinanceStore";

export function EarningsCharts({
  range, series, onRange
}:{ range:RangeKey; series:SeriesPoint[]; onRange:(r:RangeKey)=>void }) {
  // Placeholder chart (token-only). Replace with real chart lib later.
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Cashflow</h3>
        <div className="inline-flex overflow-hidden rounded-xl border border-[var(--border)]">
          {(["D","W","M"] as RangeKey[]).map(k=>(
            <button key={k}
              className={`px-3 py-1 ${range===k ? "bg-[var(--color-primary)] text-black": ""}`}
              onClick={()=>onRange(k)}>{k}</button>
          ))}
        </div>
      </header>
      <div className="grid grid-cols-12 items-end gap-1" aria-label="chart">
        {series.map((p,i)=>(
          <div key={i} className="bg-[var(--color-primary)]" style={{ height: `${Math.max(4, Math.min(p.y/300, 120))}px` }} />
        ))}
      </div>
    </section>
  );
}

