/**
 * Regression Test: Duplicate Thread Prevention
 * 
 * Verifies that duplicate "New Conversation" threads are never created
 * Tests all three layers of protection:
 * 1. Frontend guard (useAiStore)
 * 2. Database RPC guard (create_ai_thread)
 * 3. Dashboard effect guard (DashboardContent)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiStore } from '../../src/shared/stores/useAiStore';

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
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({ subscribe: vi.fn() })),
      unsubscribe: vi.fn(),
    })),
  },
}));

describe('Duplicate Thread Prevention - Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAiStore.getState().threads = [];
    useAiStore.getState().messagesByThread = {};
    useAiStore.getState().activeThreadId = null;
  });

  afterEach(() => {
    useAiStore.getState().unsubscribeFromRealtime();
  });

  it('should reuse existing empty "New Conversation" thread instead of creating duplicate', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    // Mock existing empty thread
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [{
        id: 'existing-thread-id',
        user_id: 'test-user-id',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        conversation_type: 'general',
        is_active: true,
        created_at: new Date().toISOString(),
      }],
      error: null,
    } as any);

    // First call - creates thread
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    const threadsAfterFirst = useAiStore.getState().threads;
    expect(threadsAfterFirst).toHaveLength(1);
    expect(threadsAfterFirst[0].title).toBe('New Conversation');
    const firstThreadId = threadsAfterFirst[0].id;

    // Second call - should reuse existing thread, not create duplicate
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    const threadsAfterSecond = useAiStore.getState().threads;
    expect(threadsAfterSecond).toHaveLength(1); // Still only 1 thread
    expect(threadsAfterSecond[0].id).toBe(firstThreadId); // Same thread ID
    
    // Verify RPC was NOT called second time (reused existing)
    expect(supabase.rpc).toHaveBeenCalledTimes(1);
  });

  it('should prevent creation if RPC returns existing thread', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    const existingThreadData = {
      id: 'rpc-existing-thread',
      user_id: 'test-user-id',
      conversation_title: 'New Conversation',
      ai_service_mode: 'chat',
      conversation_type: 'general',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // RPC returns existing thread both times (database-level duplicate prevention)
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce({ data: [existingThreadData], error: null } as any)
      .mockResolvedValueOnce({ data: [existingThreadData], error: null } as any);

    // First call
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    const threadsAfterFirst = useAiStore.getState().threads;
    expect(threadsAfterFirst).toHaveLength(1);

    // Second call
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    const threadsAfterSecond = useAiStore.getState().threads;
    expect(threadsAfterSecond).toHaveLength(1); // Still only 1 thread
    expect(threadsAfterSecond[0].id).toBe('rpc-existing-thread');
  });

  it('should not create duplicate on rapid successive calls', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [{
        id: 'thread-rapid-test',
        user_id: 'test-user-id',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        conversation_type: 'general',
        is_active: true,
        created_at: new Date().toISOString(),
      }],
      error: null,
    } as any);

    // Simulate rapid clicks (3 calls within milliseconds)
    await act(async () => {
      await Promise.all([
        useAiStore.getState().newThread('chat'),
        useAiStore.getState().newThread('chat'),
        useAiStore.getState().newThread('chat'),
      ]);
    });

    const threads = useAiStore.getState().threads;
    
    // Should only have 1 thread despite 3 rapid calls
    expect(threads).toHaveLength(1);
    expect(threads[0].title).toBe('New Conversation');
  });

  it('should allow creating different mode threads', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce({
        data: [{
          id: 'thread-chat',
          user_id: 'test-user-id',
          conversation_title: 'New Conversation',
          ai_service_mode: 'chat',
          conversation_type: 'general',
          is_active: true,
          created_at: new Date().toISOString(),
        }],
        error: null,
      } as any)
      .mockResolvedValueOnce({
        data: [{
          id: 'thread-research',
          user_id: 'test-user-id',
          conversation_title: 'New research session',
          ai_service_mode: 'research',
          conversation_type: 'general',
          is_active: true,
          created_at: new Date().toISOString(),
        }],
        error: null,
      } as any);

    // Create chat thread
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    // Create research thread (different mode)
    await act(async () => {
      await useAiStore.getState().newThread('research');
    });

    const threads = useAiStore.getState().threads;
    
    // Should have 2 threads (different modes)
    expect(threads).toHaveLength(2);
    expect(threads.some(t => t.title === 'New Conversation')).toBe(true);
    expect(threads.some(t => t.title === 'New research session')).toBe(true);
  });

  it('should create new thread if existing has messages', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    // Setup: existing thread with messages
    useAiStore.getState().threads = [{
      id: 'thread-with-messages',
      title: 'New Conversation',
      mode: 'chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isStarred: false,
      isArchived: false,
      messageCount: 2,
    }];
    
    useAiStore.getState().messagesByThread = {
      'thread-with-messages': [
        {
          id: 'msg-1',
          content: 'Hello',
          role: 'user',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'msg-2',
          content: 'Hi there',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [{
        id: 'new-thread-id',
        user_id: 'test-user-id',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        conversation_type: 'general',
        is_active: true,
        created_at: new Date().toISOString(),
      }],
      error: null,
    } as any);

    // Should create new thread since existing one has messages
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    const threads = useAiStore.getState().threads;
    expect(threads).toHaveLength(2); // Now should have 2 threads
  });
});

describe('Dashboard Initial Thread Creation', () => {
  it('should only create one thread on initial load', async () => {
    const { supabase } = await import('../../src/shared/supabase/client');
    
    // Mock empty hydration
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [],
      error: null,
    } as any);

    // Hydrate (simulating initial load)
    await act(async () => {
      await useAiStore.getState().hydrateFromSupabase();
    });

    expect(useAiStore.getState().threads).toHaveLength(0);
    expect(useAiStore.getState().isHydrated).toBe(true);

    // Now simulate the dashboard effect creating a thread
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [{
        id: 'initial-thread',
        user_id: 'test-user-id',
        conversation_title: 'New Conversation',
        ai_service_mode: 'chat',
        conversation_type: 'general',
        is_active: true,
        created_at: new Date().toISOString(),
      }],
      error: null,
    } as any);

    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    // Should have exactly 1 thread
    expect(useAiStore.getState().threads).toHaveLength(1);
    
    // Even if effect runs again, should not create duplicate
    await act(async () => {
      await useAiStore.getState().newThread('chat');
    });

    expect(useAiStore.getState().threads).toHaveLength(1); // Still 1
  });
});

