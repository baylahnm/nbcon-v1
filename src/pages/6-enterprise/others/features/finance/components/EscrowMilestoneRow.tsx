import type { EscrowItem } from "../store/useFinanceStore";

export function EscrowMilestoneRow({ item, role, onFund, onRelease, onDispute }:{
  item: EscrowItem;
  role: "client" | "engineer" | "enterprise";
  onFund:(mid:string)=>void;
  onRelease:(mid:string)=>void;
  onDispute:(mid:string)=>void;
}) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="text-sm">
        <div className="font-medium">{item.jobCode} • {item.milestoneName}</div>
        <div className="opacity-70">SAR {item.amount.toLocaleString()} • {item.state}</div>
      </div>
      <div className="flex gap-2">
        {role!=="engineer" && <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onFund(item.milestoneId)}>Fund</button>}
        <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onRelease(item.milestoneId)} disabled={item.state!=="in_review"}>Release</button>
        <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onDispute(item.milestoneId)}>Dispute</button>
      </div>
    </li>
  );
}


