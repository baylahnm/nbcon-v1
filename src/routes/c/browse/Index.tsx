import { useEffect, useMemo, useRef } from "react";
import { useEngineerSearchStore } from "@/features/browse/store/useEngineerSearchStore";
import { FiltersBar } from "@/features/browse/components/FiltersBar";
import { CategoryCard } from "@/features/browse/components/CategoryCard";
import { EngineerCard } from "@/features/browse/components/EngineerCard";
import { SkeletonCards } from "@/features/browse/components/SkeletonCards";
import { EmptyState } from "@/features/browse/components/EmptyState";
import { ErrorState } from "@/features/browse/components/ErrorState";
import { PaginationButton } from "@/features/browse/components/PaginationButton";

const SERVICES = [
  "structuralDesign","architecturalDesign","mepEngineering","civilEngineering","geotechnical","surveyingGis",
  "siteInspection","projectManagement","quantitySurveying","hse","fireSafety","hvac","electricalSystems","plumbingDrainage",
  "renewableSolar","smartBuildingIot","bimModeling","cadDrafting","technicalInterior","landscapeEngineering",
  "roadsHighways","bridgesTunnels","waterWastewater","environmentalImpact","materialsTesting","qaQcAudits",
  "commissioning","feasibilityStudies","forensicEngineering","droneSurveyMapping"
];

export default function BrowseServices(){
  const {
    init, fetchPage, setFilter, resetFilters, nextPage,
    loading, error, items, total, hasMore, categories, favorites, toggleFavorite
  } = useEngineerSearchStore();

  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ init().then(()=>fetchPage(1)); }, [init, fetchPage]);

  // announce results count to SR users
  useEffect(()=>{
    if (!loading && liveRef.current) liveRef.current.textContent = `${total} results`;
  }, [loading, total]);

  const onToggleCategory = (key:string) => {
    const next = categories.includes(key)
      ? categories.filter(k=>k!==key)
      : [...categories, key];
    setFilter("categories", next);
    fetchPage(1);
    // analytics: category_clicked
  };

  const grid = useMemo(()=>(
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item=>(
        <EngineerCard
          key={item.id}
          item={item}
          favorite={favorites.has(item.id)}
          onFavorite={()=>toggleFavorite(item.id)}
          onStartJob={()=>location.assign(`/c/job/new/quick?engineerId=${item.id}`)}
        />
      ))}
    </div>
  ), [items, favorites, toggleFavorite]);

  return (
    <main className="container mx-auto px-4 py-6 text-[var(--fg)]">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Browse Services</h1>
      </header>

      <FiltersBar />

      {/* Categories */}
      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="font-semibold mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map(key=>(
            <CategoryCard key={key} label={key} selected={categories.includes(key)} onClick={()=>onToggleCategory(key)} />
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="mt-4">
        <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef}></div>

        {error && <ErrorState message={error} onRetry={()=>fetchPage(1)} />}
        {!error && loading && <SkeletonCards count={6} />}

        {!error && !loading && items.length===0 && (
          <EmptyState
            title="No engineers match your filters"
            actions={
              <div className="flex gap-2 justify-center mt-3">
                <button onClick={resetFilters} className="rounded-xl px-3 py-1 border border-[var(--border)]">Reset Filters</button>
                <button onClick={()=>{ /* widen radius or turn off SCE filter */ }}
                  className="rounded-xl px-3 py-1 border border-[var(--border)]">Broaden search</button>
              </div>
            }
          />
        )}

        {!error && !loading && items.length>0 && (
          <>
            {grid}
            <PaginationButton hasMore={hasMore} onLoadMore={nextPage} />
          </>
        )}
      </section>
    </main>
  );
}

