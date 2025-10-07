export function CalendarPeek({ items }:{ items:{date:string; label:string}[] }) {
  if (!items?.length) return <div className="opacity-70 text-sm">No upcoming dates.</div>;
  return (
    <ul className="space-y-2 text-sm">
      {items.map((d,i)=>(
        <li key={i} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between">
          <div>{d.label}</div><div className="opacity-70">{d.date}</div>
        </li>
      ))}
    </ul>
  );
}
