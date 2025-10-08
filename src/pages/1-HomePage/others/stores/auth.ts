import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      },

      signOut: async () => {
        get().logout();
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
      onRehydrateStorage: () => (state) => {
        // After rehydration, ensure loading is false if we were already initialized
        if (state?.isInitialized) {
          state.isLoading = false;
        }
      },
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

let isInitializing = false;

export const initializeAuth = () => {
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    console.log('Auth initialization already in progress');
    return () => {};
  }
  
  isInitializing = true;
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

  setLoading(true);
  
  // Safety timeout: if initialization takes longer than 10 seconds, force complete it
  const safetyTimeout = setTimeout(() => {
    console.warn('Auth initialization timed out after 10 seconds, forcing completion');
    const currentState = useAuthStore.getState();
    if (currentState.isLoading || !currentState.isInitialized) {
      syncFromStorage();
    }
  }, 10000);
  
  syncFromStorage();

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      syncFromStorage();
    }
  };

  window.addEventListener('storage', handleStorage);
  
  // Mark initialization as complete after a short delay to ensure all async operations have started
  setTimeout(() => {
    isInitializing = false;
  }, 100);

  return () => {
    clearTimeout(safetyTimeout);
    window.removeEventListener('storage', handleStorage);
    isInitializing = false;
  };
};
