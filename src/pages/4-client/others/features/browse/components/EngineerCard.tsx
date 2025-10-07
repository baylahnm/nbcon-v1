import type { EngineerRow } from "../store/useEngineerSearchStore";
import { FavoriteButton } from "./FavoriteButton";

export function EngineerCard({
  item, favorite, onFavorite, onStartJob
}:{ item:EngineerRow; favorite:boolean; onFavorite:()=>void; onStartJob:()=>void }) {
  const badge = (txt:string) => (
    <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs">{txt}</span>
  );

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--fg)]">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--bg)] grid place-items-center">
            {item.avatar ? <img src={item.avatar} alt="" className="h-10 w-10 rounded-full"/> : <span>👷</span>}
          </div>
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs opacity-70">★ {item.rating.toFixed(1)} • {item.reviewsCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.sceVerified && badge("SCE ✓")}
          {item.online && badge("Online")}
        </div>
      </header>

      <div className="flex flex-wrap gap-2 text-xs mb-3">
        {item.specialties.map(s=> (
          <span key={s} className="rounded-md border border-[var(--border)] px-2 py-0.5">{s}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="opacity-80">
          Rate: {item.rateHour ? `SAR ${item.rateHour}/h` : "N/A"}
          {typeof item.distanceKm === "number" && <span className="ml-2 opacity-70">• {item.distanceKm} km</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onStartJob}
            className="rounded-xl px-3 py-1 font-semibold bg-[var(--color-primary)] text-black">
            Start Job
          </button>
          <FavoriteButton active={favorite} onToggle={onFavorite} ariaLabel="Toggle favorite" />
        </div>
      </div>
    </article>
  );
}

