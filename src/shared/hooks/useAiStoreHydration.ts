/**
 * AI Store Hydration Hook
 * 
 * Automatically hydrates useAiStore from Supabase on mount and manages real-time subscriptions.
 * Use this hook in layouts or main AI pages to ensure data is loaded.
 * 
 * Phase 1: Supabase Integration
 * - Replaces localStorage persistence with server-authoritative state
 * - Enables cross-page real-time synchronization
 * - Ensures dashboard, /free/ai, and engineer AI pages consume same data
 * 
 * @example
 * ```tsx
 * import { useAiStoreHydration } from '@/shared/hooks/useAiStoreHydration';
 * 
 * function AIPage() {
 *   const { isHydrated, isLoading } = useAiStoreHydration();
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!isHydrated) return <ErrorState />;
 *   
 *   return <AIContent />;
 * }
 * ```
 */

import { useEffect } from 'react';
import { useAiStore } from '@/shared/stores/useAiStore';

export interface HydrationStatus {
  isHydrated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useAiStoreHydration(): HydrationStatus {
  const isHydrated = useAiStore((state) => state.isHydrated);
  const isLoading = useAiStore((state) => state.isLoading);
  const hydrateFromSupabase = useAiStore((state) => state.hydrateFromSupabase);
  const unsubscribeFromRealtime = useAiStore((state) => state.unsubscribeFromRealtime);

  useEffect(() => {
    // Hydrate on mount
    hydrateFromSupabase();

    // Cleanup: unsubscribe from real-time on unmount
    return () => {
      unsubscribeFromRealtime();
    };
  }, [hydrateFromSupabase, unsubscribeFromRealtime]);

  return {
    isHydrated,
    isLoading,
    error: null, // Can be extended to track hydration errors
  };
}

/**
 * Lightweight hook for components that only need to know if store is ready
 * Does not trigger hydration (use in child components)
 */
export function useAiStoreStatus(): { isReady: boolean } {
  const isHydrated = useAiStore((state) => state.isHydrated);
  const isLoading = useAiStore((state) => state.isLoading);

  return {
    isReady: isHydrated && !isLoading,
  };
}

