export function RecommendedEngineers({ list, onInvite }:{
  list:{id:string; name:string; rating:number}[]; onInvite:(ids:string[])=>void;
}) {
  if (!list?.length) return <div className="opacity-70 text-sm">No recommendations yet.</div>;
  return (
    <div className="space-y-2">
      {list.map(e=>(
        <div key={e.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between text-sm">
          <div>{e.name} • ★ {e.rating.toFixed(1)}</div>
          <button onClick={()=>onInvite([e.id])} className="border border-[var(--border)] rounded-lg px-3 py-1">Invite</button>
        </div>
      ))}
    </div>
  );
}

