export function SkeletonCards({ count=6 }:{ count?:number }){
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} className="h-40 rounded-2xl border border-[var(--border)] bg-[var(--surface)] animate-pulse" />
      ))}
    </div>
  );
}

