import { useEffect } from "react";
import { useMessagingStore } from "@/features/messages/store/useMessagingStore";
import { ThreadList } from "@/features/messages/components/ThreadList";
import { ThreadHeader } from "@/features/messages/components/ThreadHeader";
import { ChatList } from "@/features/messages/components/ChatList";
import { ChatInput } from "@/features/messages/components/ChatInput";
import { AttachmentPreviewStrip } from "@/features/messages/components/AttachmentPreviewStrip";
import { TranslationToggle } from "@/features/messages/components/TranslationToggle";

export default function MessagesIndex() {
  const {
    threads, activeThreadId, loadThreads, openThread,
    messagesByThread, inputDrafts, setDraft, sendMessage,
    attachments, queueAttachment, removeAttachment,
    translationEnabled, toggleTranslate
  } = useMessagingStore();

  useEffect(()=>{ loadThreads(); }, [loadThreads]);

  const msgs = activeThreadId ? (messagesByThread[activeThreadId] ?? []) : [];

  return (
    <main className="container mx-auto grid gap-4 px-4 py-6 text-[var(--fg)] md:grid-cols-[minmax(260px,360px)_1fr]">
      <ThreadList
        items={threads.filter(t=>!t.archived)}
        activeId={activeThreadId}
        onSelect={openThread}
        header={
          <div className="flex items-center gap-2">
            <input className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" placeholder="Search messages, jobs, files…" />
            <button className="rounded-lg border border-[var(--border)] px-3 py-1">New Thread</button>
          </div>
        }
      />

      <section className="flex h-[calc(100vh-170px)] flex-col">
        <ThreadHeader
          title={threads.find(t=>t.id===activeThreadId)?.title ?? "Messages"}
          subtitle={threads.find(t=>t.id===activeThreadId)?.jobCode ?? ""}
          onCall={()=>location.assign(`/call/${activeThreadId ?? ""}`)}
          onFiles={()=>location.assign(`/job/${threads.find(t=>t.id===activeThreadId)?.jobCode ?? ""}/files`)}
          onMore={()=>{}}
        />

        <div className="mt-3 flex-1">
          <ChatList items={msgs} translationEnabled={translationEnabled} onEndReach={()=>{}} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <TranslationToggle enabled={translationEnabled} onToggle={toggleTranslate} />
        </div>

        {activeThreadId && (
          <div className="mt-2">
            <AttachmentPreviewStrip items={attachments[activeThreadId] ?? []} onRemove={(name)=>removeAttachment(activeThreadId, name)} />
            <ChatInput
              value={inputDrafts[activeThreadId] ?? ""}
              onChange={(v)=>setDraft(activeThreadId, v)}
              onAttach={(files)=>files && queueAttachment(activeThreadId, Array.from(files))}
              onRecord={()=>console.log("voice_record_start")}
              onSend={()=>sendMessage({ threadId:activeThreadId, kind:"text", body:(inputDrafts[activeThreadId] ?? "").trim() })}
              canSend={!!(inputDrafts[activeThreadId]?.trim())}
            />
          </div>
        )}
      </section>
    </main>
  );
}

