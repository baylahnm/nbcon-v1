export function GeoHeatmap({ features, metricKey }:{ features:any[]; metricKey:string }) {
  return (
    <div className="grid h-64 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 text-sm opacity-80">
      Geo heatmap placeholder — {features?.length ?? 0} regions
    </div>
  );
}

