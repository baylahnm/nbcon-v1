export function AwaitingQuotes({ quotes, onAccept, onChat }:{
  quotes:{id:string; jobTitle:string; amount:number}[]; onAccept:(id:string)=>void; onChat:(id:string)=>void;
}) {
  if (!quotes?.length) return <div className="opacity-70 text-sm">No quotes waiting.</div>;
  return (
    <ul className="space-y-2">
      {quotes.map(q=>(
        <li key={q.id} className="rounded-lg border border-[var(--border)] p-3 flex items-center justify-between">
          <div className="text-sm">{q.jobTitle} — SAR {q.amount.toLocaleString()}</div>
          <div className="flex gap-2">
            <button onClick={()=>onChat(q.id)} className="border border-[var(--border)] rounded-lg px-3 py-1 text-sm">Chat</button>
            <button onClick={()=>onAccept(q.id)} className="bg-[var(--color-primary)] text-black rounded-lg px-3 py-1 text-sm">Accept</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
