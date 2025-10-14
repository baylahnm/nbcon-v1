import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/shared/supabase/client';

const STORAGE_KEY = 'nbcon_user';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  isVerified: boolean;
  sceNumber?: string;
  company?: string;
  location: string;
  phone: string;
  language: 'ar' | 'en';
  avatar?: string;
  email_confirmed_at?: string | null;
  source?: 'mock' | 'supabase';
  phone_confirmed_at?: string | null;
}

export interface EngineerProfileDetails {
  specializations?: string[];
  years_experience?: number;
  hourly_rate?: number;
  daily_rate?: number;
  availability_status?: string;
  sce_license_number?: string;
}

export interface UserProfile extends AuthenticatedUser {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location_city?: string;
  location_region?: string;
  avatar_url?: string;
  preferred_language?: string;
  theme_preference?: string;
  rtl_enabled?: boolean;
  engineer_profiles?: EngineerProfileDetails | null;
  created_at?: string;
  updated_at?: string;
}


const normalizeUser = (user: AuthenticatedUser): AuthenticatedUser => ({
  ...user,
  source: user.source ?? 'mock',
});

interface AuthState {
  user: AuthenticatedUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthenticatedUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  updateUser: (updates: Partial<AuthenticatedUser>) => void;
}

const safeLocalStorageSet = (user: AuthenticatedUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    const normalized = normalizeUser(user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const createProfileFromUser = (user: AuthenticatedUser): UserProfile => {
  const nameParts = (user.name || '').trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ')
    || undefined;
  const locationParts = (user.location || '').split(',').map(part => part.trim()).filter(Boolean);
  const city = locationParts[0];
  const region = locationParts.slice(1).join(', ') || undefined;

  return {
    ...user,
    user_id: user.id,
    first_name: firstName || user.name,
    last_name: lastName,
    location_city: city,
    location_region: region,
    avatar_url: user.avatar,
    preferred_language: user.language,
    theme_preference: 'light',
    rtl_enabled: false,
    engineer_profiles: null,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,

      setUser: (user) => {
        if (user) {
          const normalizedUser = normalizeUser(user);
          const profile = createProfileFromUser(normalizedUser);
          set({
            user: normalizedUser,
            profile,
            isAuthenticated: true,
          });
          safeLocalStorageSet(normalizedUser);
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
          safeLocalStorageSet(null);
        }
      },

      setProfile: (profile) => set({ profile }),

      login: (user) => {
        const normalizedUser = normalizeUser(user);
        const profile = createProfileFromUser(normalizedUser);
        set({
          user: normalizedUser,
          profile,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        safeLocalStorageSet(normalizedUser);
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
        safeLocalStorageSet(null);
        // Clear zustand persist storage
        clearStoredUser();
      },

      signOut: async () => {
        console.log('[SIGN OUT] Starting sign out process...');
        
        // Set a flag to prevent auto-login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('manual-signout', 'true');
          console.log('[SIGN OUT] Set manual-signout flag:', sessionStorage.getItem('manual-signout'));
        }
        
        // First, set isInitialized to false to prevent auto-login during redirect
        set({ isInitialized: false, isLoading: true });
        
        // Sign out from Supabase with global scope to clear all sessions
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        
        if (error) {
          console.error('[SIGN OUT] Supabase sign out error:', error);
        } else {
          console.log('[SIGN OUT] Supabase session cleared');
        }
        
        // Clear local auth state and all storage
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: false, // Keep as false to prevent auto-login
        });
        
        // Clear ALL storage comprehensively (except the manual-signout flag)
        clearStoredUser();
        safeLocalStorageSet(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nbcon_user');
          localStorage.removeItem('nbcon-auth-storage');
          localStorage.removeItem('theme');
          localStorage.removeItem('language');
          // Clear any other app-specific storage
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('nbcon-') || key.startsWith('auth-')) {
              localStorage.removeItem(key);
            }
          });
        }
        
        console.log('[SIGN OUT] Sign out complete, all storage cleared');
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setInitialized: (initialized) => set({ isInitialized: initialized }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const mergedUser: AuthenticatedUser = { ...currentUser, ...updates };
        const normalizedUser = normalizeUser(mergedUser);
        const currentProfile = get().profile;
        const baseProfile = createProfileFromUser(normalizedUser);
        
        // Map user updates to profile fields
        const profileUpdates: Partial<UserProfile> = {};
        if (updates.name) {
          const nameParts = updates.name.trim().split(/\s+/).filter(Boolean);
          profileUpdates.first_name = nameParts[0];
          profileUpdates.last_name = nameParts.slice(1).join(' ') || undefined;
        }
        if (updates.email) profileUpdates.email = updates.email;
        if (updates.phone) profileUpdates.phone = updates.phone;
        if (updates.location) {
          const locationParts = updates.location.split(',').map(part => part.trim()).filter(Boolean);
          profileUpdates.location_city = locationParts[0];
          profileUpdates.location_region = locationParts.slice(1).join(', ') || undefined;
        }
        
        const updatedProfile: UserProfile = {
          ...baseProfile,
          ...currentProfile,
          ...profileUpdates,
        };

        set({
          user: normalizedUser,
          profile: updatedProfile,
          isAuthenticated: true,
        });
        safeLocalStorageSet(normalizedUser);
      },
    }),
    {
      name: 'nbcon-auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export const getStoredUser = (): AuthenticatedUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored) as AuthenticatedUser;
    return normalizeUser(parsed);
  } catch {
    return null;
  }
};

export const clearStoredUser = (): void => {
  safeLocalStorageSet(null);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('nbcon-auth-storage');
  }
};

export const isAuthenticated = (): boolean => {
  const user = getStoredUser();
  return !!(user && user.isVerified);
};

export const getUserRole = (): string | null => {
  const user = getStoredUser();
  return user?.role || null;
};

export const requiresAuth = (path: string): boolean => {
  const publicPaths = ['/', '/home', '/auth', '/auth/email', '/auth/phone', '/auth/verify', '/auth/role', '/auth/registration/engineer', '/auth/registration/client', '/auth/registration/enterprise', '/auth/profile'];
  return !publicPaths.includes(path);
};

export const initializeAuth = () => {
  const { setUser, setLoading, setInitialized } = useAuthStore.getState();

  const syncFromStorage = () => {
    // First try to get user from the new storage key
    let storedUser = getStoredUser();
    
    // If no user found, try to migrate from the old storage key
    if (!storedUser && typeof window !== 'undefined') {
      const oldUserData = window.localStorage.getItem('nbcon_user');
      if (oldUserData) {
        try {
          const oldUser = JSON.parse(oldUserData);
          if (oldUser && oldUser.isVerified) {
            // Migrate the user to the new storage format
            setUser(oldUser);
            // Clean up old storage
            window.localStorage.removeItem('nbcon_user');
            return;
          }
        } catch (error) {
          console.error('Error migrating old user data:', error);
          window.localStorage.removeItem('nbcon_user');
        }
      }
    }
    
    setUser(storedUser);
    setLoading(false);
    setInitialized(true);
  };

  if (typeof window === 'undefined') {
    syncFromStorage();
    return () => {};
  }

  // Check if we're in the middle of a sign-out process
  const currentState = useAuthStore.getState();
  if (currentState.isInitialized === false && !currentState.user) {
    console.log('[AUTH INIT] Skipping initialization - in sign-out process');
    return () => {};
  }

  setLoading(true);
  console.log('[AUTH INIT] Checking for Supabase session...');
  
  // Check for existing Supabase session first
  supabase.auth.getSession()
    .then(async ({ data: { session } }) => {
      console.log('[AUTH INIT] getSession callback executed, session:', !!session);
      if (session?.user) {
        // Check if this is right after a manual sign-out
        if (typeof window !== 'undefined' && sessionStorage.getItem('manual-signout') === 'true') {
          console.log('[AUTH INIT] Ignoring session - manual sign-out in progress');
          // Clear the flag after a successful auth page load
          sessionStorage.removeItem('manual-signout');
          syncFromStorage();
          return;
        }
        
        // Check if user already exists to prevent race condition
        const currentUser = useAuthStore.getState().user;
        if (currentUser && currentUser.id === session.user.id) {
          console.log('[AUTH INIT] User already exists with same ID, skipping duplicate creation');
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        // User has active Supabase session
        console.log('[AUTH INIT] Found session, fetching role from profile...');
        const userMetadata = session.user.user_metadata;
        
        // Try to get role from user metadata first (set during signup)
        let userRole = userMetadata?.role as 'engineer' | 'client' | 'enterprise' | 'admin' | undefined;
        
        // If no role in metadata, query profile table with timeout
        if (!userRole) {
          try {
            const { data: profile, error } = await Promise.race([
              supabase
                .from('profiles')
                .select('role')
                .eq('user_id', session.user.id)
                .single(),
              new Promise<{ data: null; error: Error }>((_, reject) => 
                setTimeout(() => reject(new Error('Profile query timeout')), 5000)
              )
            ]);
            
            if (!error && profile?.role) {
              userRole = profile.role as 'engineer' | 'client' | 'enterprise' | 'admin';
              console.log('[AUTH INIT] Role fetched from profile:', userRole);
            }
          } catch (error) {
            console.warn('[AUTH INIT] Failed to fetch role from profile, using default:', error);
          }
        }
        
        // Default to 'client' if still no role
        const finalRole = userRole || 'client';
        
        const minimalUser: AuthenticatedUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: userMetadata?.full_name || userMetadata?.name || session.user.email?.split('@')[0] || 'User',
          role: finalRole,
          isVerified: !!session.user.email_confirmed_at,
          location: '',
          phone: userMetadata?.phone || '',
          language: 'en',
          avatar: userMetadata?.avatar_url || userMetadata?.picture || '',
          source: 'supabase'
        };
        
        console.log('[AUTH INIT] Created minimal user with role:', finalRole);
        setUser(minimalUser);
        setLoading(false);
        setInitialized(true);
    } else {
      // No Supabase session, check localStorage
      syncFromStorage();
    }
  })
  .catch((error) => {
    console.error('[AUTH INIT] getSession error:', error);
    syncFromStorage();
  });

  // Listen to Supabase auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('[AUTH LISTENER] Event:', event, 'Has session:', !!session, 'Has user:', !!session?.user);
      
      // Handle INITIAL_SESSION separately - only if we don't already have a user
      if (event === 'INITIAL_SESSION') {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          console.log('[AUTH LISTENER] INITIAL_SESSION: User already exists, skipping');
          return;
        }
        // Fall through to handle like SIGNED_IN if no current user
      }
      
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        // Check if this is right after a manual sign-out
        const manualSignoutFlag = typeof window !== 'undefined' ? sessionStorage.getItem('manual-signout') : null;
        console.log('[AUTH LISTENER] manual-signout flag:', manualSignoutFlag);
        if (manualSignoutFlag === 'true') {
          console.log('[AUTH LISTENER] Ignoring SIGNED_IN event - manual sign-out in progress');
          return;
        }
        
        // Check if user already exists to prevent race condition
        const currentUser = useAuthStore.getState().user;
        if (currentUser && currentUser.id === session.user.id) {
          console.log('[AUTH LISTENER] User already exists with same ID, skipping duplicate creation');
          return;
        }
        
        // User signed in - fetch role from profile
        console.log('[AUTH LISTENER] Processing SIGNED_IN event, fetching role...');
        
        const userMetadata = session.user.user_metadata;
        
        // Try to get role from user metadata first (set during signup)
        let userRole = userMetadata?.role as 'engineer' | 'client' | 'enterprise' | 'admin' | undefined;
        
        // If no role in metadata, query profile table with timeout
        if (!userRole) {
          try {
            const { data: profile, error } = await Promise.race([
              supabase
                .from('profiles')
                .select('role')
                .eq('user_id', session.user.id)
                .single(),
              new Promise<{ data: null; error: Error }>((_, reject) => 
                setTimeout(() => reject(new Error('Profile query timeout')), 5000)
              )
            ]);
            
            if (!error && profile?.role) {
              userRole = profile.role as 'engineer' | 'client' | 'enterprise' | 'admin';
              console.log('[AUTH LISTENER] Role fetched from profile:', userRole);
            }
          } catch (error) {
            console.warn('[AUTH LISTENER] Failed to fetch role from profile, using default:', error);
          }
        }
        
        // Default to 'client' if still no role
        const finalRole = userRole || 'client';
        
        const minimalUser: AuthenticatedUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: userMetadata?.full_name || userMetadata?.name || session.user.email?.split('@')[0] || 'User',
          role: finalRole,
          isVerified: !!session.user.email_confirmed_at,
          location: '',
          phone: userMetadata?.phone || '',
          language: 'en',
          avatar: userMetadata?.avatar_url || userMetadata?.picture || '',
          source: 'supabase'
        };
        
        console.log('[AUTH LISTENER] Created minimal user with role:', finalRole, minimalUser);
        setUser(minimalUser);
      } else if (event === 'SIGNED_OUT') {
        // User signed out - clear all storage and state
        console.log('[AUTH LISTENER] Processing SIGNED_OUT event, clearing all storage...');
        
        // Reset ALL state including isInitialized to prevent race conditions
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true  // Set to true to prevent re-initialization
        });
        
        // Clear ALL storage keys comprehensively
        clearStoredUser();
        safeLocalStorageSet(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nbcon_user');
          localStorage.removeItem('nbcon-auth-storage');
          localStorage.removeItem('theme');
          localStorage.removeItem('language');
          // Clear any other app-specific storage
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('nbcon-') || key.startsWith('auth-')) {
              localStorage.removeItem(key);
            }
          });
        }
        
        console.log('[AUTH LISTENER] SIGNED_OUT complete - all state and storage cleared');
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refreshed - session still valid
        console.log('Session token refreshed');
      } else if (event === 'USER_UPDATED') {
        // User data updated - refresh profile
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile) {
            const user: AuthenticatedUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'User',
              role: profile.role,
              isVerified: !!session.user.email_confirmed_at,
              location: `${profile.location_city || ''}, ${profile.location_region || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || '',
              phone: profile.phone || '',
              language: (profile.preferred_language as 'ar' | 'en') || 'en',
              avatar: profile.avatar_url || '',
              source: 'supabase'
            };
            
            setUser(user);
          }
        }
      }
    }
  );

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      syncFromStorage();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
    subscription.unsubscribe();
  };
};
