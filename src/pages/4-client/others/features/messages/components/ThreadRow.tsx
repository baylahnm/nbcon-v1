import { ThreadSummary } from "../store/useMessagingStore";

export function ThreadRow({ item, active, onClick }:{ item:ThreadSummary; active?:boolean; onClick:()=>void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2 text-left ${active ? "bg-[var(--bg)]" : ""}`}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{item.title}</div>
        {item.jobCode && <div className="truncate text-xs opacity-60">{item.jobCode}</div>}
      </div>
      <div className="flex items-center gap-2">
        {item.starred && <span aria-label="Starred">★</span>}
        {item.unreadCount>0 && (
          <span className="min-w-[1.5rem] rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-center text-xs text-black">
            {item.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}


