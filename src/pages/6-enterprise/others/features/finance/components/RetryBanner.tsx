export function RetryBanner({ onRetry }:{ onRetry:()=>void }) {
  return (
    <div className="my-3 rounded-xl border border-[var(--warning)] px-3 py-2 text-sm" role="status">
      Offline or an error occurred. <button className="underline" onClick={onRetry}>Retry</button>
    </div>
  );
}


