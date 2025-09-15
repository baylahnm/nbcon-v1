export function ChartA11yToggle({ showTable, onToggle }:{ showTable:boolean; onToggle:(v:boolean)=>void }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs opacity-80">
      <input type="checkbox" checked={showTable} onChange={(e)=>onToggle(e.target.checked)} />
      <span>Data table</span>
    </label>
  );
}

