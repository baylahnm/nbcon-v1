import type { RealtimeChannel } from '@supabase/supabase-js';

import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';
import {
  SERVICE_MODE_CONFIG,
  SERVICE_MODES,
  type ServiceMode,
  type ServiceModeConfig,
} from '@/pages/4-free/others/features/ai/services/config';

type CoreMode = 'chat' | 'research' | 'image' | 'agent' | 'connectors';
export type AiMode = CoreMode | ServiceMode;

const DEFAULT_HINT = '';

export interface Thread {
  id: string;
  title: string;
  mode: AiMode;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  isArchived: boolean;
  messageCount: number;
  lastMessage?: string;
}

export interface Message {
  id: string;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: AiMode;
  attachments?: Attachment[];
  citations?: Citation[];
  images?: GeneratedImage[];
  isStreaming?: boolean;
  error?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  isConfidential: boolean;
  progress?: number;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
  createdAt: string;
}

export interface ComposerState {
  text: string;
  files: Attachment[];
  voice?: {
    isRecording: boolean;
    duration: number;
    transcript?: string;
  };
  lang: 'en' | 'ar';
  translate: boolean;
  hint: string;
}

export interface Settings {
  rtl: boolean;
  hijri: boolean;
  temperature: number;
  voiceEnabled: boolean;
  autoTranslate: boolean;
}

interface AiState {
  // Threads and messages
  threads: Thread[];
  activeThreadId: string | null;
  messagesByThread: Record<string, Message[]>;

  // UI state
  mode: AiMode;
  isGenerating: boolean;
  drawerOpen: boolean;
  isHydrated: boolean;
  isLoading: boolean;

  // Service modes
  availableServiceModes: ServiceMode[];
  serviceModes: Record<ServiceMode, ServiceModeConfig>;
  activeServiceMode: ServiceMode | null;

  // Composer state
  composer: ComposerState;

  // Settings
  settings: Settings;

  // Real-time
  realtimeChannel: RealtimeChannel | null;

  // Actions
  hydrateFromSupabase: () => Promise<void>;
  newThread: (mode?: AiMode) => Promise<void>;
  setActiveThread: (threadId: string) => Promise<void>;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  stopGeneration: () => void;

  // Mode management
  switchMode: (mode: AiMode) => void;
  activateServiceMode: (mode: ServiceMode) => void;

  // Composer actions
  setComposerText: (text: string) => void;
  attachFile: (file: Attachment) => void;
  removeAttachment: (attachmentId: string) => void;
  startVoiceRecording: () => void;
  stopVoiceRecording: () => void;
  setVoiceTranscript: (transcript: string) => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  toggleTranslate: () => void;

  // Settings
  toggleRTL: () => void;
  toggleHijri: () => void;
  setTemperature: (temperature: number) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setAutoTranslate: (enabled: boolean) => void;

  // Thread management
  starThread: (threadId: string) => void;
  archiveThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;

  // Drawer
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;

  // Utility
  getActiveThread: () => Thread | null;
  getActiveMessages: () => Message[];
  clearComposer: () => void;

  // Real-time
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

// Helper function to map DB conversation to Thread
const mapConversationToThread = (conv: any): Thread => ({
  id: conv.id,
  title: conv.conversation_title || 'New Conversation',
  mode: (conv.ai_service_mode || 'chat') as AiMode,
  createdAt: conv.created_at,
  updatedAt: conv.updated_at || conv.created_at,
  isStarred: conv.context_data?.isStarred ?? false,
  isArchived: !conv.is_active,
  messageCount: 0, // Will be updated when messages load
  lastMessage: conv.context_data?.lastMessage,
});

// Helper function to map DB message to Message
const mapDbMessageToMessage = (msg: any): Message => ({
  id: msg.id,
  threadId: msg.conversation_id,
  role: msg.message_type === 'user' ? 'user' : 'assistant',
  content: msg.content || '',
  timestamp: msg.created_at,
  mode: (msg.metadata?.mode || 'chat') as AiMode,
  attachments: msg.metadata?.attachments,
  citations: msg.metadata?.citations,
  images: msg.metadata?.images,
});

export const useAiStore = create<AiState>()((set, get) => ({
  // Initial state
  threads: [],
  activeThreadId: null,
  messagesByThread: {},
  mode: 'chat',
  isGenerating: false,
  drawerOpen: false,
  isHydrated: false,
  isLoading: false,
  availableServiceModes: SERVICE_MODES,
  serviceModes: SERVICE_MODE_CONFIG,
  activeServiceMode: null,
  composer: {
    text: '',
    files: [],
    lang: 'en',
    translate: false,
    hint: DEFAULT_HINT,
  },
  settings: {
    rtl: false,
    hijri: false,
    temperature: 0.7,
    voiceEnabled: true,
    autoTranslate: false,
  },
  realtimeChannel: null,

  // =====================================================
  // Hydration from Supabase
  // =====================================================
  hydrateFromSupabase: async () => {
    const state = get();
    if (state.isHydrated || state.isLoading) {
      return; // Already hydrated or loading
    }

    set({ isLoading: true });

    try {
      // Fetch all threads using RPC
      const { data: threadsData, error: threadsError } = await supabase.rpc('get_ai_threads');

      if (threadsError) {
        console.error('[useAiStore] Error fetching threads:', threadsError);
        set({ isLoading: false, isHydrated: true });
        return;
      }

      // Map to Thread objects
      const threads: Thread[] = (threadsData || []).map(mapConversationToThread);

      // If there's an active thread, fetch its messages
      let messagesByThread: Record<string, Message[]> = {};
      
      if (threads.length > 0) {
        const firstThread = threads[0];
        
        // Fetch messages for the first thread
        const { data: messagesData, error: messagesError } = await supabase.rpc(
          'get_thread_messages',
          { thread_id: firstThread.id }
        );

        if (!messagesError && messagesData) {
          const messages = messagesData.map(mapDbMessageToMessage);
          messagesByThread[firstThread.id] = messages;
          
          // Update thread message count
          threads[0] = {
            ...threads[0],
            messageCount: messages.length,
            lastMessage: messages[messages.length - 1]?.content.substring(0, 100),
          };
        }
      }

      const activeMode = threads.length > 0 ? threads[0].mode : 'chat';
      const activeServiceMode = SERVICE_MODES.includes(activeMode as ServiceMode)
        ? (activeMode as ServiceMode)
        : null;
      const currentComposer = get().composer;
      const composerHint = activeServiceMode
        ? SERVICE_MODE_CONFIG[activeServiceMode]?.composerHint ?? DEFAULT_HINT
        : DEFAULT_HINT;

      set({
        threads,
        messagesByThread,
        activeThreadId: threads.length > 0 ? threads[0].id : null,
        mode: activeMode,
        activeServiceMode,
        composer: {
          ...currentComposer,
          hint: composerHint,
        },
        isHydrated: true,
        isLoading: false,
      });

      // Subscribe to real-time updates
      get().subscribeToRealtime();

      console.log('[useAiStore] Hydrated from Supabase:', {
        threads: threads.length,
        activeThread: threads[0]?.id,
        messages: Object.keys(messagesByThread).length,
      });
    } catch (error) {
      console.error('[useAiStore] Hydration error:', error);
      set({ isLoading: false, isHydrated: true });
    }
  },

  // =====================================================
  // Thread Management (Supabase-backed)
  // =====================================================
  newThread: async (mode = 'chat') => {
    try {
      const title = mode === 'chat' ? 'New Conversation' : `New ${mode} session`;

      // Create thread in Supabase
      const { data, error } = await supabase.rpc('create_ai_thread', {
        p_title: title,
        p_mode: mode,
        p_type: 'general',
      });

      if (error) {
        console.error('[useAiStore] Error creating thread:', error);
        return;
      }

      if (data && data.length > 0) {
        const dbThread = data[0];
        const newThread: Thread = mapConversationToThread(dbThread);
        const isServiceMode = SERVICE_MODES.includes(mode as ServiceMode);
        const composerHint = isServiceMode
          ? SERVICE_MODE_CONFIG[mode as ServiceMode]?.composerHint ?? DEFAULT_HINT
          : DEFAULT_HINT;

        set((state) => ({
          threads: [newThread, ...state.threads],
          activeThreadId: newThread.id,
          messagesByThread: {
            ...state.messagesByThread,
            [newThread.id]: [],
          },
          mode,
          activeServiceMode: isServiceMode ? (mode as ServiceMode) : null,
          composer: {
            ...state.composer,
            hint: composerHint,
          },
        }));

        console.log('[useAiStore] Created new thread:', newThread.id);
      }
    } catch (error) {
      console.error('[useAiStore] newThread error:', error);
    }
  },

  setActiveThread: async (threadId: string) => {
    const state = get();
    const thread = state.threads.find((t) => t.id === threadId);
    
    if (!thread) {
      console.warn('[useAiStore] Thread not found:', threadId);
      return;
    }

    // If messages not loaded, fetch them
    if (!state.messagesByThread[threadId]) {
      set({ isLoading: true });

      try {
        const { data: messagesData, error } = await supabase.rpc('get_thread_messages', {
          thread_id: threadId,
        });

        if (error) {
          console.error('[useAiStore] Error fetching messages:', error);
          set({ isLoading: false });
          return;
        }

        const messages = (messagesData || []).map(mapDbMessageToMessage);

        set((state) => ({
          messagesByThread: {
            ...state.messagesByThread,
            [threadId]: messages,
          },
          isLoading: false,
        }));
      } catch (error) {
        console.error('[useAiStore] setActiveThread error:', error);
        set({ isLoading: false });
      }
    }

    const isServiceMode = SERVICE_MODES.includes(thread.mode as ServiceMode);
    const composerHint = isServiceMode
      ? SERVICE_MODE_CONFIG[thread.mode as ServiceMode]?.composerHint ?? DEFAULT_HINT
      : DEFAULT_HINT;

    set({
      activeThreadId: threadId,
      mode: thread.mode,
      activeServiceMode: isServiceMode ? (thread.mode as ServiceMode) : null,
      composer: {
        ...state.composer,
        hint: composerHint,
      },
    });
  },

  sendMessage: async (content: string, attachments?: Attachment[]) => {
    const state = get();
    
    // Create thread if none active
    if (!state.activeThreadId) {
      await get().newThread(state.mode);
    }

    const threadId = get().activeThreadId!;
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add user message (optimistic update)
    const userMessage: Message = {
      id: messageId,
      threadId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      mode: get().mode,
      attachments,
    };

    get().addMessage(userMessage);
    get().clearComposer();

    // Set generating state
    set({ isGenerating: true });

    const assistantMessageId = `msg_${Date.now() + 1}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      // Save user message to Supabase
      await supabase.rpc('add_thread_message', {
        p_thread_id: threadId,
        p_message_type: 'user',
        p_content: content,
        p_metadata: {
          mode: state.mode,
          attachments: attachments || [],
        },
      });

      // Create placeholder assistant message
      const assistantMessage: Message = {
        id: assistantMessageId,
        threadId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        mode: get().mode,
        isStreaming: true,
      };

      get().addMessage(assistantMessage);

      // Get user profile for role context
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const userRole = profile?.role || 'client';

      // Get conversation history (last 10 messages for context)
      const threadMessages = state.messagesByThread[threadId] || [];
      const conversationHistory = threadMessages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call edge function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: content,
          threadId,
          role: userRole,
          language: state.composer.lang,
          mode: state.mode,
          attachments,
          conversationHistory,
        },
      });

      if (error) {
        throw error;
      }

      if (data.status === 'error') {
        throw new Error(data.error || 'AI request failed');
      }

      // Save assistant message to Supabase
      await supabase.rpc('add_thread_message', {
        p_thread_id: threadId,
        p_message_type: 'assistant',
        p_content: data.response,
        p_metadata: {
          mode: state.mode,
          model: data.model,
          usage: data.usage,
          processingTimeMs: data.processing_time_ms,
        },
      });

      // Update assistant message with real response
      get().updateMessage(assistantMessageId, {
        content: data.response,
        isStreaming: false,
      });

      console.log('[useAiStore] Message saved to Supabase:', {
        threadId,
        userMessageId: messageId,
        assistantMessageId,
      });
    } catch (error) {
      console.error('[useAiStore] sendMessage error:', error);

      // Update message with error
      get().updateMessage(assistantMessageId, {
        isStreaming: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate response. Please try again.',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
      });
    } finally {
      set({ isGenerating: false });
    }
  },

  addMessage: (message) => {
    const messageWithId: Message = {
      ...message,
      id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: message.timestamp || new Date().toISOString(),
    };

    set((state) => {
      const threadId = messageWithId.threadId;
      const currentMessages = state.messagesByThread[threadId] || [];
      const updatedMessages = [...currentMessages, messageWithId];

      const updatedThreads = state.threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              updatedAt: new Date().toISOString(),
              messageCount: updatedMessages.length,
              lastMessage: messageWithId.content.substring(0, 100),
            }
          : thread,
      );

      return {
        messagesByThread: {
          ...state.messagesByThread,
          [threadId]: updatedMessages,
        },
        threads: updatedThreads,
      };
    });
  },

  updateMessage: (messageId, updates) => {
    set((state) => {
      const updatedMessagesByThread = { ...state.messagesByThread };

      Object.keys(updatedMessagesByThread).forEach((threadId) => {
        updatedMessagesByThread[threadId] = updatedMessagesByThread[threadId].map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        );
      });

      return {
        messagesByThread: updatedMessagesByThread,
      };
    });
  },

  stopGeneration: () => {
    set({ isGenerating: false });
    const state = get();
    Object.values(state.messagesByThread).forEach((messages) => {
      messages.forEach((message) => {
        if (message.isStreaming) {
          get().updateMessage(message.id, { isStreaming: false });
        }
      });
    });
  },

  // Mode management
  switchMode: (mode) => {
    set((state) => ({
      mode,
      activeServiceMode: SERVICE_MODES.includes(mode as ServiceMode) ? (mode as ServiceMode) : null,
      composer: {
        ...state.composer,
        hint: SERVICE_MODES.includes(mode as ServiceMode)
          ? SERVICE_MODE_CONFIG[mode as ServiceMode]?.composerHint ?? DEFAULT_HINT
          : DEFAULT_HINT,
      },
    }));
  },

  activateServiceMode: (mode) => {
    const config = SERVICE_MODE_CONFIG[mode];
    set((state) => ({
      activeServiceMode: mode,
      mode,
      composer: {
        ...state.composer,
        hint: config?.composerHint ?? DEFAULT_HINT,
      },
    }));
  },

  // Composer actions
  setComposerText: (text) => {
    set((state) => ({
      composer: { ...state.composer, text },
    }));
  },

  attachFile: (file) => {
    set((state) => ({
      composer: {
        ...state.composer,
        files: [...state.composer.files, file],
      },
    }));
  },

  removeAttachment: (attachmentId) => {
    set((state) => ({
      composer: {
        ...state.composer,
        files: state.composer.files.filter((f) => f.id !== attachmentId),
      },
    }));
  },

  startVoiceRecording: () => {
    set((state) => ({
      composer: {
        ...state.composer,
        voice: {
          isRecording: true,
          duration: 0,
        },
      },
    }));
  },

  stopVoiceRecording: () => {
    set((state) => ({
      composer: {
        ...state.composer,
        voice: state.composer.voice
          ? {
              ...state.composer.voice,
              isRecording: false,
            }
          : undefined,
      },
    }));
  },

  setVoiceTranscript: (transcript) => {
    set((state) => ({
      composer: {
        ...state.composer,
        text: state.composer.text + (state.composer.text ? ' ' : '') + transcript,
        voice: state.composer.voice
          ? {
              ...state.composer.voice,
              transcript,
            }
          : undefined,
      },
    }));
  },

  setLanguage: (lang) => {
    set((state) => ({
      composer: { ...state.composer, lang },
    }));
  },

  toggleTranslate: () => {
    set((state) => ({
      composer: {
        ...state.composer,
        translate: !state.composer.translate,
      },
    }));
  },

  // Settings
  toggleRTL: () => {
    set((state) => {
      const rtl = !state.settings.rtl;
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      return {
        settings: { ...state.settings, rtl },
      };
    });
  },

  toggleHijri: () => {
    set((state) => ({
      settings: { ...state.settings, hijri: !state.settings.hijri },
    }));
  },

  setTemperature: (temperature) => {
    set((state) => ({
      settings: { ...state.settings, temperature },
    }));
  },

  setVoiceEnabled: (enabled) => {
    set((state) => ({
      settings: { ...state.settings, voiceEnabled: enabled },
    }));
  },

  setAutoTranslate: (enabled) => {
    set((state) => ({
      settings: { ...state.settings, autoTranslate: enabled },
    }));
  },

  // Thread management
  starThread: (threadId) => {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId ? { ...thread, isStarred: !thread.isStarred } : thread,
      ),
    }));

    // Update in Supabase
    const thread = get().threads.find((t) => t.id === threadId);
    if (thread) {
      supabase
        .from('ai_conversations')
        .update({
          context_data: { isStarred: !thread.isStarred },
          updated_at: new Date().toISOString(),
        })
        .eq('id', threadId)
        .then(({ error }) => {
          if (error) console.error('[useAiStore] Error starring thread:', error);
        });
    }
  },

  archiveThread: (threadId) => {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId ? { ...thread, isArchived: !thread.isArchived } : thread,
      ),
    }));

    // Update in Supabase
    const thread = get().threads.find((t) => t.id === threadId);
    if (thread) {
      supabase
        .from('ai_conversations')
        .update({
          is_active: thread.isArchived, // If archived, set inactive
          updated_at: new Date().toISOString(),
        })
        .eq('id', threadId)
        .then(({ error }) => {
          if (error) console.error('[useAiStore] Error archiving thread:', error);
        });
    }
  },

  deleteThread: async (threadId) => {
    try {
      // Delete from Supabase (CASCADE will delete messages)
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', threadId);

      if (error) {
        console.error('[useAiStore] Error deleting thread:', error);
        return;
      }

      // Update local state
      set((state) => {
        const { [threadId]: _deleted, ...remainingMessages } = state.messagesByThread;
        const isActive = state.activeThreadId === threadId;
        return {
          threads: state.threads.filter((thread) => thread.id !== threadId),
          messagesByThread: remainingMessages,
          activeThreadId: isActive ? null : state.activeThreadId,
        };
      });

      console.log('[useAiStore] Deleted thread:', threadId);
    } catch (error) {
      console.error('[useAiStore] deleteThread error:', error);
    }
  },

  // Drawer
  toggleDrawer: () => {
    set((state) => ({ drawerOpen: !state.drawerOpen }));
  },

  setDrawerOpen: (open) => {
    set({ drawerOpen: open });
  },

  // Utility
  getActiveThread: () => {
    const state = get();
    return state.threads.find((thread) => thread.id === state.activeThreadId) || null;
  },

  getActiveMessages: () => {
    const state = get();
    return state.activeThreadId ? state.messagesByThread[state.activeThreadId] || [] : [];
  },

  clearComposer: () => {
    set((state) => ({
      composer: {
        ...state.composer,
        text: '',
        files: [],
        voice: undefined,
      },
    }));
  },

  // =====================================================
  // Real-time Subscriptions
  // =====================================================
  subscribeToRealtime: () => {
    const state = get();
    
    // Unsubscribe from existing channel if any
    if (state.realtimeChannel) {
      state.realtimeChannel.unsubscribe();
    }

    // Create channel for ai_messages table
    const channel = supabase
      .channel('ai-conversations-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
        },
        (payload) => {
          console.log('[useAiStore] Real-time INSERT:', payload);
          
          const newMessage = mapDbMessageToMessage(payload.new);
          
          // Only add if not already in state (avoid duplicates from own sends)
          const state = get();
          const existingMessages = state.messagesByThread[newMessage.threadId] || [];
          const exists = existingMessages.some((m) => m.id === newMessage.id);
          
          if (!exists) {
            get().addMessage(newMessage);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_conversations',
        },
        (payload) => {
          console.log('[useAiStore] Real-time conversation UPDATE:', payload);
          
          const updatedConv = payload.new;
          set((state) => ({
            threads: state.threads.map((thread) =>
              thread.id === updatedConv.id
                ? mapConversationToThread(updatedConv)
                : thread
            ),
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'ai_conversations',
        },
        (payload) => {
          console.log('[useAiStore] Real-time conversation DELETE:', payload);
          
          const deletedId = payload.old.id;
          set((state) => ({
            threads: state.threads.filter((thread) => thread.id !== deletedId),
            messagesByThread: Object.fromEntries(
              Object.entries(state.messagesByThread).filter(([id]) => id !== deletedId)
            ),
            activeThreadId: state.activeThreadId === deletedId ? null : state.activeThreadId,
          }));
        }
      )
      .subscribe((status) => {
        console.log('[useAiStore] Real-time subscription status:', status);
      });

    set({ realtimeChannel: channel });
  },

  unsubscribeFromRealtime: () => {
    const state = get();
    if (state.realtimeChannel) {
      state.realtimeChannel.unsubscribe();
      set({ realtimeChannel: null });
    }
  },
}));

