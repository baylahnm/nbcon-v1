export function EmptyState({ title, actions }:{ title:string; actions?:React.ReactNode }){
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="font-semibold mb-2">{title}</div>
      {actions}
    </div>
  );
}

