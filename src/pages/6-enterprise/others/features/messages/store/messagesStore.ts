import { create } from "zustand";

export type ThreadId = string;
export type RangeKey = "D" | "W" | "M";

export type Participant = {
  id: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: "client" | "engineer" | "admin" | "enterprise";
};

export type Thread = {
  id: ThreadId;
  title: string; // job or user
  jobCode?: string; // e.g., NB-1042
  lastSnippet?: string;
  lastAt?: string; // ISO timestamp
  unreadCount?: number;
  pinned?: boolean;
  starred?: boolean;
  archived?: boolean;
  participants: Participant[];
};

export type MessageKind = "text" | "image" | "file" | "voice" | "system";

export type Message = {
  id: string;
  threadId: ThreadId;
  authorId: string;
  kind: MessageKind;
  body?: string;
  files?: { id: string; name: string; url?: string; size?: number }[];
  audio?: { url?: string; durationMs?: number };
  quotedId?: string;
  createdAt: string; // ISO timestamp
  readBy?: string[]; // userIds
  reactions?: { emoji: string; userId: string }[];
};

type RecordingState = "idle" | "recording" | "processing";

export type Presence = {
  typing: Record<ThreadId, boolean>;
  online: Record<string, boolean>; // userId → online
};

export type MessagesState = {
  threads: Thread[];
  activeThreadId: ThreadId | null;
  messagesByThread: Record<ThreadId, Message[]>;
  hasMoreByThread: Record<ThreadId, boolean>;
  loadingThreads: boolean;
  loadingMessages: Record<ThreadId, boolean>;
  inputDrafts: Record<ThreadId, string>;
  attachments: Record<ThreadId, { id: string; name: string; size?: number; progress?: number }[]>;
  recording: { state: RecordingState };
  translationEnabled: boolean;
  hijriEnabled: boolean;
  presence: Presence;

  // actions
  loadThreads: (filters?: { unread?: boolean; starred?: boolean; archived?: boolean }) => Promise<void>;
  openThread: (id: ThreadId) => Promise<void>;
  fetchOlder: (id: ThreadId) => Promise<void>;
  sendMessage: (input: { threadId: ThreadId; kind: MessageKind; body?: string; files?: File[]; audio?: Blob; quotedId?: string }) => Promise<void>;
  markRead: (threadId: ThreadId, lastMessageId: string) => Promise<void>;
  toggleStar: (threadId: ThreadId) => Promise<void>;
  archiveThread: (threadId: ThreadId) => Promise<void>;
  setTyping: (threadId: ThreadId, value: boolean) => void;
  toggleTranslate: (value: boolean) => void;
  toggleHijri: (value: boolean) => void;
  setDraft: (threadId: ThreadId, value: string) => void;
  addReaction: (threadId: ThreadId, messageId: string, emoji: string, userId: string) => void;
};

// ----- Stubbed RPCs (to wire to Supabase later) -----
async function rpcCreateThread(): Promise<void> { /* no-op stub */ }
async function rpcSendMessage(): Promise<void> { /* no-op stub */ }
async function rpcMarkRead(): Promise<void> { /* no-op stub */ }
async function rpcSearchMessages(): Promise<void> { /* no-op stub */ }
async function rpcSecureFileToken(): Promise<void> { /* no-op stub */ }
async function rpcTranscribe(): Promise<void> { /* no-op stub */ }
async function rpcTranslate(): Promise<void> { /* no-op stub */ }

export const useMessagesStore = create<MessagesState>((set, get) => ({
  threads: [],
  activeThreadId: null,
  messagesByThread: {},
  hasMoreByThread: {},
  loadingThreads: false,
  loadingMessages: {},
  inputDrafts: {},
  attachments: {},
  recording: { state: "idle" },
  translationEnabled: false,
  hijriEnabled: false,
  presence: { typing: {}, online: {} },

  loadThreads: async (filters) => {
    set({ loadingThreads: true });
    // stubbed sample threads
    const sampleThreads: Thread[] = [
      { id: "t1", title: "NB-1042 · Site Inspection", jobCode: "NB-1042", lastSnippet: "Please share the site photos.", lastAt: new Date().toISOString(), unreadCount: 2, pinned: true, participants: [] },
      { id: "t2", title: "Mohammed Al-Qahtani", jobCode: "NB-1021", lastSnippet: "Invoice approved.", lastAt: new Date(Date.now() - 3600_000).toISOString(), unreadCount: 0, participants: [] },
    ];
    // basic filters
    let filtered = sampleThreads;
    if (filters?.unread) filtered = filtered.filter(t => (t.unreadCount || 0) > 0);
    if (filters?.starred) filtered = filtered.filter(t => !!t.starred);
    if (filters?.archived) filtered = filtered.filter(t => !!t.archived);
    set({ threads: filtered, loadingThreads: false });
  },

  openThread: async (id) => {
    set({ activeThreadId: id });
    const map = get().messagesByThread;
    if (!map[id]) {
      set(state => ({ loadingMessages: { ...state.loadingMessages, [id]: true } }));
      // stub messages
      const sample: Message[] = [
        { id: "m1", threadId: id, authorId: "me", kind: "text", body: "Salaam!", createdAt: new Date(Date.now() - 86_400_000).toISOString(), readBy: [] },
        { id: "m2", threadId: id, authorId: "other", kind: "text", body: "وعليكم السلام", createdAt: new Date(Date.now() - 83_400_000).toISOString(), readBy: [] },
      ];
      set(state => ({
        messagesByThread: { ...state.messagesByThread, [id]: sample },
        hasMoreByThread: { ...state.hasMoreByThread, [id]: true },
        loadingMessages: { ...state.loadingMessages, [id]: false },
      }));
    }
  },

  fetchOlder: async (id) => {
    const older: Message[] = [
      { id: `m_${Math.random().toString(36).slice(2)}`, threadId: id, authorId: "other", kind: "text", body: "Older message", createdAt: new Date(Date.now() - 172_800_000).toISOString(), readBy: [] },
    ];
    set(state => ({
      messagesByThread: { ...state.messagesByThread, [id]: [...older, ...(state.messagesByThread[id] || [])] },
      hasMoreByThread: { ...state.hasMoreByThread, [id]: false },
    }));
  },

  sendMessage: async ({ threadId, kind, body, files, audio, quotedId }) => {
    await rpcSendMessage();
    const msg: Message = {
      id: `m_${Math.random().toString(36).slice(2)}`,
      threadId,
      authorId: "me",
      kind,
      body,
      quotedId,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      messagesByThread: { ...state.messagesByThread, [threadId]: [...(state.messagesByThread[threadId] || []), msg] },
      inputDrafts: { ...state.inputDrafts, [threadId]: "" },
    }));
  },

  markRead: async (threadId, lastMessageId) => {
    await rpcMarkRead();
    // clear unread count locally
    set(state => ({
      threads: state.threads.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t)
    }));
  },

  toggleStar: async (threadId) => {
    set(state => ({
      threads: state.threads.map(t => t.id === threadId ? { ...t, starred: !t.starred } : t)
    }));
  },

  archiveThread: async (threadId) => {
    set(state => ({
      threads: state.threads.map(t => t.id === threadId ? { ...t, archived: !t.archived } : t)
    }));
  },

  setTyping: (threadId, value) => {
    set(state => ({ presence: { ...state.presence, typing: { ...state.presence.typing, [threadId]: value } } }));
  },

  toggleTranslate: (value) => set({ translationEnabled: value }),
  toggleHijri: (value) => set({ hijriEnabled: value }),

  setDraft: (threadId, value) => set(state => ({ inputDrafts: { ...state.inputDrafts, [threadId]: value } })),

  addReaction: (threadId, messageId, emoji, userId) => set(state => {
    const msgs = state.messagesByThread[threadId] || [];
    const updated = msgs.map(m => m.id === messageId
      ? { ...m, reactions: [...(m.reactions || []), { emoji, userId }] }
      : m
    );
    return { messagesByThread: { ...state.messagesByThread, [threadId]: updated } };
  }),
}));


