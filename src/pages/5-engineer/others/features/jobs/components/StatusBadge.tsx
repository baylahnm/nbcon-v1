export function StatusBadge({ status }:{ status:string }) {
  // Map to semantic tokens (muted | warning | success | danger | brand)
  const tone =
    status==="in_review" ? "var(--warning)" :
    status==="delivered" || status==="closed" ? "var(--success)" :
    status==="canceled" ? "var(--danger)" :
    status==="open" || status==="assigned" || status==="in_progress" ? "var(--color-primary)" :
    "var(--border)";
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
      style={{ backgroundColor: "transparent", border: `1px solid ${tone}`, color: tone }}
      aria-label={`Status: ${status}`}
    >
      {status.replaceAll("_"," ")}
    </span>
  );
}

