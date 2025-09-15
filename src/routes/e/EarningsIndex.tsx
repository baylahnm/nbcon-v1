import { useEffect, useState } from "react";
import { useFinanceStore } from "@/features/finance/store/useFinanceStore";
import { Tabs } from "@/features/finance/components/Tabs";
import { KpiCard } from "@/features/finance/components/KpiCard";
import { EarningsCharts } from "@/features/finance/components/EarningsCharts";
import { FilterBar } from "@/features/finance/components/FilterBar";
import { EscrowMilestoneRow } from "@/features/finance/components/EscrowMilestoneRow";
import { PayoutPanel } from "@/features/finance/components/PayoutPanel";
import { EmptyState } from "@/features/finance/components/EmptyState";
import { ErrorState } from "@/features/finance/components/ErrorState";

export default function EarningsIndex() {
  const [tab, setTab] = useState<"overview"|"earnings"|"escrow"|"payouts"|"settings">("overview");
  const {
    range, setRange, earningsSeries, balances, filters, setFilter,
    loadOverview, loadEscrows, escrows, loading, error, requestPayout, release
  } = useFinanceStore();

  useEffect(()=>{ loadOverview("engineer"); }, [loadOverview]);

  const tabs = [
    { key:"overview", label:"Overview" },
    { key:"earnings", label:"Earnings" },
    { key:"escrow", label:"Escrow" },
    { key:"payouts", label:"Payouts" },
    { key:"settings", label:"Settings" }
  ];

  return (
    <main className="container mx-auto px-4 py-6 text-[var(--fg)]">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Earnings</h1>
      </header>

      <Tabs value={tab} onChange={(v)=>setTab(v as any)} items={tabs} />

      <div className="mt-4">
        <FilterBar filters={filters} onChange={(k,v)=>{
          setFilter(k as any, v);
          if (tab==="overview" || tab==="earnings") loadOverview("engineer");
          if (tab==="escrow") loadEscrows();
        }} />
      </div>

      {loading && !error && tab==="overview" && (
        <div className="mt-4 opacity-70 text-sm">Loading…</div>
      )}
      {error && <ErrorState onRetry={()=>loadOverview("engineer")} />}

      {tab==="overview" && !error && (
        <section className="mt-4 grid gap-3 md:grid-cols-4">
          <KpiCard title="Pending Escrow" value={`SAR ${balances.escrowHeld.toLocaleString()}`} />
          <KpiCard title="Next Payout" value={balances.nextPayoutAt ? balances.nextPayoutAt : "—"} note={`Pending: SAR ${balances.pendingPayout.toLocaleString()}`} />
          <KpiCard title="Earned (MTD)" value={`SAR ${Math.round(earningsSeries.slice(-4).reduce((a,b)=>a+b.y,0)).toLocaleString()}`} />
          <KpiCard title="Earned (YTD)" value={`SAR ${Math.round(earningsSeries.reduce((a,b)=>a+b.y,0)).toLocaleString()}`} />
          <div className="md:col-span-4">
            <EarningsCharts range={range} series={earningsSeries} onRange={setRange} />
          </div>
          <div className="md:col-span-2">
            <PayoutPanel balance={balances.pendingPayout} nextDate={balances.nextPayoutAt} method="IBAN ••••1234" onRequest={(amt)=>requestPayout(amt)} />
          </div>
        </section>
      )}

      {tab==="earnings" && (
        <section className="mt-4">
          <EarningsCharts range={range} series={earningsSeries} onRange={setRange} />
        </section>
      )}

      {tab==="escrow" && (
        <section className="mt-4">
          <ul className="space-y-2">
            {escrows.length ? escrows.map(e =>
              <EscrowMilestoneRow key={e.milestoneId}
                item={e} role="engineer"
                onFund={()=>{}} onRelease={(mid)=>release(mid)}
                onDispute={(mid)=>location.assign(`/job/${e.jobId}/disputes`)}
              />
            ) : <EmptyState text="No milestones require action." />}
          </ul>
        </section>
      )}

      {tab==="payouts" && (
        <section className="mt-4">
          <PayoutPanel balance={balances.pendingPayout} nextDate={balances.nextPayoutAt} method="IBAN ••••1234" onRequest={(amt)=>requestPayout(amt)} />
          <div className="mt-3">
            <a className="rounded-xl border border-[var(--border)] px-4 py-2" href="/e/payouts">Manage payout methods</a>
          </div>
        </section>
      )}

      {tab==="settings" && (
        <section className="mt-4">
          <a className="rounded-xl border border-[var(--border)] px-4 py-2" href="/settings/payments">Payment & payout settings</a>
        </section>
      )}
    </main>
  );
}

