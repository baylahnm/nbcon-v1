/**
 * Integration Tests: Dashboard Chat Flow
 * 
 * Tests complete dashboard chat workflow to prevent duplicate thread bugs
 * Covers: load → hydrate → auto-create → send message → select thread
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock modules before imports
vi.mock('../../src/shared/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: { user: { id: 'test-user', email: 'test@nbcon.org' } },
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
            response: 'AI response',
            model: 'gpt-4o-mini',
            usage: { prompt_tokens: 10, completion_tokens: 15, total_tokens: 25 },
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

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAiStore } from '../../src/shared/stores/useAiStore';
import { supabase } from '../../src/shared/supabase/client';
import { useRef, useEffect } from 'react';

describe('Dashboard Chat Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should follow complete dashboard load flow without duplicates', async () => {
    // Setup: Fresh user with no threads
    (supabase.rpc as any).mockImplementation((fnName: string, params?: any) => {
      if (fnName === 'get_ai_threads') {
        return Promise.resolve({ data: [], error: null });
      }
      if (fnName === 'create_ai_thread') {
        return Promise.resolve({
          data: [
            {
              id: 'dashboard-thread-1',
              conversation_title: 'New Conversation',
              ai_service_mode: params?.p_mode || 'chat',
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
      if (fnName === 'get_thread_messages') {
        return Promise.resolve({ data: [], error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    // Simulate DashboardContent component behavior
    const { result } = renderHook(() => {
      const store = useAiStore();
      const initialThreadCreated = useRef(false);

      useEffect(() => {
        // Dashboard mount: hydrate from Supabase
        if (!store.isHydrated && !store.isLoading) {
          store.hydrateFromSupabase();
        }
      }, []);

      useEffect(() => {
        // Create initial thread after hydration (with guard)
        if (
          store.isHydrated &&
          !initialThreadCreated.current &&
          !store.activeThreadId &&
          store.threads.length === 0
        ) {
          initialThreadCreated.current = true;
          store.newThread('chat');
        }
      }, [store.isHydrated, store.activeThreadId, store.threads.length]);

      return { store, initialThreadCreated };
    });

    // Wait for hydration
    await waitFor(
      () => {
        expect(result.current.store.isHydrated).toBe(true);
      },
      { timeout: 3000 }
    );

    // Wait for thread creation
    await waitFor(
      () => {
        expect(result.current.store.threads.length).toBe(1);
      },
      { timeout: 3000 }
    );

    // Verify: Exactly 1 thread created
    expect(result.current.store.threads.length).toBe(1);
    expect(result.current.store.threads[0].id).toBe('dashboard-thread-1');
    expect(result.current.store.activeThreadId).toBe('dashboard-thread-1');

    // Verify: create_ai_thread called only once
    const createCalls = (supabase.rpc as any).mock.calls.filter(
      (call: any[]) => call[0] === 'create_ai_thread'
    );
    expect(createCalls.length).toBe(1);
  });

  it('should reuse existing thread when user returns to dashboard', async () => {
    // Setup: User with existing thread
    const existingThread = {
      id: 'existing-chat',
      conversation_title: 'Previous Conversation',
      ai_service_mode: 'chat',
      is_active: true,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date().toISOString(),
      context_data: {},
    };

    const existingMessages = [
      {
        id: 'msg-old-1',
        conversation_id: 'existing-chat',
        message_type: 'user',
        content: 'Previous message',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        metadata: { mode: 'chat' },
      },
    ];

    (supabase.rpc as any).mockImplementation((fnName: string) => {
      if (fnName === 'get_ai_threads') {
        return Promise.resolve({ data: [existingThread], error: null });
      }
      if (fnName === 'get_thread_messages') {
        return Promise.resolve({ data: existingMessages, error: null });
      }
      if (fnName === 'add_thread_message') {
        return Promise.resolve({ data: null, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    // Simulate DashboardContent component behavior
    const { result } = renderHook(() => {
      const store = useAiStore();
      const initialThreadCreated = useRef(false);

      useEffect(() => {
        if (!store.isHydrated && !store.isLoading) {
          store.hydrateFromSupabase();
        }
      }, []);

      useEffect(() => {
        // Guard: only create if no threads exist
        if (
          store.isHydrated &&
          !initialThreadCreated.current &&
          !store.activeThreadId &&
          store.threads.length === 0
        ) {
          initialThreadCreated.current = true;
          store.newThread('chat');
        }
      }, [store.isHydrated, store.activeThreadId, store.threads.length]);

      return { store, initialThreadCreated };
    });

    // Wait for hydration
    await waitFor(() => {
      expect(result.current.store.isHydrated).toBe(true);
    });

    // Wait for threads to load
    await waitFor(() => {
      expect(result.current.store.threads.length).toBe(1);
    });

    // Verify: NO new thread created (existing thread reused)
    expect(result.current.store.threads.length).toBe(1);
    expect(result.current.store.threads[0].id).toBe('existing-chat');
    expect(result.current.store.activeThreadId).toBe('existing-chat');
    expect(result.current.store.messagesByThread['existing-chat'].length).toBe(1);

    // Verify: create_ai_thread was NOT called (reused existing)
    const createCalls = (supabase.rpc as any).mock.calls.filter(
      (call: any[]) => call[0] === 'create_ai_thread'
    );
    expect(createCalls.length).toBe(0);
  });

  it('should NOT create duplicate when sending multiple messages quickly', async () => {
    const mockThread = {
      id: 'rapid-fire-thread',
      conversation_title: 'Rapid Messages',
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

    // Hydrate
    await act(async () => {
      await result.current.hydrateFromSupabase();
    });

    expect(result.current.threads.length).toBe(1);

    // Send 3 messages rapidly
    await act(async () => {
      await Promise.all([
        result.current.sendMessage('Message 1'),
        result.current.sendMessage('Message 2'),
        result.current.sendMessage('Message 3'),
      ]);
    });

    // Should still have only 1 thread
    expect(result.current.threads.length).toBe(1);
    expect(result.current.activeThreadId).toBe('rapid-fire-thread');
  });
});

