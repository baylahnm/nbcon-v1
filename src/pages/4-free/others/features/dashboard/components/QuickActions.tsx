export function QuickActions({ buttons }:{
  buttons:{ label:string; onClick:()=>void; variant?:"primary"|"outline" }[];
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {buttons.map((b,i)=>(
        <button key={i} onClick={b.onClick}
          className={b.variant==="primary"
            ? "inline-flex items-center justify-center rounded-xl px-4 py-1 font-semibold bg-primary text-primary-foreground shadow-md quick-actions-primary-btn"
            : "inline-flex items-center justify-center rounded-xl px-4 py-1 font-semibold border border-[var(--border)] shadow-md"}>
          {b.label}
        </button>
      ))}
    </div>
  );
}

