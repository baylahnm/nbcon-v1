import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { useFinanceStore } from "@/features/finance/store/useFinanceStore";
import { Tabs } from "@/features/finance/components/Tabs";
import { KpiCard } from "@/features/finance/components/KpiCard";
import { EarningsCharts } from "@/features/finance/components/EarningsCharts";
import { FilterBar } from "@/features/finance/components/FilterBar";
import { InvoiceRow } from "@/features/finance/components/InvoiceRow";
import { EscrowMilestoneRow } from "@/features/finance/components/EscrowMilestoneRow";
import { ExportButtons } from "@/features/finance/components/ExportButtons";
import { EmptyState } from "@/features/finance/components/EmptyState";
import { ErrorState } from "@/features/finance/components/ErrorState";

export default function PaymentsIndex() {
  const [tab, setTab] = useState<"overview"|"invoices"|"escrow"|"reports"|"settings">("overview");
  const {
    role, setRange, range, earningsSeries, balances,
    filters, setFilter, loadOverview, loadInvoices, loadEscrows,
    invoices, escrows, loading, error,
    payInvoice, fund, release, exportCSV, exportPDF
  } = useFinanceStore();

  useEffect(()=>{ loadOverview("client"); }, [loadOverview]);

  const tabs = [
    { key:"overview", label:"Overview" },
    { key:"invoices", label:"Invoices" },
    { key:"escrow", label:"Escrow" },
    { key:"reports", label:"Reports" },
    { key:"settings", label:"Settings" }
  ];

  return (
    <main className="container mx-auto px-0 py-0 text-[var(--fg)]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Payments
        </h1>
      </header>

      <Tabs value={tab} onChange={(v)=>setTab(v as any)} items={tabs} />

      <div className="mt-4">
        <FilterBar filters={filters} onChange={(k,v)=>{
          setFilter(k as any, v);
          if (tab==="invoices") loadInvoices();
          if (tab==="escrow") loadEscrows();
          if (tab==="overview") loadOverview(role);
        }} />
      </div>

      {loading && !error && tab==="overview" && (
        <div className="mt-4 opacity-70 text-sm">Loading…</div>
      )}
      {error && <ErrorState onRetry={()=>loadOverview("client")} />}

      {tab==="overview" && !error && (
        <section className="mt-4 grid gap-3 md:grid-cols-4">
          <KpiCard title="Total Outstanding" value={`SAR ${balances.outstanding.toLocaleString()}`} />
          <KpiCard title="Paid This Month" value={`SAR ${balances.paid.toLocaleString()}`} />
          <KpiCard title="Overdue" value={`${balances.overdueCount} invoices`} />
          <KpiCard title="Escrow Held" value={`SAR ${balances.escrowHeld.toLocaleString()}`} />
          <div className="md:col-span-4">
            <EarningsCharts range={range} series={earningsSeries} onRange={setRange} />
          </div>
        </section>
      )}

      {tab==="invoices" && (
        <section className="mt-4">
          <div className="overflow-auto rounded-2xl border border-[var(--border)]">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  {["#","Date","Job","Type","Total","VAT","Status","ZATCA","⋯"].map(h=>(
                    <th key={h} className="px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.length ? invoices.map(r => (
                  <InvoiceRow key={r.id}
                    row={r}
                    onPay={(id)=>payInvoice(id)}
                    onPdf={(id)=>console.log("invoice_downloaded",{ invoice_id:id, kind:"pdf" })}
                    onXml={(id)=>console.log("invoice_downloaded",{ invoice_id:id, kind:"xml" })}
                    onDetails={(id)=>location.assign(`/job/${id}/invoices`)}
                  />
                )) : (
                  <tr><td className="px-3 py-6" colSpan={9}><EmptyState text="No invoices in this range." /></td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs opacity-70">Last sync 2m ago ✓</div>
            <ExportButtons onCSV={exportCSV} onPDF={exportPDF} />
          </div>
        </section>
      )}

      {tab==="escrow" && (
        <section className="mt-4">
          <ul className="space-y-2">
            {escrows.length ? escrows.map(e =>
              <EscrowMilestoneRow key={e.milestoneId}
                item={e} role="client"
                onFund={(mid)=>fund(mid)}
                onRelease={(mid)=>release(mid)}
                onDispute={(mid)=>location.assign(`/job/${e.jobId}/disputes`)}
              />
            ) : <EmptyState text="No milestones require action." />}
          </ul>
        </section>
      )}

      {tab==="reports" && (
        <section className="mt-4">
          <ExportButtons onCSV={exportCSV} onPDF={exportPDF} />
        </section>
      )}

      {tab==="settings" && (
        <section className="mt-4">
          <a className="rounded-xl border border-[var(--border)] px-4 py-2" href="/settings/payments">Payment methods</a>
        </section>
      )}
    </main>
  );
}

