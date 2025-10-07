import { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";
import { KpiStrip } from "@/features/dashboard/components/KpiStrip";
import { Card } from "@/features/dashboard/components/Card";
import { PortfolioGlance } from "@/features/dashboard/components/PortfolioGlance";
import { FinanceSnapshot } from "@/features/dashboard/components/FinanceSnapshot";
import { WorkforceUtilization } from "@/features/dashboard/components/WorkforceUtilization";
import { ComplianceCard } from "@/features/dashboard/components/ComplianceCard";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

export default function EnterpriseDashboard() {
  const { load, refresh, loading, error, kpis, widgets } = useDashboardStore();
  useEffect(()=>{ load("enterprise"); }, [load]);

  if (loading) return <div className="p-6 opacity-70">Loading…</div>;
  if (error)   return <div className="p-6"><div className="mb-2">Failed to load</div><button className="border border-[var(--border)] rounded-lg px-3 py-1" onClick={refresh}>Retry</button></div>;

  return (
    <main className="container mx-auto px-4 py-6 text-[var(--fg)]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <nav className="flex gap-3 text-sm"><a href="/enterprise/messages">Messages</a></nav>
      </header>

      <KpiStrip items={kpis} />

      {/* Row A */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Portfolio At-a-Glance">
          <PortfolioGlance projects={widgets.portfolio?.projects ?? []}
                           statusCounts={widgets.portfolio?.statusCounts ?? {}} />
        </Card>
        <Card title="Finance: Cashflow">
          <FinanceSnapshot data={widgets.finance ?? { invoicesDue:0, overdue:0, paidMtd:0 }} />
        </Card>
      </div>

      {/* Row B */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Workforce Utilization">
          <WorkforceUtilization teams={widgets.workforce?.teams ?? []} />
        </Card>
        <Card title="Compliance & Risk">
          <ComplianceCard sceStatus={widgets.compliance?.sceStatus ?? "—"}
                          zatcaStatus={widgets.compliance?.zatcaStatus ?? "—"}
                          kycStatus={widgets.compliance?.kycStatus ?? "—"} />
        </Card>
      </div>

      {/* Row C */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Quick Actions">
          <QuickActions buttons={[
            { label:"New RFP", onClick:()=>location.assign("/x/rfp/new"), variant:"primary" },
            { label:"Team", onClick:()=>location.assign("/x/team"), variant:"outline" },
            { label:"Billing", onClick:()=>location.assign("/x/billing"), variant:"outline" },
            { label:"Reports", onClick:()=>location.assign("/analytics"), variant:"outline" }
          ]}/>
        </Card>
        <Card title="Activity & Alerts">
          <ActivityFeed items={widgets.activity ?? []} />
        </Card>
      </div>
    </main>
  );
}
