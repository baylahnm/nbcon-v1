export function ZATCAStatusBadge({ state }:{ state:"draft"|"queued"|"cleared"|"failed"|null|undefined }) {
  if (!state) return null;
  const tone =
    state==="cleared" ? "var(--success)" :
    state==="failed"  ? "var(--danger)"  :
    state==="queued"  ? "var(--warning)" :
    "var(--border)";
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
      style={{ border:`1px solid ${tone}`, color: tone }}>
      ZATCA: {state}
    </span>
  );
}

