import type { SortKey } from "../store/useEngineerSearchStore";

export function SortSelect({ value, onChange }:{ value:SortKey; onChange:(v:SortKey)=>void }) {
  return (
    <label className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 py-2">
      <span className="text-sm opacity-70">Sort</span>
      <select
        value={value}
        aria-label="Sort"
        onChange={(e)=>onChange(e.target.value as SortKey)}
        className="bg-transparent outline-none"
      >
        <option value="best">Best match</option>
        <option value="nearest">Nearest</option>
        <option value="rating_desc">Top rated</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
      </select>
    </label>
  );
}


