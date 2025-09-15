export function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="h-4 w-1/3 bg-[var(--border)] rounded"></div>
      <div className="mt-3 h-3 w-2/3 bg-[var(--border)] rounded"></div>
    </div>
  );
}

