import { useEffect, useMemo, useRef } from "react";
import { useEngineerSearchStore } from "../store/useEngineerSearchStore";
import { SortSelect } from "./SortSelect";
import { RateSlider } from "./RateSlider";

export function FiltersBar(){
  const {
    query, sceOnly, availableToday, ratingMin, priceRange, radiusKm, sort,
    setFilter, fetchPage, location
  } = useEngineerSearchStore();

  // debounce search input
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeQuery = (val:string) => {
    if (timer.current) clearTimeout(timer.current);
    (timer as any).current = setTimeout(()=> {
      setFilter("query", val);
      fetchPage(1);
    }, 250);
  };

  useEffect(()=>{ // fetch when non-query filters change
    fetchPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceOnly, availableToday, ratingMin, priceRange[0], priceRange[1], radiusKm, sort]);

  const canRadius = useMemo(()=> !!location, [location]);

  return (
    <section role="search" aria-label="Filters"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] p-3 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <label className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
          <span className="opacity-70 text-sm">🔍</span>
          <input
            defaultValue={query}
            onChange={(e)=>onChangeQuery(e.target.value)}
            placeholder="Search engineers or services…"
            aria-label="Search"
            className="w-full bg-transparent outline-none"
          />
        </label>

        {/* Rating + SCE */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 py-2">
            <span className="text-sm opacity-70">Rating ≥</span>
            <input
              type="number" min={0} max={5} step={0.1} value={ratingMin}
              aria-label="Minimum rating"
              onChange={(e)=>setFilter("ratingMin", Number(e.target.value))}
              className="w-16 bg-transparent outline-none"
            />
          </label>
          <label className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 py-2">
            <input type="checkbox" checked={sceOnly}
              onChange={(e)=>setFilter("sceOnly", e.target.checked)} aria-label="SCE verified only" />
            <span className="text-sm">SCE verified</span>
          </label>
          <label className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 py-2">
            <input type="checkbox" checked={availableToday}
              onChange={(e)=>setFilter("availableToday", e.target.checked)} aria-label="Available today" />
            <span className="text-sm">Available today</span>
          </label>
        </div>

        {/* Rate, Radius, Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <RateSlider
            min={0} max={500} value={priceRange}
            onChange={(v)=>setFilter("priceRange", v)}
            ariaLabel="Hourly rate (SAR)" />
          {canRadius && (
            <label className="flex items-center gap-2 border border-[var(--border)] rounded-xl px-3 py-2">
              <span className="text-sm opacity-70">Radius</span>
              <input
                type="number" min={1} max={100} value={radiusKm ?? 10}
                onChange={(e)=>setFilter("radiusKm", Number(e.target.value))}
                aria-label="Radius in kilometers"
                className="w-20 bg-transparent outline-none"
              />
              <span className="text-sm">km</span>
            </label>
          )}
          <SortSelect value={sort} onChange={(v)=>setFilter("sort", v)} />
        </div>
      </div>
    </section>
  );
}

