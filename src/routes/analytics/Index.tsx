import { useEffect, useMemo, useState } from "react";
import { useAnalyticsStore } from "@/features/analytics/store/useAnalyticsStore";
import { FiltersBar } from "@/features/analytics/components/FiltersBar";
import { ReportActions } from "@/features/analytics/components/ReportActions";
import { KpiCard } from "@/features/analytics/components/KpiCard";
import { ChartLine } from "@/features/analytics/components/ChartLine";
import { ChartBar } from "@/features/analytics/components/ChartBar";
import { ChartArea } from "@/features/analytics/components/ChartArea";
import { ChartDonut } from "@/features/analytics/components/ChartDonut";
import { GeoHeatmap } from "@/features/analytics/components/GeoHeatmap";
import { DataTable } from "@/features/analytics/components/DataTable";
import { SkeletonGrid } from "@/features/analytics/components/SkeletonGrid";
import { ErrorState } from "@/features/analytics/components/ErrorState";
import { ChartA11yToggle } from "@/features/analytics/components/ChartA11yToggle";

export default function AnalyticsIndex() {
  const { filters, setFilter, overview, loading, error, loadOverview, exportCSV, exportPDF, saveReport, shareSnapshot } = useAnalyticsStore();
  const [showTables, setShowTables] = useState(false);

  useEffect(()=>{ loadOverview(); }, [filters.roleScope, filters.groupBy, filters.dateFrom, filters.dateTo, filters.companyId, filters.useHijri]);

  const tabs = useMemo(()=>{
    switch (filters.roleScope) {
      case "engineer": return ["Overview","Earnings","Utilization","Quality","Custom"];
      case "enterprise": return ["Overview","Finance","Operations","Workforce","Compliance","Custom"];
      case "admin": return ["Platform","Revenue","Growth","Risk/Fraud","Compliance","Custom"];
      default: return ["Overview","Finance","Operations","Quality","Custom"];
    }
  }, [filters.roleScope]);

  if (loading) return <main className="container mx-auto p-0 text-[var(--fg)]"><SkeletonGrid /></main>;
  if (error)   return <main className="container mx-auto p-0 text-[var(--fg)]"><ErrorState code={error} onRetry={loadOverview}/></main>;

  const kpis = overview.kpis;
  const charts = overview.charts as any;
  const tables = overview.tables as any;

  return (
    <main className="container mx-auto p-0 text-[var(--fg)]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <ReportActions
          onSave={async()=>{ const id = await saveReport({ name:"My report", layout:{} }); alert("Saved "+id); }}
          onShare={async()=>{ const url = await shareSnapshot({ reportId:"temp", ttlMinutes:60 }); alert("Share: "+url); }}
          onExportCsv={()=>exportCSV("overview")}
          onExportPdf={()=>exportPDF("overview")}
        />
      </header>

      <FiltersBar
        dateFrom={filters.dateFrom} dateTo={filters.dateTo}
        onDateFrom={v=>setFilter("dateFrom", v)} onDateTo={v=>setFilter("dateTo", v)}
        groupBy={filters.groupBy} onGroupBy={v=>setFilter("groupBy", v)}
        roleScope={filters.roleScope} onRoleScope={v=>setFilter("roleScope", v)}
        companyId={filters.companyId} onCompany={v=>setFilter("companyId", v)}
        categoryIds={filters.categoryIds} onCategories={v=>setFilter("categoryIds", v)}
        region={filters.region} city={filters.city} onRegion={v=>setFilter("region", v)} onCity={v=>setFilter("city", v)}
        status={filters.status} onStatus={v=>setFilter("status", v)}
        q={filters.q} onQ={v=>setFilter("q", v)}
        useHijri={filters.useHijri} onHijriToggle={v=>setFilter("useHijri", v)}
      />

      <nav className="mt-3 flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t} className={`rounded-lg border px-3 py-1 ${t==="Overview" ? "bg-[var(--color-primary)] text-black border-[var(--color-primary)]" : "border-[var(--border)]"}`}>
            {t}
          </button>
        ))}
        <div className="ml-auto"><ChartA11yToggle showTable={showTables} onToggle={setShowTables} /></div>
      </nav>

      {/* KPI Cards */}
      <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map(k => <KpiCard key={k.key} title={k.title} value={k.value} delta={k.delta} helpText={k.helpText} />)}
      </section>

      {/* Row A */}
      <section className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm opacity-70">Quotes vs Accepted ({filters.groupBy})</div>
          {!showTables ? <ChartLine data={charts.quotes_vs_accepts ?? []} yKeys={[{key:"quotes",label:"Quotes"},{key:"accepted",label:"Accepted"}]} /> :
            <DataTable columns={[{key:"t",label:"Period"},{key:"quotes",label:"Quotes"},{key:"accepted",label:"Accepted"}]} rows={charts.quotes_vs_accepts ?? []} />}
        </div>
        <div>
          <div className="mb-2 text-sm opacity-70">Spend by Category</div>
          {!showTables ? <ChartBar data={charts.spend_by_category ?? []} xKey="category" yKey="sar" /> :
            <DataTable columns={[{key:"category",label:"Category"},{key:"sar",label:"SAR"}]} rows={charts.spend_by_category ?? []} />}
        </div>
      </section>

      {/* Row B */}
      <section className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm opacity-70">Escrow states</div>
          {!showTables ? <ChartDonut data={charts.escrow_states ?? []} /> :
            <DataTable columns={[{key:"state",label:"State"},{key:"value",label:"Value"}]} rows={charts.escrow_states ?? []} />}
        </div>
        <div>
          <div className="mb-2 text-sm opacity-70">Cashflow</div>
          {!showTables ? <ChartArea data={charts.cashflow ?? []} yKeys={[{key:"invoices",label:"Invoices"},{key:"payments",label:"Payments"}]} /> :
            <DataTable columns={[{key:"t",label:"Period"},{key:"invoices",label:"Invoices"},{key:"payments",label:"Payments"}]} rows={charts.cashflow ?? []} />}
        </div>
      </section>

      {/* Row C */}
      <section className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm opacity-70">Heatmap by City</div>
          <GeoHeatmap features={charts.geo_heatmap ?? []} metricKey="metric" />
        </div>
        <div>
          <div className="mb-2 text-sm opacity-70">Top 10 Projects</div>
          <DataTable
            columns={[{key:"code",label:"Code"},{key:"title",label:"Title"},{key:"spend",label:"Spend"},{key:"ontime",label:"On-time"}]}
            rows={tables.top_projects ?? []}
            onRowClick={(r)=>location.assign(`/job/${r.code}`)}
          />
        </div>
      </section>
    </main>
  );
}
