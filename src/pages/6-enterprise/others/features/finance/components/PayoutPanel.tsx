export function PayoutPanel({
  balance, nextDate, method, onRequest
}:{ balance:number; nextDate?:string|null; method?:string; onRequest:(amount?:number)=>void }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="font-semibold mb-2">Payouts</h3>
      <div className="text-sm opacity-70">Available balance</div>
      <div className="text-2xl font-bold">SAR {balance.toLocaleString()}</div>
      {nextDate && <div className="mt-1 text-xs opacity-70">Next payout: {nextDate}</div>}
      {method && <div className="mt-1 text-xs opacity-70">Method: {method}</div>}
      <div className="mt-3 flex gap-2">
        <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-black" onClick={()=>onRequest()}>Request Payout</button>
        <a className="rounded-xl border border-[var(--border)] px-4 py-2" href="/e/payouts">Manage methods</a>
      </div>
    </section>
  );
}

