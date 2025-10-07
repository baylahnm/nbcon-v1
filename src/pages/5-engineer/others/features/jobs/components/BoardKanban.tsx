import type { JobListItem, JobStatus } from "../store/useJobsStore";
import { JobRow } from "./JobRow";

const COLUMNS: { key: JobStatus; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "open", label: "Open" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "in_review", label: "In Review" },
  { key: "delivered", label: "Delivered" },
  { key: "closed", label: "Closed" },
  { key: "canceled", label: "Canceled" },
];

export function BoardKanban({
  items, role, selected, onToggle, onAction
}:{
  items: JobListItem[];
  role:"client"|"engineer"|"enterprise";
  selected:Set<string>;
  onToggle:(id:string)=>void;
  onAction:(id:string, action:Parameters<React.ComponentProps<typeof JobRow>["onAction"]>[0])=>void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
      {COLUMNS.map(col => {
        const colItems = items.filter(i => i.status === col.key);
        return (
          <section key={col.key}
            role="list"
            aria-label={`Column ${col.label}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <header className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{col.label}</h3>
              <span className="text-xs opacity-70">{colItems.length}</span>
            </header>
            <div className="space-y-3">
              {colItems.length ? colItems.map(j =>
                <div role="listitem" key={j.id}>
                  <JobRow
                    job={j}
                    role={role}
                    selected={selected.has(j.id)}
                    onToggle={()=>onToggle(j.id)}
                    onAction={(a)=>onAction(j.id, a)}
                  />
                </div>
              ) : <div className="text-sm opacity-60">No cards</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

