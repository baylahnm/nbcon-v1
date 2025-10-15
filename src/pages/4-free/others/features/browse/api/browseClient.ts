// Replace these mocks with Supabase RPCs:
//  - rpc('search_engineers', { params })
//  - select favorites from 'favorites' table
//  - insert/delete favorite rows for toggling

import type { EngineerRow } from "../store/useEngineerSearchStore";

type SearchParams = {
  q:string; categories:string[]; ratingMin:number;
  priceMin:number; priceMax:number; sceOnly:boolean; availableToday:boolean;
  origin:{lat:number; lng:number} | null; radiusKm:number|null;
  sort:"best"|"nearest"|"rating_desc"|"price_asc"|"price_desc";
  page:number; perPage:number;
};

export async function searchEngineers(params:SearchParams): Promise<{items:EngineerRow[]; total:number; nextPage:boolean}> {
  // MOCK DATA for UI dev
  const all:EngineerRow[] = Array.from({length:48}).map((_,i)=>({
    id:`eng-${i+1}`,
    name:`Engineer ${i+1}`,
    avatar:null,
    rating: 3.8 + ((i%12)/10),
    reviewsCount: 20 + (i%50),
    rateHour: 150 + (i%8)*25,
    distanceKm: params.origin ? (i%15)+1 : null,
    sceVerified: i%3!==0,
    online: i%2===0,
    specialties: i%2===0 ? ["structuralDesign","mepEngineering"] : ["architecturalDesign","bimModeling"],
    company: i%5===0 ? "nbcon Partners" : null
  }));

  // pretend filters happen server side; return a page
  const start = (params.page-1)*params.perPage;
  const items = all.slice(start, start+params.perPage);
  return { items, total: all.length, nextPage: start+params.perPage < all.length };
}

export async function getFavorites(): Promise<string[]> {
  // mock — fetch from Supabase: select engineer_id from favorites where client_id=auth.uid()
  return ["eng-2","eng-5","eng-21"];
}

export async function toggleFavoriteDb(engineerId:string, makeActive:boolean): Promise<void> {
  // mock — upsert or delete in 'favorites'
  console.log("favorite", engineerId, makeActive);
}

