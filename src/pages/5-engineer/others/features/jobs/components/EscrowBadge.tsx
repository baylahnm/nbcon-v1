export function EscrowBadge({ state }:{ state:string|null|undefined }) {
  if (!state) return null;
  const tone =
    state==="disputed" ? "var(--danger)" :
    state==="released" ? "var(--success)" :
    state==="funded" || state==="held" ? "var(--color-primary)" :
    "var(--border)";
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px]"
      style={{ border:`1px solid ${tone}`, color: tone }}
      aria-label={`Escrow: ${state}`}
    >
      {state}
    </span>
  );
}

