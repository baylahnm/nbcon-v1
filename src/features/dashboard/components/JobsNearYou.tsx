export function JobsNearYou({ jobs, onOpen }:{
  jobs:{id:string; title:string; distanceKm?:number}[]; onOpen?:(id:string)=>void;
}) {
  if (!jobs?.length) return <div className="opacity-70 text-sm">Define your service area to see nearby jobs.</div>;
  return (
    <ul className="space-y-2">
      {jobs.map(j=>(
        <li key={j.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between">
          <div className="text-sm">{j.title} {typeof j.distanceKm==="number" && <span className="opacity-60">• {j.distanceKm} km</span>}</div>
          <button onClick={()=>onOpen?.(j.id)} className="bg-[#27c862] text-white rounded-lg px-3 py-1 text-sm">Details</button>
        </li>
      ))}
    </ul>
  );
}
