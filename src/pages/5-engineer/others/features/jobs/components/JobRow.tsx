import { StatusBadge } from "./StatusBadge";
import { EscrowBadge } from "./EscrowBadge";
import { ProgressPill } from "./ProgressPill";
import type { JobListItem } from "../store/useJobsStore";

export function JobRow({
  job, role, selected, onToggle, onAction
}: {
  job: JobListItem; role:"client"|"engineer"|"enterprise";
  selected:boolean; onToggle:()=>void;
  onAction:(action: "open"|"invite"|"escrow"|"duplicate"|"close"|"archive"|"withdraw")=>void;
}) {
  return (
    <article
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] p-4"
      aria-label={`${job.code} ${job.title}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            aria-label="Select row"
            checked={selected}
            onChange={onToggle}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <div>
            <div className="font-semibold">{job.code} — {job.title}</div>
            <div className="text-xs opacity-70">{job.client_name ?? ""}{job.engineer_name ? ` • ${job.engineer_name}` : ""}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          <EscrowBadge state={job.escrow_state ?? null} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-md border border-[var(--border)] px-2 py-0.5">{job.category}</span>
        <ProgressPill completed={job.milestones_done} total={job.milestones_total} />
        <span className="rounded-md border border-[var(--border)] px-2 py-0.5">Bids: {job.bids_count}</span>
        <span className="rounded-md border border-[var(--border)] px-2 py-0.5">
          Unread: {job.unread_msgs}
        </span>
        {job.budget_max !== null && (
          <span className="rounded-md border border-[var(--border)] px-2 py-0.5">
            Budget: {job.currency} {job.budget_min?.toLocaleString()}–{job.budget_max?.toLocaleString()}
          </span>
        )}
        {job.next_due && (
          <span className="rounded-md border border-[var(--border)] px-2 py-0.5">
            Due: {job.next_due}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("open")}>Open</button>
        {role!=="engineer" && (
          <>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("invite")}>Invite</button>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("escrow")}>Escrow</button>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("duplicate")}>Duplicate</button>
            <button className="rounded-lg bg-[var(--surface)] px-3 py-1 border border-[var(--border)]" onClick={()=>onAction("close")}>Close</button>
            <button className="rounded-lg bg-[var(--color-primary)] text-black px-3 py-1" onClick={()=>onAction("archive")}>Archive</button>
          </>
        )}
        {role==="engineer" && (
          <>
            <button className="rounded-lg border border-[var(--border)] px-3 py-1" onClick={()=>onAction("withdraw")}>Withdraw Bid</button>
          </>
        )}
      </div>
    </article>
  );
}

