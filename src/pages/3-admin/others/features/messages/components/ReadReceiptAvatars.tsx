export function ReadReceiptAvatars({ users }:{ users:{name:string; avatar?:string}[] }) {
  if (!users?.length) return null;
  return (
    <div className="flex -space-x-2">
      {users.slice(0,3).map((u,i)=>(
        <div key={i} className="h-4 w-4 rounded-full border border-[var(--surface)] bg-[var(--border)]" title={u.name} />
      ))}
      {users.length>3 && <span className="ml-2 text-[10px] opacity-60">+{users.length-3}</span>}
    </div>
  );
}

