export function VerificationCard({ steps, onStart }:{ steps:string[]; onStart:()=>void }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="font-semibold mb-2">Complete your verification</div>
      <ol className="list-decimal ml-5 space-y-1 text-sm opacity-90">
        {steps.map((s,i)=>(<li key={i}>{s}</li>))}
      </ol>
      <button onClick={onStart} className="mt-3 bg-[var(--color-primary)] text-black rounded-xl px-4 py-1 font-semibold verification-start-btn">Start</button>
    </div>
  );
}
