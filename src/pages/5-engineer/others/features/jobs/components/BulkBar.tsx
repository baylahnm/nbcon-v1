export function BulkBar({
  selectedCount, onAction, onClear, role
}:{
  selectedCount:number;
  role:"client"|"engineer"|"enterprise";
  onAction:(kind:"archive"|"close"|"export"|"invite"|"withdraw")=>void;
  onClear:()=>void;
}) {
  if (!selectedCount) return null;
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="text-sm">{selectedCount} selected</div>
      <div className="flex flex-wrap gap-2">
        {role!=="engineer" && (
          <>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("invite")}>Invite</button>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("close")}>Close</button>
            <button className="rounded-lg bg-[var(--color-primary)] text-black px-3 py-1" onClick={()=>onAction("archive")}>Archive</button>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("export")}>Export</button>
          </>
        )}
        {role==="engineer" && (
          <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("withdraw")}>Withdraw Bids</button>
        )}
        <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}

