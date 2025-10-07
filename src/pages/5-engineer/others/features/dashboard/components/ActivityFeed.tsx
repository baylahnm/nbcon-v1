export function ActivityFeed({ items }:{ items:{id:string; text:string; ts:string}[] }) {
  if (!items?.length) return <div className="opacity-70 text-sm">No recent activity.</div>;
  return (
    <ul className="space-y-2 text-sm">
      {items.map(i=>(
        <li key={i.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between">
          <div>{i.text}</div><div className="opacity-60">{i.ts}</div>
        </li>
      ))}
    </ul>
  );
}
