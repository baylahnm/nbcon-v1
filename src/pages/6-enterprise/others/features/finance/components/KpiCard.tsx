export function KpiCard({ title, value, note }:{ title:string; value:string; note?:string }) {
  return (
    <section role="region" aria-label={title}
      className="rounded-2xl border-0 bg-[var(--surface)] p-4 shadow-inner">
      <div className="text-sm opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {note && <div className="mt-1 text-xs opacity-60">{note}</div>}
    </section>
  );
}


