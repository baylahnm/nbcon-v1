export function EarningsSnapshot({ data }:{ data:{ pending:number; available:number; nextPayout?:string } }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-[var(--border)] p-3">
        <div className="text-sm opacity-70">Pending</div>
        <div className="mt-1 text-xl font-bold">SAR {data.pending.toLocaleString()}</div>
      </div>
      <div className="rounded-xl border border-[var(--border)] p-3">
        <div className="text-sm opacity-70">Available</div>
        <div className="mt-1 text-xl font-bold">SAR {data.available.toLocaleString()}</div>
        {data.nextPayout && <div className="text-xs opacity-70 mt-1">Next payout: {data.nextPayout}</div>}
      </div>
    </div>
  );
}
