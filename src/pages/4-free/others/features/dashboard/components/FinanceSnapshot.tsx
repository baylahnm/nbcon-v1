export function FinanceSnapshot({ data }:{ data:{ invoicesDue:number; overdue:number; paidMtd:number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div className="rounded-xl border border-[var(--border)] p-4"><div className="text-sm opacity-70">Due</div><div className="mt-1 text-xl font-bold">{data.invoicesDue}</div></div>
      <div className="rounded-xl border border-[var(--border)] p-4"><div className="text-sm opacity-70">Overdue</div><div className="mt-1 text-xl font-bold">{data.overdue}</div></div>
      <div className="rounded-xl border border-[var(--border)] p-4"><div className="text-sm opacity-70">Paid (MTD)</div><div className="mt-1 text-xl font-bold">SAR {data.paidMtd.toLocaleString()}</div></div>
    </div>
  );
}

