export function TypingIndicator({ names }:{ names:string[] }) {
  if (!names?.length) return null;
  return <div className="text-xs opacity-70">{names[0]} {names.length>1 ? "and others " : ""}is typing…</div>;
}


