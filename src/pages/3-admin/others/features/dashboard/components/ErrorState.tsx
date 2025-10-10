export function ErrorState({ message, onRetry }:{ message:string; onRetry:()=>void }){
  return (
    <div className="rounded-xl border border-[var(--border)] p-6">
      <div className="font-semibold mb-2">Something went wrong</div>
      <div className="opacity-80 text-sm">{message}</div>
      <button onClick={onRetry} className="mt-3 border border-[var(--border)] rounded-lg px-3 py-1 text-sm">Retry</button>
    </div>
  );
}

