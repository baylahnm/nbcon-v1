export function CategoryCard({
  label, selected, onClick
}:{ label:string; selected?:boolean; onClick:()=>void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={
        "rounded-xl px-3 py-2 border text-sm " +
        (selected
          ? "bg-[var(--color-primary)] text-black border-transparent"
          : "bg-[var(--bg)] text-[var(--fg)] border-[var(--border)]")
      }
    >
      {label}
    </button>
  );
}

