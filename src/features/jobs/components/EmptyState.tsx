export function EmptyState({ message, action }:{ message:string; action?:React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="mb-2 text-sm opacity-80">{message}</div>
      {action}
    </div>
  );
}

