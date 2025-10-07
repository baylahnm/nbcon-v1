export function DateDivider({ date, hijri }:{ date:string; hijri?:boolean }) {
  return (
    <div className="my-2 flex items-center gap-2 text-xs opacity-70">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <span>{date}{hijri?" (هجري)":""}</span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

