import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Thread {
  id: string;
  title: string;
  mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors';
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
  mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors';
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
  mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors';
  isGenerating: boolean;
  drawerOpen: boolean;
  
  // Composer state
  composer: ComposerState;
  
  // Settings
  settings: Settings;
  
  // Actions
  newThread: (mode?: 'chat' | 'research' | 'image' | 'agent' | 'connectors') => void;
  setActiveThread: (threadId: string) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  stopGeneration: () => void;
  
  // Mode management
  switchMode: (mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors') => void;
  
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
      composer: {
        text: '',
        files: [],
        lang: 'en',
        translate: false,
      },
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
        const newThread: Thread = {
          id: threadId,
          title: 'New Conversation',
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
        }));
      },

      setActiveThread: (threadId: string) => {
        const thread = get().threads.find(t => t.id === threadId);
        if (thread) {
          set({
            activeThreadId: threadId,
            mode: thread.mode,
          });
        }
      },

      sendMessage: async (content: string, attachments?: Attachment[]) => {
        const state = get();
        if (!state.activeThreadId) {
          get().newThread();
        }

        const threadId = state.activeThreadId!;
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Add user message
        const userMessage: Message = {
          id: messageId,
          threadId,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
          mode: state.mode,
          attachments,
        };

        get().addMessage(userMessage);
        get().clearComposer();

        // Set generating state
        set({ isGenerating: true });

        try {
          // Simulate AI response (replace with actual API call)
          const assistantMessageId = `msg_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`;
          const assistantMessage: Message = {
            id: assistantMessageId,
            threadId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            mode: state.mode,
            isStreaming: true,
          };

          get().addMessage(assistantMessage);

          // Simulate streaming response
          const responses = [
            "I understand you're asking about ",
            content.toLowerCase(),
            ". Let me help you with that. ",
            "Based on the information provided, ",
            "I can offer some insights and recommendations. ",
            "Would you like me to elaborate on any specific aspect?"
          ];

          for (let i = 0; i < responses.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            get().updateMessage(assistantMessageId, {
              content: responses.slice(0, i + 1).join(''),
            });
          }

          // Mark as complete
          get().updateMessage(assistantMessageId, {
            isStreaming: false,
          });

        } catch (error) {
          get().updateMessage(assistantMessageId, {
            isStreaming: false,
            error: 'Failed to generate response',
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

          // Update thread
          const updatedThreads = state.threads.map(thread => 
            thread.id === threadId 
              ? {
                  ...thread,
                  updatedAt: new Date().toISOString(),
                  messageCount: updatedMessages.length,
                  lastMessage: messageWithId.content.substring(0, 100),
                }
              : thread
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
          
          Object.keys(updatedMessagesByThread).forEach(threadId => {
            updatedMessagesByThread[threadId] = updatedMessagesByThread[threadId].map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            );
          });

          return {
            messagesByThread: updatedMessagesByThread,
          };
        });
      },

      stopGeneration: () => {
        set({ isGenerating: false });
        // Update any streaming messages
        const state = get();
        Object.values(state.messagesByThread).forEach(messages => {
          messages.forEach(message => {
            if (message.isStreaming) {
              get().updateMessage(message.id, { isStreaming: false });
            }
          });
        });
      },

      // Mode management
      switchMode: (mode) => {
        set({ mode });
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
            files: state.composer.files.filter(f => f.id !== attachmentId),
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
            voice: {
              ...state.composer.voice,
              isRecording: false,
            },
          },
        }));
      },

      setVoiceTranscript: (transcript) => {
        set((state) => ({
          composer: {
            ...state.composer,
            text: state.composer.text + (state.composer.text ? ' ' : '') + transcript,
            voice: {
              ...state.composer.voice,
              transcript,
            },
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
        set((state) => ({
          settings: { ...state.settings, rtl: !state.settings.rtl },
        }));
        // Update document direction
        document.documentElement.dir = get().settings.rtl ? 'rtl' : 'ltr';
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
        // Implementation for saving thread
        console.log('Saving thread:', threadId);
      },

      starThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map(thread =>
            thread.id === threadId ? { ...thread, isStarred: !thread.isStarred } : thread
          ),
        }));
      },

      archiveThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map(thread =>
            thread.id === threadId ? { ...thread, isArchived: !thread.isArchived } : thread
          ),
        }));
      },

      deleteThread: (threadId) => {
        set((state) => {
          const { [threadId]: deleted, ...remainingMessages } = state.messagesByThread;
          return {
            threads: state.threads.filter(thread => thread.id !== threadId),
            messagesByThread: remainingMessages,
            activeThreadId: state.activeThreadId === threadId ? null : state.activeThreadId,
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
        return state.threads.find(thread => thread.id === state.activeThreadId) || null;
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
    }
  )
);
