export function EmptyState({ text }:{ text:string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm opacity-80">
      {text}
    </div>
  );
}

