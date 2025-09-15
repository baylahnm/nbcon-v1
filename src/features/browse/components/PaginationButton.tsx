export function PaginationButton({ hasMore, onLoadMore }:{ hasMore:boolean; onLoadMore:()=>void }){
  if (!hasMore) return null;
  return (
    <div className="flex justify-center mt-4">
      <button onClick={onLoadMore}
        className="rounded-xl px-4 py-2 font-semibold border border-[var(--border)] bg-[var(--bg)]">
        Load more
      </button>
    </div>
  );
}

