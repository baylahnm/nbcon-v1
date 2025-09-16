export function NextMilestones({ items, onRelease }:{
  items:{id:string; title:string; due:string; amount:number}[]; onRelease:(id:string)=>void;
}) {
  if (!items?.length) return <div className="opacity-70 text-sm">No upcoming milestones.</div>;
  return (
    <ul className="space-y-2">
      {items.map(m=>(
        <li key={m.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between shadow-inner">
          <div className="text-sm">{m.title} — due {m.due}</div>
          <button onClick={()=>onRelease(m.id)} className="bg-[#27c862] text-black rounded-lg px-3 py-1 text-sm">
            Release (SAR {m.amount.toLocaleString()})
          </button>
        </li>
      ))}
    </ul>
  );
}
