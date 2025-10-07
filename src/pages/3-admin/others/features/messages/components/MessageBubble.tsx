import { Message } from "../store/useMessagingStore";

export function MessageBubble({ msg, translationEnabled }:{ msg:Message; translationEnabled:boolean }) {
  const mine = msg.mine;
  const tone = mine ? "bg-primary text-primary-foreground" : "bg-[var(--bg)]";
  return (
    <div className={`max-w-[80%] rounded-2xl border border-[var(--border)] ${tone} px-3 py-2 ${mine ? "ml-auto" : "mr-auto"}`}>
      {msg.kind==="text" && (
        <>
          <div className="whitespace-pre-wrap text-sm">
            {translationEnabled && msg.lang==="ar" ? /* example */ msg.body : msg.body}
          </div>
          {msg.translatedFrom && <div className="mt-1 text-[10px] opacity-70">Translated from {msg.translatedFrom}</div>}
        </>
      )}
      {msg.kind==="file" && msg.fileMeta && (
        <div className="text-sm">
          <div className="font-medium">{msg.fileMeta.name}</div>
          <a className="underline" href={msg.fileMeta.url} target="_blank" rel="noreferrer">Open</a>
          {msg.fileMeta.confidential && <span className="ml-2 rounded-full border border-[var(--warning)] px-2 py-0.5 text-[10px] text-[var(--warning)]">No download</span>}
        </div>
      )}
      {msg.kind==="voice" && msg.audioMeta && (
        <audio controls src={msg.audioMeta.url} className="w-full" />
      )}
      {msg.kind==="system" && <div className="text-xs opacity-70">{msg.systemNote}</div>}
      <div className="mt-1 text-right text-[10px] opacity-60">
        {msg.readAt ? "✓✓" : msg.deliveredAt ? "✓" : "•"} {/* read receipts */}
      </div>
    </div>
  );
}

