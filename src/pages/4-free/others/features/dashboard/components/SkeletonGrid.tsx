export function SkeletonGrid(){
  return (
    <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_,i)=>(<div key={i} className="h-20 rounded-xl bg-[var(--surface)] border border-[var(--border)]"></div>))}
    </div>
  );
}

