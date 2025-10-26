/**
 * Enterprise Portal AI Store Wrapper
 * 
 * This file maintains backward compatibility while using the shared Supabase-backed AI store.
 * All AI state is now server-authoritative and synced across all portals.
 * 
 * Phase 1: Supabase Integration
 * - Replaced localStorage persistence with Supabase RPC endpoints
 * - Added real-time subscriptions for cross-page synchronization
 * - Server-authoritative conversation state
 * 
 * @see src/shared/stores/useAiStore.ts - Shared implementation
 */

export * from '@/shared/stores/useAiStore';
export { useAiStore } from '@/shared/stores/useAiStore';
