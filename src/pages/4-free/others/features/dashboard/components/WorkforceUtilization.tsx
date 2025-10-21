export function WorkforceUtilization({ teams }:{ teams:{name:string; utilization:number}[] }) {
  if (!teams?.length) return <div className="opacity-70 text-sm">No teams configured.</div>;
  return (
    <ul className="space-y-4 text-sm">
      {teams.map(t=>(
        <li key={t.name} className="rounded-lg border border-[var(--border)] p-4 flex items-center justify-between">
          <div>{t.name}</div><div className="font-semibold">{t.utilization}%</div>
        </li>
      ))}
    </ul>
  );
}

