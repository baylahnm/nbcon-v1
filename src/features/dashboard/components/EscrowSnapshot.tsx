import type { EscrowTotals } from "../store/useDashboardStore";

export function EscrowSnapshot({ data, onDrill }:{
  data:EscrowTotals; onDrill?:(k:keyof EscrowTotals)=>void;
}) {
  const items:{k:keyof EscrowTotals; label:string}[] = [
    { k:"in_escrow", label:"In Escrow" },
    { k:"in_review", label:"In Review" },
    { k:"released",  label:"Released" },
    { k:"disputed",  label:"Disputed" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({k,label})=>(
        <button key={k} onClick={()=>onDrill?.(k)}
          className="rounded-xl bg-[var(--bg)] p-3 text-left shadow-[inset_0_4px_0_hsl(var(--foreground)/0.08),inset_0_-4px_0_hsl(var(--foreground)/0.06),inset_4px_0_0_hsl(var(--foreground)/0.06),inset_-4px_0_0_hsl(var(--foreground)/0.06)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
          <div className="text-sm opacity-70">{label}</div>
          <div className="mt-1 text-xl font-bold">SAR {Number((data as any)[k]).toLocaleString()}</div>
        </button>
      ))}
    </div>
  );
}
