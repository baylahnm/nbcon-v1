export function ThreadHeader({
  title, subtitle, onCall, onFiles, onMore
}:{ title:string; subtitle?:string; onCall:()=>void; onFiles:()=>void; onMore:()=>void }) {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <div>
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onCall} className="rounded-lg border border-[var(--border)] px-3 py-1">Call</button>
        <button onClick={onFiles} className="rounded-lg border border-[var(--border)] px-3 py-1">Files</button>
        <button onClick={onMore} className="rounded-lg border border-[var(--border)] px-3 py-1">⋯</button>
      </div>
    </header>
  );
}


