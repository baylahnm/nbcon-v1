export function DataTable({ columns, rows, onRowClick }:{
  columns:{ key:string; label:string }[]; rows:Record<string, any>[]; onRowClick?:(row:any)=>void;
}) {
  return (
    <div className="overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-[var(--bg)]">
          <tr>
            {columns.map(c=> <th key={c.key} className="px-3 py-2 text-left font-medium">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows?.length ? rows.map((r,i)=>(
            <tr key={i} className="border-t border-[var(--border)] hover:bg-[var(--bg)]"
                onClick={()=>onRowClick?.(r)}>
              {columns.map(c=> <td key={c.key} className="px-3 py-2">{String(r[c.key] ?? "")}</td>)}
            </tr>
          )) : (
            <tr><td className="px-3 py-3 opacity-70" colSpan={columns.length}>No data.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


