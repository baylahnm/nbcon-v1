export function TranslationToggle({ enabled, onToggle }:{ enabled:boolean; onToggle:(v:boolean)=>void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={enabled} onChange={(e)=>onToggle(e.target.checked)} />
      <span>Translate</span>
    </label>
  );
}

