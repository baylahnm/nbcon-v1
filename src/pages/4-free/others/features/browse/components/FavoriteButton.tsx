export function FavoriteButton({
  active, onToggle, ariaLabel
}:{ active:boolean; onToggle:()=>void; ariaLabel:string }) {
  return (
    <button
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={
        "rounded-xl px-3 py-1 border font-semibold " +
        (active
          ? "bg-[var(--color-primary)] text-black border-transparent"
          : "border-[var(--border)]")
      }
    >
      {active ? "♥" : "♡"}
    </button>
  );
}


