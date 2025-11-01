export function TierAwareAppSidebar() {
  return (
    <aside className="hidden md:block w-64 border-r p-4" data-testid="sidebar">
      <div className="text-xs text-muted-foreground mb-2">Tier: free</div>
      <nav className="text-sm space-y-2">
        <div>Dashboard</div>
        <div>AI Assistant</div>
        <div>Projects</div>
        <div>Calendar</div>
      </nav>
    </aside>
  );
}
