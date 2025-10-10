import { Message } from "../store/useMessagingStore";
import { MessageBubble } from "./MessageBubble";
import { DateDivider } from "./DateDivider";

export function ChatList({
  items, onEndReach, translationEnabled
}:{ items:Message[]; onEndReach?:()=>void; translationEnabled:boolean }) {
  // Group simple date divider by day (client-side)
  let lastDate = "";
  return (
    <div role="log" aria-live="polite" className="flex h-full flex-col overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex-1 space-y-3">
        {items.map((m) => {
          const d = m.createdAt.substring(0,10);
          const divider = d !== lastDate ? <DateDivider key={"d-"+m.id} date={d} /> : null;
          lastDate = d;
          return (
            <div key={m.id}>
              {divider}
              <MessageBubble msg={m} translationEnabled={translationEnabled} />
            </div>
          );
        })}
      </div>
      <button className="mt-3 self-center text-xs opacity-60" onClick={onEndReach}>Load older</button>
    </div>
  );
}


