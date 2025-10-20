import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/shared/supabase/client';
import {
  SERVICE_MODE_CONFIG,
  SERVICE_MODES,
  ServiceMode,
  ServiceModeConfig,
} from '../services/config';

type CoreMode = 'chat' | 'research' | 'image' | 'agent' | 'connectors';
export type AiMode = CoreMode | ServiceMode;

const DEFAULT_HINT = '';

const isServiceMode = (mode: AiMode): mode is ServiceMode =>
  SERVICE_MODES.includes(mode as ServiceMode);

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
  activeServiceMode: ServiceMode | null;

  // Composer state
  composer: ComposerState;

  // Service catalog
  availableServiceModes: ServiceMode[];
  serviceModes: Record<ServiceMode, ServiceModeConfig>;

  // Settings
  settings: Settings;

  // Actions
  newThread: (mode?: AiMode) => void;
  setActiveThread: (threadId: string) => void;
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
  saveThread: (threadId: string) => void;
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
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      // Initial state
      threads: [],
      activeThreadId: null,
      messagesByThread: {},
      mode: 'chat',
      isGenerating: false,
      drawerOpen: false,
      activeServiceMode: null,
      composer: {
        text: '',
        files: [],
        lang: 'en',
        translate: false,
        hint: DEFAULT_HINT,
      },
      availableServiceModes: SERVICE_MODES,
      serviceModes: SERVICE_MODE_CONFIG,
      settings: {
        rtl: false,
        hijri: false,
        temperature: 0.7,
        voiceEnabled: true,
        autoTranslate: false,
      },

      // Thread management
      newThread: (mode = 'chat') => {
        const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const config = isServiceMode(mode) ? SERVICE_MODE_CONFIG[mode] : undefined;
        const newThread: Thread = {
          id: threadId,
          title: config?.defaultThreadTitle ?? 'New Conversation',
          mode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isStarred: false,
          isArchived: false,
          messageCount: 0,
        };

        set((state) => ({
          threads: [newThread, ...state.threads],
          activeThreadId: threadId,
          messagesByThread: {
            ...state.messagesByThread,
            [threadId]: [],
          },
          mode,
          activeServiceMode: isServiceMode(mode) ? mode : null,
          composer: {
            ...state.composer,
            hint: config?.composerHint ?? DEFAULT_HINT,
          },
        }));
      },

      setActiveThread: (threadId: string) => {
        const thread = get().threads.find((t) => t.id === threadId);
        if (thread) {
          const serviceMode = isServiceMode(thread.mode) ? thread.mode : null;
          const hint = serviceMode
            ? SERVICE_MODE_CONFIG[serviceMode].composerHint
            : DEFAULT_HINT;
          set((state) => ({
            activeThreadId: threadId,
            mode: thread.mode,
            activeServiceMode: serviceMode,
            composer: {
              ...state.composer,
              hint,
            },
          }));
        }
      },

      sendMessage: async (content: string, attachments?: Attachment[]) => {
        const state = get();
        if (!state.activeThreadId) {
          get().newThread(state.mode);
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
            .map(msg => ({
              role: msg.role,
              content: msg.content
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

          // Update assistant message with real response
          get().updateMessage(assistantMessageId, {
            content: data.response,
            isStreaming: false,
          });

        } catch (error) {
          console.error('AI sendMessage error:', error);
          
          // Update message with error
          get().updateMessage(assistantMessageId, {
            isStreaming: false,
            error: error instanceof Error ? error.message : 'Failed to generate response. Please try again.',
            content: 'Sorry, I encountered an error processing your request. Please try again.',
          });
        } finally {
          set({ isGenerating: false });
        }
      },

      addMessage: (message) => {
        const messageWithId: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
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
        const hint = isServiceMode(mode)
          ? SERVICE_MODE_CONFIG[mode].composerHint
          : DEFAULT_HINT;
        set((state) => ({
          mode,
          activeServiceMode: isServiceMode(mode) ? mode : null,
          composer: {
            ...state.composer,
            hint,
          },
        }));
      },

      activateServiceMode: (mode) => {
        const state = get();
        const activeThread = state.activeThreadId
          ? state.threads.find((thread) => thread.id === state.activeThreadId)
          : null;

        if (!activeThread || activeThread.mode !== mode) {
          get().newThread(mode);
          return;
        }

        set((current) => ({
          mode,
          activeServiceMode: mode,
          composer: {
            ...current.composer,
            hint: SERVICE_MODE_CONFIG[mode].composerHint,
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
            text:
              state.composer.text +
              (state.composer.text ? ' ' : '') +
              transcript,
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
      saveThread: (threadId) => {
        console.log('Saving thread:', threadId);
      },

      starThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, isStarred: !thread.isStarred }
              : thread,
          ),
        }));
      },

      archiveThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, isArchived: !thread.isArchived }
              : thread,
          ),
        }));
      },

      deleteThread: (threadId) => {
        set((state) => {
          const { [threadId]: _deleted, ...remainingMessages } = state.messagesByThread;
          const isActive = state.activeThreadId === threadId;
          return {
            threads: state.threads.filter((thread) => thread.id !== threadId),
            messagesByThread: remainingMessages,
            activeThreadId: isActive ? null : state.activeThreadId,
            activeServiceMode: isActive ? null : state.activeServiceMode,
          };
        });
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
    }),
    {
      name: 'ai-store',
      partialize: (state) => ({
        threads: state.threads,
        activeThreadId: state.activeThreadId,
        messagesByThread: state.messagesByThread,
        settings: state.settings,
      }),
    },
  ),
);
