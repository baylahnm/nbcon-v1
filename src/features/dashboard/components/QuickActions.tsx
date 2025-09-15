export function QuickActions({ buttons }:{
  buttons:{ label:string; onClick:()=>void; variant?:"primary"|"outline" }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((b,i)=>(
        <button key={i} onClick={b.onClick}
          className={b.variant==="primary"
            ? "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold bg-[var(--color-primary)] text-black shadow-md"
            : "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold border border-[var(--border)] shadow-md"}>
          {b.label}
        </button>
      ))}
    </div>
  );
}
