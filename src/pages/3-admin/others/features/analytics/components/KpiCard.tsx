export function KpiCard({ title, value, delta, helpText }:{
  title:string; value:string|number; delta?:number; helpText?:string;
}) {
  const deltaSign = delta ? (delta>0 ? "+" : "")+delta+"%" : null;
  const deltaTone = delta && delta>=0 ? "text-[var(--success)]" : "text-[var(--danger)]";
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {deltaSign && <div className={`text-xs ${deltaTone}`}>{deltaSign}</div>}
      {helpText && <div className="mt-1 text-xs opacity-60">{helpText}</div>}
    </div>
  );
}


