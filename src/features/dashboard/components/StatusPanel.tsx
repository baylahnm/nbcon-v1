export function StatusPanel({ state, message }:{ state:"ok"|"degraded"|"incident"; message:string }) {
  const badge = state==="ok" ? "bg-success text-success-foreground" : state==="degraded" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground";
  return (
    <div className={`rounded-xl border border-[var(--border)] p-4 flex items-center gap-2 ${badge}`}>
      <div className="font-semibold capitalize">{state}</div>
      <div className="opacity-90">{message}</div>
    </div>
  );
}
