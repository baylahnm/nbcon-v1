export const Skeleton = ({ rows=6 }:{ rows?:number }) =>
  <ul className="animate-pulse space-y-2">
    {Array.from({length:rows}).map((_,i)=> <li key={i} className="h-6 rounded-lg bg-[var(--border)]/40" />)}
  </ul>;


