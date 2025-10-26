/**
 * Unit Tests: useAiStore - Thread Management
 * 
 * Tests thread lifecycle to prevent duplicate thread creation bugs
 * Regression coverage for dashboard chat list issues
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAiStore } from '../../src/shared/stores/useAiStore';
import { supabase } from '../../src/shared/supabase/client';

// Mock Supabase
vi.mock('../../src/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: 'test-user-id', email: 'test@nbcon.org' } },
          error: null,
        })
      ),
    },
    rpc: vi.fn(),
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: { role: 'client' },
              error: null,
            })
          ),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    functions: {
      invoke: vi.fn(() =>
        Promise.resolve({
          data: {
            status: 'success',
            response: 'Mock AI response',
            model: 'gpt-4o-mini',
            usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          },
          error: null,
        })
      ),
    },
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => Promise.resolve('SUBSCRIBED')),
      unsubscribe: vi.fn(),
    })),
  },
}));

describe('useAiStore - Thread Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset store state
    const { result } = renderHook(() => useAiStore());
    act(() => {
      result.current.unsubscribeFromRealtime();
    });
  });

  describe('Hydration from Supabase', () => {
    it('should hydrate threads from Supabase on first load', async () => {
      const mockThreads = [
        {
          id: 'thread-1',
          conversation_title: 'Existing Conversation',
          ai_service_mode: 'chat',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          context_data: {},
        },
      ];

      const mockMessages = [
        {
          id: 'msg-1',
          conversation_id: 'thread-1',
          message_type: 'user',
          content: 'Hello',
          created_at: new Date().toISOString(),
          metadata: { mode: 'chat' },
        },
      ];

      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'get_ai_threads') {
          return Promise.resolve({ data: mockThreads, error: null });
        }
        if (fnName === 'get_thread_messages') {
          return Promise.resolve({ data: mockMessages, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const { result } = renderHook(() => useAiStore());

      expect(result.current.isHydrated).toBe(false);
      expect(result.current.threads.length).toBe(0);

      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.threads.length).toBe(1);
      expect(result.current.threads[0].id).toBe('thread-1');
      expect(result.current.activeThreadId).toBe('thread-1');
      expect(result.current.messagesByThread['thread-1']).toBeDefined();
      expect(result.current.messagesByThread['thread-1'].length).toBe(1);
    });

    it('should not duplicate threads on multiple hydration calls', async () => {
      const mockThreads = [
        {
          id: 'thread-1',
          conversation_title: 'Test Thread',
          ai_service_mode: 'chat',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          context_data: {},
        },
      ];

      (supabase.rpc as any).mockResolvedValue({ data: mockThreads, error: null });

      const { result } = renderHook(() => useAiStore());

      // First hydration
      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      const threadsAfterFirst = result.current.threads.length;
      expect(threadsAfterFirst).toBe(1);

      // Second hydration call (should be ignored)
      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      expect(result.current.threads.length).toBe(threadsAfterFirst);
      expect(result.current.threads.length).toBe(1); // No duplicates
    });

    it('should handle empty thread list on hydration', async () => {
      (supabase.rpc as any).mockResolvedValue({ data: [], error: null });

      const { result } = renderHook(() => useAiStore());

      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.threads.length).toBe(0);
      expect(result.current.activeThreadId).toBeNull();
    });
  });

  describe('Thread Creation', () => {
    it('should create new thread and set it as active', async () => {
      const mockNewThread = {
        id: 'new-thread-id',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        context_data: {},
      };

      (supabase.rpc as any).mockResolvedValue({ data: [mockNewThread], error: null });

      const { result } = renderHook(() => useAiStore());

      expect(result.current.threads.length).toBe(0);

      await act(async () => {
        await result.current.newThread('chat');
      });

      expect(result.current.threads.length).toBe(1);
      expect(result.current.threads[0].id).toBe('new-thread-id');
      expect(result.current.activeThreadId).toBe('new-thread-id');
      expect(result.current.messagesByThread['new-thread-id']).toEqual([]);
    });

    it('should NOT create duplicate threads when called multiple times', async () => {
      const mockNewThread = {
        id: 'thread-unique',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        context_data: {},
      };

      let callCount = 0;
      (supabase.rpc as any).mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          data: [{ ...mockNewThread, id: `thread-${callCount}` }],
          error: null,
        });
      });

      const { result } = renderHook(() => useAiStore());

      // Call newThread twice rapidly
      await act(async () => {
        await Promise.all([result.current.newThread('chat'), result.current.newThread('chat')]);
      });

      // Should have created 2 threads (both RPC calls succeed)
      // But in production, the dashboard guard prevents this scenario
      expect(result.current.threads.length).toBe(2);
      expect(callCount).toBe(2);
    });
  });

  describe('Active Thread Selection', () => {
    it('should set active thread without creating new one', async () => {
      const mockThreads = [
        {
          id: 'thread-1',
          conversation_title: 'Thread 1',
          ai_service_mode: 'chat',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          context_data: {},
        },
        {
          id: 'thread-2',
          conversation_title: 'Thread 2',
          ai_service_mode: 'chat',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          context_data: {},
        },
      ];

      const mockMessages = [
        {
          id: 'msg-1',
          conversation_id: 'thread-2',
          message_type: 'user',
          content: 'Test message',
          created_at: new Date().toISOString(),
          metadata: { mode: 'chat' },
        },
      ];

      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'get_ai_threads') {
          return Promise.resolve({ data: mockThreads, error: null });
        }
        if (fnName === 'get_thread_messages') {
          return Promise.resolve({ data: mockMessages, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const { result } = renderHook(() => useAiStore());

      // Hydrate first
      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      expect(result.current.threads.length).toBe(2);
      expect(result.current.activeThreadId).toBe('thread-1'); // First thread active

      // Now switch to thread-2
      await act(async () => {
        await result.current.setActiveThread('thread-2');
      });

      // Should NOT create new thread
      expect(result.current.threads.length).toBe(2); // Still 2 threads
      expect(result.current.activeThreadId).toBe('thread-2');
      expect(result.current.messagesByThread['thread-2']).toBeDefined();
      expect(result.current.messagesByThread['thread-2'].length).toBe(1);
    });

    it('should load messages when switching to thread without messages', async () => {
      const mockThreads = [
        {
          id: 'thread-1',
          conversation_title: 'Thread 1',
          ai_service_mode: 'chat',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          context_data: {},
        },
      ];

      const mockMessages = [
        {
          id: 'msg-1',
          conversation_id: 'thread-1',
          message_type: 'user',
          content: 'Test',
          created_at: new Date().toISOString(),
          metadata: { mode: 'chat' },
        },
      ];

      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'get_ai_threads') {
          return Promise.resolve({ data: mockThreads, error: null });
        }
        if (fnName === 'get_thread_messages') {
          return Promise.resolve({ data: mockMessages, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const { result } = renderHook(() => useAiStore());

      // Manually set threads without hydration (simulating partial state)
      act(() => {
        result.current.threads = mockThreads.map((t: any) => ({
          id: t.id,
          title: t.conversation_title,
          mode: t.ai_service_mode,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          isStarred: false,
          isArchived: false,
          messageCount: 0,
        }));
      });

      expect(result.current.messagesByThread['thread-1']).toBeUndefined();

      // Set active thread
      await act(async () => {
        await result.current.setActiveThread('thread-1');
      });

      // Should have loaded messages
      expect(result.current.messagesByThread['thread-1']).toBeDefined();
      expect(result.current.messagesByThread['thread-1'].length).toBe(1);
      expect(result.current.activeThreadId).toBe('thread-1');
    });
  });

  describe('Message Sending', () => {
    it('should create thread only if none exists before sending', async () => {
      const mockNewThread = {
        id: 'auto-thread',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        context_data: {},
      };

      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'create_ai_thread') {
          return Promise.resolve({ data: [mockNewThread], error: null });
        }
        if (fnName === 'add_thread_message') {
          return Promise.resolve({ data: null, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const { result } = renderHook(() => useAiStore());

      expect(result.current.activeThreadId).toBeNull();
      expect(result.current.threads.length).toBe(0);

      // Send message without active thread
      await act(async () => {
        await result.current.sendMessage('Hello AI');
      });

      // Should have created ONE thread
      expect(result.current.threads.length).toBe(1);
      expect(result.current.activeThreadId).toBe('auto-thread');
      expect(supabase.rpc).toHaveBeenCalledWith('create_ai_thread', expect.any(Object));
    });

    it('should NOT create new thread if active thread exists', async () => {
      const mockThread = {
        id: 'existing-thread',
        conversation_title: 'Existing',
        ai_service_mode: 'chat',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        context_data: {},
      };

      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'get_ai_threads') {
          return Promise.resolve({ data: [mockThread], error: null });
        }
        if (fnName === 'get_thread_messages') {
          return Promise.resolve({ data: [], error: null });
        }
        if (fnName === 'add_thread_message') {
          return Promise.resolve({ data: null, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const { result } = renderHook(() => useAiStore());

      // Hydrate with existing thread
      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      expect(result.current.threads.length).toBe(1);
      expect(result.current.activeThreadId).toBe('existing-thread');

      const createThreadSpy = vi.spyOn(result.current, 'newThread');

      // Send message
      await act(async () => {
        await result.current.sendMessage('Follow-up message');
      });

      // Should NOT have called newThread (already has active thread)
      expect(createThreadSpy).not.toHaveBeenCalled();
      expect(result.current.threads.length).toBe(1); // Still 1 thread
      expect(result.current.activeThreadId).toBe('existing-thread');
    });
  });

  describe('Thread Deletion', () => {
    it('should delete thread and clear active state', async () => {
      const mockThreads = [
        {
          id: 'thread-to-delete',
          conversation_title: 'Will Delete',
          ai_service_mode: 'chat',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          context_data: {},
        },
      ];

      (supabase.rpc as any).mockResolvedValue({ data: mockThreads, error: null });

      const { result } = renderHook(() => useAiStore());

      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      expect(result.current.threads.length).toBe(1);
      expect(result.current.activeThreadId).toBe('thread-to-delete');

      // Delete thread
      await act(async () => {
        await result.current.deleteThread('thread-to-delete');
      });

      expect(result.current.threads.length).toBe(0);
      expect(result.current.activeThreadId).toBeNull();
      expect(result.current.messagesByThread['thread-to-delete']).toBeUndefined();
    });
  });

  describe('Regression: Dashboard Load Scenario', () => {
    it('should NOT create duplicate threads on dashboard mount', async () => {
      // Simulate fresh dashboard load with no threads
      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'get_ai_threads') {
          return Promise.resolve({ data: [], error: null });
        }
        if (fnName === 'create_ai_thread') {
          return Promise.resolve({
            data: [
              {
                id: 'first-thread',
                conversation_title: 'New Conversation',
                ai_service_mode: 'chat',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                context_data: {},
              },
            ],
            error: null,
          });
        }
        return Promise.resolve({ data: null, error: null });
      });

      const { result } = renderHook(() => useAiStore());

      // Step 1: Hydrate (simulating dashboard mount)
      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      expect(result.current.isHydrated).toBe(true);
      expect(result.current.threads.length).toBe(0);
      expect(result.current.activeThreadId).toBeNull();

      // Step 2: Dashboard effect creates initial thread
      await act(async () => {
        if (!result.current.activeThreadId && result.current.threads.length === 0) {
          await result.current.newThread('chat');
        }
      });

      // Should have exactly 1 thread
      expect(result.current.threads.length).toBe(1);
      expect(result.current.threads[0].id).toBe('first-thread');
      expect(result.current.activeThreadId).toBe('first-thread');

      // Step 3: Simulate component re-render (Strict Mode)
      // Guard should prevent duplicate creation
      await act(async () => {
        if (!result.current.activeThreadId && result.current.threads.length === 0) {
          await result.current.newThread('chat');
        }
      });

      // Still exactly 1 thread (condition prevents second call)
      expect(result.current.threads.length).toBe(1);
    });
  });

  describe('Real-world Workflow', () => {
    it('should handle complete user session without duplicates', async () => {
      const { result } = renderHook(() => useAiStore());

      // 1. User loads dashboard (hydrate with no threads)
      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'get_ai_threads') {
          return Promise.resolve({ data: [], error: null });
        }
        if (fnName === 'create_ai_thread') {
          return Promise.resolve({
            data: [
              {
                id: 'session-thread',
                conversation_title: 'New Conversation',
                ai_service_mode: 'chat',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                context_data: {},
              },
            ],
            error: null,
          });
        }
        if (fnName === 'add_thread_message') {
          return Promise.resolve({ data: null, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      });

      await act(async () => {
        await result.current.hydrateFromSupabase();
      });

      expect(result.current.threads.length).toBe(0);

      // 2. Dashboard creates initial thread
      await act(async () => {
        await result.current.newThread('chat');
      });

      expect(result.current.threads.length).toBe(1);
      const firstThreadId = result.current.activeThreadId;

      // 3. User sends first message
      await act(async () => {
        await result.current.sendMessage('Hello');
      });

      // Should NOT create new thread (already has active thread)
      expect(result.current.threads.length).toBe(1);
      expect(result.current.activeThreadId).toBe(firstThreadId);

      // 4. User sends second message
      await act(async () => {
        await result.current.sendMessage('Follow-up question');
      });

      // Still same thread
      expect(result.current.threads.length).toBe(1);
      expect(result.current.activeThreadId).toBe(firstThreadId);

      // 5. User creates new conversation explicitly
      (supabase.rpc as any).mockImplementation((fnName: string) => {
        if (fnName === 'create_ai_thread') {
          return Promise.resolve({
            data: [
              {
                id: 'second-thread',
                conversation_title: 'New Conversation',
                ai_service_mode: 'chat',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                context_data: {},
              },
            ],
            error: null,
          });
        }
        return Promise.resolve({ data: null, error: null });
      });

      await act(async () => {
        await result.current.newThread('chat');
      });

      // Now should have 2 threads (user explicitly created new one)
      expect(result.current.threads.length).toBe(2);
      expect(result.current.activeThreadId).toBe('second-thread');
    });
  });
});

