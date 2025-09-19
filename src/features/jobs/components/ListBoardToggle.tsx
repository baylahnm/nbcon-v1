export function ListBoardToggle({ view, onChange }:{ view:"list"|"board"; onChange:(v:"list"|"board")=>void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-xl border border-[var(--border)]">
      <button
        className={`px-3 py-1 ${view==="list" ? "bg-primary text-primary-foreground" : ""}`}
        onClick={()=>onChange("list")}
      >List</button>
      <button
        className={`px-3 py-1 ${view==="board" ? "bg-primary text-primary-foreground" : ""}`}
        onClick={()=>onChange("board")}
      >Board</button>
    </div>
  );
}

