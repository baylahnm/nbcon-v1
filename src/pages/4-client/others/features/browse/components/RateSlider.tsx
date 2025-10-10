export function RateSlider({
  min, max, value, onChange, ariaLabel
}:{ min:number; max:number; value:[number,number]; onChange:(v:[number,number])=>void; ariaLabel?:string }) {
  const [lo, hi] = value;
  return (
    <div className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 py-2">
      <span className="text-sm opacity-70">SAR</span>
      <input type="number" min={min} max={hi} value={lo}
        aria-label={`${ariaLabel ?? "Rate"} min`}
        onChange={(e)=>onChange([Number(e.target.value), hi])}
        className="w-20 bg-transparent outline-none" />
      <span>—</span>
      <input type="number" min={lo} max={max} value={hi}
        aria-label={`${ariaLabel ?? "Rate"} max`}
        onChange={(e)=>onChange([lo, Number(e.target.value)])}
        className="w-20 bg-transparent outline-none" />
      <span className="text-sm opacity-70">/h</span>
    </div>
  );
}


