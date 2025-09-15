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
          className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
          <div className="text-sm opacity-70">{label}</div>
          <div className="mt-1 text-xl font-bold">SAR {Number((data as any)[k]).toLocaleString()}</div>
        </button>
      ))}
    </div>
  );
}
