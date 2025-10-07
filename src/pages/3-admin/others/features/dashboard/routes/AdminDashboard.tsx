import { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";
import { KpiStrip } from "@/features/dashboard/components/KpiStrip";
import { Card } from "@/features/dashboard/components/Card";
import { StatusPanel } from "@/features/dashboard/components/StatusPanel";

export default function AdminDashboard() {
  const { load, refresh, loading, error, kpis, widgets } = useDashboardStore();
  useEffect(()=>{ load("admin"); }, [load]);

  if (loading) return <div className="p-6 opacity-70">Loading…</div>;
  if (error)   return <div className="p-6"><div className="mb-2">Failed to load</div><button className="border border-[var(--border)] rounded-lg px-3 py-1" onClick={refresh}>Retry</button></div>;

  return (
    <main className="container mx-auto px-4 py-6 text-[var(--fg)]">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <KpiStrip items={kpis} />

      {/* Row A */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="Incidents / Status">
          <StatusPanel state={widgets.status?.state ?? "ok"} message={widgets.status?.message ?? "—"} />
        </Card>
        <Card title="Moderation Queue">
          <div className="opacity-80 text-sm">User reports and content flags.</div>
        </Card>
      </div>

      {/* Row B */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title="System Health">
          <div className="opacity-80 text-sm">DB, Realtime, Storage — all green.</div>
        </Card>
        <Card title="Feature Flags">
          <div className="opacity-80 text-sm">Toggle features for staged rollout.</div>
        </Card>
      </div>
    </main>
  );
}
