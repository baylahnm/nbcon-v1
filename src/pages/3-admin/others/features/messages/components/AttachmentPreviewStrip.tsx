export function AttachmentPreviewStrip({ items, onRemove }:{ items:{name:string; size:number; mime:string}[]; onRemove:(name:string)=>void }) {
  if (!items?.length) return null;
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {items.map(a=>(
        <div key={a.name} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs">
          <span className="truncate max-w-[160px]">{a.name}</span>
          <button className="opacity-70 hover:opacity-100" onClick={()=>onRemove(a.name)}>✕</button>
        </div>
      ))}
    </div>
  );
}

