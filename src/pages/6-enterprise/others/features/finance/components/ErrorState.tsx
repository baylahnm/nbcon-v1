export function ErrorState({ onRetry }:{ onRetry:()=>void }) {
  return (
    <div className="rounded-2xl border border-[var(--danger)] bg-[var(--surface)] p-8 text-center">
      <div className="mb-2 text-sm">Something went wrong.</div>
      <button onClick={onRetry} className="rounded-lg border border-[var(--border)] px-3 py-1">Retry</button>
    </div>
  );
}

