import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";
import { KpiStrip } from "@/features/dashboard/components/KpiStrip";
import { Card } from "@/features/dashboard/components/Card";
import { JobsNearYou } from "@/features/dashboard/components/JobsNearYou";
import { NextMilestones } from "@/features/dashboard/components/NextMilestones";
import { EscrowSnapshot } from "@/features/dashboard/components/EscrowSnapshot";
import { EarningsSnapshot } from "@/features/dashboard/components/EarningsSnapshot";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { VerificationCard } from "@/features/dashboard/components/VerificationCard";
import { LayoutDashboard } from "lucide-react";

export default function EngineerDashboard() {
  const { load, refresh, loading, error, kpis, widgets, releaseEscrow } = useDashboardStore();
  useEffect(()=>{ load("engineer"); }, [load]);

  if (loading) return <div className="p-6 opacity-70">Loading…</div>;
  if (error)   return <div className="p-6"><div className="mb-2">Failed to load</div><button className="border border-[var(--border)] rounded-lg px-3 py-1" onClick={refresh}>Retry</button></div>;

  return (
    <main className="w-full mx-auto p-0 text-[var(--fg)]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          Dashboard
        </h1>
        <nav className="flex gap-3 text-sm"><Link to="/engineer/messages">Messages</Link><Link to="/settings/profile">Profile</Link></nav>
      </header>

      <KpiStrip items={kpis} />

      {/* Row A */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Jobs Near You" right={<Link to="/browse" className="text-[var(--color-primary)]">See all</Link>}>
          <JobsNearYou jobs={widgets.jobsNear ?? []} onOpen={(id)=>location.assign(`/job/${id}`)} />
        </Card>
        <Card title="Next Milestones Due">
          <NextMilestones items={widgets.nextMilestones ?? []} onRelease={releaseEscrow} />
        </Card>
      </div>

      {/* Row B */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Escrow & Earnings">
          {widgets.escrow && <EscrowSnapshot data={widgets.escrow} />}
          {widgets.earnings && <div className="mt-3"><EarningsSnapshot data={widgets.earnings} /></div>}
        </Card>
        <Card title="Activity & Alerts">
          <ActivityFeed items={widgets.activity ?? []} />
        </Card>
      </div>

      {/* Row C */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Quick Actions">
          <QuickActions buttons={[
            { label:"Browse Jobs", onClick:()=>location.assign("/browse"), variant:"primary" },
            { label:"Check-In", onClick:()=>location.assign("/e/checkin"), variant:"outline" },
            { label:"Upload Deliverable", onClick:()=>location.assign("/job/upload"), variant:"outline" }
          ]}/>
        </Card>
        <Card title="Verification">
          <VerificationCard steps={["Upload ID","Link SCE","Face match"]} onStart={()=>location.assign("/settings/verification")} />
        </Card>
      </div>
    </main>
  );
}
