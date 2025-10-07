import { create } from "zustand";

export type MessageKind = "text" | "file" | "voice" | "system";

export type ThreadSummary = {
  id: string;
  title: string;
  jobCode?: string | null;
  avatars: string[];
  unreadCount: number;
  starred: boolean;
  archived: boolean;
  updatedAt: string;
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
  createdAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  systemNote?: string | null;
};

export type ThreadFilters = {
  search?: string;
  starred?: boolean;
  archived?: boolean;
  unread?: boolean;
};

type AttachmentDraft = { id: string; name: string; size: number; mime: string; blob?: Blob };

type PresenceState = { typingUserIds: string[]; onlineIds: string[] };

export interface MessagingState {
  threads: ThreadSummary[];
  activeThreadId?: string;
  messagesByThread: Record<string, Message[]>;
  hasMoreByThread: Record<string, boolean>;
  loadingThreads: boolean;
  loadingMessages: boolean;
  inputDrafts: Record<string, string>;
  attachments: Record<string, AttachmentDraft[]>;
  recording: { threadId?: string; state: "idle" | "rec" | "uploading"; blob?: Blob } | null;
  translationEnabled: boolean;
  presence: Record<string, PresenceState>;

  loadThreads: (filters?: ThreadFilters) => Promise<void>;
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

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

type ConsoleError = Error | string | Record<string, unknown>;

const logError = (error: unknown, context: ConsoleError) => {
  if (error instanceof Error) {
    console.error(context, error.message, error);
  } else {
    console.error(context, error);
  }
};

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
      const mock: ThreadSummary[] = [
        { id: "t1", title: "Job NB-1042 – Client X", jobCode: "NB-1042", avatars: [], unreadCount: 2, starred: false, archived: false, updatedAt: new Date().toISOString() },
        { id: "t2", title: "Job NB-1038 – HVAC", jobCode: "NB-1038", avatars: [], unreadCount: 0, starred: true, archived: false, updatedAt: new Date().toISOString() }
      ];
      set({ threads: mock, loadingThreads: false });
      console.log("analytics", "messages_view", { route: "/messages" });
      if (!get().activeThreadId && mock[0]) {
        void get().openThread(mock[0].id);
      }
    } catch (error) {
      set({ loadingThreads: false });
      logError(error, "loadThreads");
    }
  },

  async openThread(threadId) {
    set({ activeThreadId: threadId, loadingMessages: true });
    try {
      const mockMsgs: Message[] = [
        { id: "m1", threadId, mine: false, kind: "text", body: "Hi, site visit today at 3pm?", lang: "en", createdAt: new Date(Date.now() - 3600e3).toISOString(), deliveredAt: new Date().toISOString(), readAt: new Date().toISOString() },
        { id: "m2", threadId, mine: true, kind: "text", body: "Yes, confirmed.", lang: "ar", createdAt: new Date(Date.now() - 1800e3).toISOString(), deliveredAt: new Date().toISOString(), readAt: new Date().toISOString() }
      ];
      set((state) => ({
        messagesByThread: { ...state.messagesByThread, [threadId]: mockMsgs },
        hasMoreByThread: { ...state.hasMoreByThread, [threadId]: false },
        loadingMessages: false
      }));
      const lastMessage = mockMsgs[mockMsgs.length - 1];
      if (lastMessage) {
        void get().markRead(threadId, lastMessage.id);
      }
    } catch (error) {
      set({ loadingMessages: false });
      logError(error, "openThread");
    }
  },

  async fetchOlder(threadId) {
    console.log("fetchOlder", threadId);
  },

  async sendMessage({ threadId, kind, body }) {
    const tempId = `tmp-${Math.random().toString(36).slice(2)}`;
    const optimistic: Message = {
      id: tempId,
      threadId,
      mine: true,
      kind,
      body: kind === "text" ? body ?? "" : undefined,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      messagesByThread: {
        ...state.messagesByThread,
        [threadId]: [...(state.messagesByThread[threadId] ?? []), optimistic]
      },
      inputDrafts: { ...state.inputDrafts, [threadId]: "" },
      attachments: { ...state.attachments, [threadId]: [] }
    }));

    try {
      console.log("analytics", "message_sent", { thread_id: threadId, kind, bytes: body?.length ?? 0 });
    } catch (error) {
      logError(error, "sendMessage");
    }
  },

  async markRead(threadId, lastMessageId) {
    console.log("analytics", "message_read", { thread_id: threadId, last_message_id: lastMessageId });
    set((state) => ({
      threads: state.threads.map((thread) => (thread.id === threadId ? { ...thread, unreadCount: 0 } : thread))
    }));
  },

  async toggleStar(threadId) {
    set((state) => ({
      threads: state.threads.map((thread) => (thread.id === threadId ? { ...thread, starred: !thread.starred } : thread))
    }));
  },

  async archiveThread(threadId) {
    set((state) => ({
      threads: state.threads.map((thread) => (thread.id === threadId ? { ...thread, archived: !thread.archived } : thread))
    }));
  },

  setDraft(threadId, text) {
    set((state) => ({ inputDrafts: { ...state.inputDrafts, [threadId]: text } }));
  },

  queueAttachment(threadId, files) {
    const items: AttachmentDraft[] = files.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      mime: file.type
    }));
    set((state) => ({
      attachments: {
        ...state.attachments,
        [threadId]: [...(state.attachments[threadId] ?? []), ...items]
      }
    }));
  },

  removeAttachment(threadId, name) {
    set((state) => ({
      attachments: {
        ...state.attachments,
        [threadId]: (state.attachments[threadId] ?? []).filter((attachment) => attachment.name !== name)
      }
    }));
  },

  setTyping(threadId, isTyping) {
    console.log("setTyping", threadId, isTyping);
  },

  toggleTranslate(enabled) {
    set({ translationEnabled: enabled });
  }
}));