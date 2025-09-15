export function Tabs({
  value, onChange, items
}:{ value:string; onChange:(v:string)=>void; items:{key:string; label:string}[] }) {
  return (
    <div role="tablist" aria-label="Sections" className="flex flex-wrap gap-2">
      {items.map(t=>(
        <button
          key={t.key}
          role="tab"
          aria-selected={value===t.key}
          onClick={()=>onChange(t.key)}
          className={`rounded-xl border border-[var(--border)] px-4 py-2 ${value===t.key ? "bg-[var(--color-primary)] text-black" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

