export function ChatInput({
  value, onChange, onSend, onAttach, onRecord, canSend=true
}:{ value:string; onChange:(v:string)=>void; onSend:()=>void; onAttach:(files:FileList|null)=>void; onRecord:()=>void; canSend?:boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="flex items-center gap-2">
        <label className="rounded-lg border border-[var(--border)] px-3 py-1 cursor-pointer">
          Attach<input aria-label="Attach" type="file" multiple className="hidden" onChange={e=>onAttach(e.target.files)} />
        </label>
        <button onClick={onRecord} className="rounded-lg border border-[var(--border)] px-3 py-1">Voice</button>
        <textarea
          aria-label="Write a message… Enter=Send · Shift+Enter=New line"
          className="min-h-[40px] flex-1 resize-none bg-transparent p-2 outline-none"
          rows={1} value={value}
          onChange={(e)=>onChange(e.target.value)}
          onKeyDown={(e)=>{ if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder="Write a message…"
        />
        <button disabled={!canSend} onClick={onSend}
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2 font-semibold text-black disabled:opacity-50">Send</button>
      </div>
    </div>
  );
}

