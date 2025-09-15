export function ReportActions({
  onSave, onShare, onExportCsv, onExportPdf
}:{ onSave:()=>void; onShare:()=>void; onExportCsv:()=>void; onExportPdf:()=>void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={onSave} className="rounded-lg border border-[var(--border)] px-3 py-1">Save Report</button>
      <button onClick={onShare} className="rounded-lg border border-[var(--border)] px-3 py-1">Share</button>
      <button onClick={onExportCsv} className="rounded-lg border border-[var(--border)] px-3 py-1">Export CSV</button>
      <button onClick={onExportPdf} className="rounded-lg bg-[var(--color-primary)] px-3 py-1 font-semibold text-black">Export PDF</button>
    </div>
  );
}

