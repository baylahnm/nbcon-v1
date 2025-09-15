import { create } from "zustand";
import { searchEngineers, getFavorites, toggleFavoriteDb } from "../api/browseClient";

export type SortKey = "best"|"nearest"|"rating_desc"|"price_asc"|"price_desc";

export type EngineerRow = {
  id:string; name:string; avatar:string|null;
  rating:number; reviewsCount:number;
  rateHour:number|null; distanceKm:number|null;
  sceVerified:boolean; online:boolean;
  specialties:string[]; company?:string|null;
};

type Results = { items:EngineerRow[]; total:number; nextPage:boolean };

type Location = { lat:number; lng:number } | null;

export interface EngineerSearchState {
  // Filters
  query:string;
  categories:string[];
  ratingMin:number;                     // 0–5
  priceRange:[number,number];           // SAR/hour
  sceOnly:boolean;
  availableToday:boolean;
  radiusKm:number|null;
  location:Location;
  sort:SortKey;
  page:number; perPage:number;

  // Data
  loading:boolean;
  error?:string;
  items:EngineerRow[];
  total:number;
  hasMore:boolean;
  favorites:Set<string>;

  // Actions
  init: () => Promise<void>;
  setFilter:<K extends keyof EngineerSearchState>(key:K, value:EngineerSearchState[K]) => void;
  resetFilters:() => void;
  fetchPage: (page?:number) => Promise<void>;
  nextPage: () => Promise<void>;
  toggleFavorite: (engineerId:string) => Promise<void>;
}

const DEFAULTS = {
  query:"", categories:[], ratingMin:0, priceRange:[0,500] as [number,number],
  sceOnly:false, availableToday:false, radiusKm:null as number|null,
  location:null as Location, sort:"best" as SortKey, page:1, perPage:20
};

export const useEngineerSearchStore = create<EngineerSearchState>((set, get) => ({
  ...DEFAULTS,
  loading:true,
  items:[], total:0, hasMore:false,
  favorites:new Set<string>(),

  async init(){
    try {
      const favs = await getFavorites(); // returns string[]
      set({ favorites:new Set(favs) });
    } catch {}
    // Optional: set default radius if geolocation is available
    set({ loading:false });
  },

  setFilter(key, value){
    // If changing any filter, reset page to 1
    // @ts-ignore - we allow setting any key from state
    set({ [key]: value, page:1 });
  },

  resetFilters(){
    set({ ...DEFAULTS, items:[], total:0, hasMore:false });
  },

  async fetchPage(pageArg){
    const state = get();
    const page = pageArg ?? state.page;
    set({ loading:true, error:undefined });

    try {
      const res = await searchEngineers({
        q: state.query,
        categories: state.categories,
        ratingMin: state.ratingMin,
        priceMin: state.priceRange[0],
        priceMax: state.priceRange[1],
        sceOnly: state.sceOnly,
        availableToday: state.availableToday,
        origin: state.location ? { lat:state.location.lat, lng:state.location.lng } : null,
        radiusKm: state.radiusKm,
        sort: state.sort,
        page,
        perPage: state.perPage
      });

      // If page===1 replace, else append
      const newItems = page===1 ? res.items : [...state.items, ...res.items];
      set({ items:newItems, total:res.total, hasMore:res.nextPage, page, loading:false });
    } catch (e:any) {
      set({ loading:false, error: e?.message ?? "Failed to search" });
    }
  },

  async nextPage(){
    const { hasMore, page } = get();
    if (!hasMore) return;
    return get().fetchPage(page+1);
  },

  async toggleFavorite(engineerId:string){
    // optimistic
    const favs = new Set(get().favorites);
    const active = favs.has(engineerId);
    if (active) favs.delete(engineerId); else favs.add(engineerId);
    set({ favorites:favs });

    try {
      await toggleFavoriteDb(engineerId, !active);
    } catch {
      // rollback on error
      if (active) favs.add(engineerId); else favs.delete(engineerId);
      set({ favorites:favs });
    }
  }
}));

