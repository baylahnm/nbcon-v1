import { useEffect, useState } from 'react';
import { supabase } from '@/shared/supabase/client';
import type { Session } from '@supabase/supabase-js';

/**
 * Hook to track Supabase auth session with proper loading states
 * 
 * Returns:
 * - `undefined` while session is being loaded (prevents premature redirects)
 * - `Session | null` once loaded (null = no session, Session = active session)
 * 
 * This prevents redirect loops by ensuring we never redirect until we know
 * the actual session state from Supabase.
 */
export function useAuthSession() {
  // undefined = loading, null = no session, Session = active session
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[useAuthSession] Error getting session:', error);
          if (isMounted) {
            setSession(null);
            setIsLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          setSession(data.session);
          setIsLoading(false);
          console.log('[useAuthSession] Initial session loaded:', !!data.session);
        }
      } catch (error) {
        console.error('[useAuthSession] Exception getting session:', error);
        if (isMounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    getSession();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[useAuthSession] Auth state changed:', event, 'Has session:', !!newSession);
        
        if (isMounted) {
          setSession(newSession);
          setIsLoading(false);
        }
      }
    );

    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading };
}

