import { create } from "zustand";

export type MessageKind = "text" | "file" | "voice" | "system";

export type ThreadSummary = {
  id: string;
  title: string;
  jobCode?: string | null;
  avatars: string[]; // urls or initials; render however you like
  unreadCount: number;
  starred: boolean;
  archived: boolean;
  updatedAt: string; // ISO
};

export type Message = {
  id: string;
  threadId: string;
  mine: boolean;
  kind: MessageKind;
  body?: string | null;
  fileMeta?: { url: string; name: string; mime: string; size: number; confidential?: boolean } | null;
  audioMeta?: { url: string; durMs: number } | null;
  lang?: "en" | "ar" | null;
  translatedFrom?: "en" | "ar" | null;
  createdAt: string;       // ISO
  deliveredAt?: string | null;
  readAt?: string | null;
  systemNote?: string | null;
};

export interface MessagingState {
  threads: ThreadSummary[];
  activeThreadId?: string;
  messagesByThread: Record<string, Message[]>;
  hasMoreByThread: Record<string, boolean>;
  loadingThreads: boolean;
  loadingMessages: boolean;
  inputDrafts: Record<string, string>;
  attachments: Record<string, { id: string; name: string; size: number; mime: string; blob?: Blob }[]>;
  recording: { threadId?: string; state: "idle" | "rec" | "uploading"; blob?: Blob } | null;
  translationEnabled: boolean;
  presence: Record<string, { typingUserIds: string[]; onlineIds: string[] }>;

  loadThreads: (filters?: any) => Promise<void>;
  openThread: (threadId: string) => Promise<void>;
  fetchOlder: (threadId: string) => Promise<void>;
  sendMessage: (args: { threadId: string; kind: MessageKind; body?: string; files?: File[]; audioBlob?: Blob }) => Promise<void>;
  markRead: (threadId: string, lastMessageId: string) => Promise<void>;
  toggleStar: (threadId: string) => Promise<void>;
  archiveThread: (threadId: string) => Promise<void>;
  setDraft: (threadId: string, text: string) => void;
  queueAttachment: (threadId: string, files: File[]) => void;
  removeAttachment: (threadId: string, name: string) => void;
  setTyping: (threadId: string, isTyping: boolean) => void;
  toggleTranslate: (enabled: boolean) => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  threads: [],
  messagesByThread: {},
  hasMoreByThread: {},
  loadingThreads: true,
  loadingMessages: false,
  inputDrafts: {},
  attachments: {},
  recording: null,
  translationEnabled: false,
  presence: {},

  async loadThreads() {
    set({ loadingThreads: true });
    try {
      // TODO: wire to supabase.rpc('rpc_search_messages', {...}) OR select from 'threads'
      const mock: ThreadSummary[] = [
        { id:"t1", title:"Job NB-1042 · Client X", jobCode:"NB-1042", avatars:[], unreadCount:2, starred:false, archived:false, updatedAt:new Date().toISOString() },
        { id:"t2", title:"Job NB-1038 · HVAC", jobCode:"NB-1038", avatars:[], unreadCount:0, starred:true, archived:false, updatedAt:new Date().toISOString() }
      ];
      set({ threads: mock, loadingThreads: false });
      console.log("analytics","messages_view",{ route:"/messages" });
      // Auto-open first thread for convenience
      if (!get().activeThreadId && mock[0]) get().openThread(mock[0].id);
    } catch (e:any) {
      set({ loadingThreads: false });
      console.error(e);
    }
  },

  async openThread(threadId) {
    set({ activeThreadId: threadId, loadingMessages: true });
    try {
      // TODO: wire to `select * from messages where thread_id=:id order by created_at desc limit 30`
      const mockMsgs: Message[] = [
        { id:"m1", threadId, mine:false, kind:"text", body:"Hi, site visit today at 3pm?", lang:"en", createdAt: new Date(Date.now()-3600e3).toISOString(), deliveredAt:new Date().toISOString(), readAt:new Date().toISOString() },
        { id:"m2", threadId, mine:true, kind:"text", body:"Yes, confirmed. سأتواجد هناك.", lang:"ar", createdAt: new Date(Date.now()-1800e3).toISOString(), deliveredAt:new Date().toISOString(), readAt:new Date().toISOString() }
      ];
      set(s => ({
        messagesByThread: { ...s.messagesByThread, [threadId]: mockMsgs },
        hasMoreByThread: { ...s.hasMoreByThread, [threadId]: false },
        loadingMessages: false
      }));
      get().markRead(threadId, mockMsgs[mockMsgs.length-1].id);
    } catch (e:any) {
      set({ loadingMessages: false });
      console.error(e);
    }
  },

  async fetchOlder(threadId) {
    // TODO: page older messages and prepend
    console.log("fetchOlder", threadId);
  },

  async sendMessage({ threadId, kind, body, files, audioBlob }) {
    const tempId = "tmp-"+Math.random().toString(36).slice(2);
    const optimistic: Message = {
      id: tempId, threadId, mine:true, kind,
      body: kind==="text" ? (body ?? "") : undefined,
      createdAt: new Date().toISOString()
    };
    set(s => ({
      messagesByThread: { ...s.messagesByThread, [threadId]: [...(s.messagesByThread[threadId] ?? []), optimistic] },
      inputDrafts: { ...s.inputDrafts, [threadId]: "" },
      attachments: { ...s.attachments, [threadId]: [] }
    }));
    try {
      // TODO: supabase.rpc('rpc_send_message', { ... }) + upload to Storage if files/audio
      console.log("analytics","message_sent",{ thread_id:threadId, kind, bytes: (body?.length ?? 0), attachments: files?.length ?? 0 });
    } catch (e:any) {
      console.log("analytics","message_failed",{ thread_id:threadId, reason:e?.message });
    }
  },

  async markRead(threadId, lastMessageId) {
    // TODO: supabase.rpc('rpc_mark_read', { thread_id:threadId, last_message_id:lastMessageId })
    console.log("analytics","message_read",{ thread_id:threadId, last_message_id:lastMessageId });
    set(s => ({
      threads: s.threads.map(t => t.id===threadId ? { ...t, unreadCount: 0 } : t )
    }));
  },

  async toggleStar(threadId) {
    // TODO: update starred_by on threads
    set(s => ({ threads: s.threads.map(t => t.id===threadId ? { ...t, starred: !t.starred } : t) }));
  },

  async archiveThread(threadId) {
    // TODO: update archived_by on threads
    set(s => ({ threads: s.threads.map(t => t.id===threadId ? { ...t, archived: !t.archived } : t) }));
  },

  setDraft(threadId, text) { set(s => ({ inputDrafts: { ...s.inputDrafts, [threadId]: text } })); },

  queueAttachment(threadId, files) {
    const items = files.map(f => ({ id: (crypto as any).randomUUID?.() ?? String(Math.random()), name: f.name, size: f.size, mime: f.type }));
    set(s => ({ attachments: { ...s.attachments, [threadId]: [ ...(s.attachments[threadId] ?? []), ...items ] }}));
  },

  removeAttachment(threadId, name) {
    set(s => ({ attachments: { ...s.attachments, [threadId]: (s.attachments[threadId] ?? []).filter(a => a.name !== name) }}));
  },

  setTyping(threadId, isTyping) {
    // TODO: Realtime presence
    console.log("setTyping", threadId, isTyping);
  },

  toggleTranslate(enabled) { set({ translationEnabled: enabled }); }
}));

