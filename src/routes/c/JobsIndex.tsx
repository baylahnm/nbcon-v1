import { useEffect } from "react";
import { useJobsStore } from "@/features/jobs/store/useJobsStore";
import { FilterBar } from "@/features/jobs/components/FilterBar";
import { BulkBar } from "@/features/jobs/components/BulkBar";
import { ListBoardToggle } from "@/features/jobs/components/ListBoardToggle";
import { JobRow } from "@/features/jobs/components/JobRow";
import { SkeletonRow } from "@/features/jobs/components/SkeletonRow";
import { EmptyState } from "@/features/jobs/components/EmptyState";
import { ErrorState } from "@/features/jobs/components/ErrorState";
import { BoardKanban } from "@/features/jobs/components/BoardKanban";

export default function ClientJobs() {
  const {
    role, load, filters, setFilter, view, setView, sort, setSort,
    list, loading, error, selection, toggleSelect, clearSelection, bulkAction, nextPage, next
  } = useJobsStore();

  useEffect(()=>{ load("client"); }, [load]);

  const onApply = () => load("client");

  return (
    <main className="container mx-auto px-4 py-6 text-[var(--fg)]">
      <a href="#content" className="sr-only focus:not-sr-only">Skip to content</a>
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs / Projects</h1>
        <div className="flex gap-2">
          <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 font-semibold text-black">Create Job</button>
          <button className="rounded-xl border border-[var(--border)] px-4 py-2">Templates</button>
        </div>
      </header>

      <FilterBar filters={filters} onChange={setFilter} onApply={onApply} role="client" />

      <div className="mt-3 flex items-center justify-between">
        <ListBoardToggle view={view} onChange={setView} />
        <select
          aria-label="Sort"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
          value={sort}
          onChange={(e)=>setSort(e.target.value as any)}
        >
          <option value="recent">Recent</option>
          <option value="due_asc">Due soon</option>
          <option value="budget_desc">Budget (High→Low)</option>
          <option value="quotes_desc">Most quotes</option>
          <option value="unread_desc">Most unread</option>
        </select>
      </div>

      <BulkBar
        role="client"
        selectedCount={selection.size}
        onAction={bulkAction}
        onClear={clearSelection}
      />

      <section id="content" className="mt-4">
        {loading && !list.length ? (
          <div className="grid gap-3">{Array.from({length:8}).map((_,i)=><SkeletonRow key={i}/>)}</div>
        ) : error ? (
          <ErrorState onRetry={()=>load("client")} />
        ) : !list.length ? (
          <EmptyState
            message="No jobs found. Start by creating your first job."
            action={<button className="mt-3 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-black">Create Job</button>}
          />
        ) : view==="list" ? (
          <div className="grid gap-3">
            {list.map(j => (
              <JobRow
                key={j.id}
                job={j}
                role="client"
                selected={selection.has(j.id)}
                onToggle={()=>toggleSelect(j.id)}
                onAction={(a)=>{
                  console.log("job_row_action",{ action:a, job_id:j.id, role:"client", route:"/c/jobs" });
                }}
              />
            ))}
          </div>
        ) : (
          <BoardKanban
            items={list}
            role="client"
            selected={selection}
            onToggle={toggleSelect}
            onAction={(id, action)=>console.log("job_row_action",{ action, job_id:id, role:"client", route:"/c/jobs" })}
          />
        )}

        {nextPage && !loading && (
          <div className="mt-4 flex justify-center">
            <button onClick={next} className="rounded-lg border border-[var(--border)] px-4 py-2">Load more</button>
          </div>
        )}
      </section>
    </main>
  );
}

