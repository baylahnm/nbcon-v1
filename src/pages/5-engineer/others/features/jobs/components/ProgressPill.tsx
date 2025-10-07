export function ProgressPill({ completed, total }:{ completed:number; total:number }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className="opacity-70">Milestones:</span>
      <span className="rounded-md border border-[var(--border)] px-2 py-0.5">
        {completed}/{total}
      </span>
    </span>
  );
}

