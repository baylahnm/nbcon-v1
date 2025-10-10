import { ThreadSummary } from "../store/useMessagingStore";
import { ThreadRow } from "./ThreadRow";

export function ThreadList({
  items, activeId, onSelect, header
}:{ items:ThreadSummary[]; activeId?:string; onSelect:(id:string)=>void; header?:React.ReactNode }) {
  return (
    <aside aria-label="Threads"
      className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="p-3 border-b border-[var(--border)]">{header}</div>
      <div className="flex-1 overflow-auto">
        {items.length ? items.map(t => (
          <ThreadRow key={t.id} item={t} active={t.id===activeId} onClick={()=>onSelect(t.id)} />
        )) : <div className="p-4 text-sm opacity-70">No conversations yet</div>}
      </div>
    </aside>
  );
}


