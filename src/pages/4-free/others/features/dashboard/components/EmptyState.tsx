export function EmptyState({ title, action }:{ title:string; action?:React.ReactNode }){
  return (
    <div className="rounded-xl border border-[var(--border)] p-4 text-center">
      <div className="font-semibold mb-2">{title}</div>{action}
    </div>
  );
}

