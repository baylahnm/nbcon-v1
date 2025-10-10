export function ExportButtons({ onCSV, onPDF }:{ onCSV:()=>void; onPDF:()=>void }) {
  return (
    <div className="flex gap-2">
      <button onClick={onCSV} className="rounded-lg border border-[var(--border)] px-3 py-1">Export CSV</button>
      <button onClick={onPDF} className="rounded-lg border border-[var(--border)] px-3 py-1">Export PDF</button>
    </div>
  );
}


