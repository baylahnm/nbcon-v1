export function VoiceRecordButton({ state, onStart, onStop, onDiscard }:{
  state:"idle"|"rec"|"review"; onStart:()=>void; onStop:()=>void; onDiscard:()=>void;
}) {
  return (
    <div className="flex items-center gap-2">
      {state==="idle" && <button onClick={onStart} className="rounded-lg border border-[var(--border)] px-3 py-1">Record</button>}
      {state==="rec" && (
        <>
          <span className="text-xs text-[var(--danger)]">Recording…</span>
          <button onClick={onStop} className="rounded-lg border border-[var(--border)] px-3 py-1">Stop</button>
        </>
      )}
      {state==="review" && (
        <>
          <button className="rounded-lg border border-[var(--border)] px-3 py-1">Send</button>
          <button onClick={onDiscard} className="rounded-lg border border-[var(--border)] px-3 py-1">Discard</button>
        </>
      )}
    </div>
  );
}

