export function UnifiedDashboard({ role = "client", pageTitle = "Dashboard" }: { role?: string; pageTitle?: string }) {
  return (
    <div className="space-y-4" data-testid={`dashboard-${role}`}>
      <h1 className="text-xl font-bold">{pageTitle}</h1>
      <section data-testid="dashboard-stats">Stats grid</section>
      <section data-testid="dashboard-quick-actions">Quick actions</section>
      <section data-testid="dashboard-main-content">Main content</section>
    </div>
  );
}
