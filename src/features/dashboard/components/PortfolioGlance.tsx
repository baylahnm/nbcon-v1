export function PortfolioGlance({ projects, statusCounts }:{
  projects:{id:string; title:string; status:string}[]; statusCounts:Record<string,number>;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        {Object.entries(statusCounts).map(([k,v])=>(
          <div key={k} className="rounded-lg border border-[var(--border)] p-2">
            <div className="opacity-70">{k}</div><div className="font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <ul className="space-y-2 text-sm">
        {projects.slice(0,5).map(p=>(
          <li key={p.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between">
            <div>{p.title}</div><div className="opacity-70">{p.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
