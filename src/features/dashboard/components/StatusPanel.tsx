export function StatusPanel({ state, message }:{ state:"ok"|"degraded"|"incident"; message:string }) {
  const badge = state==="ok" ? "bg-green-600" : state==="degraded" ? "bg-yellow-600" : "bg-red-600";
  return (
    <div className={`rounded-xl border border-[var(--border)] p-4 flex items-center gap-2 ${badge} text-white`}>
      <div className="font-semibold capitalize">{state}</div>
      <div className="opacity-90">{message}</div>
    </div>
  );
}
