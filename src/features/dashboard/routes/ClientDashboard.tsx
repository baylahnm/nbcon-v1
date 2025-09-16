import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";
import { KpiStrip } from "@/features/dashboard/components/KpiStrip";
import { Card } from "@/features/dashboard/components/Card";
import { AwaitingQuotes } from "@/features/dashboard/components/AwaitingQuotes";
import { NextMilestones } from "@/features/dashboard/components/NextMilestones";
import { EscrowSnapshot } from "@/features/dashboard/components/EscrowSnapshot";
import { ComplianceCard } from "@/features/dashboard/components/ComplianceCard";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

export default function ClientDashboard() {
  const { load, refresh, loading, error, kpis, widgets, acceptQuote } = useDashboardStore();
  useEffect(()=>{ load("client"); }, [load]);

  if (loading) return <div className="p-6 opacity-70">Loading…</div>;
  if (error)   return <div className="p-6"><div className="mb-2">Failed to load</div><button className="border border-[var(--border)] rounded-lg px-3 py-1" onClick={refresh}>Retry</button></div>;

  return (
    <main className="container mx-auto px-4 py-6 text-[var(--fg)]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <nav className="flex gap-3 text-sm"><Link to="/client/messages">Messages</Link><Link to="/notifications">Notifications</Link></nav>
      </header>

      <KpiStrip items={kpis} />

      {/* Row A */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Awaiting Quotes">
          <AwaitingQuotes quotes={widgets.awaitingQuotes ?? []}
            onAccept={acceptQuote} onChat={(id)=>location.assign(`/messages?t=${id}`)} />
        </Card>
        <Card title="Timeline: Upcoming">
          <NextMilestones items={widgets.nextMilestones ?? []} onRelease={()=>{}} />
        </Card>
      </div>

      {/* Row B */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Escrow & Invoices">
          {widgets.escrow && <EscrowSnapshot data={widgets.escrow} />}
        </Card>
        <Card title="Recommended Engineers">
          <div className="opacity-80 text-sm">Invite vetted engineers to quote.</div>
        </Card>
      </div>

      {/* Row C */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Quick Actions">
          <QuickActions buttons={[
            { label:"Create Job", onClick:()=>location.assign("/client/jobs/create"), variant:"primary" },
            { label:"Quote Matrix", onClick:()=>location.assign("/c/quotes"), variant:"outline" },
            { label:"New Emergency", onClick:()=>location.assign("/c/job/new/emergency"), variant:"outline" }
          ]}/>
        </Card>
        <Card title="Compliance">
          <ComplianceCard sceStatus={widgets.compliance?.sceStatus ?? "—"}
                          zatcaStatus={widgets.compliance?.zatcaStatus ?? "—"}
                          kycStatus={widgets.compliance?.kycStatus ?? "—"} />
        </Card>
      </div>
    </main>
  );
}
