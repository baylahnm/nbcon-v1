import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'engineer' | 'client' | 'enterprise' | 'admin';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location_city?: string;
  location_region?: string;
  preferred_language: string;
  theme_preference: string;
  rtl_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  getCurrentProfile: () => Promise<Profile | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isInitialized: false,

      setUser: (user) => set({ user }),
      
      setSession: (session) => {
        set({ session });
        if (session?.user) {
          set({ user: session.user });
        } else {
          set({ user: null, profile: null });
        }
      },
      
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      signOut: async () => {
        try {
          set({ isLoading: true });
          await supabase.auth.signOut();
          set({ user: null, session: null, profile: null });
        } catch (error) {
          console.error('Error signing out:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const { profile, user } = get();
        if (!profile || !user) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) throw error;
          
          set({ profile: data });
        } catch (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      },

      getCurrentProfile: async () => {
        const { user } = get();
        if (!user) return null;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              // No profile found
              return null;
            }
            throw error;
          }

          set({ profile: data });
          return data;
        } catch (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
      },
    }),
    {
      name: 'nbcon-auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
    }
  )
);

// Initialize auth state listener
export const initializeAuth = () => {
  const { setSession, setLoading, setInitialized, getCurrentProfile } = useAuthStore.getState();

  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        // Get profile after user is authenticated
        setTimeout(async () => {
          await getCurrentProfile();
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    }
  );

  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (session?.user) {
      getCurrentProfile().finally(() => {
        setLoading(false);
        setInitialized(true);
      });
    } else {
      setLoading(false);
      setInitialized(true);
    }
  });

  return () => subscription.unsubscribe();
};